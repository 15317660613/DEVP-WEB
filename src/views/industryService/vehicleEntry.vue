<template>
  <div class="content">
    <div class="table-wrapper">
      <div style="float: left"><span style="font-weight: bold;font-size: 14px;margin-right: 10px">车辆准入审核</span> <span
        style="color:#8F9399;font-size: 12px;letter-spacing: 2px">
        已选择{{selitme}}项</span>
      </div>
      <div class="tool-btn-group">
        <el-button type="normal" size="mini" @click="agreeBatch">批量同意</el-button>
        <el-button size="mini" @click="refuseBatch">批量驳回</el-button>
        <!--          <el-button size="mini" @click="startProcess">撤回</el-button>-->
        <el-checkbox v-model="checked" style="margin-left: 10px" @change="filterStatus">未审核</el-checkbox>
        <div style="float: right;margin-left: 10px">
          <el-input placeholder="请输入车牌号" v-model="vehicleNum" class="input-with-select" size="mini">
            <el-button slot="append" icon="el-icon-search" size="mini" type="primary" @click="handleFilter">搜索</el-button>
          </el-input>
        </div>
      </div>
<!--      <div class="lineBlock">-->
<!--        <div style="padding-left:3%"><img src="@/assets/img/shape.png"> 已选择 <span style="color:#1890FF">{{selitme}}</span> 项</div>-->
<!--      </div>-->
      <el-table :data="tableData" border style="width: 100%" stripe class="table-fixed" @selection-change="handleSelectionChange" :max-height="tableHeight"
                header-row-class-name="tableHeaderStyle">
        <el-table-column label="" type="selection" align="center" width="55"></el-table-column>
        <el-table-column prop="tenantName" label="车企" align="center"></el-table-column>
        <el-table-column prop="vehicleNum" label="车牌号" align="center"></el-table-column>
        <el-table-column prop="vehicleModel" label="车型" align="center"></el-table-column>
        <el-table-column prop="vin" label="车辆VIN码" align="center"></el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="{row}">
            {{row.status | statusFilter1}}
          </template>
        </el-table-column>
        <el-table-column label="当前审批状态" align="center" min-width="120" fixed="right">
          <template slot-scope="{row}">
            <span class="statusCircle" v-if="row.status==='0'" style="background-color: #B6B6B6"></span>
            <span class="statusCircle" v-if="row.status==='1'" style="background-color: #00B589"></span>
            <span class="statusCircle" v-if="row.status==='2'" style="background-color: #FD472B"></span>
            <span class="statusCircle" v-if="row.status==='3'" style="background-color: #3391EC"></span>
            {{row.status | statusFilter}}
            <el-popover
              placement="right"
              width="200"
              trigger="hover"
              @show="getProgressImageli(row.transcationId)"
            >
              <ul class="tips-content" v-if="progressImageList.length > 0">
                <li v-for="(item) in progressImageList" style="margin-top: 8px;">
                  <span style="font-size: 14px">{{ item.ccTaskItems[0].taskDefName }} - {{ item.ccTaskItems[0].assigneeRealName}}</span><br>
                  <span v-if="item.ccTaskItems[0].status===2">于{{item.ccTaskItems[0].dealTime }}</span>
                  <span v-else>暂无处理意见</span><br>
                  {{ item.ccTaskItems[0].remark }}
                  <!--                  {{ item.ccTaskItems[0].taskDefName }} -->
                </li>
              </ul>
              <div v-else>暂无数据</div>
              <i
                slot="reference"
                class="el-icon-caret-right"
              />
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column align="center" label="批准总体结论" width="200" fixed="right">
          <template slot-scope="scope">
            <el-radio-group v-model="scope.row.radio" @change="changeAgree(scope.row)" :disabled="!scope.row.msg">
              <el-radio label="agree">同意</el-radio>
              <el-radio label="rollback">驳回</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column align="center" label="审批意见" width="200" fixed="right">
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.msg" placeholder="请输入内容" :disabled="scope.row.status==='1' || scope.row.status==='2'"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="queryObj.page.current" :limit.sync="queryObj.page.size"
                  @pagination="getLBJList()"/>
    </div>

    <el-dialog title="驳回原因" v-if="dialogVisible" :visible.sync="dialogVisible" :modal-append-to-body="false" width="360px">
      <el-form label-position="left" label-width="100px">
        <el-form-item required label="驳回原因：">
          <el-input maxlength="200" placeholder="请输入" type="textarea" v-model="reason" rows="5"/>
        </el-form-item>
      </el-form>
      <div class="dialog-footer" style="text-align: right">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="rollback">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import {getVehicleField, getVehicleListByPage, getModelListByPage, getModelDetail, addVehicle, editVehicle, getVehicleDetail, deleteVehicle} from '@/assets/api/stationDeclaration'
    import {completeTaskBatch, getProgressImageData} from '@/assets/api/process'
    import Pagination from '@/components/common/Pagination'

    export default {
        name: "vehicle",
        filters: {
            statusFilter(type) {
                const keyValue = {
                    0: '草稿',
                    1: '批准',
                    2: '拒绝',
                    3: '审批中'
                };
                return keyValue[type]
            },
            statusFilter1(type) {
                if (type === '1' || type === '2') {
                    return '已审批'
                } else {
                    return '未审批'
                }
            }
        },
        components: {
            Pagination
        },
        data() {
            return {
                istrue: 0,
                total: 0,
                tableData: [],
                tableHeader: [],
                vehicleNum: '',
                queryObj: {
                    page: {
                        current: 1,
                        size: 10
                    },
                    querys: [
                        {
                            like: {
                                vehicleNum: ""
                            },
                            notIn: [{
                                status: 0
                            }]
                        }
                    ]
                },
                dialogVisible: false,
                multipleSelection: [],
                selitme: 0,
                tableHeight: window.innerHeight - 211,
                checked: false,
                progressImageList: [],
                reason: ''
            }
        },
        mounted() {
            this.init();
            this.$nextTick(function () {
                // 监听窗口大小变化
                let self = this;
                window.onresize = function () {
                    self.tableHeight = window.innerHeight - 211
                }
            })
        },
        methods: {
            init() {
                // this.getTableHeader();
                this.getLBJList();
                // this.getModelList();
            },
            handleFilter() {
                this.queryObj.page.current = 1;
                this.queryObj.querys[0].like.vehicleNum = this.vehicleNum;
                this.getLBJList()
            },
            getLBJList() {
                this.tableData = [];
                getVehicleListByPage(this.queryObj).then((res) => {
                    this.tableData = res.data.records;
                    this.total = parseInt(res.data.total);
                })
            },
            handleSelectionChange: function (val) {
                this.selitme = val.length;
                this.multipleSelection = val;
            },
            changeAgree(row) {
                this.$confirm('是否确认提交审批意见', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let params = {};
                    params.assignee = this.userId;
                    params.comment = row.msg;
                    params.variables = {approve: row.radio};
                    params.taskIdArray = [row.transcationId];
                    params.formContent = "";
                    params.isAgencyTask = 0;
                    params.type = 0;
                    completeTaskBatch(params).then((res) => {
                        this.getLBJList();
                        return this.$message.success("操作成功")
                    })
                })
            },
            filterStatus(val) {
                if (val) {
                    this.queryObj.querys[0].notIn = [{status: 0},{status: 1}, {status: 2}];
                    this.getLBJList()
                }else{
                    this.queryObj.querys[0].notIn = [{status: 0}];
                    this.getLBJList()
                }
            },
            agreeBatch() {
                if (this.multipleSelection.length <= 0) {
                    return this.$message({
                        message: '请选择至少一条数据',
                        type: 'warning'
                    });
                }
                let ids = [];
                for (let i = 0; i < this.multipleSelection.length; i++) {
                    ids.push(this.multipleSelection[i].transcationId);
                }
                this.$confirm('是否确认提交审批意见', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let params = {};
                    params.assignee = this.userId;
                    params.comment = '同意';
                    params.variables = {approve: 'agree'};
                    params.taskIdArray = ids;
                    params.formContent = "";
                    params.isAgencyTask = 0;
                    params.type = 0;
                    completeTaskBatch(params).then((res) => {
                        this.getLBJList();
                        return this.$message.success("操作成功")
                    })
                })
            },
            refuseBatch() {
                if (this.multipleSelection.length <= 0) {
                    return this.$message({
                        message: '请选择至少一条数据',
                        type: 'warning'
                    });
                }
                this.dialogVisible = true;
            },
            rollback() {
                let ids = [];
                for (let i = 0; i < this.multipleSelection.length; i++) {
                    ids.push(this.multipleSelection[i].transcationId);
                }
                if (!this.reason) {
                    return this.$message.error("请输入驳回原因")
                }
                let params = {};
                params.assignee = this.userId;
                params.comment = this.reason;
                params.variables = {approve: 'rollback'};
                params.taskIdArray = ids;
                params.formContent = "";
                params.isAgencyTask = 0;
                params.type = 0;
                completeTaskBatch(params).then((res) => {
                    this.dialogVisible = false;
                    this.getLBJList();
                    return this.$message.success("操作成功")
                })
            },
            getProgressImageli(businessKey) {
                // processInstanceId
                let params = {processInstanceId: businessKey}
                getProgressImageData(params).then((res) => {
                    this.progressImageList = res.data.reverse()
                })
            },
        }
    }
