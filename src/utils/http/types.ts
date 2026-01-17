export interface RequestGsonInput {
  data?: Record<string, unknown>
  loginName?: string
  pagination?: Record<string, unknown>
  extra?: Record<string, unknown>
}

export interface RequestGsonPayload {
  requestGson: string
}
