import type { FC } from 'react'

// logic
const useNestedIndexPage = () => {
    return {}
}

// view
const NestedIndexPageView: FC<ReturnType<typeof useNestedIndexPage>> = () => {
    return (
        <>
            <div>Nested page index</div>
        </>
    )
}

export const NestedIndexPage: FC = () => {
    const hookItems = useNestedIndexPage()
    return <NestedIndexPageView {...hookItems} />
}

export default NestedIndexPage
