import React, { useState } from 'react';

const GoldRatesNavbar = () => {
  const [showTenGram, setShowTenGram] = useState(false);

  // Static gold rates data - 24K only for compact display
  const rates = {
    '1g': '386.45 AED',
    '10g': '3,864.50 AED'
  };

  return (
    <div className="flex items-center space-x-4 bg-black/90 px-4 py-2 rounded-lg border border-gold-500">
      {/* Gold Icon */}
      <div className="text-gold-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
        </svg>
      </div>

      {/* Rate Display */}
      <div className="text-center">
        <p className="text-xs text-gold-400">24K GOLD</p>
        <p className="text-sm font-medium text-white">
          {showTenGram ? rates['10g'] : rates['1g']}
        </p>
      </div>

      {/* Toggle Button */}
      <button 
        onClick={() => setShowTenGram(!showTenGram)}
        className="text-xs bg-gold-600 text-black px-2 py-1 rounded hover:bg-gold-500 transition-colors"
      >
        {showTenGram ? '1g' : '10g'}
      </button>
    </div>
  );
};

export default GoldRatesNavbar;