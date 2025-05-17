export default function StatusCards() {
    return (
      <div className="p-6 bg-gray-50">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">My Subscriptions</h1>
          <div className="text-sm text-gray-500">Monday, 13  May 2025</div>
        </div>
  
        {/* Subscription Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Active Subscriptions */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="text-gray-500 text-sm">Active</div>
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" strokeLinejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold mt-2">2</div>
            <div className="text-xs text-gray-400 mt-1">Currently active plans</div>
          </div>
  
          {/* Completed Subscriptions */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="text-gray-500 text-sm">Completed</div>
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" strokeLinejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold mt-2">4</div>
            <div className="text-xs text-gray-400 mt-1">Matured investments</div>
          </div>
  
          {/* Flexi Subscriptions */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="text-gray-500 text-sm">Flexi</div>
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" strokeLinejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold mt-2">0</div>
            <div className="text-xs text-gray-400 mt-1">Flexible plans</div>
          </div>
        </div>
  
        {/* Investment Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Total Investment */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="text-gray-500 text-sm">Total Investment</div>
              <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" strokeLinejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <div className="flex justify-between items-end mt-4">
              <div>
                <div className="text-2xl font-bold">69g</div>
                <div className="text-xs text-gray-400 mt-1">Total gold weight</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Matured/Unmatured</div>
                <div className="text-lg font-semibold">29g / 40g</div>
              </div>
            </div>
          </div>
  
          {/* Gold Rate */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="text-gray-500 text-sm">Gold Rate</div>
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" strokeLinejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <div className="text-lg font-semibold">AED 250/g</div>
                <div className="text-xs text-gray-400">Current rate</div>
              </div>
              <div>
                <div className="text-lg font-semibold">AED 250/10g</div>
                <div className="text-xs text-gray-400">Bulk rate</div>
              </div>
            </div>
          </div>
        </div>
  
        {/* Market Data Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Opening Rate */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="text-gray-500 text-xs">Opening Rate</div>
            <div className="text-xl font-bold mt-1">AED 200</div>
          </div>
          
          {/* Closing Rate */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="text-gray-500 text-xs">Closing Rate</div>
            <div className="text-xl font-bold mt-1">AED 300</div>
          </div>
          
          {/* Yearly High */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="text-gray-500 text-xs">Yearly High</div>
            <div className="text-xl font-bold mt-1">AED 400</div>
          </div>
          
          {/* Yearly Low */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="text-gray-500 text-xs">Yearly Low</div>
            <div className="text-xl font-bold mt-1">AED 100</div>
          </div>
        </div>
      </div>
    );
  }