import React from "react";
import { InvestmentPlan } from "@/types";
// a single card to show the plan details
// plan details include
// - plan name
// - plan type [flexible, fixed]
// - Investment Mode [weight, amount]
// - minimum investment amount
// - lock-in period
// - Investment cycle [weekly, monthly, quarterly, yearly]
// - investment period [6 months, 1 year, 2 years]
// - maturity bonus

type PlanCardProps = {
  plan: InvestmentPlan;
  onSubscribe: (planId: string) => void;
};

export default function PlanCard({ plan, onSubscribe }: PlanCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
        {plan.planName}
      </h3>
      <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
        <strong>Type:</strong> {plan.planType}
      </p>
      <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
        <strong>Investment Mode:</strong> {plan.investmentMode}
      </p>
      <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
        <strong>Minimum Investment:</strong> AED {plan.minimumInvestment}
      </p>
      <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
        <strong>Lock-in Period:</strong> {plan.lockinPeriod}
      </p>
      <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
        <strong>Investment Cycle:</strong> {plan.investmentCycle}
      </p>
      <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
        <strong>Investment Period:</strong> {plan.investmentPeriod}
      </p>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        <strong>Maturity Bonus:</strong> {plan.bonusPercentage}
      </p>
      <button
        onClick={() => onSubscribe(plan.$id)}
        className="w-full rounded-lg bg-primary py-2 text-white hover:bg-primary-dark"
      >
        Subscribe Now
      </button>
    </div>
  );
}

