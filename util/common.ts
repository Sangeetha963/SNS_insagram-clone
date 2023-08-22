import { useBreakpointValue } from '@chakra-ui/react'
import { useEffect, useLayoutEffect, useState } from 'react'

export const sleep = (ms: number): Promise<void> => {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve()
        }, ms)
    })
}

export const isProd = process.env.NODE_ENV === 'production'

export const isClientSide = () =>
    typeof window !== 'undefined' &&
    typeof (window === null || window === void 0 ? void 0 : window.getComputedStyle) === 'function'

export const isServerSide = () => !isClientSide()

export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export const useBreakPointValueSSR = <T>(values: Partial<Record<string, T>> | T[], defaultBreakpoint?: string): T | undefined => {
    const result = useBreakpointValue(values, defaultBreakpoint)
    const [actual, setActual] = useState<T>()

    useIsomorphicLayoutEffect(() => {
        setActual(result)
    }, [result, actual])

    return actual
}
