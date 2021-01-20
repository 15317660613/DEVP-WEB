<template>
  <div class="flexBlock">
    <div class="content">
      <el-row style="display: flex">
        <el-col :span="8" style="flex: 1">
          <div style="position: relative;height: 100%">
            <img src="@/assets/img/statistics/car1.png" width="100%" height="100%" style="min-width:440px;position: absolute;z-index: 0">

            <img v-if="featureId===0" src="@/assets/img/statistics/car1.png" width="100%" height="100%" style="min-width:440px;position: absolute;z-index: 1">
            <img v-if="featureId===1" src="@/assets/img/statistics/car2.png" width="100%" height="100%" style="min-width:440px;position: absolute;z-index: 1">
            <img v-if="featureId===3" src="@/assets/img/statistics/car3.png" width="100%" height="100%" style="min-width:440px;position: absolute;z-index: 1">
            <img v-if="featureId===2" src="@/assets/img/statistics/car4.png" width="100%" height="100%" style="min-width:440px;position: absolute;z-index: 1">
            <img v-if="featureId===4" src="@/assets/img/statistics/car5.png" width="100%" height="100%" style="min-width:440px;position: absolute;z-index: 1">
            <div style="position:absolute;width:100%;left:0;top:0;padding:15px;z-index: 999">
              <el-select v-model="vehicleModelId" size="small" placeholder="请选择车辆型号" clearable style="width:40%;heigth:30px;">
                <el-option
                  v-for="item in modelList"
                  :key="item.id"
                  :label="item.model"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-button type="primary" style="margin-left:10px" size="small" @click="searchData">查询</el-button>
            </div>
            <div style="z-index: 999;position:absolute;width: 20%; height: 50px; left: 12%; top: 24%; cursor: pointer;" @click="goBase"></div>
            <div style="z-index: 999;position:absolute;width: 20%; height: 50px; right: 4%; top: 30%; cursor: pointer;" @click="goEconomy"></div>
            <div style="z-index: 999;position:absolute;width: 20%; height: 50px; left: 9%; bottom: 9%; cursor: pointer;" @click="featureId=2"></div>
            <div style="z-index: 999;position:absolute;width: 20%; height: 50px; right: 15%; bottom: 14%; cursor: pointer;" @click="featureId=3"></div>
            <div style="z-index: 999;position:absolute;width: 20%; height: 50px; left: 40%; top: 15%; cursor: pointer;" @click="featureId=4"></div>
          </div>
        </el-col>
        <el-col :span="16">
          <BaseInfo ref="baseInfo" :modelId="vehicleModelId" v-if="featureId===0"></BaseInfo>
          <Economy ref="economy" :modelId="vehicleModelId" v-if="featureId===1"></Economy>
          <Durability ref="durability" :modelId="vehicleModelId" v-if="featureId===2"></Durability>
          <ColdStart ref="coldStart" :modelId="vehicleModelId" v-if="featureId===3"></ColdStart>
          <Safety ref="safety" :modelId="vehicleModelId" v-if="featureId===4"></Safety>
        </el-col>
      </el-row>

      <el-row class="height200" style="margin-top: 10px">
        <el-col :span="18">
          <div style="padding-bottom:10px;background-color:#fff;border:#DCDFE6 solid 1px;border-radius:5px;">
            <div class="tit">优化潜力</div>
            <el-row :gutter="10" style="margin-top:10px;padding: 0 10px">
              <el-col :span="12">
                <div class="box1">
                  <div class="charts">
                    <div id="darw1Graph" :class="[screen==true ? 'heightS' : 'heightL']"></div>
                  </div>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="box1">
                  <div class="charts">
                    <div id="darw2Graph" :class="[screen==true ? 'heightS' : 'heightL']"></div>
                  </div>
                </div>
              </el-col>
            </el-row>

            <el-row :gutter="10" style="padding: 0 10px">
              <el-col :span="12">
                <div class="box1" style="margin-top:10px">
                  <div class="charts">
                    <div id="darw3Graph" :class="[screen==true ? 'heightS' : 'heightL']"></div>
                  </div>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="box1" style="margin-top:10px">
                  <div class="charts">
                    <div id="darw4Graph" :class="[screen==true ? 'heightS' : 'heightL']"></div>
                  </div>
                </div>
              </el-col>
            </el-row>


          </div>
        </el-col>
        <el-col :span="6">
          <div style="margin-left:2%;background-color:#fff;border:#DCDFE6 solid 1px;border-radius:5px;">
            <div class="tit" style="padding:2% 2% 2% 4%">各个因素百分比</div>
            <div class="charts">
              <div id="draw5Graph" :class="[screen==true ? 'heightSall' : 'heightLall']"></div>
            </div>
          </div>
        </el-col>
      </el-row>


      <el-row :gutter="10" style="background-color:#fff;padding:10px;margin-top:10px;">
        <el-col :span="24">
          <div style="font-size:16px;font-weight:bold;color:#333;">问题定位</div>
        </el-col>
        <el-col :span="8">
          <div style="margin:10px 0 0 0;background-color:#fff;border:#DCDFE6 solid 1px;border-radius:5px;">
            <div class="tit">能耗占比</div>
            <div class="charts">
              <div id="bottom1Graph" class="heightS"></div>
            </div>
          </div>

        </el-col>
        <el-col :span="8">
          <div style="margin:10px 0 0 0;background-color:#fff;border:#DCDFE6 solid 1px;border-radius:5px;">
            <div class="tit">阳极压力</div>
            <div class="charts">
              <div id="bottom2Graph" class="heightS"></div>
            </div>
          </div>

        </el-col>
        <el-col :span="8">
          <div style="margin:10px 0 0 0;background-color:#fff;border:#DCDFE6 solid 1px;border-radius:5px;">
            <div class="tit">阴极压力</div>
            <div class="charts">
              <div id="bottom3Graph" class="heightS"></div>
            </div>
          </div>

        </el-col>

        <el-col :span="8">
          <div style="margin:10px 0 0 0;background-color:#fff;border:#DCDFE6 solid 1px;border-radius:5px;">
            <div class="tit">极差</div>
            <div class="charts">
              <div id="bottom4Graph" class="heightS"></div>
            </div>
          </div>

        </el-col>
        <el-col :span="8">
          <div style="margin:10px 0 0 0;background-color:#fff;border:#DCDFE6 solid 1px;border-radius:5px;">
            <div class="tit">电堆电压限值过高</div>
            <div class="charts">
              <div id="bottom5Graph" class="heightS"></div>
            </div>
          </div>

        </el-col>
        <el-col :span="8">
          <div style="margin:10px 0 0 0;background-color:#fff;border:#DCDFE6 solid 1px;border-radius:5px;">
            <div class="tit">电堆电压限值过低</div>
            <div class="charts">
              <div id="bottom6Graph" class="heightS"></div>
            </div>
          </div>

        </el-col>

        <el-col :span="8">
          <div style="margin:10px 0 0 0;background-color:#fff;border:#DCDFE6 solid 1px;border-radius:5px;">
            <div class="tit">出口冷却液温度过高</div>
            <div class="charts">
              <div id="bottom7Graph" class="heightS"></div>
            </div>
          </div>

        </el-col>
        <el-col :span="8">
          <div style="margin:10px 0 0 0;background-color:#fff;border:#DCDFE6 solid 1px;border-radius:5px;">
            <div class="tit">出口冷却液温度过低</div>
            <div class="charts">
              <div id="bottom8Graph" class="heightS"></div>
            </div>
          </div>

        </el-col>
        <el-col :span="8">
          <div style="margin:10px 0 0 0;background-color:#fff;border:#DCDFE6 solid 1px;border-radius:5px;">
            <div class="tit">入口冷却液温度过高</div>
            <div class="charts">
              <div id="bottom9Graph" class="heightS"></div>
            </div>
          </div>

        </el-col>

        <el-col :span="8">
          <div style="margin:10px 0 0 0;background-color:#fff;border:#DCDFE6 solid 1px;border-radius:5px;">
            <div class="tit">入口冷却液温度过低</div>
            <div class="charts">
              <div id="bottom10Graph" class="heightS"></div>
            </div>
          </div>

        </el-col>
        <el-col :span="8">
          <div style="margin:10px 0 0 0;background-color:#fff;border:#DCDFE6 solid 1px;border-radius:5px;">
            <div class="tit">出入口温差过大</div>
            <div class="charts">
              <div id="bottom11Graph" class="heightS"></div>
            </div>
          </div>

        </el-col>
        <el-col :span="8">
          <div style="margin:10px 0 0 0;background-color:#fff;border:#DCDFE6 solid 1px;border-radius:5px;">
            <div class="tit">空气进气温度过高</div>
            <div class="charts">
              <div id="bottom12Graph" class="heightS"></div>
            </div>
          </div>

        </el-col>

        <el-col :span="8">
          <div style="margin:10px 0 0 0;background-color:#fff;border:#DCDFE6 solid 1px;border-radius:5px;">
            <div class="tit">单体电池电压差过大</div>
            <div class="charts">
              <div id="bottom13Graph" class="heightS"></div>
            </div>
          </div>

        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
    import Config from "@/assets/js/config.js";
    import {
        getOpHydrogenConsumption,
        getOpDurability,
        getOpColdStart,
        getOpPowerBatteryPowerRatio,
        getOpFactorPercentage,
        getPlAnodePressur,
        getPlCathodePressure,
        getPlVeryPoor,
        getPlVoltageLimitTooHigh,
        getPlVoltageLimitTooLow,
        getPlOutletCoolantTemperatureIsTooHigh,
        getPlOutletCoolantTemperatureIsTooLow,
        getPlInletCoolantTemperatureIsTooHigh,
        getPlInletCoolantTemperatureIsTooLow,
        getPlLetTemperatureDifferenceTooBig,
        getPlAirIntakeTemperatureIsTooHigh,
        getPlBatteryVoltageDifferenceTooBig,
        getPlEnergyConsumption
    } from "@/assets/api/technologyUpgrading.js";
    import {getModelListByPage} from '@/assets/api/stationDeclaration'
    import BaseInfo from './technologyUpgrading';
    import Economy from './economy'
    import Durability from './durability'
    import ColdStart from './coldStart'
    import Safety from './safety'

    let echarts = require('echarts/lib/echarts');
    require('echarts/lib/chart/bar');
    require('echarts/lib/chart/pie');
    require('echarts/lib/component/tooltip');
    require('echarts/lib/component/title');
    export default {
        name: 'tem2',
        components: {
            BaseInfo,
            Economy,
            Durability,
            ColdStart,
            Safety
        },
        data() {
            return {
                screen: this.GLOBAL.screenfun(),
                activeTabName: 'first',
                vehicleEnterpriseId: '',
                vehicleModelId: '',
                featureId: 0,
                modelList: [],
                echarts1: null,
                echarts2: null,
                echarts3: null,
                echarts4: null,
                echarts5: null,
                echarts6: null,
                echarts7: null,
                echarts8: null,
                echarts9: null,
                echarts10: null,
                echarts11: null,
                echarts12: null,
                echarts13: null,
                echarts14: null,
                echarts15: null,
                echarts16: null,
                echarts17: null,
                echarts18: null
            }
        },
        methods: {
            getModelList() {
                getModelListByPage({querys: [{eq: {status: 1}}]}).then((res) => {
                    this.modelList = res.data.records;
                })
            },
            goBase() {
                this.$nextTick(() => {
                    this.featureId = 0
                })
            },
            goEconomy() {
                this.$nextTick(() => {
                    this.featureId = 1
                })
            },
            draw1(data1, data2, xlist) {
                console.log(this.echarts1)
                // 基于dom，初始化echarts实例
                if (!this.echarts1) {
                    this.echarts1 = echarts.init(document.getElementById('darw1Graph'));
                }
                // 绘制图表
                this.echarts1.setOption({
                    color: ['#479EF8', '#FF614C'],
                    title: {
                        text: '百公里氢耗优化潜力',
                        textStyle: {
                            fontSize: 14
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#283b56'
                            }
                        }
                    },
                    legend: {
                        x: 'right',
                        data: ['优化效果']
                    },
                    grid: {
                        left: '50',
                        right: '50',
                        top: '60',
                        bottom: '20'
                    },

                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: true,
                            //data: ['当前水平', '国际先进水平', '国际先进水平']
                            data: xlist,
                            nameTextStyle: {
                                color: '#333'
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
                                show: false
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            scale: true,
                            name: 'kg/100km',
                            max: 100,
                            min: 0,
                            boundaryGap: [0.2, 0.2],
                            nameTextStyle: {
                                color: '#333'
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
                                    color: '#eee',
                                    type: 'dashed'
                                }
                            }
                        },
                        {
                            type: 'value',
                            scale: true,
                            name: '',
                            max: 100,
                            min: 0,
                            axisLabel: {
                                show: true,
                                color: '#333',
                                interval: 'auto',
                                formatter: '{value}%'
                            },
                            boundaryGap: [0.2, 0.2],
                            nameTextStyle: {
                                color: '#333'
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#eee'
                                }
                            },
                            axisTick: {
                                show: false
                            },
                            splitLine: {
                                show: true,
                                lineStyle: {
                                    color: '#eee',
                                    type: 'dashed'
                                }
                            }
                        }
                    ],
                    series: [
                        {
                            name: '',
                            type: 'bar',
                            yAxisIndex: 0,
                            //data: [10,20,50]
                            data: data1,
                            barMaxWidth: '20%',
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: true,		//开启显示
                                        position: 'top',	//在上方显示
                                        textStyle: {	    //数值样式
                                            color: 'black',
                                            fontSize: 16
                                        }
                                    }
                                }
                            }
                        },
                        {
                            name: '优化效果',
                            type: 'line',
                            yAxisIndex: 1,
                            //data: [1,2,50]
                            data: data2
                        }
                    ]

                })
            },

            draw2(data1, data2, xlist) {
                // 基于dom，初始化echarts实例
                if (!this.echarts2) {
                    this.echarts2 = echarts.init(document.getElementById('darw2Graph'));
                }
                // 绘制图表
                this.echarts2.setOption({
                    color: ['#479EF8', '#FF614C'],
                    title: {
                        text: '耐久性优化潜力',
                        textStyle: {
                            fontSize: 14
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#283b56'
                            }
                        }
                    },
                    legend: {
                        x: 'right',
                        data: ['优化效果']
                    },
                    grid: {
                        left: '50',
                        right: '50',
                        top: '60',
                        bottom: '20'
                    },

                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: true,
                            //data: ['当前水平', '国际先进水平', '国际先进水平']
                            data: xlist,
                            nameTextStyle: {
                                color: '#333'
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
                                show: false
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            scale: true,
                            name: '小时',
                            max: 100,
                            min: 0,
                            boundaryGap: [0.2, 0.2],
                            nameTextStyle: {
                                color: '#333'
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
                                    color: '#eee',
                                    type: 'dashed'
                                }
                            }
                        },
                        {
                            type: 'value',
                            scale: true,
                            name: '',
                            max: 100,
                            min: 0,
                            axisLabel: {
                                show: true,
                                color: '#333',
                                interval: 'auto',
                                formatter: '{value}%'
                            },
                            boundaryGap: [0.2, 0.2],
                            nameTextStyle: {
                                color: '#333'
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#eee'
                                }
                            },
                            axisTick: {
                                show: false
                            },
                            splitLine: {
                                show: false
                            }
                        }
                    ],
                    series: [
                        {
                            name: '',
                            type: 'bar',
                            yAxisIndex: 0,
                            barMaxWidth: '20%',
                            //data: [10,20,50]
                            data: data1,
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: true,		//开启显示
                                        position: 'top',	//在上方显示
                                        textStyle: {	    //数值样式
                                            color: 'black',
                                            fontSize: 16
                                        }
                                    }
                                }
                            }
                        },
                        {
                            name: '优化效果',
                            type: 'line',
                            yAxisIndex: 1,
                            //data: [1,2,50]
                            data: data2
                        }
                    ]

                })
            },

            draw3(data1, data2, xlist) {
                // 基于dom，初始化echarts实例
                if (!this.echarts3) {
                    this.echarts3 = echarts.init(document.getElementById('darw3Graph'));
                }
                // 绘制图表
                this.echarts3.setOption({
                    color: ['#479EF8', '#FF614C'],
                    title: {
                        text: '低温冷启动优化潜力',
                        textStyle: {
                            fontSize: 14
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#283b56'
                            }
                        }
                    },
                    legend: {
                        x: 'right',
                        data: ['优化效果']
                    },
                    grid: {
                        left: '50',
                        right: '50',
                        top: '60',
                        bottom: '20'
                    },

                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: true,
                            //data: ['当前水平', '国际先进水平', '国际先进水平']
                            data: xlist,
                            nameTextStyle: {
                                color: '#333'
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
                                show: false
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            scale: true,
                            name: '秒',
                            max: 100,
                            min: 0,
                            boundaryGap: [0.2, 0.2],
                            nameTextStyle: {
                                color: '#333'
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
                                    color: '#eee',
                                    type: 'dashed'
                                }
                            }
                        },
                        {
                            type: 'value',
                            scale: true,
                            name: '',
                            max: 100,
                            min: 0,
                            axisLabel: {
                                show: true,
                                color: '#333',
                                interval: 'auto',
                                formatter: '{value}%'
                            },
                            boundaryGap: [0.2, 0.2],
                            nameTextStyle: {
                                color: '#333'
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#eee'
                                }
                            },
                            axisTick: {
                                show: false
                            },
                            splitLine: {
                                show: false
                            }
                        }
                    ],
                    series: [
                        {
                            name: '',
                            type: 'bar',
                            yAxisIndex: 0,
                            barMaxWidth: '20%',
                            //data: [10,20,50]
                            data: data1,
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: true,		//开启显示
                                        position: 'top',	//在上方显示
                                        textStyle: {	    //数值样式
                                            color: 'black',
                                            fontSize: 16
                                        }
                                    }
                                }
                            }
                        },
                        {
                            name: '优化效果',
                            type: 'line',
                            yAxisIndex: 1,
                            //data: [1,2,50]
                            data: data2
                        }
                    ]

                })
            },
            draw4(data1, data2, xlist) {
                // 基于dom，初始化echarts实例
                if (!this.echarts4) {
                    this.echarts4 = echarts.init(document.getElementById('darw4Graph'));
                }
                // 绘制图表
                this.echarts4.setOption({
                    color: ['#479EF8', '#FF614C'],
                    title: {
                        text: '动力电池功率占比优化潜力',
                        textStyle: {
                            fontSize: 14
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#283b56'
                            }
                        }
                    },
                    legend: {
                        x: 'right',
                        data: ['优化效果']
                    },
                    grid: {
                        left: '50',
                        right: '50',
                        top: '60',
                        bottom: '20'
                    },

                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: true,
                            //data: ['当前水平', '国际先进水平', '国际先进水平']
                            data: xlist,
                            nameTextStyle: {
                                color: '#333'
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
                                show: false
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            scale: true,
                            name: '%',
                            max: 100,
                            min: 0,
                            boundaryGap: [0.2, 0.2],
                            nameTextStyle: {
                                color: '#333'
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
                                    color: '#eee',
                                    type: 'dashed'
                                }
                            }
                        },
                        {
                            type: 'value',
                            scale: true,
                            name: '',
                            max: 100,
                            min: 0,
                            axisLabel: {
                                show: true,
                                color: '#333',
                                interval: 'auto',
                                formatter: '{value}%'
                            },
                            boundaryGap: [0.2, 0.2],
                            nameTextStyle: {
                                color: '#333'
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#eee'
                                }
                            },
                            axisTick: {
                                show: false
                            },
                            splitLine: {
                                show: false
                            }
                        }
                    ],
                    series: [
                        {
                            name: '',
                            type: 'bar',
                            yAxisIndex: 0,
                            barMaxWidth: '20%',
                            //data: [10,20,50]
                            data: data1,
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: true,		//开启显示
                                        position: 'top',	//在上方显示
                                        textStyle: {	    //数值样式
                                            color: 'black',
                                            fontSize: 16
                                        }
                                    }
                                }
                            }
                        },
                        {
                            name: '优化效果',
                            type: 'line',
                            yAxisIndex: 1,
                            //data: [1,2,50]
                            data: data2
                        }
                    ]

                })
            },
            draw5(data, xlist) {
                // 基于dom，初始化echarts实例
                if (!this.echarts5) {
                    this.echarts5 = echarts.init(document.getElementById('draw5Graph'));
                }
                // 绘制图表
                this.echarts5.setOption({
                    title: {
                        text: '影响因素',
                        top: '28%',
                        textAlign: "center",
                        left: "49%",
                        textStyle: {
                            color: '#606266',
                            fontSize: 22,
                            fontWeight: '400'
                        }
                    },
                    color: ['#479EF8', '#00E6CA', '#10EC00', '#E2D000', '#E60041', '#8D00E7', '#1879E0'],
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b}: {c} ({d}%)'
                    },
                    legend: {
                        orient: 'vertical',
                        height: 50,
                        left: '25%',
                        bottom: '20%',
                        itemGap: 20,
                        icon: 'circle',
                        itemWidth: 10,
                        itemHeight: 10,
                        //data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
                        data: xlist
                    },
                    series: [
                        {
                            name: '影响因素',
                            type: 'pie',
                            center: ['50%', '30%'],
                            radius: ['40%', '55%'],
                            avoidLabelOverlap: false,
                            label: {
                                show: true,
                                position: 'inside',
                                formatter: '{d}%'
                            },
                            emphasis: {
                                label: {
                                    show: false,
                                    fontSize: '30',
                                    fontWeight: 'bold'
                                }
                            },
                            labelLine: {
                                show: false
                            },
                            itemStyle: {
                                normal: {
                                    borderColor: '#FFF',
                                    borderWidth: 5
                                }
                            },
                            // data: [
                            //     {value: 335, name: '直接访问'},
                            //     {value: 310, name: '邮件营销'},
                            //     {value: 234, name: '联盟广告'},
                            //     {value: 135, name: '视频广告'},
                            //     {value: 1548, name: '搜索引擎'}
                            // ]
                            data: data
                        }
                    ]

                })
            },
            drawBottom1Graph(name, block, value) {
                if (!this.echarts6) {
                    this.echarts6 = echarts.init(document.getElementById('bottom1Graph'));
                }
                this.echarts6.setOption({
                    title: {
                        subtext: '耗能(kwh)',
                        left: 'center',
                        bottom: '1%',
                    },
                    grid: {
                        left: 50,
                        right: 50,
                        top: 50,
                        bottom: 20
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        },
                        formatter: function (params) {
                            var tar = params[1];
                            return tar.name + ' : ' + tar.value;
                        }
                    },
                    grid: {
                        x: '18%',
                        y: 20,
                        x2: 20,
                        y2: 50 //距离下边的距离
                    },
                    xAxis: {
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
                    yAxis: {
                        type: 'category',
                        splitLine: {show: false},
                        data: name,
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
                        // splitLine: {
                        //     show: true,
                        //     lineStyle: {
                        //         color: '#eee'
                        //     }
                        // }
                        //data: ['高压水泵', '电池包', '低压附件…', '空气压缩机', '驱动电机', '驱动电机']
                    },
                    series: [
                        {
                            name: '',
                            type: 'bar',
                            stack: '总量',
                            itemStyle: {
                                barBorderColor: 'rgba(0,0,0,0)',
                                color: 'rgba(0,0,0,0)'
                            },
                            emphasis: {
                                itemStyle: {
                                    barBorderColor: 'rgba(0,0,0,0)',
                                    color: 'rgba(0,0,0,0)'
                                }
                            },
                            data: block
                            //data: [0, 1700, 1400, 1200, 300, 0]
                        },
                        {
                            name: '',
                            type: 'bar',
                            stack: '总量',
                            label: {
                                show: true,
                                position: 'top'
                            },
                            data: value
                            //data: [2900, 1200, 300, 200, 900, 300],
                        }
                    ]
                })
            },
            drawBottom2Graph(data, xlist) {
                if (!this.echarts7) {
                    this.echarts7 = echarts.init(document.getElementById('bottom2Graph'));
                }
                this.echarts7.setOption({
                    color: ['#479EF8'],
                    grid: {
                        x: 50,
                        y: 40,
                        x2: 20,
                        y2: 30 //距离下边的距离
                    },
                    xAxis: {
                        type: 'category',
                        //data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                        data: xlist,
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
                        name: 'kpa',
                        nameTextStyle: {
                            color: '#333'
                        },
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
                        //data: [820, 932, 901, 934, 1290, 1330, 1320],
                        data: data,
                        type: 'line'
                    }]
                })
            },
            drawBottom3Graph(data, xlist) {
                if (!this.echarts8) {
                    this.echarts8 = echarts.init(document.getElementById('bottom3Graph'));
                }
                this.echarts8.setOption({
                    color: ['#00E6CA'],
                    grid: {
                        x: 50,
                        y: 40,
                        x2: 20,
                        y2: 30 //距离下边的距离
                    },
                    xAxis: {
                        type: 'category',
                        //data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                        data: xlist,
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
                        name: 'kpa',
                        type: 'value',
                        nameTextStyle: {
                            color: '#333'
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
                    series: [{
                        //data: [820, 932, 901, 934, 1290, 1330, 1320],
                        data: data,
                        type: 'line'
                    }]
                })
            },
            drawBottom4Graph(data, xlist) {
                if (!this.echarts9) {
                    this.echarts9 = echarts.init(document.getElementById('bottom4Graph'));
                }
                this.echarts9.setOption({
                    color: ['#FFF100'],
                    grid: {
                        x: 50,
                        y: 40,
                        x2: 20,
                        y2: 30 //距离下边的距离
                    },
                    xAxis: {
                        type: 'category',
                        //data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                        data: xlist,
                        nameTextStyle: {
                            color: '#333'
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
                        name: 'kpa',
                        type: 'value',
                        nameTextStyle: {
                            color: '#333'
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
                    series: [{
                        //data: [820, 932, 901, 934, 1290, 1330, 1320],
                        data: data,
                        type: 'line'
                    }]
                })
            },
            drawBottom5Graph(data, xlist) {
                if (!this.echarts10) {
                    this.echarts10 = echarts.init(document.getElementById('bottom5Graph'));
                }
                this.echarts10.setOption({
                    color: ['#E60041'],
                    grid: {
                        x: 50,
                        y: 40,
                        x2: 20,
                        y2: 30 //距离下边的距离
                    },
                    xAxis: {
                        type: 'category',
                        //data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                        data: xlist,
                        nameTextStyle: {
                            color: '#333'
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
                        name: 'v',
                        type: 'value',
                        nameTextStyle: {
                            color: '#333'
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
                    series: [{
                        //data: [820, 932, 901, 934, 1290, 1330, 1320],
                        data: data,
                        type: 'line'
                    }]
                })
            },
            drawBottom6Graph(data, xlist) {
                if (!this.echarts11) {
                    this.echarts11 = echarts.init(document.getElementById('bottom6Graph'));
                }
                this.echarts11.setOption({
                    color: ['#10EC00'],
                    grid: {
                        x: 50,
                        y: 40,
                        x2: 20,
                        y2: 30 //距离下边的距离
                    },
                    xAxis: {
                        type: 'category',
                        //data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                        data: xlist,
                        nameTextStyle: {
                            color: '#333'
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
                        name: 'v',
                        nameTextStyle: {
                            color: '#333'
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
                    series: [{
                        //data: [820, 932, 901, 934, 1290, 1330, 1320],
                        data: data,
                        type: 'line'
                    }]
                })
            },
            drawBottom7Graph(data, xlist) {
                if (!this.echarts12) {
                    this.echarts12 = echarts.init(document.getElementById('bottom7Graph'));
                }
                this.echarts12.setOption({
                    color: ['#FF0000'],
                    grid: {
                        x: 50,
                        y: 40,
                        x2: 20,
                        y2: 30 //距离下边的距离
                    },
                    xAxis: {
                        type: 'category',
                        //data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                        data: xlist,
                        nameTextStyle: {
                            color: '#333'
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
                        name: '℃',
                        type: 'value',
                        nameTextStyle: {
                            color: '#333'
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
                    series: [{
                        //data: [820, 932, 901, 934, 1290, 1330, 1320],
                        data: data,
                        type: 'line'
                    }]
                })
            },
            drawBottom8Graph(data, xlist) {
                if (!this.echarts13) {
                    this.echarts13 = echarts.init(document.getElementById('bottom8Graph'));
                }
                this.echarts13.setOption({
                    color: ['#479EF8'],
                    grid: {
                        x: 50,
                        y: 40,
                        x2: 20,
                        y2: 30 //距离下边的距离
                    },
                    xAxis: {
                        type: 'category',
                        //data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                        data: xlist,
                        nameTextStyle: {
                            color: '#333'
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
                        name: '℃',
                        nameTextStyle: {
                            color: '#333'
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
                    series: [{
                        //data: [820, 932, 901, 934, 1290, 1330, 1320],
                        data: data,
                        type: 'line'
                    }]
                })
            },
            drawBottom9Graph(data, xlist) {
                if (!this.echarts14) {
                    this.echarts14 = echarts.init(document.getElementById('bottom9Graph'));
                }
                this.echarts14.setOption({
                    color: ['#FF0000'],
                    grid: {
                        x: 50,
                        y: 40,
                        x2: 20,
                        y2: 30 //距离下边的距离
                    },
                    xAxis: {
                        type: 'category',
                        //data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                        data: xlist,
                        nameTextStyle: {
                            color: '#333'
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
                        name: '℃',
                        nameTextStyle: {
                            color: '#333'
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
                    series: [{
                        //data: [820, 932, 901, 934, 1290, 1330, 1320],
                        data: data,
                        type: 'line'
                    }]
                })
            },
            drawBottom10Graph(data, xlist) {
                if (!this.echarts15) {
                    this.echarts15 = echarts.init(document.getElementById('bottom10Graph'));
                }
                this.echarts15.setOption({
                    color: ['#1879E0'],
                    grid: {
                        x: 50,
                        y: 40,
                        x2: 20,
                        y2: 30 //距离下边的距离
                    },
                    xAxis: {
                        type: 'category',
                        //data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                        data: xlist,
                        nameTextStyle: {
                            color: '#333'
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
                        name: 'kpa',
                        nameTextStyle: {
                            color: '#333'
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
                    series: [{
                        //data: [820, 932, 901, 934, 1290, 1330, 1320],
                        data: data,
                        type: 'line'
                    }]
                })
            },
            drawBottom11Graph(data, xlist) {
                if (!this.echarts16) {
                    this.echarts16 = echarts.init(document.getElementById('bottom11Graph'));
                }
                this.echarts16.setOption({
                    color: ['#FACD89'],
                    grid: {
                        x: 50,
                        y: 40,
                        x2: 20,
                        y2: 30 //距离下边的距离
                    },
                    xAxis: {
                        type: 'category',
                        //data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                        data: xlist,
                        nameTextStyle: {
                            color: '#333'
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
                        name: '℃',
                        nameTextStyle: {
                            color: '#333'
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
                    series: [{
                        //data: [820, 932, 901, 934, 1290, 1330, 1320],
                        data: data,
                        type: 'line'
                    }]
                })
            },
            drawBottom12Graph(data, xlist) {
                if (!this.echarts17) {
                    this.echarts17 = echarts.init(document.getElementById('bottom12Graph'));
                }
                this.echarts17.setOption({
                    color: ['#FF0000'],
                    grid: {
                        x: 50,
                        y: 40,
                        x2: 20,
                        y2: 30 //距离下边的距离
                    },
                    xAxis: {
                        type: 'category',
                        //data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                        data: xlist,
                        nameTextStyle: {
                            color: '#333'
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
                        name: '℃',
                        nameTextStyle: {
                            color: '#333'
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
                    series: [{
                        //data: [820, 932, 901, 934, 1290, 1330, 1320],
                        data: data,
                        type: 'line'
                    }]
                })
            },
            drawBottom13Graph(data, xlist) {
                if (!this.echarts18) {
                    this.echarts18 = echarts.init(document.getElementById('bottom13Graph'));
                }
                this.echarts18.setOption({
                    color: ['#FACD89'],
                    grid: {
                        x: 50,
                        y: 40,
                        x2: 20,
                        y2: 30 //距离下边的距离
                    },
                    xAxis: {
                        type: 'category',
                        //data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                        data: xlist,
                        nameTextStyle: {
                            color: '#333'
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
                        name: 'v',
                        nameTextStyle: {
                            color: '#333'
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
                    series: [{
                        //data: [820, 932, 901, 934, 1290, 1330, 1320],
                        data: data,
                        type: 'line'
                    }]
                })
            },
            getOpHydrogenConsumption(p1, p2) {
                getOpHydrogenConsumption(p1, p2).then(res => {
                    let xlist = [];
                    let data1 = [];
                    let data2 = [];
                    if (res.code == '200') {
                        res.data.forEach(element => {
                            xlist.push(element.name);
                            data1.push(element.value);
                            data2.push(element.optimizationEffect);
                        });
                    }
                    this.draw1(data1, data2, xlist);
                });
            },

            getOpDurability(p1, p2) {
                getOpDurability(p1, p2).then(res => {
                    let xlist = [];
                    let data1 = [];
                    let data2 = [];
                    if (res.code == '200') {
                        res.data.forEach(element => {
                            xlist.push(element.name);
                            data1.push(element.value);
                            data2.push(element.optimizationEffect);
                        });
                    }
                    this.draw2(data1, data2, xlist);
                });
            },

            getOpColdStart(p1, p2) {
                getOpColdStart(p1, p2).then(res => {
                    let xlist = [];
                    let data1 = [];
                    let data2 = [];
                    if (res.code == '200') {
                        res.data.forEach(element => {
                            xlist.push(element.name);
                            data1.push(element.value);
                            data2.push(element.optimizationEffect);
                        });
                    }
                    this.draw3(data1, data2, xlist);
                });
            },

            getOpPowerBatteryPowerRatio(p1, p2) {
                getOpPowerBatteryPowerRatio(p1, p2).then(res => {
                    let xlist = [];
                    let data1 = [];
                    let data2 = [];
                    if (res.code == '200') {
                        res.data.forEach(element => {
                            xlist.push(element.name);
                            data1.push(element.value);
                            data2.push(element.optimizationEffect);
                        });
                    }
                    this.draw4(data1, data2, xlist);
                });
            },

            getOpFactorPercentage(p1, p2) {
                // getOpFactorPercentage(p1, p2).then(res => {
                let xlist = ['百公里氢耗', '耐久性', '低温冷启动', '动力电池功率占比'];
                let data1 = [{value: 18, name: '百公里氢耗'}, {value: 26, name: '耐久性'}, {value: 42, name: '低温冷启动'}, {value: 14, name: '动力电池功率占比'}];
                // if (res.code == '200') {
                //     res.data.forEach(element => {
                //         xlist.push(element.name);
                //         data1.push({'value': element.percentage, 'name': element.name},);
                //     });
                // }
                this.draw5(data1, xlist);
                // });
            },

            getPlAnodePressur(p1, p2) {
                getPlAnodePressur(p1, p2).then(res => {
                    let xlist = [];
                    let data1 = [];
                    if (res.code == '200' && res.data && res.data.length > 0) {
                        res.data.forEach(element => {
                            xlist.push(element.xaxis);
                            data1.push(element.yaxis);
                        });
                    }
                    this.drawBottom2Graph(data1, xlist);
                });
            },

            getPlCathodePressure(p1, p2) {
                getPlCathodePressure(p1, p2).then(res => {
                    let xlist = [];
                    let data1 = [];
                    if (res.code == '200' && res.data && res.data.length > 0) {
                        res.data.forEach(element => {
                            xlist.push(element.xaxis);
                            data1.push(element.yaxis);
                        });
                    }
                    this.drawBottom3Graph(data1, xlist);
                });
            },

            getPlVeryPoor(p1, p2) {
                getPlVeryPoor(p1, p2).then(res => {
                    let xlist = [];
                    let data1 = [];
                    if (res.code == '200' && res.data && res.data.length > 0) {
                        res.data.forEach(element => {
                            xlist.push(element.xaxis);
                            data1.push(element.yaxis);
                        });
                    }
                    this.drawBottom4Graph(data1, xlist);
                });
            },

            getPlVoltageLimitTooHigh(p1, p2) {
                getPlVoltageLimitTooHigh(p1, p2).then(res => {
                    let xlist = [];
                    let data1 = [];
                    if (res.code == '200' && res.data && res.data.length > 0) {
                        res.data.forEach(element => {
                            xlist.push(element.xaxis);
                            data1.push(element.yaxis);
                        });
                    }
                    this.drawBottom5Graph(data1, xlist);
                });
            },

            getPlVoltageLimitTooLow(p1, p2) {
                getPlVoltageLimitTooLow(p1, p2).then(res => {
                    let xlist = [];
                    let data1 = [];
                    if (res.code == '200' && res.data && res.data.length > 0) {
                        res.data.forEach(element => {
                            xlist.push(element.xaxis);
                            data1.push(element.yaxis);
                        });
                    }
                    this.drawBottom6Graph(data1, xlist);
                });
            },

            getPlOutletCoolantTemperatureIsTooHigh(p1, p2) {
                getPlOutletCoolantTemperatureIsTooHigh(p1, p2).then(res => {
                    let xlist = [];
                    let data1 = [];
                    if (res.code == '200' && res.data && res.data.length > 0) {
                        res.data.forEach(element => {
                            xlist.push(element.xaxis);
                            data1.push(element.yaxis);
                        });
                    }
                    this.drawBottom7Graph(data1, xlist);
                });
            },

            getPlOutletCoolantTemperatureIsTooLow(p1, p2) {
                getPlOutletCoolantTemperatureIsTooLow(p1, p2).then(res => {
                    let xlist = [];
                    let data1 = [];
                    if (res.code == '200' && res.data && res.data.length > 0) {
                        res.data.forEach(element => {
                            xlist.push(element.xaxis);
                            data1.push(element.yaxis);
                        });
                    }
                    this.drawBottom8Graph(data1, xlist);
                });
            },

            getPlInletCoolantTemperatureIsTooHigh(p1, p2) {
                getPlInletCoolantTemperatureIsTooHigh(p1, p2).then(res => {
                    let xlist = [];
                    let data1 = [];
                    if (res.code == '200' && res.data && res.data.length > 0) {
                        res.data.forEach(element => {
                            xlist.push(element.xaxis);
                            data1.push(element.yaxis);
                        });
                    }
                    this.drawBottom9Graph(data1, xlist);
                });
            },

            getPlInletCoolantTemperatureIsTooLow(p1, p2) {
                getPlInletCoolantTemperatureIsTooLow(p1, p2).then(res => {
                    let xlist = [];
                    let data1 = [];
                    if (res.code == '200' && res.data && res.data.length > 0) {
                        res.data.forEach(element => {
                            xlist.push(element.xaxis);
                            data1.push(element.yaxis);
                        });
                    }
                    this.$options.methods.drawBottom10Graph(data1, xlist);
                });
            },

            getPlLetTemperatureDifferenceTooBig(p1, p2) {
                getPlLetTemperatureDifferenceTooBig(p1, p2).then(res => {
                    let xlist = [];
                    let data1 = [];
                    if (res.code == '200' && res.data && res.data.length > 0) {
                        res.data.forEach(element => {
                            xlist.push(element.xaxis);
                            data1.push(element.yaxis);
                        });
                    }
                    this.drawBottom11Graph(data1, xlist);
                });
            },

            getPlAirIntakeTemperatureIsTooHigh(p1, p2) {
                getPlAirIntakeTemperatureIsTooHigh(p1, p2).then(res => {
                    let xlist = [];
                    let data1 = [];
                    if (res.code == '200' && res.data && res.data.length > 0) {
                        res.data.forEach(element => {
                            xlist.push(element.xaxis);
                            data1.push(element.yaxis);
                        });
                    }
                    this.drawBottom12Graph(data1, xlist);
                });
            },
            getPlBatteryVoltageDifferenceTooBig(p1, p2) {
                getPlBatteryVoltageDifferenceTooBig(p1, p2).then(res => {
                    let xlist = [];
                    let data1 = [];
                    if (res.code == '200' && res.data && res.data.length > 0) {
                        res.data.forEach(element => {
                            xlist.push(element.xaxis);
                            data1.push(element.yaxis);
                        });
                    }
                    this.drawBottom13Graph(data1, xlist);
                });
            },
            getPlEnergyConsumption(p1, p2) {
                getPlEnergyConsumption(p1, p2).then(res => {
                    let name = [];
                    let block = [];
                    let value = [];
                    if (res.data && res.data.length > 0) {
                        res.data.forEach(item => {
                            name.push(item.name);
                            block.push(item.blankValue);
                            value.push(item.value);
                        })
                    }
                    this.drawBottom1Graph(name, block, value);
                });
            },
            init() {
                const self = this;
                this.getOpHydrogenConsumption(null, this.vehicleModelId);
                this.getOpDurability(null, this.vehicleModelId);
                this.getOpColdStart(null, this.vehicleModelId);
                this.getOpPowerBatteryPowerRatio(null, this.vehicleModelId);
                this.getOpFactorPercentage(null, this.vehicleModelId);
                this.getPlAnodePressur(null, this.vehicleModelId);
                this.getPlCathodePressure(null, this.vehicleModelId);
                this.getPlVeryPoor(null, this.vehicleModelId);
                this.getPlVoltageLimitTooHigh(null, this.vehicleModelId);
                this.getPlVoltageLimitTooLow(null, this.vehicleModelId);
                this.getPlOutletCoolantTemperatureIsTooHigh(null, this.vehicleModelId);
                this.getPlOutletCoolantTemperatureIsTooLow(null, this.vehicleModelId);
                this.getPlInletCoolantTemperatureIsTooHigh(null, this.vehicleModelId);
                this.getPlInletCoolantTemperatureIsTooLow(null, this.vehicleModelId);
                this.getPlLetTemperatureDifferenceTooBig(null, this.vehicleModelId);
                this.getPlAirIntakeTemperatureIsTooHigh(null, this.vehicleModelId);
                this.getPlBatteryVoltageDifferenceTooBig(null, this.vehicleModelId);
                this.getPlEnergyConsumption(null, this.vehicleModelId);

            },
            searchData() {
                this.init();
                if (this.featureId === 0) {
                    this.$refs.baseInfo.init();
                }else if(this.featureId === 1){
                    this.$refs.economy.init();
                }else if(this.featureId === 2){
                    this.$refs.durability.init();
                }else if(this.featureId === 3){
                    this.$refs.coldStart.init();
                }else{
                    this.$refs.safety.init();
                }
            }
        },
        mounted() {
            this.getModelList();
            this.init();
        },
    }
</script>

<style scoped>
  .flexBlock {
    display: flex;
    flex-grow: 1;
    overflow: hidden;
  }

  .content {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    margin: 0 10px 10px 10px;
  }

  .tit {
    font-size: 14px;
    font-weight: bold;
    border-bottom: #DCDFE6 solid 1px;
    padding: 10px 10px 10px 15px;
    text-align: left;
  }

  .height200 .heightL {
    height: 200px;
  }

  .heightL {
    height: 261px;
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

  .box1 {
    /*width: calc(100% - 20px);*/
    /*margin: 0 0 0 10px;*/
    padding: 10px;
    background-color: #fff;
    border: #DCDFE6 solid 1px;
    border-radius: 5px;
  }

  .heightLall {
    height: 475px;
  }
</style>
