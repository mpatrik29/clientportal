'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { account } from '@/app/appwrite';

const paymentStatusOptions = [
    { value: 'success', label: 'Success' },
    { value: 'failed', label: 'Failed' },
    { value: 'pending', label: 'Pending' }
];

const paymentMethodOptions = [
    { value: 'card', label: 'Card' },
    { value: 'wallet', label: 'Wallet' },
    { value: 'bank', label: 'Bank Transfer' }
];

type Pagination = {
    total: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextCursor: string | null;
    prevCursor: string | null;
    currentCursor: string | null;
};


const TransactionsTable = () => {
    const [transactions, setTransactions] = useState([]);
    const [pagination, setPagination] = useState<Pagination>({

        total: 0,
        limit: 10,
        hasNextPage: false,
        hasPrevPage: false,
        nextCursor: null,
        prevCursor: null,
        currentCursor: null
    });
    const [filters, setFilters] = useState({
        paymentStatus: null,
        paymentMethod: null,
        orderType: 'desc',
        limit: 10,
        cursor: null
    });
    const [loading, setLoading] = useState(false);

    const fetchTransactions = async (cursor: string | null = null): Promise<void> => {
        setLoading(true);
        try {
            const jwt = await account.createJWT(); // Ensure you have account instance

            const payload = {
                ...filters,
                cursor
            };

            const res = await fetch('http://68319117000d7a40def3.aw.pure24.co/gettransactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-appwrite-jwt': jwt.jwt
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                throw new Error(`API error: ${res.status}`);
            }

            const result = await res.json();
            
            console.log('response on call:', typeof(res));
            console.log(res);

            console.log('Result await jsom: ', typeof(result));
            console.log(result);

            setTransactions(result.transactions);
            setPagination(result.pagination);
        } catch (err) {
            console.error('Error fetching transactions:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [filters.paymentStatus, filters.paymentMethod, filters.orderType]);

    const handlePrev = () => {
        if (pagination.prevCursor) {
            fetchTransactions(pagination.prevCursor);
        }
    };

    const handleNext = () => {
        if (pagination.nextCursor) {
            fetchTransactions(pagination.nextCursor);
        }
    };

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Transactions</h2>

            <div className="flex gap-4 mb-4">
                <Select
                    options={paymentStatusOptions}
                    isClearable
                    placeholder="Filter by Status"
                    onChange={(opt: { value: any; }) =>
                        setFilters((prev) => ({ ...prev, paymentStatus: opt?.value || null }))
                    }
                />
                <Select
                    options={paymentMethodOptions}
                    isClearable
                    placeholder="Filter by Method"
                    onChange={(opt: { value: any; }) =>
                        setFilters((prev) => ({ ...prev, paymentMethod: opt?.value || null }))
                    }
                />
            </div>

            {loading ? (
                <p>Loading transactions...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border text-sm text-left">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 border">ID</th>
                                <th className="px-4 py-2 border">Amount</th>
                                <th className="px-4 py-2 border">Method</th>
                                <th className="px-4 py-2 border">Status</th>
                                <th className="px-4 py-2 border">Reference</th>
                                <th className="px-4 py-2 border">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((tx) => (
                                <tr key={tx.id}>
                                    <td className="px-4 py-2 border">{tx.id}</td>
                                    <td className="px-4 py-2 border">₹{tx.amount}</td>
                                    <td className="px-4 py-2 border">{tx.method}</td>
                                    <td className="px-4 py-2 border">{tx.status}</td>
                                    <td className="px-4 py-2 border">{tx.reference}</td>
                                    <td className="px-4 py-2 border">{new Date(tx.timestamp).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="flex justify-between mt-4">
                <button
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={handlePrev}
                    disabled={!pagination.hasPrevPage}
                >
                    Prev
                </button>
                <button
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={handleNext}
                    disabled={!pagination.hasNextPage}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default TransactionsTable;
