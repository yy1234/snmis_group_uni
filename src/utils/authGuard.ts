import { isApp, isH5 } from '@uni-helper/uni-env'

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
  const isWeb = options.isWeb ?? (isH5 || isApp)
  if (isWeb)
    return true
  return Boolean(state.cookie)
}
