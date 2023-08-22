import { OmitType } from '@nestjs/swagger'
import { ClientAuthTokenResponseDto } from '~/client/dto/auth/client-auth-token-response.dto'

export class ClientRefreshTokenResponseDto extends OmitType(ClientAuthTokenResponseDto, ['refresh_token']) {
    constructor(args: Readonly<ClientRefreshTokenResponseDto>) {
        super()
        Object.assign(this, args)
    }
}
