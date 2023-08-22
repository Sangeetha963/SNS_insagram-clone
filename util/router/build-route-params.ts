import { ParseUrlParams } from 'typed-url-params'

import type { routes } from '~/pages/routes'

export const buildRouteParams = <T extends typeof routes[number], K extends ParseUrlParams<T>>(
    pathName: T,
    params: K,
): string => {
    return pathName
        .split('/')
        .map((it) => {
            if (!it.startsWith(':')) return it
            const value = (params as Record<string, string | string[]>)[
                it.endsWith('*') ? it.substring(1, it.length - 1) : it.substring(1)
            ]
            if (Array.isArray(value)) return (value as string[]).join('/')
            else return value
        })
        .join('/')
}
