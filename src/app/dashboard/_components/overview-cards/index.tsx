import { compactFormat } from "@/lib/format-number";
import { getOverviewData } from "../../fetch";
import { OverviewCard } from "./card";
import * as icons from "./icons";
import { ActiveSubscriptionsCard } from "./activeSubscriptionCard";
import { AvailableAssetscard } from "./availableAssetsCard";
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
     
     <AvailableAssetscard label={"My Subscriptions"} data={{
        total: 6,
        matured: 2,
        unMatured: 4,
      }}/>

      <GoldRateCard label={"Gold Rate"} data={{
        liverate: 250,
        openingrate: 200,
        closingrate: 300,
        yearlyHigh: 400,
        yearlyLow: 100,
      }}/>s
  

      
    </div>
  );
}
