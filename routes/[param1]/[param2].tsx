import type { FC } from 'react'
import { useParams } from 'react-router'

import { RouteParams } from '~/util/router/types'

// logic
const useParam1Param2Page = () => {
    const routeParams = useParams<RouteParams<'/:param1/:param2'>>()
    return { routeParams }
}

// view
const Param1Param2PageView: FC<ReturnType<typeof useParam1Param2Page>> = (props) => {
    const { routeParams } = props

    return (
        <>
            <div>param1: {routeParams.param1}</div>
            <div>param2: {routeParams.param2}</div>
        </>
    )
}

export const Param1Param2Page: FC = () => {
    const hookItems = useParam1Param2Page()
    return <Param1Param2PageView {...hookItems} />
}

export default Param1Param2Page
