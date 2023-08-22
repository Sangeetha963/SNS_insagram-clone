import bcrypt from 'bcrypt'
import { Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'
import { CustomerAuthEntities } from '~/entities/customer/customer-auth.entities'

@Injectable()
export class ClientCustomerAuthService {
    constructor(
        @InjectEntityManager()
        readonly manager: EntityManager,
    ) {}

    /**
     * パスワード変更
     */
    async changePassword(
        customerAuth: CustomerAuthEntities,
        password: string,
        manager = this.manager,
    ): Promise<CustomerAuthEntities> {
        customerAuth.token = await bcrypt.hash(password, 10)
        return await manager.save(customerAuth)
    }
}
