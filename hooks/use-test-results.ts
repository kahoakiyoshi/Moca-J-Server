import { useFetch } from "./use-fetch";
import { testResultService } from "@/services";
import { TestResult } from "@/types";

interface UseTestResultsProps {
  patientId?: string;
  approved?: string;
  startDate?: string;
  endDate?: string;
  autoFetch?: boolean;
}

export const useTestResults = (props?: UseTestResultsProps) => {
  const { data, isLoading, error, execute } = useFetch<
    TestResult[],
    {
      patientId?: string;
      approved?: string;
      startDate?: string;
      endDate?: string;
    }
  >({
    fetchFn: (params) => testResultService.getTestResults(params),
    initialParams: {
      patientId: props?.patientId,
      approved: props?.approved,
      startDate: props?.startDate,
      endDate: props?.endDate,
    },
    autoFetch: props?.autoFetch !== false,
  });

  return {
    results: data || [],
    isLoading,
    error,
    refetch: execute,
  };
};
