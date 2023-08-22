import axios, { AxiosRequestConfig, Method } from 'axios'
import { mapValues } from 'lodash-es'

// eslint-disable-next-line
import { Client, HttpMethod, ObjectLike, QueryParameters, SuccessResponses } from '~/apis/apiClient'
import { AccessTokenStorageType } from '~/hooks/store/use-auth-state'
import { IAxiosError } from '~/util/model/error-response'

export const useApiClient = () => {
    const apiClient = createApiClient()
    const errorText = useErrorText()

    const hookApi = async <T>(api: () => Promise<T>): Promise<T> => {
        try {
            return await api()
        } catch (_reason) {
            const reason = _reason as IAxiosError
            reason.message = errorText(reason)
            throw reason
        }
    }

    return { apiClient, hookApi }
}

export const useErrorText = () => {
    return (reason: IAxiosError): string => {
        const code = reason.response?.data?.errorCode
        if (!code && code !== 0) {
            // errorCodeが入っていない場合
            if (typeof reason.response?.data?.message === 'object')
                return `${reason.response?.data?.message.reduce((prev, cur) => `${prev} ${cur}`, '')}`
            if (reason.response?.data.message) return (reason.response.data.message as string[])!.toString()
            return 'ネットワークエラーが発生しました。時間を空けて再度実行してください'
        }

        return reason.response?.data?.message?.[0] + ` (${reason.response?.data?.errorCode})`
    }
}

export const createApiClient = (baseUrl = process.env.BASE_API_URL || ''): Client<AxiosRequestConfig> => {
    return new Client(
        {
            async request<T = SuccessResponses>(
                httpMethod: HttpMethod,
                url: string,
                headers: ObjectLike,
                requestBody: ObjectLike,
                queryParameters: QueryParameters | undefined,
                options?: AxiosRequestConfig,
            ): Promise<T> {
                const _accessToken = localStorage.getItem('access-token')
                const accessToken = _accessToken ? (JSON.parse(_accessToken) as AccessTokenStorageType) : ''

                const _headers = accessToken
                    ? {
                          'x-authorization': 'Bearer ' + accessToken.accessToken,
                          ...headers,
                      }
                    : { ...headers }

                return (
                    await axios.request<T>({
                        method: httpMethod as Method,
                        url,
                        headers: _headers,
                        data: requestBody,
                        params: queryParameters ? mapValues(queryParameters, (it) => it.value) : undefined,
                        ...options,
                    })
                ).data
            },
        },
        baseUrl,
    )
}
