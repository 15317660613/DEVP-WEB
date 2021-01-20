
<template>
  <div class="content">
    <el-form class="formSearch" :model="formSearch" label-width="80px">
      <el-input
       
        v-model="formSearch.terminalCode"
        maxlength="200"
        type="terminalCode"
        placeholder="终端编号"
      ></el-input>
      <el-input
       
        v-model="formSearch.model"
        maxlength="200"
        type="terminalCode"
        placeholder="终端型号"
      ></el-input>
      <el-button type="primary" @click="search">搜索</el-button>
      <el-button @click="add">新增</el-button>
      <el-button @click="reset">重置</el-button>
      <el-button @click="importTable">导入</el-button>
      <el-button @click="exportTable">导出</el-button>
    </el-form>
    <el-table
      ref="elTable"
      :data="tableData.records"
      style="width: 100%"
      height="428"
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
      <el-table-column label="终端编号" align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.terminalCode }}</template>
      </el-table-column>
      <el-table-column label="终端型号" align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.model }}</template>
      </el-table-column>
      <el-table-column label="安全芯片型号" align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.safeChipModel }}</template>
      </el-table-column>
      <el-table-column label="企业机构代码" align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.entOrgCode }}</template>
      </el-table-column>
      <el-table-column label="终端资质图片" width="150" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <i
            class="table-btn-icon el-icon-picture"
            @click="terminalQualificationPic(scope.$index, scope.row)"
          ></i>
        </template>
      </el-table-column>
      <el-table-column label="SIM卡号" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <a style="cursor: pointer;color: #66b1ff" @click="goSIMCardAdmin">{{ scope.row.simCode }}</a>
        </template>
      </el-table-column>
      <el-table-column label="芯片号" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <a
            style="cursor: pointer;color: #66b1ff"
            @click="goSecurityChipAdmin"
          >{{ scope.row.chipCode }}</a>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="400" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleSee(scope.$index, scope.row)">查看</el-button>
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            v-if="!scope.row.simCode"
            size="mini"
            type="success"
            @click="handleBindSim(scope.$index, scope.row)"
          >绑定SIM</el-button>
          <el-button
            v-if="scope.row.simCode"
            size="mini"
            type="danger"
            @click="handleUnbindSim(scope.$index, scope.row)"
          >解绑SIM</el-button>
          <el-button
            v-if="!scope.row.chipCode"
            size="mini"
            type="success"
            @click="handleBindChip(scope.$index, scope.row)"
          >绑定芯片</el-button>
          <el-button
            v-if="scope.row.chipCode"
            size="mini"
            type="danger"
            @click="handleUnbindChip(scope.$index, scope.row)"
          >解绑芯片</el-button>
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
        label-width="120px"
      >
        <el-col :span="12">
          <el-form-item label="终端编号" prop="terminalCode">
            <el-input
             
              v-model="formEdit.terminalCode"
              :title="formEdit.terminalCode"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="终端型号" prop="model">
            <el-input
             
              v-model="formEdit.model"
              :title="formEdit.model"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="安全芯片型号" prop="safeChipModel">
            <el-input
             
              v-model="formEdit.safeChipModel"
              :title="formEdit.safeChipModel"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="企业机构代码" prop="entOrgCode">
            <el-input
             
              v-model="formEdit.entOrgCode"
              :title="formEdit.entOrgCode"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="SIM卡号" prop="simId">
            <el-select
              v-model="formEdit.simId"
              :title="formEdit.simCode"
              filterable
              placeholder="请选择SIM卡号"
            >
              <el-option
                :label="item.simCode"
                :value="item.id"
                :key="item.id"
                v-for="item in simList"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="芯片号" prop="chipId">
            <el-select
              v-model="formEdit.chipId"
              :title="formEdit.chipCode"
              filterable
              placeholder="请选择芯片号"
            >
              <el-option
                :label="item.chipCode"
                :value="item.id"
                :key="item.id"
                v-for="item in chipList"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="终端资质图片" class="hover" prop="file">
            <img v-if="imageUrl" :src="imageUrl" class="pic" @load="imageLoaded" />
            <div v-if="imageUrl&&dialogType!=='see'" class="pic_delete">
              <div class="pic_box">
                <span @click="handleRemove">
                  <i class="el-icon-delete"></i>
                </span>
              </div>
            </div>
            <el-upload
              ref="upload"
              class="pic-uploader"
              :action="action"
              :show-file-list="false"
              accept="image/jpg, image/jpeg, image/png"
              :before-upload="onBeforeUpload"
              :on-success="handleSucess"
              :on-error="handleError"
            >
              <i v-if="!imageUrl" class="el-icon-plus pic-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="dialogType!== 'see'">
        <el-button @click="cancelEdit">取 消</el-button>
        <el-button type="primary" @click="editFormConfirm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 弹出框 -->
    <el-dialog
      title="绑定SIM卡"
      :visible.sync="dialogSimVisible"
      width="260px"
      :modal-append-to-body="false"
      :before-close="closeSimDialog"
    >
      <el-form :model="formBindSim" ref="formBindSim" :rules="rules">
        <el-form-item prop="BindSimId">
          <el-select v-model="formBindSim.BindSimId" filterable placeholder="请选择绑定的SIM卡">
            <el-option
              :label="item.simCode"
              :value="item.id"
              :key="item.id"
              v-for="item in simList"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelSimBind">取 消</el-button>
        <el-button type="primary" @click="confirmSimBind">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="绑定芯片"
      :visible.sync="dialogChipVisible"
      width="260px"
      :modal-append-to-body="false"
      :before-close="closeChipDialog"
    >
      <el-form :model="formBindChip" ref="formBindChip" :rules="rules">
        <el-form-item prop="BindChipId">
          <el-select v-model="formBindChip.BindChipId" filterable placeholder="请选择绑定的芯片">
            <el-option
              :label="item.chipCode"
              :value="item.id"
              :key="item.id"
              v-for="item in chipList"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelChipBind">取 消</el-button>
        <el-button type="primary" @click="confirmChipBind">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog @close="clearDialogImageUrl" :visible.sync="dialogVisible" :modal="false">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>

