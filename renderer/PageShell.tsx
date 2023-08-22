import { ChakraProvider } from '@chakra-ui/react'
import { css, Global } from '@emotion/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider as JotaiProvider } from 'jotai'
import { StrictMode, Suspense, useMemo } from 'react'
import { FilledContext, HelmetProvider } from 'react-helmet-async'
import { useRoutes } from 'react-router-dom'

import ogpIcon from '~/assets/images/img-logo.svg'
import { GA4 } from '~/renderer/GA4'
import { Meta } from '~/renderer/Meta'
import { theme } from '~/util/chakra-theme'
import routes from '~react-pages'

const helmetContext = {} as FilledContext

export const PageShell = () => {
    const queryClient = useMemo(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        suspense: true,
                        refetchOnWindowFocus: false,
                    },
                },
            }),
        [],
    )

    return (
        <StrictMode>
            <QueryClientProvider client={queryClient}>
                <JotaiProvider>
                    <ChakraProvider theme={theme} resetCSS={true}>
                        <HelmetProvider context={helmetContext}>
                            <GA4 trackingCode={process.env.GA4_ID!} isEnable={process.env.STAGE !== 'local'} />
                            <Meta ogpIcon={ogpIcon} />
                            <Global
                                styles={css`
                                    body,
                                    html,
                                    #page-view {
                                        height: 100%;
                                        color: #1a1a1a;
                                        background: #f9f9f9;
                                    }
                                `}
                            />
                            <Suspense fallback={<p>loading...</p>}>{useRoutes(routes)}</Suspense>
                        </HelmetProvider>
                    </ChakraProvider>
                </JotaiProvider>
            </QueryClientProvider>
        </StrictMode>
    )
}
