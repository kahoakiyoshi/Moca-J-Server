import { useFetch } from './use-fetch';
import { userService } from '@/services';
import { User } from '@/types';

interface UseUsersProps {
  id?: string;
  searchName?: string;
  autoFetch?: boolean;
}

export const useUsers = (props?: UseUsersProps) => {
  const { 
    data, 
    isLoading, 
    error, 
    execute 
  } = useFetch<User[], { id?: string; searchName?: string }>({
    fetchFn: (params) => userService.getUsers(params),
    initialParams: { id: props?.id, searchName: props?.searchName },
    autoFetch: props?.autoFetch !== false,
  });

  return {
    users: data || [],
    isLoading,
    error,
    refetch: execute,
  };
};
