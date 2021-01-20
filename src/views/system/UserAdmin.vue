
<template>
  <div class="flexBlock">
  <div class="content">
    <div style="float: left;font-size: 14px;color: #303133;padding-top: 7px;font-weight: bolder">用户管理</div>
    <el-form
      class="formSearch"
      :model="formSearchModel"
      label-width="80px"
      style="text-align: right"
    >
      <el-input
        v-model="formSearchModel.account"
        maxlength="200"
        type="userName"
        size="small"
        placeholder="用户名"
      />
      <el-input
        v-model="formSearchModel.usname"
        type="name"
        maxlength="200"
        size="small"
        placeholder="真实姓名"
      />
<!--      <el-select-->
<!--        v-model="formSearchModel.departmentId"-->
<!--        type="type"-->
<!--        placeholder="所属分组"-->
<!--      >-->
<!--        <el-option-->
<!--          v-for="item in departmentList"-->
<!--          :key="item.id"-->
<!--          :label="item.name"-->
<!--          :value="item.id"-->
<!--          clearable-->
<!--          filterable-->
<!--        />-->
<!--      </el-select>-->
      <el-button
        type="primary"
        @click="search"
        size="small"
      >
        搜索
      </el-button>
      <el-button  size="small" @click="addUser">
        新增
      </el-button>
      <el-button  size="small" @click="reset">
        重置
      </el-button>
    </el-form>
    <el-table
      ref="elTable"
      :data="tableData.records"
      border
      style="width: 100%"
      height="calc(100vh - 195px)"
      size="mini"
      header-row-class-name="tableHeaderStyle"
      :cell-style="{height:'35px',padding:'5px 0px'}"
      :header-cell-style="{background:'#f8f8f9'}"
    >
      <el-table-column
        align="center"
        label="序号"
        type="index"
        width="80"
      >
        <template slot-scope="scope">
          <span>{{ scope.$index+(page.current - 1) * page.size + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="用户名"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ scope.row.account }}
        </template>
      </el-table-column>
      <el-table-column
        label="真实姓名"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ scope.row.usname }}
        </template>
      </el-table-column>
<!--      <el-table-column-->
<!--        label="所属分组"-->
<!--        align="center"-->
<!--        show-overflow-tooltip-->
<!--      >-->
<!--        <template slot-scope="scope">-->
<!--          {{ scope.row.departmentName }}-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        label="用户Code"-->
<!--        align="center"-->
<!--        show-overflow-tooltip-->
<!--      >-->
<!--        <template slot-scope="scope">-->
<!--          {{ scope.row.userCode }}-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column
        label="操作"
        align="center"
        width="380"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleSee(scope.$index, scope.row)"
          >
            查看
          </el-button>
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
          >
            编辑
          </el-button>
          <el-button
            size="mini"
            @click="handleResetCipher(scope.$index, scope.row)"
          >
            重置密码
          </el-button>
          <el-button
            v-if="scope.row.status == '1'"
            size="mini"
            type="success"
            @click="handleEnable(scope.$index, scope.row)"
          >
            启用
          </el-button>
          <el-button
            v-if="scope.row.status == '0'"
            size="mini"
            type="danger"
            @click="handleDisable(scope.$index, scope.row)"
          >
            禁用
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="sysPage">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next,jumper"
        :total="Number(tableData.total)"
        :page-sizes="[10, 20, 30, 40,50]"
        :page-size="20"
        :current-page="Number(tableData.current)"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
     <!-- <el-pagination
        :current-page="page.current"
        :page-sizes="[10, 20, 30, 40,50]"
        :page-size="10"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="Number(tableData.total)"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />-->
    </div>
    <!-- 弹出框 -->
    <el-dialog
      :title="userInfor"
      :visible.sync="editFormVisible"
      width="400px"
      :modal-append-to-body="false"
      :before-close="closeDialog"
    >
      <el-form
        ref="formEdit"
        :model="formEdit"
        class="formEdit"
        :disabled="formEditDisabled"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item
          label="用户名"
          class="loginName"
          prop="loginName"
        >
          <el-input
            v-model="tenantName"
            disabled="disabled"
          />
          <el-input
            v-model="formEdit.loginName"
            class="loginNameInput"
            :disabled="dialogType === 'edit'"
            :title="formEdit.loginName"
            maxlength="200"
          />
          <el-input style="position:fixed;bottom:-9999px;" />
        </el-form-item>
        <el-form-item
          v-if="dialogType === 'add'"
          label="用户密码"
          prop="psw"
        >
          <el-input
            v-model="formEdit.psw"
            auto-complete="new-password"
            type="password"
            maxlength="200"
          />
        </el-form-item>
        <el-form-item
          v-if="dialogType === 'add'"
          label="确认密码"
          prop="cpd"
        >
          <el-input
            v-model="formEdit.cpd"
            auto-complete="new-password"
            type="password"
            maxlength="200"
          />
        </el-form-item>
        <el-form-item
          label="真实姓名"
          prop="name"
        >
          <el-input
            v-model="formEdit.usname"
            :title="formEdit.usname"
            autocomplete="off"
            maxlength="200"
          />
        </el-form-item>
