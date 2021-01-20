import request from '@/utils/http'

//获取省份
export function getProvince() {
  return request({
    url: "/rdbms/settlement/apply/support/province",
    method: 'get'
  })
}
//获取示范地区积分
export function getStatisticsList(data){
    return request({
        url:"/rdbms/settlement/Statistics/list/area-score-summary",
        method:"post",
        data,
        params:{
            loading:false
        }
    })
}
//获取获取地区车企积分
export function getVehicleArea(data){
    return request({
        url:"/rdbms/settlement/Statistics/list/vehicle-area-score",
        method:"post",
        data
    })
}
//获取获取地区加氢站积分
export function getSiteArea(data){
    return request({
        url:"/rdbms/settlement/Statistics/list/hydrogen-area-score",
        method:"post",
        data
    })
}
//获取获取地区零部件积分
export function getPartArea(data){
    return request({
        url:"/rdbms/settlement/Statistics/list/component-area-score",
        method:"post",
        data
    })
}