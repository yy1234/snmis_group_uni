export interface LegacySessionState {
  cookie?: string
  loginModel?: unknown
}

export function hasLegacySession(
  state: LegacySessionState,
  options: { isWeb?: boolean } = {},
) {
  if (!state?.loginModel)
    return false
  const isWeb = options.isWeb ?? typeof window !== 'undefined'
  if (isWeb)
    return true
  return Boolean(state.cookie)
}
