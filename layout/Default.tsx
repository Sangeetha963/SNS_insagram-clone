import { Box, Heading, Image, Link, List, ListItem, Text } from '@chakra-ui/react'
import { FC, ReactNode } from 'react'

import logo from '~/assets/images/img-logo.svg'

type Props = {
    children?: ReactNode
}

const Content = ({ children }: { children: ReactNode }) => <>{children}</>

export const Default: FC<Props> = ({ children }) => {
    return (
        <>
            <Box display="flex" flexDirection="column" minHeight="100vh">
                <Box as="header" px="6" pb={6}>
                    <Heading as="h1" maxWidth="200px">
                        <Image src={logo} alt="株式会社notespace 企業ロゴ" />
                    </Heading>
                </Box>
                <Box as="main" flex="1">
                    <Box px="5" pb="10" height="100%">
                        <Content>{children}</Content>
                    </Box>
                </Box>
                <Box as="footer" background="#56647a">
                    <Box p="10" display="flex" columnGap="10" justifyContent="center">
                        <Box maxWidth="200px">
                            <Image src={logo} alt="株式会社notespace 企業ロゴ" />
                        </Box>
                        <Box>
                            <Text fontWeight="bold">タイトル</Text>
                            <List>
                                <ListItem mt="4" _first={{ mt: '4' }}>
                                    <Link href="#" fontSize="sm">
                                        ダミーリンク
                                    </Link>
                                </ListItem>
                                <ListItem mt="4" _first={{ mt: '4' }}>
                                    <Link href="#" fontSize="sm">
                                        ダミーリンク
                                    </Link>
                                </ListItem>
                                <ListItem mt="4" _first={{ mt: '4' }}>
                                    <Link href="#" fontSize="sm">
                                        ダミーリンク
                                    </Link>
                                </ListItem>
                                <ListItem mt="4" _first={{ mt: '4' }}>
                                    <Link href="#" fontSize="sm">
                                        ダミーリンク
                                    </Link>
                                </ListItem>
                                <ListItem mt="4" _first={{ mt: '4' }}>
                                    <Link href="#" fontSize="sm">
                                        ダミーリンク
                                    </Link>
                                </ListItem>
                            </List>
                        </Box>
                        <Box>
                            <Text fontWeight="bold">タイトル</Text>
                            <List>
                                <ListItem mt="4" _first={{ mt: '4' }}>
                                    <Link href="#" fontSize="sm">
                                        ダミーリンク
                                    </Link>
                                </ListItem>
                                <ListItem mt="4" _first={{ mt: '4' }}>
                                    <Link href="#" fontSize="sm">
                                        ダミーリンク
                                    </Link>
                                </ListItem>
                                <ListItem mt="4" _first={{ mt: '4' }}>
                                    <Link href="#" fontSize="sm">
                                        ダミーリンク
                                    </Link>
                                </ListItem>
                                <ListItem mt="4" _first={{ mt: '4' }}>
                                    <Link href="#" fontSize="sm">
                                        ダミーリンク
                                    </Link>
                                </ListItem>
                                <ListItem mt="4" _first={{ mt: '4' }}>
                                    <Link href="#" fontSize="sm">
                                        ダミーリンク
                                    </Link>
                                </ListItem>
                            </List>
                        </Box>
                        <Box>
                            <Text fontWeight="bold">タイトル</Text>
                            <List>
                                <ListItem mt="4" _first={{ mt: '4' }}>
                                    <Link href="#" fontSize="sm">
                                        ダミーリンク
                                    </Link>
                                </ListItem>
                                <ListItem mt="4" _first={{ mt: '4' }}>
                                    <Link href="#" fontSize="sm">
                                        ダミーリンク
                                    </Link>
                                </ListItem>
                                <ListItem mt="4" _first={{ mt: '4' }}>
                                    <Link href="#" fontSize="sm">
                                        ダミーリンク
                                    </Link>
                                </ListItem>
                                <ListItem mt="4" _first={{ mt: '4' }}>
                                    <Link href="#" fontSize="sm">
                                        ダミーリンク
                                    </Link>
                                </ListItem>
                                <ListItem mt="4" _first={{ mt: '4' }}>
                                    <Link href="#" fontSize="sm">
                                        ダミーリンク
                                    </Link>
                                </ListItem>
                            </List>
                        </Box>
                        <Box>
                            <Text fontWeight="bold">タイトル</Text>
                            <List>
                                <ListItem mt="4" _first={{ mt: '4' }}>
                                    <Link href="#" fontSize="sm">
                                        ダミーリンク
                                    </Link>
                                </ListItem>
                                <ListItem mt="4" _first={{ mt: '4' }}>
                                    <Link href="#" fontSize="sm">
                                        ダミーリンク
                                    </Link>
                                </ListItem>
                                <ListItem mt="4" _first={{ mt: '4' }}>
                                    <Link href="#" fontSize="sm">
                                        ダミーリンク
                                    </Link>
                                </ListItem>
                                <ListItem mt="4" _first={{ mt: '4' }}>
                                    <Link href="#" fontSize="sm">
                                        ダミーリンク
                                    </Link>
                                </ListItem>
                                <ListItem mt="4" _first={{ mt: '4' }}>
                                    <Link href="#" fontSize="sm">
                                        ダミーリンク
                                    </Link>
                                </ListItem>
                            </List>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    )
}
