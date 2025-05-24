'use client'

import { account } from "@/app/appwrite";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

export default function VerifyEmail() {
  const [emailVerified, setEmailVerified] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [resendLoading, setResendLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const secret = urlParams.get('secret');
        const userId = urlParams.get('userId');

        if (!secret || !userId) {
          setError('Invalid verification link. Missing required parameters.');
          setLoading(false);
          return;
        }

        await account.updateVerification(userId, secret);
        setEmailVerified(true);
      localStorage.setItem('emailVerified', 'true');
        setLoading(false);
      } catch (error) {
        setError(error instanceof Error ? error.message : String(error));
        setLoading(false);
      }
    };

    verifyEmail();
  }, []);

  const resendVerification = async () => {
    try {
      setResendLoading(true);
      // You'll need to implement this based on your auth flow
      // This might require getting the user's email from somewhere
      // await account.createVerification('http://your-app.com/verify-email');
      console.log('Resend verification not implemented yet');
       await account.createVerification(`${process.env.BASE_URI}/auth/verify`);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
      router.push('/');
    } finally {
      setResendLoading(false);
    }
  };

  // Verification Success State
  if (emailVerified) {
    return (
      <div className="bg-white dark:bg-gray-dark p-8 rounded-lg shadow-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Email Verified Successfully!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Your email has been verified and your account is now active.
          </p>
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg text-left">
            <p className="text-sm text-green-800 dark:text-green-200">
              Welcome! You can now access all features of your account. 
              Click below to continue to your dashboard.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Link href="/dashboard" className="block w-full">
            <button className="w-full rounded-lg bg-primary p-3 font-medium text-white transition hover:bg-opacity-90">
              Continue to Dashboard
            </button>
          </Link>

          <Link href="/" className="block w-full">
            <button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-primary bg-transparent p-3 font-medium text-primary transition hover:bg-primary hover:text-white">
              Back to Sign In
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Verification Loading State
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-dark p-8 rounded-lg shadow-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <span className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-t-transparent" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Verifying Your Email
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Please wait while we verify your email address...
          </p>
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-left">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              This process usually takes just a few seconds. Please don't close this window.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Verification Error State
  if (error) {
    return (
      <div className="bg-white dark:bg-gray-dark p-8 rounded-lg shadow-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Verification Failed
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            We couldn't verify your email address.
          </p>
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 rounded-lg text-left">
            <p className="text-sm text-red-800 dark:text-red-200">
              {error || "The verification link may be invalid or expired. Please try requesting a new verification email."}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={resendVerification}
            disabled={resendLoading}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-3 font-medium text-white transition hover:bg-opacity-90 disabled:opacity-50"
          >
            Request New Verification Email
            {resendLoading && (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent" />
            )}
          </button>

          <Link href="/" className="block w-full">
            <button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-primary bg-transparent p-3 font-medium text-primary transition hover:bg-primary hover:text-white">
              Back to Sign In
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Fallback (shouldn't reach here)
  return null;
}