import { PaymentsOverview } from "@/components/Charts/payments-overview";
import { UsedDevices } from "@/components/Charts/used-devices";
import { WeeksProfit } from "@/components/Charts/weeks-profit";
import PlansList from "@/components/plans/PlansList";
import SubscriptionPaymentCard from "@/components/subscriptions/SubscriptionPaymentCard";
import SubscriptionsTable from "@/components/subscriptions/SubscriptionsTable";
import { TopChannels } from "@/components/Tables/top-channels";
import { TopChannelsSkeleton } from "@/components/Tables/top-channels/skeleton";
import { createTimeFrameExtractor } from "@/utils/timeframe-extractor";
import { useParams } from "next/navigation";
import { Suspense } from "react";



export default async function Home() {
  const params = useParams();
  const subscriptionId = params.id as string;
  
  return (
    <>
    <div className="card shadow-sm bg-white rounded-lg p-3">
        
        <div className="card-body p-4">
        <div className="grid grid-cols-3 gap-6">
            <p>
            <strong>Plan Name:</strong> Plan Name
            </p>
            <p>
            <strong>Plan Type:</strong> Plan Type
            </p>
            <p>
            <strong>Investment Cycle:</strong> Plan Cycle
            </p>
            <p>
            <strong>Investment Period:</strong> Investment Duration months
            </p>
            <p>
            <strong>Monthly Investment:</strong> AED 1250
            </p>
            <p>
            <strong>Lock-in Period:</strong> 5 months
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
                
                    <SubscriptionPaymentCard />
                    
                    
                
            </div>
        </div>
    </div>

    </>
    );
}
