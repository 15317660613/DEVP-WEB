
<template>
  <div class="content">
    <el-form class="formSearch" :model="formSearch" label-width="80px">
      <el-input v-model="formSearch.simCode" maxlength="200" type="simCode" placeholder="SIM卡号 "></el-input>
      <el-button type="primary" @click="search">搜索</el-button>
      <el-button @click="add">新增</el-button>
      <el-button @click="reset">重置</el-button>
      <el-button @click="importTable">导入</el-button>
      <el-button @click="exportTable">导出</el-button>
    </el-form>
    <el-table
      :data="tableData.records"
      ref="elTable"
      style="width: 100%"
      height="444"
      size="mini"
      :cell-style="{height:'35px',padding:'5px 0px'}"
      border
      :header-cell-style="{background:'#f8f8f9'}"
    >
      <el-table-column align="center" label="序号" width="60">
        <template slot-scope="scope">
          <span>{{scope.$index+(page.current - 1) * page.size + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="SIM卡号" align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.simCode }}</template>
      </el-table-column>
      <el-table-column label="所属主机厂家" align="center" width="120" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.business }}</template>
      </el-table-column>
      <el-table-column label="卡类型" align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.type }}</template>
      </el-table-column>
      <el-table-column label="余额" align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.balance }}</template>
      </el-table-column>
      <el-table-column label="余额有效期(天数)" width="120" align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.balanceDay }}</template>
      </el-table-column>
      <el-table-column label="开通日期" align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.openDate }}</template>
      </el-table-column>
      <el-table-column label="卡有效期(天数)" width="120" align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.cardDay }}</template>
      </el-table-column>
      <el-table-column label="保号到期时间" width="120" align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.numEndDate }}</template>
      </el-table-column>
      <el-table-column label="终端类型(国标/企标)" width="180" align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.terminalType }}</template>
      </el-table-column>
      <el-table-column label="状态(正常/欠费)" width="120" align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.state }}</template>
      </el-table-column>
      <el-table-column label="操作" width="220" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleSee(scope.$index, scope.row)">查看</el-button>
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>

          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.current"
        :page-sizes="[10, 20, 30, 40,50]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="Number(tableData.total)"
      ></el-pagination>
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
        :model="formEdit"
        class="formEdit"
        ref="formEdit"
        :disabled="formEditDisabled"
        :rules="rules"
        label-width="150px"
      >
        <el-col :span="12">
          <el-form-item label="SIM卡号" prop="simCode">
            <el-input
              :disabled="dialogType!=='add'"
              v-model="formEdit.simCode"
              :title="formEdit.simCode"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属主机厂家" prop="business">
            <el-input
              v-model="formEdit.business"
              :title="formEdit.business"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="卡类型" prop="type">
            <el-input
              v-model="formEdit.type"
              :title="formEdit.type"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="余额" prop="balance">
            <el-input
              v-model="formEdit.balance"
              :title="formEdit.balance"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="余额有效期(天数)" prop="balanceDay">
            <el-input
              v-model="formEdit.balanceDay"
              :title="formEdit.balanceDay"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开通日期" prop="openDate">
            <el-date-picker
              v-model="formEdit.openDate"
              :title="formEdit.openDate"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              @change="datePickerChange($event,'openDate')"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="卡有效期(天数)" prop="cardDay">
            <el-input
              v-model="formEdit.cardDay"
              :title="formEdit.cardDay"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="保号到期时间" prop="numEndDate">
            <el-date-picker
              v-model="formEdit.numEndDate"
              :title="formEdit.numEndDate"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              @change="datePickerChange($event,'numEndDate')"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="终端类型(国标/企标)" prop="terminalType">
            <el-input
              v-model="formEdit.terminalType"
              :title="formEdit.terminalType"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="state">
            <el-select v-model="formEdit.state" :title="formEdit.state" placeholder="请选择">
              <el-option label="欠费" value="欠费"></el-option>
              <el-option label="正常" value="正常"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="dialogType!== 'see'">
        <el-button @click="cancelEdit">取 消</el-button>
        <el-button type="primary" @click="editFormConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "SIMCardAdmin",
  data() {
    return {
      formSearch: {
        tenantName: ""
      },
      formEditDisabled: false, //是否禁用from表单中组件功能
      dialogTitle: "编辑SIM卡信息", //弹框的标题
      dialogType: "see", //弹框类型
      querys: null, //用来判断是否进行条件搜索
      page: {
        current: 1,
        size: 10
      }, //当前页
      formEdit: {},
      editFormVisible: false, //编辑弹出框隐藏
      scopeId: "0", //用来
      tableData: [],
      rules: {
        //校验规则
        simCode: [
          { required: true, message: "请输入SIM卡号", trigger: "blur" },
          {
            max: 200,
            message: "最多输入200个字符",
            trigger: "blur"
          },
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        business: [
          { required: true, message: "请输入所属主机厂家", trigger: "blur" },
          {
            max: 200,
            message: "最多输入200个字符",
            trigger: "blur"
          },
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        type: [
          { required: true, message: "请输入卡类型", trigger: "blur" },
          {
            max: 200,
            message: "最多输入200个字符",
            trigger: "blur"
          },
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        cardDay:[
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        balance: [{ validator: this.$specialCharValid, trigger: "blur" }],
        balanceDay: [{ validator: this.$specialCharValid, trigger: "blur" }],
        terminalType: [{ validator: this.$specialCharValid, trigger: "blur" }]
      }
    };
  },
  methods: {
    reset() {
      this.formSearch = {};
    },
    closeDialog(done) {
      this.$refs.formEdit.clearValidate();
      done();
    },
    importTable() {
      this.$message.warning("导入功能开发中...");
    },
    exportTable() {
      this.$message.warning("导出功能开发中...");
    },
    search() {
      this.page.current = 1;
      //条件搜搜
      this.querys = [
        {
          like: this.formSearch
        }
      ];
      this.getTableData();
    },
    //日期改变，特别是点击清理按钮的处理
    datePickerChange(option, key) {
      if (option == null) {
        this.formEdit[key] = "";
      }
    },
    //新增SIM卡信息
    add() {
      this.formEdit = {};
      this.formEditDisabled = false;
      this.dialogType = "add";
      this.dialogTitle = "新增SIM卡信息";
      this.editFormVisible = true;
      this.$nextTick(() => {
        this.$refs.formEdit.clearValidate();
      });
    },
    getTableData() {
      //列表加载
      let params = {
        page: {
          current: this.page.current,
          size: this.page.size,
          orders: [
            {
              asc: false,
              column: "ID"
            }
          ]
        }
      };
      if (this.querys) {
        params.querys = this.querys;
      }
      this.$http.post("/baseinfo/sim/page", params).then(({ data }) => {
        if (data.code === "200") {
          this.tableData = data.data;
          this.$nextTick(() => {
            this.$refs.elTable.doLayout();
          });
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    //提交新增或编辑
    editFormConfirm() {
      // this.editFormVisible = false;
      this.$refs.formEdit.validate(valid => {
        if (valid) {
          if (this.dialogType === "add") {
            this.confirmSubmit(this.formEdit);
          } else if (this.dialogType === "edit") {
            this.confirmEidt(this.formEdit);
            this.$refs.formEdit.clearValidate();
          }
        } else {
          return false;
        }
      });
    },
    handleSizeChange(val) {
      this.page.size = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      //当前页
      this.page.current = val;
      this.getTableData();
    },
    //取消确认
    cancelEdit() {
      this.editFormVisible = false;
      this.$refs.formEdit.clearValidate();
    },

    //新增SIM卡方法
    confirmSubmit(data) {
      this.$http.post("/baseinfo/sim", data).then(({ data }) => {
        if (data.code === "200") {
          //新增成功，关闭弹框,重置部分校验所需参数，刷新列表
          this.cancelEdit();
          this.$message.success("新增成功");
          this.getTableData();
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    //查看SIM卡
    handleSee(index, row) {
      this.formEditDisabled = true;
      this.dialogType = "see";
      this.dialogTitle = "查看SIM卡信息";
      this.formEdit = row;
      this.editFormVisible = true;
    },
    //编辑SIM卡信息
    handleEdit(index, row) {
      this.formEditDisabled = false;
      this.editFormVisible = true;
      this.dialogType = "edit";
      this.dialogTitle = "编辑SIM卡信息";
      this.formEdit = JSON.parse(JSON.stringify(row));
    },

    //编辑SIM卡方法
    confirmEidt(data) {
      this.$http.put("/baseinfo/sim", data).then(({ data }) => {
        if (data.code === "200") {
          //新增成功，关闭弹框,重置部分校验所需参数，刷新列表
          this.cancelEdit("formEdit");
          this.$message.success("编辑成功");
          this.getTableData();
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    //删除SIM卡账户
    handleDelete(index, row) {
      this.$confirm("确定删除该SIM卡信息？", "消息", {
        type: "warning",
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        this.$http.delete("/baseinfo/sim/" + row.id).then(({ data }) => {
          if (data.code === "200") {
            this.$message.success("删除成功");
            let totalPage = Math.ceil(
              (Number(this.tableData.total) - 1) / this.page.size
            );
            let currentPage =
              this.page.current > totalPage ? totalPage : this.page.current;
            this.page.current = currentPage < 1 ? 1 : currentPage;
            this.getTableData();
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    }
  },

  created() {
    this.getTableData();
  }
};
</script>
<style lang="less" scoped>
/deep/ .el-table__fixed-right {
  height: 100% !important;
}
.content {
  padding: 10px;
  background: #fff;
  width: 100%;
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
.content .block {
  margin-top: 8px;
}
.formEdit {
  height: 300px;
}
</style>
