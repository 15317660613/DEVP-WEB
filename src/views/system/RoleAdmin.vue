<template>
  <div class="flexBlock">
  <div class="content">
    <div style="float: left;font-size: 14px;color: #303133;padding-top: 7px;font-weight: bolder">角色管理</div>
    <el-form
      :inline="true"
      label-width="80px"
      @submit.native.prevent
      style="text-align: right"
    >
      <el-input
        v-model="roleNameSearchModel"
        placeholder="角色名称"
        maxlength="200"
        size="small"
        style="width: 200px;margin-right: 10px"
      />
      <el-button
        size="small"
        type="primary"
        @click="searchRoleList"
      >
        搜索
      </el-button>
      <el-button  size="small" @click="addRole">
        新增
      </el-button>
      <el-button  size="small" @click="reset">
        重置
      </el-button>
    </el-form>
    <el-table
      ref="elTable"
      border
      :data="tableData"
      tooltip-effect="dark"
      height="calc(100vh - 195px)"
      size="mini"
      header-row-class-name="tableHeaderStyle"
      :cell-style="{height:'35px',padding:'5px 0px'}"
      style="width: 100%; margin-top: 10px;"
      :header-cell-style="{background:'#f8f8f9'}"
    >
      <el-table-column
        align="center"
        label="序号"
        width="60"
      >
        <template slot-scope="scope">
          <span>{{ scope.$index+(currentPage - 1) * pagesize + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        align="center"
        label="角色名称"
        show-overflow-tooltip
      />
<!--      <el-table-column-->
<!--        prop="departmentName"-->
<!--        align="center"-->
<!--        label="所属分组"-->
<!--        show-overflow-tooltip-->
<!--      />-->
      <el-table-column
        label="操作"
        align="center"
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
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 8px;">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next,jumper"
        :total="total"
        :current-page="currentPage"
        :page-size="pagesize"
        @current-change="current_change"
        @size-change="size_change"
      />
    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="800px"
      :modal-append-to-body="false"
      class="addDialog abow_dialog"
      :before-close="closeDialog"
      center
    >
      <el-form
        ref="roleForm"
        :model="roleObj"
        :rules="rules"
        :disabled="formEditDisabled"
      >
        <el-form-item
          label="角色名称："
          label-width="120px"
          prop="name"
        >
          <el-input
            v-model="roleObj.name"
            :title="roleObj.name"
            maxlength="200"
          />
        </el-form-item>
<!--        <el-form-item-->
<!--          label="所属分组："-->
<!--          label-width="120px"-->
<!--          prop="valueId"-->
<!--        >-->
<!--          <SelectTree-->
<!--            ref="selectTree"-->
<!--            :props="props"-->
<!--            :options="optionData"-->
<!--            :value="roleObj.valueId"-->
<!--            :clearable="isClearable"-->
<!--            :accordion="isAccordion"-->
<!--            @getValue="getValue($event)"-->
<!--          />-->
<!--        </el-form-item>-->
      </el-form>
      <!--      使用树形穿梭框组件-->
      <tree-transfer
        ref="dialog"
        :title="transferTitle"
        :from_data="fromData"
        :to_data="toData"
        :default-props="{label:'name'}"
        mode="transfer"
        height="250px"
        filter
        open-all
        @addBtn="add"
        @removeBtn="remove"
      />
      <span
        v-if="!formEditDisabled"
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="save"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
  </div>
</template>

<script>
// 引入树形穿梭框
import treeTransfer from 'el-tree-transfer'
// 引入树形下拉框
import SelectTree from '@/components/common/selectTree.vue'

export default {
  name: 'RoleAdmin',
  // 注册组件
  components: { treeTransfer, SelectTree },
  data () {
    return {
      roleId: '',
      roleNameSearchModel: '', // 关键词搜索
      roleNameSearch: '',
      dialogVisible: false,
      dialogTitle: '',
      tableData: [],
      formEditDisabled: false,
      multipleSelection: [],
      total: 0,
      pagesize: 20,
      currentPage: 1,
      roleObj: {
        name: '',
        valueId: 0 // 初始ID（可选）
      },
      fromData: [],
      toData: [],
      // 权限菜单
      menus: [],
      transferTitle: ['未拥有权限', '拥有权限'],
      isClearable: true, // 可清空（可选）
      isAccordion: true, // 可收起（可选）
      props: {
        // 配置项（必选）
        value: 'id',
        label: 'name',
        children: 'children'
        // disabled:true
      },
      // 选项列表（必选）
      list: [],
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            max: 200,
            message: '最多输入200个字符',
            trigger: 'blur'
          },
          { validator: this.$specialCharValid, trigger: 'blur' }
        ],
        valueId: [
          { required: true, message: '请选择所属分组', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    /* 转树形数据 */
    optionData () {
      // 对源数据深度克隆
      let cloneData = JSON.parse(JSON.stringify(this.list))
      // 循环所有项，并添加children属性
      return cloneData.filter(father => {
        // 返回每一项的子级数组
        let branchArr = cloneData.filter(child => father.id == child.pid)
        // 给父级添加一个children属性，并赋值
        branchArr.length > 0 ? (father.children = branchArr) : ''
        // 返回第一层
        return father.pid == -1
      })
    }
  },
  mounted () {
    this.searchRoleList()
    this.$http
      .post('/system/department/list', {})
      .then(resp => {
        this.list = resp.data.data
      })
      .catch(error => {})
  },
  activated () {
    this.$refs.elTable.doLayout()
  },
  methods: {
    reset () {
      this.roleNameSearch = ''
      this.roleNameSearchModel = ''
    },
    closeDialog (done) {
      this.$refs.roleForm.clearValidate()
      done()
    },
    searchRoleList () {
      this.roleNameSearch = this.$clone(this.roleNameSearchModel)
      this.currentPage = 1
      this.getHttp()
    },
    getHttp () {
      this.$http
        .post('/rdbms/role/page', {
          page: {
            current: this.currentPage,
            size: this.pagesize,
            orders: [
              {
                asc: false,
                column: 'ID'
              }
            ]
          },
          querys: [
            {
              like: {
                name: this.roleNameSearch
              }
            }
          ]
        })
        .then(resp => {
          if (resp.data.ok) {
            this.tableData = resp.data.data.records
            this.total = parseInt(resp.data.data.total)
            this.$nextTick(() => {
              this.$refs.elTable.doLayout()
            })
          } else {
            this.$message.error(resp.data.msg)
          }
        })
        .catch(error => {
          this.$message.error('查询失败')
        })
    },
    current_change: function (currentPage) {
      this.currentPage = currentPage
      this.getHttp()
    },
    size_change (size) {
      this.pagesize = size
      this.getHttp()
    },
    addRole () {
      let that = this
      this.dialogTitle = '新建角色'
      this.formEditDisabled = false
      this.dialogVisible = true
      this.roleObj.name = ''
      this.roleObj.valueId = 0
      this.toData = []

      this.getAllMenus().then(resp => {
        this.fromData = this.changeToTree(resp.data.data)
      })
      this.$nextTick(() => {
        this.$refs.roleForm.clearValidate()
      })
    },
    getAllMenus () {
      return this.$http.post('/system/menu/list', {})
    },

    changeToTree (data) {
      let arr = []
      let obj = {}
      if (data.length <= 0) {
        return
      }
      for (let i = 0; i < data.length; i++) {
        if (data[i].pid === '0') {
          arr.push(
            Object.assign({}, data[i], {
              children: []
            })
          )
        } else {
          if (!obj[data[i].pid]) {
            obj[data[i].pid] = []
          }

          obj[data[i].pid].push(
            Object.assign({}, data[i], {
              children: []
            })
          )
        }
      }

      this.callback(arr, obj)

      return arr
    },
    callback (arr, obj) {
      for (let j = 0; j < arr.length; j++) {
        for (let i = 0; i < Object.keys(obj).length; i++) {
          let id = arr[j].id
          if (obj[id]) {
            arr[j].children = [].concat(obj[id])
            delete obj[id]
          } else {
            this.callback(arr[j].children, obj)
          }
        }
      }

      if (Object.keys(obj).length > 0) {
        for (let j = 0; j < arr.length; j++) {
          for (let i = 0; i < Object.keys(obj).length; i++) {
            this.callback(arr[j].children, obj)
          }
        }
      }
    },
    add (fromData, toData, obj) {
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的        {keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      // console.log('fromData:', fromData)
      // console.log('toData:', toData)
      // console.log('obj:', obj)
      this.fromData = fromData
      this.toData = toData
    },
    // 监听穿梭框组件移除
    remove (fromData, toData, obj) {
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      // console.log('fromData:', fromData)
      // console.log('toData:', toData)
      // console.log('obj:', obj)
      this.fromData = fromData
      this.toData = toData
    },
    // 取值
    getValue (value) {
      this.roleObj.valueId = value
      // console.log(this.roleObj.valueId)
    },
    // 保存
    save () {
      let that = this
      this.$refs.roleForm.validate(valid => {
        if (valid) {
          that.menus = []
          that.convertData(this.toData)
          if (that.menus.length < 1) {
            this.$message.warning('拥有权限不能为空')
            return
          }
          if (that.dialogTitle === '新建角色') {
            that.$http
              .post('/rdbms/role', {
                name: that.roleObj.name,
                depId: that.roleObj.valueId,
                menus: that.menus
              })
              .then(resp => {
                if (resp.data.code == '200') {
                  that.$message({
                    message: resp.data.msg,
                    type: 'success'
                  })
                  that.dialogVisible = false
                  that.searchRoleList()
                } else {
                  that.$message.error(resp.data.msg)
                }
              })
              .catch(error => {})
          } else {
            this.$http
              .put('/rdbms/role', {
                id: this.roleId,
                name: this.roleObj.name,
                depId: this.roleObj.valueId,
                menus: this.menus
              })
              .then(resp => {
                if (resp.data.code == '200') {
                  this.$message({
                    message: resp.data.msg,
                    type: 'success'
                  })
                  this.dialogVisible = false
                  this.searchRoleList()
                } else {
                  this.$message.error(resp.data.msg)
                }
              })
              .catch(error => {})
          }
        } else {
          return false
        }
      })
    },
    //    将选中权限菜单数据转化成接口形式
    convertData (data) {
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          let obj = {}
          obj.id = data[i].id
          this.menus.push(obj)
          if (data[i].children.length > 0) {
            this.convertData(data[i].children)
          }
        }
      }
    },
    handleSee (index, row) {
      this.formEditDisabled = true
      let that = this
      that.roleId = row.id
      this.$http.get('/rdbms/role/' + row.id, {}).then(resp => {
        if (resp.data.ok) {
          that.dialogTitle = '查看角色'
          that.dialogVisible = true
          that.roleObj.name = resp.data.data.name ? resp.data.data.name : ''
          that.roleObj.valueId = resp.data.data.depId
            ? resp.data.data.depId
            : ''
          that.toData = that.changeToTree(
            resp.data.data.menus ? resp.data.data.menus : []
          )
          that.fromData = that.changeToTree(
            resp.data.data.withoutMenus ? resp.data.data.withoutMenus : []
          )
          this.$nextTick(() => {
            Array.prototype.forEach.call(
              this.$refs.dialog.$el.getElementsByClassName('el-checkbox'),
              item => {
                item.style.display = 'none'
              }
            )
          })
        } else {
        }
      })
    },
    handleEdit (index, row) {
      let that = this
      this.formEditDisabled = false
      that.roleId = row.id
      this.$http.get('/rdbms/role/' + row.id, {}).then(resp => {
        if (resp.data.ok) {
          that.dialogTitle = '编辑角色'
          that.dialogVisible = true
          that.roleObj.name = resp.data.data.name ? resp.data.data.name : ''
          that.roleObj.valueId = resp.data.data.depId
            ? resp.data.data.depId
            : ''
          that.toData = that.changeToTree(
            resp.data.data.menus ? resp.data.data.menus : []
          )
          that.fromData = that.changeToTree(
            resp.data.data.withoutMenus ? resp.data.data.withoutMenus : []
          )
        } else {
        }
      })
    },
    handleDelete (index, row) {
      this.$confirm('确定删除该角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('/rdbms/role/' + row.id, {}).then(resp => {
          if (resp.data.code == '200') {
            this.$message.success('删除成功')
            this.searchRoleList()
          } else {
            this.$message.error(resp.data.msg)
          }
        })
      })
    }
  }
}
</script>

<style lang='less' scoped>
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
.addDialog .el-input,
.addDialog .el-select {
  width: 300px;
}

.abow_dialog {
  overflow: hidden;

  .el-dialog {
    margin: 0 auto !important;
    height: 80%;
    overflow: hidden;

    .el-dialog__body {
      position: absolute;
      left: 0;
      top: 54px;
      bottom: 0;
      right: 0;
      padding: 0;
      z-index: 1;
      overflow: hidden;
      overflow-y: auto;
    }
  }
}
/deep/ .el-form-item__content{
   text-align: left;
}
</style>
