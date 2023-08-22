import type { FC } from 'react'
import { Outlet } from 'react-router'

// logic
const useNestedPage = () => {
    return {}
}

// view
const NestedPageView: FC<ReturnType<typeof useNestedPage>> = () => {
    return (
        <>
            <div>Nested page base layout</div>
            <Outlet />
        </>
    )
}

export const NestedPage: FC = () => {
    const hookItems = useNestedPage()
    return <NestedPageView {...hookItems} />
}

export default NestedPage
