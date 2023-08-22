import { buildRouteParams } from '~/util/router/build-route-params'

describe('build-route-params', () => {
    test('success', () => {
        // @ts-expect-error
        expect(buildRouteParams('/path/to/join/uuid', {})).toBe('/path/to/join/uuid')
    })

    test('not fount parameter', () => {
        // @ts-expect-error
        expect(buildRouteParams('/news/:newsId/point', {})).toBe('/news//point')
    })

    test('unused parameter', () => {
        // @ts-expect-error
        expect(buildRouteParams('/news/:newsId/point', { newsId: 'aa', articleId: 'str' })).toBe('/news/aa/point')
    })

    test('catch all', () => {
        // @ts-expect-error
        expect(buildRouteParams('/path/:params*', { params: ['p1', 'p2'] })).toBe('/path/p1/p2')
    })
})
