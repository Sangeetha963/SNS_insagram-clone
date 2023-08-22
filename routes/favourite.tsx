import { ChevronLeftIcon, ChevronRightIcon, StarIcon } from '@chakra-ui/icons'
import {
    Box,
    Button,
    ChakraProvider,
    Grid,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Table,
    TableContainer,
    Tbody,
    Td,
    Thead,
    Tr,
    useDisclosure,
    useToast,
} from '@chakra-ui/react'
import { Container, Next, PageGroup, Paginator, Previous } from 'chakra-paginator'
import { FC, useState } from 'react'
import { useNavigate } from 'react-router'

import { useApiClient } from '~/util/create-api-client'
import { useQuerySuspense } from '~/util/hooks/use-query-suspense'
// logic
const useSrcRoutesIndexsTsxPage = () => {
    const navigate = useNavigate()
    const { hookApi, apiClient } = useApiClient()
    const [page, setPage] = useState(1)
    const postLimit = 5
    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const { data: info } = useQuerySuspense(['list'], async () => {
        const res = await hookApi(() => apiClient.clientCustomerGetUser())
        return res
    })
    const { data: getFavList, refetch } = useQuerySuspense(['favList'], async () => {
        const res = await hookApi(() => apiClient.clientFavouriteGetFavouriteList({ parameter: { customerUuid: info?.uuid } }))
        console.log(res)
        return res.list
    })
    const favouritePost = async (like: string) => {
        await hookApi(() =>
            apiClient.clientFavouriteLikePost({
                requestBody: { postId: like },
                parameter: { postUuid: like },
            }),
        )
        refetch()
        toast({
            status: 'success',
            description: 'you liked the post',
            duration: 3000,
        })
    }
    const unlikePost = async (unlike: string) => {
        await hookApi(() =>
            apiClient.clientFavouriteDeleteFav({
                parameter: { postUuid: unlike },
            }),
        )
        refetch()
        toast({
            status: 'success',
            description: 'you unliked the post',
            duration: 3000,
        })
    }
    // const getFavList = getUserFavList.map((dataFav)=>{
    //     return dataFav.uuid
    // })
    // const { data: postList } = useQuerySuspense(['postList', page, postLimit], async () => {
    //     const res = await hookApi(() => apiClient.clientPostGetPostList({ parameter: { limit: postLimit, page: page } }))
    //     console.log(res)
    //     return res.list
    // })

    const postPage = () => {
        navigate('/posts')
    }
    const logOut = () => {
        navigate('/registration')
    }
    const outerLimit = 2
    const innerLimit = 2
    const baseStyle = {
        w: 7,
        fontSize: 'sm',
    }
    const normalStyles = {
        ...baseStyle,
        _hover: {
            bg: 'green.300',
        },
        bg: 'gray.300',
    }
    const activeStyles = {
        ...baseStyle,
        _hover: {
            bg: 'blue.300',
        },
        bg: 'green.300',
    }
    const separatorStyles = {
        w: 7,
        bg: 'green.200',
    }
    const handlePageChange = (page: number) => {
        setPage(page)
        console.log('request new data with ->', page)
    }
    const pagesQuantity = Math.ceil((getFavList.length + 1) / postLimit)

    return {
        postPage,
        favouritePost,
        getFavList,
        unlikePost,
        outerLimit,
        innerLimit,
        normalStyles,
        activeStyles,
        separatorStyles,
        handlePageChange,
        pagesQuantity,
        page,
        info,
        isOpen,
        onClose,
        onOpen,
        logOut,
    }
}

