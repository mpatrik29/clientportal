"use client";

import React, { useEffect, useState } from "react";
import { databases } from "@/app/appwrite";
import { useRouter, useParams } from "next/navigation";

type Subscription = {
  $id: string;
  monthlyInvestment: number;
  isActive: boolean | null;
  startDate: string;
  plan?: {
    planName?: string;
    planType?: string;
    investmentCycle?: string;
    investmentPeriod?: number;
  };
};

export default function SubscriptionDetailsPage() {
  const params = useParams(); // Use useParams to unwrap params
  const subscriptionId = typeof params.subscriptionId === "string" ? params.subscriptionId : ""; // Ensure subscriptionId is a string
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSubscriptionDetails = async () => {
      try {
        // Fetch subscription details
        const response = await databases.getDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
          process.env.NEXT_PUBLIC_SUBSCRIPTIONS_COLLECTION_ID!,
          subscriptionId || ""
        );

        setSubscription({
          $id: response.$id,
          monthlyInvestment: response.monthlyInvestment || 0,
          isActive: response.isActive || false,
          startDate: response.$createdAt || "N/A",
          plan: response.plan || {
            planName: "N/A",
            planType: "N/A",
            investmentCycle: "N/A",
            investmentPeriod: 0,
          },
        });
      } catch (err) {
        console.error("Error fetching subscription details:", err);
        setError("Failed to load subscription details.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionDetails();
  }, [subscriptionId]);

  if (loading) {
    return <p>Loading subscription details...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!subscription) {
    return <p>Subscription not found.</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-2xl font-bold">Subscription Details</h1>

      {/* Full-Width Card */}
      <div className="mb-6 w-full rounded-lg border border-gray-200 bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">{subscription.plan?.planName || "N/A"}</h2>
        <p className="mb-2">
          <strong>Plan Type:</strong> {subscription.plan?.planType || "N/A"}
        </p>
        <p className="mb-2">
          <strong>Investment Cycle:</strong> {subscription.plan?.investmentCycle || "N/A"}
        </p>
        <p className="mb-2">
          <strong>Investment Period:</strong> {subscription.plan?.investmentPeriod || 0} months
        </p>
        <p className="mb-2">
          <strong>Monthly Investment:</strong> ₹{subscription.monthlyInvestment}
        </p>
        <p className="mb-2">
          <strong>Status:</strong> {subscription.isActive ? "Active" : "Inactive"}
        </p>
        <p className="mb-2">
          <strong>Start Date:</strong>{" "}
          {subscription.startDate !== "N/A"
            ? new Date(subscription.startDate).toLocaleDateString()
            : "N/A"}
        </p>
      </div>

      <button
        onClick={() => router.push("/subscriptions")}
        className="mt-6 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
      >
        Back to Subscriptions
      </button>
    </div>
  );
}