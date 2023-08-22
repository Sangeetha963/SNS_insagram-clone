import * as cookie from 'cookie'
import { type CookieParseOptions, type CookieSerializeOptions } from 'cookie'

import { PageContextClient, PageContextServer } from '~/renderer/types'

export const isBrowser = typeof window !== 'undefined'

export const getCookies = (ctx: PageContextServer | PageContextClient, options?: CookieParseOptions): { [p: string]: string } => {
    // SSR
    if (!isBrowser) return cookie.parse((ctx as PageContextServer).req?.headers?.cookie ?? '', options)
    else return cookie.parse(document.cookie, options)
}

export const setCookie = (
    ctx: PageContextServer | PageContextClient,
    name: string,
    value: string,
    options?: CookieSerializeOptions,
) => {
    if (!isBrowser) {
        const serverContext = ctx as PageContextServer
        // SSR
        if (!serverContext.res?.setHeader) {
            console.warn(`Not setting ${name} cookie. Express setHeader is not found`)
            return
        }
        if (serverContext.res.writableEnded) {
            console.warn(`Not setting ${name} cookie. Response has been finished.`)
            console.warn('You should be set cookie before res.send()')
            return
        }

        serverContext.res.cookie(name, value, { ...(options || {}) })
    } else {
        // Browser
        if (options?.httpOnly) throw new Error('Can not set a httpOnly cookie in the browser.')

        document.cookie = cookie.serialize(name, value, options)
    }
}

export const destroyCookie = (ctx: PageContextServer | PageContextClient, name: string, options?: CookieSerializeOptions) => {
    return setCookie(ctx, name, '', { ...(options || {}), maxAge: -1 })
}
