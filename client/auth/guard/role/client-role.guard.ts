import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { CustomerEntities } from '~/entities/customer/customer.entities'
import { NsException } from '~/util/exception/ns-exception'
import { ClientRoleType } from '~/client/auth/guard/role/client-roles-type'

@Injectable()
export class ClientRoleGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<ClientRoleType[] | undefined>('client-role', context.getHandler())
        if (!roles) return true

        // TODO: customer tableから取得するのではなく、jwtPayloadに含まれる内容のみでロールを判断するように変更
        const req: Request = context.switchToHttp().getRequest()
        const customer = req.user as CustomerEntities | undefined

        if (!customer) throw new UnauthorizedException(undefined, 'This API is required the customer token')

        if (!(customer instanceof CustomerEntities))
            throw new NsException({ code: 20030101, statusCode: 500, capture: true })

        console.log(customer)

        // TODO: 権限周り整理

        return true
    }
}
