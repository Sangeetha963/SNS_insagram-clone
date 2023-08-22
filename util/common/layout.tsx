import React, { FC, ReactNode } from 'react'

import { Default } from '~/layout/Default'

type Props = {
    children?: ReactNode
}

const LayoutComponent: FC<Props> = ({ children }) => <>{children}</>

export const convertLayoutComponent = (layout?: FC<Props> | string): FC<Props> => {
    if (typeof layout === 'function') return layout as FC
    else if (typeof layout === 'string') {
        switch (layout) {
            default:
                return Default
        }
    }

    return LayoutComponent
}
