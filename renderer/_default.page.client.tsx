import { type Root, createRoot, hydrateRoot } from 'react-dom/client'
import { FilledContext } from 'react-helmet-async'
import { BrowserRouter } from 'react-router-dom'
import type { PageContextBuiltInClient } from 'vite-plugin-ssr/client'

import { convertLayoutComponent } from '~/util/common/layout'

import { PageShell } from './PageShell'
import type { PageContext } from './types'

const helmetContext = {} as FilledContext

let root: Root
export const render = async (pageContext: PageContext & PageContextBuiltInClient) => {
    // We do Server Routing, but we can also do Client Routing by using `useClientRouter()`
    // instead of `getPage()`, see https://vite-plugin-ssr.com/useClientRouter
    const { Page, pageProps, exports } = pageContext

    const LayoutComponent = convertLayoutComponent(exports.layout)

    const content = (
        <BrowserRouter>
            <PageShell pageContext={pageContext} helmetContext={helmetContext}>
                <LayoutComponent>
                    <Page {...pageProps} />
                </LayoutComponent>
            </PageShell>
        </BrowserRouter>
    )

    const container = document.getElementById('page-view')!

    if (pageContext.isHydration) root = hydrateRoot(container, content)
    else {
        if (!root) root = createRoot(container)
        root.render(content)
    }
}

export function onHydrationEnd() {
    console.log('Hydration finished; page is now interactive.')
}

export function onPageTransitionStart() {
    console.log('Page transition start')
    document.querySelector('#page-view')!.classList.add('page-transition')
}

export function onPageTransitionEnd() {
    console.log('Page transition end')
    document.querySelector('#page-view')!.classList.remove('page-transition')
}
