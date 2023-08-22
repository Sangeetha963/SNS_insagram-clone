import { AxiosError } from 'axios'

export interface ErrorResponse {
    statusCode: number
    message: string[]

    error?: string

    errorList?: { errCode: string; errInfo: string; errorForMerchant?: string; errorForCustomer?: string }[]

    codeGroup?: number
    code?: number
    errorCode?: number
}

export type IAxiosError = AxiosError<ErrorResponse>
