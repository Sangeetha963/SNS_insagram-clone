import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'

export class ClientCustomerResetPasswordRequestDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email!: string
}
