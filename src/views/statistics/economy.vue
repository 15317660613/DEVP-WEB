<template>
  <div>
    <el-row>
      <el-col :span="12">
        <div style="margin-left:10px;background-color:#fff;border:#DCDFE6 solid 1px;border-radius:5px;">
          <div class="tit">氢电里程</div>
          <div class="charts">
            <div id="pieGraph" ref="pieChart" :class="[screen==true ? 'heightS' : 'heightL']"></div>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div style="margin-left:10px;background-color:#fff;border:#DCDFE6 solid 1px;border-radius:5px;">
          <div class="tit">氢耗电耗</div>
          <div class="charts">
            <div id="barGraph" ref="barChart" :class="[screen==true ? 'heightS' : 'heightL']"></div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row style="margin:10px 0 0 0;">
      <el-col :span="8">
        <div style="margin-left:10px;background-color:#fff;border:#DCDFE6 solid 1px;border-radius:5px;">
          <div class="tit">纯氢运行里程</div>
          <div :class="[screen==true ? 'heightS' : 'heightL']" style="display: flex;flex-direction:column;justify-content:space-around;align-items: center;padding: 0 30px">
            <div style="width: 100%;display: flex;justify-content:space-around;align-items: center">
              <div style="width:20%;">
                <img src="@/assets/img/statistics/economy_icon1.jpg" width="100%">
              </div>
              <div style="width: 60%">
                <div style="color:#999;font-size:12px;">里程</div>
                <div style="color:#333;font-size:24px;">{{ hydrogenMileage.mileage | formatNumber}}&nbsp;&nbsp;<span style="font-size:16px;">km</span></div>
              </div>
            </div>
            <div style="width: 100%;display: flex;justify-content:space-around;align-items: center">
              <div style="width:20%;">
                <img src="@/assets/img/statistics/economy_icon2.jpg" width="100%">
              </div>
              <div style="width: 60%">
                <div style="color:#999;font-size:12px;">全网排名</div>
                <div style="color:#333;font-size:24px;">{{ hydrogenMileage.currentRanking | formatNumber}} / {{ hydrogenMileage.sum | formatNumber}}</div>
              </div>
            </div>
          </div>

        </div>
      </el-col>
      <el-col :span="8">
        <div style="margin-left:10px;background-color:#fff;border:#DCDFE6 solid 1px;border-radius:5px;margin-bottom: 10px">
          <div class="tit">总计加氢</div>
          <div :class="[screen==true ? 'heightS1' : 'heightL1']">
            <div style="height: 100%;display: flex;justify-content:space-around;align-items: center;padding: 0 30px 0 50px">
              <div style="width:20%;">
                <img src="@/assets/img/statistics/economy_icon3.jpg" width="100%">
              </div>
              <div style="width:60%;">
                <div style="color:#999;font-size:12px;">总计加氢</div>
                <div style="color:#333;font-size:24px;margin-top:5%;">{{ totalHydrotreating | formatNumber }}&nbsp;&nbsp;<span style="font-size:16px;">kg</span></div>
              </div>
            </div>
          </div>
        </div>
        <div style="margin-left:10px;background-color:#fff;border:#DCDFE6 solid 1px;border-radius:5px;">
          <div class="tit">氢利用率</div>
          <div :class="[screen==true ? 'heightS1' : 'heightL1']">
            <div style="height: 100%;display: flex;justify-content:space-around;align-items: center;padding: 0 30px 0 50px">
              <div style="float:left;width:20%;">
                <img src="@/assets/img/statistics/qlyl.png" width="100%">
              </div>
              <div style="width:60%;">
                <div style="color:#999;font-size:12px;">氢利用率</div>
                <div style="color:#333;font-size:24px;margin-top:5%;">{{ hydrogenUtilization | formatNumber }}&nbsp;&nbsp;<span style="font-size:16px;">%</span></div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div style="margin-left:10px;background-color:#fff;border:#DCDFE6 solid 1px;border-radius:5px;">
          <div class="tit">35MPa / 70MPa</div>
          <div :class="[screen==true ? 'heightS' : 'heightL']">
            <div style="padding:10% 0 0 0" class="clearfix">
              <div style="float:left;width:50%;text-align:center;">
                <img src="@/assets/img/statistics/economy_icon4.jpg" width="35%">
                <div style="color:#999;font-size:12px;">累计35MPa加氢量</div>
                <div style="color:#333;font-size:24px;margin-top:5%;">{{mpaNumber.thirtyFiveMpa | formatNumber}}</div>
              </div>
              <div style="float:left;width:50%;text-align:center;">
                <img src="@/assets/img/statistics/economy_icon5.jpg" width="35%">
                <div style="color:#999;font-size:12px;">累计70MPa加氢量</div>
                <div style="color:#333;font-size:24px;margin-top:5%;">{{mpaNumber.sevenFiveMpa | formatNumber}}</div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
    import Config from "@/assets/js/config.js";
    import {
        getHydrogenElectricMileageChart,
        getHydrogenAndPwoerConsumptionChart,
        getHydrogenMileage,
        getTotalHydrotreating,
        getMpaNumber,
        getHydrogenUtilization
    } from "@/assets/api/economy.js";

    let echarts = require('echarts/lib/echarts');
    require('echarts/lib/chart/bar');
    require('echarts/lib/chart/pie');
    require('echarts/lib/component/tooltip');
    require('echarts/lib/component/title');
    export default {
        name: 'tem2',
        props: ['modelId'],
        data() {
            return {
                screen: this.GLOBAL.screenfun(),
                hydrogenMileage: {},
                totalHydrotreating: 0,
                hydrogenUtilization: '',
                mpaNumber: {},
                echarts11: null,
                echarts22: null
            }
        },
        methods: {
            drawPie(v1, v2, n1, n2) {
                if (!this.echarts11) {
                    this.echarts11 = echarts.init(document.getElementById('pieGraph'));
                }
                this.echarts11.setOption({
                    color: [' #5B8FF9', '#5AD8A6'],
                    tooltip: {
                        trigger: 'item',
                        backgroundColor: '#FFFFFF',
                        textStyle: {
                            color: '#606266'
                        },
                        padding: 0,
                        formatter: function (param) {
                            return '<div style="padding: 5px 10px;box-shadow: 0 0 5px rgba(0,0,0,.2)"><div style="color:#ccc"><span style="display: inline-block;width:10px;height:10px;border-radius: 5px;margin-right:10px;background: ' + param.color + '"></span>' +
                                param.name + '</div>' +
                                '<div style="margin-top: 10px">里程数 ' + param.value + 'km</div>' + '</div>'
                        }
                    },
                    legend: {
                        orient: 'vertical',
                        top: 100,
                        right: 100,
                        icon: 'circle',
                        textStyle: {
                            color: 'rgba(140,140,140,1)'
                        },
                        itemGap: 15
                    },
                    grid: {
                        left: '10%',
                        right: '10%',
                        top: '10%',
                        bottom: '10%'
                    },
                    series: [
                        {
                            name: '',
                            type: 'pie',
                            selectedMode: 'single',
                            center: ['40%', '50%'],
                            radius: ['30%', '80%'],

                            label: {
                                position: 'inner',
                                fontSize: '12',
                                formatter: '{d}%'
                            },
                            labelLine: {
                                show: false
                            },
                            data: [
                                {value: v1, name: "氢里程"},
                                {value: v2, name: "电里程"}
                            ]
                        }
                    ]
                })
            },

            drawBar(value) {
                if (!this.echarts22) {
                    this.echarts22 = echarts.init(document.getElementById('barGraph'));
                }
                this.echarts22.setOption({
                    grid: {
                        left: '10%',
                        right: '10%',
                        top: '10%',
                        bottom: '20%'
                    },
                    xAxis: {
                        type: 'category',
                        data: ['百公里氢耗', '百公里电耗'],
                        axisLine: {
                            lineStyle: {
                                color: '#eee'
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            color: '#333'
                        }
                    },
                    yAxis: {
                        type: 'value',
                        axisLine: {
                            lineStyle: {
                                color: '#eee'
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            color: '#333'
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#eee'
                            }
                        }
                    },
                    series: [{
                        data: value,
                        //data: [120, 200],
                        type: 'bar',
                        barMaxWidth: '10%',
                        itemStyle: {
                            normal: {
                                color: function (params) {
                                    var colorList = ['#5AD8A6', '#5B8FF9'];
                                    return colorList[params.dataIndex]
                                }
                            }
                        }
                    }]
                })
            },

            getHydrogenElectricMileageChart() {
                getHydrogenElectricMileageChart(this.modelId).then(res => {
                    console.log(res);
                    let v1 = res.data.fuelMileage;
                    let v2 = res.data.powerMileage;
                    let n1 = (res.data.fuel).toFixed(2) * 100;
                    let n2 = (res.data.power).toFixed(2) * 100;
                    n1 = Math.round(n1);
                    n2 = Math.round(n2);
                    this.drawPie(v1, v2, n1, n2);
                });
            },

            getHydrogenAndPwoerConsumptionChart() {
                getHydrogenAndPwoerConsumptionChart(this.modelId).then(res => {
                    console.log(res);
                    let v1 = [res.data.hydrogenConsumption, res.data.powerConsumption];
                    this.drawBar(v1);
                });
            },

            // getHydrogenAndPwoerConsumptionChart() {
            //     getHydrogenAndPwoerConsumptionChart().then(res => {
            //         console.log(res);
            //         let v1 = [res.data[0].hydrogenConsumption, res.data[0].powerConsumption];
            //         this.drawBar(v1);
            //     });
            // },

            getHydrogenMileage() {
                getHydrogenMileage().then(res => {
                    this.hydrogenMileage = res.data;
                });
            },

            getTotalHydrotreating() {
                getTotalHydrotreating().then(res => {
                    this.totalHydrotreating = res.data.toFixed(2);
                });
            },

            getMpaNumber() {
                getMpaNumber().then(res => {
                    console.log(res);
                    this.mpaNumber = res.data
                });
            },
            getHydrogenUtilization() {
                getHydrogenUtilization().then((res) => {
                    this.hydrogenUtilization = res.data.utilization * 100;
                })
            },
            init() {
                this.getHydrogenElectricMileageChart();
                this.getHydrogenAndPwoerConsumptionChart();
                this.getHydrogenMileage();
                this.getTotalHydrotreating();
                this.getMpaNumber();
                this.getHydrogenUtilization();
            }
        },
        mounted() {
            this.init();
        },
    }
</script>

<style scoped>
  .tit {
    font-size: 14px;
    font-weight: bold;
    border-bottom: #DCDFE6 solid 1px;
    padding: 10px 10px 10px 15px;
    text-align: left;
  }

  .heightL {
    height: 230px;
  }

  .heightL1 {
    height: 89px;
  }

  .heightS {
    height: 176px;
  }

  .clearfix:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden
  }
</style>
