import { forwardRef, Module } from '@nestjs/common'
import { UtilModule } from '~/util/util.module'
import { getJwtModuleImpl } from '~/util/module-impl/jwt-module-impl'
import { ClientServicesModule } from '../services/client-services.module'

@Module({
    imports: [UtilModule, getJwtModuleImpl(), forwardRef(() => ClientServicesModule)],
    providers: [],
    exports: [],
    controllers: [],
})
export class ClientAuthModule {}
