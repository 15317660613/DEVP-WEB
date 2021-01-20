<template>
  <div>
    <el-row>
      <el-col :span="24">
        <div style="margin-left:10px;background-color:#fff;border:#DCDFE6 solid 1px;border-radius:5px;">
          <div class="tit">耐久性</div>
          <div class="charts">
            <div id="draw1Graph" ref="draw1Graph" :class="[screen==true ? 'heightS' : 'heightL']"></div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row style="margin:10px 0 0 0;">
      <el-col :span="24">
        <div style="margin-left:10px;background-color:#fff;border:#DCDFE6 solid 1px;border-radius:5px;">
          <div class="tit">衰减比例</div>
          <div class="charts">
            <div id="draw2Graph" ref="draw1Graph" :class="[screen==true ? 'heightS' : 'heightL']"></div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
    import Config from "@/assets/js/config.js";
    import {getVehicleDurabilityChart} from "@/assets/api/durability.js";

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
                echarts31: null,
                echarts32: null
            }
        },
        methods: {
            draw1Graph(time, data) {
                if(!this.echarts31){
                    this.echarts31 = echarts.init(document.getElementById('draw1Graph'));
                }
                this.echarts31.setOption({
                    color: '#1890FF',
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} : {c}"
                    },
                    xAxis: {
                        type: 'category',
                        //data: ['11:10','11:10','11:10','11:10','11:10','11:10','11:10','11:10','11:11','11:10','11:11','11:10']
                        data: time,
                        name: '时间',
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
                        type: 'value',
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
                        left: '5%',
                        right: '3%',
                        top: '10%',
                        bottom: '20%',
                    },
                    series: [{
                        name: '耐久性',
                        symbolSize: 10,
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
                        data: data,
                        type: 'scatter'
                    }]
                })
            },

            draw2Graph() {
                if(!this.echarts32){
                    this.echarts32 = echarts.init(document.getElementById('draw2Graph'));
                }
                this.echarts32.setOption({
                    title: {
                        subtext: '时间(s)',
                        left: 'center',
                        bottom: '1%',
                    },
                    color:['#409EFF','#6FC246'],
                    tooltip: {
                        trigger: 'axis'
                    },
                    grid: {
                        left: '5%',
                        right: '3%',
                        top: '10%',
                        bottom: '20%',
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: ['0', '200', '400', '600', '800', '1000', '1200'],
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
                        type: 'value',
                        name: '比例值',
                        max: 100,
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
                    series: [
                        {
                            name: '阳极入口压强',
                            type: 'line',
                            data: [20, 32, 11, 34, 9, 23, 10]
                        },
                        {
                            name: '阴极入口压强',
                            type: 'line',
                            data: [20, 12, 91, 34, 90, 30, 10]
                        }
                    ]
                })
            },
            getVehicleDurabilityChart() {
                getVehicleDurabilityChart(this.modelId).then(res => {
                    let time = [];
                    let data = [];
                    if(res.data && res.data.length > 0){
                        res.data.forEach(element => {
                            time.push(element.time);
                            data.push(element.voltage);
                        });
                    }
                    this.draw1Graph(time, data);
                });
            },
            init(){
                this.draw2Graph();
                this.getVehicleDurabilityChart();
            }
        },
        mounted() {
            // this.draw1Graph();
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
    height: 168px;
  }

  .clearfix:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden
  }
</style>
