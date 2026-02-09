import { useFetch } from "./use-fetch";
import { patientService } from "@/services";
import { Patient } from "@/types";

interface UsePatientsProps {
  id?: string;
  searchName?: string;
  autoFetch?: boolean;
}

export const usePatients = (props?: UsePatientsProps) => {
  const { data, isLoading, error, execute } = useFetch<
    { patients: Patient[]; totalCount: number },
    { id?: string; searchName?: string }
  >({
    fetchFn: (params) => patientService.getPatients(params),
    initialParams: { id: props?.id, searchName: props?.searchName },
    autoFetch: props?.autoFetch !== false,
  });

  return {
    patients: data?.patients || [],
    totalCount: data?.totalCount || 0,
    isLoading,
    error,
    refetch: execute,
  };
};
