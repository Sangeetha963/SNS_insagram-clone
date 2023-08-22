import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ClientLocalAuthGuard } from '~/client/auth/guard/local-auth/client-local-auth.guard'
import { CurrentUser } from '~/util/fastify/current-user'
import { CustomerEntities } from '~/entities/customer/customer.entities'
import z from 'zod'
import { createZodNamedDto } from '~/util/openapi/create-zod-named-dto'
import { ClientAuthTokenResponseDto } from '~/client/dto/auth/client-auth-token-response.dto'
import { ClientAuthService } from '~/client/services/auth/client-auth.service'
import { ClientRefreshTokenResponseDto } from '~/client/dto/auth/client-refresh-token-response.dto'
import { ZodValidate } from '~/util/pipe-transform/zod-validate'

export const ClientAuthCheckRequestDto = z.object({
    userId: z.string().min(1),
})

export const signinWithPasswordRequest = z.object({
    id: z.string(),
    password: z.string().min(1),
})

export const refreshTokenRequest = z.object({
    refreshToken: z.string().min(1),
})

@Controller('client/auth')
@ApiTags('ClientAuthController')
export class ClientAuthController {
    constructor(readonly clientAuthService: ClientAuthService) {}

    @Post('check')
    @ApiOperation({ summary: 'サインイン可能な認証方法を取得' })
    @ApiBody({ type: () => createZodNamedDto('ClientAuthCheckRequestDto', ClientAuthCheckRequestDto) })
    @ApiResponse({ type: ClientAuthTokenResponseDto, status: 200 })
    async checkSigninMethod(@CurrentUser('user') customer: CustomerEntities): Promise<ClientAuthTokenResponseDto> {
        return this.clientAuthService.generateToken(customer)
    }

    @Post('signin/password')
    @ApiOperation({ summary: 'パスワードでサインイン' })
    @ApiBody({ type: () => createZodNamedDto('ClientSigninWithPasswordRequestDto', signinWithPasswordRequest) })
    @ApiResponse({ type: ClientAuthTokenResponseDto, status: 200 })
    @UseGuards(ClientLocalAuthGuard)
    async signinWithId(@CurrentUser('user') customer: CustomerEntities): Promise<ClientAuthTokenResponseDto> {
        return this.clientAuthService.generateToken(customer)
    }

    @Post('refresh')
    @ApiOperation({ summary: 'リフレッシュトークンからアクセストークンを再生成' })
    @ApiBody({
        type: () => createZodNamedDto('ClientRefreshTokenRequestDto', refreshTokenRequest),
    })
    @ApiResponse({ type: ClientRefreshTokenResponseDto, status: 200 })
    async refreshToken(
        @Body(new ZodValidate(refreshTokenRequest)) dto: z.infer<typeof refreshTokenRequest>,
    ): Promise<ClientRefreshTokenResponseDto> {
        return this.clientAuthService.refreshToToken(dto.refreshToken)
    }
}
