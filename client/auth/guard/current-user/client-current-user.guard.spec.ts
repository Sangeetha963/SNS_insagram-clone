import { ClientCurrentUserGuard } from './client-current-user.guard'
import { Test, TestingModule } from '@nestjs/testing'
import { getConfigServiceImpl } from '~/util/module-impl/config-module-impl'
import { UtilModule } from '~/util/util.module'
import { getJwtModuleImpl } from '~/util/module-impl/jwt-module-impl'
import { createMock } from '@golevelup/ts-jest'
import { ExecutionContext } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { FastifyRequest } from 'fastify'
import { getTypeOrmTestModule } from '~/util/test/typeorm-test-module'
import { createCustomerMock } from '~/entities/customer/customer.mock'
import { JaJp } from '~/messages/ja-jp'
import { ClientCustomerService } from '~/client/services/customer/client-customer.service'
import { ClientAuthService } from '~/client/services/auth/client-auth.service'
import { ClientServicesModule } from '~/client/services/client-services.module'

const createFastifyRequestHeader = (bearer: string): Partial<FastifyRequest> => ({
    headers: {
        authorization: `bearer ${bearer}`,
    },
})

const createContextMock = (req: Partial<FastifyRequest>) =>
    createMock<ExecutionContext>({
        switchToHttp: () => ({
            getRequest: () => req,
        }),
    })

describe('ClientCurrentUserGuard', () => {
    let guard: ClientCurrentUserGuard
    let jwtService: JwtService
    let customerService: ClientCustomerService
    let clientAuthService: ClientAuthService

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                getConfigServiceImpl(),
                getTypeOrmTestModule(),
                UtilModule,
                getJwtModuleImpl(),
                ClientServicesModule,
            ],
            providers: [ClientCurrentUserGuard],
        }).compile()

        jwtService = module.get(JwtService)
        guard = module.get<ClientCurrentUserGuard>(ClientCurrentUserGuard)
        customerService = module.get(ClientCustomerService)
        clientAuthService = module.get(ClientAuthService)
    })

    it('should be defined', () => {
        expect(guard).toBeDefined()
        expect(jwtService).toBeDefined()
    })

    it('should be success verify', async () => {
        jest.spyOn(customerService, 'findOneByUuid').mockImplementationOnce(async () => createCustomerMock())

        const jwtToken = await clientAuthService.signToken((await customerService.findOneByUuid(''))!)
        expect(jwtToken).toBeDefined()

        const req = createFastifyRequestHeader(jwtToken)
        const context = createContextMock(req)
        const res = await guard.canActivate(context)
        expect(res).toBe(true)
        expect(req).toMatchSnapshot({
            headers: {
                authorization: expect.any(String),
            },

            jwtPayload: {
                exp: expect.any(Number),
                iat: expect.any(Number),
                uuid: expect.any(String),
                iss: expect.any(String),
                aud: expect.any(Array),
            },
        })
    })

    it('should be failed(expired)', async () => {
        const jwtToken = jwtService.sign({ raw: 'data' }, { expiresIn: '-24h' })
        expect(jwtToken).toBeDefined()

        const req = createFastifyRequestHeader(jwtToken)
        const context = createContextMock(req)
        await expect(guard.canActivate(context)).rejects.toThrowError(JaJp()[20020101])
        expect(req.jwtPayload).toBeUndefined()
    })

    it('should be failed(invalid)', async () => {
        const jwtToken = jwtService.sign({ raw: 'data' }, { expiresIn: '-24h', secret: 'dummy_secret_token' })
        expect(jwtToken).toBeDefined()

        const req = createFastifyRequestHeader(jwtToken)
        const context = createContextMock(req)
        await expect(guard.canActivate(context)).rejects.toThrowError(JaJp()[20020102])
        expect(req.jwtPayload).toBeUndefined()
    })

    it('token is not defined', async () => {
        const context = createContextMock({
            headers: {},
        })
        await expect(guard.canActivate(context)).resolves.toBe(false)
    })
})
