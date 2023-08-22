import { Test, TestingModule } from '@nestjs/testing'
import { ClientCustomerController } from './client-customer.controller'
import { getConfigServiceImpl } from '~/util/module-impl/config-module-impl'
import { UtilModule } from '~/util/util.module'
import { getTypeOrmTestModule } from '~/util/test/typeorm-test-module'
import { getJwtModuleImpl } from '~/util/module-impl/jwt-module-impl'
import { ClientServicesModule } from '~/client/services/client-services.module'
import { ClientCustomerService } from '~/client/services/customer/client-customer.service'
import { getCacheModuleImpl } from '~/util/module-impl/cache-module-impl'

describe('ClientCustomerController', () => {
    let controller: ClientCustomerController

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                getConfigServiceImpl(),
                UtilModule,
                getTypeOrmTestModule(),
                getJwtModuleImpl(),
                ClientServicesModule,
                getCacheModuleImpl(),
            ],
            providers: [ClientCustomerService],
            controllers: [ClientCustomerController],
        }).compile()

        controller = module.get<ClientCustomerController>(ClientCustomerController)
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })
})
