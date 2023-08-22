import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common'
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { ClientRoles } from '~/client/auth/decorator/client-role.decorator'
// import { ClientRoles } from '~/client/auth/decorator/client-role.decorator'
import { ClientFollowUserDto } from '~/client/dto/customer/client-customer-update.dto'
import { ClientFollowService } from '~/client/services/follow/client-follow.service'
import { CustomerEntities } from '~/entities/customer/customer.entities'
// import { PostEntities } from '~/entities/post/post.entities'
import { ApiListResponse, ResultListContent } from '~/type/common'
import { CurrentUser } from '~/util/fastify/current-user'
import { ParseIntOrUndefinedPipe } from '~/util/pipe-transform/parse-int-or-undefined.pipe'

@Controller('client/follow')
@ApiTags('ClientFollowController')
export class ClientFollowController {
    constructor(readonly clientFollowService: ClientFollowService) {}

    @Get()
    @ApiOperation({ summary: 'フォロイング リスト(list of following) ' })
    @ApiQuery({ name: 'userUuid', type: String, description: 'ユーザーuuid', required: true })
    @ApiQuery({ name: 'limit', type: Number, description: 'limit', required: false })
    @ApiQuery({ name: 'page', type: Number, description: 'page', required: false })
    @ApiListResponse(CustomerEntities)
    @ClientRoles({ currentUser: true })
    async FollowList(
        // @CurrentUser('user') customer: CustomerEntities,
        @Query('userUuid') userUuid: string,
        @Query('limit', ParseIntOrUndefinedPipe) limit?: number,
        @Query('page', ParseIntOrUndefinedPipe) page?: number,
    ): Promise<ResultListContent<CustomerEntities>> {
        const options = { limit, page }
        const [list, count] = await this.clientFollowService.findAll(userUuid, options)
        return new ResultListContent<CustomerEntities>({ count, list })
    }

    @Post()
    @ApiOperation({ summary: 'フォロワ(start following)' })
    @ClientRoles({ currentUser: true })
    @ApiQuery({ name: 'userUuid', type: String, required: true })
    async followUser(@CurrentUser('user') customer: CustomerEntities, @Body() dto: ClientFollowUserDto) {
        return await this.clientFollowService.followUser(customer, dto.userId)
    }

    @Delete()
    @ApiOperation({ summary: 'アンフォロー(UnFollow)' })
    @ClientRoles({ currentUser: true })
    @ApiQuery({ name: 'userUuid', type: String, required: true })
    async unFollow(@CurrentUser('user') customer: CustomerEntities, @Query('userUuid') userUuid: string) {
        return await this.clientFollowService.unFollowUser(customer, userUuid)
    }
}