// view
const SrcRoutesIndexsTsxPageView: FC<ReturnType<typeof useSrcRoutesIndexsTsxPage>> = (props) => {
    const {
        postPage,
        // favouritePost,
        getFavList,
        unlikePost,
        outerLimit,
        innerLimit,
        normalStyles,
        activeStyles,
        separatorStyles,
        handlePageChange,
        pagesQuantity,
        page,
        info,
        isOpen,
        onClose,
        onOpen,
        logOut,
    } = props
    const FavouritePost = (
        <>
            {getFavList.map((data) => {
                return (
                    <Tr>
                        <Td>{data.customer.name}</Td>
                        <Td>{data.content}</Td>
                        <Td>
                            <Button onClick={() => unlikePost(data.uuid)} bg={'#7BCCB5'}>
                                <StarIcon />
                            </Button>
                        </Td>
                    </Tr>
                )
            })}
        </>
    )

    return (
        <>
            {' '}
            <Box>
                <Box
                    width={'100%'}
                    color={' #CC7A92'}
                    bg={'#7BCCB5'}
                    padding={'1.5 rem'}
                    height={'50'}
                    fontFamily={'sans-serif'}
                    fontSize={'2xl'}
                    display={'flex'}
                    justifyContent={'space-between'}>
                    favourite Page
                    {/* <Button onClick={postPage} bg={'#7BCCB5'}>
                        Posts
                    </Button> */}
                    <Button bg={'#7BCCB5'} onClick={onOpen} color={' #CC7A92'}>
                        Logout
                    </Button>
                    <Modal isOpen={isOpen} onClose={onClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader color={'red'}> Are you sure you want to logout?</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody />
                            <ModalFooter>
                                <Button onClick={onClose} bg={'#7BCCB5'}>
                                    Cancel
                                </Button>
                                <Button onClick={logOut} bg={'#7BCCB5'}>
                                    Logout
                                </Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </Box>
                <Box textAlign={'center'} fontSize={'2xl'} textShadow={'1px 1px #ff0000'} color={'#7BCCB5'}>
                    Favourite page
                </Box>
                <Box fontSize={'2xl'} color={'#7BCCB5'} textAlign={'center'}>
                    Hello {info.name}, the list of posts you liked :)
                </Box>
                <Box padding={'5rem'}>
                    <TableContainer>
                        <Table>
                            <Thead>
                                <Tr>
                                    <Td color={'#7BCCB5'} fontSize={'2xl'}>
                                        Name
                                    </Td>
                                    <Td color={'#7BCCB5'} fontSize={'2xl'}>
                                        Post
                                    </Td>
                                    <Td color={'#7BCCB5'} fontSize={'2xl'}>
                                        unFavourite
                                    </Td>
                                </Tr>
                            </Thead>

                            <Tbody>{FavouritePost}</Tbody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
            <Box>
                <ChakraProvider>
                    <Paginator
                        activeStyles={activeStyles}
                        innerLimit={innerLimit}
                        currentPage={page}
                        outerLimit={outerLimit}
                        normalStyles={normalStyles}
                        separatorStyles={separatorStyles}
                        pagesQuantity={pagesQuantity}
                        onPageChange={handlePageChange}>
                        <Container align="center" justify={'space-between'} w="full" p={4}>
                            <Previous bg={'#7BCCB5'}>
                                <ChevronLeftIcon />
                            </Previous>
                            <PageGroup />
                            <Next bg={'#7BCCB5'}>
                                <ChevronRightIcon />
                            </Next>
                        </Container>
                    </Paginator>
                    <Grid templateRows="repeat(2, 1fr)" templateColumns="repeat(5, 1fr)" gap={3} px={20} mt={20} />
                </ChakraProvider>
                <Box textAlign={'end'} display={'flex'} justifyContent={'space-between'} padding={'3rem'}>
                    <Button onClick={postPage} bg={'#7BCCB5'}>
                        Posts
                    </Button>
                </Box>
            </Box>
        </>
    )
}

export const SrcRoutesIndexsTsxPage: FC = () => {
    const hookItems = useSrcRoutesIndexsTsxPage()
    return <SrcRoutesIndexsTsxPageView {...hookItems} />
}

export default SrcRoutesIndexsTsxPage
