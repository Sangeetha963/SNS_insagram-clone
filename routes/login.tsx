import { Box, Button, Checkbox, FormControl, FormLabel, Input, InputGroup } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
// import { registerPromiseAbort } from 'jotai/core/suspensePromise'
import { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import * as z from 'zod'

import { Schemas } from '~/apis/types'
// import { CButton } from '~/components/common/cButton/CButton'
import { useAuthState } from '~/hooks/store/use-auth-state'
import { clientSigninWithPasswordRequestDtoSchema } from '~/types/zod-scheme'
// import { clientSigninWithPasswordRequestDtoSchema } from '~/types/zod-scheme'
import { useApiClient } from '~/util/create-api-client'

const formSchema = z.object({
    email: z.string().min(1, { message: 'Email is required' }).email({
        message: 'Email is required',
    }),
    password: z
        .string()
        .min(8, { message: 'Password must be more than 8 characters' })
        .max(32, { message: 'Password must be less than 32 characters' }),
})
type formSchema = z.infer<typeof formSchema>

// logic
const useLoginPage = () => {
    const { hookApi, apiClient } = useApiClient()
    const { setAccessToken } = useAuthState()
    const [isshown, setIsshown] = useState(false)
    const togglePassword = () => {
        setIsshown((isshown) => !isshown)
    }
    const navigate = useNavigate()
    const regPage = () => {
        navigate('/registration')
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Schemas.ClientSigninWithPasswordRequestDto, formSchema>({
        mode: 'onBlur',
        resolver: zodResolver(clientSigninWithPasswordRequestDtoSchema),
        defaultValues: {
            id: '',
            password: '',
        },
    })
    // const favPost = async (reset: Schemas.ClientCustomerResetPasswordDto) => {
    //     await hookApi(() =>
    //         apiClient.clientCustomerPostResetPassword({
    //             requestBody: { credential: reset.credential, password: reset.password },
    //         }),
    //     )
    // }
    // const example = async (change: Schemas.ClientCustomerChangePasswordDto)=>{
    //     await hookApi(()=>apiClient.clientCustomerPutChangePassword({requestBody: {oldPassword: change.oldPassword, password: change.password}}))
    // }
    // HINT
    const onLogin = async (value: Schemas.ClientSigninWithPasswordRequestDto) => {
        try {
            const res = await hookApi(() =>
                apiClient.clientAuthSigninWithId({
                    requestBody: {
                        id: value.id,
                        password: value.password,
                    },
                }),
            )
            setAccessToken({
                accessToken: res.access_token,
                tokenCreatedAt: new Date(),
                expiresIn: res.expires_in,
            })
            navigate('/posts')
        } catch (e) {
            console.log(e)
        }
    }
    // const NewRegistration = () => {
    //     navigate('/index')
    // }

    // HINT
    // isValid

    return { onLogin, register, errors, handleSubmit, isshown, togglePassword, regPage }
}

// view
const LoginPageView: FC<ReturnType<typeof useLoginPage>> = (props) => {
    const { onLogin, register, errors, handleSubmit, isshown, togglePassword, regPage } = props

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
                Login page
                <Button bg={'#7BCCB5'} onClick={regPage}>
                    Registration
                </Button>
            </Box>

            <Box fontSize={'2xl'} textAlign={'center'} textShadow={'1px 1px #ff0000'} color={'#7BCCB5'}>
                {/* <Avatar bg="teal.500" /> */}
                <h3> Login</h3>
            </Box>
            <Box padding={'5rem'} width={'40%'} textAlign={'center'} margin={'10rem'}>
                <div>
                    <form>
                        <Box>
                            <div>
                                <FormControl isRequired>
                                    <FormLabel>Email</FormLabel>
                                    <InputGroup>
                                        <Input placeholder={'Email'} {...register('id')} />
                                        {errors.id?.message && (
                                            <Box color={'red'}>
                                                <p>{errors.id?.message}</p>
                                            </Box>
                                        )}
                                    </InputGroup>
                                </FormControl>
                            </div>
                        </Box>
                        <Box>
                            <div>
                                <FormControl isRequired>
                                    <FormLabel>Password</FormLabel>
                                    <InputGroup>
                                        <Input
                                            placeholder={'Password'}
                                            {...register('password')}
                                            type={isshown ? 'text' : 'password'}
                                        />
                                        {errors.password?.message && (
                                            <Box color={'red'}>
                                                <p>{errors.password?.message}</p>
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
                        </Box>
                        <div>
                            <Box display={'flex'}>
                                <Button onClick={handleSubmit(onLogin)} bg={'#7BCCB5'}>
                                    Login
                                </Button>
                            </Box>
                        </div>
                        {/* <p>this page is LoginPage</p> */}
                    </form>
                </div>
            </Box>
        </>
    )
}

export const LoginPage: FC = () => {
    const hookItems = useLoginPage()
    return <LoginPageView {...hookItems} />
}

export default LoginPage
