
<template>
  <div class="flexBlock">
  <div class="content">
    <div style="float: left;font-size: 14px;color: #303133;padding-top: 7px;font-weight: bolder">公司管理</div>
    <el-form
      class="formSearch"
      :model="modelSearch"
      label-width="80px"
      style="text-align: right"
    >
      <el-input
        v-model="modelSearch.tenantName"
        type="tenantName"
        maxlength="200"
        size="small"
        placeholder="公司全称"
      />
      <el-button
        type="primary"
        @click="search"
        size="small"
      >
        搜索
      </el-button>
<!--      <el-button @click="add">-->
<!--        新增-->
<!--      </el-button>-->
      <el-button  size="small" @click="reset">
        重置
      </el-button>
    </el-form>
    <el-table
      ref="elTable"
      :data="tableData.records"
      style="width: 100%"
      border
      height="calc(100vh - 195px)"
      size="mini"
      header-row-class-name="tableHeaderStyle"
      :cell-style="{height:'35px',padding:'5px 0px'}"
      :header-cell-style="{background:'#f8f8f9'}"
    >
      <el-table-column
        align="center"
        label="序号"
        width="60"
      >
        <template slot-scope="scope">
          <span>{{ scope.$index+(page.current - 1) * page.size + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="公司全称"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ scope.row.tenantName }}
        </template>
      </el-table-column>
<!--      <el-table-column-->
<!--        label="公司简称"-->
<!--        align="center"-->
<!--        show-overflow-tooltip-->
<!--      >-->
<!--        <template slot-scope="scope">-->
<!--          {{ scope.row.tenantShort }}-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        label="公司代码"-->
<!--        align="center"-->
<!--        show-overflow-tooltip-->
<!--      >-->
<!--        <template slot-scope="scope">-->
<!--          {{ scope.row.tenantCode }}-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column
        label="电话号码"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ scope.row.tel }}
        </template>
      </el-table-column>
      <el-table-column
        label="公司邮箱"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
      <el-table-column
        label="公司地址"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ scope.row.address }}
        </template>
      </el-table-column>
<!--      <el-table-column-->
<!--        label="网站链接"-->
<!--        align="center"-->
<!--        show-overflow-tooltip-->
<!--      >-->
<!--        <template slot-scope="scope">-->
<!--          {{ scope.row.web }}-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        label="注册时间"-->
<!--        align="center"-->
<!--        show-overflow-tooltip-->
<!--      >-->
<!--        <template slot-scope="scope">-->
<!--          {{ scope.row.createrTime }}-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column
        label="联系人"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ scope.row.contacts }}
        </template>
      </el-table-column>
      <el-table-column
        label="经营范围"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ scope.row.businessScope }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="220"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleSee(scope.$index, scope.row)"
          >
            查看
          </el-button>
<!--          <el-button-->
<!--            size="mini"-->
<!--            @click="handleEdit(scope.$index, scope.row)"-->
<!--          >-->
<!--            编辑-->
<!--          </el-button>-->
          <el-button
            v-if="scope.row.state == '0'"
            size="mini"
            type="success"
            @click="handleEnable(scope.$index, scope.row)"
          >
            启用
          </el-button>
          <el-button
            v-if="scope.row.state == '1'"
            size="mini"
            type="danger"
            @click="handleDisable(scope.$index, scope.row)"
          >
            禁用
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="sysPage">
      <el-pagination
        :current-page="page.current"
        :page-sizes="[10, 20, 30, 40,50]"
        :page-size="page.size"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="Number(tableData.total)"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 弹出框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="editFormVisible"
      width="800px"
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
        <el-col :span="12">
          <el-form-item
            label="公司全称"
            prop="tenantName"
          >
            <el-input
              v-model="formEdit.tenantName"
              :title="formEdit.tenantName"
              maxlength="200"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
<!--        <el-col :span="12">-->
<!--          <el-form-item-->
<!--            label="公司简称"-->
<!--            prop="tenantShort"-->
<!--          >-->
<!--            <el-input-->
<!--              v-model="formEdit.tenantShort"-->
<!--              :title="formEdit.tenantShort"-->
<!--              maxlength="200"-->
<!--              autocomplete="off"-->
<!--            />-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="12">-->
<!--          <el-form-item-->
<!--            label="公司代码"-->
<!--            prop="tenantCode"-->
<!--          >-->
<!--            <el-input-->
<!--              v-model="formEdit.tenantCode"-->
<!--              :title="formEdit.tenantCode"-->
<!--              maxlength="200"-->
<!--              :disabled="dialogType === 'edit'"-->
<!--              autocomplete="off"-->
<!--            />-->
<!--          </el-form-item>-->
<!--        </el-col>-->
        <el-col :span="12">
          <el-form-item
            label="电话号码"
            prop="tel"
          >
            <el-input
              v-model="formEdit.tel"
              :title="formEdit.tel"
              maxlength="200"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="公司邮箱"
            prop="mail"
          >
            <el-input
              v-model="formEdit.email"
              :title="formEdit.email"
              maxlength="200"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="公司地址"
            prop="address"
          >
            <el-input
              v-model="formEdit.address"
              :title="formEdit.address"
              maxlength="200"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
