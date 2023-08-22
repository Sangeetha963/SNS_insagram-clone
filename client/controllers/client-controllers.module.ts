import { Module } from '@nestjs/common'
import { ClientServicesModule } from '~/client/services/client-services.module'
import { ClientAuthModule } from '~/client/auth/client-auth.module'
import { getJwtModuleImpl } from '~/util/module-impl/jwt-module-impl'

import { ClientAuthController } from '~/client/controllers/auth/client-auth.controller'
import { ClientCustomerController } from '~/client/controllers/customer/client-customer.controller'
import { ClientFileController } from './file/client-file.controller'
import { ClientMediaController } from './media/client-media.controller'
import { ClientFileUploadController } from '~/client/controllers/file/client-file-upload.controller'
import { ClientPostController } from '~/client/controllers/post/client-post.controller'
import { ClientFavouriteController } from './favourite/client-favourite.controller'
import { ClientFollowController } from './follow/client-follow.controller'

@Module({
    imports: [ClientServicesModule, ClientAuthModule, getJwtModuleImpl()],
    providers: [],
    controllers: [
        ClientAuthController,
        ClientCustomerController,
        ClientFileController,
        ClientMediaController,
        ClientFileUploadController,
        ClientPostController,
        ClientFavouriteController,
        ClientFollowController,
    ],
})
export class ClientControllersModule {}
