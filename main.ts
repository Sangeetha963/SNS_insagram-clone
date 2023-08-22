import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import AWS from 'aws-sdk'
import * as Sentry from '@sentry/node'
import { camelCase } from 'typeorm/util/StringUtils'
import { applicationConfigure } from '~/util/application-configure'
import { RedisIoAdapter } from '~/events/redis-io.adapter'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
// @ts-expect-error
import * as fmp from 'fastify-multipart'

!(async () => {
    AWS.config.logger = Logger
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter({}), {
        logger: ['log', 'error', 'warn', 'debug', 'verbose'],
    })
    const configService = app.get(ConfigService)

    const STAGE = configService.get<string>('STAGE')!
    const NODE_ENV = configService.get<string>('NODE_ENV')!
    const PORT = configService.get<number>('PORT')!
    const HOST = configService.get<string>('HOST')!
    Logger.log(`env: ${NODE_ENV}`, 'main')
    Logger.log(`stage: ${STAGE}`, 'main')

    if (NODE_ENV === 'production') {
        const DSN = configService.get<string>('DSN')!
        Sentry.init({ dsn: DSN })
        Sentry.setTag('environment', NODE_ENV)
        Sentry.setTag('stage', STAGE)
    }

    await applicationConfigure(app)

    app.useWebSocketAdapter(new RedisIoAdapter(app))

    if (STAGE !== 'prod') {
        const options = new DocumentBuilder()
            .setTitle('JLW All Warranty API')
            .setDescription('api')
            .setVersion('1.0')
            .addBearerAuth()
            .build()
        const document = SwaggerModule.createDocument(app, options, {
            operationIdFactory(controllerKey: string, methodKey: string) {
                return `${camelCase(controllerKey.replace('Controller', ''))}${
                    methodKey[0].toUpperCase() + camelCase(methodKey).slice(1)
                }`
            },
        })
        SwaggerModule.setup('api/swagger', app, document)
    }
    await app.register(fmp)

    await app.listen(PORT, HOST, () => {
        Logger.log(`listen: http://${HOST}:${PORT}`, 'main')
        if (NODE_ENV !== 'production') {
            Logger.log(`swagger API: http://${HOST}:${PORT}/api/swagger`, 'main')
            Logger.log(`swagger API JSON: http://${HOST}:${PORT}/api/swagger-json`, 'main')
        }
    })
})()
