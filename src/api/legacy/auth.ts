import { legacyRequest } from '@/utils/http'
import { resolveLoginNameForRequest } from '@/utils/login'

export function fetchEncryptedParameter() {
  return legacyRequest('mobileAppBasicMgmt/obtainEncryptedParameter.do', { data: {} })
}

export function login(payload: Record<string, unknown>) {
  return legacyRequest('mobileAppBasicMgmt/login.do', {
    data: payload,
    loginName: resolveLoginNameForRequest(payload),
  })
}
