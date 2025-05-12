'use client';

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
   
    
    <SubscriptionPaymentCard />
   
   
    );
}
