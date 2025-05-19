'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, TrendingUp, Gift, Award, ArrowRight, ShieldCheck } from 'lucide-react';

const GoldDashboard = () => {
  const [user, setUser] = useState({
    name: 'Aswathy',
    emailVerified: false,
    identityVerified: false,
    activePlans: 0,
  });

  useEffect(() => {
    const name = localStorage.getItem('name') || 'Aswathy';
    const emailVerified = localStorage.getItem('emailVerified') === 'true';
    const identityVerified = localStorage.getItem('identityVerified') === 'true';
    const activePlans = parseInt(localStorage.getItem('activePlans') || '0');
    setUser({ name, emailVerified, identityVerified, activePlans });
  }, []);

  const onboardingSteps = [
    { id: 'email', label: 'Verify Email', completed: user.emailVerified, icon: <ShieldCheck className="w-5 h-5" /> },
    { id: 'identity', label: 'Verify Identity', completed: user.identityVerified, icon: <ShieldCheck className="w-5 h-5" />  },
    { id: 'profile', label: 'Complete Profile', completed: false, icon: <ShieldCheck className="w-5 h-5" />  },
    { id: 'investment', label: 'First Investment', completed: user.activePlans > 0, icon: <ShieldCheck className="w-5 h-5" />  },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Gold Price Banner */}
      <div className="bg-gradient-to-r from-amber-500 to-yellow-400 rounded-2xl p-4 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-white text-xs font-medium">Current Gold Price</p>
            <h3 className="text-white text-2xl font-bold">₹6,147.50/g</h3>
          </div>
          <div className="flex items-center bg-white bg-opacity-20 px-3 py-1 rounded-full">
            <TrendingUp className="w-4 h-4 text-white mr-1" />
            <span className="text-white text-sm font-medium">+2.4%</span>
          </div>
        </div>
      </div>

      {/* Welcome & Onboarding */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-amber-100">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Welcome back, {user.name}!</h2>
            <p className="text-sm text-gray-500">Complete your onboarding to start investing in gold</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center shadow-inner">
            <span className="text-white font-bold text-lg">
              {user.name.charAt(0)}
            </span>
          </div>
        </div>

        <div className="flex justify-between mb-8">
          {onboardingSteps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center flex-1">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 shadow transition-all
                ${step.completed ? 'bg-gradient-to-r from-green-400 to-green-500 text-white' : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-500'}`}
              >
                {step.completed ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <span className="font-bold">{index + 1}</span>
                )}
              </div>
              <p className={`text-sm text-center ${step.completed ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
                {step.label}
              </p>
            </div>
          ))}
        </div>

        <Link
          href="/profile/setup"
          className="block text-center w-full py-3 px-4 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-medium transition shadow-md"
        >
          Continue Setup <ArrowRight className="w-4 h-4 inline ml-1" />
        </Link>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* My Gold Assets */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-amber-100 flex flex-col h-full">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-xl font-semibold text-gray-800">My Gold Assets</h3>
            <Link 
              href="/portfolio" 
              className="text-amber-600 hover:text-amber-700 text-sm font-medium flex items-center"
            >
              View History
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          {/* Total Gold Value */}
          <div className="mb-8">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                <Award className="w-5 h-5 text-amber-600" />
              </div>
              <p className="text-base text-gray-500">Total Gold</p>
            </div>
            <div className="flex justify-between items-start mt-2">
              <div>
                <p className="text-5xl font-bold text-gray-800">6.8g</p>
                <div className="flex items-center mt-2">
                  <p className="text-lg text-amber-700 font-medium">AED 1,496</p>
                  <div className="flex items-center ml-2 bg-green-50 text-green-600 px-2 py-0.5 rounded-full text-sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +2.4%
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end mb-2">
                  <div className="w-4 h-4 rounded-full bg-amber-400 mr-2"></div>
                  <p className="text-sm text-gray-600">Invested: 6.5g</p>
                </div>
                <div className="flex items-center justify-end">
                  <div className="w-4 h-4 rounded-full bg-green-400 mr-2"></div>
                  <p className="text-sm text-gray-600">Bonus: 0.3g</p>
                </div>
              </div>
            </div>
          </div>
          {/* Plans Summary */}
          <div className="grid grid-cols-3 text-center gap-3 mb-4">
            <div className="bg-gradient-to-b from-amber-50 to-white p-2 rounded-xl">
              <p className="text-xl font-bold text-amber-700">2</p>
              <p className="text-xs text-gray-500">Active</p>
            </div>
            <div className="bg-gradient-to-b from-amber-50 to-white p-2 rounded-xl">
              <p className="text-xl font-bold text-amber-700">4</p>
              <p className="text-xs text-gray-500">Completed</p>
            </div>
            <div className="bg-gradient-to-b from-amber-50 to-white p-2 rounded-xl">
              <p className="text-xl font-bold text-amber-700">0</p>
              <p className="text-xs text-gray-500">Flexi</p>
            </div>
          </div>
          {/* Withdrawable Gold */}
          <div className="bg-gradient-to-r from-amber-50 to-white p-5 rounded-xl mb-auto">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-base font-medium text-gray-700">Available to Withdraw</p>
              </div>
              <div className="bg-white px-4 py-1 rounded-full shadow-sm">
                <p className="text-lg font-bold text-green-600">2.2g</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 ml-11">
              From completed plans and rewards
            </p>
          </div>

          <Link
            href="/withdraw"
            className="block text-center w-full py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-base font-medium transition shadow-sm mt-8"
          >
            Withdraw Gold
          </Link>
        </div>

        {/* Investment Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-amber-100 flex flex-col h-full">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-xl font-semibold text-gray-800">Investment Summary</h3>
            <Link 
              href="/investments" 
              className="text-amber-600 hover:text-amber-700 text-sm font-medium flex items-center"
            >
              View Details
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {/* Total Invested */}
          <div className="mb-6">
            <p className="text-base text-gray-500 mb-2">Total Invested</p>
            <div className="flex justify-between items-center">
              <p className="text-5xl font-bold text-gray-800">AED 13,500</p>
              <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                <span className="text-sm font-medium">6 Plans</span>
              </div>
            </div>
          </div>

          {/* Current Value & Returns */}
          <div className="bg-gradient-to-r from-amber-50 to-white p-5 rounded-xl mb-8">
            <div className="flex justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Current Value</p>
                <p className="text-2xl font-bold text-amber-700">AED 15,200</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">Total Returns</p>
                <div className="flex items-center justify-end">
                  <p className="text-2xl font-bold text-green-600">+12.6%</p>
                  <TrendingUp className="w-5 h-5 text-green-600 ml-1" />
                </div>
              </div>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full" style={{ width: '12.6%' }}></div>
            </div>
          </div>

          {/* Wallet Balance */}
          <div className="border border-gray-100 rounded-xl p-5 mb-auto">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <Gift className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-base font-medium text-gray-700">Wallet Balance</p>
                  <p className="text-sm text-gray-500">Available for investments</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-blue-700">AED 2,500</p>
            </div>
          </div>

          <Link
            href="/add-funds"
            className="block text-center w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-base font-medium transition shadow-sm mt-8"
          >
            Add Funds
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GoldDashboard;