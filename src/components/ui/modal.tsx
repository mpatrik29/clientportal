"use client";

import React, { useState, useEffect } from "react";
import { databases, account } from "@/app/appwrite";

type Plan = {
  $id: string;
  planName: string;
  planType: string;
  investmentCycle: string;
  lockinPeriod: number;
};

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan;
};

export default function Modal({ isOpen, onClose, plan }: ModalProps) {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number | "">("");
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Get the userDocId from localStorage
      const [userId, setUserId] = useState<string | null>(null);

      useEffect(() => {
        // Fetch the userId from localStorage when the component mounts
        const storedUserId = localStorage.getItem("userId");
        setUserId(storedUserId);
      }, []);
      if (!userId) {
        throw new Error("User document ID not found in localStorage.");
      }

      // Create a new subscription document
      await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
        process.env.NEXT_PUBLIC_SUBSCRIPTIONS_COLLECTION_ID!,
        "unique()", // Generate a unique ID for the subscription
        {
          userId: userId, // Use the userDocId from localStorage
          plan: plan.$id,
          monthlyInvestment: monthlyInvestment,
          isActive: true,
        }
      );

      alert("Subscription created successfully!");
      onClose(); // Close the modal after successful submission
    } catch (err) {
      console.error("Error creating subscription:", err);
      setError("Failed to create subscription. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold">Subscribe to {plan.planName}</h2>
        <p className="mb-2 text-sm">
          <strong>Plan Type:</strong> {plan.planType}
        </p>
        <p className="mb-2 text-sm">
          <strong>Investment Cycle:</strong> {plan.investmentCycle}
        </p>
        <p className="mb-4 text-sm">
          <strong>Lock-in Period:</strong> {plan.lockinPeriod} months
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Monthly Investment Amount
            </label>
            <input
              type="number"
              value={monthlyInvestment}
              onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
              className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              checked={confirm}
              onChange={(e) => setConfirm(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              required
            />
            <label className="ml-2 text-sm text-gray-700">
              I confirm the subscription details.
            </label>
          </div>

          {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 rounded-md bg-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !confirm}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Subscribe"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}