'use client;'

import { PaymentsOverview } from "@/components/Charts/payments-overview";
import { UsedDevices } from "@/components/Charts/used-devices";
import { WeeksProfit } from "@/components/Charts/weeks-profit";
import { TopChannels } from "@/components/Tables/top-channels";
import { TopChannelsSkeleton } from "@/components/Tables/top-channels/skeleton";
import { createTimeFrameExtractor } from "@/utils/timeframe-extractor";
import { Suspense } from "react";
import { ChatsCard } from "./_components/chats-card";
import { OverviewCardsGroup } from "./_components/overview-cards";
import { OverviewCardsSkeleton } from "./_components/overview-cards/skeleton";
import { RegionLabels } from "./_components/region-labels";
import TradingViewWidget from "@/components/Charts/tradingview/TradingViewWidget";
import StatusCards from "@/components/Dashboard/StatusCards";
import SubscriptionsTable from "@/components/subscriptions/SubscriptionsTable";
import WelcomeCard from "./_components/overview-cards/welcomeCard";
import GoldDashboard from "./_components/goldDashboaed";

type PropsType = {
  searchParams: Promise<{
    selected_time_frame?: string;
  }>;
};

export default async function Home({ searchParams }: PropsType) {
  const { selected_time_frame } = await searchParams;
  const extractTimeFrame = createTimeFrameExtractor(selected_time_frame);

  return (
    <>
      <GoldDashboard />
      
      <div className="my-5">
        
       
        <div className="relative w-full ">
          <img
            src="/images/AdvertBanner.png" // Replace with your banner image path
            alt="Dashboard Banner"
            className="w-full h-64 object-cover rounded-lg shadow-lg mb-4"
          />
          
        </div>

      </div>
    </>
  );
}
