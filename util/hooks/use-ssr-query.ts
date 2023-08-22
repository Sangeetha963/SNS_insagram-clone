import { QueryFunction, QueryKey } from '@tanstack/query-core'
import { hashQueryKey, useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useAsync } from 'react-streaming'

/**
 * React-streaming対応版useQuery
 *
 * リクエスト数削減のためauto refetch周りを無効化しています
 * SSRの実行情報がない状態でuseSsrDataがクライアントで実行された場合は、suspenseでpromiseを実行することから、常にdataが入るようになっています
 *
 * @param queryKey
 * @param queryFn
 * @param options
 */
export const useSsrQuery = <TQueryFnData, TError, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey>(
    queryKey: TQueryKey,
    queryFn: QueryFunction<TQueryFnData, TQueryKey>,
    options?: Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'queryKey' | 'queryFn' | 'initialData'>,
): Omit<UseQueryResult<TData, TError>, 'data'> & { data: TData } => {
    const queryHash = useMemo(() => hashQueryKey(queryKey), [queryKey])

    const hydrationData = useAsync(queryHash, async () =>
        queryFn({
            queryKey: queryKey,
            meta: {},
        }),
    )

    return useQuery(queryKey, queryFn, {
        queryHash,
        initialData: hydrationData,
        suspense: true,
        enabled: false,

        ...options,
    })
}
