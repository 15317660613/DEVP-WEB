
<template>
  <div class="flexBlock">
  <div class="content">
    <div style="float: left;font-size: 14px;color: #303133;padding-top: 7px;font-weight: bolder">组织机构管理</div>
    <el-form
      class="formSearch"
      :model="formSearchModel"
      label-width="80px"
      style="text-align: right"
    >
      <el-input
        v-model="formSearchModel.name"
        type="name"
        maxlength="200"
        size="small"
        placeholder="机构名称"
      />
      <el-button
        type="primary"
        size="small"
        @click="search"
      >
        搜索
      </el-button>
      <el-button  size="small" @click="add">
        新增
      </el-button>
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
        label="机构名称"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column
        label="上级机构"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ scope.row.pname }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="220"
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
          label="机构名称"
          prop="name"
        >
          <el-input

            v-model="formEdit.name"
            :title="formEdit.name"
            autocomplete="off"
            maxlength="200"
          />
        </el-form-item>
        <el-form-item
          ref="superior"
          label="上级机构"
          prop="pid"
        >
          <SelectTree
            v-show="dialogType!== 'edit'"
            ref="selectTree"
            :props="props"
            :options="optionData"
            :value="formEdit.pid"
            :clearable="isClearable"
            :accordion="isAccordion"
            @getValue="getValue($event)"
          />
          <el-input
            v-show="dialogType== 'edit'"
            v-model="formEdit.pname"

            :disabled="true"
            :title="formEdit.pname"
            autocomplete="off"
            maxlength="200"
          />
        </el-form-item>
      </el-form>

      <div
        v-if="dialogType!== 'see'"
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editFormVisible = false">
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
// 引入树形下拉框
import SelectTree from '@/components/common/selectTree.vue'

export default {
  name: 'OrganizationAdmin',
  components: { SelectTree },
  data () {
    return {
      formSearchModel: {
        tenantName: ''
      },
      formSearch: {
        tenantName: ''
      },
      dialogTitle: '编辑组织机构信息', // 弹框的标题
      dialogType: 'add',
      addItem: true,
      formEditDisabled: true,
      querys: null, // 用来判断是否进行条件搜索
      isClearable: true, // 可清空（可选）
      isAccordion: true, // 可收起（可选）
      props: {
        // 配置项（必选）
        value: 'id',
        label: 'name',
        children: 'children'
        // disabled:true
      },
      list: [],
      page: {
        current: 1,
        size: 20
      }, // 当前页
      formEdit: {
        name: '',
        pid: '' // 初始ID（可选）
      },
      editFormVisible: false, // 编辑弹出框隐藏
      scopeId: '0', // 用来
      tableData: [],
      rules: {
        // 校验规则
        name: [
          { required: true, message: '请输入机构名称', trigger: 'blur' },
          {
            max: 200,
            message: '最多输入200个字符',
            trigger: 'blur'
          },
          { validator: this.$specialCharValid, trigger: 'blur' }
        ],
        pid: [{ required: true, message: '请选择上级机构', trigger: 'change' }]
      }
    }
  },
  computed: {
    /* 转树形数据 */
    optionData () {
      // 对源数据深度克隆
      let cloneData = JSON.parse(JSON.stringify(this.list))
      // 循环所有项，并添加children属性
      let data = cloneData.filter(father => {
        // 返回每一项的子级数组
        let branchArr = cloneData.filter(child => father.id == child.pid)
        // 给父级添加一个children属性，并赋值
        branchArr.length > 0 ? (father.children = branchArr) : ''
        // 返回第一层
        return father.pid == -1
      })
      return data
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
    // 新增组织机构信息
    add () {
      this.editFormVisible = true
      this.formEditDisabled = false
      this.formEdit = {
        name: '',
        pid: '' // 初始ID（可选）
      }
      this.$nextTick(() => {
        this.$refs.formEdit.clearValidate()
      })
      this.dialogType = 'add'
      this.dialogTitle = '新增组织机构信息'
    },
    getTableData () {
      // 列表加载
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
      this.$http
        .post('/system/department-page/page', params)
        .then(({ data }) => {
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
    // 取消确认
    cancelEdit (formName) {
      this.editFormVisible = false
      this.$refs[formName].clearValidate()
    },
    // 新增阻止架构管理
    confirmSubmit (data) {
      this.$http.post('/system/department', data).then(({ data }) => {
        if (data.code === '200') {
          // 新增成功，关闭弹框,重置部分校验所需参数，刷新列表
          this.editFormVisible = false
          this.cancelEdit('formEdit')
          this.$message.success('新增成功')
          this.getTableData()
          this.getDepartmentList()
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    confirmEidt (data) {
      this.$http.put('/system/department', data).then(({ data }) => {
        if (data.code === '200') {
          // 新增成功，关闭弹框,重置部分校验所需参数，刷新列表
          this.editFormVisible = false
          this.cancelEdit('formEdit')
          this.$message.success('编辑成功')
          this.getTableData()
          this.getDepartmentList()
        } else {
          this.$message.error(data.msg)
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
    handleEdit (index, row) {
      this.editFormVisible = true
      this.formEditDisabled = false
      this.dialogType = 'edit'
      this.dialogTitle = '编辑组织机构信息'
      this.formEdit = this.$clone(row)
      this.$nextTick(() => {
        this.$refs.formEdit.clearValidate()
      })
    },
    // 查看用户
    handleSee (index, row) {
      this.dialogType = 'see'
      this.dialogTitle = '查看组织机构信息'
      this.editFormVisible = true
      this.formEditDisabled = true
      this.formEdit = this.$clone(row)
      this.$nextTick(() => {
        this.$refs.formEdit.clearValidate()
      })
    },
    // 删除机构
    handleDelete (index, row) {
      this.$confirm('确定删除该机构？', '消息', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.$http.delete('/system/department/' + row.id).then(({ data }) => {
          if (data.code === '200') {
            let totalPage = Math.ceil(
              (Number(this.tableData.total) - 1) / this.page.size
            )
            let currentPage =
              this.page.current > totalPage ? totalPage : this.page.current
            this.page.current = currentPage < 1 ? 1 : currentPage
            this.getTableData()
            this.getDepartmentList()
            this.$message.success('删除成功')
          } else {
            this.$message.error(data.msg)
          }
        })
      })
    },
    // 取值
    getValue (value) {
      this.formEdit.pid = value
    },
    // 获取上级机构
    getDepartmentList () {
      this.$http.post('/system/department-page/list', {}).then(({ data }) => {
        this.list = data.data
      })
    }
  }
}
</script>
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
</style>
