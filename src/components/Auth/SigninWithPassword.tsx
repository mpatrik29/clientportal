"use client";

import { EmailIcon, PasswordIcon } from "@/assets/icons";
import Link from "next/link";
import React, { useState } from "react";
import InputGroup from "../FormElements/InputGroup";
import { Checkbox } from "../FormElements/checkbox";
import { account, databases } from "@/app/appwrite";
import { Query } from "appwrite";
import { useRouter } from "next/navigation";

export default function SigninWithPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear any previous errors
    
    try {
      await login(email, password);
    } catch (error) {
      console.error("Error during login:", error);
      // Error handling is now done in the login function
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Create a session for the user
      const session = await account.createEmailPasswordSession(email, password);

      // Fetch the logged-in user's details
      const user = await account.get();
      
      // Store Name, Email, and UserId in localStorage
      localStorage.setItem("name", user.name);
      localStorage.setItem("email", user.email);
      localStorage.setItem("userId", user.$id);
      localStorage.setItem('emailVerified', String(user.emailVerification));

      const userDetails = await databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
          process.env.NEXT_PUBLIC_USER_DETAILS_COLLECTION_ID!,
      );

      console.log(userDetails);
      if(userDetails.documents.length > 0)
      {
         localStorage.setItem("identityVerified", 'true');
      }

      // Query the users collection to fetch the document with userId equal to the logged-in user's ID
      const response = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
       '681c313e00156df34b5d',
        [Query.equal("userId", user.$id)]
      );

      // If a document is returned, store its document ID in localStorage
      if (response.documents.length > 0) {
        localStorage.setItem("activePlans", response.total.toString());
      }

      // Redirect to /dashboard using Next.js router
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Error during login:", error);
      
      // Handle different types of errors
      if (error.code === 401) {
        setError("Invalid email or password. Please check your credentials and try again.");
      } else if (error.code === 409) {
        setError("Account already exists with this email. Please try signing in instead.");
      } else if (error.code === 429) {
        setError("Too many login attempts. Please wait a moment before trying again.");
      } else if (error.message?.includes("network")) {
        setError("Network error. Please check your internet connection and try again.");
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
      
      throw error; // Re-throw to be caught by the outer try-catch
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Error Message Display */}
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-4 dark:bg-red-900/20 dark:border-red-800">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          </div>
        </div>
      )}

      <InputGroup
        type="email"
        label="Email"
        className="mb-4 [&_input]:py-[15px]"
        placeholder="Enter your email"
        name="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        icon={<EmailIcon />}
      />

      <InputGroup
        type="password"
        label="Password"
        className="mb-5 [&_input]:py-[15px]"
        placeholder="Enter your password"
        name="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        icon={<PasswordIcon />}
      />

      <div className="mb-6 flex items-center justify-between gap-2 py-2 font-medium">
        <Checkbox
          label="Remember me"
          name="remember"
          withIcon="check"
          minimal
          radius="md"
          onChange={(e) => setRemember(e.target.checked)}
        />

        <Link
          href="/auth/forgot-password"
          className="hover:text-primary dark:text-white dark:hover:text-primary"
        >
          Forgot Password?
        </Link>
      </div>

      <div className="mb-4.5">
        <button
          type="submit"
          disabled={loading}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Signing In..." : "Sign In"}
          {loading && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-primary dark:border-t-transparent" />
          )}
        </button>
      </div>
    </form>
  );
}
