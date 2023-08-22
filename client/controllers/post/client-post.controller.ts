import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ClientPostService } from '~/client/services/post/post.service'
import { ApiListResponse, ResultListContent } from '~/type/common'
import { PostEntities } from '~/entities/post/post.entities'
import { ClientRoles } from '~/client/auth/decorator/client-role.decorator'
import { CustomerEntities } from '~/entities/customer/customer.entities'
import { CurrentUser } from '~/util/fastify/current-user'
import { ParseIntOrUndefinedPipe } from '~/util/pipe-transform/parse-int-or-undefined.pipe'
import { ClientPostUpdateDto } from '~/client/dto/post/post-update.dto'

// import { remove } from 'lodash'
// import { IsUUID } from 'class-validator'
// import { string } from 'joi'

@Controller('client/post')
@ApiTags('ClientPostController')
export class ClientPostController {
    constructor(readonly clientPostService: ClientPostService) {}

    @Get()
    @ApiOperation({ summary: '投稿一覧取得' })
    @ApiQuery({ name: 'limit', type: Number, required: false })
    @ApiQuery({ name: 'page', type: Number, required: false })
    @ApiQuery({ name: 'customerUuid', type: String, required: false })
    @ApiListResponse(PostEntities)
    @ClientRoles({ currentUser: true })
    async getPostList(
        @CurrentUser('user') customer: CustomerEntities,
        @Query('limit', ParseIntOrUndefinedPipe) limit?: number,
        @Query('page', ParseIntOrUndefinedPipe) page?: number,
        @Query('customerUuid') customerUuid?: string,
    ): Promise<ResultListContent<PostEntities>> {
        const options = { limit, page, customerUuid }
        const [list, count] = await this.clientPostService.findAll(options)
        return new ResultListContent<PostEntities>({ count, list })
    }
    // finding all my post
    @Get('my post')
    @ApiOperation({ summary: 'all my post' })
    @ApiQuery({ name: 'customerUuid', type: String, required: true })
    @ApiQuery({ name: 'limit', type: Number, required: false })
    @ApiQuery({ name: 'page', type: Number, required: false })
    @ApiListResponse(PostEntities)
    @ClientRoles({ currentUser: true })
    async getmyPostList(
        @CurrentUser('user') customer: CustomerEntities,
        @Query('customerUuid') customerUuid: string,
        @Query('limit', ParseIntOrUndefinedPipe) limit?: number,
        @Query('page', ParseIntOrUndefinedPipe) page?: number,
    ): Promise<ResultListContent<PostEntities>> {
        const op = { limit, page }
        const [list, count] = await this.clientPostService.findUsersPost(customerUuid, op)
        return new ResultListContent<PostEntities>({ count, list })
    }

    @Get(':uuid')
    @ApiOperation({ summary: '投稿詳細取得' })
    @ApiParam({ name: 'postUuid', description: '投稿ID' })
    @ApiResponse({ type: () => PostEntities, status: 200 })
    @ClientRoles({ currentUser: true })
    async getPost(
        @CurrentUser('user') customer: CustomerEntities,
        @Param('postUuid') postUuid: string,
    ): Promise<PostEntities> {
        const res = await this.clientPostService.findOne(postUuid)
        if (!res) {
            throw new NotFoundException()
        }
        return res
    }

    @Post()
    @ApiOperation({ summary: '新規投稿' })
    @ApiBody({ type: () => ClientPostUpdateDto })
    @ApiResponse({ type: () => PostEntities, status: 201 })
    @ClientRoles({ currentUser: true })
    async postPost(
        @CurrentUser('user') customer: CustomerEntities,
        @Body() dto: ClientPostUpdateDto,
    ): Promise<PostEntities> {
        return await this.clientPostService.create(dto, customer)
    }
    @Put(':postUuid')
    @ApiOperation({ summary: '編集 - edit the post' })
    @ApiParam({ name: 'postUuid', type: String, description: 'ポストuuid', required: true })
    @ClientRoles({ currentUser: true })
    @ApiBody({ type: ClientPostUpdateDto })
    @ApiResponse({ type: PostEntities, status: 200 })
    async update(
        @CurrentUser() customer: CustomerEntities,
        @Param('postUuid') postUuid: string,
        @Body() dto: ClientPostUpdateDto,
    ): Promise<void> {
        await this.clientPostService.edit(customer, postUuid, dto)
    }
    // @Put(':tid')
    // @ApiOperation({ summary: '編集 - edit the post' })
    // @ApiParam({ name: 'tid', type: String, required: true })
    // @ApiBody({ type: () => ClientPostUpdateDto })
    // @ApiResponse({ type: () => PostEntities, status: 200 })
    // async update(@Param('tid') tid: string, @Body() dto: ClientPostUpdateDto): Promise<void> {
    //     await this.clientPostService.edit(tid, dto)
    // }

    @Delete(':postUuid')
    @ApiOperation({ summary: '退会' })
    @ApiParam({ name: 'postUuid', type: String, description: '削除Id', required: true })
    @ApiResponse({ status: 200 })
    @ClientRoles({ currentUser: true })
    async delete(@CurrentUser('user') customer: CustomerEntities, @Param('postUuid') postUuid: string): Promise<void> {
        await this.clientPostService.delete({ uuid: postUuid, customer })
    }
}
