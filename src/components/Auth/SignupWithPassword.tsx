"use client";

import { EmailIcon, PasswordIcon } from "@/assets/icons";
import Link from "next/link";
import React, { useState } from "react";
import InputGroup from "../FormElements/InputGroup";
import { Checkbox } from "../FormElements/checkbox";
import { account, databases, ID } from "@/app/appwrite";
import { Permission, Role } from "appwrite";

export default function SignupWithPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      // Create a new user in Appwrite Auth
      const authUser = await account.create(ID.unique(), email, password, name);

      // Log in the user to get session
      await account.createEmailPasswordSession(email, password);

      // Get the logged-in user's info (to ensure we have the latest data)
      const user = await account.get();

      // Store user data in localStorage
      localStorage.setItem("name", user.name);
      localStorage.setItem("email", user.email);
      localStorage.setItem("userId", user.$id);

      // Create entry in users collection
      await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
        "681c3194000cd4f0bff5", // Your users collection ID
        user.$id, // Use the same ID as the auth user for easy reference
        {
          name: user.name,
          email: user.email,
          userId: user.$id,
          isActive: true,
        },
        [
          Permission.read(Role.user(user.$id)), 
          Permission.write(Role.user(user.$id)),
          Permission.read(Role.any()), // Allow admins to read user data
        ]
      );

      // Create the user_roles document
      await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
        process.env.NEXT_PUBLIC_USER_ROLES_COLLECTION_ID!,
        ID.unique(),
        {
          userId: user.$id,
          role: "client",
        },
        [
          Permission.read(Role.user(user.$id)), 
          Permission.write(Role.user(user.$id)),
          Permission.read(Role.any()), // Allow admins to read role data
        ]
      );

      // Send verification email
      await account.createVerification('https://main.d2qm6n2yydob2z.amplifyapp.com/auth/verify');
      
      setSignupSuccess(true);
    } catch (error: any) {
      console.error("Error during signup:", error);
      setError(error.message || "An error occurred during signup. Please try again.");
      
      // If user was created but other operations failed, we should handle cleanup
      // or inform the user appropriately
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    try {
      setLoading(true);
      setError("");
      await account.createVerification(
        `${window.location.origin}/auth/verify`
      );
      // You could add a success message state here
    } catch (error: any) {
      console.error("Error sending verification email:", error);
      setError("Failed to send verification email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (signupSuccess) {
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
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Verify Your Email</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            We've sent a verification email to <span className="font-medium">{email}</span>
          </p>
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-left">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Please check your inbox and click on the verification link to complete your account setup.
              If you don't see the email, please check your spam folder.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={resendVerification}
            disabled={loading}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-primary bg-transparent p-3 font-medium text-primary transition hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Resend Verification Email
            {loading && (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-primary border-t-transparent dark:border-white dark:border-t-transparent" />
            )}
          </button>

          <Link href="/" className="block w-full">
            <button className="w-full rounded-lg bg-primary p-3 font-medium text-white transition hover:bg-opacity-90">
              Back to Sign In
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <InputGroup
        type="text"
        label="Name"
        className="mb-4 [&_input]:py-[15px]"
        placeholder="Enter your name"
        name="name"
        onChange={(e) => setName(e.target.value)}
        value={name}
        icon={<EmailIcon />}
        required
      />

      <InputGroup
        type="email"
        label="Email"
        className="mb-4 [&_input]:py-[15px]"
        placeholder="Enter your email"
        name="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        icon={<EmailIcon />}
        required
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
        required
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
          disabled={loading || !name.trim() || !email.trim() || !password.trim()}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sign Up
          {loading && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-primary dark:border-t-transparent" />
          )}
        </button>
      </div>
    </form>
  );
}