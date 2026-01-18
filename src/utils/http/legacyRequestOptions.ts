import { buildLegacyHeaders } from './legacyHeaders'

interface LegacyRequestOptions {
  url: string
  data: unknown
  cookie: string
  isH5: boolean
}

export function buildLegacyRequestOptions(options: LegacyRequestOptions): UniApp.RequestOptions {
  const headers = buildLegacyHeaders(options.cookie, !options.isH5)
  const requestOptions: UniApp.RequestOptions = {
    url: options.url,
    method: 'POST',
    data: options.data,
    header: headers,
  }
  if (options.isH5) {
    requestOptions.withCredentials = true
  }
  return requestOptions
}
