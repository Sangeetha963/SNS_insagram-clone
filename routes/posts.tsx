import { AddIcon, ChevronLeftIcon, ChevronRightIcon, DeleteIcon, StarIcon } from '@chakra-ui/icons'
import {
    Avatar,
    AvatarGroup,
    // Alert,
    // AlertIcon,
    Box,
    Button,
    ChakraProvider,
    Grid,
    Hide,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    Table,
    TableContainer,
    Tbody,
    Td,
    Textarea,
    Thead,
    Tr,
    useDisclosure,
    useToast,
} from '@chakra-ui/react'
// import { background } from '@chakra-ui/styled-system'
import { zodResolver } from '@hookform/resolvers/zod'
import { Container, Next, PageGroup, Paginator, Previous } from 'chakra-paginator'
import React, { FC, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
// import { icons } from 'react-icons'
// import { CgChevronLeft, CgChevronRight } from 'react-icons/cg'
import { useNavigate } from 'react-router'
import { useParams } from 'react-router-dom'
import * as z from 'zod'

import { Schemas } from '~/apis/types'
// import EditContent from '~/components/common/EditContent.tsx'
// import { Schemas } from '~/apis/types'
import { useApiClient } from '~/util/create-api-client'
import { useQuerySuspense } from '~/util/hooks/use-query-suspense'

const formSchema = z.object({
    postContent: z
        .string()
        .min(5, { message: 'postContent must be minimum 5 characters' })
        .max(140, { message: 'postContent must be maximum 140 characters' }),
})
const editSchema = z.object({
    content: z
        .string()
        .min(5, { message: 'editContent must be minimum 5 characters ' })
        .max(140, { message: 'editContent must be maximum 140 characters ' }),
})
type formSchema = z.infer<typeof formSchema>
type editSchema = z.infer<typeof editSchema>
const usePostPage = () => {
    // NOTE: this code is executable after login
    const [page, setPage] = useState(1)
    const postLimit = 10
    const pageLimit = 10
    const params = useParams()
    // const customerUuid = params.customerUuid || ''
    const { hookApi, apiClient } = useApiClient()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const { isOpen: isOpenLogout, onOpen: onOpenLogout, onClose: onCloseLogout } = useDisclosure()
    const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure()
    const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure()
    const [targetData, setTargetData] = useState<Schemas.PostEntities | null>(null)
    const handleopen = (data: Schemas.PostEntities) => {
        setTargetData(data)
        onOpenDelete()
    }
    const handleopenEdit = (data: Schemas.PostEntities) => {
        setTargetData(data)
        onOpenEdit()
    }
    const [showsuccess, setShowsuccess] = useState(undefined)
    const toast = useToast()
    // const [editPost, setEditPost] = useState('')
    // const [btnClass, setBtnClass] = useState(false)

    // const [btnColor, setBtnColor] = useState('red')
    // const button = () => {
    //     btnClass ? setBtnClass(false) : setBtnClass(true)
    // }
    // const color = () => {
    //     btnColor === 'red' ? setBtnColor('blue') : setBtnColor('red')
    // }
    // useEffect(() => {
    //     if (showsuccess) {
    //         const { message, status } = showsuccess

    //         toast({
    //             title: showsuccess,
    //             description: message,
    //             status: 'success',
    //             duration: 3000,
    //             position: 'top',
    //             isClosable: true,
    //         })
    //     }
    // }, [showsuccess, toast])
    const navigate = useNavigate()
    // const cancelRef = React.useRef(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<formSchema>({ resolver: zodResolver(formSchema), defaultValues: { postContent: '' } })
    const handleClose = () => {
        onClose()
        reset()
    }

    const {
        register: register2,
        handleSubmit: handleSubmit2,
        formState: { errors: errors2 },
    } = useForm<editSchema>({ resolver: zodResolver(editSchema), defaultValues: { content: '' } })

    const { data: postList, refetch } = useQuerySuspense(['postList', page, postLimit], async () => {
        const res = await hookApi(() => apiClient.clientPostGetPostList({ parameter: { limit: postLimit, page: page } }))
        console.log(res)
        return res.list
    })
    const { data: userinfo } = useQuerySuspense(['list'], async () => {
        const res = await hookApi(() => apiClient.clientCustomerGetUser())
        return res
    })
    const deletePost = async (postUuid: string) => {
        await hookApi(() => apiClient.clientPostDelete({ parameter: { postUuid: postUuid } }))
        refetch()
        onCloseDelete()
        toast({
            status: 'success',
            description: 'You have successfully deleted the post',
            duration: 3000,
        })
    }
    const createpostSubmit = async (postContent: string) => {
        await hookApi(() =>
            apiClient.clientPostPostPost({
                requestBody: { content: postContent },
            }),
        )
        reset()
        handleClose()
        refetch()
        toast({
            status: 'success',
            position: 'top',
            description: 'You have successfully created a post',
            duration: 3000,
        })
    }
    const logOut = () => {
        navigate('/registration')
    }
    const favourite = () => {
        navigate('/favourite')
    }
    const follow = () => {
        navigate('/follow')
    }
    const mypost = () => {
        navigate('/mypost')
    }
    // const index = () => {
    //     window.location.href = ' http://localhost:3000/'
    // }
    const { data: getUserFavList, refetch: favRefetch } = useQuerySuspense(['getfavList'], async () => {
        const res = await hookApi(() =>
            apiClient.clientFavouriteGetFavouriteList({ parameter: { customerUuid: userinfo?.uuid } }),
        )
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
        favRefetch()
    }
    const unlikePost = async (unlike: string) => {
        await hookApi(() =>
            apiClient.clientFavouriteDeleteFav({
                parameter: { postUuid: unlike },
            }),
        )
        favRefetch()
        toast({
            status: 'success',
            description: 'you unliked the post',
            duration: 3000,
        })
    }

    const { data: userFollowList, refetch: followRefetch } = useQuerySuspense(['followlist'], async () => {
        const res = await hookApi(() => apiClient.clientFollowFollowList({ parameter: { userUuid: userinfo.uuid } }))
        console.log(res)
        return res.list
    })
    const followUser = async (uuid: string) => {
        await hookApi(() =>
            apiClient.clientFollowFollowUser({
                requestBody: { userId: uuid },
                parameter: { userUuid: uuid },
            }),
        )
        followRefetch()
        console.log('hello')
        toast({
            status: 'success',
            description: 'you successfully started following',
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
        followRefetch()
        toast({
            status: 'success',
            description: 'You have successfully unfollowed',
            duration: 3000,
        })
    }
    const editPostContent = async (content: string) => {
        await hookApi(() =>
            apiClient.clientPostUpdate({
                requestBody: { content: content },
                parameter: { postUuid: params.tid || '' },
            }),
        )
        refetch()
        onCloseEdit()
        toast({
            status: 'success',
            position: 'top',
            description: 'You have successfully edited the post',
            duration: 3000,
        })
    }
    const getFavList = getUserFavList.map((dataFav) => {
        return dataFav.uuid
    })
    const followList = userFollowList.map((dataFollow) => {
        return dataFollow.uuid
    })
    const outerlimit = 2
    const innerlimit = 2

    const listString = useMemo(() => {
        return JSON.stringify(postList)
    }, [postList])
    const postData = useMemo(() => {
        return postList || []
    }, [postList])

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
    const pagesQuantity = Math.ceil((postList.length + 1) / pageLimit)

    return {
        postList,
        isOpen,
        onOpen,
        onClose,
        register,
        handleSubmit,
        errors,
        createpostSubmit,
        listString,
        postData,
        showsuccess,
        outerlimit,
        innerlimit,
        normalStyles,
        activeStyles,
        separatorStyles,
        handlePageChange,
        page,
        pagesQuantity,
        logOut,
        isOpenLogout,
        onCloseLogout,
        onOpenLogout,
        deletePost,
        isOpenDelete,
        onCloseDelete,
        onOpenDelete,
        targetData,
        handleopen,
        isOpenEdit,
        onCloseEdit,
        onOpenEdit,
        favouritePost,
        getFavList,
        favourite,
        editPostContent,
        register2,
        handleSubmit2,
        errors2,
        follow,
        userinfo,
        followUser,
        followList,
        toast,
        handleopenEdit,
        setShowsuccess,
        hookApi,
        apiClient,
        mypost,
        // index,
        handleClose,
        unlikePost,
        unFollowUser,
    }
}

const PostPageView: FC<ReturnType<typeof usePostPage>> = () => {
    const {
        isOpen,
        // onClose,
        onOpen,
        register,
        handleSubmit,
        errors,
        createpostSubmit,
        postData,
        outerlimit,
        innerlimit,
        normalStyles,
        activeStyles,
        separatorStyles,
        handlePageChange,
        page,
        pagesQuantity,
        logOut,
        isOpenLogout,
        onCloseLogout,
        onOpenLogout,
        deletePost,
        isOpenDelete,
        onCloseDelete,
        targetData,
        handleopen,
        // isOpenEdit,
        // onCloseEdit,
        favouritePost,
        getFavList,
        favourite,
        // editPostContent,
        // register2,
        // handleSubmit2,
        // errors2,
        follow,
        userinfo,
        followUser,
        // handleopenEdit,
        // hookApi,
        // apiClient,
        followList,
        mypost,
        // index,
        handleClose,
        unlikePost,
        unFollowUser,
    } = usePostPage()

    const createPostData = (
        <>
            {postData.map((data) => {
                return (
                    <Tr key={data.uuid}>
                        <Td>{data.customer.name}</Td>
                        <Td>{data.content}</Td>

                        <Td>
                            {/* {!getFavList ? (
                                <Button onClick={() => favouritePost(data.uuid)} bg={'white'} color={'blue'}>
                                    <StarIcon /> */}

                            {/* <Button onClick={() => favouritePost(data.uuid)} bg={'white'} color={'red'}>
                                <StarIcon />
                            </Button> */}
                            {!getFavList.includes(data.uuid) ? (
                                <Button onClick={() => favouritePost(data.uuid)} bg={'#7BCCB5'}>
                                    <StarIcon />
                                </Button>
                            ) : (
                                <Button onClick={() => unlikePost(data.uuid)} colorScheme={'red'}>
                                    <StarIcon />
                                </Button>
                            )}
                        </Td>
                        <Td>
                            {/* <Button onClick={() => followUser(data.customer.uuid)} bg={'white'} color={'red'}>
                                {' '}
                                <AddIcon />{' '}
                            </Button> */}
                            {userinfo.uuid != data.customer.uuid ? (
                                <Td>
                                    {!followList.includes(data.customer.uuid) ? (
                                        <Button onClick={() => followUser(data.customer.uuid)} bg={'#7BCCB5'}>
                                            <AddIcon />
                                        </Button>
                                    ) : (
                                        <Button onClick={() => unFollowUser(data.customer.uuid)} colorScheme={'red'}>
                                            <AddIcon />
                                        </Button>
                                    )}
                                </Td>
                            ) : (
                                <Td>
                                    <Hide />
                                </Td>
                            )}
                        </Td>
                        <Td>
                            {userinfo.uuid == data.customer.uuid ? (
                                <Td>
                                    {/* {() => deletePost(data.uuid)} */}

                                    <Button onClick={() => handleopen(data)} bg={'#7BCCB5'} color={'red'}>
                                        <DeleteIcon color={'red'} />
                                    </Button>
                                </Td>
                            ) : (
                                <Td>
                                    <Hide />
                                </Td>
                            )}
                        </Td>
                    </Tr>
                )
            })}

            <Box>
                <Modal isOpen={isOpenDelete} onClose={onCloseDelete}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader color={'red'}>Are you sure you want to delete?</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody />
                        <ModalFooter>
                            <Button onClick={onCloseDelete} bg={'#7BCCB5'}>
                                Cancel
                            </Button>
                            <Button onClick={() => deletePost(targetData!.uuid)} bg={'#7BCCB5'}>
                                Delete
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </Box>
        </>
    )

    return (
        <>
            <Box>
                <Box
                    width={'100%'}
                    color={' #CC7A92'}
                    bg={'#7BCCB5'}
                    padding={'1.5 rem'}
                    height={'50'}
                    fontFamily={'sans-serif'}
                    fontSize={'2xl'}
                    justifyContent={'space-between'}
                    display={'flex'}>
                    Post page
                    {/* <Button bg={'#7BCCB5'} onClick={index} color={' #CC7A92'}>
                        Dashboard
                    </Button> */}
                    <Button bg={'#7BCCB5'} onClick={onOpenLogout} color={' #CC7A92'}>
                        Logout
                    </Button>
                    <Modal isOpen={isOpenLogout} onClose={onCloseLogout}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader color={'red'}> Are you sure you want to logout?</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody />
                            <ModalFooter>
                                <Button onClick={onCloseLogout} bg={'#7BCCB5'}>
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
                    Top Page
                </Box>
                <AvatarGroup spacing={'1rem'}>
                    <Avatar bg="teal.500" size={'lg'} />
                    <Box textAlign={'center'} fontSize={'2xl'} color={'#7BCCB5'}>
                        {userinfo.name} Welcome back!
                    </Box>
                </AvatarGroup>
                {/* <Avatar>
                    <AvatarBadge bgSize={'1.5rem'} />
                </Avatar> */}

                <Box padding={'3rem'} textAlign={'end'}>
                    <Button onClick={onOpen} bg={'#7BCCB5'}>
                        + Post
                    </Button>

                    <Modal isOpen={isOpen} onClose={handleClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Create new posts</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <Stack spacing={3}>
                                    {/* <Input placeholder="create new post" /> */}
                                    <Textarea placeholder="create new post" {...register('postContent')} />
                                    {errors.postContent?.message && (
                                        <Box color={'red'}>
                                            <p>{errors.postContent?.message}</p>
                                        </Box>
                                    )}
                                </Stack>
                            </ModalBody>
                            <ModalFooter>
                                <Button bg={'#7BCCB5'} onClick={handleClose}>
                                    cancel
                                </Button>
                                <Button
                                    onClick={handleSubmit((data) => {
                                        createpostSubmit(data.postContent)
                                    })}
                                    bg={'#7BCCB5'}>
                                    submit
                                </Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </Box>
                <Box>
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
                                    {/* <Td color={'#7BCCB5'} fontSize={'2xl'}>
                                        Edit
                                    </Td> */}
                                    <Td color={'#7BCCB5'} fontSize={'2xl'}>
                                        Favourite
                                    </Td>
                                    <Td color={'#7BCCB5'} fontSize={'2xl'}>
                                        Follow
                                    </Td>
                                    <Td color={'#7BCCB5'} fontSize={'2xl'}>
                                        Delete
                                    </Td>
                                </Tr>
                            </Thead>
                            <Tbody>{createPostData}</Tbody>
                        </Table>
                    </TableContainer>
                </Box>
                {/* {showsuccess && (
                    <Alert status="success">
                        <AlertIcon />
                        Successfully posted
                    </Alert>
                )} */}
            </Box>
            <Box>
                <ChakraProvider>
                    <Paginator
                        activeStyles={activeStyles}
                        innerLimit={innerlimit}
                        currentPage={page}
                        outerLimit={outerlimit}
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
                    <Button bg={'#7BCCB5'} onClick={favourite}>
                        Your Favourite
                    </Button>
                    {/* <Box textAlign={'center'} padding={'3rem'}> */}
                    <Button bg={'#7BCCB5'} onClick={follow}>
                        You Following
                    </Button>
                    <Button bg={'#7BCCB5'} onClick={mypost}>
                        my post
                    </Button>
                    {/* </Box> */}
                </Box>
            </Box>
        </>
    )
}

export const PostPage: FC = () => {
    const hookItems = usePostPage()
    return <PostPageView {...hookItems} />
}

export default PostPage
