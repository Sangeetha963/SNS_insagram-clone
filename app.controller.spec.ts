import { Test } from '@nestjs/testing'
import { AppController } from './app.controller'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { getConfigServiceImpl } from '~/util/module-impl/config-module-impl'
import { UtilModule } from '~/util/util.module'
import { getTypeOrmTestModule } from '~/util/test/typeorm-test-module'

describe('AppController', () => {
    let app: INestApplication

    beforeAll(async () => {
        const testingModule = await Test.createTestingModule({
            imports: [getConfigServiceImpl(), UtilModule, getTypeOrmTestModule()],
            controllers: [AppController],
            providers: [],
        }).compile()
        app = testingModule.createNestApplication()
        await app.init()
    })

    describe('root', () => {
        it('should return "healthy"', async () => {
            const res = await request(app.getHttpServer()).get('/hc').expect(200)
            expect(res.body).toStrictEqual({
                status: 'healthy',
            })
        })
    })
})
