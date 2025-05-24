import TransactionsTable from "@/components/transactions/dtable";
import { createTimeFrameExtractor } from "@/utils/timeframe-extractor";


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
      
      <div className="">
        
        <TransactionsTable />
       
      </div>
    </>
  );
}
