<template>
  <div
    id="app"
    class="white-skin"
  >
    <!-- 登录注册页面 -->
    <router-view v-if="$route.name == 'Login'||$route.name == 'Register'" />
    <!-- 内容部分 -->
    <div
      v-else
      class="main-page"
    >
      <!--头部页面开始-->
      <div class="global-header">
        <Gobal-Header
          :default-active="defaultActive"
          :is-collapse="isCollapse"
        />
      </div>
      <!--面包屑-->
      <div class="breadcrumb" v-if="$store.state.dropdown.father">
        <el-breadcrumb separator-class="el-icon-arrow-right">
<!--          <el-breadcrumb-item v-if="!$store.state.dropdown.father" :to="{ path: '/home' }"><span class="el-icon-location-outline" @click="changeBreadcrumb()"> 首页</span></el-breadcrumb-item>-->
          <el-breadcrumb-item v-if="$store.state.dropdown.father">{{$store.state.dropdown.father}}</el-breadcrumb-item>
          <el-breadcrumb-item v-if="$store.state.dropdown.son">{{$store.state.dropdown.son}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!--头部页面结束-->
      <!-- <div v-if="$route.name !== 'Login'">
        <el-tag
          v-for="tag in workTags"
          :key="tag.name"
          closable
          color="#ffffff"
          @click="selectTag(tag)"
          @close="closeTag(tag)"
        >
          <template>
            <span :class="currentSelectTags(tag.tagname)">
              <span class="indent"></span>
              <span class="text">{{tag.tagname}}</span>
            </span>
          </template>
        </el-tag>
      </div> -->
      <!--路由页面开始-->
      <div class="global-main" v-if="!$store.state.dropdown.father" style="top: 42px">
        <router-view />
      </div>
      <div class="global-main" v-else>
        <!--需要时添加keep-alive-->
        <!-- <keep-alive :include="activePages">
          <router-view />
        </keep-alive>-->
        <router-view />
      </div>
      <!--底部页面开始-->
      <!-- <div class="global-footer" v-if="footerItemType == '1'">
        <footer class="footer">
          <img class="logo_contain" src="./assets/img/login/logo.png" />
        </footer>
      </div>-->
      <!--底部页面结束-->
    </div>
    <!--弹出层-->
  </div>
</template>

<script>
import axios from 'axios'
import { mapActions } from 'vuex'
import { JSEncrypt } from 'jsencrypt'
import cryptoJs from 'crypto-js'
import GobalHeader from '@/components/global/Header.vue'
import { resetRouter } from './router'
export default {
  name: 'App',
  components: {
    GobalHeader
  },
  data () {
    // 失去焦距的判断两次密码不止一次的校验规则
    let validPassWorld = (rule, value, callback) => {
      this.ncipherValid = true
      if (this.formEdit.ncipher !== value && this.cpdValid) {
        callback(new Error('两次密码输入不一致'))
        return
      }
      if (
        this.formEdit.ncipher.length >= 6 &&
        this.formEdit.ncipher.length <= 20
      ) {
        callback()
        this.$refs.formEdit.clearValidate('ncipher')
      }
    }
    // 失去焦距的判断两次密码不止一次的校验规则
    let validCpd = (rule, value, callback) => {
      this.cpdValid = true
      if (this.formEdit.cpd !== value && this.cipherValid) {
        callback(new Error('两次密码输入不一致'))
        return
      }

      callback()
      this.$refs.formEdit.clearValidate('cpd')
    }
    return {
      isCollapse: false,
      rsa: '',
      uuid: '',
      formEdit: {}, // 修改密码提交表单
      cipherValid: false, // 未获取过焦距，非提交不进行两次密码不一致校验
      cpdValid: false, // 未获取过焦距，非提交不进行两次密码不一致校验
      menu: [], // 菜单
      /** 弹出层相关参数 **/
      // 弹出层显示（隐藏）绑定值
      dialogVisible: false,
      // 弹出层标题
      dialogTitle: '',
      // 操作类型参数
      dialogType: '',
      rules: {
        ocipher: [{ required: true, message: '请输入旧密码' }],
        ncipher: [
          { required: true, message: '请输入新密码' },
          {
            pattern: this.$regexp.cipher,
            message: '密码仅为英文和数字最少6位，最长不超过20位',
            trigger: 'blur'
          },
          {
            validator: validCpd,
            trigger: 'blur'
          }
        ],
        cpd: [
          { required: true, message: '请输入确认密码' },
          { validator: validPassWorld, trigger: 'blur' },
          {
            pattern: this.$regexp.cipher,
            message: '密码仅为英文和数字最少6位，最长不超过20位',
            trigger: 'blur'
          }
        ]
      }
    }
  },

  methods: {
    /**
     * 时间:2019/10/16
     * 作者:yuanbotao
     * 功能:菜单伸缩
     * @param null
     */
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    changeCipher (data) {
      delete data.cpd
      let newData = this.$clone(data)
      let der = cryptoJs
        .MD5(this.uuid)
        .toString()
        .substr(0, 16)
      let pubKey = cryptoJs.AES.decrypt(
        cryptoJs.enc.Base64.stringify(cryptoJs.enc.Hex.parse(this.rsa)),
        cryptoJs.enc.Utf8.parse(der),
        {
          mode: cryptoJs.mode.ECB,
          padding: cryptoJs.pad.Pkcs7
        }
      ).toString(cryptoJs.enc.Utf8)
      let Encrypt = new JSEncrypt()
      Encrypt.setPublicKey(pubKey)
      newData.ocipher = Encrypt.encrypt(newData.ocipher)
      newData.ncipher = Encrypt.encrypt(newData.ncipher)
      this.$http.put('/system/user/change-cipher', newData).then(({ data }) => {
        if (data.code === '200') {
          this.dialogVisible = false
          this.$message.success('修改成功')
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 获取公钥私钥
    confirmSubmit (data) {
      this.uuid = this.get_uuid()
      this.getServePublic(this.uuid, data)
    },
    // 获取服务器公钥
    getServePublic (cpk, formData) {
      this.$http({
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        url: '/rsa',
        data: cpk
      }).then(({ data }) => {
        if (data.code == '200') {
          this.rsa = data.data
          this.changeCipher(formData)
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    get_uuid: function () {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (
        c
      ) {
        var r = (Math.random() * 16) | 0
        var v = c == 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      })
    },
    /**
     * 时间:2019/10/16
     * 作者:yuanbotao
     * 功能:更换皮肤
     * @param row: 选中状态
     */
    changeSkin (row) {
      if (row == '1') {
        $('#app').removeClass('red-skin')
        $('#app').addClass('white-skin')
      } else if (row == '2') {
        $('#app').removeClass('white-skin')
        $('#app').addClass('red-skin')
      }
      localStorage.setItem('skinType', row)
    },

    /**
     * 时间:2019/10/18
     * 作者:yuanbotao
     * 功能: 点击菜单跳转页面
     * @param params: 菜单数据
     */

    // 判断当前页签是否为被选中，改变样式
    currentSelectTags (tagname) {
      if (this.$store.state['tagsStore'].workTags.current.tagname == tagname) {
        return 'active'
      } else {
        return 'noActive'
      }
    },
    selectTag (tag) {
      // 路由对象传入vuex
      this.$router.push({
        path: tag.path
      })
    },
    closeTag (tag) {
      if (tag.name == 'OneVehicleMonitor') {
        this.$store.commit('clearMonitorVehicles')
      }
      // 路由对象传入vuex
      this.workTagsRemove({
        tag: tag,
        router: this.$router
      })
    },
    checkLogin () {
      this.$http.get('/login/check').then(({ data }) => {
        if (data.code == '200') {
          localStorage.setItem('isLogin', JSON.stringify(data.data.loginName))
          this.$store.commit('changeMenu', data.data.permissionTree)
          this.$store.commit('tagsStore/initWorkTags')
          this.$store.commit('changeTenantCode', data.data.tenantCode)
          this.$store.commit('changeUsername', data.data.usname)
          this.$store.commit('clearMonitorVehicles')
          this.$store.commit('changeUserId', data.data.usid)
          let saveMenuData = this.$common.assemblingComponents(
            data.data.permissionTree
          )
          resetRouter(saveMenuData)
          this.$router.addRoutes(saveMenuData)

          // this.$nextTick(() => {
            // 判断首页是否存在进行跳转
            let permissionTree = data.data.permissionTree
            // for (let i = 0; i < permissionTree.length; i++) {
              // if (permissionTree[i].node.component == 'Home') {
                // this.$router.push({
                //   path: '/',
                //   name: 'Home'
                // })
                // return false
              // } else {
                // 路由对象传入vuex
                /*this.$store.dispatch('tagsStore/workTagsRemove', {
                  tag: {
                    path: '/',
                    name: 'Home'
                  },
                  router: this.$router
                })*/
                // this.$router.push({
                //   path: permissionTree[i].children[0].node.path,
                //   name: permissionTree[i].children[0].node.component
                // })
                // return false
              // }
            // }
          // })
        } else if (data.code == 'Auth_401') {
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // vuex辅助函数
    ...mapActions('tagsStore', ['workTagsRemove'])
  },
  computed: {
    // 计算list改变
    workTags () {
      return this.$store.state['tagsStore'].workTags.list
    },
    currentActiveTags () {
      return this.$store.state['tagsStore'].workTags.current
    },
    activePages () {
      return this.$store.state['tagsStore'].activePages
    },
    defaultActive () {
      return this.$route.path // 当前激活的menu index
    }
  },
  watch: {
    '$route.name' : function (val) {
      console.log(val)
      if (val == 'Login' || val == 'Home') {
        sessionStorage.setItem('dropdownFather', '')
        sessionStorage.setItem('dropdownSon', '')
        this.$store.state.dropdown = {'father': null, 'son': null};
      }
    },
    '$store.state.menu': function (val) {
      this.menu = val
    }
  },
  created () {
    this.$store.state.dropdown = {'father': sessionStorage.getItem('dropdownFather'), 'son': sessionStorage.getItem('dropdownSon')};
    // this.$loading({
    //       lock: true,
    //       text: 'Loading',
    //       spinner: 'el-icon-loading',
    //       background: 'rgba(0, 0, 0, 0.7)'
    //     })
    if (this.$route.name !== 'Login') {
      this.menu = this.$store.state.menu
      // this.$router.addRoutes(this.$store.state.routers)
      // 设置用户名显示信息
      // let userInfo = JSON.parse(localStorage.getItem('isLogin'));
      // this.$store.commit('changeUsername', userInfo.username);
      // 获取页脚的显隐
      // if (localStorage.getItem('isShowFooter') == null) {
      //     // 默认显示页脚
      //     this.footerItemType = "1";
      // } else {
      //     this.footerItemType = localStorage.getItem('isShowFooter').toString();
      // }
      // localStorage.setItem('isShowFooter',this.footerItemType)
      // 获取皮肤的设置
      // if (localStorage.getItem("skinType") == "1") {
      //     $("#app").removeClass("red-skin");
      //     $("#app").addClass("white-skin");
      // } else if (localStorage.getItem("skinType") == "2") {
      //     $("#app").removeClass("white-skin");
      //     $("#app").addClass("red-skin");
      // }
    }
    // this.initActiveMenu();
    this.checkLogin()
  }
}
</script>
<style lang="less">
/*面包屑*/
.breadcrumb{
  width: 100%;
  height: 30px;
  line-height: 30px;
  padding: 0 15px;
  background-color: #F0F2F5;
  z-index: 2;
  font-size: 12px;
}
.breadcrumb .el-breadcrumb{
  line-height: 30px;
  font-size: 12px;
}
/*loading样式*/
.el-loading-spinner {
  font-size: 60px;
  .el-icon-loading {
    color: rgba(0, 0, 0, 1);
  }
  p.el-loading-text {
    font-size: 20px;
    color: rgba(0, 0, 0, 1);
  }
}
/*兼容ie11*/
.formEdit .el-input input {
  vertical-align: top;
}
/*兼容ie11，遮挡层*/
body .el-dialog__wrapper {
  overflow: hidden;
}
.el-table__fixed-body-wrapper {
  height: 100%;
}
/*兼容ie10*/
.el-message--error .el-message__content {
  width: calc(100% - 20px);
}
/*兼容ie弹框关闭闪动问题*/
.el-dialog__wrapper {
  &.dialog-fade-leave-active {
    -ms-animation: none;
  }
}
/*下拉选过宽问题*/

.el-select-dropdown {
  max-width: 200px;
}
.el-select-dropdown__item {
  display: inline-block;
}
.el-select-dropdown__item span {
  min-width: 150px;
  display: inline-block;
}
/* 全局样式 */
.el-table .darkRow {
  background: #f8f8f9;
}
// tooltio过长问题
.el-tooltip__popper {
  width: 200px;
}
// 页签样式
.el-tag {
  margin-left: 8px;
  cursor: pointer;
  .active {
    .indent {
      display: inline-block;
      height: 8px;
      width: 8px;
      border-radius: 50%;
      background-color: #2d8cf0;
      margin-right: 8px;
    }
  }
  .noActive {
    .indent {
      display: inline-block;
      height: 8px;
      width: 8px;
      border-radius: 50%;
      background-color: #e8eaec;
      margin-right: 8px;
    }
    .text {
      color: #aaaaaa;
    }
  }
}
// menu弹出位置
.el-menu--popup-bottom-start {
  margin-top: 0px !important;
  background: #ffffff !important;
  .el-menu-item {
    background: #ffffff !important;
    color: #303133 !important;
  }
}


.info {
  opacity: 1;
  line-height: 25px;
  white-space: nowrap;
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
}
.formEdit .el-input {
  width: 200px;
  margin-right: 5px;
}
.dialog-footer {
  text-align: center;
}
/*删除按钮被遮挡层遮挡*/
.el-button--danger:focus {
  color: #fff;
  background-color: #f56c6c;
  border-color: #f56c6c;
}
.el-button--danger:hover {
  background: #f78989;
  border-color: #f78989;
  color: #fff;
}
/** 主题样式 **/
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  list-style: none;
}
ul li {
  text-decoration: none;
}
a {
  text-decoration: none;
}
/** 弹性盒布局 **/
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  display: -webkit-flex;
  position: fixed;
  width: 100%;
  height: 100%;
}
.menu-box {
  /*display:flex;*/
  /*display:-webkit-flex;*/
  flex-direction: column;
  justity-content: center;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  z-index: 999;
  background-color: #1b3955;
  .el-menu-vertical-demo {
    border-right: 0;
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .cicv-logo {
    display: flex;
    height: 38px;
    margin: 10px 10px 10px 12px;
    background-color: #1b3955;
    img {
      height: 38px;
    }
    .logoText {
      flex: 1;
      width: 100px;
      text-align: center;
      color: #fff;
      word-wrap: break-word;
      height: 38px;
      overflow: hidden;
      > div:first-child {
        font-weight: 700;
        font-size: 16px;
      }
      > div:last-child {
        font-size: 14px;
        font-weight: 600;
      }
    }
  }
}
.main-page {
  flex: 1;
  display: flex;
  overflow: hidden;
  position: relative;
  flex-direction: column;
  height: 100%;
  .global-header {
    position: relative;
    display: flex;
    background-color: #275998;
    .show-buttom {
      position: absolute;
      top: 0px;
      left: 10px;
      z-index: 999;
    }
    /*采用flex布局*/
    .header {
      padding: 0 20px;
      display: flex;
      height: 42px;
      border-bottom: 1px solid #ccc;
      flex-grow: 1; // 剩余部分充满
      .login-logo {
        display: flex;
        align-items: center;
        div {
          margin-left: 10px;
          height: 56px;
          line-height: 56px;
          font-size: 30px;
          font-weight: 700;
        }
      }
      .logo_contain {
        width: 60px;
        height: 60px;
        justify-content: flex-start;
        align-items: center;
        margin-left: 0px;
      }
      .main-function {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-grow: 1; // 剩余部分充满
        height: 100%;
        box-shadow: 0px 3px 13px rgba(59, 66, 130, 0.51);
        background-color: #275998;
        img {
          vertical-align: middle;
        }
        .icon-chart {
          margin-right: 20px;
          cursor: pointer;
          img {
            width: 18px;
            height: 18px;
          }
        }
        .message-reminder {
          img {
            height: 21px !important;
          }
        }
      }
    }
  }
  .global-main {
    display: flex;
    flex-grow: 1; // 剩余部分充满
    overflow-y: auto;
    background-color: #f0f2f5;
    min-height: 575px;
    overflow: auto;
    position: absolute;
    bottom: 0px;
    left: 0px;
    top: 72px;
    right: 0px;
    width:100%;
  }
  .login-main {
    padding: 0px;
  }
  .global-footer {
    display: flex;
    .footer {
      height: 60px;
      background: #2d5aab;
      display: flex;
      flex-grow: 1; // 剩余部分充满
      img {
        margin: 4px 0;
        margin-left: calc(50% - 127px);
      }
    }
  }
}

.return-top {
  .top-block {
    width: 100%;
    height: 100%;
    background-color: #f2f5f6;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
    text-align: center;
    line-height: 40px;
    color: #1989fa;
  }
}
.return-top {
  position: fixed;
  right: 0px;
  bottom: 97px;
  width: 34px;
  height: 35px;
  border-radius: 5px;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.2);
  line-height: 35px;
  text-align: center;
  color: #ffffff;
  transition: all 0.3s;
  z-index: 999;
  user-select: none;
  span {
    position: absolute;
    display: none;
    left: 7px;
  }
  i {
    position: absolute;
    color: #ffffff;
    top: 8px;
    right: 11px;
  }
  &:hover {
    background: rgba(24, 144, 255, 0.6);
    width: 63px;
    span {
      display: block;
    }
  }
}
</style>
