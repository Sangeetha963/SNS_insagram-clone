import { Test, TestingModule } from '@nestjs/testing'
import { ClientAuthController, signinWithPasswordRequest } from './client-auth.controller'
import { getConfigServiceImpl } from '~/util/module-impl/config-module-impl'
import { UtilModule } from '~/util/util.module'
import { getTypeOrmTestModule } from '~/util/test/typeorm-test-module'
import { ClientServicesModule } from '~/client/services/client-services.module'

describe('ClientAuthController', () => {
    let controller: ClientAuthController

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [getConfigServiceImpl(), UtilModule, getTypeOrmTestModule(), ClientServicesModule],
            controllers: [ClientAuthController],
        }).compile()

        controller = module.get<ClientAuthController>(ClientAuthController)
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })

    it('sign in with email and password', () => {
        signinWithPasswordRequest.safeParse({
            email: 'test@example.com',
            password: 'password',
        })
    })
})
