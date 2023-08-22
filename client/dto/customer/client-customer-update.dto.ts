import { OmitAndPickPartial } from '~/type/common'
import { BaseEntities } from '~/util/typeorm/base-entities'
import { ApiProperty } from '@nestjs/swagger'
import { CustomerEntities } from '~/entities/customer/customer.entities'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class ClientCustomerUpdateDto
    implements OmitAndPickPartial<CustomerEntities, 'email' | 'auth' | keyof BaseEntities, never>
{
    @ApiProperty({ type: String, required: true, nullable: false })
    @IsString()
    @IsEmail()
    email!: string

    @ApiProperty({ type: String, required: true, nullable: false })
    @IsString()
    @IsNotEmpty()
    name!: string

    constructor(params: Readonly<ClientCustomerUpdateDto>) {
        Object.assign(this, params)
    }
    follower!: CustomerEntities[]
    following!: CustomerEntities[]
}

export class ClientFollowUserDto {
    @ApiProperty({ type: String, required: true, nullable: false })
    @IsString()
    userId!: string
}

export class ClientUnFollowUserDto {
    @ApiProperty({ type: String, required: true, nullable: false })
    @IsString()
    userId!: string
}
