"use client";

import TestResultDetailScreen from "@/components/screens/TestResultDetailScreen";
import { useRouter, useParams } from "next/navigation";

export default function TestResultDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  return (
    <TestResultDetailScreen 
      id={id} 
      onBack={() => router.push('/admin/test-results')} 
    />
  );
}
