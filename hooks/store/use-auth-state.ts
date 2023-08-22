import { useAtom } from 'jotai'

import { atomWithLocalStorage } from '~/util/hooks/atom-with-local-storage'

export type AccessTokenStorageType = {
    accessToken: string
    expiresIn: number
    tokenCreatedAt: Date
}

const accessTokenAtom = atomWithLocalStorage<AccessTokenStorageType | null>('access-token', null)

export const useAuthState = () => {
    const [accessToken, setAccessToken] = useAtom(accessTokenAtom)

    const clearAll = () => {
        setAccessToken(null)
    }

    return {
        accessToken,
        setAccessToken,
        clearAll,
    }
}
