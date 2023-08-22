import { Test, TestingModule } from '@nestjs/testing'
import { ClientFileController } from './client-file.controller'
import { getConfigServiceImpl } from '~/util/module-impl/config-module-impl'
import { UtilModule } from '~/util/util.module'
import { ClientServicesModule } from '~/client/services/client-services.module'
import { getTypeOrmTestModule } from '~/util/test/typeorm-test-module'

describe('ClientFileController', () => {
    let controller: ClientFileController

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [getConfigServiceImpl(), UtilModule, ClientServicesModule, getTypeOrmTestModule()],
            controllers: [ClientFileController],
        }).compile()

        controller = module.get<ClientFileController>(ClientFileController)
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })
})
