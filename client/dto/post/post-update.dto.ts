// import { OmitAndPickPartial } from '~/type/common'
// import { PostEntities } from '~/entities/post/post.entities'
// import { BaseEntities } from '~/util/typeorm/base-entities'
import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
// import { string } from 'joi'
import { CustomerEntities } from '~/entities/customer/customer.entities'
// import { Injectable } from '@nestjs/common'
// import { Response } from 'aws-sdk'

export class ClientPostUpdateDto {
    @ApiProperty({ type: String, required: true, nullable: false })
    @IsString()
    content!: string

    constructor(params: Readonly<ClientPostUpdateDto>) {
        Object.assign(this, params)
    }
    favouritePost!: CustomerEntities[]
}

export class ClientFavouriteDto {
    @ApiProperty({ type: String, required: true, nullable: false })
    @IsString()
    postId!: string
}

// export class ClientFavDeleteDto {
//     @ApiProperty({ type: String, required: true, nullable: false })
//     @IsString()
//     uuid!: string
// }
export class ClientFavDeleteDto {
    @ApiProperty({ type: String, required: true, nullable: false })
    @IsString()
    postId!: string
}

// export class ClientPostEditDto {
//     @ApiProperty({ type: String, required: true, nullable: false })
//     @IsString()
//     content!: string
// }
