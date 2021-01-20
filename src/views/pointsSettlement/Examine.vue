<template>
  <div class="Examine">
    <div class="exmineDemonstrationArea">
      <div class="areaInfo">
        <div class="title">
          <span>车站申报管理</span>
          <div class="tableHandle">
            <el-form ref="ntvpForm" :model="condition" label-width="100px" class="form-inline">
              <el-form-item label="示范地区：">
                <el-select
                  v-model="condition.provinceId"
                  size="small"
                  placeholder="请选择"
                  @change="provinceChange"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="选择年份">
                <el-date-picker
                  v-model="condition.year"
                  type="year"
                  size="small"
                  @change="yearChange"
                  value-format="yyyy"
                  placeholder="选择年"
                ></el-date-picker>
              </el-form-item>
              <el-button
                class="agree"
                style="margin-left:10px;"
                v-if="!policyScoreFlag"
                size="small"
                @click="setAreaScore"
              >打分</el-button>
            </el-form>
          </div>
        </div>
        <div class="content">
          <el-row>
            <el-col :span="12">
              <div class="areaFileTitle">氢能供给保障证明材料</div>
              <div class="content-item">
                <el-button @click="downLoadHydrogenFile(fileInformation.hydrogenFile)">
                  <img src="@/assets/img/pointsSettlement/file.png" alt />氢能供给保障证明材料附件详情
                </el-button>
                <span style="margin:0 20px;">打分</span>
                <el-input
                  v-model="fileInformation.hydrogenScore"
                  :disabled="hydrogenScoreFlag"
                  size="small"
                  placeholder="请输入(500~800)"
                ></el-input>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="areaFileTitle" style="text-indent:5px;">政策法规环境</div>
              <div class="content-item-last">
                <el-button @click="downLoadPolicyFile(fileInformation.policyFile)">
                  <img src="@/assets/img/pointsSettlement/file.png" alt />政策支持体系证明材料附件详情
                </el-button>
                <span style="margin:0 20px;">打分</span>
                <el-input
                  v-model="fileInformation.policyScore"
                  size="small"
                  :disabled="policyScoreFlag"
                  placeholder="请输入(500~800)"
                ></el-input>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div class="newTechnology_vp">
      <div class="vpc_header">
        <span>车辆生产企业</span>
        <div class="tableHandle">
          <el-form ref="hscsForm" :model="ntvpForm" label-width="100px" class="form-inline">
            <el-form-item label="公司名称">
              <el-select size="small" v-model="ntvpForm.tenantId" filterable placeholder="请选择">
                <el-option
                  v-for="item in vehicleCompanyOptions"
                  :key="item.id"
                  :label="item.tenantName"
                  :value="item.tenantId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态：">
              <el-select size="small" v-model="ntvpForm.agree" filterable placeholder="请选择">
                <el-option label="全部" value="null"></el-option>
                <el-option label="未审批" value="-1"></el-option>
                <el-option label="同意" value="1"></el-option>
                <el-option label="驳回" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-button size="small" type="primary" class="search" @click="ntvpSearch">搜索</el-button>
            <el-button size="small" class="agree" @click="hscsAgreeHandle">同意</el-button>
            <el-button size="small" class="reject" @click="hscsRejectHandle">不同意</el-button>
          </el-form>
        </div>
      </div>
      <div class="vpc_content">
        <div class="vpcTable">
          <el-table
            ref="ntvpTable"
            :data="ntvpTableData"
            tooltip-effect="dark"
            :height="ntvpTableHeight"
            :row-class-name="tableRowClassName"
            header-row-class-name="tableHeaderStyle"
            size="mini"
            style="width: 100%"
            :header-cell-style="{background:'#f8f8f9'}"
            @selection-change="ntvpSelectionChange"
          >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column
              width="160"
              prop="tenantName"
              align="center"
              label="车辆生产企业"
              show-overflow-tooltip
            />
            <el-table-column label="状态" align="center">
              <template slot-scope="scope">
                <span :class="agreeClass(scope.row.agree)">{{scope.row.agree | agreeFormat}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="vin"
              width="140"
              align="center"
              label="车辆VIN码"
              show-overflow-tooltip
            />
            <el-table-column prop="vehicleNum" align="center" label="车辆牌照" show-overflow-tooltip />
            <el-table-column prop="vehicleModel" align="center" label="车辆型号" show-overflow-tooltip />
            <el-table-column
              prop="vecClass"
              :formatter="vecClassFormatter"
              align="center"
              label="车辆种类"
              show-overflow-tooltip
            />
            <el-table-column
              width="100"
              prop="odometer"
              align="center"
              label="用氢行驶里程"
              show-overflow-tooltip
            />
            <el-table-column
              label="车辆运行情况计算积分"
              align="center"
              prop="deservedBasicScore"
              show-overflow-tooltip
            />
            <el-table-column
              label="车辆推广计算积分"
              align="center"
              prop="deservedVehicleConfigScore"
              show-overflow-tooltip
            />
            <el-table-column label="车辆运行情况专家打分" align="center">
              <template slot-scope="scope">{{scope.row.actualBasicScore||"-"}}</template>
            </el-table-column>
            <el-table-column label="车辆车辆推广专家打分" align="center">
              <template slot-scope="scope">{{scope.row.actualVehicleConfigScore||"-"}}</template>
            </el-table-column>
            <el-table-column label="驳回原因" align="center">
              <template slot-scope="scope">{{scope.row.message||"-"}}</template>
            </el-table-column>
            <el-table-column
              :key="index"
              v-for="(item,index) in ntvpTableColumn"
              :prop="item.prop"
              align="center"
              :label="item.label"
              show-overflow-tooltip
              width="140"
            >
              <template slot-scope="scope">
                <div
                  v-if="isImage(scope.row,item.prop)"
                  class="tableBtn"
                  @click="handleSee(scope.$index, scope.row)"
                >点击查看</div>
                <template v-if="!isImage(scope.row,item.prop)">{{scope.row[item.prop]}}</template>
              </template>
            </el-table-column>
            <el-table-column label="详情" align="center">
              <template slot-scope="scope">
                <div class="tableBtn" @click="handleSee(scope.$index, scope.row)">查看详情</div>
              </template>
            </el-table-column>
          </el-table>
          <div>
            <pagination
              v-show="ntvpTotal>0"
              :total="ntvpTotal"
              :page.sync="ntvp_query.page.current"
              :limit.sync="ntvp_query.page.size"
              :pageSizes="[5,10,20,30]"
              @pagination="get_ntvp_list()"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="hydrogenationStation_cs">
      <div class="hscs_header">
        <span>加氢站建设情况</span>
        <div class="tableHandle">
          <el-form ref="hscsForm" :model="hscsForm" label-width="100px" class="form-inline">
            <el-form-item label="企业名称：">
              <el-select size="small" v-model="hscsForm.tenantId" filterable placeholder="请选择">
                <el-option
                  v-for="(item,index) in siteCompanyOptions"
                  :key="index"
                  :label="item.tenantName"
                  :value="item.tenantId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态：">
              <el-select size="small" v-model="hscsForm.agree" filterable placeholder="请选择">
                <el-option label="全部" value="null"></el-option>
                <el-option label="未审批" value="-1"></el-option>
                <el-option label="同意" value="1"></el-option>
                <el-option label="驳回" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-button size="small" type="primary" class="search" @click="hscsSearch">搜索</el-button>
            <el-button size="small" class="agree" @click="ntvpAgreeHandle">同意</el-button>
            <el-button size="small" class="reject" @click="ntvpRejectHandle">不同意</el-button>
          </el-form>
        </div>
      </div>
      <div class="hscs_content">
        <div class="hscsTable">
          <el-table
            :data="hscsTableData"
            :row-class-name="tableRowClassName"
            header-row-class-name="tableHeaderStyle"
            tooltip-effect="dark"
            height="232"
            size="mini"
            :cell-style="{height:'35px',padding:'5px 0px'}"
            style="width: 100%"
            :header-cell-style="{background:'#f8f8f9'}"
            @selection-change="hscsSelectionChange"
          >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column prop="provinceName" align="center" label="城市" show-overflow-tooltip />
            <el-table-column label="状态" align="center">
              <template slot-scope="scope">
                <span :class="agreeClass(scope.row.agree)">{{scope.row.agree | agreeFormat}}</span>
              </template>
            </el-table-column>
            <el-table-column label="加氢站计算积分" align="center">
              <template slot-scope="scope">{{scope.row.deservedScore}}</template>
            </el-table-column>
            <el-table-column label="加氢站专家积分" align="center">
              <template slot-scope="scope">{{scope.row.actualScore}}</template>
            </el-table-column>
            <el-table-column label="驳回原因" align="center">
              <template slot-scope="scope">{{scope.row.message}}</template>
            </el-table-column>
            <el-table-column
              prop="hydrogenAbility"
              align="center"
              label="加氢站能力"
              show-overflow-tooltip
            />
            <el-table-column prop="tenantName" align="center" label="企业名称" show-overflow-tooltip />
            <el-table-column prop="file" align="center" label="附件" show-overflow-tooltip />
          </el-table>
          <div>
            <pagination
              v-show="hscsTotal>0"
              :total="hscsTotal"
              :page.sync="hscs_query.page.current"
              :limit.sync="hscs_query.page.size"
              :pageSizes="[5,10,20,30]"
              @pagination="get_hscs_list()"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="spareParts_cy">
      <div class="spcy_header">
        <span>零部件企业</span>
        <div class="tableHandle">
          <el-form ref="spcyForm" :model="spcyForm" label-width="100px" class="form-inline">
            <el-form-item label="企业名称：">
              <el-select size="small" v-model="spcyForm.tenantId" filterable placeholder="请选择">
                <el-option
                  v-for="(item,index) in partCompanyOptions"
                  :key="index"
                  :label="item.tenantName"
                  :value="item.tenantId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态：">
              <el-select size="small" v-model="spcyForm.agree" filterable placeholder="请选择">
                <el-option label="全部" value="null"></el-option>
                <el-option label="未审批" value="-1"></el-option>
                <el-option label="已审批" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-button size="small" type="primary" class="search" @click="spcySearch">搜索</el-button>
          </el-form>
        </div>
      </div>
      <div class="spcy_content">
        <div class="spcyTable">
          <el-table
            :data="spcyTableData"
            :row-class-name="tableRowClassName"
            header-row-class-name="tableHeaderStyle"
            tooltip-effect="dark"
            height="232"
            size="mini"
            :cell-style="{height:'35px',padding:'5px 0px'}"
            style="width: 100%"
            :header-cell-style="{background:'#f8f8f9'}"
          >
            <el-table-column type="index" width="55" align="center" />
            <el-table-column
              width="150"
              prop="tenantName"
              align="center"
              label="零部件企业名称"
              show-overflow-tooltip
            />
            <el-table-column label="状态" align="center">
              <template slot-scope="scope">{{scope.row.agree | agreePartFormat}}</template>
            </el-table-column>
            <el-table-column
              width="150"
              prop="hydrogenation"
              align="center"
              label="氢燃料电池发动机型号"
              class-name="group1"
              show-overflow-tooltip
            />
            <el-table-column class-name="group1" width="160" label="燃料电池堆创新证明材料" align="center">
              <template slot-scope="scope">
                <img
                  style="height:20px;width:22px;"
                  src="@/assets/img/pointsSettlement/file.png"
                  alt
                  @click="handleSee(scope.$index, scope.row.batteryHeapFile)"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="protonMembrane"
              align="center"
              label="质子交换膜型号"
              class-name="group2"
              show-overflow-tooltip
            />
            <el-table-column width="160" class-name="group2" label="质子交换膜创新证明材料" align="center">
              <template slot-scope="scope">
                <img
                  style="height:20px;width:22px;"
                  src="@/assets/img/pointsSettlement/file.png"
                  alt
                  @click="handleSee(scope.$index, scope.row.protonMembraneFile)"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="airCompressor"
              align="center"
              label="空气压缩机型号"
              class-name="group3"
              show-overflow-tooltip
            />
            <el-table-column width="160" class-name="group3" label="空气压缩机创新证明材料" align="center">
              <template slot-scope="scope">
                <img
                  style="height:20px;width:22px;"
                  src="@/assets/img/pointsSettlement/file.png"
                  alt
                  @click="handleSee(scope.$index, scope.row.airCompressorFile)"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="hydrogenEngine"
              align="center"
              label="氢气循环泵型号"
              class-name="group4"
              show-overflow-tooltip
            />
            <el-table-column width="160" class-name="group4" label="氢气循环泵创新证明材料" align="center">
              <template slot-scope="scope">
                <img
                  style="height:20px;width:22px;"
                  src="@/assets/img/pointsSettlement/file.png"
                  alt
                  @click="handleSee(scope.$index, scope.row.hydrogenEngineFile)"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="circulationPump"
              align="center"
              label="气瓶型号"
              class-name="group5"
              show-overflow-tooltip
            />
            <el-table-column width="160" class-name="group5" label="气瓶创新证明材料" align="center">
              <template slot-scope="scope">
                <img
                  style="height:20px;width:22px;"
                  src="@/assets/img/pointsSettlement/file.png"
                  alt
                  @click="handleSee(scope.$index, scope.row.circulationPumpFile)"
                />
              </template>
            </el-table-column>
            <el-table-column width="180" fixed="right" label="积分" align="center">
              <template slot-scope="scope">
                <div class="approval">
                  <el-input
                    placeholder="请输入(500~1000)"
                    :disabled="scope.row.agree==1"
                    @blur="spcySetScore($event,scope.row.id)"
                    v-model="scope.row.score"
                  ></el-input>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top: 30px;">
            <el-pagination
              background
              :page-sizes="[5, 10, 15,20, 30]"
              layout="total, sizes, prev, pager, next,jumper"
              :total="total"
              :current-page="spcy_currentPage"
              @current-change="spcy_current_change"
              @size-change="spcy_size_change"
            />
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="审批积分"
      :visible.sync="dialogVisible"
      custom-class="vehicleDialog"
      width="360px"
      :modal="false"
    >
      <div>
        <div>
          <el-form
            ref="form"
            class="vehicleAgreeform"
            :model="vehicleAgreeform"
            label-width="160px"
          >
            <el-form-item label="车辆运行审批得分">
              <el-input type="text" placeholder="请输入" v-model="vehicleAgreeform.basicScore"></el-input>
            </el-form-item>
            <div class="recommendScore">
              <div class="scoreName">
                系统计算车辆运行积分
                <span>（可点击添加）</span>
              </div>
              <div>
                <span
                  class="integral"
                  :key="index"
                  v-for="(item,index) in filterScore(ntvpSelectData,'deservedBasicScore')"
                  @click="selectBasicScore(item)"
                >{{item}}</span>
              </div>
            </div>
            <el-form-item label="车辆推广审批得分">
              <el-input type="text" placeholder="请输入" v-model="vehicleAgreeform.configScore"></el-input>
            </el-form-item>
            <div class="recommendScore">
              <div class="scoreName">
                系统计算车辆推广积分
                <span>（可点击添加）</span>
              </div>
              <div>
                <span
                  class="integral"
                  :key="index"
                  v-for="(item,index) in filterScore(ntvpSelectData,'deservedVehicleConfigScore')"
                  @click="selectVehicleConfigScore(item)"
                >{{item}}</span>
              </div>
            </div>
          </el-form>
        </div>
      </div>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="vehicleAgreeConfrim">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="审批积分"
      :visible.sync="siteDialogVisible"
      custom-class="vehicleDialog"
      width="360px"
      :modal="false"
    >
      <div>
        <div>
          <el-form ref="form" class="vehicleAgreeform" :model="siteForm" label-width="160px">
            <el-form-item label="加氢站审批得分">
              <el-input type="text" placeholder="请输入" v-model="siteForm.actualScore"></el-input>
            </el-form-item>
            <div class="recommendScore">
              <div class="scoreName">
                审批积分
                <span>（可点击添加）</span>
              </div>
              <div>
                <span
                  class="integral"
                  :key="index"
                  v-for="(item,index) in filterScore(ntvpSelectData,'deservedScore')"
                  @click="selectBasicScore(item)"
                >{{item}}</span>
              </div>
            </div>
          </el-form>
        </div>
      </div>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setSiteScore">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="驳回"
      :visible.sync="rejectDialogVisible"
      custom-class="vehicleDialog"
      width="360px"
      :modal="false"
    >
      <div>
        <div>
          <el-form ref="form" class="vehicleAgreeform" :model="rejectform" label-width="160px">
            <el-form-item label="驳回原因">
              <el-input type="textarea" placeholder="请输入" v-model="rejectform.message"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="rejectDialogConfrim">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import Pagination from "@/components/common/Pagination";
import config from "@/assets/js/config";
import { getCompanyNameOption } from "@/assets/api/declare.js";
import {
  getFileInfo,
  getProvince,
  getVehicleList,
  setAreaScore,
  getSite,
  getComponent,
  setVehicleScore,
  setSiteScore,
  setComponent,
} from "@/assets/api/examine.js";
export default {
  name: "Examine",
  data() {
    return {
      radio: 1,
      form: {
        batchRadio: 1,
        desc: "",
      },
      ntvpForm: {},
      hscsForm: {},
      spcyForm: {},
      vehicleCompanyOptions: [],
      siteCompanyOptions: [],
      partCompanyOptions: [],
      siteSearchCondition: {},
      partSearchCondition: {},
      rejectType: "vehicle", //驳回类型
      rejectDialogVisible: false,
      rejectform: {
        //驳回原因
        message: "",
      },
      siteForm: {
        //加氢站得分
        actualScore: "",
      },
      siteDialogVisible: false, //加氢站批量打分弹窗是否显示
      hydrogenScoreFlag: false, //判断氢能源供给能否打分
      policyScoreFlag: false, //判断政策支持体系证明材料附件详情是否可以打分
      condition: {
        year: "",
        provinceId: "",
      },
      vehicleAgreeform: {
        basicScore: "",
        configScore: "",
      }, //车辆审批结果
      ntvpTotal: 0,
      hscsTotal: 0,
      fileInformation: {}, //师范地区文件信息
      // 车辆推广
      ntvp_query: {
        page: {
          current: 1,
          size: 5,
        },
        querys: {},
      },
      vehicleRejectform: {
        //车辆驳回原因
        message: "",
      },
      //车辆的生产企业
      ntvpTableData: [],
      ntvpTableColumn: [],
      spcyTableColumn: [],
      ntvpSelectData: [], //选中的车辆
      hscsSelectData: [], //选中的加氢站
      // 加氢站建设情况
      hscsTableData: [],
      //零部件
      spcyTableData: [],
      ntvpTableHeight: 225,
      spcyTableHeight: 225,
      //加氢站建设情况
      hscs_query: {
        page: {
          current: 1,
          size: 5,
        },
        querys: {},
      },
      //车辆搜索条件
      vehicleSearchCondition: {},
      //零部件企业
      ntvp_query: {
        page: {
          current: 1,
          size: 5,
        },
        querys: {},
      },
      dialogVisible: false,
      options: [],
      companyOptions: [
        {
          name: "北京新能源汽车股份有限公司 ",
          id: 1,
        },
      ],
      modelList: [
        {
          name: "别克",
          id: "1",
          value: "别克",
        },
        {
          name: "SUV",
          id: "2",
          value: "SUV",
        },
        {
          name: "现代",
          id: "3",
          value: "现代",
        },
      ],
      total: 5,
      // 车辆推广当前页
      vpc_currentPage: 1,
      // 加氢站当前页
      hscs_currentPage: 1,
      //零部件
      spcy_currentPage: 1,
      //应用推广车辆数据
      vpcTableData: [],
      // 加氢站建设情况
      hscsTableData: [],
      //零部件
      spcyTableData: [],
    };
  },
  components: {
    Pagination,
  },
  methods: {
    //应用新技术的车辆推广条件搜索
    ntvpSearch() {
      this.vehicleSearchCondition = JSON.parse(JSON.stringify(this.ntvpForm));
      this.getVehicleList();
    },
    //隔行变色
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 == 1) {
        return "grey-row";
      } else {
        return "white-row";
      }
    },
    downLoadHydrogenFile(fileId) {
      window.open(config.API_CONFIG + `/download/download/${fileId}`);
    },
    downLoadPolicyFile(fileId) {
      window.open(config.API_CONFIG + `/download/download/${fileId}`);
    },
    //给区域打分
    setAreaScore() {
      if (
        !this.fileInformation.hydrogenScore &&
        !this.fileInformation.policyScore
      ) {
        this.$message.warngin("请填写区域积分");
        return;
      }
      let data = {
        hydrogenSupplyScore: this.fileInformation.hydrogenScore,
        policyScore: this.fileInformation.policyScore,
        id: this.fileInformation.id,
      };
      setAreaScore(data).then((res) => {
        this.getFileInfo();
      });
    },
    //地区变化
    provinceChange() {
      this.getFileInfo();
      this.getVehicleList(); //获取车辆列表
      this.getSite(); //获取加氢站列表
      this.getComponent(); //获取零部件企业
    },
    // 年度变化
    yearChange() {
      this.getFileInfo();
    },
    //车辆table表格选项改变
    ntvpSelectionChange(selection) {
      this.ntvpSelectData = selection;
    },
    //加氢站表格选项变化
    hscsSelectionChange(selection) {
      this.hscsSelectData = selection;
    },
    //获取打分附件
    getFileInfo() {
      let params = {
        provinceId: this.condition.provinceId,
        year: this.condition.year,
      };
      getFileInfo(params).then((res) => {
        if (res.ok) {
          this.fileInformation = res.data;
          if (this.fileInformation.policyScore) {
            this.policyScoreFlag = true;
          }
          if (this.fileInformation.hydrogenScore) {
            this.hydrogenScoreFlag = true;
          }
        }
      });
    },
    //获取加氢站列表
    getSite() {
      let params = {
        provinceId: this.condition.provinceId,
        size: this.hscs_query.page.size,
        year: this.condition.year,
        current: this.hscs_query.page.current,
      };
      getSite(params).then((res) => {
        this.hscsTableData = res.data.data;
        this.hscsTotal = Number(res.data.total);
      });
    },
    //格式化车型
    vecClassFormatter(row) {
      if (row.vecClass === 1) {
        return "货车";
      } else if (row.vecClass === 2) {
        return "乘用车";
      } else if (row.vecClass === 3) {
        return "客车";
      }
    },
    //去重过滤分数
    filterScore(data, key) {
      if (data.length > 0) {
        let scoreData = data.map((item) => {
          if (item[key] != null) {
            return item[key];
          }
        });
        return new Set(scoreData);
      } else {
        return [];
      }
    },

    //点击车辆运行推荐分数
    selectBasicScore(val) {
      this.vehicleAgreeform.basicScore = val;
    },
    //点击车辆推广推荐分数
    selectVehicleConfigScore(val) {
      this.vehicleAgreeform.configScore = val;
    },
    isImage(row, key) {
      let str = row[key];
      if (str && (str.indexOf("jpg") !== -1 || str.indexOf("png") !== -1)) {
        return true;
      } else {
        return false;
      }
    },
    //获取新技术的车辆推广数据
    getVehicleList() {
      let params = {
        provinceId: this.condition.provinceId,
        year: this.condition.year,
        size: this.ntvp_query.page.size,
        current: this.ntvp_query.page.current,
      };
      params = Object.assign(params, this.vehicleSearchCondition);
      getVehicleList(params).then((res) => {
        this.ntvpStorageData = res.data.data;
        if (res.data.data.length > 0) {
          this.ntvpTableData = this.restructureVehicleList(
            res.data.data,
            "extras"
          );
          if (res.data.data[0].extras) {
            this.ntvpTableColumn = res.data.data[0].extras.map((item) => {
              return {
                label: item.name,
                prop: item.id,
              };
            });
          }
          this.$nextTick(() => {
            this.$refs.ntvpTable.doLayout();
            let height = document.querySelectorAll(
              ".el-table__header-wrapper"
            )[0].offsetHeight;
            this.ntvpTableHeight = height + 215;
          });
        } else {
          this.ntvpTableData = [];
        }
        this.ntvpTotal = Number(res.data.total);
      });
    },
    //车辆生产企业搜索
    vpcSearch() {},
    //点击查看图片
    handleSee() {},
    handleTabMonitorVehicle() {
      this.tab = 1;
    },
    handleTabSettled() {
      this.tab = 2;
    },
    get_ntvp_list() {},
    //车辆生产企业当前页改变
    vpc_current_change() {},
    vpc_size_change() {},

    //车辆生产企业批量操作
    hscsAgreeHandle() {
      if (this.ntvpSelectData.length < 1) {
        this.$message.warning("请先勾选要审批的车辆生产企业");
      } else {
        let flag = this.ntvpSelectData.every((item) => {
          return item.agree === null;
        });
        if (flag) {
          this.dialogVisible = true;
        } else {
          this.$message.warning("不能包含已审批数据");
        }
      }
    },
    //加氢站批量同意
    ntvpAgreeHandle() {
      if (this.hscsSelectData.length < 1) {
        this.$message.warning("请先勾选要审批的加氢站");
      } else {
        let flag = this.hscsSelectData.every((item) => {
          return item.agree === null;
        });
        if (flag) {
          this.siteDialogVisible = true;
        } else {
          this.$message.warning("不能包含已审批数据");
        }
      }
    },
    //车辆生产企业打分确认
    vehicleAgreeConfrim() {
      let ids = this.ntvpSelectData.map((item) => {
        return item.id;
      });
      let data = {
        agree: "1",
        basicScore: this.vehicleAgreeform.basicScore,
        configScore: this.vehicleAgreeform.configScore,
        ids: ids,
      };
      setVehicleScore(data).then((res) => {
        this.getVehicleList();
        this.dialogVisible = false;
        this.vehicleAgreeform.basicScore = "";
        this.vehicleAgreeform.configScore = "";
      });
    },
    //加氢站打分
    setSiteScore() {
      let ids = this.hscsSelectData.map((item) => {
        return item.id;
      });
      let data = {
        agree: "1",
        score: this.siteForm.actualScore,
        ids: ids,
      };
      setSiteScore(data).then((res) => {
        this.getSite();
        this.siteDialogVisible = false;
        this.siteForm.actualScore = "";
      });
    },
    //车辆生产企业批量驳回
    hscsRejectHandle() {
      let flag = this.ntvpSelectData.every((item) => {
        return item.agree === null;
      });
      if (flag) {
        this.siteDialogVisible = true;
      } else {
        this.$message.warning("不能包含已审批数据");
      }
      this.rejectDialogVisible = true;
      this.rejectType = "vehicle"; //车辆驳回
    },
    ntvpRejectHandle() {
      let flag = this.hscsSelectData.every((item) => {
        return item.agree === null;
      });
      if (flag) {
        this.rejectDialogVisible = true;
        this.rejectType = "site"; //加氢站驳回
      } else {
        this.$message.warning("不能包含已审批数据");
      }
    },
    //车辆生产企业驳回确认
    rejectDialogConfrim() {
      if (this.rejectType === "vehicle") {
        let ids = this.ntvpSelectData.map((item) => {
          return item.id;
        });
        let data = {
          agree: "0",
          ids: ids,
          message: this.rejectform.message,
        };
        setVehicleScore(data).then((res) => {
          this.getVehicleList();
          this.rejectDialogVisible = false;
          this.rejectform.message = "";
        });
      } else if (this.rejectType === "site") {
        let ids = this.hscsSelectData.map((item) => {
          return item.id;
        });
        let data = {
          agree: "0",
          ids: ids,
          message: this.rejectform.message,
        };
        setSiteScore(data).then((res) => {
          this.getSite();
          this.rejectDialogVisible = false;
          this.rejectform.message = "";
        });
      }
    },

    vpcBatchHandle() {
      if (this.ntvpSelectData.length < 1) {
        this.$message.warning("请先勾选要审批的车辆生产企业");
      } else {
        this.dialogVisible = true;
      }
    },
    //零部件批量打分
    spcySetScore(e, id) {
      this.$confirm("是否确认提交审批积分", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let data = {
          agree: "1",
          id: id,
          score: e.target.value,
        };
        setComponent(data).then((res) => {
          this.getComponent();
          return this.$message.success("操作成功");
        });
      });
    },
    getComponent() {
      let params = {
        provinceId: this.condition.provinceId,
        size: this.ntvp_query.page.size,
        current: this.ntvp_query.page.current,
        year: this.condition.year,
      };
      getComponent(params).then((res) => {
        if (res.data.data.length > 0) {
        }
        this.spcyTableData = res.data.data;
        // this.spcyTableData = this.restructureVehicleList(
        //   res.data.data,
        //   "properties"
        // );
        // this.spcyTableColumn = res.data.data[0].properties.map((item) => {
        //   return {
        //     label: item.name,
        //     prop: item.id,
        //   };
        // });
        this.$nextTick(() => {
          // this.$refs.spcyTable.doLayout();
          this.spcyTableHeight =
            document.querySelectorAll(".el-table__header-wrapper")[2]
              .offsetHeight + 220;
        });
      });
    },
    getCompanyNameOption() {
      let params1 = {
        provinceId: this.condition.provinceId,
        tenantType: 4,
      };
      getCompanyNameOption(params1).then((res) => {
        this.vehicleCompanyOptions = res.data;
      });
      let params3 = {
        provinceId: this.condition.provinceId,
        tenantType: 5,
      };
      getCompanyNameOption(params3).then((res) => {
        this.partCompanyOptions = res.data;
      });
      let params2 = {
        provinceId: this.condition.provinceId,
        tenantType: 6,
      };
      getCompanyNameOption(params2).then((res) => {
        this.siteCompanyOptions = res.data;
      });
    },
    //加氢站条件搜索

    hscsSearch() {
      this.siteSearchCondition = JSON.parse(JSON.stringify(this.hscsForm));
      this.getSite();
    },
    //零部件企业条件搜索
    spcySearch() {
      this.partSearchCondition = JSON.parse(JSON.stringify(this.spcyForm));
      this.getComponent();
    },
    //加氢站分页改变
    hscs_current_change() {},
    hscs_size_change() {},
    //零部件分页改变
    spcy_current_change() {},
    spcy_size_change() {},
    //构造新的列表
    restructureVehicleList(data, extras) {
      let newData = [];
      data.forEach((item) => {
        let obj = {};
        if (item[extras]) {
          item[extras].forEach((itemChild) => {
            obj[itemChild.id] = itemChild.value;
          });
          newData.push(Object.assign(item, obj));
        } else {
          newData = data;
        }
      });

      return newData;
    },
    agreeClass(agree) {
      if (agree == "1") {
        return "agreeClass";
      } else if (agree == "0") {
        return "rejectClass";
      }
    },
  },
  filters: {
    agreeFormat(agree) {
      if (agree == null) {
        return "未审批";
      } else if (agree == "1") {
        return "同意";
      } else if (agree == "0") {
        return "不同意";
      } else {
        return "-";
      }
    },
    agreePartFormat(agree) {
      if (agree == null) {
        return "未审批";
      } else if (agree == "1") {
        return "已审批";
      } else {
        return "-";
      }
    },
  },
  created() {
    getProvince().then((res) => {
      this.options = res.data;
      this.condition.provinceId = this.options[0].id;
      this.condition.year = new Date().getFullYear().toString();
      this.getFileInfo();
      this.getVehicleList(); //获取车辆列表
      this.getSite(); //获取加氢站列表
      this.getComponent(); //获取零部件企业
      this.getCompanyNameOption();
    });
  },
};
</script>
<style lang="less" scoped>
.form-inline {
  .el-form-item {
    display: inline-block;
    .el-input {
      width: 172px;
    }
    .el-select {
      width: 172px;
    }
  }
}
/deep/.el-table .grey-row {
  background: #fafafa;
}
/deep/.el-table .white-row {
  background: #ffffff;
}
.agreeClass {
  color: #6fc246;
}
.rejectClass {
  color: #f1414d;
}
.tableHandle {
  float: right;
  height: 50px;
  line-height: 50px;
  margin-right: 10px;
  .form-inline {
    .el-form-item {
      display: inline-block;
      margin-bottom: 10px;
      /deep/label {
        color: #303133;
      }
    }
  }
  .search {
    margin-left: 10px;
  }
  .agree {
    background: rgba(74, 144, 226, 0.1);
    border-color: #4a90e2;
    color: #4a90e2;
  }
  .reject {
    background: rgba(245, 108, 108, 0.1);
    border-color: #f56c6c;
    color: #f56c6c;
  }
}
.dialog-footer {
  text-align: center;
}
.Examine {
  margin: 0 10px 10px 10px;
  height: calc(100% - 20px);
  width: calc(100% - 20px);
  overflow: auto;
  font-size: 14px;
  color: #303133;
  .exmineDemonstrationArea {
    background-color: #ffffff;
    .areaInfo {
      .title {
        height: 50px;
        line-height: 50px;
        color: #303133;
        box-sizing: border-box;
        border-bottom: 1px solid #ebeef5;
        span {
          margin-left: 15px;
          font-weight: 600;
        }
      }
      .content {
        position: relative;
        margin-top: 15px;
        .batch_module {
          position: absolute;
          right: 10px;
          top: -60px;
          z-index: 2;
          .agree {
            background: #4a90e2;
            color: #ffffff;
          }
        }
        .areaFileTitle {
          text-indent: 15px;
          line-height: 20px;
          height: 20px;
        }
        .content-item {
          margin: 10px 5px 10px 15px;
          line-height: 80px;
          border: 1px solid #ebeef5;
          background-color: #ebeef5;
          border-radius: 5px;
          .el-input {
            width: 142px;
          }
          .el-button {
            background-color: #f2f6fc;
            padding: 0 10px;
            height: 30px;
            line-height: 30px;
            margin-left: 30px;
            img {
              width: 20px;
              height: 22px;
              vertical-align: top;
            }
          }
        }
        .content-item-last {
          margin: 10px 15px 10px 5px;
          border: 1px solid #ebeef5;
          border-radius: 5px;
          line-height: 80px;
          background-color: #ebeef5;
          .el-input {
            width: 142px;
          }
          .el-button {
            background-color: #f2f6fc;
            padding: 0 10px;
            height: 30px;
            line-height: 30px;
            margin-left: 30px;
            img {
              width: 20px;
              height: 22px;
              vertical-align: top;
            }
          }
        }
        span {
          color: #666666;
        }
      }
    }

    .demonstrationAreaHandleBox {
      width: 448px;
      border-left: 1px solid #ececec;
      line-height: 112px;
      padding-left: 20px;
      .el-input {
        width: 200px;
      }
    }
  }
  .newTechnology_vp {
    background-color: #ffffff;
    border: 1px solid #ebeef5;
    .vpc_header {
      position: relative;
      height: 50px;
      line-height: 50px;
      margin-left: 15px;
      span {
        font-weight: 600;
      }
    }
    .vpc_content {
      padding-bottom: 10px;
      position: relative;
      .tableBtn {
        color: #4a90e2;
        background-color: #f4fbff;
        border: 1px solid #bee3ff;
        border-radius: 5px;
      }
      .vpcTable {
        display: inline-block;
        margin-right: 10px;
        margin-left: 10px;
        width: calc(100% - 20px);
      }
      .form-inline {
        .el-form-item {
          display: inline-block;
        }
        .search {
          margin-left: 10px;
        }
      }
    }
  }
  .hydrogenationStation_cs {
    background-color: #ffffff;
    border: 1px solid #ebeef5;
    .hscs_header {
      position: relative;
      height: 50px;
      line-height: 50px;
      margin-left: 15px;
      span {
        font-weight: 600;
      }
    }
    .tableBtn {
      color: #4a90e2;
      background-color: #f4fbff;
      border: 1px solid #bee3ff;
      border-radius: 5px;
    }
    .hscs_content {
      padding-bottom: 10px;
      position: relative;
      .hscsTable {
        margin: 0px 10px;
      }
      .form-inline {
        .el-form-item {
          display: inline-block;
        }
        .search {
          margin-left: 10px;
        }
      }
    }
  }
  .spareParts_cy {
    background-color: #ffffff;
    border: 1px solid #ebeef5;
    .spcy_header {
      position: relative;
      height: 50px;
      line-height: 50px;
      margin-left: 15px;
      span {
        font-weight: 600;
      }
    }
    .spcy_content {
      padding-bottom: 10px;
      .spcyTable {
        margin: 0px 10px;
        /deep/.group1 {
          background-color: rgba(216, 216, 216, 0.2) !important;
        }
        /deep/.group2 {
          background-color: rgba(93, 68, 0, 0.07) !important;
        }
        /deep/.group3 {
          background-color: rgba(0, 76, 106, 0.07) !important;
        }
        /deep/.group4 {
          background-color: rgba(59, 114, 0, 0.07) !important;
        }
        /deep/.group5 {
          background-color: rgba(102, 177, 255, 0.07) !important;
        }
        .approval {
          .el-input {
            width: 150px;
            height: 26px;
            /deep/.el-input__inner {
              height: 26px;
            }
          }
        }
      }
      .form-inline {
        .el-form-item {
          display: inline-block;
        }
        .search {
          margin-left: 10px;
        }
      }
    }
  }
  /deep/.vehicleDialog {
    /deep/.el-dialog__body {
      padding-left: 0px;
      padding-right: 0px;
    }
    .vehicleAgreeform {
      .el-form-item {
        margin-bottom: 10px;
        .el-input {
          width: 192px;
          height: 32px;
          line-height: 32px;
          background-color: #dbdbdb;
          border-radius: 10px;
          .el-input__inner {
            height: 32px;
            line-height: 32px;
            background-color: #dbdbdb;
          }
        }
      }
      .recommendScore {
        height: 60px;
        font-size: 12px;
        background-color: #fafafa;
        padding: 10px;
        .scoreName {
          color: #666666;
          font-weight: 600;
          margin-bottom: 10px;
          span {
            color: #999999;
            font-weight: 500;
          }
        }
        .integral {
          display: inline-block;
          padding: 5px 15px;
          border-radius: 5px;
          color: #1677ff;
          margin-left: 10px;
          background-color: #edf5ff;
        }
      }
    }
  }
}
</style>