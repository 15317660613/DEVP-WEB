
<template>
  <div class="content">
    <el-form class="formSearch" :model="formSearch" label-width="80px">
      <el-input
       
        v-model="formSearch.chipCode"
        type="chipCode"
        maxlength="200"
        placeholder="芯片号"
      ></el-input>
      <el-input
       
        v-model="formSearch.business"
        type="business"
        maxlength="200"
        placeholder="芯片厂商"
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
      <el-table-column label="芯片号" align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.chipCode }}</template>
      </el-table-column>
      <el-table-column label="企业机构代码" width="100" align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.entOrgCode }}</template>
      </el-table-column>
      <el-table-column label="芯片厂商" align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.business }}</template>
      </el-table-column>
      <el-table-column label="联系人姓名" width="100" align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.linkman }}</template>
      </el-table-column>
      <el-table-column label="联系人电话" width="100" align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.tel }}</template>
      </el-table-column>
      <el-table-column label="厂商执照图片" width="100" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <i
            class="table-btn-icon el-icon-picture"
            @click="businessLicensePic(scope.$index, scope.row)"
          ></i>
        </template>
      </el-table-column>
      <el-table-column label="IATF1649证书图片" width="150" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <i class="table-btn-icon el-icon-picture" @click="seeIatfPic(scope.$index, scope.row)"></i>
        </template>
      </el-table-column>
      <el-table-column label="厂商说明" align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.remark }}</template>
      </el-table-column>
      <el-table-column label="芯片资质图片" width="100" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <i
            class="table-btn-icon el-icon-picture"
            @click="qualificationsPic(scope.$index, scope.row)"
          ></i>
        </template>
      </el-table-column>
      <el-table-column label="芯片附件" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <i class="table-btn-icon el-icon-picture" @click="attachment(scope.$index, scope.row)"></i>
        </template>
      </el-table-column>
      <el-table-column label="芯片说明" align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.chipDirection }}</template>
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
      top="2vh"
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
          <el-form-item label="芯片号" prop="chipCode">
            <el-input
             
              :disabled="dialogType!=='add'"
              v-model="formEdit.chipCode"
              :title="formEdit.chipCode"
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
          <el-form-item label="芯片厂商" prop="business">
            <el-input
             
              v-model="formEdit.business"
              :title="formEdit.business"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系人姓名" prop="linkman">
            <el-input
             
              v-model="formEdit.linkman"
              :title="formEdit.linkman"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系人电话" prop="tel">
            <el-input
             
              v-model="formEdit.tel"
              :title="formEdit.tel"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="厂商说明" prop="remark">
            <el-input
             
              v-model="formEdit.remark"
              :title="formEdit.remark"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="芯片说明" prop="chipDirection">
            <el-input
             
              v-model="formEdit.chipDirection"
              :title="formEdit.chipDirection"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="芯片附件" class="hover" prop="file_a">
            <img v-if="imageUrl_a" :src="imageUrl_a" class="pic" />
            <div v-if="imageUrl_a&&dialogType!=='see'" class="pic_delete">
              <div class="pic_box">
                <span @click="handleRemove('attachment')">
                  <i class="el-icon-delete"></i>
                </span>
              </div>
            </div>
            <el-upload
              ref="attachment"
              class="pic-uploader"
              :action="action"
              :show-file-list="false"
              accept="image/jpg, image/jpeg, image/png"
              :before-upload="onBeforeUpload"
              :on-success="(res)=>handleSucess(res,'attachment')"
            >
              <i v-if="!imageUrl_a" class="el-icon-plus pic-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="厂商执照图片" class="hover" prop="file_b">
            <img v-if="imageUrl_b" :src="imageUrl_b" class="pic" />
            <div v-if="imageUrl_b&&dialogType!=='see'" class="pic_delete">
              <div class="pic_box">
                <span @click="handleRemove('businessLicensePic')">
                  <i class="el-icon-delete"></i>
                </span>
              </div>
            </div>
            <el-upload
              ref="businessLicensePic"
              class="pic-uploader"
              :action="action"
              :show-file-list="false"
              accept="image/jpg, image/jpeg, image/png"
              :before-upload="onBeforeUpload"
              :on-success="(res)=>handleSucess(res,'businessLicensePic')"
            >
              <i v-if="!imageUrl_b" class="el-icon-plus pic-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="IATF1649证书图片" class="hover" prop="file_i">
            <img v-if="imageUrl_i" :src="imageUrl_i" class="pic" />
            <div v-if="imageUrl_i&&dialogType!=='see'" class="pic_delete">
              <div class="pic_box">
                <span @click="handleRemove('iatfPic')">
                  <i class="el-icon-delete"></i>
                </span>
              </div>
            </div>
            <el-upload
              ref="iatfPic"
              class="pic-uploader"
              :action="action"
              :show-file-list="false"
              accept="image/jpg, image/jpeg, image/png"
              :before-upload="onBeforeUpload"
              :on-success="(res)=>handleSucess(res,'iatfPic')"
            >
              <i v-if="!imageUrl_i" class="el-icon-plus pic-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="芯片资质图片" class="hover" prop="file_q">
            <img v-if="imageUrl_q" :src="imageUrl_q" class="pic" />
            <div v-if="imageUrl_q&&dialogType!=='see'" class="pic_delete">
              <div class="pic_box">
                <span @click="handleRemove('qualificationsPic')">
                  <i class="el-icon-delete"></i>
                </span>
              </div>
            </div>
            <el-upload
              ref="qualificationsPic"
              class="pic-uploader"
              :action="action"
              :show-file-list="false"
              accept="image/jpg, image/jpeg, image/png"
              :before-upload="onBeforeUpload"
              :on-success="(res)=>handleSucess(res,'qualificationsPic')"
            >
              <i v-if="!imageUrl_q" class="el-icon-plus pic-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="dialogType!== 'see'">
        <el-button @click="cancelEdit">取 消</el-button>
        <el-button type="primary" @click="editFormConfirm">确 定</el-button>
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
  name: "SecurityChipAdmin",
  data() {
    let validTel = (rule, value, callback) => {
      if (!/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(value)) {
        callback(new Error("请输入正确联系人电话"));
        return;
      }
      callback();
      this.$refs.formEdit.clearValidate("tel");
    };
    return {
      formSearch: {
        terminalCode: "",
        model: ""
      },
      dialogImageUrl: "",
      loading: null,
      dialogVisible: false,
      formEditDisabled: false, //是否禁用from表单中组件功能
      dialogTitle: "编辑安全芯片信息", //弹框的标题
      dialogType: "see", //弹框类型
      querys: null, //用来判断是否进行条件搜索
      imageId_i: "", //IATF1649证书图片id
      imageId_q: "", //芯片资质图片id
      page: {
        current: 1,
        size: 10
      }, //当前页
      formEdit: {},
      action: apiConfig.API_CONFIG + "/upload",
      provinceList: [], //省份列表
      cityList: [], //城市列表
      editFormVisible: false, //编辑弹出框隐藏
      scopeId: "0", //用来
      tableData: {
        total: 0
      },
      rules: {
        //校验规则
        chipCode: [
          { required: true, message: "请输入芯片号", trigger: "blur" },
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
        business: [
          { required: true, message: "请输入芯片厂商", trigger: "blur" },
          {
            max: 200,
            message: "最多输入200个字符",
            trigger: "blur"
          },
           { validator: this.$specialCharValid, trigger: "blur" }
        ],
        remark: [
          { required: true, message: "请输入厂商说明", trigger: "blur" },
          {
            max: 200,
            message: "最多输入200个字符",
            trigger: "blur"
          },
           { validator: this.$specialCharValid, trigger: "blur" }
        ],
        linkman: [
          { required: true, message: "请输入联系人姓名", trigger: "blur" },
          {
            max: 200,
            message: "最多输入200个字符",
            trigger: "blur"
          },
           { validator: this.$specialCharValid, trigger: "blur" }
        ],
        tel: [
          { required: true, message: "请输入联系人电话", trigger: "blur" },
          {
            validator: validTel,
            trigger: "blur"
          },
           { validator: this.$specialCharValid, trigger: "blur" }
        ],
        chipDirection: [
          { required: true, message: "请输入芯片说明", trigger: "blur" },
          {
            max: 200,
            message: "最多输入200个字符",
            trigger: "blur"
          },
           { validator: this.$specialCharValid, trigger: "blur" }
        ],
        file_a: [{ required: true, message: "请上传芯片附件" }],
        file_b: [{ required: true, message: "请上传厂商执照图片" }],
        file_i: [{ required: true, message: "请上传IATF1649证书图片" }],
        file_q: [{ required: true, message: "请上传芯片资质图片" }]
      }
    };
  },
  methods: {
    //关闭前回调
    closeDialog(done) {
      this.$refs.formEdit.clearValidate();
      done();
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
    reset() {
      this.formSearch = {};
    },
    importTable() {
      this.$message.warning("导入功能开发中...");
    },
    exportTable() {
      this.$message.warning("导出功能开发中...");
    },
    //上传图片成功回调
    handleSucess(res, name) {
      if (res.code === "200") {
        if (name === "businessLicensePic") {
          this.$set(this.formEdit, "businessLicensePic", res.data.id);
        } else if (name === "iatfPic") {
          this.$set(this.formEdit, "iatfPic", res.data.id);
        } else if (name === "qualificationsPic") {
          this.$set(this.formEdit, "qualificationsPic", res.data.id);
        } else if (name === "attachment") {
          this.$set(this.formEdit, "attachment", res.data.id);
        }
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
      let ele = this.$refs[name].$el.getElementsByTagName("input")[0];
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
    //新增安全芯片信息
    add() {
      console.log(this.rules);
      this.formEdit = {};
      this.formEditDisabled = false;
      this.dialogType = "add";
      this.dialogTitle = "新增安全芯片信息";
      this.cityList = [];
      this.editFormVisible = true;
    },
    getTableData() {
      //列表加载
      let that = this;
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
      this.$http.post("/baseinfo/chip/page", params).then(({ data }) => {
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
      if (this.formEdit.attachment) {
        this.rules.file_a = [];
      } else {
        this.rules.file_a = [{ required: true, message: "请上传芯片附件" }];
      }
      if (this.formEdit.businessLicensePic) {
        this.rules.file_b = [];
      } else {
        this.rules.file_b = [{ required: true, message: "请上传厂商执照图片" }];
      }
      if (this.formEdit.iatfPic) {
        this.rules.file_i = [];
      } else {
        this.rules.file_i = [
          { required: true, message: "请上传IATF1649证书图片" }
        ];
      }
      if (this.formEdit.qualificationsPic) {
        this.rules.file_q = [];
      } else {
        this.rules.file_q = [{ required: true, message: "请上传芯片资质图片" }];
      }
      this.$refs.formEdit.validate(valid => {
        if (valid) {
          if (this.dialogType === "add") {
            this.confirmSubmit(this.formEdit);
          } else if (this.dialogType === "edit") {
            this.confirmEidt(this.formEdit);
          }
        } else {
          return false;
        }
        this.rules.file_a = [{ required: true, message: "请上传芯片附件" }];
        this.rules.file_b = [{ required: true, message: "请上传厂商执照图片" }];
        this.rules.file_i = [
          { required: true, message: "请上传IATF1649证书图片" }
        ];
        this.rules.file_q = [{ required: true, message: "请上传芯片资质图片" }];
      });
    },
    //查看厂商图片
    businessLicensePic(index, row) {
      this.dialogImageUrl =
        apiConfig.API_CONFIG + "/download/preview/" + row.businessLicensePic;
      this.dialogVisible = true;
    },
    //查看IATF1649证书图片
    seeIatfPic(index, row) {
      this.dialogImageUrl =
        apiConfig.API_CONFIG + "/download/preview/" + row.iatfPic;
      this.dialogVisible = true;
    },
    //查看芯片资质图片
    qualificationsPic(index, row) {
      this.dialogImageUrl =
        apiConfig.API_CONFIG + "/download/preview/" + row.qualificationsPic;
      this.dialogVisible = true;
    },
    //查看芯片附件图片
    attachment(index, row) {
      this.dialogImageUrl =
        apiConfig.API_CONFIG + "/download/preview/" + row.qualificationsPic;
      this.dialogVisible = true;
    },
    //清理大图弹窗
    clearDialogImageUrl() {
      this.dialogImageUrl = "";
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
    handleRemove(name) {
      if (name === "businessLicensePic") {
        this.formEdit.businessLicensePic = "";
      } else if (name === "iatfPic") {
        this.formEdit.iatfPic = "";
      } else if (name === "qualificationsPic") {
        this.formEdit.qualificationsPic = "";
      } else if (name === "attachment") {
        this.formEdit.attachment = "";
      }
    },
    //取消确认
    cancelEdit() {
      this.$refs.formEdit.clearValidate();
      this.editFormVisible = false;
    },

    //新增安全芯片方法
    confirmSubmit(data) {
      this.$http.post("/baseinfo/chip", data).then(({ data }) => {
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
    //查看安全芯片
    handleSee(index, row) {
      this.formEditDisabled = true;
      this.dialogType = "see";
      this.dialogTitle = "查看安全芯片信息";
      this.formEdit = row;
      this.editFormVisible = true;
    },
    //编辑安全芯片信息
    handleEdit(index, row) {
      this.formEditDisabled = false;
      this.editFormVisible = true;
      this.dialogType = "edit";
      this.dialogTitle = "编辑安全芯片信息";
      this.formEdit = this.$clone(row);
    },
    //编辑安全芯片方法
    confirmEidt(data) {
      this.$http.put("/baseinfo/chip", data).then(({ data }) => {
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
    //删除安全芯片账户
    handleDelete(index, row) {
      this.$confirm("确定删除该安全芯片信息？", "消息", {
        type: "warning",
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        this.$http.delete("/baseinfo/chip/" + row.id).then(({ data }) => {
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
    }
  },
  computed: {
    //监听厂商执照图片id，生成对应URL,
    imageUrl_b() {
      if (this.formEdit.businessLicensePic) {
        return (
          apiConfig.API_CONFIG +
          "/download/preview/" +
          this.formEdit.businessLicensePic
        );
      } else {
        return null;
      }
    },
    //监听IATF1649证书图片id
    imageUrl_i() {
      if (this.formEdit.iatfPic) {
        return (
          apiConfig.API_CONFIG + "/download/preview/" + this.formEdit.iatfPic
        );
      } else {
        return null;
      }
    },
    //监听芯片资质图片id
    imageUrl_q() {
      if (this.formEdit.qualificationsPic) {
        return (
          apiConfig.API_CONFIG +
          "/download/preview/" +
          this.formEdit.qualificationsPic
        );
      } else {
        return null;
      }
    },
    //监听芯片资质图片id
    imageUrl_a() {
      if (this.formEdit.attachment) {
        return (
          apiConfig.API_CONFIG + "/download/preview/" + this.formEdit.attachment
        );
      } else {
        return null;
      }
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
/deep/ .pic-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
//上传图片样式
/deep/ .hover .el-form-item__content {
  width: 110px;
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
  background: rgba(0, 0, 0, 0);
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
  height: 470px;
}
//table表格中图片查看按钮
.table-btn-icon {
  height: 25px;
  width: 25px;
  font-size: 20px;
  color: #409eff;
}
</style>
