"use client";

import React, { useEffect, useState } from "react";
import { account } from "@/app/appwrite";
import { useRouter } from "next/navigation";

type Subscription = {
  $id: string;
  monthlyInvestment: number;
  isActive: boolean | null;
  startDate: string;
  plan: {
    planName: string;
    planType: string;
    investmentCycle: string;
    lockinPeriod: number;
  };
};

export default function SubscriptionsTable() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        // Get JWT token for authentication
        const jwt = await account.createJWT();
        
        // Call your Appwrite function endpoint
        const response = await fetch('https://6820639972b7e0ad7171.fra.appwrite.run/subscription', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-appwrite-jwt': jwt.jwt
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch subscriptions: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Map through subscriptions and extract key details
        const subscriptionsWithDetails = data.map((subscription: any) => ({
          $id: subscription.$id,
          monthlyInvestment: subscription.monthlyInvestment,
          isActive: subscription.isActive,
          startDate: subscription.$createdAt, // Use the creation date as the start date
          plan: {
            planName: subscription.plan.planName,
            planType: subscription.plan.planType,
            investmentCycle: subscription.plan.investmentCycle,
            lockinPeriod: subscription.plan.lockinPeriod,
          },
        }));

        setSubscriptions(subscriptionsWithDetails);
      } catch (err: any) {
        console.error("Error fetching subscriptions:", err);
        setError(err.message || "Failed to load subscriptions.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  if (loading) {
    return <p>Loading subscriptions...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (subscriptions.length === 0) {
    return <p>No subscriptions found.</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-2xl font-bold">My Subscriptions</h1>
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-200 px-4 py-2 text-left">Plan Name</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Plan Type</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Investment Cycle</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Lock-in Period</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Monthly Investment</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Start Date</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Status</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map((subscription) => (
            <tr key={subscription.$id} className="hover:bg-gray-50">
              <td className="border border-gray-200 px-4 py-2">{subscription.plan.planName}</td>
              <td className="border border-gray-200 px-4 py-2">{subscription.plan.planType}</td>
              <td className="border border-gray-200 px-4 py-2">{subscription.plan.investmentCycle}</td>
              <td className="border border-gray-200 px-4 py-2">{subscription.plan.lockinPeriod} months</td>
              <td className="border border-gray-200 px-4 py-2">₹{subscription.monthlyInvestment}</td>
              <td className="border border-gray-200 px-4 py-2">
                {new Date(subscription.startDate).toLocaleDateString()}
              </td>
              <td className="border border-gray-200 px-4 py-2">
                {subscription.isActive ? "Active" : "Inactive"}
              </td>
              <td className="border border-gray-200 px-4 py-2">
                <button
                  onClick={() => router.push(`subscriptionDetails/${subscription.$id}`)}
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}