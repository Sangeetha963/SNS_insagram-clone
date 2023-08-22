import { extendTheme, Theme, theme as baseTheme } from '@chakra-ui/react'

import { RecursivePartial } from '~/types/util-type'

// Chakra標準テーマの上書き用 型補完が効くようにしてある
const extendedTheme: RecursivePartial<Theme> = {
    components: {},
}

// Chakra標準テーマに無い値を追加したいときに使う
const originalTheme = {
    colors: {
        primary: '#0077C7',
        secondary: '#6FA6CC',
        white: '#FFFFFF',
        danger: '#E01E5A',
        warning: '#FF8800',
        text: {
            black: '#23221F',
            grey: '#706D65',
            link: '#0071C1',
            light: '#efefef',
        },
        toolbar: '#efefef',
    },
} as const

export const theme = extendTheme({ ...extendedTheme, ...originalTheme }) as typeof baseTheme & typeof originalTheme
