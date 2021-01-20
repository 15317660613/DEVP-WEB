import request from '@/utils/http'

//实时氢泄露报警
export function getRealTimeHydrogenLeakageAlarm(modelId) {
  return request({
    url: '/baseinfo/vehicleChart/realTimeHydrogenLeakageAlarm',
    method: 'get',
    params: {modelId: modelId}
  })
}

//长期氢泄露报警
export function getLongTermHydrogenLeakageAlarm() {
  return request({
    url: '/baseinfo/vehicleChart/longTermHydrogenLeakageAlarm',
    method: 'get'
  })
}

//长期氢利用率
export function getLongTermHydrogenUtilization(modelId) {
  return request({
    url: '/baseinfo/vehicleChart/longTermHydrogenUtilization',
    method: 'get',
    params: {modelId: modelId}
  })
}

//电堆寿命预警
export function getEarlyWarningOfStackLife(modelId) {
  return request({
    url: '/baseinfo/vehicleChart/earlyWarningOfStackLife',
    method: 'get',
    params: {modelId: modelId}
  })
}

