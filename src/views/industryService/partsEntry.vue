<template>
  <div class="container">
    <div class="content">
      <div style="width: 215px;position: absolute;top: 0;bottom:0;left: 15px;padding-top: 15px;border-right: 1px solid #EBEEF5;">
        <div style="font-weight: bold;font-size: 14px">零部件准入审核</div>
        <div class="nav">
          <div v-for='(item, index) in lbjList' :class="{active:istrue==index}" @click="toggleLBJ(index, item.id)">{{item.name}}</div>
        </div>
      </div>
      <div class="table-wrapper">
        <div style="float: left"><span style="font-weight: bold;font-size: 14px;margin-right: 10px">{{lbjList[istrue].name}}</span> <span
          style="color:#8F9399;font-size: 12px;letter-spacing: 2px">
        已选择{{selitme}}项</span>
        </div>
        <div class="tool-btn-group">
          <el-button type="normal" size="mini" @click="agreeBatch">批量同意</el-button>
          <el-button size="mini" @click="refuseBatch">批量驳回</el-button>
          <!--          <el-button size="mini" @click="startProcess">撤回</el-button>-->
          <el-checkbox v-model="checked" style="margin-left: 10px" @change="filterStatus">未审核</el-checkbox>
          <div style="float: right;margin-left: 10px">
            <el-input placeholder="请输入生产企业" v-model.trim="model" class="input-with-select" size="mini">
              <el-button slot="append" icon="el-icon-search" size="mini" type="primary" @click="handleFilter">搜索</el-button>
            </el-input>
          </div>
        </div>
        <el-table :data="tableData" border style="width: 100%" stripe class="table-fixed" @selection-change="handleSelectionChange"
                  header-row-class-name="tableHeaderStyle" :max-height="tableHeight">
          <el-table-column label="" type="selection" align="center" width="55"></el-table-column>
          <el-table-column v-for='(item, index) in tableHeader' :prop="item.id" :label="item.name" align="center" min-width="120"></el-table-column>
          <el-table-column label="状态" align="center" min-width="120" fixed="right">
            <template slot-scope="{row}">
              {{row.status | statusFilter1}}
            </template>
          </el-table-column>
          <el-table-column label="当前审批状态" align="center" min-width="120" fixed="right">
            <template slot-scope="{row}">
              <span class="statusCircle" v-if="row.status===3" style="background-color: #B6B6B6"></span>
              <span class="statusCircle" v-if="row.status===1" style="background-color: #00B589"></span>
              <span class="statusCircle" v-if="row.status===2" style="background-color: #FD472B"></span>
              <span class="statusCircle" v-if="row.status===0" style="background-color: #3391EC"></span>
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
              <el-input v-model="scope.row.msg" placeholder="请输入内容" :disabled="scope.row.status===1 || scope.row.status===2"></el-input>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="queryObj.current" :limit.sync="queryObj.size"
                    @pagination="getLBJList()"/>
      </div>

      <el-dialog class="abow_dialog" title="驳回原因" v-if="dialogVisible" :visible.sync="dialogVisible" :modal-append-to-body="false" width="360px">
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
  </div>
</template>

