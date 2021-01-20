<template>
  <div class="login">
    <el-form
      ref="form"
      :model="form"
      class="container"
    >
      <div class="applay">
        <h3 class="welcome">
          欢迎登录
        </h3>
      </div>
      <el-form-item prop="loginName">
        <el-input
          v-model="form.loginName"
          placeholder="账户"
          prefix-icon="el-icon-user"
        />
      </el-form-item>
      <el-form-item prop="cipher">
        <el-input
          v-model="form.cipher"
          type="password"
          placeholder="密码"
          prefix-icon="el-icon-lock"
          @keyup.enter.native="login"
        />
      </el-form-item>
      <el-form-item
        v-show="loginCodeShow"
        prop="verify"
      >
        <el-row :gutter="10">
          <el-col :span="13">
            <el-input
              v-model="form.verify"
              auto-complete="off"
              placeholder="请输入验证码"
              size
              @keyup.enter.native="login"
            />
          </el-col>
          <el-col :span="11">
            <img
              class="identifyCode"
              :src="identifyCode"
              alt
              @click="getVerify"
            >
            <!--<div class="login-code" @click="refreshCode">-->
            <!--验证码组件-->
            <!-- <s-identify :identifyCode="identifyCode"></s-identify> -->
            <!--</div>-->
          </el-col>
        </el-row>
      </el-form-item>
      <el-checkbox
        v-model="form.rememberMe"
        checked
      >
        记住我
      </el-checkbox>
      <el-form-item>
        <el-button
          v-loading="loading"
          type="primary"
          class="login-btn"
          :disabled="loading"
          @click="login"
        >
          {{ loginName }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { resetRouter } from '../router'
import { JSEncrypt } from 'jsencrypt'
import cryptoJs from 'crypto-js'
export default {
  name: 'Login',
  data () {
    return {
      loading: false,
      rsa: '',
      form: {
        loginName: '',
        cipher: '',
        verify: '',
        rememberMe: false
      },
      uuid: '',
      publicDer: '',
      privateDer: '',
      num: 0,
      loginCodeShow: false, // 验证码登录是否显示
      checked: true, // 是否选中记住密码 true为选中
      disabled: false,
      loginName: '登录',
      identifyCode: ''
    }
  },
  created () {
    this.checkLogin()
  },
  methods: {
    /**
     * 时间:2019/10/15
     * 作者:yuanbotao
     * 功能:点击登录
     * @param null
     */
    login () {
           this.$router.push({
              path: "/",
              name: "home"
            });
      if (!this.form.loginName) {
        this.$message.error('用户名不可为空')
        return
      }
      if (!this.form.cipher) {
        this.$message.error('密码不可为空')
        return
      }
      if (this.loginCodeShow) {
        if (!this.form.verify || this.form.verify.length !== 4) {
          this.$message.error('请正确输入验证码')
          return
        }
      }
      if (!this.$regexp.cipher.test(this.form.loginName)) {
        this.$message.error('用户名和密码格式错误，请输入正确的用户名和密码')
        return
      }
      if (!this.$regexp.cipher.test(this.form.cipher)) {
        this.$message.error('用户名和密码格式错误，请输入正确的用户名和密码')
        return
      }
      this.uuid = this.get_uuid()
      this.getServePublic(this.uuid)

      this.loginName = "登录中...";
      this.loading = true;
      this.$api["getMenuData"](
        {},
        res => {
          if (res.code === "1") {
            let saveMenuData = this.$common.assemblingComponents(res.data);
            localStorage.setItem("routeMenuData", JSON.stringify(saveMenuData));

            this.$store.commit("changeloginName", this.form.loginName);
            resetRouter();
            this.$router.addRoutes(saveMenuData);
            this.$message.success("登录成功");
            this.$router.push({
              path: "/",
              name: "home"
            });
          }
          this.loginName = "登录";
          this.loading = false;
        },
        error => {
          this.loginName = "登录";
          this.loading = false;
        }
      );
    },
    loginHttp () {
      let userInfo
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
      let cipher = Encrypt.encrypt(this.form.cipher)
      if (this.loginCodeShow == true) {
        userInfo = {
          loginName: this.form.loginName,
          cipher: cipher,
          rememberMe: this.form.rememberMe,
          verify: this.form.verify
        }
      } else {
        userInfo = {
          loginName: this.form.loginName,
          cipher: cipher,
          rememberMe: this.form.rememberMe
        }
      }

      this.$http.post('/login', userInfo).then(({ data }) => {
        if (
          data.code == 'Auth_001' ||
          data.code == 'Auth_002' ||
          this.num > 2
        ) {
          this.loginCodeShow = true
          this.form.verify = ''
          this.getVerify()
        }
        if (data.code == '200') {
          this.num = 0
          localStorage.setItem('isLogin', JSON.stringify(data.data.loginName))
          this.$store.commit('changeMenu', data.data.permissionTree)
          this.$store.commit('tagsStore/initWorkTags')
          this.$store.commit('changeTenantCode', data.data.tenantCode)
          this.$store.commit('changeUsername', data.data.userName)
          this.$store.commit('clearMonitorVehicles')
          this.$store.commit('changeUserId', data.data.userId)
          let saveMenuData = this.$common.assemblingComponents(
            data.data.permissionTree
          )
          resetRouter(saveMenuData)
          this.$router.addRoutes(saveMenuData)

          this.$nextTick(() => {
            // 判断首页是否存在进行跳转
            let permissionTree = data.data.permissionTree
            for (let i = 0; i < permissionTree.length; i++) {
              if (permissionTree[i].node.component == 'Home') {
                this.$router.push({
                  path: '/',
                  name: 'Home'
                })
                return false
              } else {
                // 路由对象传入vuex
                this.$store.dispatch('tagsStore/workTagsRemove', {
                  tag: {
                    path: '/',
                    name: 'Home'
                  },
                  router: this.$router
                })
                this.$router.push({
                  path: permissionTree[i].children[0].node.path,
                  name: permissionTree[i].children[0].node.component
                })
                return false
              }
            }
          })
        } else {
          this.num++
          if (this.num == 3) {
            this.loginCodeShow = true
            this.form.verify = ''
            this.getVerify()
          }
          this.$message.error(data.msg)
        }
      })
    },
    // 获取服务器公钥
    getServePublic (cpk) {
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
          this.loginHttp()
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
    // 获取验证码
    getVerify () {
      let that = this
      this.$http
        .get('/verify', { responseType: 'arraybuffer' })
        .then(function (response) {
          return (
            'data:image/png;base64,' +
            btoa(
              new Uint8Array(response.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ''
              )
            )
          )
        })
        .then(function (data) {
          // 接收转换后的Base64图片
          that.identifyCode = data
        })
        .catch(function (err) {})
    },
    checkLogin () {
      this.$http.get('/login/check').then(({ data }) => {
        if (data.code == '200') {
          localStorage.setItem('isLogin', JSON.stringify(data.data.loginName))
          this.$store.commit('changeMenu', data.data.permissionTree)
          this.$store.commit('tagsStore/initWorkTags')
          this.$store.commit('changeTenantCode', data.data.tenantCode)
          this.$store.commit('changeUsername', data.data.userName)
          this.$store.commit('clearMonitorVehicles')
          this.$store.commit('changeUserId', data.data.userId)
          let saveMenuData = this.$common.assemblingComponents(
            data.data.permissionTree
          )
          resetRouter(saveMenuData)
          this.$router.addRoutes(saveMenuData)

          this.$nextTick(() => {
            // 判断首页是否存在进行跳转
            let permissionTree = data.data.permissionTree
            for (let i = 0; i < permissionTree.length; i++) {
              if (permissionTree[i].node.component == 'Home') {
                this.$router.push({
                  path: '/',
                  name: 'Home'
                })
                return false
              } else {
                // 路由对象传入vuex
                this.$store.dispatch('tagsStore/workTagsRemove', {
                  tag: {
                    path: '/',
                    name: 'Home'
                  },
                  router: this.$router
                })
                this.$router.push({
                  path: permissionTree[i].children[0].node.path,
                  name: permissionTree[i].children[0].node.component
                })
                return false
              }
            }
          })
        } else if (data.code == 'Auth_401') {
        } else {
          this.$message.error(data.msg)
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.login {
  width: 100%;
  height: 100%;
  background: url("../assets/img/login/bg1.png") no-repeat;
  background-size: 100% 100%;
  .container {
    border-radius: 5px;
    position: absolute;
    right: 10%;
    top: 30%;
    width: 360px;
    padding: 0px 25px 15px 25px;
    background: white;
    .login-btn {
      width: 100%;
    }
    .welcome {
      color: #0d96ff;
      font-size: 22px;
      font-weight: bold;
      text-align: center;
      margin-top: 26px;
      margin-bottom: 13px;
    }
    .applay {
      height: 50px;
      margin-bottom: 20px;
    }
  }
}
.identifyCode {
  float: right;
}
</style>
<style lang="less">
.login .container {
  /*加载样式*/
  .el-loading-mask {
    background-color: rgba(255, 255, 255, 0.1) !important;
    .el-loading-spinner {
      margin-top: -10px !important;
      .circular {
        width: 22px !important;
        height: 22px !important;
      }
    }
  }
}
</style>
