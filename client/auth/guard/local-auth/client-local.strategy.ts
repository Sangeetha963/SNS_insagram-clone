import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { Injectable } from '@nestjs/common'
import { ClientAuthService } from '~/client/services/auth/client-auth.service'
import { CustomerEntities } from '~/entities/customer/customer.entities'

/**
 * client向け Email, PasswordでCustomerEntitiesを取得するためのStrategy
 */
@Injectable()
export class ClientLocalStrategy extends PassportStrategy(Strategy, 'client-local') {
    /**
     * constructor
     * @param {ClientAuthService} authService
     */
    constructor(private readonly authService: ClientAuthService) {
        super({
            usernameField: 'id',
            passwordField: 'password',
        })
    }

    /**
     * validate method
     * @param {string} email
     * @param {string} pw
     * @returns {Promise<CustomerEntities>}
     */
    async validate(email: string, pw: string): Promise<CustomerEntities | null> {
        return await this.authService.validateWithEmailAndPassword(email, pw)
    }
}
