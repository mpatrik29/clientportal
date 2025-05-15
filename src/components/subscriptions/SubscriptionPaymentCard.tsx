"use client";

import React, { useEffect, useMemo, useState } from "react";
import { account } from "@/app/appwrite";
import { useParams } from "next/navigation";

type Plan = {
  planName: string;
  planType: string;
  investmentMode: "by_amount" | "by_weight" | string;
  minimumInvestment: number;
  lockinPeriod: number;
  investmentCycle: string;
  investmentPeriod: string;
  bonusPercentage: number;
  planDescription: string | null;
};

type Subscription = {
  $id: string;
  monthlyInvestment: number;
  isActive: boolean;
  startDate: string;
  plan: Plan;
};

type PaymentDetail = {
  date: string;
  creditedGold: number;
  status: boolean;
};

type SubscriptionPaymentCardProps = {
  subscriptionId?: string;
};

export default function SubscriptionPaymentCard({ subscriptionId }: SubscriptionPaymentCardProps) {
  const params = useParams();
  const effectiveSubscriptionId = subscriptionId || (params.id as string);
  
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentDetailsArray, setPaymentDetailsArray] = useState<PaymentDetail[]>([]);
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


  const makePayment = async (monthlyInvestment: number,planId: string) => {
    try {
      alert("Payment processing for monthly investment of " + monthlyInvestment);
    }catch (error) {
      console.error("Error making payment:", error);  
    }
  };

  // // Generate payment details from dates and monthly investment
  // const getPaymentDetails = (dates: Date[], monthlyInvestment: number): PaymentDetail[] => {
  //   const now = new Date();
  //   return dates.map(date => ({
  //     date: date.toLocaleDateString(),
  //     monthlyInvestment,
  //     status: date < now ? "Completed" : "Pending",
  //   }));
  // };

  // Memoized payment details that only updates when subscription changes
  // const paymentDetails = useMemo(() => {
  //   if (!subscription) return [];
  //   const dates = calculatePaymentDates(
  //     subscription.startDate, 
  //     Number(subscription.plan.investmentPeriod) || 12
  //   );
  //   return getPaymentDetails(dates, subscription.monthlyInvestment);
  // }, [subscription]);

  // Format monthly investment based on investment mode
  const formatMonthlyInvestment = (investment: number, mode?: string) => {
    switch(mode) {
      case "by_amount":
        return `AED ${investment.toLocaleString()}`;
      case "by_weight":
        return `${investment} g`;
      default:
        return investment.toString();
    }
  };

  useEffect(() => {
    const fetchSubscriptionDetails = async () => {
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
        
        if (!data) {
          throw new Error("No subscription found");
        }

        const subscriptionDetails: Subscription = {
          $id: data.$id,
          monthlyInvestment: data.monthlyInvestment,
          isActive: data.isActive,
          startDate: data.$createdAt,
          plan: {
            planName: data.plan.planName,
            planType: data.plan.planType,
            investmentMode: data.plan.investmentMode,
            minimumInvestment: data.plan.minimumInvestment,
            lockinPeriod: data.plan.lockinPeriod,
            investmentCycle: data.plan.investmentCycle,
            investmentPeriod: data.plan.investmentPeriod,
            bonusPercentage: data.plan.bonusPercentage,
            planDescription: data.plan.planDescription
          }
        };
        
        setSubscription(subscriptionDetails);
      
        console.log("Payment docs:", data.documents);
        console.log("total:", data.total);

        try {
          if (data.documents) {
            const paymentDetails = data.documents.map((payment: any) => ({
              date: payment.date,  // Changed from paymentDetails.date to payment.date
              creditedGold: payment.creditedGold,
              status: payment.status
            }));
            setPaymentDetailsArray(prev => [...prev, ...paymentDetails]);
            console.log("Payment details:", paymentDetailsArray);
          }
        } catch (error) {
          console.error("Error fetching payment details:", error);
        }
        


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
    <>
      <div className="card shadow-sm bg-white rounded-lg p-3">
        <div className="card-body p-4">
          <div className="grid grid-cols-3 gap-6">
            <p>
              <strong>Plan Name:</strong> {subscription.plan.planName}
            </p>
            <p>
              <strong>Plan Type:</strong> {subscription.plan.planType}
            </p>
            <p>
              <strong>Investment Cycle:</strong> {subscription.plan.investmentCycle}
            </p>
            <p>
              <strong>Investment Period:</strong> {subscription.plan.investmentPeriod} months
            </p>
            <p>
              <strong>Monthly Investment:</strong> {formatMonthlyInvestment(
                subscription.monthlyInvestment, 
                subscription.plan.investmentMode
              )}
            </p>
            <p>
              <strong>Lock-in Period:</strong> {subscription.plan.lockinPeriod} months
            </p>
            <p>
              <strong>Minimum Investment:</strong> {formatMonthlyInvestment(
                subscription.plan.minimumInvestment, 
                subscription.plan.investmentMode
              )}
            </p>
            <p>
              <strong>Bonus Percentage:</strong> {subscription.plan.bonusPercentage}%
            </p>
            <p>
              <strong>Status:</strong> {subscription.isActive ? "Active" : "Inactive"}
            </p>
          </div>
        </div>
      </div>
      <div className="pt-6">
        <div className="card bg-white rounded-lg shadow-sm p-3">
          <div className="card-header">
            <h2 className="text-lg font-semibold">Payment History</h2>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {paymentDetailsArray.map((payment, index) => (
                <div key={index} className="card shadow-md rounded-lg p-4 bg-white">
                  <div className="card-body">
                    <div className="text-right">
                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                        payment.status === true
                        ? "bg-green-50 text-green-700 ring-green-600/20" 
                        : "bg-yellow-50 text-yellow-700 ring-yellow-600/20"
                      }`}>
                        {payment.status === true ? "Completed" : "Pending"}
                      </span>
                    </div>
                    <h2 className="text-lg font-semibold mt-2">
                      {payment.creditedGold}g
                    </h2>
                    <div className="pt-4">
                      <h3 className="text-sm font-semibold text-gray-500">Payment Date</h3>
                      <p className="text-gray-800">{payment.date}</p>
                    </div>
                    <div className="pt-2">
                      <h3 className="text-sm font-semibold text-gray-500">Plan</h3>
                      <p className="text-gray-800">{subscription.plan.planName}</p>
                    </div>
                    <button
                        onClick={() => makePayment(subscription.monthlyInvestment, subscription.plan.$id)}
                        className="w-full rounded-lg bg-primary py-3 font-medium text-white transition-all hover:from-blue-700 hover:to-blue-600 hover:shadow-md"
                      >
                        Make Payment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}