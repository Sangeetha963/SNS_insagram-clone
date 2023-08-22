import { OmitAndPickPartial } from '~/type/common'
import { BaseEntities } from '~/util/typeorm/base-entities'
import { ApiProperty } from '@nestjs/swagger'
import { CustomerEntities } from '~/entities/customer/customer.entities'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class ClientCustomerCreateDto
    implements OmitAndPickPartial<CustomerEntities, 'auth' | keyof BaseEntities, never>
{
    @ApiProperty({ type: String, required: true, nullable: false })
    @IsString()
    @IsEmail()
    email!: string

    @ApiProperty({ type: String, required: true, nullable: false })
    @IsString()
    @IsNotEmpty()
    password!: string

    @ApiProperty({ type: String, required: true, nullable: false })
    @IsString()
    @IsNotEmpty()
    passwordConfirm!: string

    @ApiProperty({ type: String, required: true, nullable: false })
    @IsString()
    @IsNotEmpty()
    name!: string

    constructor(params: Readonly<ClientCustomerCreateDto>) {
        Object.assign(this, params)
    }
    follower!: CustomerEntities[]
    following!: CustomerEntities[]
}
