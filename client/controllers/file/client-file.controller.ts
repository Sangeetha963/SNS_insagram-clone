import { Controller, Get, NotFoundException, Param } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { FileEntities } from '~/entities/file/file.entities'
import { ClientFileService } from '~/client/services/file/client-file.service'

@Controller('client/file')
@ApiTags('ClientFileController')
export class ClientFileController {
    constructor(private readonly fileService: ClientFileService) {}

    @Get(':uuid')
    @ApiOperation({ summary: 'ファイル情報取得' })
    @ApiResponse({ type: () => FileEntities, status: 200 })
    async getOneFileDetail(@Param('uuid') uuid: string): Promise<FileEntities> {
        const file = await this.fileService.findOneByUuid(uuid)
        if (!file) throw new NotFoundException()
        return file
    }
}
