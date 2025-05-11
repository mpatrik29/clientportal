type PropsType = {
    label: string;
    data: {
        total:number;
        matured:number;
        unMatured:number;
    }
};

export function AvailableAssetscard({label,data} : PropsType) {
    return (
        <div className="bg-white shadow-md rounded-2xl  max-w-4xl mx-auto">
            <div className="px-6 pt-6 pb-3">
                <h2 className="text-xl font-semibold text-gray-800">{data.total}g</h2>
                <h4 className="text-md font-semibold text-gray-800">{label}</h4>
                <div className="mt-2 space-y-1">    
                </div>
            </div>
            <hr></hr>
            <div className="grid md:grid-cols-4 gap-6 px-6 pb-6 pt-3">
                <div className="text-left">
                    <div className="text-purple-600 font-bold text-lg">{data.matured}g</div>
                    <div className="text-purple-600 font-bold text-sm">Matured Investment</div>
                    
                </div>
                <div className="text-left">
                    <div className="text-purple-600 font-bold text-lg">{data.unMatured}g</div>
                    <div className="text-purple-600 font-bold text-sm">Unmaturd Investment</div>
                </div>
            </div>
        </div>

      );
}