<!--        <el-col :span="12">-->
<!--          <el-form-item-->
<!--            label="网站链接"-->
<!--            prop="web"-->
<!--          >-->
<!--            <el-input-->
<!--              v-model="formEdit.web"-->
<!--              :title="formEdit.web"-->
<!--              maxlength="200"-->
<!--              autocomplete="off"-->
<!--            />-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="12">-->
<!--          <el-form-item label="注册时间">-->
<!--            <el-date-picker-->
<!--              v-model="formEdit.registerDate"-->
<!--              :title="formEdit.registerDate"-->
<!--              value-format="yyyy-MM-dd"-->
<!--              type="date"-->
<!--              placeholder="选择日期"-->
<!--            />-->
<!--          </el-form-item>-->
<!--        </el-col>-->
        <el-col :span="12">
          <el-form-item
            label="企业省份"
            prop="provinceId"
          >
            <el-select
              v-model="formEdit.provinceId"
              filterable
              placeholder="请选择企业省份"
              @change="provinceChange"
            >
              <el-option
                v-for="item in provinceList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="企业市区"
            prop="cityId"
          >
            <el-select
              v-model="formEdit.cityId"
              filterable
              placeholder="请选择企业市区"
            >
              <el-option
                v-for="item in cityList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-form>
      <div
        v-if="dialogType!== 'see'"
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="cancelEdit">
          取 消
        </el-button>
        <el-button
          type="primary"
          @click="editFormConfirm"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
  </div>
</template>

