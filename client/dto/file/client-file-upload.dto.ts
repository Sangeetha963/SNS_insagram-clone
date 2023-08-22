import { ApiProperty } from '@nestjs/swagger'

export class ClientFileUploadDto {
    @ApiProperty({ required: false })
    meta?: unknown

    @ApiProperty({ required: false, description: 'ソート順', example: 0 })
    sort?: number

    @ApiProperty({ type: 'string', format: 'binary' })
    files!: unknown
}
