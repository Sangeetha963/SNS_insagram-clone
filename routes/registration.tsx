import {
    Avatar,
    // Alert,
    // AlertIcon,
    Box,
    Button,
    Checkbox,
    FormControl,
    // FormErrorMessage,
    // FormHelperText,
    FormLabel,
    Input,
    InputGroup,
    useToast,
} from '@chakra-ui/react'
// import { Checkbox, CheckboxGroup } from '@chakra-ui/react'
// import { Input } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
//import { useMutation } from '@tanstack/react-query'
// import { isError } from 'lodash-es'
// import { type } from 'os'
import React, { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import * as z from 'zod'

import { Schemas } from '~/apis/types'
// import { CButton } from '~/components/common/cButton/CButton'
// import { TypedLink } from '~/renderer/Link'
import { useApiClient } from '~/util/create-api-client'
// import { useQuerySuspense } from '~/util/hooks/use-query-suspense'

// import { useQuerySuspense } from '~/util/hooks/use-query-suspense'
// import { useApiClient } from '~/util/create-api-client'
// import { useQuerySuspense } from '~/util/hooks/use-query-suspense'
// import IcTwotoneArrowBackIos from '~icons/ic/twotone-arrow-back-ios'
// import IcTwotoneArrowForwardIos from '~icons/ic/twotone-arrow-forward-ios'

// type FormType = {
//     name: string
//     email: string
//     password: string
//     passwordConfirm: string
// }

const formSchema = z
    .object({
        name: z.string().min(2, { message: 'min 20 characters are required' }),
        email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Email is invalid' }),
        password: z
            .string()
            .min(8, { message: 'password must be more than 8 characters' })
            .max(32, { message: 'password must be less than 32 characters' }),
        passwordConfirm: z.string().min(8, { message: 'Confirm Password is required' }),
    })
    .refine((data) => data.password === data.password, {
        path: ['passwordConfirm'],
        message: "Password don't match",
    })

type formSchema = z.infer<typeof formSchema>

// logic
const useIndexPage = () => {
    // NOTE: this code is executable after login
    // const [page, setPage] = useState(1)
    const { hookApi, apiClient } = useApiClient()
    const navigate = useNavigate()
    const [input, setInput] = useState('')
    const [isshown, setIsshown] = useState(false)
    const togglePassword = () => {
        setIsshown((isshown) => !isshown)
    }
    const [shown, setShown] = useState(false)
    const TogglePassword = () => {
        setShown((shown) => !shown)
    }
    const [showsuccess, setShowsuccess] = useState(false)
    const toast = useToast()
    const handleInputChange = (e: { target: { value: React.SetStateAction<string> } }) => setInput(e.target.value)
    // const isError = input === ''
    const loginPage = () => {
        navigate('/login')
    }
    // const snsPage = () => {
    //     window.location.href = ' http://localhost:3000/'
    // }

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<formSchema>({ resolver: zodResolver(formSchema) })
    // const { data: postList } = useQuerySuspense(['postList', page], async () => {
    //     const res = await hookApi(() => apiClient.clientPostGetPostList({ parameter: { page: page } }))
    //     return res.list ?? []
    // })

    const registration = async (inputs: Schemas.ClientCustomerCreateDto) => {
        console.log(inputs)

        await hookApi(() =>
            apiClient.clientCustomerCreateUser({
                requestBody: {
                    name: inputs.name,
                    email: inputs.email,
                    password: inputs.password,
                    passwordConfirm: inputs.passwordConfirm,
                },
            }),
        )
        setShowsuccess(true)
        reset()
        toast({
            status: 'success',
            description: 'successfully registered login for posting...',
            duration: 5000,
        })
        // navigate('/posts')
    }

    // const deleteWithdrawal = async (params: string) => {
    //     await hookApi(apiClient.clientCustomerDeleteWithdrawal)
    // }

    // const RestPassword = async (params: string) => {
    //     await hookApi
    // }

    // const onClickButton = () => {
    //     alert('clicked')
    // }

    return {
        registration,
        // isError,
        handleInputChange,
        input,
        handleSubmit,
        register,
        errors,
        isshown,
        togglePassword,
        showsuccess,
        loginPage,
        shown,
        TogglePassword,
        // snsPage,
    }
}

// view
const IndexPageView: FC<ReturnType<typeof useIndexPage>> = (props) => {
    const {
        registration,
        // isError,
        handleInputChange,
        input,
        handleSubmit,
        register,
        errors,
        isshown,
        togglePassword,
        // showsuccess,
        loginPage,
        shown,
        // snsPage,
        // TogglePassword,
    } = props

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
                justifyContent={'space-between'}
                display={'flex'}>
                Registration page
                {/* <Button bg={'#7BCCB5'} onClick={snsPage}>
                    snsPage
                </Button> */}
                <Button bg={'#7BCCB5'} onClick={loginPage}>
                    login
                </Button>
                {/* <Button bg={'#7BCCB5'} onClick={snsPage}>
                    HomePage
                </Button> */}
            </Box>

            <Box padding={'10rem'}>
                <Box textAlign={'center'} fontSize={'3xl'} textShadow={'1px 1px #ff0000'} color={'#7BCCB5'}>
                    {' '}
                    {/* <AvatarGroup spacing={'1rem'}> */}
                    <Avatar bg="teal.500" size={'lg'} />
                    {/* </AvatarGroup> */}
                    <h3> Sign up</h3>
                </Box>
                <Box padding={'3rem'}>
                    <Box width={'30%'} textAlign={'center'}>
                        <div>
                            {/* <Navigate to="/login.tsx" replace={true} /> */}
                            <form>
                                <Box>
                                    <div>
                                        <FormControl isRequired>
                                            <FormLabel>Name</FormLabel>
                                            <InputGroup>
                                                <Input placeholder="Name" {...register('name')} />
                                                {errors.name?.message && (
                                                    <Box color={'red'}>
                                                        <span>
                                                            <p>{errors.name?.message}</p>
                                                        </span>
                                                    </Box>
                                                )}
                                            </InputGroup>
                                        </FormControl>
                                    </div>
                                    <div>
                                        <FormControl isRequired>
                                            <FormLabel>email</FormLabel>
                                            <InputGroup>
                                                <Input
                                                    type="email"
                                                    value={input}
                                                    {...register('email')}
                                                    onChange={handleInputChange}
                                                />
                                                {/* {isError ? (
                                                    <FormHelperText>Enter your mail for registration</FormHelperText>
                                                ) : (
                                                    <FormErrorMessage>Email is required</FormErrorMessage>
                                                )} */}
                                                {errors.email?.message && (
                                                    <Box color={'red'}>
                                                        <span>
                                                            <p>{errors.email?.message}</p>
                                                        </span>
                                                    </Box>
                                                )}
                                            </InputGroup>
                                        </FormControl>
                                    </div>
                                    <div>
                                        <FormControl isRequired>
                                            <FormLabel>Password</FormLabel>
                                            <InputGroup>
                                                <Input
                                                    placeholder="password"
                                                    {...register('password')}
                                                    type={isshown ? 'text' : 'password'}
                                                />
                                                {errors.password?.message && (
                                                    <Box color={'red'}>
                                                        <span>
                                                            <p>{errors.password?.message}</p>
                                                        </span>
                                                    </Box>
                                                )}
                                            </InputGroup>
                                        </FormControl>
                                    </div>
                                    <div>
                                        <FormControl>
                                            <FormLabel htmlFor="checkbox">
                                                Show Password
                                                <InputGroup>
                                                    <Checkbox
                                                        id="checkbox"
                                                        type={'checkbox'}
                                                        checked={isshown}
                                                        onChange={togglePassword}
                                                    />
                                                </InputGroup>
                                            </FormLabel>
                                        </FormControl>
                                    </div>
                                    <div>
                                        <FormControl>
                                            <FormLabel>ConfirmPassword</FormLabel>
                                            <InputGroup>
                                                <Input
                                                    placeholder="confirmPassword"
                                                    {...register('passwordConfirm')}
                                                    type={shown ? 'text' : 'password'}
                                                />
                                                {errors.passwordConfirm?.message && (
                                                    <Box color={'red'}>
                                                        <p>{errors.passwordConfirm?.message}</p>
                                                    </Box>
                                                )}
                                            </InputGroup>
                                        </FormControl>
                                    </div>
                                </Box>
                                <div>
                                    <Box display={'flex'} margin={'0.5rem'}>
                                        <Button onClick={handleSubmit((data) => registration(data))} bg={'#7BCCB5'}>
                                            register
                                        </Button>
                                    </Box>
                                </div>
                            </form>
                        </div>
                    </Box>
                </Box>
            </Box>
        </>
    )
}

export const IndexPage: FC = () => {
    const hookItems = useIndexPage()
    return <IndexPageView {...hookItems} />
}

export default IndexPage
