'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';

const DashboardWelcome = () => {
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
    { id: 'email', label: 'Verify Email', completed: user.emailVerified },
    { id: 'identity', label: 'Verify Identity', completed: user.identityVerified },
    { id: 'profile', label: 'Complete Profile', completed: false },
    { id: 'investment', label: 'First Investment', completed: user.activePlans > 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome & Onboarding */}
      <div className="bg-white rounded-2xl p-6 shadow border">
        <h2 className="text-xl font-semibold text-gray-800">Welcome back, {user.name}!</h2>
        <p className="text-sm text-gray-500 mb-4">Complete your onboarding to start investing</p>

        <div className="flex justify-between mb-6">
          {onboardingSteps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all
                ${step.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}
              >
                {step.completed ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <span className="font-semibold">{index + 1}</span>
                )}
              </div>
              <p className={`text-xs text-center ${step.completed ? 'text-green-600' : 'text-gray-600'}`}>
                {step.label}
              </p>
            </div>
          ))}
        </div>

        <Link
          href="/profile/setup"
          className="block text-center w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition"
        >
          Continue Setup
        </Link>
      </div>

      {/* My Subscriptions */}
      <div className="bg-white rounded-2xl p-6 shadow border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">My Subscriptions</h3>
          <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">6g</span>
        </div>

        <div className="grid grid-cols-3 text-center gap-4">
          <div>
            <p className="text-2xl font-bold text-gray-800">2</p>
            <p className="text-xs text-gray-500">Active</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">4</p>
            <p className="text-xs text-gray-500">Completed</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">0</p>
            <p className="text-xs text-gray-500">Flexi</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardWelcome;
