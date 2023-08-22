import { BadRequestException, Controller, Get, Param, Res } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ClientMediaService } from '~/client/services/media/client-media.service'
import { ConfigService } from '@nestjs/config'
import { FastifyReply } from 'fastify'

@Controller('client/media')
@ApiTags('ClientMediaController')
export class ClientMediaController {
    constructor(private readonly mediaService: ClientMediaService, private readonly configService: ConfigService) {}

    @Get(':_/:_/:fileName')
    @ApiOperation({ summary: 'ファイルを取得' })
    @ApiParam({ name: 'fileName' })
    @ApiResponse({ type: () => Buffer, status: 200 })
    async getFile(@Param('fileName') fileName: string, @Res() reply: FastifyReply): Promise<void> {
        const uuid = fileName.match(/(\S+)\.(\S+)/)
        if (!uuid) throw new BadRequestException('uuid can not parsed')

        const fileEntity = await this.mediaService.getFileMeta(uuid[1])
        if (!fileEntity) throw new BadRequestException('file is not found')

        const [file, buffer] = await this.mediaService.getMedia(fileEntity)
        reply.raw.writeHead(200, {
            'Content-Type': file.mimeType,
            'Content-Length': Number(file.filesize),
        })
        reply.raw.end(buffer)
    }
}
