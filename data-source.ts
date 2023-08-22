import 'reflect-metadata'
import { DataSource } from 'typeorm'
import dotenv from 'dotenv'
import { CustomNamingStrategy } from '~/custom-naming-storategy'

import path from 'path'
const stage = process.env.STAGE || 'local'
process.env.STAGE = stage
dotenv.config({ path: `./config/.env.me` })
dotenv.config({ path: `./config/.${stage}.env` })
dotenv.config({ path: `./config/.env` })

const DB_URL = process.env[process.env.NODE_ENV === 'test' ? 'DB_URL_TEST' : 'DB_URL']!.replace('\\\\$', '$')

export const AppDataSource = new DataSource({
    type: 'mysql',
    url: DB_URL,
    synchronize: false,
    entities: [path.resolve(__dirname, `entities/**/*.entities.{ts,js}`)],
    migrations: [path.resolve(__dirname, `db/migrations/**/*.{ts,js}`)],
    subscribers: [path.resolve(__dirname, `db/subscribers/**/*.{ts,js}`)],
    charset: 'utf8mb4',
    timezone: '+09:00',
    dateStrings: ['DATE', 'TIME'],
    supportBigNumbers: true,

    migrationsOutDir: 'src/db/migrations',
    namingStrategy: new CustomNamingStrategy(),
})
