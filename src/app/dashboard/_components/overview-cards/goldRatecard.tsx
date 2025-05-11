type PropsType = {
    label: string;
    data: {
        liverate:number;
        openingrate:number;
        closingrate:number;
        yearlyHigh:number;
        yearlyLow:number;
    }
};

export function GoldRateCard({label,data} : PropsType) {
    return (
        <div className="bg-white shadow-md rounded-2xl  max-w-4xl mx-auto">
            <div className="px-6 pt-6 pb-3 text-center">
                <p className="text-md font-normal text-gray-800">Monday, 12 May 2025</p>
                <div className="grid grid-cols-2 gap-4">
                        <h2 className="text-xl font-semibold text-gray-800">AED {data.liverate}/ g</h2>
                        <h2 className="text-xl font-semibold text-gray-800">AED {data.liverate}/ 10g</h2>
                </div>
                <h4 className="text-md font-semibold text-gray-800">{label}</h4>
                <div className="mt-2 space-y-1">    
                </div>
            </div>
            <hr></hr>
            <div className="grid md:grid-cols-4 gap-6 px-6 pb-6 pt-3">
                <div className="text-left">
                    <div className="text-purple-600 font-bold text-md">{data.openingrate} AED</div>
                    <div className="text-purple-600 font-semibold text-xs">Opening Rate</div>
                    
                </div>
                <div className="text-left">
                    <div className="text-purple-600 font-bold text-md">{data.closingrate} AED</div>
                    <div className="text-purple-600 font-semibold text-xs">Closing Rate</div>
                </div>
                <div className="text-left">
                    <div className="text-purple-600 font-bold text-md">{data.yearlyHigh} AED</div>
                    <div className="text-purple-600 font-semibold text-xs">Yearly High</div>
                </div>
                <div className="text-left">
                    <div className="text-purple-600 font-bold text-md">{data.yearlyLow} AED</div>
                    <div className="text-purple-600 font-semibold text-xs">Yearly Low</div>
                </div>
            </div>
        </div>

      );
}