</script>

<style scoped>
  .content {
    width: 100%;
    margin: 0 10px 10px 10px;
    background-color: #FFF;
    height: calc(100% - 10px);
    /*padding: 20px 30px;*/
    position: relative;
    overflow: hidden;
  }

  .table-wrapper {
    padding: 15px;
  }

  .table-wrapper .tool-btn-group {
    float: right;
    margin-bottom: 10px;
  }

  .table-fixed /deep/ .el-table__fixed-right {
    height: 100% !important;
  }

  .table-fixed /deep/ .el-table__fixed {
    height: 100% !important;
  }

  .upload-demo {
    display: inline-block;
  }

  /deep/ .el-dialog__footer {
    text-align: center;
  }

  .input-with-select /deep/ .el-input-group__append {
    background-color: #4A90E2;
    color: #FFF;
  }

  .statusCircle {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background-color: #ff0000;
  }

  .titleInfo {
    border-left: 2px solid #2B60A6;
    padding-left: 10px;
    font-weight: 600;
    margin-bottom: 20px;
  }

  /deep/ .el-form-item {
    display: flex;
  }

  /deep/ .el-form-item__label-wrap {
    width: auto !important;
    margin-left: 0 !important;
    white-space: nowrap;
  }

  /deep/ .el-form-item__content {
    margin-left: 0 !important;
    flex: 1;
  }

  .fullWidthInput /deep/ .el-form-item__content {
    flex: none;
  }

  /deep/ .el-form-item__content .el-select {
    width: 100%;
  }

  .modelInput {
    margin-bottom: 10px;
  }

  .partsDetail {
    background-color: rgba(211, 217, 226, 0.16);
    padding: 0 15px;
    margin: 20px 0;
  }

  .partsDetail /deep/ .el-collapse, .partsDetail /deep/ .el-collapse-item__header {
    border: none;
  }

  .partsDetail /deep/ .el-collapse-item__header, .partsDetail /deep/ .el-collapse-item__wrap {
    background-color: transparent;
  }

  /deep/ .el-dialog {
    display: flex;
    flex-direction: column;
    margin: 0 !important;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    /*height:600px;*/
    max-height: calc(100% - 30px);
    max-width: calc(100% - 30px);
  }

  /deep/ .el-dialog .el-dialog__body {
    flex: 1;
    overflow: auto;
  }

  .fileName {
    text-align: center;
    display: inline-block;
    border: 1px solid #DDDDDD;
    background-color: #F5F5F5;
    line-height: 1;
    font-size: 12px;
    padding: 6px 15px;
    border-radius: 3px;
  }

  .lineBlock {
    background-color: #E6F7FF;
    border: #BAE7FF solid 1px;
    padding: 10px 0;
    border-radius: 5px;
    margin: 15px 0;
  }
</style>
