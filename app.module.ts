import { Logger, Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { UtilModule } from './util/util.module'
import { getConfigServiceImpl } from '~/util/module-impl/config-module-impl'
import { RavenModule } from 'nest-raven'
import path from 'path'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'
import { CustomNamingStrategy } from '~/custom-naming-storategy'
import { ClientModule } from './client/client.module'
import { CmdTaskModule } from './cmd-task/cmd-task.module'
import { getJwtModuleImpl } from '~/util/module-impl/jwt-module-impl'
import { PrometheusModule } from '@willsoto/nestjs-prometheus'
import { MetricsController } from './metrics/metrics.controller'

@Module({
    imports: [
        getConfigServiceImpl(),
        UtilModule,
        RavenModule,
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const DB_URL = configService.get<string>('DB_URL')!
                const RUNNING_JS = configService.get<boolean>('RUNNING_JS')!
                if (RUNNING_JS) Logger.log('running mode: js', 'TypeOrm')
                const NODE_ENV = configService.get<string>('NODE_ENV')!
                Logger.verbose(`DB_URL: ${DB_URL}`, 'TypeOrm')
                return {
                    type: 'mysql',
                    url: DB_URL,
                    entities: [path.resolve(__dirname, 'entities/**/*.entities.{ts,js}')],
                    synchronize: false,
                    timezone: '+09:00',
                    dateStrings: ['DATE', 'TIME'],
                    extra: {
                        connectionLimit: 10,
                    },
                    supportBigNumbers: true,
                    autoLoadEntities: true,
                    namingStrategy: new CustomNamingStrategy(),
                    charset: 'utf8mb4',
                    logging: 'all',
                    logger: NODE_ENV !== 'production' ? 'advanced-console' : 'simple-console',
                }
            },
        }),
        getJwtModuleImpl(),
        ClientModule,
        CmdTaskModule,
        PrometheusModule.register({
            defaultMetrics: {
                enabled: true,
            },
            controller: MetricsController,
        }),
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
