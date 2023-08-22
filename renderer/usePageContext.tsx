// `usePageContext` allows us to access `pageContext` in any React component.
// More infos: https://vite-plugin-ssr.com/pageContext-anywhere

import React, { createContext, ReactNode, useContext } from 'react'

import type { PageContext } from './types'

// @ts-expect-error
const Context = createContext<PageContext>(null)

export const PageContextProvider = ({ pageContext, children }: { pageContext: PageContext; children: ReactNode }) => (
    <Context.Provider value={pageContext}>{children}</Context.Provider>
)

export const usePageContext = () => useContext(Context)
