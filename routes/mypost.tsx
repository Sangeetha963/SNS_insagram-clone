import { ChevronLeftIcon, ChevronRightIcon, DeleteIcon } from '@chakra-ui/icons'
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
import { zodResolver } from '@hookform/resolvers/zod'
// import { useMutation } from '@tanstack/react-query'
import { Container, Next, PageGroup, Paginator, Previous } from 'chakra-paginator'
import { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import * as z from 'zod'

import { Schemas } from '~/apis/types'
import { CEdit } from '~/components/common/cEdit/CEdit'
import { useApiClient } from '~/util/create-api-client'
import { useQuerySuspense } from '~/util/hooks/use-query-suspense'

const editSchema = z.object({
    content: z
        .string()
        .min(5, { message: 'editContent must be minimum 5 characters' })
        .max(140, { message: 'editContent must be maximum 140 characters' }),
})
type editSchema = z.infer<typeof editSchema>
const createSchema = z.object({
    postContent: z
        .string()
        .min(5, { message: 'postContent must be minimum 5 characters' })
        .max(140, { message: 'postContent must be maximum 140 characters' }),
})
type createSchema = z.infer<typeof createSchema>
// logic
const useSrcMypostTsxPage = () => {
    const { hookApi, apiClient } = useApiClient()
    const navigate = useNavigate()
    const toast = useToast()
    // const params = useParams()
    // const tid = params.tid || ''
    // const [post, setPost] = useState<Schemas.PostEntities | null>(null)
    const [page, setPage] = useState(1)
    const followLimit = 1
    const { isOpen, onClose, onOpen } = useDisclosure()
    const { isOpen: isOpenEdit, onClose: onCloseEdit, onOpen: onOpenEdit } = useDisclosure()
    const { isOpen: isOpenDelete, onClose: onCloseDelete, onOpen: onOpenDelete } = useDisclosure()
    const { isOpen: isOpenCreate, onClose: onCloseCreate, onOpen: onOpenCreate } = useDisclosure()
    const [targetData, setTargetData] = useState<Schemas.PostEntities | null>(null)
    const handleopen = (data: Schemas.PostEntities) => {
        setTargetData(data)
        onOpenEdit()
    }
    const handleopenDelete = (data: Schemas.PostEntities) => {
        setTargetData(data)
        onOpenDelete()
    }
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<editSchema>({ resolver: zodResolver(editSchema), defaultValues: { content: '' } })
    const handleClose = () => {
        onCloseEdit()
        reset()
    }
    const handleClose2 = () => {
        onCloseCreate()
        reset2()
    }
    const {
        register: register2,
        handleSubmit: handleSubmit2,
        formState: { errors: errors2 },
        reset: reset2,
    } = useForm<createSchema>({ resolver: zodResolver(createSchema), defaultValues: { postContent: '' } })
    const logOut = () => {
        navigate('/login')
    }
    const postPage = () => {
        navigate('/posts')
    }
    const { data: userinfo } = useQuerySuspense(['list'], async () => {
        const res = await hookApi(() => apiClient.clientCustomerGetUser())
        return res
    })
    const { data: userPosts, refetch } = useQuerySuspense(['userpostlist'], async () => {
        const res = await hookApi(() => apiClient.clientPostGetmyPostList({ parameter: { customerUuid: userinfo.uuid } }))
        return res
    })
    // const setpostfunc = (post: Schemas.PostEntities) => {
    //     setPost(post)
    // }
    // const editPost = async (content: string) => {
    //     await hookApi(() =>
    //         apiClient.clientPostUpdate({
    //             requestBody: { content: content },
    //             parameter: { postUuid: content },
    //         }),
    //     )
    //     reset()
    //     handleClose()
    //     refetch()
    //     toast({
    //         status: 'success',
    //         position: 'bottom',
    //         description: 'sucessfully edited the post',
    //         duration: 3000,
    //     })
    // }
    const createPost = async (postContent: string) => {
        await hookApi(() => apiClient.clientPostPostPost({ requestBody: { content: postContent } }))
        reset2()
        handleClose2()
        refetch()
        toast({
            status: 'success',
            description: 'successfully created new post',
            position: 'top',
            duration: 3000,
        })
    }
    const editPost = async (dto: Schemas.ClientPostUpdateDto) => {
        await hookApi(() =>
            apiClient.clientPostUpdate({
                requestBody: { content: dto.content },
                parameter: { postUuid: '' },
            }),
        )
    }
    // const editPost = useMutation( ['editPosts'], async (content: string)=> {
    //     return await hookApi(()=> {
    //         return apiClient.clientPostUpdate({ parameter: { postUuid: post?.uuid },
    //             requestBody: {content},
    //         })
    //     })
    // })
    const deletePost = async (postUuid: string) => {
        await hookApi(() => apiClient.clientPostDelete({ parameter: { postUuid: postUuid } }))
        onCloseDelete()
        refetch()
        toast({
            status: 'success',
            position: 'bottom',
            description: 'you have successfully deleted the post',
            duration: 3000,
        })
    }
    const outerLimit = 2
    const innerLimit = 2

    const normalStyles = {
        w: 7,
        fontSize: 'sm',
    }
    const activeStyles = {
        ...normalStyles,
        _hover: {
            bg: 'blue.300',
        },
        bg: 'green.300',
    }
    const separatorStyles = {
        w: 7,
        bg: 'grenn.300',
    }
    const handlePageChange = (page: number) => {
        setPage(page)
        console.log('request new data ->', page)
    }
    const pagesQuantity = followLimit

    return {
        userPosts,
        isOpen,
        onClose,
        onOpen,
        logOut,
        userinfo,
        editPost,
        isOpenEdit,
        onCloseEdit,
        onOpenEdit,
        register,
        handleSubmit,
        errors,
        handleopen,
        postPage,
        deletePost,
        handleopenDelete,
        isOpenDelete,
        onCloseDelete,
        targetData,
        outerLimit,
        innerLimit,
        activeStyles,
        separatorStyles,
        handlePageChange,
        normalStyles,
        pagesQuantity,
        page,
        handleClose,
        register2,
        handleSubmit2,
        errors2,
        createPost,
        isOpenCreate,
        onCloseCreate,
        onOpenCreate,
        handleClose2,
        hookApi,
        apiClient,
        toast,
        refetch,
        reset,
    }
}

// view
const SrcMypostTsxPageView: FC<ReturnType<typeof useSrcMypostTsxPage>> = () => {
    const {
        userPosts,
        isOpen,
        onClose,
        onOpen,
        logOut,
        userinfo,
        // editPost,
        // isOpenEdit,
        // onCloseEdit,
        // onOpenEdit,
        // register,
        // handleSubmit,
        // errors,
        // handleopen,
        postPage,
        deletePost,
        handleopenDelete,
        isOpenDelete,
        onCloseDelete,
        targetData,
        outerLimit,
        innerLimit,
        activeStyles,
        separatorStyles,
        handlePageChange,
        normalStyles,
        pagesQuantity,
        page,
        // handleClose,
        register2,
        handleSubmit2,
        errors2,
        createPost,
        isOpenCreate,
        // onCloseCreate,
        onOpenCreate,
        handleClose2,
        hookApi,
        apiClient,
        toast,
        refetch,
        reset,
    } = useSrcMypostTsxPage()
    const mypostData = (
        <>
            {userPosts.list?.map((data) => {
                return (
                    <Tr key={data.uuid}>
                        <Td>{data.content}</Td>
                        <Td>
                            <CEdit
                                edit={data}
                                submitEdit={async (dto: Schemas.ClientPostUpdateDto) => {
                                    await hookApi(() =>
                                        apiClient.clientPostUpdate({
                                            parameter: { postUuid: data.uuid },
                                            requestBody: { content: dto.content },
                                        }),
                                    )
                                    toast({
                                        status: 'success',
                                        description: 'successfully edited the post',
                                        duration: 3000,
                                    })
                                    reset()
                                    onClose()
                                    refetch()
                                }}
                            />
                        </Td>
                        <Td>
                            <Button onClick={() => handleopenDelete(data)} bg={'#7BCCB5'} color={'red'}>
                                <DeleteIcon color={'red'} />
                            </Button>
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
            {/* <Box>
                <CEdit/>
            </Box>
             */}
        </>
    )

    return (
        <>
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
                All my post
                <Button bg={'#7BCCB5'} onClick={onOpen}>
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
                MyPost page
            </Box>
            <Box textAlign={'center'} color={'#7BCCB5'} fontSize={'2xl'}>
                Hello {userinfo.name} the list of your own posts :)
            </Box>
            <Box padding={'3rem'} textAlign={'end'}>
                <Button onClick={onOpenCreate} bg={'#7BCCB5'}>
                    + Posts
                </Button>
                <Modal isOpen={isOpenCreate} onClose={handleClose2}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Create new posts</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Stack>
                                <Textarea placeholder="create new posts" {...register2('postContent')} />
                                {errors2.postContent?.message && (
                                    <Box color={'red'}>
                                        <p>{errors2.postContent?.message}</p>
                                    </Box>
                                )}
                            </Stack>
                        </ModalBody>
                        <ModalFooter>
                            <Button bg={'#7BCCB5'} onClick={handleClose2}>
                                cancel
                            </Button>
                            <Button
                                onClick={handleSubmit2((data) => {
                                    createPost(data.postContent)
                                })}
                                bg={'#7BCCB5'}>
                                submit
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </Box>
            <Box padding={'5rem'}>
                <TableContainer>
                    <Table>
                        <Thead>
                            <Tr>
                                <Td color={'#7BCCB5'} fontSize={'2xl'}>
                                    Posts
                                </Td>
                                <Td color={'#7BCCB5'} fontSize={'2xl'}>
                                    Edit
                                </Td>
                                <Td color={'#7BCCB5'} fontSize={'2xl'}>
                                    Delete
                                </Td>
                            </Tr>
                        </Thead>
                        <Tbody>{mypostData}</Tbody>
                    </Table>
                </TableContainer>
            </Box>
            {/* <Box>
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
                        <Container>
                            <Previous bg={'#7BCCB5'}>
                                <ChevronLeftIcon />
                            </Previous>
                            <PageGroup />
                            <Next bg={'#7BCCB5'}>
                                <ChevronRightIcon />
                            </Next>
                    </Paginator>
                    <Grid templateRows="repeat(2, 1fr)" templateColumns="repeat(5, 1fr)" gap={3} px={20} mt={20} />
                </ChakraProvider>
            </Box> */}
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
                <Box textAlign={'left'} padding={'3rem'} display={'flex'} justifyContent={'space-between'}>
                    <Button bg={'#7BCCB5'} onClick={postPage}>
                        Posts
                    </Button>
                </Box>
            </Box>
        </>
    )
}

export const SrcMypostTsxPage: FC = () => {
    const hookItems = useSrcMypostTsxPage()
    return <SrcMypostTsxPageView {...hookItems} />
}

export default SrcMypostTsxPage
