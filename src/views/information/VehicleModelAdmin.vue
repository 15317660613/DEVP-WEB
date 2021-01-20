
<template>
  <div class="content">
    <el-form class="formSearch" :model="formSearchModel" label-width="80px">
      <el-select v-model="formSearchModel.id" type="type" clearable filterable placeholder="车辆型号">
        <el-option v-for="item in modelList" :key="item.id" :label="item.model" :value="item.id"></el-option>
      </el-select>
      <el-button type="primary" @click="search">搜索</el-button>
      <el-button @click="add">新增</el-button>
      <el-button @click="reset">重置</el-button>
      <el-button @click="importTable">导入</el-button>
      <el-button @click="exportTable">导出</el-button>
    </el-form>
    <el-table
      :data="tableData.records"
      style="width: 100%"
      height="428"
      size="mini"
      :cell-style="{height:'35px',padding:'5px 0px'}"
      border
      ref="elTable"
      :header-cell-style="{background:'#f8f8f9'}"
    >
      <el-table-column align="center" label="序号" width="60">
        <template slot-scope="scope">
          <span>{{scope.$index+(page.current - 1) * page.size + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="车辆型号" align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.model }}</template>
      </el-table-column>
      <el-table-column label="发动机型号 " align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.engineModel }}</template>
      </el-table-column>
      <el-table-column label="燃料类型" align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.fuelType }}</template>
      </el-table-column>
      <el-table-column label="整车生产企业" align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.business }}</template>
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
        background
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
      :fullscreen="true"
      :modal-append-to-body="false"
      :before-close="closeDialog"
    >
      <el-form
        :model="formEdit"
        class="formEdit"
        ref="formEdit"
        :disabled="formEditDisabled"
        :rules="rules"
        label-width="200px"
      >
        <el-col :span="8">
          <el-form-item label="车辆型号" prop="model">
            <el-input
             
              v-model="formEdit.model"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="发动机型号" prop="engineModel">
            <el-input
             
              v-model="formEdit.engineModel"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="燃料类型" prop="fuelType">
            <el-input
             
              v-model="formEdit.fuelType"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="整车生产企业" prop="business">
            <el-input
             
              v-model="formEdit.business"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="排放水平" prop="blowoffLevel">
            <el-input
             
              v-model="formEdit.blowoffLevel"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="尿素箱容积(L)" prop="volume">
            <el-input
             
              v-model="formEdit.volume"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="厂牌品牌" prop="brand">
            <el-input
             
              v-model="formEdit.brand"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="驱动桥主减速比" prop="mainRatio">
            <el-input
             
              v-model="formEdit.mainRatio"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="前进挡个数" prop="forwardCount">
            <el-input
             
              v-model="formEdit.forwardCount"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="各档速比" prop="eachRatio">
            <el-input
             
              v-model="formEdit.eachRatio"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="车型详情" prop="details.CX_CXXQ.value">
            <el-input
             
              v-model="formEdit.details.CX_CXXQ.value"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="用途类型" prop="details.CX_YTLX.value">
            <el-input
             
              v-model="formEdit.details.CX_YTLX.value"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="产地" prop="details.CX_CD.value">
            <el-input
             
              v-model="formEdit.details.CX_CD.value"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="底盘型号" prop="details.CX_DPXH.value">
            <el-input
             
              v-model="formEdit.details.CX_DPXH.value"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="底盘生产企业" prop="details.CX_DPSCQY.value">
            <el-input
             
              v-model="formEdit.details.CX_DPSCQY.value"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="最大允许装载质量" prop="details.CX_ZDYXZZZL.value">
            <el-input
             
              v-model="formEdit.details.CX_ZDYXZZZL.value"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="最高速度" prop="details.CX_ZGSD.value">
            <el-input
             
              v-model="formEdit.details.CX_ZGSD.value"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="最小离地间隙" prop="details.CX_ZXLDJX.value">
            <el-input
             
              v-model="formEdit.details.CX_ZXLDJX.value"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="轴数/列车轴数" prop="details.CX_ZSLCZS.value">
            <el-input
             
              v-model="formEdit.details.CX_ZSLCZS.value"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="轴距" prop="details.CX_ZJ.value">
            <el-input
             
              v-model="formEdit.details.CX_ZJ.value"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="轴距(前/后)" prop="details.CX_ZJQH.value">
            <el-input
             
              v-model="formEdit.details.CX_ZJQH.value"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="车身(或驾驶室)型式" prop="details.CX_CSHJSSXS.value">
            <el-input
             
              v-model="formEdit.details.CX_CSHJSSXS.value"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="变速箱" prop="details.CX_BSX.value">
            <el-input
             
              v-model="formEdit.details.CX_BSX.value"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="变速器生产企业" prop="details.CX_BSXSCQY.value">
            <el-input
             
              v-model="formEdit.details.CX_BSXSCQY.value"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="型式/操纵方式" prop="details.CX_XSCZFS.value">
            <el-input
             
              v-model="formEdit.details.CX_XSCZFS.value"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="变速器型号" prop="details.CX_BSQXH.value">
            <el-input
             
              v-model="formEdit.details.CX_BSQXH.value"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="油箱容积" prop="details.CX_YXRJ.value">
            <el-input
             
              v-model="formEdit.details.CX_YXRJ.value"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="由发动机驱动的附件允许吸收的最大功率(KW)" prop="details.CX_YFDJQDDFJ.value">
            <el-input
             
              v-model="formEdit.details.CX_YFDJQDDFJ.value"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="ESC试验ABC转速(r/min)" prop="details.CX_ESCSYABCZS.value">
            <el-input
             
              v-model="formEdit.details.CX_ESCSYABCZS.value"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="设备监控版本号" prop="details.CX_SBJKBB.value">
            <el-input
             
              v-model="formEdit.details.CX_SBJKBB.value"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="驱动形式及位置" prop="details.CX_QDXSJWZ.value">
            <el-input
             
              v-model="formEdit.details.CX_QDXSJWZ.value"
              maxlength="200"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col el-col :span="24">
          <div class="stance"></div>
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
  name: "VehicleModelAdmin",
  data() {
    const ADDVEHICLEDATA = {
      CX_CXXQ: {
        //车型详情
        value: "",
        propertyId: "CX_CXXQ"
      },
      CX_YTLX: {
        //用途类型
        value: "",
        propertyId: "CX_YTLX"
      },
      CX_CD: {
        //产地
        value: "",
        propertyId: "CX_CD"
      },
      CX_DPXH: {
        //底盘型号
        value: "",
        propertyId: "CX_DPXH"
      },
      CX_DPSCQY: {
        //底盘生产企业
        value: "",
        propertyId: "CX_DPSCQY"
      },
      CX_ZDYXZZZL: {
        //最大允许装载质量
        value: "",
        propertyId: "CX_ZDYXZZZL"
      },
      CX_ZGSD: {
        //最高速度
        value: "",
        propertyId: "CX_ZGSD"
      },
      CX_ZXLDJX: {
        //最小离地间隙
        value: "",
        propertyId: "CX_ZXLDJX"
      },
      CX_ZSLCZS: {
        //轴数/列车轴数
        value: "",
        propertyId: "CX_ZSLCZS"
      },
      CX_ZJ: {
        //轴距
        value: "",
        propertyId: "CX_ZJ"
      },
      CX_ZJQH: {
        //轴距(前/后)
        value: "",
        propertyId: "CX_ZJQH"
      },
      CX_CSHJSSXS: {
        //车身(或驾驶室)型式
        value: "",
        propertyId: "CX_CSHJSSXS"
      },
      CX_BSX: {
        //变速箱
        value: "",
        propertyId: "CX_BSX"
      },
      CX_BSXSCQY: {
        //变速器生产企业
        value: "",
        propertyId: "CX_BSXSCQY"
      },
      CX_XSCZFS: {
        //型式/操纵方式
        value: "",
        propertyId: "CX_XSCZFS"
      },
      CX_BSQXH: {
        //变速器型号
        value: "",
        propertyId: "CX_BSQXH"
      },
      CX_YXRJ: {
        //油箱容积
        value: "",
        propertyId: "CX_YXRJ"
      },
      CX_YFDJQDDFJ: {
        //由发动机驱动的附件允许吸收的最大功率(KW)
        value: "",
        propertyId: "CX_YFDJQDDFJ"
      },
      CX_ESCSYABCZS: {
        //ESC试验ABC转速(r/min)
        value: "",
        propertyId: "CX_ESCSYABCZS"
      },
      CX_SBJKBB: {
        //设备监控版本号
        value: "",
        propertyId: "CX_SBJKBB"
      },
      CX_QDXSJWZ: {
        //驱动形式及位置
        value: "",
        propertyId: "CX_QDXSJWZ"
      }
    };
    return {
      formSearchModel: {},
      formSearch: {},
      addvehicledata: {
        details: ADDVEHICLEDATA
      },
      formEditDisabled: false, //是否禁用from表单中组件功能
      dialogTitle: "编辑车辆信息", //弹框的标题
      dialogType: "see", //弹框类型
      querys: null, //用来判断是否进行条件搜索
      page: {
        current: 1,
        size: 10
      }, //当前页
      modelList: [], //车型列表
      formEdit: {
        details: JSON.parse(JSON.stringify(ADDVEHICLEDATA))
      },
      provinceList: [], //省份列表
      cityList: [], //城市列表
      editFormVisible: false, //编辑弹出框隐藏
      scopeId: "0", //用来
      tableData: [],
      rules: {
        //校验规则
        model: [
          { required: true, message: "请输入车辆型号", trigger: "blur" },
          { max: 200, message: "最多输入200个字符", trigger: "blur" },
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        engineModel: [
          { required: true, message: "请输入动机型号 ", trigger: "blur" },
          { max: 200, message: "最多输入200个字符", trigger: "blur" },
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        fuelType: [
          { required: true, message: "请输入燃料类型", trigger: "blur" },
          { max: 200, message: "最多输入200个字符", trigger: "blur" },
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        business: [
          { required: true, message: "请输入整车生产企业", trigger: "blur" },
          { max: 200, message: "最多输入200个字符", trigger: "blur" },
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        blowoffLevel: [
          { required: true, message: "请输入排放水平", trigger: "blur" },
          { max: 200, message: "最多输入200个字符", trigger: "blur" },
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        volume: [
          { required: true, message: "请输入尿素箱容积(L)", trigger: "blur" },
          { max: 200, message: "最多输入200个字符", trigger: "blur" },
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        brand: [
          { required: true, message: "请输入厂牌品牌", trigger: "blur" },
          { max: 200, message: "最多输入200个字符", trigger: "blur" },
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        mainRatio: [
          { required: true, message: "请输入驱动桥主减速比", trigger: "blur" },
          { max: 200, message: "最多输入200个字符", trigger: "blur" },
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        forwardCount: [
          { required: true, message: "请输入前进挡个数", trigger: "blur" },
          { max: 200, message: "最多输入200个字符", trigger: "blur" },
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        eachRatio: [
          { required: true, message: "请输入各档速比", trigger: "blur" },
          { max: 200, message: "最多输入200个字符", trigger: "blur" },
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CX_CXXQ.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CX_YTLX.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CX_CD.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CX_DPXH.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CX_DPSCQY.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CX_ZDYXZZZL.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CX_ZGSD.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CX_ZXLDJX.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CX_ZSLCZS.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CX_ZJ.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CX_ZJQH.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CX_CSHJSSXS.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CX_BSX.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CX_BSXSCQY.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CX_XSCZFS.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CX_BSQXH.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CX_YXRJ.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CX_YFDJQDDFJ.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CX_ESCSYABCZS.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CX_SBJKBB.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ],
        "details.CX_QDXSJWZ.value": [
          { validator: this.$specialCharValid, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    reset() {
      this.formSearch = {};
      this.formSearchModel = {};
    },
    //关闭前回调
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
      //条件搜搜
      this.page.current = 1;
      this.formSearch = this.$clone(this.formSearchModel);
      this.querys = [
        {
          eq: this.formSearch
        }
      ];
      this.getTableData();
    },

    //新增车辆信息
    add() {
      this.formEdit = JSON.parse(JSON.stringify(this.addvehicledata));
      this.formEditDisabled = false;
      this.dialogType = "add";
      this.dialogTitle = "新增车辆信息";
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
      this.$http
        .post("/baseinfo/vehicle-model/page", params)
        .then(({ data }) => {
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
    //删除用户
    handleDelete(index, row) {
      this.$confirm("确定删除该车型信息？", "消息", {
        type: "warning",
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        this.$http
          .delete("/baseinfo/vehicle-model/" + row.id)
          .then(({ data }) => {
            if (data.code === "200") {
              let totalPage = Math.ceil(
                (Number(this.tableData.total) - 1) / this.page.size
              );
              let currentPage =
                this.page.current > totalPage ? totalPage : this.page.current;
              this.page.current = currentPage < 1 ? 1 : currentPage;
              this.getVehicleModelOption();
              this.getTableData();
              this.$message.success("删除成功");
            } else {
              this.$message.error(data.msg);
            }
          });
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

    //新增车辆方法
    confirmSubmit(data) {
      this.$http.post("/baseinfo/vehicle-model", data).then(({ data }) => {
        if (data.code === "200") {
          //新增成功，关闭弹框,重置部分校验所需参数，刷新列表
          this.cancelEdit();
          this.$message.success("新增成功");
          this.getVehicleModelOption();
          this.getTableData();
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    //查看车辆
    handleSee(index, row) {
      this.formEditDisabled = true;
      this.dialogType = "see";
      this.dialogTitle = "查看车辆信息";
      this.editFormVisible = true;
      this.getVehicleInfor(row.id);
    },
    //编辑车辆信息
    handleEdit(index, row) {
      this.formEditDisabled = false;
      this.editFormVisible = true;
      this.dialogType = "edit";
      this.dialogTitle = "编辑车辆信息";
      this.getVehicleInfor(row.id);
    },
    //获取车辆详细信息
    getVehicleInfor(id) {
      this.$http.get("/baseinfo/vehicle-model/" + id).then(({ data }) => {
        if (data.code === "200") {
          this.formEdit = data.data;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    //编辑车辆方法
    confirmEidt(data) {
      this.$http.put("/baseinfo/vehicle-model", data).then(({ data }) => {
        if (data.code === "200") {
          //新增成功，关闭弹框,重置部分校验所需参数，刷新列表
          this.cancelEdit("formEdit");
          this.$message.success("编辑成功");
          this.getVehicleModelOption();
          this.getTableData();
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    //获取车型信息列表
    getVehicleModelOption() {
      this.$http
        .post("/baseinfo/vehicle-model/list", {
          columns: ["ID", "MODEL"]
        })
        .then(({ data }) => {
          if (data.code == "200") {
            this.modelList = data.data;
          } else if (data.code == "401") {
          } else {
            this.$message.error(data.msg);
          }
        });
    }
  },
  created() {
    this.getTableData();
    this.getVehicleModelOption();
  }
};
</script>
<style lang="less" scoped>
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
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #fff;
}
// 分页样式
.content .block {
  margin-top: 8px;
}
.formEdit {
  padding-bottom: 30px;
}
.stance {
  height: 40px;
}
</style>
