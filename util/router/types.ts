import type { ParseUrlParams } from 'typed-url-params'

import type { routes } from '~/pages/routes'

export type RouteParams<T extends typeof routes[number]> = ParseUrlParams<T>
