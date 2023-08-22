import { FilledContext } from 'react-helmet-async'
import { StaticRouter } from 'react-router-dom/server'
import { renderToStream } from 'react-streaming/server'
import type { PageContextBuiltIn } from 'vite-plugin-ssr'
import { escapeInject } from 'vite-plugin-ssr'

import { PageShell } from '~/renderer/PageShell'
import { convertLayoutComponent } from '~/util/common/layout'

import type { PageContext, PageContextServer } from './types'

// See https://vite-plugin-ssr.com/data-fetching
export const passToClient: readonly (keyof PageContext)[] = ['pageProps'] as const

export const render = async (pageContext: PageContextBuiltIn & PageContext & PageContextServer) => {
    const { Page, pageProps, exports, urlPathname } = pageContext

    const LayoutComponent = convertLayoutComponent(exports.layout)

    const helmetContext = {} as FilledContext

    const pageHtml = await renderToStream(
        <StaticRouter location={urlPathname}>
            <PageShell pageContext={pageContext} helmetContext={helmetContext}>
                <LayoutComponent>
                    <Page {...pageProps} />
                </LayoutComponent>
            </PageShell>
        </StaticRouter>,
        {
            // AWS LambdaではNode.js v18のWebStreamに対応しないと使えない
            // disable: !(pageContext.req?.headers['bot-user-agent'] !== '1'),
            disable: true,
            // userAgent: pageContext.req?.headers['user-agent'],
        },
    )

    const helmet = helmetContext.helmet

    // See https://vite-plugin-ssr.com/head

    const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        ${{ __escaped: helmet.title.toString() }}
        ${{ __escaped: helmet.meta.toString() }}
        ${{ __escaped: helmet.base.toString() }}
        ${{ __escaped: helmet.link.toString() }}
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Kaisei+Tokumin:wght@700;800&family=Kanit:ital,wght@1,300&family=Noto+Sans+JP&display=swap" rel="stylesheet">
      </head>
      <body>
        <div id="page-view">${pageHtml}</div>
      </body>
    </html>`

    const pageContextPromise = (async () => {
        return {
            // Some `initialData` provided after the stream has ended
        }
    })()

    return {
        documentHtml,
        pageContext: pageContextPromise,
    }
}

// export const onBeforeRender = async (ctx: PageContextServer): Promise<{ pageContext: Partial<PageContext> }> => {
//     // middleware
//     return await ctx.runOnBeforeRenderPageHook(ctx)
// }
