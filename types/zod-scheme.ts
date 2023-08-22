import * as z from 'zod'

import { Schemas } from '~/apis/types'

// OpenAPI経由で生成された型とzodのスキーマの型を一致させたいときに使う
// 一致しない場合はTSの型エラーとして認識できる
// 殆どの場合はこれを使えばz.inferを使った型の二重管理をしなくて済むので使用を推奨する

// eslint-disable-next-line
const schemaForType =
    <T>() =>
    <S extends z.ZodType<T>>(arg: S) => {
        return arg
    }

/**
 * ログインフォーム
 */
export const clientSigninWithPasswordRequestDtoSchema = schemaForType<Schemas.ClientSigninWithPasswordRequestDto>()(
    z.object({
        id: z.string().email(),
        password: z.string(),
    }),
)
export const ClientPostUpdateDto = schemaForType<Schemas.ClientPostUpdateDto>()(
    z.object({
        content: z
            .string()
            .min(1, { message: 'Post must be atleast 10 characters' })
            .max(140, { message: 'Post must be less than 140 characters' }),
    }),
)
