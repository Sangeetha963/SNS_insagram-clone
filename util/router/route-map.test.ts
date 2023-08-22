import { extractRoutePath, flatRoutePath, RouteDeep } from '~/util/router/route-map'

describe('route-map', () => {
    describe('flatRoute', () => {
        const pathList: RouteDeep[] = [
            { path: '/', element: '/src/routes/index.tsx' },
            {
                path: 'nested',
                element: '/src/routes/nested.tsx',
                children: [
                    {
                        path: '*',
                        element: '/src/routes/nested/[...param].tsx',
                    },
                    {
                        path: '',
                        element: '/src/routes/nested/index.tsx',
                    },
                ],
            },
            {
                path: 'suspense',
                element: '/src/routes/suspense.tsx',
            },
            {
                path: ':param1',
                children: [
                    {
                        path: ':param2',
                        element: '/src/routes/[param1]/[param2].tsx',
                        children: [
                            {
                                path: ':param3',
                                element: '/src/routes/[param1]/[param2]/[param3].tsx',
                            },
                        ],
                    },
                ],
            },
        ]

        test('extractRoutePath', () => {
            expect(extractRoutePath(pathList)).toStrictEqual([
                ['/', []],
                [
                    'nested',
                    [
                        ['*', []],
                        ['', []],
                    ],
                ],
                ['suspense', []],
                [':param1', [[':param2', [[':param3', []]]]]],
            ])
        })

        test('flatRoutePath', () => {
            expect(flatRoutePath(pathList)).toStrictEqual([
                '/',
                '/nested',
                '/nested/:params*',
                '/suspense',
                '/:param1/:param2',
                '/:param1/:param2/:param3',
            ])
        })
    })
})
