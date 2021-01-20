import request from '@/utils/http'

//获取省份
export function getProvince() {
  return request({
    url: "/rdbms/settlement/apply/support/province",
    method: 'get',
  })
}
//获取附件
export function getFileInfo(params) {
  return request({
    url: '/rdbms/settlement/approve/area-attachment/',
    method: 'get',
    params,
  })
}
//获取新技术的车辆推广数据
export function getVehicleList(params) {
  return request({
    url: '/rdbms/settlement/approve/list/vehicle',
    method: 'get',
    params,
  })
}
//给技术推广车辆打分
export function setVehicleScore(data){
  return request({
    url:"/rdbms/settlement/approve/score/vehicle",
    method:"put",
    data
  })
}
//给区域打分
export function setAreaScore(data){
  return request({
    url:"/rdbms/settlement/approve/score/area",
    method:"put",
    data
  })
}
//给加氢站打分
export function setSiteScore(data){
  return request({
    url:"/rdbms/settlement/approve/score/hydrogen-station",
    method:"put",
    data
  })
}
export function setComponent(data){
  return request({
    url:"/rdbms/settlement/approve/score/component",
    method:"put",
    data
  })
}
//获取加氢站数据
export function getSite(params){
  return request({
    url: "/rdbms/settlement/approve/list/hydrogen-station",
    method: 'get',
    params
  })
}
//获取零部件企业列表
export function getComponent(params) {
  return request({
    url: "/rdbms/settlement/approve/list/component",
    method: 'get',
    params
  })
}
