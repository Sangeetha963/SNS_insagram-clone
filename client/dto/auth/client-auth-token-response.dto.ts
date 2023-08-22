import { ApiProperty } from '@nestjs/swagger'

export class ClientAuthTokenResponseDto {
    @ApiProperty({ description: 'トークン' })
    access_token!: string

    @ApiProperty({ description: 'トークン種別', enum: ['bearer'] })
    token_type!: 'bearer'

    @ApiProperty({ description: '有効秒数' })
    expires_in!: number

    @ApiProperty({ description: 'リフレッシュトークン' })
    refresh_token!: string

    @ApiProperty({ description: '要求したスコープと違う場合は追加' })
    scope?: string

    constructor(args: Readonly<ClientAuthTokenResponseDto>) {
        Object.assign(this, args)
    }
}
