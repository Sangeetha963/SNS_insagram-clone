import '@testing-library/jest-dom/extend-expect'
import 'jest-extended'

import { HelmetProvider } from 'react-helmet-async'
import { vi } from 'vitest'

HelmetProvider.canUseDOM = false

vi.mock('vite-plugin-ssr/client/router', () => {
    return {
        navigate: vi.fn(),
    }
})
