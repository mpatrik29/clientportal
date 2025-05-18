import Link from 'next/link';

const WelcomeCard = ({ userName }: { userName: string }) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
      <div className="flex flex-col md:flex-row justify-between gap-6">
        {/* Left side - Welcome message */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome back, <span className="text-blue-600">{userName}</span>!
          </h2>
          <p className="text-gray-600 mb-4">
            Let's get you started with your investment journey. Here are some quick actions to help you begin.
          </p>
          
          {/* Quick-start tooltips */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Link href="/getting-started" className="text-xs bg-white hover:bg-gray-50 text-blue-600 px-3 py-1.5 rounded-full border border-blue-100 shadow-xs transition-colors">
              How to invest
            </Link>
            <Link href="/faq" className="text-xs bg-white hover:bg-gray-50 text-blue-600 px-3 py-1.5 rounded-full border border-blue-100 shadow-xs transition-colors">
              Common questions
            </Link>
            <Link href="/gold-rates" className="text-xs bg-white hover:bg-gray-50 text-blue-600 px-3 py-1.5 rounded-full border border-blue-100 shadow-xs transition-colors">
              Gold rate guide
            </Link>
          </div>
        </div>
        
        {/* Right side - CTA */}
        <div className="flex flex-col items-start md:items-end justify-between">
          <div className="text-right mb-4 md:mb-0">
            <p className="text-sm text-gray-500 mb-1">Profile completion</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
            </div>
            <p className="text-xs text-gray-500">45% complete</p>
          </div>
          
          <Link 
            href="/profile/setup" 
            className="w-full md:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors text-center font-medium"
          >
            Set up your profile
          </Link>
        </div>
      </div>
      
      {/* Optional tour prompt */}
      <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
        <p className="text-sm text-gray-600">
          New to gold investments? Take our interactive tour
        </p>
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
          Start tour
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default WelcomeCard;