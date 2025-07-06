'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function IndexRedirect() {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("userId")) {
      router.replace("/dashboard");
    }
  }, [router]);
  return null;
} 