import { useState, useEffect } from 'react';

interface UseFetchOptions<T, P> {
  fetchFn: (params?: P) => Promise<T>;
  initialParams?: P;
  autoFetch?: boolean;
}

export const useFetch = <T, P = any>({
  fetchFn,
  initialParams,
  autoFetch = true,
}: UseFetchOptions<T, P>) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = async (params?: P) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchFn(params ?? initialParams);
      setData(result);
      return result;
    } catch (err: any) {
      const processedError = err instanceof Error ? err : new Error(String(err));
      setError(processedError);
      throw processedError;
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (autoFetch) {
      execute();
    }
  }, [JSON.stringify(initialParams), autoFetch]);

  return {
    data,
    isLoading,
    error,
    execute,
    setData,
  };
};
