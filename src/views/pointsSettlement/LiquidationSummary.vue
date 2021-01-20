<template>
  <div class="liquidationSummary">
    <div class="areaInfo">
      <span>车站申报管理</span>
      <div class="tableHandle">
        <el-form
          ref="liquidationSummaryForm"
          :model="condition"
          label-width="100px"
          class="form-inline"
        >
          <el-form-item label="示范地区：">
            <el-select size="small" v-model="condition.areas" multiple collapse-tags placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.id"
                :disabled="diabledAreaOption(item.id)"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择年份">
            <el-date-picker size="small" v-model="condition.year" type="year" placeholder="选择年"></el-date-picker>
          </el-form-item>
          <el-button type="primary" size="small" class="search" @click="liquidationSummarySearch">查询</el-button>
          <el-button type="primary" size="small" class="import" @click="liquidationSummarySearch">导出</el-button>
        </el-form>
      </div>
    </div>
    <div class="liquidationSummaryTableForm">
      <div class="liquidationSummaryTable">
        <el-table
          :data="liquidationSummaryTableData"
          :row-class-name="tableRowClassName"
          header-row-class-name="tableHeaderStyle"
          tooltip-effect="dark"
          size="mini"
          :cell-style="{height:'35px',padding:'5px 0px'}"
          style="width: 100%"
          :header-cell-style="{background:'#f8f8f9'}"
        >
          <el-table-column
            width="150"
            prop="area"
            align="center"
            label="示范地区"
            show-overflow-tooltip
          />
          <el-table-column
            width="150"
            prop="areaTotalPoint"
            align="center"
            label="总分"
            show-overflow-tooltip
          />
          <el-table-column
            width="190"
            prop="vehicleBasicScore"
            label="技术创新和产业链建设"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column
            prop="vehicleConfigScore"
            align="center"
            label="应用新技术的车辆推广"
            show-overflow-tooltip
          />
          <el-table-column
            prop="hydrogenStationScore"
            width="160"
            label="氢能供应和加氢站建设"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column prop="policyScore" align="center" label="政策法规环境" show-overflow-tooltip />
        </el-table>
      </div>
    </div>
    <div class="liquidationSummaryCharts">
      <div class="demonstrationAreaChart">
        <v-chart
          ref="demonstrationAreaChart"
          :autoresize="true"
          @click="selectChart"
          :options="demonstrationAreaChartOption"
        ></v-chart>
      </div>
      <div class="integralContribution">
        <div>
          <v-chart :autoresize="true" :options="vehicleCompay"></v-chart>
        </div>
        <div>
          <v-chart :autoresize="true" :options="hydrogenationStationCompay"></v-chart>
        </div>
        <div>
          <v-chart :autoresize="true" :options="partsManufacturers"></v-chart>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import {
  getProvince,
  getStatisticsList,
  getVehicleArea,
  getSiteArea,
  getPartArea,
} from "@/assets/api/liquidationSummary.js";
import "echarts/lib/chart/bar";
import "echarts/lib/component/title";
import "echarts/lib/component/tooltip";
export default {
  name: "LiquidationSummary",
  data() {
    return {
      condition: {
        areas: [""],
      },
      options: [
        {
          name: "全国",
          id: "",
        },
      ],
      demonstrationAreaChartOption: {
        color: ["#3398DB"],
        tooltip: {
          trigger: "axis",
          transitionDuration: 0,
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        title: {
          left: "center",
          text: "示范地区",
          top: 20,
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: [],
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "积分",
          },
        ],
        series: [
          {
            name: "积分",
            type: "bar",
            barWidth: "60%",
            data: [],
          },
        ],
      },
      demonstrationAreaChartCopyData: [],
      vehicleCompay: {
        color: ["#FC6579"],
        tooltip: {
          trigger: "axis",
          transitionDuration: 0,
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        title: {
          left: "center",
          text: "车辆生产企业",
          top: 20,
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: [],
            axisLabel: {
              formatter: function (params) {
                var newParamsName = ""; // 最终拼接成的字符串
                var paramsNameNumber = params.length; // 实际标签的个数
                var provideNumber = 6; // 每行能显示的字的个数
                var rowNumber = Math.ceil(paramsNameNumber / provideNumber); // 换行的话，需要显示几行，向上取整
                /**
                 * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
                 */
                // 条件等同于rowNumber>1
                if (paramsNameNumber > provideNumber) {
                  /** 循环每一行,p表示行 */
                  for (var p = 0; p < rowNumber; p++) {
                    var tempStr = ""; // 表示每一次截取的字符串
                    var start = p * provideNumber; // 开始截取的位置
                    var end = start + provideNumber; // 结束截取的位置
                    // 此处特殊处理最后一行的索引值
                    if (p == rowNumber - 1) {
                      // 最后一次不换行
                      tempStr = params.substring(start, paramsNameNumber);
                    } else {
                      // 每一次拼接字符串并换行
                      tempStr = params.substring(start, end) + "\n";
                    }
                    newParamsName += tempStr; // 最终拼成的字符串
                  }
                } else {
                  // 将旧标签的值赋给新标签
                  newParamsName = params;
                }
                //将最终的字符串返回
                return newParamsName;
              },
            },
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "积分",
          },
        ],
        series: [
          {
            name: "积分",
            type: "bar",
            barWidth: "60%",
            data: [],
          },
        ],
      },
      hydrogenationStationCompay: {
        color: ["#16BBA2"],
        tooltip: {
          trigger: "axis",
          transitionDuration: 0,
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        title: {
          left: "center",
          text: "加氢站公司",
          top: 20,
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: [],
            axisLabel: {
              formatter: function (params) {
                var newParamsName = ""; // 最终拼接成的字符串
                var paramsNameNumber = params.length; // 实际标签的个数
                var provideNumber = 6; // 每行能显示的字的个数
                var rowNumber = Math.ceil(paramsNameNumber / provideNumber); // 换行的话，需要显示几行，向上取整
                /**
                 * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
                 */
                // 条件等同于rowNumber>1
                if (paramsNameNumber > provideNumber) {
                  /** 循环每一行,p表示行 */
                  for (var p = 0; p < rowNumber; p++) {
                    var tempStr = ""; // 表示每一次截取的字符串
                    var start = p * provideNumber; // 开始截取的位置
                    var end = start + provideNumber; // 结束截取的位置
                    // 此处特殊处理最后一行的索引值
                    if (p == rowNumber - 1) {
                      // 最后一次不换行
                      tempStr = params.substring(start, paramsNameNumber);
                    } else {
                      // 每一次拼接字符串并换行
                      tempStr = params.substring(start, end) + "\n";
                    }
                    newParamsName += tempStr; // 最终拼成的字符串
                  }
                } else {
                  // 将旧标签的值赋给新标签
                  newParamsName = params;
                }
                //将最终的字符串返回
                return newParamsName;
              },
            },
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "积分",
          },
        ],
        series: [
          {
            name: "积分",
            type: "bar",
            barWidth: "60%",
            data: [],
          },
        ],
      },
      partsManufacturers: {
        color: ["#55B7FF"],
        tooltip: {
          trigger: "axis",
          transitionDuration: 0,
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        title: {
          left: "center",
          text: "零部件生产企业",
          top: 20,
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: [],
            axisLabel: {
              formatter: function (params) {
                var newParamsName = ""; // 最终拼接成的字符串
                var paramsNameNumber = params.length; // 实际标签的个数
                var provideNumber = 6; // 每行能显示的字的个数
                var rowNumber = Math.ceil(paramsNameNumber / provideNumber); // 换行的话，需要显示几行，向上取整
                /**
                 * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
                 */
                // 条件等同于rowNumber>1
                if (paramsNameNumber > provideNumber) {
                  /** 循环每一行,p表示行 */
                  for (var p = 0; p < rowNumber; p++) {
                    var tempStr = ""; // 表示每一次截取的字符串
                    var start = p * provideNumber; // 开始截取的位置
                    var end = start + provideNumber; // 结束截取的位置
                    // 此处特殊处理最后一行的索引值
                    if (p == rowNumber - 1) {
                      // 最后一次不换行
                      tempStr = params.substring(start, paramsNameNumber);
                    } else {
                      // 每一次拼接字符串并换行
                      tempStr = params.substring(start, end) + "\n";
                    }
                    newParamsName += tempStr; // 最终拼成的字符串
                  }
                } else {
                  // 将旧标签的值赋给新标签
                  newParamsName = params;
                }
                //将最终的字符串返回
                return newParamsName;
              },
            },
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "积分",
          },
        ],
        series: [
          {
            name: "积分",
            type: "bar",
            barWidth: "60%",
            data: [],
          },
        ],
      },
      liquidationSummaryTableData: [],
    };
  },
  methods: {
    //隔行变色
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 == 1) {
        return "grey-row";
      } else {
        return "white-row";
      }
    },
    selectChart(params) {
      let data = JSON.parse(
        JSON.stringify(this.demonstrationAreaChartCopyData)
      );
      data[params.dataIndex] = {
        value: data[params.dataIndex],
        itemStyle: {
          color: "rgba(237, 248, 113, 1)",
        },
      };
      let provinceId = this.liquidationSummaryTableData[params.dataIndex]
        .areaId;
      this.demonstrationAreaChartOption.series[0].data = data;
      this.getVehicleArea(provinceId);
      this.getSiteArea(provinceId);
      this.getPartArea(provinceId);
    },
    //获取获取地区车企积分
    getVehicleArea(provinceId) {
      let data = {
        provinceId: provinceId,
        year: this.condition.year,
      };
      getVehicleArea(data).then((res) => {
        let nameData = [];
        let scoreData = [];
        res.data.forEach((item) => {
          scoreData.push(item.score);
          nameData.push(item.tenantName);
        });
        this.vehicleCompay.xAxis[0].data = nameData;
        this.vehicleCompay.series[0].data = scoreData;
      });
    },
    //获取获取地区加氢站积分
    getSiteArea(provinceId) {
      let data = {
        provinceId: provinceId,
        year: this.condition.year,
      };
      getSiteArea(data).then((res) => {
        let nameData = [];
        let scoreData = [];
        res.data.forEach((item) => {
          scoreData.push(item.score);
          nameData.push(item.tenantName);
        });
        this.hydrogenationStationCompay.xAxis[0].data = nameData;
        this.hydrogenationStationCompay.series[0].data = scoreData;
      });
    },
    //获取获取地区零部件积分
    getPartArea(provinceId) {
      let data = {
        provinceId: provinceId,
        year: this.condition.year,
      };
      getPartArea(data).then((res) => {
        let nameData = [];
        let scoreData = [];
        res.data.forEach((item) => {
          scoreData.push(item.score);
          nameData.push(item.tenantName);
        });
        this.partsManufacturers.xAxis[0].data = nameData;
        this.partsManufacturers.series[0].data = scoreData;
      });
    },
    getStatisticsList() {
      let data;
      if (this.condition.areas.indexOf("") !== 1) {
        data = {
          areas: [],
          year: this.condition.year,
        };
      } else {
        data = {
          areas: this.condition.areas,
          year: this.condition.year,
        };
      }

      getStatisticsList(data).then((res) => {
        this.liquidationSummaryTableData = res.data;
        let nameData = [];
        let scoreData = [];
        res.data.forEach((item) => {
          scoreData.push(item.areaTotalPoint);
          nameData.push(item.area);
        });
        this.demonstrationAreaChartOption.xAxis[0].data = nameData;
        this.demonstrationAreaChartOption.series[0].data = scoreData;
        this.demonstrationAreaChartCopyData = JSON.parse(
          JSON.stringify(scoreData)
        );
        this.selectChart({ dataIndex: 0 });
      });
    },
    liquidationSummarySearch() {
      this.getStatisticsList();
    },
    diabledAreaOption(id) {
      if (this.condition.areas && this.condition.areas.indexOf("") !== -1) {
        if (id !== "") {
          //判断是否是全国
          return true;
        } else {
          return false;
        }
      } else {
        if (this.condition.areas.length > 0) {
          if (id === "") {
            return true;
          } else {
            return false;
          }
        }
      }
    },
  },
  created() {
    getProvince().then((res) => {
      this.options = this.options.concat(res.data);
      this.condition.year = new Date().getFullYear().toString();
      this.getStatisticsList();
    });
  },
};
</script>

