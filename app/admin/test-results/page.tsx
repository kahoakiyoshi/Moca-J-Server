"use client";

import TestResultsScreen from "@/components/screens/TestResultsScreen";
import { useRouter } from "next/navigation";

export default function TestResultsPage() {
  const router = useRouter();

  const handleNavigate = (name: string, params?: any) => {
    if (name === "testResultDetail" && params?.id) {
      router.push(`/admin/test-results/${params.id}`);
    }
  };

  return <TestResultsScreen onNavigate={handleNavigate} />;
}
