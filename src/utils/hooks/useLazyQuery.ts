import { useCallback, useState } from 'react';
import { QueryFunction, QueryKey, useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

export default function useLazyQuery<TData, TError>(
  key: QueryKey,
  fetchFn: QueryFunction<TData, QueryKey>,
  options?: Omit<UseQueryOptions<TData, TError, unknown, QueryKey>, 'queryKey' | 'queryFn'>
): [() => void, UseQueryResult<unknown, unknown>] {
  const [enabled, setEnabled] = useState(false);

  const query = useQuery<TData, TError, unknown, QueryKey>({
    queryKey: key,
    queryFn: fetchFn,
    ...(options || {}),
    enabled
  });

  const trigger = useCallback(() => {
    if (!enabled) {
      setEnabled(true);
    }
  }, [enabled]);

  return [trigger, query];
}
