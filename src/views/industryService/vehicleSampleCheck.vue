<template>
  <div class="flexBlock">
    <div class="content">
      <div class="backgroundColorFFF">
        <div style="margin-bottom: 10px"><span style="font-weight: bold;font-size: 14px;margin-right: 10px">车辆抽检管理</span></div>
        <el-row :gutter="10">
          <el-col :span="3">
            <!--            <span style="margin-left:10px;">车辆类型：</span>-->
            <el-select size="small" v-model="form1.status" placeholder="请选择" style="width:40%">
              <el-option :value="0" label="货运车"></el-option>
            </el-select>
            <span> - </span>
            <el-input-number style="width: 45%" size="small" controls-position="right" v-model="num1" @change="handleChange" :min="0" :max="10000" label="描述文字"></el-input-number>
          </el-col>
          <el-col :span="3">
            <!--            <span style="margin-left:2%;">车辆类型：</span>-->
            <el-select size="small" v-model="form1.status" placeholder="请选择" style="width:40%;">
              <el-option :value="0" label="乘用车"></el-option>
            </el-select>
            <span> - </span>
            <el-input-number style="width: 45%" size="small" controls-position="right" v-model="num2" @change="handleChange" :min="0" :max="10000" label="描述文字"></el-input-number>
          </el-col>
          <el-col :span="3">
            <!--            <span style="margin-left:2%;">车辆类型：</span>-->
            <el-select size="small" v-model="form1.status" placeholder="请选择" style="width:40%;">
              <el-option :value="0" label="客运车"></el-option>
            </el-select>
            <span> - </span>
            <el-input-number style="width: 45%" size="small" controls-position="right" v-model="num3" @change="handleChange" :min="0" :max="10000" label="描述文字"></el-input-number>
          </el-col>
          <el-col :span="7">
            <span style="display:inline;margin-left:10px;">入网时间：</span>
            <el-date-picker size="small" v-model="networkDate" suffix-icon="el-icon-date" type="datetimerange" range-separator="~" start-placeholder="开始时间"
                            end-placeholder="结束时间" style="width: calc(100% - 85px)">
            </el-date-picker>
          </el-col>
          <el-col :span="4">
            <span class="miles">里程数：</span>
            <el-input-number size="small" v-model="odometerOpen" controls-position="right" id="startMile" @change="handleChange" :min="0" :max="10000000" style="width:35%"
                             placeholder="里程数"></el-input-number>
            <span > - </span>
            <el-input-number size="small" v-model="odometerEnd" controls-position="right" id="endMile" @change="handleChange" :min="0" :max="10000000" style="width:35%"
                             placeholder="里程数"></el-input-number>
          </el-col>
          <el-col :span="4">
            <div>
              <el-button size="small" type="primary" @click="startCheck()" id='checkText'>开始抽检</el-button>
              <el-button size="small" type="primary" plain @click="lastCheck()" v-if="lastCheckFlag == false">上次抽检结果</el-button>
              <el-button size="small" type="text" @click="resetCheck()">重置</el-button>
            </div>
          </el-col>
        </el-row>
        <div style="padding-top: 0.8%;display:flex">

        </div>
      </div>
      <div class="contentTable" style="border-radius:5px">
        <el-table :data="tableDataList" border stripe class="table-fixed" style="width: 100%" :max-height="tableHeight" header-row-class-name="tableHeaderStyle">
          <el-table-column prop="carId" label="车辆编号" style="width: 15%">
            <template slot-scope="scope">{{ scope.row.id }}</template>
          </el-table-column>
          <el-table-column prop="carMaker" label="车企" style="width: 10%">
            <template slot-scope="scope">{{ scope.row.tenantName }}</template>
          </el-table-column>
          <el-table-column prop="carType" label="车辆类别" style="width: 10%">
            <template slot-scope="scope">{{ scope.row.vecClass | statusFilter }}</template>
          </el-table-column>
          <el-table-column prop="carTypeNum" label="车型编号" style="width: 10%">
            <template slot-scope="scope">{{ scope.row.model }}</template>
          </el-table-column>
          <el-table-column prop="vin" label="车辆VIN码" style="width: 10%">
            <template slot-scope="scope">{{ scope.row.vin }}</template>
          </el-table-column>
          <el-table-column prop="plateNum" label="车牌号" style="width: 10%">
            <template slot-scope="scope">{{ scope.row.vehicleNum }}</template>
          </el-table-column>
          <!--<el-table-column prop="terminalNum" label="终端编号" style="width: 10%">-->
          <!--<template slot-scope="scope">{{ scope.row.terminalId }}</template>-->
          <!--</el-table-column>-->
        </el-table>
        <div>
          <pagination v-show="total>0" :total="total" :page.sync="queryObj.page.current" :limit.sync="queryObj.page.size"
                      @pagination="pageflag==0?getTableData():lastCheck()"/>
        </div>
      </div>
      <!--<el-dialog :visible.sync="dialogVisible" width="99%" height="75%" style="margin-top:15vh"></el-dialog>-->
    </div>
  </div>
</template>

