type PropsType = {
    label: string;
    date: string; // Added date prop
    data: {
      liveRate: number;
      openingRate: number;
      closingRate: number;
      yearlyHigh: number;
      yearlyLow: number;
    };
  };
  
  export function GoldRateCard({ label, date, data }: PropsType) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 max-w-md mx-auto">
        {/* Date and title */}
        <div className="text-center mb-6">
          <p className="text-sm text-gray-500 mb-2">{date}</p>
          <h3 className="text-lg font-semibold text-gray-700">{label}</h3>
        </div>
  
        {/* Current rates */}
        <div className="flex justify-center gap-6 mb-8">
          <div className="text-center p-3 rounded-lg bg-yellow-50">
            <div className="text-2xl font-bold text-yellow-600">AED {data.liveRate}</div>
            <div className="text-xs font-medium text-yellow-500 mt-1">per gram</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-yellow-50">
            <div className="text-2xl font-bold text-yellow-600">AED {data.liveRate * 10}</div>
            <div className="text-xs font-medium text-yellow-500 mt-1">per 10g</div>
          </div>
        </div>
  
        {/* Market data */}
        {/* <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 rounded-lg bg-blue-50">
            <div className="text-xl font-bold text-blue-600">{data.openingRate} AED</div>
            <div className="text-xs font-medium text-blue-500 mt-1">Opening Rate</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-green-50">
            <div className="text-xl font-bold text-green-600">{data.closingRate} AED</div>
            <div className="text-xs font-medium text-green-500 mt-1">Closing Rate</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-purple-50">
            <div className="text-xl font-bold text-purple-600">{data.yearlyHigh} AED</div>
            <div className="text-xs font-medium text-purple-500 mt-1">Yearly High</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-red-50">
            <div className="text-xl font-bold text-red-600">{data.yearlyLow} AED</div>
            <div className="text-xs font-medium text-red-500 mt-1">Yearly Low</div>
          </div>
        </div> */}
      </div>
    );
  } 