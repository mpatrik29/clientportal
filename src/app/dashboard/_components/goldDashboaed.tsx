'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, TrendingUp, Gift, Award, ArrowRight, ShieldCheck, Info, FileText, MessageSquare, Search } from 'lucide-react';

const GoldDashboard = () => {
  const [user, setUser] = useState({
    name: 'Aswathy',
    emailVerified: false,
    identityVerified: false,
    activePlans: 0,
    isNewUser: true, // New flag to determine if user is new
  });

  useEffect(() => {
    const name = localStorage.getItem('name') || 'Aswathy';
    const emailVerified = localStorage.getItem('emailVerified') === 'true';
    const identityVerified = localStorage.getItem('identityVerified') === 'true';
    const activePlans = parseInt(localStorage.getItem('activePlans') || '0');
    
    // User is considered new if they haven't verified email AND have zero active plans
    const isNewUser = !emailVerified && activePlans === 0;
    
    setUser({ name, emailVerified, identityVerified, activePlans, isNewUser });
  }, []);

  const onboardingSteps = [
    { id: 'email', label: 'Verify Email', completed: user.emailVerified, icon: <ShieldCheck className="w-5 h-5" /> },
    { id: 'identity', label: 'Verify Identity', completed: user.identityVerified, icon: <ShieldCheck className="w-5 h-5" /> },
    { id: 'profile', label: 'Complete Profile', completed: false, icon: <ShieldCheck className="w-5 h-5" /> },
    { id: 'investment', label: 'First Investment', completed: user.activePlans > 0, icon: <ShieldCheck className="w-5 h-5" /> },
  ];

  // Welcome screen for new users
  const renderWelcomeScreen = () => {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Welcome & Onboarding */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-amber-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Welcome to Gold Invest, {user.name}!</h2>
              <p className="text-sm text-gray-500">Complete your verification to start your gold investment journey</p>
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
            Complete Verification <ArrowRight className="w-4 h-4 inline ml-1" />
          </Link>
        </div>

        {/* Explore Gold Investment Plans */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-amber-100">
          <div className="flex items-center mb-4">
            <Search className="w-6 h-6 text-amber-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-800">Explore Gold Investment Plans</h3>
          </div>
          
          <p className="text-gray-600 mb-6">
            Discover our range of gold investment plans tailored to meet your financial goals. 
            From fixed monthly plans to flexible savings options, we have something for everyone.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-b from-amber-50 to-white p-4 rounded-xl border border-amber-100">
              <h4 className="text-lg font-medium text-amber-800 mb-2">Monthly Plans</h4>
              <p className="text-sm text-gray-600 mb-3">Save gold with fixed monthly payments</p>
              <Link
                href="/plans/monthly"
                className="text-amber-600 hover:text-amber-700 text-sm font-medium flex items-center"
              >
                View Plans <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            <div className="bg-gradient-to-b from-amber-50 to-white p-4 rounded-xl border border-amber-100">
              <h4 className="text-lg font-medium text-amber-800 mb-2">One-Time Purchase</h4>
              <p className="text-sm text-gray-600 mb-3">Buy gold with a single payment</p>
              <Link
                href="/plans/one-time"
                className="text-amber-600 hover:text-amber-700 text-sm font-medium flex items-center"
              >
                View Options <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            <div className="bg-gradient-to-b from-amber-50 to-white p-4 rounded-xl border border-amber-100">
              <h4 className="text-lg font-medium text-amber-800 mb-2">Flexi Savings</h4>
              <p className="text-sm text-gray-600 mb-3">Save gold at your own pace</p>
              <Link
                href="/plans/flexi"
                className="text-amber-600 hover:text-amber-700 text-sm font-medium flex items-center"
              >
                Learn More <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
          
          <Link
            href="/plans"
            className="block text-center w-full py-3 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white text-base font-medium transition shadow-sm"
          >
            Browse All Plans
          </Link>
        </div>

        {/* Legal Documents & Support */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-amber-100">
            <div className="flex items-center mb-4">
              <FileText className="w-6 h-6 text-gray-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-800">Legal Documents</h3>
            </div>
            
            <p className="text-gray-600 mb-4">
              Review our terms of service, privacy policy, and other important documents.
            </p>
            
            <ul className="space-y-3 mb-6">
              <li>
                <Link
                  href="/legal/terms"
                  className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
                >
                  <Info className="w-4 h-4 mr-2" />
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/privacy"
                  className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
                >
                  <Info className="w-4 h-4 mr-2" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/investments"
                  className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
                >
                  <Info className="w-4 h-4 mr-2" />
                  Investment Agreement
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/compliance"
                  className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
                >
                  <Info className="w-4 h-4 mr-2" />
                  Compliance & Regulations
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-amber-100">
            <div className="flex items-center mb-4">
              <MessageSquare className="w-6 h-6 text-green-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-800">Need Assistance?</h3>
            </div>
            
            <p className="text-gray-600 mb-4">
              Our customer support team is here to help you with any questions or concerns.
            </p>
            
            <div className="bg-gradient-to-r from-green-50 to-white p-4 rounded-xl border border-green-100 mb-6">
              <h4 className="text-base font-medium text-green-800 mb-2">Contact Support</h4>
              <p className="text-sm text-gray-600 mb-3">Available 24/7 to assist you</p>
              <div className="flex space-x-3">
                <Link
                  href="/support/chat"
                  className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center"
                >
                  Live Chat <MessageSquare className="w-4 h-4 ml-1" />
                </Link>
                <Link
                  href="/support/email"
                  className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center"
                >
                  Email Support
                </Link>
              </div>
            </div>
            
            <Link
              href="/faqs"
              className="block text-center w-full py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-base font-medium transition"
            >
              Frequently Asked Questions
            </Link>
          </div>
        </div>
      </div>
    );
  };

  // Existing dashboard for active users
  const renderDashboard = () => {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
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

  // Render either welcome screen or dashboard based on user status
  return user.isNewUser ? renderWelcomeScreen() : renderDashboard();
};

export default GoldDashboard;