<script>
    import {getCheckPage, getCheckData, getLastCheckData} from '@/assets/api/vehicleSampleCheck'
    import Pagination from '@/components/common/Pagination'

    export default {
        name: "vehicleSampleCheck",
        filters: {
            statusFilter(type) {
                const keyValue = {
                    1: '货运车',
                    2: '乘用车',
                    3: '客运车'
                };
                return keyValue[type]
            }
        },
        components: {
            Pagination
        },
        data() {
            return {
                form1: {
                    status: 0
                },
                option1: [{
                    value: '0',
                    label: '货运车'
                }],
                option2: [{
                    value: '0',
                    label: '乘用车'
                }],
                option3: [{
                    value: '0',
                    label: '商用车'
                }],
                num1: 5,   //抽检个数
                num2: 5,
                num3: 5,
                odometerOpen: 0,
                odometerEnd: 1000,
                networkDate: '',
                tableData: [],
                tableDataList: [],
                total: 0,
                tableHeight: window.innerHeight - 240,
                queryObj: {
                    page: {
                        current: 1,
                        size: 20,
                    },
                },
                checkData: {
                    vecClassVOList: []
                },
                pageflag: 0,
                //按钮倒计时
                changename: '',
                dialogVisible: false,
                lastCheckFlag: false,
            }
        },
        methods: {
            handleChange(value) {
                console.log(value);
            },
            getTableData() {
                this.pageflag = 0;
                this.tableData = [];
                getCheckPage(this.queryObj).then((data) => {
                    if (data.code === '200') {
                        this.tableData = data.data;
                        this.tableDataList = data.data.records;
                        this.total = parseInt(data.data.total);
                        this.tableData.orders = [{asc: false, column: 'ID'}];
                    } else {
                        this.$message.error(data.msg);
                    }
                })
            },
            startCheck() {
                if (this.odometerOpen > this.odometerEnd) {
                    this.$message({
                        message: '请输入合理的里程范围！',
                        type: 'warning'
                    });
                } else {
                    // this.dialogVisible = true;//出现弹框
                    //支持多次点击
                    this.getTableData();
                    //开始抽检变为倒计时
                    var time = 5000;
                    var flag = 1;
                    var x = setInterval(function () {
                        time = time - 1000;
                        this.changename = "抽检中..." + time / 1000 + "s";
                        document.getElementById('checkText').innerText = this.changename;
                        if (time == 0) {
                            clearInterval(x);
                            setTimeout(() => {
                                this.changename = "开始抽检";
                                document.getElementById('checkText').innerText = this.changename;
                            }, 500)
                        }
                    }, 1000);

                    if (this.networkDate != "") {
                        var d1 = this.networkDate[0];
                        var d2 = this.networkDate[1];
                        var dateStart = this.Datetimeformat(d1);
                        var dateEnd = this.Datetimeformat(d2);
                    } else {
                        var dateStart = "";
                        var dateEnd = "";
                    }

                    // this.checkData.networkDateStart = dateStart;
                    // this.checkData.networkDateEnd = dateEnd;
                    this.checkData.odometerOpen = ""; //记得改过来
                    this.checkData.odometerEnd = ""; //记得改过来
                    this.checkData.vecClassVOList = [];
                    this.checkData.vecClassVOList.push({
                            number: this.num1,
                            vecClass: '1'
                        },
                        {
                            number: this.num2,
                            vecClass: '2'
                        },
                        {
                            number: this.num3,
                            vecClass: '3'
                        },
                    );
                    getCheckData(this.checkData).then((data) => {
                        if (data.code === '200') {
                            // 开始滚动显示
                            var t = setInterval(this.scrollTable, 50);
                            // 刷新表格
                            setTimeout(() => {
                                clearInterval(t);
                                this.tableDataList = data.data;
                                this.lastCheck();
                                loading.close();
                            }, 5000);
                        } else {
                            this.$message.error(data.msg);
                        }
                    })
                }

            },
            //日期格式化
            Datetimeformat(date) {
                var y = date.getFullYear();
                var m = date.getMonth() + 1;
                m = m < 10 ? ('0' + m) : m;
                var d = date.getDate();
                d = d < 10 ? ('0' + d) : d;
                var h = date.getHours();
                h = h < 10 ? ('0' + h) : h;
                var min = date.getMinutes();
                min = min < 10 ? ('0' + min) : min;
                var s = date.getMinutes();
                s = s < 10 ? ('0' + s) : s;
                return y + '-' + m + '-' + d + ' ' + h + ':' + min + ':' + s;
            },
            lastCheck() {
                // alert('上次查询结果');
                getLastCheckData(this.queryObj).then((data) => {
                    this.pageflag = 1;
                    if (data.code === '200') {
                        // 刷新表格
                        this.tableData = data.data;
                        this.tableDataList = data.data.records;
                        // this.pageSync = this.lastCheckData.page.current;
                        // this.limitSync = this.lastCheckData.page.size;
                        this.total = parseInt(data.data.total);
                        // loading.close();
                    } else {
                        this.$message.error(data.msg);
                    }
                })
            },
            //重置
            resetCheck() {
                this.pageSync = this.queryObj.page.current;
                this.limitSync = this.queryObj.page.size;
                this.option1 = [{
                    value: '0',
                    label: '货运车'
                }],
                    this.option2 = [{
                        value: '0',
                        label: '乘用车'
                    }],
                    this.option3 = [{
                        value: '0',
                        label: '商用车'
                    }],
                    this.num1 = 5,   //抽检个数
                    this.num2 = 5,
                    this.num3 = 5,
                    this.odometerOpen = 0,
                    this.odometerEnd = 1000,
                    this.networkDate = '',
                    this.checkData = {
                        networkDateStart: '',
                        networkDateEnd: '',
                    },
                    this.getTableData();
            },
            //表格滚动效果
            scrollTable() {
                var tmp = this.tableDataList.shift();//删掉第一行数据并返回
                this.tableDataList.push(tmp);//将第一行数据存到末尾
            }
        },
        mounted() {
            //默认加载表格
            this.getTableData();
            this.$nextTick(function () {
                // 监听窗口大小变化
                let self = this;
                window.onresize = function () {
                    self.tableHeight = window.innerHeight - 240
                }
            })
        },
    }