<!--        <el-form-item-->
<!--          label="所属分组"-->
<!--          prop="departmentId"-->
<!--        >-->
<!--          <el-select-->
<!--            v-model="formEdit.departmentId"-->
<!--            :title="formEdit.departmentName"-->
<!--            placeholder="请选择所属分组"-->
<!--            filterable-->
<!--            @change="departmentChange"-->
<!--          >-->
<!--            <el-option-->
<!--              v-for="item in departmentList"-->
<!--              :key="item.id"-->
<!--              :label="item.name"-->
<!--              :value="item.id"-->
<!--            />-->
<!--          </el-select>-->
<!--        </el-form-item>-->
        <el-form-item
          label="所属角色"
          prop="roleIds"
        >
          <el-select
            v-model="formEdit.roleIds"
            :title="formEdit.roleIds|rolesLabels(roleList)"
            multiple
            filterable
            placeholder="请选择所属角色"
            @change="$forceUpdate()"
          >
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="所属角色">
        <el-select v-model="formEdit.role" placeholder="请选择角色分组">
          <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in roleList"></el-option>
        </el-select>
        </el-form-item>-->
        <div
          v-if="dialogType !== 'see'"
          class="dialog-footer"
        >
          <el-button @click="cancelEdit('formEdit')">
            取 消
          </el-button>
          <el-button
            type="primary"
            @click="submitForm('formEdit')"
          >
            确 定
          </el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
  </div>
</template>

