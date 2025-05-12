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

export default function SubscriptionsCards() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const jwt = await account.createJWT();
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
        
        const subscriptionsWithDetails = data.map((subscription: any) => ({
          $id: subscription.$id,
          monthlyInvestment: subscription.monthlyInvestment,
          isActive: subscription.isActive,
          startDate: subscription.$createdAt,
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
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center py-8">{error}</p>;
  }

  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">No subscriptions found</h3>
        <p className="mt-2 text-gray-500">You don't have any active subscriptions yet.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">My Subscriptions</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subscriptions.map((subscription) => (
          <div key={subscription.$id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* Card Header */}
            <div className="p-6 pb-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-gray-900">{subscription.plan.planName}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  subscription.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {subscription.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Started on {new Date(subscription.startDate).toLocaleDateString()}
              </p>
            </div>

            {/* Plan Details */}
            <div className="px-6 pb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500">Investment</p>
                  <p className="text-sm font-semibold">₹{subscription.monthlyInvestment}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Cycle</p>
                  <p className="text-sm font-semibold capitalize">{subscription.plan.investmentCycle}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Plan Type</p>
                  <p className="text-sm font-semibold capitalize">{subscription.plan.planType}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Lock-in Period</p>
                  <p className="text-sm font-semibold">{subscription.plan.lockinPeriod} months</p>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="px-6 pb-6">
              <button
                onClick={() => router.push(`subscriptionDetails/${subscription.$id}`)}
                className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}