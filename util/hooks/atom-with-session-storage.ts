import { atom } from 'jotai'

export const atomWithSessionStorage = <T>(key: string, initialValue: T) => {
    const getInitialValue = (): T => {
        const item = sessionStorage.getItem(key)
        if (item !== null) return JSON.parse(item)
        else return initialValue
    }

    const baseAtom = atom<T>(getInitialValue())
    return atom<T, T, void>(
        (get) => get(baseAtom),
        (get, set, update) => {
            const nextValue = typeof update === 'function' ? update(get(baseAtom)) : update
            set(baseAtom, nextValue)
            sessionStorage.setItem(key, JSON.stringify(nextValue))
        },
    )
}
