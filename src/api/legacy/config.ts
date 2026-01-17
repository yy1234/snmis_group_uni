import { legacyRequest } from '@/utils/http'

export function fetchMobileListParams() {
  return legacyRequest('mobileAppBasicMgmt/mobileListParams.do', {
    data: { attribute: 'NEWPROJECTUI_PATH,NEW_WF_PROJECT_PATH' },
  })
}
