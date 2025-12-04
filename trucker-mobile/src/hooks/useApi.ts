import { useState, useCallback } from 'react';

interface UseApiState<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
}

interface UseApiReturn<T, P extends any[]> extends UseApiState<T> {
  execute: (...params: P) => Promise<T | null>;
  reset: () => void;
}

export function useApi<T, P extends any[] = []>(
  apiFunction: (...params: P) => Promise<T>
): UseApiReturn<T, P> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    error: null,
    isLoading: false,
  });

  const execute = useCallback(
    async (...params: P): Promise<T | null> => {
      setState({ data: null, error: null, isLoading: true });
      try {
        const result = await apiFunction(...params);
        setState({ data: result, error: null, isLoading: false });
        return result;
      } catch (err: any) {
        const errorMessage = err.message || 'An error occurred';
        setState({ data: null, error: errorMessage, isLoading: false });
        return null;
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({ data: null, error: null, isLoading: false });
  }, []);

  return { ...state, execute, reset };
}

export function useApiList<T, P extends any[] = []>(
  apiFunction: (...params: P) => Promise<{ data: T[]; total: number }>
) {
  const [state, setState] = useState<{
    data: T[];
    total: number;
    error: string | null;
    isLoading: boolean;
  }>({
    data: [],
    total: 0,
    error: null,
    isLoading: false,
  });

  const execute = useCallback(
    async (...params: P) => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      try {
        const result = await apiFunction(...params);
        setState({
          data: result.data,
          total: result.total,
          error: null,
          isLoading: false,
        });
        return result;
      } catch (err: any) {
        const errorMessage = err.message || 'An error occurred';
        setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
        return null;
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({ data: [], total: 0, error: null, isLoading: false });
  }, []);

  return { ...state, execute, reset };
}
