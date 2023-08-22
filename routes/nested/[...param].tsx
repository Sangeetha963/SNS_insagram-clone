import type { FC } from 'react'
import { useParams } from 'react-router'

// logic
const useNestedParamPage = () => {
    const routeParams = useParams()
    return { routeParams }
}

// view
const NestedParamPageView: FC<ReturnType<typeof useNestedParamPage>> = (props) => {
    const { routeParams } = props

    return (
        <>
            <div>param all:</div>
            <pre>{JSON.stringify(routeParams, undefined, 2)}</pre>
        </>
    )
}

export const NestedParamPage: FC = () => {
    const hookItems = useNestedParamPage()
    return <NestedParamPageView {...hookItems} />
}

export default NestedParamPage