<script>
import { JSEncrypt } from 'jsencrypt'
import cryptoJs from 'crypto-js'
export default {
  name: 'UserAdmin',
  filters: {
    rolesLabels (ids, list) {
      if (ids && list) {
        let roles = ''
        list.forEach(item => {
          for (var i = 0; i < ids.length; i++) {
            if (ids[i] == item.id) {
              roles += item.name + '、'
            }
          }
        })
        return roles.substr(0, roles.length - 1)
      }
    }
  },
  data () {
    // 失去焦距的判断两次密码不止一次的校验规则
    let validPassWorld = (rule, value, callback) => {
      this.pswValid = true
      if (this.formEdit.psw !== value && this.cpdValid) {
        callback(new Error('两次密码输入不一致'))
        return
      }
      callback()
      this.$refs.formEdit.clearValidate('psw')
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
    let noEmptyValid = (rule, value, callback) => {
      if (value !== '' && !this.$regexp.cipher.test(value)) {
        callback(new Error('密码仅为英文和数字最少6位，最长不超过20位'))
      } else {
        callback()
      }
    }
    return {
      tableData: [],
      rsa: '',
      uuid: '',
      tenantName: '',
      formEditDisabled: false, // 是否禁用from表单中组件功能
      dialogType: 'see', // 弹框类型
      page: {
        current: 1,
        size: 20
      }, // 当前页
      formSearchModel: {
        account: '',
        usname: ''
      },
      formSearch: {
        account: '',
        usname: ''
      },
      cipherValid: false, // 未获取过焦距，非提交不进行两次密码不一致校验
      cpdValid: false, // 未获取过焦距，非提交不进行两次密码不一致校验
      userInfor: '编辑用户信息',
      querys: null, // 用来判断是否进行条件搜索
      formEdit: {},
      departmentList: [], // 分组列表
      roleList: [], // 角色分组
      editFormVisible: false, // 编辑弹出框隐藏
      rules: {
        // 校验规则
        loginName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            pattern: /^[A-Za-z0-9]{3,10}$/,
            message: '允许输入3-10位英文与数字'
          },
          { validator: this.$specialCharValid, trigger: 'blur' }
        ],
        departmentId: [
          {
            required: true,
            message: '请选择所属分组',
            trigger: 'change'
          },
          { validator: this.$specialCharValid, trigger: 'blur' }
        ],
        name: [
          { validator: this.$specialCharValid, trigger: 'blur' }
        ],
        psw: [
          {
            validator: noEmptyValid,
            trigger: 'blur'
          },
          {
            validator: validCpd,
            trigger: 'blur'
          }
        ],
        cpd: [
          {
            validator: noEmptyValid,
            trigger: 'blur'
          },
          { validator: validPassWorld, trigger: 'blur' }
        ],
        roleIds: [
          {
            required: true,
            message: '请选择所属角色',
            trigger: 'change'
          },
          { validator: this.$specialCharValid, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getTableData()
    this.getDepartmentList()
  },
  methods: {
    reset () {
      this.formSearch = {}
      this.formSearchModel = {}
      this.querys = ''
      this.getTableData()
    },
    closeDialog (done) {
      this.$refs.formEdit.clearValidate()
      done()
    },
    search () {
      // 条件搜搜
      this.page.current = 1
      this.formSearch = this.$clone(this.formSearchModel)
      this.querys = [
        {
          like: this.formSearch
        }
      ]
      this.getTableData()
    },
    // 列表表格加载
    getTableData () {
      let params = {
        // account: '',
        // cellphoneNumber: '',
        // email: '',
        // tenantId: '',
        // userState: '',
        // usname: this.$store.state.username,

        page: {
          current: this.page.current,
          size: this.page.size,
          orders: [
            {
              asc: false,
              column: 'USID'
            }
          ]
        }
      }
      if (this.querys) {
        params.querys = this.querys
      }
      this.$http.post('/rdbms/user/page', params).then(({ data }) => {

        if (data.code === '200') {
          this.tableData = data.data
          this.$nextTick(() => {
            this.$refs.elTable.doLayout()
          })
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    addSysUser (data) {
      let newData = this.$clone(data)
      newData.roles = newData.roleIds.map(item => {
        return {
          id: item
        }
      })
      let publicDer = this.$store.state.publicDer
      delete newData.cpd
      delete newData.roleIds
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
      newData.psw = Encrypt.encrypt(newData.psw)
      this.$http.post('/system/user', newData).then(({ data }) => {
        if (data.code === '200') {
          // 新增成功，关闭弹框,重置部分校验所需参数，刷新列表
          this.cancelEdit('formEdit')
          this.$message.success('新增成功')
          this.getTableData()
        } else {
          this.cipherValid = false
          this.cpdValid = false
          this.$message.error(data.msg)
        }
      })
    },
    // 获取公钥私钥
    confirmSubmit (data) {
      // this.addSysUser(formData)
      // this.uuid = this.get_uuid()
      // this.getServePublic(this.uuid, data)
      let obj = {}
      obj.user = {}
      obj.roleIds = data.roleIds
      obj.user.password = data.psw
      obj.user.account = data.account
      obj.user.usname = data.usname
      this.$http.post('/rdbms/user', obj).then(({ data }) => {
        if (data.code === '200') {
          // 新增成功，关闭弹框,重置部分校验所需参数，刷新列表
          this.cancelEdit('formEdit')
          this.$message.success('新增成功')
          this.getTableData()
        } else {
          this.cipherValid = false
          this.cpdValid = false
          this.$message.error(data.msg)
        }
      })
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
          this.addSysUser(formData)
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    get_uuid: function () {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0
        var v = c == 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      })
    },
    getDepartmentList () {
      // 列表初始化
      let that = this
      this.$http.post('/system/department/list', {}).then(function ({ data }) {
        that.departmentList = data.data
      })
    },
    // 获取角色列表
    getRoleList () {
      this.$http.post('/rdbms/role/list', {})
        .then(({ data }) => {
          this.roleList = data.data
        })
    },
    // 启用用户账户
    handleEnable (index, row) {
      this.$confirm('确定对该用户启用？', '消息', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.$http.put('/system/user/enable/' + row.usid).then(({ data }) => {
          if (data.code === '200') {
            this.getTableData()
            this.$message.success('启用成功')
          } else {
            this.$message.error(data.msg)
          }
        })
      })
    },
    // 禁用用户账户
    handleDisable (index, row) {
      this.$confirm('确定对该用户禁用？', '消息', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.$http.put('/system/user/disable/' + row.id).then(({ data }) => {
          if (data.code === '200') {
            this.getTableData()
            this.$message.success('禁用成功')
          } else {
            this.$message.error(data.msg)
          }
        })
      })
    },
    // 获取用户详细信息
    getUserInfor (id) {
      this.$http.get('/system/user/' + id).then(({ data }) => {
        if (data.code === '200') {
          this.$set(
            this.formEdit,
            'roleIds',
            data.data.roles.map(item => item.id)
          )
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 每页显示数目
    handleSizeChange (val) {
      this.page.size = val
      this.getTableData()
    },
    // 当前页
    handleCurrentChange (val) {
      this.page.current = val
      this.getTableData()
    },
    // 新增用户
    addUser () {
      this.tenantName = this.$store.state.tenantName
      this.getRoleList()
      this.userInfor = '新增用户'
      this.formEditDisabled = false
      this.dialogType = 'add'
      this.editFormVisible = true
      this.formEdit = {
        loginName: '',
        psw: '',
        cpd: '',
        usname: '',
        roleIds: []
      }
      this.$nextTick(() => {
        this.$refs.formEdit.clearValidate()
      })
    },
    //  监听分组变化
    // departmentChange (val) {
    //   this.formEdit.roleIds = ''
    //   this.$nextTick(() => {
    //     this.$refs.formEdit.clearValidate()
    //   })
    //   this.getRoleList(val)
    // },
    // 查看用户
    handleSee (index, row) {
      this.dialogType = 'see'
      this.userInfor = '查看用户'
      this.editFormVisible = true
      this.formEditDisabled = true
      this.formEdit = this.$clone(row)
      this.formEdit.loginName = this.formEdit.account.split('-')[1]
      this.tenantName = this.formEdit.account.split('-')[0]
      this.formEdit.roleIds = this.formEdit.roleList.map(item => {
        return item.id
      })
      this.$nextTick(() => {
        this.getRoleList()
        this.$refs.formEdit.clearValidate()
      })
      // this.getRoleList(this.formEdit.departmentId)
      // this.getUserInfor(row.id)
    },
    // 编辑用户
    handleEdit (index, row) {
      this.dialogType = 'edit'
      this.userInfor = '编辑用户'
      this.editFormVisible = true
      this.formEditDisabled = false
      this.formEdit = this.$clone(row)
      this.formEdit.loginName = this.formEdit.account.split('-')[1]
      this.tenantName = this.formEdit.account.split('-')[0]
      this.formEdit.roleIds = this.formEdit.roleList.map(item => {
        return item.id
      })
      this.$nextTick(() => {
        this.getRoleList()
        this.$refs.formEdit.clearValidate()
      })
      // this.getRoleList(this.formEdit.departmentId)
      // this.getUserInfor(row.id)
    },
    // 删除用户
    handleDelete (index, row) {
      this.$confirm('确定删除该用户？', '消息', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        let arr = [row.usid];
        this.$http({method:"delete",url:'/rdbms/user',data: arr}).then(({ data }) => {
          if (data.code === '200') {
            let totalPage = Math.ceil(
              (Number(this.tableData.total) - 1) / this.page.size
            )
            let currentPage = this.page.current > totalPage ? totalPage : this.page.current
            this.page.current = currentPage < 1 ? 1 : currentPage
            this.getTableData()
            this.$message.success('删除成功')
          } else {
            this.$message.error(data.msg)
          }
        })
      })
    },
    // 重置密码
    handleResetCipher (index, row) {
      this.$confirm('确定重置该用户密码？', '消息', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.$http.post('/rdbms/user/resetCipher/', [row.usid]).then(({ data }) => {
            if (data.code === '200') {
              this.getTableData()
              this.$message.success('重置成功')
            } else {
              this.$message.error(data.msg)
            }
          })
      })
    },
    // 确认提交
    submitForm (formName) {
      let that = this
      if (this.dialogType === 'add') {
        // 判断新增
        this.cipherValid = true
        this.cpdValid = true
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.dialogType === 'add') {
            this.formEdit.account =this.tenantName + '-' + this.formEdit.loginName
            this.confirmSubmit(this.formEdit)
          } else if (this.dialogType === 'edit') {
            this.formEdit.loginName =this.tenantName + '-' + this.formEdit.loginName
            this.confirmEidt(this.formEdit)
            this.$refs[formName].clearValidate()
          }
        } else {
          return false
        }
      })
    },
    // 取消确认
    cancelEdit (formName) {
      this.editFormVisible = false
      this.cipherValid = false
      this.cpdValid = false
      this.$refs[formName].clearValidate()
    },

    // 编辑用户方法
    confirmEidt (data) {
      data.roles = data.roleIds.map(item => {
        return {
          id: item
        }
      })
      let ids = data.roleIds
      delete data.roleIds
      this.$http.put('/rdbms/user', data).then(({ data }) => {
        if (data.code === '200') {
          // 新增成功，关闭弹框,重置部分校验所需参数，刷新列表
          this.cancelEdit('formEdit')
          this.$message.success('编辑成功')
          this.getTableData()
        } else {
          this.$message.error(data.msg)
        }
        data.roleIds = ids
        this.formEdit.loginName = this.formEdit.loginName.replace(this.$store.state.tenantName, '')
      })
    }
  }
}
</script>
<style lang="less">
.loginName .el-input:first-child {
  input {
    padding: 0 !important;
  }
}
</style>
<style lang="less" scoped>
.flexBlock {
  display: flex;
  flex-grow: 1;
  overflow: hidden;
}
.content {
  width: 100%;
  padding: 10px;
  border-radius:4px;
  height: calc(100vh - 80px);
  overflow: auto;
  background-color: #fff;
  margin: 0 10px 10px 10px;
}
/deep/.el-select .el-tag{
  max-width: 100%;
  height: auto;
}
/deep/.el-select .el-tag .el-select__tags-text{
  white-space: pre-wrap;
}
.content .el-table {
  margin-top: 10px;
}

.formSearch .el-input {
  width: 200px;
  margin-right: 5px;
}
.formEdit .el-input {
  width: 200px;
  margin-right: 5px;
}
.formEdit .el-select {
  width: 200px;
}
.formSearch .el-select {
  width: 200px;
  margin-right: 5px;
}
.dialog-footer {
  text-align: center;
}
// 分页样式
.content .sysPage {
  margin-top: 8px;
}
.loginName .el-input:first-child {
  width: 60px;
  input {
    padding: 0 !important;
  }
}
.loginName .loginNameInput {
  width: 135px;
}
</style>
