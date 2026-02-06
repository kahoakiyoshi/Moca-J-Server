"use client";

import PatientsScreen from "@/components/screens/PatientsScreen";
import { useRouter } from "next/navigation";

export default function PatientsPage() {
  const router = useRouter();

  const handleNavigate = (name: string, params?: any) => {
    if (name === 'testResults') {
      const query = params?.uid ? `?patientId=${params.uid}` : '';
      router.push(`/admin/test-results${query}`);
    }
  };

  return <PatientsScreen onNavigate={handleNavigate} />;
}
