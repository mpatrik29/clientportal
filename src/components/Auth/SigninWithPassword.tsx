"use client";

import { EmailIcon, PasswordIcon } from "@/assets/icons";
import Link from "next/link";
import React, { useState } from "react";
import InputGroup from "../FormElements/InputGroup";
import { Checkbox } from "../FormElements/checkbox";
import { account, databases } from "@/app/appwrite";
import { Query } from "appwrite";

export default function SigninWithPassword() {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      console.error("Error during login:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Create a session for the user
      const session = await account.createEmailPasswordSession(email, password); // Fixed method name

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

      // Redirect to /dashboard
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90"
        >
          Sign In
          {loading && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-primary dark:border-t-transparent" />
          )}
        </button>
      </div>
    </form>
  );
}
