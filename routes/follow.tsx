import { AddIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
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

// import { Schemas } from '~/apis/types'
import { useApiClient } from '~/util/create-api-client'
import { useQuerySuspense } from '~/util/hooks/use-query-suspense'

// logic
const useFollowPage = () => {
    const navigate = useNavigate()
    const [page, setPage] = useState(1)
    const { hookApi, apiClient } = useApiClient()
    const postLimit = 1
    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const postPage = () => {
        navigate('/posts')
    }
    const logOut = () => {
        navigate('/registration')
    }

    const { data: userinfo } = useQuerySuspense(['list'], async () => {
        const res = await hookApi(() => apiClient.clientCustomerGetUser())
        return res
    })
    const { data: followList, refetch } = useQuerySuspense(['followList'], async () => {
        const res = await hookApi(() => apiClient.clientFollowFollowList({ parameter: { userUuid: userinfo.uuid } }))
        console.log(res)
        return res.list
    })
    const followUser = async (uuid: string) => {
        const res = await hookApi(() =>
            apiClient.clientFollowFollowUser({
                requestBody: { userId: uuid },
                parameter: { userUuid: uuid },
            }),
        )
        console.log(res)
        refetch()
        toast({
            status: 'success',
            description: 'you have successfully started following',
            duration: 3000,
        })
    }
    const unFollowUser = async (uuid: string) => {
        const res = await hookApi(() =>
            apiClient.clientFollowUnFollow({
                parameter: { userUuid: uuid },
            }),
        )
        console.log(res)
        refetch()
        toast({
            status: 'success',
            description: 'You have successfully unfollowed',
            duration: 3000,
        })
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
    const pagesQuantity = postLimit
    return {
        postPage,
        outerLimit,
        innerLimit,
        activeStyles,
        normalStyles,
        separatorStyles,
        handlePageChange,
        pagesQuantity,
        page,
        userinfo,
        followUser,
        followList,
        isOpen,
        onClose,
        onOpen,
        logOut,
        unFollowUser,
    }
}

// view
const FollowPageView: FC<ReturnType<typeof useFollowPage>> = () => {
    const {
        postPage,
        outerLimit,
        innerLimit,
        activeStyles,
        normalStyles,
        separatorStyles,
        handlePageChange,
        pagesQuantity,
        page,
        userinfo,
        // followUser,
        followList,
        isOpen,
        onClose,
        onOpen,
        logOut,
        unFollowUser,
    } = useFollowPage()

    const followListData = (
        <>
            {followList.map((data) => {
                return (
                    <Tr key={data.uuid}>
                        <Td>{data.name}</Td>
                        <Td>
                            {/* {!followList ? (
                                <Button onClick={() => followUser(data.customer.uuid)} color={'blue'} bg={'white'}>
                                    <AddIcon />
                                </Button>
                            ) : (
                                <Button onClick={() => unFollowUser(data.customer.uuid)} color={'red'} bg={'white'}>
                                    <AddIcon />
                                </Button>
                            )} */}
                            <Button onClick={() => unFollowUser(data.uuid)} colorScheme={'red'}>
                                <AddIcon />
                            </Button>
                        </Td>
                    </Tr>
                )
            })}
        </>
    )

    return (
        <>
            {/* <span>this page is SrcRoutesPage</span> */}
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
                    Follow page
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
                    Follwing page
                </Box>
                <Box textAlign={'center'} color={'#7BCCB5'} fontSize={'2xl'}>
                    Hello {userinfo.name} the list of user's you follow and their posts :)
                </Box>
                <Box padding={'5rem'}>
                    <TableContainer>
                        <Table>
                            <Thead>
                                <Tr>
                                    <Td color={'#7BCCB5'} fontSize={'2xl'}>
                                        Name
                                    </Td>
                                    {/* <Td color={'#7BCCB5'} fontSize={'2xl'}>
                                        Posts
                                    </Td> */}
                                    <Td color={'#7BCCB5'} fontSize={'2xl'}>
                                        Unfollow
                                    </Td>
                                </Tr>
                            </Thead>
                            <Tbody>{followListData}</Tbody>
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
                <Box textAlign={'end'} padding={'3rem'} display={'flex'} justifyContent={'space-between'}>
                    <Button bg={'#7BCCB5'} onClick={postPage}>
                        Posts
                    </Button>
                </Box>
            </Box>
        </>
    )
}

export const SrcRoutesPage: FC = () => {
    const hookItems = useFollowPage()
    return <FollowPageView {...hookItems} />
}

export default SrcRoutesPage
