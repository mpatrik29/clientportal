"use client";

import React, { useEffect, useMemo, useState } from "react";
import { account } from "@/app/appwrite";
import { useParams } from "next/navigation";

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

type PaymentDetail = {
  date: string;
  monthlyInvestment: number;
  status: "Pending" | "Completed";
};

type SubscriptionPaymentCardProps = {
  subscriptionId?: string; // Optional prop for flexibility
};

export default function SubscriptionPaymentCard({ subscriptionId }: SubscriptionPaymentCardProps) {
  const params = useParams();
  // Use subscriptionId from prop or from URL params
  const effectiveSubscriptionId = subscriptionId || (params.id as string);
  
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate payment dates based on subscription start date
  const calculatePaymentDates = (startDate: string, cycleInMonths: number = 12): Date[] => {
    if (!startDate) return [];
    const start = new Date(startDate);
    return Array.from({ length: cycleInMonths }, (_, i) => {
      const date = new Date(start);
      date.setMonth(date.getMonth() + i);
      return date;
    });
  };

  // Generate payment details from dates and monthly investment
  const getPaymentDetails = (dates: Date[], monthlyInvestment: number): PaymentDetail[] => {
    const now = new Date();
    return dates.map(date => ({
      date: date.toLocaleDateString(),
      monthlyInvestment,
      status: date < now ? "Completed" : "Pending",
    }));
  };

  // Memoized payment details that only updates when subscription changes
  const paymentDetails = useMemo(() => {
    if (!subscription) return [];
    const dates = calculatePaymentDates(subscription.startDate, subscription.plan.lockinPeriod);
    return getPaymentDetails(dates, subscription.monthlyInvestment);
  }, [subscription]);

  useEffect(() => {
    const fetchSubscriptionDetails = async () => {
      // Ensure we have a subscription ID to fetch
      if (!effectiveSubscriptionId) {
        setError("No subscription ID provided");
        setLoading(false);
        return;
      }

      try {
        const jwt = await account.createJWT();
        const response = await fetch('https://6820639972b7e0ad7171.fra.appwrite.run/subscription/details', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-appwrite-jwt': jwt.jwt
          },
          body: JSON.stringify({ subscriptionId: effectiveSubscriptionId }),
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch subscription details: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Ensure we have a valid subscription in the response
        if (!data) {
          throw new Error("No subscription found");
        }

        const subscriptionDetails = {
          $id: data.$id,
          monthlyInvestment: data.monthlyInvestment,
          isActive: data.isActive,
          startDate: data.$createdAt,
          plan: {
            planName: data.plan.planName,
            planType: data.plan.planType,
            investmentCycle: data.plan.investmentCycle,
            lockinPeriod: data.plan.lockinPeriod,
          },
        };
        
        setSubscription(subscriptionDetails);
      } catch (err: any) {
        console.error("Error fetching subscription details:", err);
        setError(err.message || "Failed to load subscription details.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionDetails();
  }, [effectiveSubscriptionId]);

  if (loading) {
    return <p className="text-center py-4">Loading subscription details...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center py-4">{error}</p>;
  }

  if (!subscription) {
    return <p className="text-center py-4">No subscription found.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {paymentDetails.map((payment, index) => (
        <div key={index} className="card shadow-md rounded-lg p-4 bg-white">
          <div className="card-body">
            <div className="text-right">
              <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                payment.status === "Completed" 
                  ? "bg-green-50 text-green-700 ring-green-600/20" 
                  : "bg-yellow-50 text-yellow-700 ring-yellow-600/20"
              }`}>
                {payment.status}
              </span>
            </div>
            <h2 className="text-lg font-semibold mt-2">₹ {payment.monthlyInvestment}</h2>
            <div className="pt-4">
              <h3 className="text-sm font-semibold text-gray-500">Payment Date</h3>
              <p className="text-gray-800">{payment.date}</p>
            </div>
            <div className="pt-2">
              <h3 className="text-sm font-semibold text-gray-500">Plan</h3>
              <p className="text-gray-800">{subscription.plan.planName}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}