<script>
export default {
  name: 'Company',
  data () {
    return {
      modelSearch: {
        tenantName: ''
      },
      formSearch: {
        tenantName: ''
      },
      formEditDisabled: false, // 是否禁用from表单中组件功能
      dialogTitle: '编辑公司信息', // 弹框的标题
      dialogType: 'see', // 弹框类型
      querys: null, // 用来判断是否进行条件搜索
      page: {
        current: 1,
        size: 20
      }, // 当前页
      formEdit: {
        provinceId: ''
      },
      provinceList: [], // 省份列表
      cityList: [], // 城市列表
      editFormVisible: false, // 编辑弹出框隐藏
      scopeId: '0', // 用来
      tableData: [],
      rules: {
        // 校验规则
        tenantName: [
          { required: true, message: '请输入公司全称', trigger: 'blur' },
          {
            max: 200,
            message: '最多输入200个字符',
            trigger: 'blur'
          },
          { validator: this.$specialCharValid, trigger: 'blur' }
        ],
        tenantShort: [
          { required: true, message: '请输入公司简称', trigger: 'blur' },
          {
            max: 200,
            message: '最多输入200个字符',
            trigger: 'blur'
          },
          { validator: this.$specialCharValid, trigger: 'blur' }
        ],
        tenantCode: [
          { required: true, message: '请输入公司代码', trigger: 'blur' },
          {
            pattern: /^[A-Za-z0-9]{3,10}$/,
            message: '允许输入3-10位英文与数字'
          },
          { validator: this.$specialCharValid, trigger: 'blur' }
        ],
        tel: [
          {
            max: 200,
            message: '最多输入200个字符',
            trigger: 'blur'
          },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: '请输入正确电话号',
            trigger: 'blur'
          }
        ],
        address: [
          {
            max: 200,
            message: '最多输入200个字符',
            trigger: 'blur'
          },
          { validator: this.$specialCharValid, trigger: 'blur' }
        ],
        web: [
          {
            max: 200,
            message: '最多输入200个字符',
            trigger: 'blur'
          },
          { validator: this.$specialCharValid, trigger: 'blur' }
        ],
        mail: [
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          },
          {
            max: 200,
            message: '最多输入200个字符',
            trigger: 'blur'
          },
          { validator: this.$specialCharValid, trigger: 'blur' }
        ],
        provinceId: [
          { required: true, message: '请选择企业省份', trigger: 'change' }
        ],
        cityId: [
          { required: true, message: '请选择企业市区', trigger: 'change' }
        ]
      }
    }
  },

  created () {
    this.getTableData()
    this.getProvinceList()
  },
  methods: {
    reset () {
      this.modelSearch = {}
      this.formSearch = {}
    },
    // 关闭前回调
    closeDialog (done) {
      this.$refs.formEdit.clearValidate()
      done()
    },
    search () {
      // 条件搜搜
      this.formSearch = this.$clone(this.modelSearch)
      this.page.current = 1
      this.querys = [
        {
          like: this.formSearch
        }
      ]
      this.getTableData()
    },

    // 新增公司信息
    add () {
      this.formEdit = {}
      this.formEditDisabled = false
      this.dialogType = 'add'
      this.dialogTitle = '新增公司信息'
      this.cityList = []
      this.editFormVisible = true
      this.$nextTick(() => {
        this.$refs.formEdit.clearValidate()
      })
    },

    getTableData () {
      // 列表加载
      let that = this
      let params = {
        page: {
        current: this.page.current,
        size: this.page.size,
        orders: [
          {
            asc: false,
            column: 'ID'
          }
        ]
        }
      }
      if (this.querys) {
        params.querys = this.querys
      }
      // this.$http.post("/system/tenant-page/page", params).then(({ data }) => {
      this.$http.post('/system/tenant/page', params).then(({ data }) => {
        if (data.code === '200') {
          this.tableData = data.data
          this.tableData.orders = [{ asc: false, column: 'ID' }]
          this.$nextTick(() => {
            this.$refs.elTable.doLayout()
          })
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 提交新增或编辑
    editFormConfirm () {
      this.$refs.formEdit.validate(valid => {
        if (valid) {
          if (this.dialogType === 'add') {
            this.confirmSubmit(this.formEdit)
          } else if (this.dialogType === 'edit') {
            this.confirmEidt(this.formEdit)
            this.$refs.formEdit.clearValidate()
          }
        } else {
          return false
        }
      })
    },
    handleSizeChange (val) {
      this.page.size = val
      this.getTableData()
    },
    handleCurrentChange (val) {
      // 当前页
      this.page.current = val
      this.getTableData()
    },
    // 取消确认
    cancelEdit () {
      this.editFormVisible = false
      this.$refs.formEdit.clearValidate()
    },

    // 新增公司方法
    confirmSubmit (data) {
      this.$http.post('/system/tenant', data).then(({ data }) => {
        if (data.code === '200') {
          // 新增成功，关闭弹框,重置部分校验所需参数，刷新列表
          this.cancelEdit()
          this.$message.success('新增成功')
          this.getTableData()
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 查看公司
    handleSee (index, row) {
      this.formEditDisabled = true
      this.dialogType = 'see'
      this.dialogTitle = '查看公司信息'
      this.formEdit = row
      this.getCityList()
      this.editFormVisible = true
    },
    // 编辑公司信息
    handleEdit (index, row) {
      this.formEditDisabled = false
      this.editFormVisible = true
      this.dialogType = 'edit'
      this.dialogTitle = '编辑公司信息'
      this.formEdit = this.$clone(row)
      this.getCityList()
    },

    // 编辑公司方法
    confirmEidt (data) {
      this.$http.put('/system/tenant', data).then(({ data }) => {
        if (data.code === '200') {
          // 新增成功，关闭弹框,重置部分校验所需参数，刷新列表
          this.cancelEdit('formEdit')
          this.$message.success('编辑成功')
          this.getTableData()
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 启用公司账户
    handleEnable (index, row) {
      this.$confirm('确定对该公司启用？', '消息', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.$http.put('/system/tenant/state/enable/' + row.id).then(({ data }) => {
          if (data.code === '200') {
            this.getTableData()
            this.$message.success('启用成功')
          } else {
            this.$message.error(data.msg)
          }
        })
      })
    },
    // 禁用公司账户
    handleDisable (index, row) {
      this.$confirm('确定对该公司禁用？', '消息', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.$http.put('/system/tenant/state/disable/' + row.id).then(({ data }) => {
          if (data.code === '200') {
            this.getTableData()
            this.$message.success('禁用成功')
          } else {
            this.$message.error(data.msg)
          }
        })
      })
    },
    // 获取省份列表
    getProvinceList () {
      this.$http
        .post('/rdbms/area/list', {
          querys: [
            {
              eq: {
                areaLevel: 'A'
              }
            }
          ]
        })
        .then(({ data }) => {
          if (data.code === '200') {
            this.provinceList = data.data
          } else if (data.code == '401') {
          } else {
            this.$message.error(data.msg)
          }
        })
    },
    // 改变省份列表，
    provinceChange () {
      this.$set(this.formEdit, 'cityId', '')
      this.$nextTick(() => {
        this.$refs.formEdit.clearValidate('cityId')
      })
      this.getCityList()
    },
    // 获取城市列表
    getCityList () {
      let parentId = this.formEdit.provinceId
      this.$http
        .post('/rdbms/area/list', {
          querys: [
            {
              eq: {
                parentId: parentId
              }
            }
          ]
        })
        .then(({ data }) => {
          if (data.code === '200') {
            this.cityList = data.data
          } else {
            this.$message.error(data.message)
          }
        })
    }
  }
}
</script>
<style>
.el-table__fixed-right {
  height: 100% !important;
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
.formEdit {
  height: 300px;
}
</style>
