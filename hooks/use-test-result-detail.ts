import { useFetch } from './use-fetch';
import { testResultService } from '@/services';
import { TestResult, Patient } from '@/types';

interface UseTestResultDetailProps {
  id: string;
  autoFetch?: boolean;
}

export const useTestResultDetail = (props: UseTestResultDetailProps) => {
  const { 
    data, 
    isLoading, 
    error, 
    execute 
  } = useFetch<{ testResult: TestResult; patient: Patient | null }, string>({
    fetchFn: (id) => testResultService.getTestResultDetail(id || props.id),
    initialParams: props.id,
    autoFetch: !!props.id && props.autoFetch !== false,
  });

  return {
    testResult: data?.testResult || null,
    patient: data?.patient || null,
    isLoading,
    error,
    refetch: execute,
  };
};
