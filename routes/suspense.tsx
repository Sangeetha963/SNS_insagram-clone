import { Box, Button, Heading, Skeleton, Stack, Text } from '@chakra-ui/react'
import axios from 'axios'
import { type FC, Suspense, useState } from 'react'
import { useAsync } from 'react-streaming'

import { Link } from '~/renderer/Link'
import { sleep } from '~/util/common'
import { useSsrQuery } from '~/util/hooks/use-ssr-query'

export type SuspensePageProps = {}

export const Page: FC<SuspensePageProps> = () => {
    return (
        <>
            <Suspense fallback={<FallBackPost />}>
                <BlogPost delay={100} />
                <Suspense fallback={<FallBackPost />}>
                    <BlogPost delay={200} />
                </Suspense>
            </Suspense>
            <Box>poe</Box>
            <Suspense fallback={<FallBackPost />}>
                <BlogPost delay={300} />
                <Suspense fallback={<FallBackPost />}>
                    <BlogPost delay={400} />
                </Suspense>
            </Suspense>
        </>
    )
}

type Post = {
    userId: number
    id: number
    title: string
    body: string
}

const FallBackPost = () => (
    <Skeleton>
        <Box p={5} shadow={'md'} borderWidth={'1px'}>
            <Heading as={'h2'} fontSize={'xl'}>
                aa
            </Heading>
            <Text>dummy</Text>
        </Box>
    </Skeleton>
)

const getRandomPostId = async () => {
    await sleep(1)
    return Math.floor(Math.random() * 99) + 1
}

export const BlogPost = ({ delay }: { delay: number }) => {
    const fistPostId = useAsync(`blog-post-id-${delay}`, async () => getRandomPostId())
    const [postId, setPostId] = useState(fistPostId)

    const refetch = async () => {
        setPostId(await getRandomPostId())
    }

    const { data } = useSsrQuery(
        ['blog-post-all', postId],
        async ({ queryKey }) => {
            console.log('start', queryKey[1])
            const data = (await axios(`https://jsonplaceholder.typicode.com/posts/${postId}`)).data as Post
            // await sleep(delay)
            return data
        },
        {
            // refetchInterval: 1000,
        },
    )

    if (!data) {
        console.log('data is loading')
        return (
            <Box>
                <Text>Loading...</Text>
            </Box>
        )
    }

    return (
        <>
            <Button onClick={() => refetch()}>reload</Button>
            <Link to={'/'}>back to top</Link>
            <Stack spacing={3} px={3} maxWidth={'xl'}>
                <Text>{postId}</Text>
                <Box p={5} shadow={'md'} borderWidth={'1px'} key={data!.id}>
                    <Heading as={'h2'} fontSize={'xl'}>
                        {data!.id}: {data!.title}
                    </Heading>
                    <Text>{data!.body}</Text>
                </Box>
            </Stack>
        </>
    )
}

export default Page
