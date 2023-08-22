import { Box, Button } from '@chakra-ui/react'
import type { FC } from 'react'
import { useNavigate } from 'react-router'
// logic
const useSrcRoutesIndexsTsxPage = () => {
    const navigate = useNavigate()

    const regPage = () => {
        navigate('/registration')
    }

    return { regPage }
}

// view
const SrcRoutesIndexsTsxPageView: FC<ReturnType<typeof useSrcRoutesIndexsTsxPage>> = (props) => {
    const { regPage } = props

    return (
        <>
            <Box
                width={'100%'}
                color={'white'}
                bg={'#7BCCB5'}
                padding={'1.5 rem'}
                height={'50'}
                fontFamily={'sans-serif'}
                fontSize={'2xl'}
                display={'flex'}
                justifyContent={'space-between'}>
                Sns Page
                <Button onClick={regPage} bg={'#7BCCB5'}>
                    Registration
                </Button>
            </Box>
        </>
    )
}

export const SrcRoutesIndexsTsxPage: FC = () => {
    const hookItems = useSrcRoutesIndexsTsxPage()
    return <SrcRoutesIndexsTsxPageView {...hookItems} />
}

export default SrcRoutesIndexsTsxPage
