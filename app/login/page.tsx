"use client";

import LoginScreen from "@/components/screens/LoginScreen";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

function LoginForm() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || "/admin/patients";

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (!isLoading && isAuthenticated && errorParam !== 'unauthorized') {
      router.push(callbackUrl);
    }
  }, [isAuthenticated, isLoading, router, callbackUrl, searchParams]);

  const handleLoginSuccess = () => {
    // Redirection is handled by the useEffect above when Firebase Auth state changes
    router.push(callbackUrl);
  };

  if (isLoading) return null;

  return <LoginScreen onLogin={handleLoginSuccess} />;
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-white text-gray-400">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
