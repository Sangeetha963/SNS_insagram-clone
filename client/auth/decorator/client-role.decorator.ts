import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import { ClientCurrentUserGuard } from '~/client/auth/guard/current-user/client-current-user.guard'
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { ClientRoleType } from '~/client/auth/guard/role/client-roles-type'

export const ClientRoles = (
    { currentUser = false, role = [] }: { currentUser?: boolean; role?: ClientRoleType[] } = {
        currentUser: false,
        role: [],
    },
) =>
    applyDecorators(
        SetMetadata('client-role', role),
        SetMetadata('current-user', currentUser),
        UseGuards(ClientCurrentUserGuard),
        ApiBearerAuth(),
        ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    )
