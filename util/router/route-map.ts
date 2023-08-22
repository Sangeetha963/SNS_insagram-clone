import uniq from 'lodash/uniq'

export type RouteDeep = { path: string; children?: RouteDeep[]; element?: string }

export type RoutePathDeep = [string, RoutePathDeep[]]

export const extractRoutePath = (routes: RouteDeep[]): RoutePathDeep[] => {
    return routes.map((it) => [it.path, it.children ? extractRoutePath(it.children) : []] as RoutePathDeep)
}

export const flatRoutePath = (routes: RouteDeep[], basePath = ''): string[] => {
    const pathList = routes
        .flatMap((it) => {
            // '/'のみの時
            if ((!it.children || it.children.length === 0) && it.path.startsWith('/') && basePath === '') return [it.path]

            // '*' match all
            if (it.path === '*') return [`${basePath}/:params${it.path}`]

            // 子供がいないパス(末端)
            if (!it.children || it.children.length === 0) return [`${basePath}/${it.path}`]
            return [
                ...(it.element ? [`${basePath}/${it.path}`] : []),
                ...flatRoutePath(it.children, `${basePath}/${it.path}`).flat(),
            ] as string[]
        })
        .map((it) => (it.length !== 1 && it.endsWith('/') ? it.replace(/\/$/, '') : it))

    return uniq(pathList)
}
