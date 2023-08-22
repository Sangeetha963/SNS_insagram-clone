import { Test } from '@nestjs/testing'
import { UtilModule } from '~/util/util.module'
import { getTypeOrmTestModule } from '~/util/test/typeorm-test-module'
import { Controller, ExecutionContext, Get, INestApplication } from '@nestjs/common'
import { QueryRunner } from 'typeorm'
import { ClientServicesModule } from '~/client/services/client-services.module'
import request from 'supertest'

import { createCustomerMock } from '~/entities/customer/customer.mock'
import { ClientAuthService } from '~/client/services/auth/client-auth.service'
import { ClientRoles } from '~/client/auth/decorator/client-role.decorator'
import { getConfigServiceImpl } from '~/util/module-impl/config-module-impl'
import { ClientRoleGuard } from '~/client/auth/guard/role/client-role.guard'
import { ClientCurrentUserGuard } from '~/client/auth/guard/current-user/client-current-user.guard'
import { getBearerToken } from '~/util/fastify/get-bearer-token'
import { FastifyRequest } from 'fastify'
import { ClientCustomerService } from '~/client/services/customer/client-customer.service'

@Controller()
class ClientRoleTestController {
    @Get('nonAuth')
    nonAuth() {
        return
    }

    @Get('requiredAuth')
    @ClientRoles()
    requiredAuth() {
        return
    }
}

describe('ClientRoleGuard', () => {
    let app: INestApplication
    let queryRunner: QueryRunner
    let authService: ClientAuthService
    let customerService: ClientCustomerService

    beforeAll(async () => {
        const testingModule = await Test.createTestingModule({
            imports: [getConfigServiceImpl(), UtilModule, getTypeOrmTestModule(), ClientServicesModule],
            providers: [ClientRoleGuard],
            controllers: [ClientRoleTestController],
        })
            .overrideGuard(ClientCurrentUserGuard)
            .useValue({
                canActivate: async (context: ExecutionContext) => {
                    const req: FastifyRequest = context.switchToHttp().getRequest()
                    const token = getBearerToken(req)
                    const jwtPayload = await authService.validateToken(token!)
                    const user = await customerService.findOneByUuid(jwtPayload.uuid, queryRunner.manager)
                    if (!user) throw new Error('user is not found')
                    req.user = user
                    return true
                },
            })
            .compile()
        app = testingModule.createNestApplication()
        await app.init()

        const service = testingModule.get(ClientAuthService)
        authService = testingModule.get(ClientAuthService)
        customerService = testingModule.get(ClientCustomerService)

        queryRunner = service.manager.connection.createQueryRunner()
        await queryRunner.startTransaction()
    })

    const getRequest = (path: string, bearer: string, responseCode: number) =>
        request(app.getHttpServer()).get(path).set('x-authorization', bearer).expect(responseCode)

    afterAll(async () => {
        await queryRunner.rollbackTransaction()
        await queryRunner.connection.close()
    })

    it('通常ユーザ', async () => {
        const customer = await queryRunner.manager.save(createCustomerMock())
        const session = await authService.signToken(customer)
        const bearer = `bearer ${session}`

        await getRequest(`/nonAuth`, bearer, 200)
        await getRequest(`/requiredAuth`, bearer, 200)
    })
})
