import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { FastifyRequest } from 'fastify'
import { getBearerToken } from '~/util/fastify/get-bearer-token'

import { TokenExpiredError } from 'jsonwebtoken'
import { NsException } from '~/util/exception/ns-exception'
import { ClientAuthService } from '~/client/services/auth/client-auth.service'
import { Reflector } from '@nestjs/core'
import { ClientCustomerService } from '~/client/services/customer/client-customer.service'

/**
 * JWTの取得と検証を行い、payloadをcontextに格納
 */
@Injectable()
export class ClientCurrentUserGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        readonly authService: ClientAuthService,
        readonly customerService: ClientCustomerService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req: FastifyRequest = context.switchToHttp().getRequest()
        const token = getBearerToken(req)

        if (!token) return false

        try {
            req.jwtPayload = await this.authService.validateToken(token)
        } catch (e) {
            if (e instanceof TokenExpiredError) {
                throw new NsException({ code: 20020101, statusCode: 401 })
            }
            // else if (e instanceof JsonWebTokenError)
            throw new NsException({ code: 20020102, statusCode: 401 })
        }

        const isGetCurrentUser = this.reflector.get<boolean | undefined>('current-user', context.getHandler())
        if (isGetCurrentUser) {
            const user = await this.customerService.findOneByUuid(req.jwtPayload.uuid)
            if (!user) throw new NsException({ code: 20020103, statusCode: 500, capture: true })

            req.user = user
        }

        return true
    }
}
