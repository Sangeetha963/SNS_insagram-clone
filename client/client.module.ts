import { Module } from '@nestjs/common'
import { ClientServicesModule } from './services/client-services.module'
import { ClientControllersModule } from './controllers/client-controllers.module'
import { ClientAuthModule } from './auth/client-auth.module'
import { ClientLocalStrategy } from './auth/guard/local-auth/client-local.strategy'

@Module({
    imports: [ClientServicesModule, ClientControllersModule, ClientAuthModule],
    providers: [ClientLocalStrategy],
})
export class ClientModule {}
