import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common'
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { ClientRoles } from '~/client/auth/decorator/client-role.decorator'
import { CurrentUser } from '~/util/fastify/current-user'
import { CustomerEntities } from '~/entities/customer/customer.entities'
import { PostEntities } from '~/entities/post/post.entities'
import { ApiListResponse, ResultListContent } from '~/type/common'
import { ClientFavouriteService } from '~/client/services/favourite/client-favourite.service'
// import { UpdateResult } from 'typeorm'
import { ClientFavouriteDto } from '~/client/dto/post/post-update.dto'
import { ParseIntOrUndefinedPipe } from '~/util/pipe-transform/parse-int-or-undefined.pipe'

@Controller('client/favourite')
@ApiTags('ClientFavouriteController')
export class ClientFavouriteController {
    constructor(readonly clientFavouriteService: ClientFavouriteService) {}

    // @Get(':uuid')
    // @ApiOperation({ summary: '投稿詳細取得' })
    // @ApiParam({ name: 'postUuid', description: '投稿ID' })
    // @ApiResponse({ type: () => PostEntities, status: 200 })
    // @ClientRoles({ currentUser: true })
    // async getPost(
    //     @CurrentUser('user') customer: CustomerEntities,
    //     @Param('postUuid') postUuid: string,
    // ): Promise<PostEntities> {
    //     const res = await this.clientPostService.findOne(postUuid)
    //     if (!res) {
    //         throw new NotFoundException()
    //     }
    //     return res
    // }
    // ---> getting the favourite post
    @Get()
    @ApiOperation({ summary: 'お気に入りリスト' })
    @ApiQuery({ name: 'customerUuid', type: String, description: '顧客ID', required: true })
    @ApiQuery({ name: 'limit', type: Number, description: 'limit', required: false })
    @ApiQuery({ name: 'page', type: Number, description: 'page', required: false })
    @ApiListResponse(PostEntities)
    // @ClientRoles({ currentUser: true })
    async getFavouriteList(
        @CurrentUser('user') customer: CustomerEntities,
        @Query('customerUuid') customerUuid: string,
        @Query('limit', ParseIntOrUndefinedPipe) limit?: number,
        @Query('page', ParseIntOrUndefinedPipe) page?: number,
    ): Promise<ResultListContent<PostEntities>> {
        const op = { limit, page }
        const [list, count] = await this.clientFavouriteService.findAll(customerUuid, op)
        return new ResultListContent<PostEntities>({ list, count })
    }

    @Post()
    @ApiOperation({ summary: 'ライクポスト' })
    @ApiQuery({ name: 'postUuid', type: String, required: true })
    @ClientRoles({ currentUser: true })
    async likePost(@CurrentUser('user') customer: CustomerEntities, @Body() dto: ClientFavouriteDto) {
        return await this.clientFavouriteService.favouriteLikePost(customer, dto.postId)
    }
    @Delete()
    @ApiOperation({ summary: 'デリートフェイバリット' })
    @ApiQuery({ name: 'postUuid', type: String, required: true })
    @ClientRoles({ currentUser: true })
    async deleteFav(@CurrentUser('user') customer: CustomerEntities, @Query('postUuid') postUuid: string) {
        return await this.clientFavouriteService.deleteFavPost(customer, postUuid)
    }
}
