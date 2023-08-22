import { type Request, type Response } from 'express'
import type { FC, ReactElement } from 'react'
import { PageContextBuiltInClient } from 'vite-plugin-ssr/client'

export type PageProps = {}

// The `pageContext` that are available in both on the server-side and browser-side
export type PageContext = {
    Page: (pageProps: PageProps) => ReactElement
    pageProps: PageProps
    urlPathname: string
    urlOriginal: string
    urlParsed: {
        origin: string | null
        pathname: string
        pathnameOriginal: string
        search: Record<string, string>
        searchAll: Record<string, string[]>
        searchOriginal: string | null
        hash: string
        hashOriginal: string | null
    }

    documentProps?: {
        title?: string
        description?: string
    }

    exports: {
        layout?: FC | string
        onBeforeRender?: () => Partial<PageContext> | Promise<Partial<PageContext>>
        Page: FC
    }

    routeParams: { [id: string]: string }
}

export type PageContextServer = PageContext & {
    req?: Request
    res?: Response

    runOnBeforeRenderPageHook: (ctx: PageContext) => Promise<{ pageContext: Partial<PageContext> }>
    skipOnBeforeRenderPageHook: (ctx: PageContext) => Promise<{ pageContext: Partial<PageContext> }>
}

export type PageContextClient = PageContext &
    PageContextBuiltInClient & {
        runOnBeforeRenderServerHooks: (ctx: PageContext) => Promise<{ pageContext: Partial<PageContext> }>
        skipOnBeforeRenderServerHooks: (ctx: PageContext) => Promise<{ pageContext: Partial<PageContext> }>
    }
