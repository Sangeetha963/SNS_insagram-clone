import { Controller, Post, Req, UploadedFiles, UseInterceptors } from '@nestjs/common'
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ClientFileUploadService } from '~/client/services/file/client-file-upload.service'
import { FileEntities } from '~/entities/file/file.entities'
import { FastifyFilesInterceptor } from '~/util/fastify/fastify-files-interceptor'
import { FastifyRequest } from 'fastify'
import { ClientFileUploadDto } from '~/client/dto/file/client-file-upload.dto'

@Controller('client/upload')
@ApiTags('ClientFileUploadController')
export class ClientFileUploadController {
    constructor(private readonly uploadService: ClientFileUploadService) {}

    @Post('')
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'ファイルアップロード' })
    // @ClientRoles({ currentUser: true })
    @ApiBody({
        description: 'media',
        type: () => ClientFileUploadDto,
    })
    @ApiResponse({ type: () => FileEntities, isArray: true, status: 200 })
    @UseInterceptors(FastifyFilesInterceptor('files'))
    async upload(@UploadedFiles() files: Express.Multer.File[], @Req() req: FastifyRequest): Promise<FileEntities[]> {
        // @ts-expect-error
        const meta = req.body.meta ? JSON.parse(req.body.meta) : { type: '', group: '' }

        return this.uploadService.upload(files, meta)
    }
}