</script>

<style scoped>
  .flexBlock {
    display: flex;
    flex-grow: 1;
    min-width: 1900px;
  }

  .content {
    width: 100%;
    height: 100%;
    overflow: auto;
  }

  .contentTable {
    margin: 0 10px;
    background-color: #FFF;
    height: calc(100% - 98px);
    position: relative;
    padding: 0 15px;
  }

  .backgroundColorFFF {
    font-size: 14px;
    background-color: #fff;
    margin: 0 10px 0 10px;
    padding: 15px 15px 0 15px;
  }

  .table-fixed /deep/ .el-table__fixed-right {
    height: 100% !important;
  }

  .table-fixed /deep/ .el-table__fixed {
    height: 100% !important;
  }

  /deep/ .el-table__body tr,
  /deep/ .el-table__body td {
    padding: 0;
    height: 45px;
  }

  /*表格文字居中*/
  /deep/ .el-table th > .cell {
    text-align: center;
  }

  /deep/ .el-table .cell {
    text-align: center;
  }

  .miles {
    display: inline;
    margin-left: 4.6%;
  }

  /*抽检个数*/
  /deep/.el-input-number {
    /*width: 60px;*/
    /*line-height: 20px;*/
  }
  /*/deep/.el-input-number /deep/.el-input__inner {*/
  /*  -webkit-appearance: none;*/
  /*  padding-left: 10px;*/
  /*  padding-right: 10px;*/
  /*  text-align: center;*/
  /*}*/
  /*/deep/.el-input-number__increase {*/
  /*  margin-top: 10px;*/
  /*  border-radius: 0;*/
  /*  left: 68px;*/
  /*  border: 1px solid #DCDFE6;*/
  /*}*/
  /*/deep/.el-input-number__decrease {*/
  /*  margin-top: 10px;*/
  /*  border-radius: 0;*/
  /*  left: 95px;*/
  /*  border: 1px solid #DCDFE6;*/
  /*}*/
  /*/deep/.el-input-number__decrease, /deep/.el-input-number__increase {*/
  /*  width: 20px;*/
  /*  height: 20px;*/
  /*}*/
  /*!*公里数计数器*!*/
  /*/deep/.el-input-number.is-controls-right .el-input-number__increase {*/
  /*  border-radius: 0 4px 0 0;*/
  /*  border-bottom: 1px solid #DCDFE6;*/
  /*  border-top: none;*/
  /*  border-right: none;*/
  /*  margin-top: 0px;*/
  /*  background: #fff;*/
  /*  left:85.5%;*/
  /*  width: 26px;*/
  /*  height: 20px;*/
  /*}*/

  /*/deep/.el-input-number.is-controls-right .el-input-number__decrease {*/
  /*  background: #fff;*/
  /*  border-left: 1px solid #DCDFE6;*/
  /*  border-bottom: none;*/
  /*  border-right: none;*/
  /*  border-radius: 0 0 4px;*/
  /*  left:85.5%;*/
  /*  width: 26px;*/
  /*  height: 20px;*/
  /*}*/
  /deep/ .el-dialog {
    margin-top: 21vh;
    height: 80%;
  }

  @media screen and (max-width: 1600px) {
    .flexBlock {
      min-width: 1330px;
      overflow: auto;
    }

    .miles {
      display: inline;
      margin-left: 5.6%;
    }

    /*公里数计数器*/
    /deep/ .el-input-number.is-controls-right .el-input-number__increase {
      border-radius: 0 4px 0 0;
      border-bottom: 1px solid #DCDFE6;
      border-top: none;
      border-right: none;
      margin-top: 0px;
      background: #fff;
      left: 85.5%;
      width: 18px;
      height: 20px;
    }

    /deep/ .el-input-number.is-controls-right .el-input-number__decrease {
      background: #fff;
      border-left: 1px solid #DCDFE6;
      border-bottom: none;
      border-right: none;
      border-radius: 0 0 4px;
      left: 85.5%;
      width: 18px;
      height: 20px;
    }
  }
</style>
