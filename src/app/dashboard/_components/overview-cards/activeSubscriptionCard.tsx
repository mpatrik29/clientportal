type PropsType = {
    label: string;
    data: {
      total: number;
      active: number;
      completed: number;
      flexi: number;
    };
  };
  
  export function ActiveSubscriptionsCard({ label, data }: PropsType) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 max-w-md mx-auto">
        {/* Header section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{data.total}</h2>
          <h4 className="text-lg font-medium text-gray-600">{label}</h4>
        </div>
        
        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-4">
          {/* Active */}
          <div className="text-center p-3 rounded-lg bg-blue-50">
            <div className="text-3xl font-bold text-blue-600">{data.active}</div>
            <div className="text-sm font-medium text-blue-500 mt-1">Active</div>
          </div>
          
          {/* Completed */}
          <div className="text-center p-3 rounded-lg bg-green-50">
            <div className="text-3xl font-bold text-green-600">{data.completed}</div>
            <div className="text-sm font-medium text-green-500 mt-1">Completed</div>
          </div>
          
          {/* Flexi */}
          <div className="text-center p-3 rounded-lg bg-purple-50">
            <div className="text-3xl font-bold text-purple-600">{data.flexi}</div>
            <div className="text-sm font-medium text-purple-500 mt-1">Flexi</div>
          </div>
        </div>
      </div>
    );
  }