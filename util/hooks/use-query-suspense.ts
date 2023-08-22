import { QueryFunction, QueryKey, useQuery, UseQueryOptions } from '@tanstack/react-query'

export const useQuerySuspense = <
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
>(
    // TODO ESLint vs Prettier
    // eslint-disable-next-line indent
    queryKey: TQueryKey,
    // eslint-disable-next-line indent
    queryFn: QueryFunction<TQueryFnData, TQueryKey>,
    // eslint-disable-next-line indent
    options?: Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'queryKey' | 'queryFn' | 'initialData'> & {
        initialData?: () => undefined
    },
    // eslint-disable-next-line indent
) => {
    const query = useQuery(queryKey, queryFn, { suspense: true, refetchOnWindowFocus: false, retry: false, ...options })
    if (query.data) return { ...query, data: query.data }
    else if (query.error) throw query.error
    else throw new Error()
}