<style lang="less" scoped>
/deep/.el-table .grey-row {
  background: #fafafa;
}
/deep/.el-table .white-row {
  background: #ffffff;
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
  .import {
    background: rgba(74, 144, 226, 0.1);
    border-color: #4a90e2;
    color: #4a90e2;
  }
}
.liquidationSummary {
  display: flex;
  width: 100%;
  box-sizing: border-box;
  margin: 0 10px 10px 10px;
  flex-direction: column;
  font-size: 14px;
  .areaInfo {
    height: 50px;
    line-height: 50px;
    color: #303133;
    box-sizing: border-box;
    border-bottom: 1px solid #ebeef5;
    background-color: #ffffff;
    span {
      margin-left: 15px;
      font-weight: 600;
    }
  }
  .liquidationSummaryCharts {
    margin-top: 10px;
    flex-grow: 1;
    min-height: 277px;
    display: flex;
    .echarts {
      height: 100%;
      width: 100%;
    }
    .demonstrationAreaChart {
      height: 100%;
      background-color: #ffffff;
      width: calc(30% - 5px);
    }
    .integralContribution {
      width: calc(70% - 5px);
      margin-left: 10px;
      height: 100%;
      background-color: #ffffff;
      flex-grow: 1;
      > div {
        display: inline-block;
        width: 33.3%;
        height: 100%;
      }
    }
  }
  .liquidationSummaryTableForm {
    background-color: #ffffff;
    .form-inline {
      .el-form-item {
        display: inline-block;
        margin-top: 10px;
        margin-bottom: 10px;
        /deep/label {
          color: #181818;
          font-weight: 600;
        }
        .el-input {
          width: 200px;
        }
        .el-select {
          width: 200px;
        }
      }
    }
    .search {
      margin-left: 10px;
    }
    .import {
      color: #4a90e2;
      background-color: #f4fbff;
      border-color: #bee3ff;
    }
  }
}
</style>