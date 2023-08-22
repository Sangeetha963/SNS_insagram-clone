import { ComponentType, lazy, LazyExoticComponent } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const lazyImport = <T extends ComponentType<any>, I extends { [K2 in K]: T }, K extends keyof I>(
    factory: () => Promise<I>,
    name: K,
): LazyExoticComponent<I[K]> => {
    return lazy(() => factory().then((module) => ({ default: module[name] })))
}
