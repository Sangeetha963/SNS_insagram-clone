import { Controller, Get } from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'

@Controller()
export class AppController {
    constructor(
        @InjectEntityManager()
        readonly manager: EntityManager,
    ) {}

    @Get('hc')
    async getHC() {
        // ヘルスチェック中のログは表示しない
        const baseOption = this.manager.connection.options.logging
        await this.manager.connection.setOptions({ logging: ['error'] }).query('select 0')
        this.manager.connection.setOptions({ logging: baseOption })

        return {
            status: 'healthy',
        }
    }
}
