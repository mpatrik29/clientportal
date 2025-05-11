"use client";

import React, { useEffect, useState } from "react";
import PlanCard from "./PlanCard";
import Modal from "@/components/ui/modal"; // Import the Modal component
import { databases } from "@/app/appwrite";

export default function PlansList() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
          process.env.NEXT_PUBLIC_PLANS_COLLECTION_ID!
        );
        console.log(response);
        setPlans(response.documents);
      } catch (error) {
        console.error("Error fetching plans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSubscribe = (plan: any) => {
    setSelectedPlan(plan); // Set the selected plan
    setIsModalOpen(true); // Open the modal
  };

  if (loading) {
    return <p>Loading plans...</p>;
  }

  if (plans.length === 0) {
    return <p>No plans available.</p>;
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard
            key={plan.$id}
            plan={plan}
            onSubscribe={() => handleSubscribe(plan)} // Pass the plan to the handler
          />
        ))}
      </div>

      {/* Modal Component */}
      {selectedPlan && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)} // Close the modal
          plan={selectedPlan} // Pass the selected plan to the modal
        />
      )}
    </div>
  );
}