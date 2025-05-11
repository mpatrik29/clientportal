"use client";

import React, { useEffect, useState } from "react";
import PlanCard from "./PlanCard";
import Modal from "@/components/ui/modal";
import { databases } from "@/app/appwrite";
import { Models } from "appwrite";

// Define the interface for your investment plan
interface InvestmentPlan {
  $id: string;
  planName: string;
  planType: string;
  investmentMode: string;
  minimumInvestment: number;
  lockinPeriod: number;
  investmentCycle: string;
  investmentPeriod: number;
  bonusPercentage: number;
  // Add any other fields that exist in your documents
}

export default function PlansList() {
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
          process.env.NEXT_PUBLIC_PLANS_COLLECTION_ID!
        );

        // Type assertion that the documents match our InvestmentPlan interface
        const fetchedPlans = response.documents as unknown as InvestmentPlan[];
        setPlans(fetchedPlans);
      } catch (error) {
        console.error("Error fetching plans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSubscribe = (plan: InvestmentPlan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  if (loading) {
    return <div className="text-center py-8">Loading plans...</div>;
  }

  if (plans.length === 0) {
    return <div className="text-center py-8">No plans available.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard
            key={plan.$id}
            plan={plan}
            onSubscribe={() => handleSubscribe(plan)}
          />
        ))}
      </div>

      {selectedPlan && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          plan={selectedPlan}
        />
      )}
    </div>
  );
}