<script>
    import {
        getComponentType,
        getComponentListHeader,
        getComponentListByPage,
        addComponent,
        deleteComponent,
        getComponentDetail,
        editComponent
    } from '@/assets/api/stationDeclaration'
    import {getComponentBacklogList} from '@/assets/api/approval'
    import {completeTaskBatch, getProgressImageData} from '@/assets/api/process'
    import Pagination from '@/components/common/Pagination'
    import {mapState} from 'vuex'

    export default {
        name: "parts",
        components: {
            Pagination
        },
        filters: {
            statusFilter(type) {
                const keyValue = {
                    0: '待审核',
                    1: '批准',
                    2: '拒绝',
                    3: '草稿'
                };
                return keyValue[type]
            },
            statusFilter1(type) {
                if (type === 1 || type === 2) {
                    return '已审批'
                } else {
                    return '未审批'
                }
            }
        },
        data() {
            return {
                istrue: 0,
                lbjList: [],
                tableData: [],
                tableHeader: [],
                componentTemp: [],
                total: 0,
                queryObj: {
                    current: 1,
                    size: 10,
                    pid: '',
                    searchName: '',
                    status: ''
                },
                temp: {
                    id: '',
                    property: [],
                    type: ''
                },
                model: '',
                dialogVisible: false,
                uploadFlag: '',
                multipleSelection: [],
                selitme: 0,
                dialogStatus: '',
                textMap: {
                    update: '修改零部件',
                    create: '新增零部件',
                    view: '查看零部件详情'
                },
                checked: false,
                reason: '',
                progressImageList: [],
                tableHeight: window.innerHeight - 206,
                tableFixedHeight: ''
            }
        },
        computed: {
            ...mapState({
                userId: state => state.userId
            }),
        },
        mounted() {
            this.init();
            this.$nextTick(function () {
                // 监听窗口大小变化
                let self = this;
                window.onresize = function () {
                    self.tableHeight = window.innerHeight - 206
                }
            })
        },
        methods: {
            async init() {
                await this.getComponentType();
                this.getTableHeader();
                this.getLBJList();
            },
            resetQuery() {
                this.queryObj.current = 1;
                this.queryObj.size = 10;
                this.queryObj.searchName = '';
            },
            handleFilter() {
                this.queryObj.current = 1;
                this.queryObj.searchName = this.model;
                this.getLBJList()
            },
            async getComponentType() {
                await getComponentType().then((res) => {
                    this.lbjList = res.data;
                    this.temp.type = res.data[0].id;
                    this.queryObj.pid = res.data[0].id;
                })
            },
            getTableHeader(data) {
                getComponentListHeader(this.queryObj.pid).then((res) => {
                    this.tableHeader = res.data.filter((item, index) => {
                        return item.type !== '4';
                    });
                    this.temp.property = [];
                    this.componentTemp = [];
                    for (let i = 0; i < res.data.length; i++) {
                        if (res.data[i].type === '4') {
                            this.componentTemp[this.componentTemp.length - 1].children = [{id: res.data[i].id, value: '', name: res.data[i].name, type: res.data[i].type}]
                        }
                        this.componentTemp.push({id: res.data[i].id, value: '', name: res.data[i].name, type: res.data[i].type, dropDownData: res.data[i].dropDownData});
                        this.temp.property.push({id: res.data[i].id, value: '', name: res.data[i].name})
                    }
                })
            },
            getLBJList() {
                this.tableData = [];
                getComponentBacklogList(this.queryObj).then((res) => {
                    this.total = parseInt(res.data.total);
                    if (res.data.records.length > 0) {
                        for (let i = 0; i < res.data.records.length; i++) {
                            let tableObj = {};
                            tableObj.id = res.data.records[i].id;
                            tableObj.transcationId = res.data.records[i].transcationId;
                            tableObj.status = res.data.records[i].status;
                            tableObj.radio = res.data.records[i].status === 1 ? 'agree' : res.data.records[i].status === 2 ? 'rollback' : '';
                            let tableObjItem = res.data.records[i]['property'];
                            if (tableObjItem.length > 0) {
                                for (let j = 0; j < tableObjItem.length; j++) {
                                    tableObj[tableObjItem[j]['id']] = tableObjItem[j]['value'];
                                }
                            }
                            this.tableData.push(tableObj);
                            setTimeout(()=>{
                                this.changeTableFiexdHeight();
                            },500)
                        }
                        console.log(this.tableData)
                    }
                })
            },
            toggleLBJ(index, pid) {
                this.istrue = index;
                this.queryObj = {
                    current: 1,
                    size: 10,
                    pid: pid,
                    searchName: ''
                };
                this.temp.type = pid;
                this.tableData = [];
                this.getTableHeader({pid: pid});
                this.getLBJList();
            },
            handleCreate() {
                this.dialogVisible = true;
                this.dialogStatus = 'create';
                for (let i = 0; i < this.temp.properties.length; i++) {
                    this.temp.property[i].value = '';
                }
            },
            isUpload(item) {
                if (item.children) {
                    return true;
                } else {
                    return false;
                }
            },
            addComponent() {
                for (let i = 0; i < this.temp.property.length; i++) {
                    if (this.temp.property[i].value === '') {
                        return this.$message.error(this.temp.property[i].name + '不能为空')
                    }
                }
                addComponent(this.temp).then(() => {
                    this.resetQuery();
                    this.getLBJList();
                    this.dialogVisible = false;
                    return this.$message({
                        message: '新增成功',
                        type: 'success'
                    });
                })
            },
            uploadSuccess(res, file, fileList) {
                if (res.ok) {
                    this.$message.success("上传成功")
                    for (let i = 0; i < this.temp.property.length; i++) {
                        if (this.temp.property[i].id === this.uploadFlag) {
                            this.temp.property[i].value = res.data.id + ';' + res.data.name;
                        }
                    }
                } else {
                    this.$message.error(res.message)
                }
            },
            changeUploadFileId(id) {
                this.uploadFlag = id;
            },
            handleSelectionChange: function (val) {
                this.selitme = val.length;
                this.multipleSelection = val;
            },
            handleEdit(index, row) {
                this.dialogStatus = 'update';
                getComponentDetail(row.id, this.queryObj.pid).then((res) => {
                    this.dialogVisible = true;
                    this.temp.id = res.data.id;
                    this.temp.property = res.data.property;
                    this.temp.type = res.data.type;
                    // debugger
                })
            },
            updateComponent() {
                for (let i = 0; i < this.temp.property.length; i++) {
                    if (this.temp.property[i].value === '') {
                        return this.$message.error(this.temp.property[i].name + '不能为空')
                    }
                }
                editComponent(this.temp).then(() => {
                    // this.resetQuery();
                    this.getLBJList();
                    this.dialogVisible = false;
                    return this.$message({
                        message: '修改成功',
                        type: 'success'
                    });
                })
            },
            viewDetail(index, row) {
                this.dialogStatus = 'view';
                getComponentDetail(row.id, this.queryObj.pid).then((res) => {
                    this.dialogVisible = true;
                    this.temp.id = res.data.id;
                    this.temp.property = res.data.property;
                    this.temp.type = res.data.type;
                })
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
                    this.queryObj.status = 1;
                    this.getLBJList()
                }else{
                    this.queryObj.status = 2;
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
            changeTableFiexdHeight(){
                let fixedHeaderHeight = document.getElementsByClassName("el-table--scrollable-x")[0].getElementsByClassName("el-table__fixed-body-wrapper")[0].offsetTop + 5;
                document.getElementsByClassName("el-table--scrollable-x")[0].getElementsByClassName("el-table__fixed-body-wrapper")[0].style.maxHeight =
                    "calc(100% - " + fixedHeaderHeight + "px)"
            },
        }
    }
</script>

<style scoped>
  .container {
    width: 100%;
  }

  .content {
    margin: 0 10px 10px 10px;
    background-color: #FFF;
    height: calc(100% - 10px);
    /*padding: 20px 30px;*/
    position: relative;
  }

  .table-wrapper {
    margin-left: 245px;
    padding-top: 15px;
    margin-right: 30px;
  }

  .table-wrapper .tool-btn-group {
    float: right;
    margin-bottom: 10px;
  }

  .nav {
    font-size: 14px;
    width: 200px;
    position: absolute;
    top: 43px;
    bottom: 0;
    left: 0;
    background-color: rgba(248, 248, 248, 0.4);
  }

  .nav div {
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
    box-sizing: border-box;
    cursor: pointer;
  }

  .nav .active {
    background: rgba(74, 144, 226, 0.1);
    border-right: 5px solid #4A90E2;
    color: #4A90E2;
  }

  .table-fixed /deep/ .el-table__fixed-right {
    height: 100% !important;
  }

  .table-fixed /deep/ .el-table__fixed {
    height: 100% !important;
  }

  .el-form .el-form-item {
    margin-bottom: 10px;
  }

  .el-form .el-form-item .el-input {
    vertical-align: top;
    width: 58%;
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

  .lineBlock {
    background-color: #E6F7FF;
    border: #BAE7FF solid 1px;
    padding: 10px 0;
    border-radius: 5px;
    margin: 15px 0;
  }

  /deep/ .el-upload-list.el-upload-list--text {
    width: 145px;
    overflow: hidden;
    text-overflow: ellipsis;
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

  /deep/ .el-dialog__header {
    border: 1px solid #eee;
  }

  .tips-content{
    font-size: 12px;
  }
</style>
