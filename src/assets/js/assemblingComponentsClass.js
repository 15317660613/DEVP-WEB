/**
 * @Description:动态组件component拼装以防止刷新空白的bug
 * @author:ybt
 * @Date:2019/10/18
 * @params:[0]对象源
 * @return:null
 */
const components = {}
components.Home = () => import('@/views/Home.vue')
const routers = []
/* 异步引入，懒加载 */
// monitor 监控中心
components.OneVehicleMonitor = () => import('@/views/monitor/OneVehicleMonitor.vue')
components.VehicleMonitor = () => import('@/views/monitor/VehicleMonitor.vue')
components.VehicleSurvey = () => import('@/views/monitor/VehicleSurvey.vue')

// system 系统管理
components.OrganizationAdmin = () => import('@/views/system/OrganizationAdmin.vue')
components.RoleAdmin = () => import('@/views/system/RoleAdmin.vue')
components.UserAdmin = () => import('@/views/system/UserAdmin.vue')
components.Company = () => import('@/views/system/Company.vue')
// information 信息管理
components.EngineAdmin = () => import('@/views/information/EngineAdmin.vue')
components.SecurityChipAdmin = () => import('@/views/information/SecurityChipAdmin.vue')
components.SIMCardAdmin = () => import('@/views/information/SIMCardAdmin.vue')
components.TerminalAdmin = () => import('@/views/information/TerminalAdmin.vue')
components.VehicleAdmin = () => import('@/views/information/VehicleAdmin.vue')
components.VehicleModelAdmin = () => import('@/views/information/VehicleModelAdmin.vue')
// process 流程管理
components.ActivitiTask = () => import('@/views/process/ActivitiTask.vue') // 待办
components.HistoryTask = () => import('@/views/process/HistoryTask.vue') // 已办
components.ReleasedTask = () => import('@/views/process/ReleasedTask.vue') // 已发

// monitoringPlatform 车站监控
components.Statistics = () => import('@/views/monitoringPlatform/statistics.vue') // 监控统计
components.BicycleList = () => import('@/views/monitoringPlatform/bicycleList.vue') // 车辆管理
// components.Bicycle = () => import('@/views/monitoringPlatform/bicycle.vue') // 车辆详情
// components.BicycleHistory = () => import('@/views/monitoringPlatform/bicycleHistory.vue') // 历史轨迹

components.HydrogenationStationList = () => import('@/views/monitoringPlatform/hydrogenationStationList.vue') // 加氢站列表
// components.HydrogenationStation = () => import('@/views/monitoringPlatform/hydrogenationStation.vue') //  加氢站详情

components.Enterprises = () => import('@/views/monitoringPlatform/enterprises.vue') // 车企统计
components.TechnologyUpgrading = () => import('@/views/statistics/technologyUpgrading.vue') // 单车监控
components.BasicPerformance = () => import('@/views/statistics/basicPerformance.vue') // 单车监控

// statistics 数据分析
components.StatisticalAnalysis = () => import('@/views/statistics/statisticalAnalysis.vue') // 统计分析
components.BasicPerformance = () => import('@/views/statistics/basicPerformance.vue') // 基本性能

// components.Economy = () => import('@/views/statistics/economy.vue') // 经济性
// components.Durability = () => import('@/views/statistics/.vue') // 耐久性
// components.ColdStart = () => import('@/views/statistics/coldStart.vue') // 低温冷启动

// industryService 行业服务
components.BasicInformationEntry = () => import('@/views/industryService/basicInformationEntry.vue') // 企业基本信息
components.Vehicle = () => import('@/views/industryService/vehicle.vue') // 车辆申报管理
components.Model = () => import('@/views/industryService/model.vue') // 车型申报管理
components.Parts = () => import('@/views/industryService/parts.vue') // 零部件申报管理

components.CompanyEntry = () => import('@/views/industryService/companyEntry.vue') // 企业准入审核
components.PartsEntry = () => import('@/views/industryService/partsEntry.vue') // 零部件准入审核
components.ModelEntry = () => import('@/views/industryService/modelEntry.vue') // 车型准入审核
components.VehicleEntry = () => import('@/views/industryService/vehicleEntry.vue') // 车辆准入审核
components.VehicleSampleCheck = () => import('@/views/industryService/vehicleSampleCheck.vue') // 车辆抽检管理

// pointsSettlement 审核清算
components.Declare = () => import('@/views/pointsSettlement/Declare.vue') // 清算申报
components.Examine = () => import('@/views/pointsSettlement/Examine.vue') // 清算审核
components.LiquidationSummary = () => import('@/views/pointsSettlement/LiquidationSummary.vue') // 清算汇总

export default class {
  assemblingComponents (params) {
    params.forEach((value, key) => {
      if (value.children) {
        if (value.children.length > 1) {
          value.children.sort(function (a, b) {
            return Number(a.node.sort) - Number(b.node.sort)
          })
        }
        value.children.forEach((value, key) => {
          if (value.children) {
            value.children.forEach((value, key) => {
              routers.push({
                path: value.node.path,
                name: value.node.component,
                meta: {
                  tagname: value.node.name
                },
                component: components[value.node.component]
              })
            })
          } else {
            routers.push({
              path: value.node.path,
              name: value.node.component,
              meta: {
                tagname: value.node.name
              },
              component: components[value.node.component]
            })
          }
        })
      } else {
        routers.push({
          path: value.node.path,
          name: value.node.component,
          meta: {
            tagname: value.node.name
          },
          component: components[value.node.component]
        })
      }
    })
    return routers
  }
}
