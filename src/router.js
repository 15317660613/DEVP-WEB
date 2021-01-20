import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/index'

/** 登录页面 **/
import Register from './views/register'
import Login from './views/login/index.vue'
// import ce from './views/statistics/economy.vue'
import BicycleHistory from './views/monitoringPlatform/bicycleHistory.vue' // 历史轨迹
import Bicycle from './views/monitoringPlatform/bicycle.vue' // 车辆详情
import HydrogenationStation from './views/monitoringPlatform/hydrogenationStation.vue' // 加氢站详情

import Economy from './views/statistics/economy.vue' // 经济性
import Durability from './views/statistics/durability.vue' // 耐久性
import ColdStart from './views/statistics/coldStart.vue' // 低温冷启动

// 首页相关跳转新
import NewsDetail from './views/homePage/newsDetail'
import NewsMore from './views/homePage/newsMore'
import NoticeDetail from './views/homePage/noticeDetail'
import NoticeMore from './views/homePage/noticeMore'
import WorkMore from './views/homePage/workMore'

import BasicCompanyEntry from './views/industryService/basicCompanyEntry'

/** 404页面 **/
import NotFound from './views/NotFound.vue'
/** 引入全局js **/
import common from './assets/js/common'

Vue.use(Router)

/**
 * 重写路由的push方法
 */
const routerPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return routerPush.call(this, location).catch(error => error)
}

const createRouter = () => new Router({
  /** 去掉项目中的url的# **/
  mode: process.env.NODE_ENV === 'development' ? 'history' : '',
  base: process.env.NODE_ENV === 'development' ? process.env.BASE_URL : '',
  routes: [
    /**
    * 时间:2019/10/11
    * 作者:yuanbotao
    * 功能:登录页
    */
    {
      path: '/',
      redirect: '/views/login'
    },
    {
      path: '/views/Login',
      name: 'Login',
      component: Login,
      meta: {
        loginCheck: false

      }
    },
    {
      path: '/views/register',
      name: 'Register',
      component: Register
    },
    // {
    //   path: '/views/ce',
    //   name: 'ce',
    //   component: ce
    // },
    {
      path: '/views/404',
      name: 'NotFound',
      component: NotFound
    }, {
      path: '*', // 此处需特别注意置于最底部
      redirect: '/views/404'
    },
    /* 详情  */
    {
      path: '/monitoringPlatform/bicycleHistory',
      name: 'BicycleHistory',
      component: BicycleHistory
    },
    {
      path: '/monitoringPlatform/bicycle',
      name: 'Bicycle',
      component: Bicycle
    },
    {
      path: '/monitoringPlatform/hydrogenationStation',
      name: 'HydrogenationStation',
      component: HydrogenationStation
    },
    {
      path: '/statistics/economy',
      name: 'Economy',
      component: Economy
    },
    {
      path: '/statistics/durability',
      name: 'Durability',
      component: Durability
    },
    {
      path: '/statistics/coldStart',
      name: 'ColdStart',
      component: ColdStart
    },
    {
      path: '/homePage/newsDetail',
      name: 'NewsDetail',
      component: NewsDetail
    },
    {
      path: '/homePage/newsMore',
      name: 'NewsMore',
      component: NewsMore
    },
    {
      path: '/homePage/noticeDetail',
      name: 'NoticeDetail',
      component: NoticeDetail
    },
    {
      path: '/homePage/noticeMore',
      name: 'NoticeMore',
      component: NoticeMore
    },
    {
      path: '/homePage/workMore',
      name: 'WorkMore',
      component: WorkMore
    },
    {
      path: '/industryService/basicCompanyEntry',
      name: 'BasicCompanyEntry',
      component: BasicCompanyEntry
    }
    // {
    //   path: '/industryService/vehicleSampleCheck',
    //   name: 'VehicleSampleCheck',
    //   component: VehicleSampleCheck
    // }
  ]
})

const router = createRouter()
const commonJs = new common()
const newRouter = createRouter()
router.matcher = newRouter.matcher
const newMenu = commonJs.assemblingComponents(store.state.menu)
router.addRoutes(newMenu)

/**
 * 时间:2019/10/11
 * 作者:yuanbotao
 * 功能:路由守卫（初始登录以及非法登录跳转到登录页）
 */
router.beforeEach((to, from, next) => {
  // 登录页存入的登录用户信息
  let isLogin = JSON.parse(localStorage.getItem('isLogin'))
  if (to.meta.tagname) {
    // 判断tagname是否存在，存在则激活workTagsRoute
    store.dispatch('tagsStore/workTagsRoute', {
      name: to.name,
      tagname: to.meta.tagname,
      path: to.path
    })
  }
  if (to.name) {
    if (to.meta.loginCheck && !isLogin) {
      next({
        name: 'Login'
      })
    } else {
      next()
    }
  } else {
    if (!isLogin) {
      next({
        name: 'Login'
      })
    } else {
      next({
        name: 'home'
      })
    }
  }
})

export default router

export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}
