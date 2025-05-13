import React from "react";
import { InvestmentPlan } from "@/types";

type PlanCardProps = {
  plan: InvestmentPlan;
  onSubscribe: (planId: string) => void;
};

export default function PlanCard({ plan, onSubscribe }: PlanCardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md">
      {/* Plan type badge */}
      <div className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-medium ${
        plan.planType === 'fixed' 
          ? 'bg-blue-100 text-blue-800' 
          : 'bg-purple-100 text-purple-800'
      }`}>
        {plan.planType}
      </div>

      {/* Card content */}
      <div className="p-6">
        <h3 className="mb-3 text-xl font-bold text-gray-900">
          {plan.planName}
        </h3>
        
        {/* Plan details grid */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-gray-500">Investment Mode</p>
            <p className="text-sm font-semibold capitalize">{plan.investmentMode.replace('_', ' ')}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Min. Investment</p>
            <p className="text-sm font-semibold">AED {plan.minimumInvestment}</p>
          </div>
          {/* <div>
            <p className="text-xs font-medium text-gray-500">Lock-in Period</p>
            <p className="text-sm font-semibold">{plan.lockinPeriod} months</p>
          </div> */}
          <div>
            <p className="text-xs font-medium text-gray-500">Cycle</p>
            <p className="text-sm font-semibold capitalize">{plan.investmentCycle}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Duration</p>
            <p className="text-sm font-semibold">{plan.investmentPeriod === 0 ? 'Flexible' : `${plan.investmentPeriod} months`}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Bonus</p>
            <p className="text-sm font-semibold">{plan.bonusPercentage}%</p>
          </div>
        </div>

        {/* Subscribe button */}
        <button
          onClick={() => onSubscribe(plan.$id)}
          className="w-full rounded-lg bg-primary py-3 font-medium text-white transition-all hover:from-blue-700 hover:to-blue-600 hover:shadow-md"
        >
          Subscribe Now
        </button>
      </div>
    </div>
  );
}