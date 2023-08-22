import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

export class ClientCustomerResetPasswordDto {
    @ApiProperty({ description: '認証トークン' })
    @IsNotEmpty()
    @IsString()
    credential!: string

    @ApiProperty({ description: 'password' })
    @MinLength(6)
    @MaxLength(255)
    password!: string
}
