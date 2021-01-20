<template>
  <div>
    <el-row>
      <el-col :span="24">
        <div style="margin-left:10px;background-color:#fff;border:#DCDFE6 solid 1px;border-radius:5px;">
          <div class="tit">低温冷启动</div>
          <div class="charts">
            <div id="draw1Graph" ref="draw1Graph" :class="[screen==true ? 'heightS1' : 'heightL1']"></div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row style="margin:10px 0 0 0;">
      <el-col :span="8">
        <div style="margin-left:10px;background-color:#fff;border:#DCDFE6 solid 1px;border-radius:5px;">
          <div class="tit">冬季氢电里程</div>
          <div class="charts">
            <div id="pieGraph" ref="pieChart" :class="[screen==true ? 'heightS' : 'heightL']"></div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div style="margin-left:10px;background-color:#fff;border:#DCDFE6 solid 1px;border-radius:5px;margin-bottom: 10px">
          <div class="tit">冬季总计加氢</div>
          <div :class="[screen==true ? 'heightS2' : 'heightL2']">
            <div class="clearfix" style="height: 100%;display: flex;justify-content:space-around;align-items: center;padding: 0 30px">
              <div style="width:20%;">
                <img src="@/assets/img/statistics/economy_icon3.jpg" width="100%">
              </div>
              <div style="margin-left:5%;">
                <div style="color:#999;font-size:12px;">冬季总计加氢</div>
                <div style="color:#333;font-size:24px;margin-top:5%;">{{ totalHydrogenationInWinter | formatNumber}}&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size:16px;">kg</span></div>
              </div>
            </div>
          </div>
        </div>
        <div style="margin-left:10px;background-color:#fff;border:#DCDFE6 solid 1px;border-radius:5px;">
          <div class="tit">冬季氢利用率</div>
          <div :class="[screen==true ? 'heightS2' : 'heightL2']">
            <div class="clearfix" style="height: 100%;display: flex;justify-content:space-around;align-items: center;padding: 0 30px">
              <div style="float:left;width:20%;">
                <img src="@/assets/img/statistics/qlyl.png" width="100%">
              </div>
              <div style="fmargin-left:5%;">
                <div style="color:#999;font-size:12px;">冬季氢利用率</div>
                <div style="color:#333;font-size:24px;margin-top:5%;">{{ hydrogenUtilizationInWinter | formatNumber}}&nbsp;&nbsp;<span style="font-size:16px;">%</span></div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div style="margin-left:10px;background-color:#fff;border:#DCDFE6 solid 1px;border-radius:5px;">
          <div class="tit">冬季纯氢运行里程</div>
          <div :class="[screen==true ? 'heightS' : 'heightL']">
            <div style="padding:10% 0 0 0" class="clearfix">
              <div style="float:left;width:50%;text-align:center;">
                <img src="@/assets/img/statistics/economy_icon1.jpg" width="35%">
                <div style="color:#999;font-size:12px;">里程</div>
                <div style="color:#333;font-size:24px;margin-top:5%;">{{winterHydrogenOperatingMileage.hydrogenOperatingMileageInWinter | formatNumber}}km</div>
              </div>
              <div style="float:left;width:50%;text-align:center;">
                <img src="@/assets/img/statistics/economy_icon2.jpg" width="35%">
                <div style="color:#999;font-size:12px;">排名</div>
                <div style="color:#333;font-size:24px;margin-top:5%;">{{winterHydrogenOperatingMileage.currentRanking | formatNumber}} / {{winterHydrogenOperatingMileage.sum | formatNumber}}</div>
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
        getLowTemperatureStartUp,
        getWinterHydrogenMileage,
        getTotalHydrogenationInWinter,
        getWinterHydrogenOperatingMileage,
        getHydrogenUtilizationInWinter
    } from "@/assets/api/coldStart.js";

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
                totalHydrogenationInWinter: '',
                winterHydrogenOperatingMileage: '',
                hydrogenUtilizationInWinter: '',
                echarts41: null,
                echarts42: null
            }
        },
        methods: {
            draw1Graph(data, time) {
                if(!this.echarts41){
                    this.echarts41 = echarts.init(document.getElementById('draw1Graph'));
                }
                this.echarts41.setOption({
                    color: '#1890FF',
                    xAxis: {
                        type: 'value',
                        // data: time,
                        name: '温度（℃）',
                        nameLocation: 'center',
                        nameGap: 25,
                        nameTextStyle: {
                            color: '#606266',
                            fontSize: '12',
                            padding: [0, 0, 0, 0]
                        },
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
                    yAxis: {
                        type: 'category',
                        name: '启动时间',
                        nameLocation: 'center',
                        nameGap: 45,
                        data: time,
                        nameTextStyle: {
                            color: '#999',
                            fontSize: '12',
                            padding: [0, 0, 0, 0]
                        },
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
                        },
                        inverse: true
                    },
                    grid: {
                        left: '6%',
                        right: '3%',
                        top: '10%',
                        bottom: '20%',
                    },
                    series: [{
                        symbolSize: 10,
                        data: data,
                        // data: [
                        //     [10.0, 8.04],
                        //     [8.0, 6.95],
                        //     [13.0, 7.58],
                        //     [9.0, 8.81],
                        //     [11.0, 8.33],
                        //     [14.0, 9.96],
                        //     [6.0, 7.24],
                        //     [4.0, 4.26],
                        //     [12.0, 10.84],
                        //     [7.0, 4.82],
                        //     [5.0, 5.68]
                        // ],
                        type: 'scatter'
                    }]
                })
            },

            drawPie(v1, v2, n1, n2) {
                if(!this.echarts42){
                    this.echarts42 = echarts.init(document.getElementById('pieGraph'));
                }
                this.echarts42.setOption({
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
                        right: 50,
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
            getLowTemperatureStartUp() {
                getLowTemperatureStartUp(this.modelId).then(res => {
                    let time = [];
                    let data = [];
                    if(res.data && res.data.length > 0){
                        res.data.forEach(element => {
                            time.push(element.time);
                            data.push(element.temperature);
                        });
                    }
                    this.draw1Graph(data, time);
                });
            },
            getWinterHydrogenMileage() {
                getWinterHydrogenMileage(this.modelId).then(res => {
                    console.log(res);
                    let v1 = res.data.hydrogenMileage;
                    let v2 = res.data.powerMileage;
                    this.drawPie(v1, v2);
                });
            },
            getTotalHydrogenationInWinter() {
                getTotalHydrogenationInWinter(this.modelId).then((res) => {
                    this.totalHydrogenationInWinter = res.data
                })
            },
            getWinterHydrogenOperatingMileage() {
                getWinterHydrogenOperatingMileage(this.modelId).then((res) => {
                    this.winterHydrogenOperatingMileage = res.data
                })
            },
            getHydrogenUtilizationInWinter(){
                getHydrogenUtilizationInWinter(this.modelId).then((res)=>{
                    this.hydrogenUtilizationInWinter = res.data.utilization * 100
                })
            },
            init(){
                this.getLowTemperatureStartUp();
                this.getWinterHydrogenMileage();
                this.getTotalHydrogenationInWinter();
                this.getWinterHydrogenOperatingMileage();
                this.getHydrogenUtilizationInWinter();
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

  .heightS {
    height: 176px;
  }

  .heightL1 {
    height: 230px;
  }

  .heightL2 {
    height: 89px;
  }

  .heightS1 {
    height: 376px;
  }

  .clearfix:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden
  }
</style>
