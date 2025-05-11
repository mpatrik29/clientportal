type PropsType = {
    label: string;
    data: {
        total: number;
        active: number;
        completed: number;
        flexi: number;
    }
};

export function ActiveSubscriptionsCard({label,data} : PropsType) {
    return (
        <div className="bg-white shadow-md rounded-2xl  max-w-4xl mx-auto">
            <div className="px-6 pt-6 pb-3">
                <h2 className="text-xl font-semibold text-gray-800">{data.total}</h2>
                <h4 className="text-md font-semibold text-gray-800">{label}</h4>
                <div className="mt-2 space-y-1">    
                </div>
            </div>
            <hr></hr>
            <div className="grid md:grid-cols-4 gap-6 px-6 pb-6 pt-3">
                <div className="text-left">
                    <div className="text-purple-600 font-bold text-lg">{data.active}</div>
                    <div className="text-purple-600 font-bold text-sm">Active</div>
                    
                </div>
                <div className="text-left">
                    <div className="text-purple-600 font-bold text-lg">{data.completed}</div>
                    <div className="text-purple-600 font-bold text-sm">Completed</div>
                </div>
                <div className="text-left">
                    <div className="text-purple-600 font-bold text-lg">{data.flexi}</div>
                    <div className="text-purple-600 font-bold text-sm">Flexi</div>
                </div>
            </div>
        </div>

      );
}