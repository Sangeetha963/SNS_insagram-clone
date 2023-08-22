import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class ClientLocalAuthGuard extends AuthGuard('client-local') {}
