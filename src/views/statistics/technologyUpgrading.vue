<template>
  <div>
    <el-row>
      <el-col :span="12">
        <div style="margin-left:10px;background-color:#fff;border:#DCDFE6 solid 1px;border-radius:5px;">
          <div class="tit">极化特性曲线</div>
          <div class="charts">
            <div id="draw1Graph" ref="draw1Graph" :class="[screen==true ? 'heightS' : 'heightL']"></div>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div style="margin-left:10px;background-color:#fff;border:#DCDFE6 solid 1px;border-radius:5px;">
          <div class="tit">电堆功率曲线</div>
          <div class="charts">
            <div id="draw2Graph" ref="draw2Graph" :class="[screen==true ? 'heightS' : 'heightL']"></div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row style="margin:10px 0 0 0;">
      <el-col :span="24">
        <div style="margin-left:10px;background-color:#fff;border:#DCDFE6 solid 1px;border-radius:5px;">
          <div class="tit">极化曲线</div>
          <div class="charts">
            <div id="draw3Graph" ref="draw1Graph" :class="[screen==true ? 'heightS' : 'heightL']"></div>
          </div>
        </div>
      </el-col>
      <!--            <el-col :span="12">-->
      <!--              <div style="margin-left:2%;background-color:#fff;border:#DCDFE6 solid 1px;border-radius:5px;">-->
      <!--                <div class="tit">电堆功率曲线</div>-->
      <!--                <div class="charts">-->
      <!--                  <div id="draw4Graph" ref="draw2Graph" :class="[screen==true ? 'heightS' : 'heightL']"></div>-->
      <!--                </div>-->
      <!--              </div>-->
      <!--            </el-col>-->
    </el-row>
  </div>
</template>

<script>
    import {getBaseInformationChart, getPolarizationCurveChart, getStackPowerCurveChart} from "@/assets/api/basicPerformance.js";
    let echarts = require('echarts/lib/echarts');
    export default {
        name: 'baseInfo',
        props: ['modelId'],
        data(){
            return {
                screen: this.GLOBAL.screenfun(),
                echarts51: null,
                echarts52: null,
                echarts53: null
            }
        },
        methods: {
            draw1Graph(value) {
                if(!this.echarts51){
                    this.echarts51 = echarts.init(document.getElementById('draw1Graph'));
                }
                this.echarts51.setOption({
                    color: '#1890FF',
                    xAxis: {
                        name: '电流(A)',
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
                        name: '电压(V)',
                        nameLocation: 'center',
                        nameGap: 30,
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
                    grid: {
                        left: '60',
                        right: '20',
                        top: '20',
                        bottom: '50',
                    },
                    series: [{
                        symbolSize: 10,
                        data: value,
                        type: 'scatter'
                    }]
                })
            },

            draw2Graph(value) {
                if(!this.echarts52){
                    this.echarts52 = echarts.init(document.getElementById('draw2Graph'));
                }
                this.echarts52.setOption({
                    color: '#23C4A1',
                    xAxis: {
                        name: '电流(A)',
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
                        name: '功率(kw)',
                        nameLocation: 'center',
                        nameGap: 50,
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
                    grid: {
                        left: '80',
                        right: '20',
                        top: '20',
                        bottom: '50',
                    },
                    series: [{
                        symbolSize: 10,
                        data: value,
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

            draw3Graph(value) {
                if(!this.echarts53){
                    this.echarts53 = echarts.init(document.getElementById('draw3Graph'));
                }
                this.echarts53.setOption({
                    color: '#1890FF',
                    xAxis: {
                        name: '电流密度(A/cm2)',
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
                        name: '电压(V)',
                        nameLocation: 'center',
                        nameGap: 30,
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
                    grid: {
                        left: '60',
                        right: '20',
                        top: '20',
                        bottom: '50',
                    },
                    series: [{
                        symbolSize: 10,
                        data: value,
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
            getBaseInformationChart() {
                getBaseInformationChart(this.modelId).then(res => {
                    console.log(res);
                    let current = [];
                    if(res.data && res.data.length > 0){
                        res.data.forEach(element => {
                            let voltage = [];
                            voltage.push(element.current);
                            voltage.push(element.voltage);
                            current.push(voltage)
                        });
                    }

                    this.draw1Graph(current);
                    // this.draw3Graph(current);
                    // this.draw2Graph(voltage);
                    // this.draw4Graph(voltage);

                });
            },
            getPolarizationCurveChart(){
                getPolarizationCurveChart(this.modelId).then((res)=>{
                    let current = [];
                    if(res.data && res.data.length > 0){
                        res.data.forEach(element => {
                            let voltage = [];
                            voltage.push(element.currentDensity);
                            voltage.push(element.voltagePower);
                            current.push(voltage)
                        });
                    }

                    this.draw3Graph(current);
                })
            },
            getStackPowerCurveChart(){
                getStackPowerCurveChart(this.modelId).then((res)=>{
                    let current = [];
                    if(res.data && res.data.length > 0){
                        res.data.forEach(element => {
                            let voltage = [];
                            voltage.push(element.current);
                            voltage.push(element.power);
                            current.push(voltage)
                        });
                    }
                    this.draw2Graph(current);
                })
            },
            init(){
                this.getBaseInformationChart();
                this.getPolarizationCurveChart();
                this.getStackPowerCurveChart();
            }
        },
        mounted() {
            this.init();
        }
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
</style>
