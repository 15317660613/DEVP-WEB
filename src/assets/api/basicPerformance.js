import request from '@/utils/http'

/*
 EngineAdmin
  */
// 查询车辆型号
// export function getModelList() {
//   return request({
//     url: '/baseinfo/vehicle-model/list',
//     method: 'post'
//   })
// }


//极化特性曲线
export function getBaseInformationChart(modelId) {
  return request({
    url: '/baseinfo/vehicleChart/baseInformationChart',
    method: 'get',
    params: {modelId: modelId}
  })
}

//极化曲线
export function getPolarizationCurveChart(modelId) {
  return request({
    url: '/baseinfo/vehicleChart/polarizationCurveChart',
    method: 'get',
    params: {modelId: modelId}
  })
}

//电堆功率曲线
export function getStackPowerCurveChart(modelId) {
  return request({
    url: '/baseinfo/vehicleChart/stackPowerCurveChart',
    method: 'get',
    params: {modelId: modelId}
  })
}


