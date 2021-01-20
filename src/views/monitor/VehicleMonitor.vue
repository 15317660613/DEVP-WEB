<template>
  <div class="content">
    <el-form :model="modelSearchObj" :inline="true" label-width="80px" @submit.native.prevent>
      <el-input v-model="modelSearchObj.vin" maxlength="200" placeholder="VIN"></el-input>
      <el-input v-model="modelSearchObj.vehicleNum" maxlength="200" placeholder="车牌号"></el-input>
      <el-select v-model="modelSearchObj.vehicleModelId" filterable placeholder="请选择车型号">
        <el-option v-for="item in options" :key="item.id" :label="item.model" :value="item.model"></el-option>
      </el-select>
      <el-button type="primary" @click="searchVehicleList">搜索</el-button>
      <el-button @click="reset">重置</el-button>
    </el-form>
    <el-table
      border
      ref="elTable"
      :data="tableData"
      tooltip-effect="dark"
      height="428"
      size="mini"
      :cell-style="{height:'35px',padding:'5px 0px'}"
      style="width: 100%"
      :header-cell-style="{background:'#f8f8f9'}"
    >
      <el-table-column label="序号" width="50px" align="center">
        <template slot-scope="scope">
          <span>{{scope.$index+(currentPage - 1) * pagesize + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="VIN" align="center" width="180">
        <template slot-scope="scope">
          <a style="cursor: pointer;color: #66b1ff" @click="jumpTo(scope.row)">{{ scope.row.vin }}</a>
        </template>
      </el-table-column>
      <el-table-column prop="vehicleNum" label="车牌号" show-overflow-tooltip align="center"></el-table-column>
      <el-table-column prop="model" label="车型号" show-overflow-tooltip align="center"></el-table-column>
      <el-table-column prop="terminalCode" label="终端编号" show-overflow-tooltip align="center"></el-table-column>
      <el-table-column prop="tenantName" label="运营公司" show-overflow-tooltip align="center"></el-table-column>
      <el-table-column prop="networkDate" label="入网时间" show-overflow-tooltip align="center"></el-table-column>
      <el-table-column prop="zxsj" label="最新数据" show-overflow-tooltip align="center"></el-table-column>
      <el-table-column label="运行状态" show-overflow-tooltip align="center">
        <template slot-scope="scope">{{ scope.row.yxzt | formatYxzt }}</template>
      </el-table-column>
      <el-table-column width="125" label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            @click="popTimePanel(scope.$index,scope.row.vin)"
            size="mini"
          >下载原始报文</el-button>
          <el-date-picker
            style="visibility: hidden;border:none;"
            :ref="scope.row.vin"
            type="daterange"
            value-format="yyyy-MM-dd 00:00:00"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="downloadMessage"
            v-model="selectDate"
          ></el-date-picker>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next,jumper"
        :total="total"
         :current-page="currentPage"
        @current-change="current_change"
        @size-change="size_change"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import Config from "@/assets/js/config.js";
export default {
  name: "VehicleMonitor",
  data() {
    return {
      //搜索条件
      modelSearchObj: {
        vin: "",
        vehicleNum: "",
        vehicleModelId: ""
      },
      searchObj: {
        vin: "",
        vehicleNum: "",
        vehicleModelId: ""
      },
      downLoadVin: "",
      options: [],
      currentPage: 1,
      pagesize: 10,
      total: 0, //总数
      tableData: [],
      maxDate: null,
      selectDate: [] //报文选择日期
    };
  },

  methods: {
    //重置
    reset() {
      this.modelSearchObj = {
        vin: "",
        vehicleNum: "",
        vehicleModelId: ""
      };
      this.searchObj = {
        vin: "",
        vehicleNum: "",
        vehicleModelId: ""
      };
    },
    //兼容ie的格式转换
    newDate(strTime) {
      //解决new Date()IE10不支持参数
      //首先将日期分隔 ，获取到日期部分 和 时间部分
      var day = strTime.split(" ");
      //获取日期部分的年月日
      var days = day[0].split("-");
      //获取时间部分的 时分秒
      var mi = day[day.length - 1].split(":");
      //获取当前date类型日期
      var date = new Date();
      //给date赋值  年月日
      date.setUTCFullYear(days[0], days[1] - 1, days[2]);
      //给date赋值 时分秒  首先转换utc时区 ：+8
      date.setUTCHours(mi[0] - 8, mi[1], mi[2]);
      return date;
    },
    //获取车型信息
    getModelOption() {
      this.$http.post("/baseinfo/vehicle-model/list", {}).then(({ data }) => {
        if (data.code == "200") {
          this.options = data.data;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    getMonitorList() {
      this.$http
        .post("/monitor/monitor-vehicle-page/page", {
          page: {
            current: this.currentPage,
            size: this.pagesize,
            orders: [
              {
                asc: false,
                column: "ID"
              }
            ]
          },
          querys: [
            {
              like: {
                vin: this.searchObj.vin,
                vehicleNum: this.searchObj.vehicleNum,
                model: this.searchObj.vehicleModelId
              }
            }
          ]
        })
        .then(({ data }) => {
          if (data.code == "200") {
            this.tableData = data.data.records;
            this.total = parseInt(data.data.total);
            this.$nextTick(() => {
              this.$refs.elTable.doLayout();
            });
          } else {
            this.$message.error(data.msg);
          }
        });
    },
    searchVehicleList() {
      this.currentPage = 1;
      this.searchObj = JSON.parse(JSON.stringify(this.modelSearchObj));
      this.getMonitorList();
    },
    current_change: function(currentPage) {
      this.currentPage = currentPage;
      this.getMonitorList();
    },
    size_change(size) {
      this.pagesize = size;
      this.getMonitorList();
    },
    jumpTo(row) {
      let menuMonitor = this.$store.state.menu.filter(item => item.id == "2");
      let flag = false;
      if (menuMonitor.length > 0) {
        flag = menuMonitor[0].children.some(item => item.id == "22");
      }
      if (flag) {
        this.$store.commit("addMonitorVehicles", row);
        this.$router.push({
          path: "/monitor/oneVehicleMonitor"
        });
      }
    },
    popTimePanel(index, vin) {
      this.$refs[vin].focus();
      this.downLoadVin = vin;
    },
    downloadMessage(selectDate) {
      let data2 =
        this.newDate(selectDate[1]).getTime() + (24 * 60 * 60 - 1) * 1000;
      if (
        Math.abs(this.newDate(selectDate[0]).getTime() - data2) / 86400000 >
        3
      ) {
        this.$message.error("时间范围不能超过3天！");
        this.selectDate = [];
        return;
      }
      let newSelectDate1 = selectDate[1].substr(0, 10) + " 23:59:59";
      this.$http({
        url: `/monitor/monitor-vehicle-page/downloadMessage?vin=${this.downLoadVin}&start=${selectDate[0]}&end=${newSelectDate1}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json; application/octet-stream"
        },
        responseType: "blob"
      }).then(response => {
        if (response.status == 200) {
          let blob = new Blob([response.data]);
          const ie = navigator.userAgent.match(/MSIE\s([\d.]+)/),
            ie11 =
              navigator.userAgent.match(/Trident\/7.0/) &&
              navigator.userAgent.match(/rv:11/),
            ieEDGE = navigator.userAgent.match(/Edge/g),
            ieVer = ie ? ie[1] : ie11 ? 11 : ieEDGE ? 12 : -1;
          if (ie && ieVer < 10) {
            this.$message.error("不支持ie10一下");
            return;
          }
          if (ieVer > -1) {
            window.navigator.msSaveBlob(blob, this.downLoadVin + ".zip");
          } else {
            let downloadElement = document.createElement("a");
            let href = window.URL.createObjectURL(blob); //创建下载的链接
            downloadElement.href = href;
            downloadElement.download = this.downLoadVin + ".zip"; //下载后文件名
            document.body.appendChild(downloadElement);
            downloadElement.click(); //点击下载
            document.body.removeChild(downloadElement); //下载完成移除元素
            window.URL.revokeObjectURL(href); //释放掉blob对象
          }
        }
        this.selectDate = [];
      });
    }
  },
  filters: {
    formatYxzt: value => {
      if (value === 0) {
        return "离线";
      } else if (value === 1) {
        return "在线";
      } else if (value === -1) {
        return "异常";
      }
    }
  },
  created() {
    this.searchVehicleList();
    this.getModelOption();
  },
  activated() {
    $(window).resize();
  }
};
</script>

<style lang='less' scoped>
.content {
  width: 100%;
  background: #fff;
  padding: 10px;
}
.content .el-table {
  margin-top: 10px;
}
.el-form .el-input {
  width: 200px;
  margin-right: 5px;
}
.el-form .el-select {
  width: 200px;
  margin-right: 5px;
}
// 分页样式
.content .block {
  margin-top: 8px;
}
.el-date-editor {
  height: 0;
  display: flex;
  padding: 0;
}
</style>
