export type OmitAndPickPartial<T, OmitType extends keyof T, PickType extends keyof T | never> = Omit<T, OmitType | PickType> &
    Partial<Pick<T, PickType>>

export type RecursivePartial<T> = {
    [P in keyof T]?: T[P] extends (infer U)[] ? RecursivePartial<U>[] : T[P] extends object ? RecursivePartial<T[P]> : T[P]
}
