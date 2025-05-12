type PropsType = {
    label: string;
    data: {
      total: number;
      matured: number;
      unMatured: number;
    };
  };
  
  export function AvailableAssetsCard({ label, data }: PropsType) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 max-w-md mx-auto">
        {/* Header section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{data.total}g</h2>
          <h4 className="text-lg font-medium text-gray-600">{label}</h4>
        </div>
        
        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Matured */}
          <div className="text-center p-3 rounded-lg bg-green-50">
            <div className="text-3xl font-bold text-green-600">{data.matured}g</div>
            <div className="text-sm font-medium text-green-500 mt-1">Matured Investment</div>
          </div>
          
          {/* Unmatured */}
          <div className="text-center p-3 rounded-lg bg-blue-50">
            <div className="text-3xl font-bold text-blue-600">{data.unMatured}g</div>
            <div className="text-sm font-medium text-blue-500 mt-1">Unmatured Investment</div>
          </div>
        </div>
      </div>
    );
  }