import request from '@/utils/http'

/*
 EngineAdmin
  */

//低温冷启动
export function getLowTemperatureStartUp(modelId) {
  return request({
    url: '/baseinfo/vehicleChart/lowTemperatureStartUp',
    method: 'get',
    params: {modelId: modelId}
  })
}

//冬季氢电里程
export function getWinterHydrogenMileage(modelId) {
  return request({
    url: '/baseinfo/vehicleChart/winterHydrogenMileage',
    method: 'get',
    params: {modelId: modelId}
  })
}

//冬季总计加氢
export function getTotalHydrogenationInWinter(modelId) {
  return request({
    url: '/baseinfo/vehicleChart/totalHydrogenationInWinter',
    method: 'get',
    params: {modelId: modelId}
  })
}

//冬季纯氢运行里程
export function getWinterHydrogenOperatingMileage(modelId) {
  return request({
    url: '/baseinfo/vehicleChart/winterHydrogenOperatingMileage',
    method: 'get',
    params: {modelId: modelId}
  })
}

//冬季氢利用率
export function getHydrogenUtilizationInWinter(modelId) {
  return request({
    url: '/baseinfo/vehicleChart/hydrogenUtilizationInWinter',
    method: 'get',
    params: {modelId: modelId}
  })
}



