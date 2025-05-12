import { compactFormat } from "@/lib/format-number";
import { getOverviewData } from "../../fetch";
import { OverviewCard } from "./card";
import * as icons from "./icons";
import { ActiveSubscriptionsCard } from "./activeSubscriptionCard";
import { AvailableAssetsCard } from "./availableAssetsCard";
import { GoldRateCard } from "./goldRatecard";

export async function OverviewCardsGroup() {
  const { views, profit, products, users } = await getOverviewData();

  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3 2xl:gap-7.5">
     
     <ActiveSubscriptionsCard label={"My Subscriptions"} data={{
        total: 6,
        active: 2,
        completed: 4,
        flexi:0
      }}/>
     
     <AvailableAssetsCard 
        label="My Subscriptions"
        data={{
          total: 6,
          matured: 2,
          unMatured: 4
        }}
      />
      <GoldRateCard 
        label="Gold Rate"
        date="Monday, 12 May 2025"
        data={{
          liveRate: 250,
          openingRate: 200,
          closingRate: 300,
          yearlyHigh: 400,
          yearlyLow: 100
        }}
      />


      
    </div>
  );
}
