"use client";

import React, { useState, useEffect } from "react";
import { account } from "@/app/appwrite";

type Plan = {
  $id: string;
  planName: string;
  planType: string;
  investmentCycle: string;
  lockinPeriod: number;
  minimumInvestment?: number;
};

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan;
};

export default function SubscriptionModal({ isOpen, onClose, plan }: ModalProps) {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(plan.minimumInvestment || 0);
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Get JWT token for authentication
      const jwt = await account.createJWT();
      
      // Make API call to subscribe endpoint
      const response = await fetch('https://6828d8457d8a35bc7801.aw-functions.ip-ddns.comn/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-appwrite-jwt': jwt.jwt
        },
        body: JSON.stringify({
          planId: plan.$id,
          monthlyInvestment,
        })
      });

      if (!response.ok) {
        throw new Error(await response.text() || 'Failed to create subscription');
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1500);
    } catch (err) {
      console.error("Subscription error:", err);
      setError(
        err instanceof Error 
          ? err.message 
          : "Failed to create subscription. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900">Subscribe to {plan.planName}</h2>
          <p className="mt-1 text-sm text-gray-500">Fixed Flexi Investment Plan</p>
        </div>

        {/* Plan Details */}
        <div className="space-y-4 p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Plan Type</p>
              <p className="text-sm font-semibold capitalize">{plan.planType}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Investment Cycle</p>
              <p className="text-sm font-semibold capitalize">{plan.investmentCycle}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Lock-in Period</p>
              <p className="text-sm font-semibold">{plan.lockinPeriod} months</p>
            </div>
            {plan.minimumInvestment && (
              <div>
                <p className="text-sm font-medium text-gray-500">Min. Investment</p>
                <p className="text-sm font-semibold">₹{plan.minimumInvestment}</p>
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Investment Amount (₹)
              </label>
              <input
                type="number"
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
                min={plan.minimumInvestment || 0}
                step="100"
              />
            </div>

            <div className="flex items-start">
              <div className="flex h-5 items-center">
                <input
                  type="checkbox"
                  checked={confirm}
                  onChange={(e) => setConfirm(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="ml-3 text-sm">
                <label className="font-medium text-gray-700">
                  I confirm the subscription details
                </label>
                <p className="text-gray-500">By confirming, you agree to the terms of this investment plan</p>
              </div>
            </div>

            {/* Status messages */}
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            )}
            {success && (
              <div className="rounded-md bg-green-50 p-4">
                <p className="text-sm font-medium text-green-800">
                  Subscription created successfully!
                </p>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading || !confirm || monthlyInvestment < (plan.minimumInvestment || 0)}
            className={`rounded-md px-4 py-2 text-sm font-medium text-white ${
              loading ? 'bg-indigo-400' : 'bg-primary hover:bg-indigo-700'
            }`}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : 'Subscribe'}
          </button>
        </div>
      </div>
    </div>
  );
}