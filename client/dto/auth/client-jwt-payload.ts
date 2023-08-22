import { JwtPayload } from 'jsonwebtoken'

export class ClientJwtPayload implements JwtPayload {
    uuid!: string
    aud?: string | string[]
    exp?: number
    iat?: number
    iss?: string
    jti?: string
    nbf?: number
    sub?: string

    constructor(args: Readonly<ClientJwtPayload>) {
        Object.assign(this, args)
    }
}