<script>
import apiConfig from "@/assets/js/config";
export default {
  name: "TerminalAdmin",
  data() {
    return {
      formSearch: {
        terminalCode: "",
        model: ""
      },
      bindTerminal: {}, //绑定的终端
      dialogImageUrl: "",
      formBindSim: {
        BindSimId: "" //绑定时，sim卡id
      },
      dialogVisible: false,
      dialogSimVisible: false, //绑定SIM卡弹窗
      formBindChip: {
        BindChipId: "" //绑定时，芯片id
      },
      loadding: null,
      dialogChipVisible: false, //绑定SIM卡弹窗
      formEditDisabled: false, //是否禁用from表单中组件功能
      dialogTitle: "编辑终端信息", //弹框的标题
      dialogType: "see", //弹框类型
      querys: null, //用来判断是否进行条件搜索
      page: {
        current: 1,
        size: 10
      }, //当前页
      formEdit: {},
      chipList: [], //芯片列表
      simList: [], //sim卡列表
      action: apiConfig.API_CONFIG + "/upload?_t=" + new Date().getTime(),
      editFormVisible: false, //编辑弹出框隐藏
      scopeId: "0", //用来
      tableData: {
        total: 0
      },
      rules: {
        //校验规则
        terminalCode: [
          { required: true, message: "请输入终端编号", trigger: "blur" },
          {
            max: 200,
            message: "最多输入200个字符",
            trigger: "blur"
          },
           { validator: this.$specialCharValid, trigger: "blur" }
        ],
        model: [
          { required: true, message: "请输入终端型号", trigger: "blur" },
          {
            max: 200,
            message: "最多输入200个字符",
            trigger: "blur"
          },
           { validator: this.$specialCharValid, trigger: "blur" }
        ],
        safeChipModel: [
          { required: true, message: "请输入安全芯片型号", trigger: "blur" },
          {
            max: 200,
            message: "最多输入200个字符",
            trigger: "blur"
          },
           { validator: this.$specialCharValid, trigger: "blur" }
        ],
        entOrgCode: [
          { required: true, message: "请输入企业机构代码", trigger: "blur" },
          {
            max: 200,
            message: "最多输入200个字符",
            trigger: "blur"
          },
           { validator: this.$specialCharValid, trigger: "blur" }
        ],
        simId: [{ required: true, message: "请选择SIM卡号", trigger: "blur" }],
        chipId: [
          { required: true, message: "请选择芯片号", trigger: "change" }
        ],
        file: [{ required: true, message: "请上传图片" }],
        BindSimId: [
          { required: true, message: "请选择绑定的SIM卡", trigger: "change" }
        ],
        BindChipId: [
          { required: true, message: "请选择绑定的芯片", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    reset() {
      this.formSearch = {};
    },
    terminalQualificationPic(index, row) {
      this.dialogImageUrl =
        apiConfig.API_CONFIG + "/download/preview/" + row.qualificationsPic;
      this.dialogVisible = true;
    },
    //关闭前回调
    closeDialog(done) {
      this.$refs.formEdit.clearValidate();
      done();
    },
    //关闭sim卡绑定
    closeSimDialog(done) {
      this.$refs.formBindSim.clearValidate();
      done();
    },
    //关闭chip卡绑定
    closeChipDialog(done) {
      this.$refs.formBindChip.clearValidate();
      done();
    },
    handleError(a, b, c) {
      console.log(a, b, c);
    },
    //上传前回调
    onBeforeUpload(file) {
      const isIMAGE =
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png";
      const isLt1M = file.size < 2 * 1024 * 1024;
      if (!isIMAGE) {
        this.$message.error("上传文件只能是图片格式!");
      }
      if (!isLt1M) {
        this.$message.error("上传文件大小不能超过 2MB!");
      }
      if (isIMAGE && isLt1M) {
        this.loading = this.$loading({
          lock: true,
          text: "Loading...",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        return true;
      } else {
        return false;
      }
    },
    //清理大图弹窗
    clearDialogImageUrl() {
      this.dialogImageUrl = "";
    },
    //跳转至sim卡管理
    goSIMCardAdmin() {
      this.$router.push({
        path: "./SIMCardAdmin"
      });
    },
    //跳转到安全芯片
    goSecurityChipAdmin() {
      this.$router.push({
        path: "./SecurityChipAdmin"
      });
    },
    importTable() {
      this.$message.warning("导入功能开发中...");
    },
    exportTable() {
      this.$message.warning("导出功能开发中...");
    },
    handleDelete(index, row) {
      this.$confirm("确定删除该终端信息？", "消息", {
        type: "warning",
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        this.$http.delete("/baseinfo/terminal/" + row.id).then(({ data }) => {
          if (data.code === "200") {
            let totalPage = Math.ceil(
              (Number(this.tableData.total) - 1) / this.page.size
            );
            let currentPage =
              this.page.current > totalPage ? totalPage : this.page.current;
            this.page.current = currentPage < 1 ? 1 : currentPage;
            this.getTableData();
            this.$message.success("删除成功");
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    },
    //取消绑定sim卡
    cancelSimBind() {
      this.formBindSim.BindSimId = "";
      this.dialogSimVisible = false;
    },
    //取消绑定芯片
    cancelChipBind() {
      this.formBindChip.BindChipId = "";
      this.dialogChipVisible = false;
    },
    //确认绑定sim卡
    confirmSimBind() {
      this.$refs.formBindSim.validate(valid => {
        if (valid) {
          this.$http
            .put("/baseinfo/terminal/binding/sim/" + this.bindTerminal.id, {
              targetId: this.formBindSim.BindSimId
            })
            .then(({ data }) => {
              if (data.code === "200") {
                this.$message.success("绑定成功");
                this.dialogSimVisible = false;
                this.formBindSim.BindSimId = "";
                this.getTableData();
              } else {
                this.$message.error(data.msg);
              }
            });
        } else {
          return false;
        }
      });
    },
    //确认编订终端
    confirmChipBind() {
      this.$refs.formBindChip.validate(valid => {
        if (valid) {
          this.$http
            .put("/baseinfo/terminal/binding/Chip/" + this.bindTerminal.id, {
              targetId: this.formBindChip.BindChipId
            })
            .then(({ data }) => {
              if (data.code === "200") {
                this.$message.success("绑定成功");
                this.dialogChipVisible = false;
                this.formBindChip.BindChipId = "";
                this.getTableData();
              } else {
                this.$message.error(data.msg);
              }
            });
        } else {
          return false;
        }
      });
    },
    //上传图片成功回调
    handleSucess(res) {
      if (res.code === "200") {
        this.$set(this.formEdit, "qualificationsPic", res.data.id);
        this.$refs.formEdit.clearValidate("file");
      } else {
        this.$message.error(res.msg);
      }
      let isIE10 = false;
      if (window.navigator.userAgent.indexOf("MSIE") >= 1) {
        // 判断ie10以及以下
        isIE10 = true;
      } else {
        isIE10 = false;
      }
      let ele = this.$refs.upload.$el.getElementsByTagName("input")[0];
      if (isIE10) {
        let form = document.createElement("form");
        let beforInput = ele.nextSibling;
        let parentInput = ele.parentNode;
        form.appendChild(ele);
        form.reset();
        parentInput.insertBefore(ele, beforInput);
      } else {
        ele.value = null;
      }
      this.loading.close();
    },
    search() {
      //条件搜搜
      this.page.current = 1;
      this.querys = [
        {
          like: this.formSearch
        }
      ];
      this.getTableData();
    },
    //图片加载完成
    imageLoaded() {
      console.log("图片加载完成执行了");
    },
    //新增终端信息
    add() {
      this.formEdit = {};
      this.formEditDisabled = false;
      this.dialogType = "add";
      this.dialogTitle = "新增终端信息";
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
      this.$http.post("/rdbms/terminal-page/page", params).then(({ data }) => {
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
      if (this.formEdit.qualificationsPic) {
        this.rules.file = [];
      } else {
        this.rules.file = [{ required: true, message: "请上传图片" }];
      }
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
      this.rules.file = [{ required: true, message: "请上传图片" }];
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
    //删除接口图片
    handleRemove() {
      this.formEdit.qualificationsPic = "";
    },
    //取消确认
    cancelEdit() {
      this.$refs.formEdit.clearValidate();
      this.editFormVisible = false;
    },

    //新增终端方法
    confirmSubmit(data) {
      this.$http.post("/baseinfo/terminal", data).then(({ data }) => {
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
    //查看终端
    handleSee(index, row) {
      this.formEditDisabled = true;
      this.dialogType = "see";
      this.dialogTitle = "查看终端信息";
      this.formEdit = row;
      this.editFormVisible = true;
    },
    //绑定芯片
    handleBindChip(index, row) {
      this.formBindChip.BindChipId = "";
      this.dialogChipVisible = true;
      this.bindTerminal = row;
      this.$nextTick(() => {
        this.$refs.formBindChip.clearValidate();
      });
    },
    //解绑芯片
    handleUnbindChip(index, row) {
      this.$confirm("确定解绑芯片吗？", "消息", {
        type: "warning",
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        this.$http
          .put("/baseinfo/terminal/binding/chip/" + row.id, {})
          .then(({ data }) => {
            if (data.code === "200") {
              this.$message.success("解绑成功");
              this.getTableData();
            } else {
              this.$message.error(data.msg);
            }
          });
      });
    },
    //  绑定sim卡
    handleBindSim(index, row) {
      this.formBindSim.BindSimId = "";
      this.dialogSimVisible = true;
      this.bindTerminal = row;
      this.$nextTick(() => {
        this.$refs.formBindSim.clearValidate();
      });
    },
    //解绑sim卡
    handleUnbindSim(index, row) {
      this.$confirm("确定解绑SIM卡号吗？", "消息", {
        type: "warning",
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        this.$http
          .put("/baseinfo/terminal/binding/sim/" + row.id, {})
          .then(({ data }) => {
            if (data.code === "200") {
              this.$message.success("解绑成功");
              this.getTableData();
            } else {
              this.$message.error(data.msg);
            }
          });
      });
    },
    //编辑终端信息
    handleEdit(index, row) {
      this.formEditDisabled = false;
      this.dialogType = "edit";
      this.dialogTitle = "编辑终端信息";
      this.getTerminalInfor(row.id);
      this.editFormVisible = true;
    },

    //编辑终端方法
    confirmEidt(data) {
      this.$http.put("/baseinfo/terminal", data).then(({ data }) => {
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
    //查询终端管理详情
    getTerminalInfor(id) {
      this.$http.get("/baseinfo/terminal/" + id).then(({ data }) => {
        if (data.code === "200") {
          this.formEdit = data.data;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    //初始化芯片型号和sim卡型号
    getInitOption(id) {
      this.$http
        .post("/baseinfo/chip/list", {
          columns: ["CHIP_CODE", "ID"]
        })
        .then(({ data }) => {
          if (data.code === "200") {
            this.chipList = data.data;
          } else if (data.code == "401") {
          } else {
            this.$message.error(data.msg);
          }
        });
      this.$http
        .post("/baseinfo/sim/list", {
          columns: ["SIM_CODE", "ID"]
        })
        .then(({ data }) => {
          if (data.code === "200") {
            this.simList = data.data;
          } else if (data.code == "401") {
          } else {
            this.$message.error(data.msg);
          }
        });
    }
  },
  computed: {
    imageUrl() {
      if (this.formEdit.qualificationsPic) {
        return (
          apiConfig.API_CONFIG +
          "/download/preview/" +
          this.formEdit.qualificationsPic
        );
      } else {
        return null;
      }
    }
  },
  created() {
    this.getTableData();
    this.getInitOption();
  },
  mounted() {}
};
</script>
<style lang="less" scoped>
/deep/ .el-table__fixed-right {
  height: 100% !important;
}
/deep/ .pic-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
//上传图片样式
/deep/ .hover .el-form-item__content {
  width: 100px;
  height: 100px;
  vertical-align: middle;
  line-height: 100px;
  text-align: center;
}

.hover .pic_delete {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: #fff;
  font-size: 20px;
  background: rgba(255, 255, 255, 0);
  .pic_box {
    width: 100%;
    height: 100%;
    i {
      display: none;
      cursor: pointer;
    }
  }
}
.hover .pic_delete .pic_box:hover {
  background: rgba(0, 0, 0, 0.5);
  i {
    display: inherit;
  }
}
.pic-uploader .el-upload:hover {
  border-color: #409eff;
}
.pic-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 90px;
  text-align: center;
}
.pic {
  width: 100px;
  height: 100px;
  display: block;
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
.formEdit .el-select {
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
//table表格中图片查看按钮
.table-btn-icon {
  height: 25px;
  width: 25px;
  font-size: 20px;
  color: #409eff;
}
</style>
