"use client";

import React, { useEffect, useMemo, useState } from "react";
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

type PaymentDetail = {
  date: string;
  monthlyInvestment: number;
  status: "Pending" | "Completed";
};

export default function SubscriptionPaymentCard() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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

  // Memoized payment details that only updates when subscriptions change
  const paymentDetails = useMemo(() => {
    if (subscriptions.length === 0) return [];
    const subscription = subscriptions[0];
    const dates = calculatePaymentDates(subscription.startDate, subscription.plan.lockinPeriod);
    return getPaymentDetails(dates, subscription.monthlyInvestment);
  }, [subscriptions]);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const jwt = await account.createJWT();
        const response = await fetch('https://6820639972b7e0ad7171.fra.appwrite.run/subscription', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-appwrite-jwt': jwt.jwt
          },
          credentials: 'include'
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
    return <p className="text-center py-4">Loading subscriptions...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center py-4">{error}</p>;
  }

  if (subscriptions.length === 0) {
    return <p className="text-center py-4">No subscriptions found.</p>;
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
            <h2 className="text-lg font-semibold mt-2">AED {payment.monthlyInvestment}</h2>
            <div className="pt-4">
              <h3 className="text-sm font-semibold text-gray-500">Payment Date</h3>
              <p className="text-gray-800">{payment.date}</p>
            </div>
            <div className="pt-2">
              <h3 className="text-sm font-semibold text-gray-500">Plan</h3>
              <p className="text-gray-800">{subscriptions[0].plan.planName}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}