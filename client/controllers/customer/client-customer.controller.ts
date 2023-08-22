import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ClientRoles } from '~/client/auth/decorator/client-role.decorator'
import { CurrentUser } from '~/util/fastify/current-user'

import { ClientAuthService } from '~/client/services/auth/client-auth.service'
import { ClientCustomerService } from '~/client/services/customer/client-customer.service'

import { CustomerEntities } from '~/entities/customer/customer.entities'

import { ClientAuthTokenResponseDto } from '~/client/dto/auth/client-auth-token-response.dto'
import { ClientCustomerChangePasswordDto } from '~/client/dto/customer/client-customer-change-password.dto'
import { ClientCustomerCreateDto } from '~/client/dto/customer/client-customer-create.dto'
import { ClientCustomerResetPasswordDto } from '~/client/dto/customer/client-customer-reset-password.dto'
import { ClientCustomerUpdateDto } from '~/client/dto/customer/client-customer-update.dto'

@Controller('client/customer')
@ApiTags('ClientCustomerController')
export class ClientCustomerController {
    constructor(readonly clientCustomerService: ClientCustomerService, readonly clientAuthService: ClientAuthService) {}

    @Get()
    @ApiOperation({ summary: 'ユーザー情報取得' })
    @ApiResponse({ type: () => CustomerEntities, status: 200 })
    @ClientRoles({ currentUser: true })
    async getUser(@CurrentUser('user') user: CustomerEntities): Promise<CustomerEntities> {
        return user
    }

    @Post()
    @ApiOperation({ summary: 'ユーザー情報作成' })
    @ApiBody({ type: () => ClientCustomerCreateDto })
    @ApiResponse({ type: () => ClientAuthTokenResponseDto, status: 200 })
    async createUser(@Body() dto: ClientCustomerCreateDto): Promise<ClientAuthTokenResponseDto> {
        const customer = await this.clientCustomerService.create(dto)
        return await this.clientAuthService.generateToken(customer)
    }

    @Put()
    @ApiOperation({ summary: 'ユーザー情報更新' })
    @ApiBody({ type: () => ClientCustomerUpdateDto })
    @ApiResponse({ type: () => CustomerEntities, status: 200 })
    @ClientRoles({ currentUser: true })
    async updateUser(
        @CurrentUser('user') customer: CustomerEntities,
        @Body() dto: ClientCustomerUpdateDto,
    ): Promise<CustomerEntities> {
        return await this.clientCustomerService.update(customer, dto)
    }

    @Post('resetPassword')
    @ApiOperation({ summary: 'パスワードリセット コード確認&パスワード変更' })
    @ApiBody({ type: () => ClientCustomerResetPasswordDto })
    @ApiResponse({ status: 200 })
    async postResetPassword(@Body() dto: ClientCustomerResetPasswordDto): Promise<void> {
        await this.clientCustomerService.resetPassword(dto)
    }

    @Put('changePassword')
    @ApiOperation({ summary: 'パスワード変更' })
    @ApiBody({ type: ClientCustomerChangePasswordDto })
    @ApiResponse({ type: CustomerEntities, status: 200 })
    @ClientRoles({ currentUser: true })
    async putChangePassword(
        @CurrentUser() customer: CustomerEntities,
        @Body() dto: ClientCustomerChangePasswordDto,
    ): Promise<CustomerEntities> {
        await this.clientCustomerService.changePassword(customer, dto)
        return customer
    }

    @Delete('')
    @ApiOperation({ summary: '退会' })
    @ClientRoles({ currentUser: true })
    async deleteWithdrawal(@CurrentUser() user: CustomerEntities): Promise<void> {
        console.log(user)
    }
    // @update('')
    // @ApiOperation({ summary: '' })
    // @ApiBody({ type: ClientCustomerUpdateDto })
    // @ApiResponse({ type: CustomerEntities, status: 200 })
    // @ClientRoles({ currentUser: true})
    // async update(
    //     @CurrentUser() customer: CustomerEntities,
    //     @Body() dto: ClientCustomerUpdateDto,
    // ): Promise<CustomerEntities> {
    //     await this.clientCustomerService.update(customer, dto)
    // }
}
