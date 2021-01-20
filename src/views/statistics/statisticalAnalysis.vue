<template>
  <div class="flexBlock">
    <div class="content statisticalAnalysis">
      <el-row class="content-row backgroundColorFFF">
        <span style="margin-left:10px;">地区：</span>
        <el-select v-model="areaId" placeholder="请选择" size="small" style="width:10%;">
          <el-option
            v-for="item in provinceList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <span style="margin-left:1%;">车辆型号：</span>
        <el-select v-model="vehicleModel" placeholder="请选择" size="small" style="width:10%;">
          <el-option
            v-for="item in modelList"
            :key="item.id"
            :label="item.model"
            :value="item.id">
          </el-option>
        </el-select>
        <span style="display:inline;margin-left:1%;">企业名称：</span>
        <el-input v-model="vinInput" placeholder="请输入企业名称" size="small" style="width:10%;"></el-input>
        <el-date-picker
          size="small"
          v-model="datev"
          type="datetimerange"
          value-format="yyyy-MM-dd hh-mm-ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期" style="width:30%;margin-left:1%;">
        </el-date-picker>
        <el-button type="primary" size="mini" style="margin-left:1%;">查询</el-button>

      </el-row>
      <el-row style="margin:  0 0.5% 0.5% 0.5%;">
        <el-tabs type="border-card">
          <el-tab-pane label="宏观统计">

            <el-row :gutter="10">
              <el-col :span="8">
                <div class="content-colBlockInn">
                  <div style="border-bottom:#DCDFE6 solid 2px;">
                    <div class="tit">全国车辆耐久性分布</div>
                  </div>
                  <div class="charts">
                    <div id="scatterGraphAnalysis" ref="scatterChart" style="width:100%; height:100%;"></div>
                  </div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="content-colBlockInn">
                  <div style="border-bottom:#DCDFE6 solid 2px;">
                    <div class="tit">全国车辆累计纯氢续驶里程分布</div>
                  </div>
                  <div class="charts">
                    <div id="barGraph" ref="barChart" style="width:100%; height:100%;"></div>
                  </div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="content-colBlockInn">
                  <div style="border-bottom:#DCDFE6 solid 2px;">
                    <div class="tit">全国加氢站累计加氢量分布</div>
                  </div>
                  <div class="charts">
                    <div id="category1Graph" ref="category1Chart" style="width:100%; height:100%;"></div>
                  </div>
                </div>
              </el-col>
            </el-row>

            <el-row :gutter="10" style="margin-top: 10px">
              <el-col :span="6">
                <div class="content-colBlockInn">
                  <div style="border-bottom:#DCDFE6 solid 2px;">
                    <div class="tit">全国加氢站累计70MPa加氢量分布</div>
                  </div>
                  <div class="charts">
                    <div id="bar1Graph" ref="bar1Chart" style="width:100%; height:100%;"></div>
                  </div>
                </div>
              </el-col>
              <el-col :span="6" class="content-colBlock" style="padding-left:0">
                <div class="content-colBlockInn">
                  <div style="border-bottom:#DCDFE6 solid 2px;">
                    <div class="tit">全国加氢站70MPa及35MPa加氢比例及值和总值</div>
                  </div>
                  <div class="box" style="height: calc(100% - 41px);display: flex;flex-direction: column;justify-content: space-between">
                    <div class="clearfix" style="padding-top: 30px">
                      <div style="float:left;width:50%;">
                        <div class="fontSubTit">累计35MPa加氢量</div>
                        <div class="fontTit">{{amountL | formatNumber}}</div>
                      </div>
                      <div style="float:left;width:50%;">
                        <div class="fontSubTit">累计70MPa加氢量</div>
                        <div class="fontTit">{{amountR | formatNumber}}</div>
                      </div>
                      <div class="progressBar clearfix">
                        <div class="progressBarL" style="width:54%;">
                          <span>{{rateL}}%</span>
                        </div>
                        <div class="progressBarR" style="width:46%;">
                          <span>{{rateR}}%</span>
                        </div>
                      </div>
                    </div>
<!--                    <div style="border-bottom:#E8E8E8 solid 2px;margin:5% 0 5%;"></div>-->
                    <div style="text-align:center;padding: 30px; font-weight:bold;border-top: 1px solid #E8E8E8">
                      <img src="@/assets/img/img_07091649.jpg" style="margin-right:10px;vertical-align: bottom;"/>
                      累计加氢量：{{totalAmount | formatNumber}}
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col :span="6" class="content-colBlock">
                <div class="content-colBlockInn">
                  <div style="border-bottom:#DCDFE6 solid 2px;">
                    <div class="tit">全网车辆累计纯氢续驶里程及纯电里程比例及值和总值</div>
                  </div>
                  <div class="charts">
                    <div id="pieGraph" ref="pieChart" style="width:100%; height:100%;"></div>
                  </div>
                </div>
              </el-col>

<!--              <el-col :span="6" class="content-colBlock">-->
<!--                <div class="content-colBlockInn">-->
<!--                  <div style="border-bottom:#DCDFE6 solid 2px;">-->
<!--                    <div class="tit">统计示意</div>-->
<!--                  </div>-->
<!--                  <div class="charts">-->
<!--                    <div id="categoryGraph" ref="categoryChart" style="width:100%; height:250px;"></div>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </el-col>-->

              <el-col :span="6" class="content-colBlock" style="padding-right:0">
                <div class="content-colBlockInn">
                  <div style="border-bottom:#DCDFE6 solid 2px;">
                    <div class="tit">全国累计故障值及故障类型分布</div>
                  </div>
                  <div class="charts">
                    <div id="pie1Graph" ref="pie1Chart" style="width:100%; height:100%;"></div>
                  </div>
                </div>
              </el-col>
            </el-row>

            <el-row>
<!--              <el-col :span="8" class="content-colBlock" style="padding-right:0">-->
<!--                <div class="content-colBlockInn">-->
<!--                  <div style="border-bottom:#DCDFE6 solid 2px;">-->
<!--                    <div class="tit">统计示意</div>-->
<!--                  </div>-->
<!--                  <div class="charts">-->
<!--                    <div id="linGraph" ref="linChart" style="width:100%; height:250px;"></div>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </el-col>-->
            </el-row>

<!--            <el-row>-->
<!--              <div class="col5 clearfix">-->
<!--                <div class="col5L" style="padding-left:0">-->
<!--                  <div class="col5LInn">-->
<!--                    <div style="border-bottom:#DCDFE6 solid 2px;">-->
<!--                      <div class="tit">统计示意</div>-->
<!--                    </div>-->
<!--                    <div id="liquidfill-chart" ref="liquidfill" style="width:100%; height:300px"></div>-->

<!--                  </div>-->
<!--                </div>-->
<!--                <div class="col5L">-->
<!--                  <div class="col5LInn">-->
<!--                    <div style="border-bottom:#DCDFE6 solid 2px;">-->
<!--                      <div class="tit">统计示意</div>-->
<!--                    </div>-->
<!--                    <div id="radarGraph" ref="radarChart" style="width:100%; height:250px;"></div>-->
<!--                  </div>-->
<!--                </div>-->
<!--                <div class="col5L">-->
<!--                  <div class="col5LInn">-->
<!--                    <div style="border-bottom:#DCDFE6 solid 2px;">-->
<!--                      <div class="tit">统计示意</div>-->
<!--                    </div>-->
<!--                    <div id="pie2Graph" ref="pie2Chart" style="width:100%; height:250px;"></div>-->
<!--                  </div>-->
<!--                </div>-->
<!--                <div class="col5L">-->
<!--                  <div class="col5LInn">-->
<!--                    <div style="border-bottom:#DCDFE6 solid 2px;">-->
<!--                      <div class="tit">统计示意</div>-->
<!--                    </div>-->
<!--                    <div id="funnelGraph" ref="funnelChart" style="width:100%; height:250px;"></div>-->
<!--                  </div>-->
<!--                </div>-->
<!--                <div class="col5L" style="padding-right:0">-->
<!--                  <div class="col5LInn">-->
<!--                    <div style="border-bottom:#DCDFE6 solid 2px;">-->
<!--                      <div class="tit">统计示意</div>-->
<!--                    </div>-->
<!--                    <div id="category2Graph" ref="category2Chart" style="width:100%; height:250px;"></div>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->
<!--            </el-row>-->

          </el-tab-pane>
          <el-tab-pane label="单车统计">
            <div style="margin-top: 15%;margin-left: 45%">
              <img src="@/assets/img/statistics/noData.png"/>
            </div>
          </el-tab-pane>
<!--          <el-tab-pane label="能耗统计">能耗统计</el-tab-pane>-->
<!--          <el-tab-pane label="故障统计">故障统计</el-tab-pane>-->
<!--          <el-tab-pane label="历史故障统计">历史故障统计</el-tab-pane>-->
        </el-tabs>
      </el-row>


    </div>
  </div>
</template>

<script>
    let echarts = require('echarts/lib/echarts');
    require('echarts/lib/chart/bar');
    require('echarts/lib/chart/pie');
    require('echarts/lib/component/tooltip');
    require('echarts/lib/component/title');
    import 'echarts-liquidfill/src/liquidFill.js';
    import {
        getDurability,
        getFuelDrivingOdometer,
        getAddHydrogenTypeRateVo,
        getFuelDrivingOdometerRate,
        getFaultTypeStatisticsVo,
        getAddHydrogenAmountStatistics,
        getAddHydrogenAmount70MPaStatistics
    } from "@/assets/api/statisticalAnalysis.js";
    import {getAreaList} from '@/assets/api/basicInformationEntry'
    import {getModelListByPage} from '@/assets/api/stationDeclaration'

    export default {
        name: 'hydrogenationStation',
        data() {
            return {
                licensePlateInput: '',
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                value1: '',
                areaId: 0,
                vehicleModel: '',
                vinInput: '',
                datev: '',
                rateL: '',
                rateR: '',
                fuelDrivingOdometerRate: {}, //全网车辆累计纯氢续驶里程及纯电里程比例及值和总值
                provinceList: [],
                modelList: []
            }
        },
        methods: {
            drawBar(items, area) {
                // 基于dom，初始化echarts实例
                let barGraph = echarts.init(document.getElementById('barGraph'));
                // 绘制图表
                barGraph.setOption({
                    // title: {
                    //     text: '全国车辆累计纯氢续驶里程分布',
                    //     subtext: '电压（v）',
                    //     left: 'left',
                    //     textStyle: {
                    //         fontSize: 14,
                    //     }
                    // },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c}'
                    },
                    legend: {
                        left: 'center',
                        data: [],
                        bottom: 0
                    },
                    grid:{
                        top: '10%',
                        left: '12%',
                        bottom: '13%',
                        right: '5%'
                    },
                    color: ['#23C4A1', '#C4D9E9', '#61a0a8'],
                    xAxis: {
                        type: 'category',
                        //data: ['0', '20', '40', '60', '80', '100']
                        data: area,
                        axisLabel: {
                            show: true,
                            interval: 0,
                            rotate: 40,
                            textStyle: {
                                color: '#333'
                            }
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
                                color: '#eee'
                            }
                        },
                    },
                    yAxis: {
                        type: 'value',
                        name: '里程(km)',
                        nameLocation: 'center',
                        nameGap: 30,
                        nameTextStyle: {
                            color: '#999',
                            fontSize: '12',
                            padding: [0, 0, 16, 0]
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
                    },
                    series: [{
                        //data: [20, 5, 80, 65, 35, 99],
                        data: items,
                        type: 'bar'
                    }]

                })
            },
            drawScatter(data)
            {
                let pieGraph = echarts.init(document.getElementById('scatterGraphAnalysis'));
                pieGraph.setOption({
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    grid:{
                        top: '10%',
                        left: '12%',
                        bottom: '16%',
                        right: '5%'
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                    },
                    color: ['#4A90E2', '#C4D9E9', '#61a0a8'],
                    xAxis: {
                        name: '时间(h)',
                        nameLocation: 'center',
                        nameGap: 30,
                        nameTextStyle: {
                            color: '#999',
                            fontSize: '12',
                            padding: [0, 0, 0, 0]
                        },
                        axisLabel: {
                            show: true,
                            interval: 0,
                            // rotate: 40,
                            textStyle: {
                                color: '#333'
                            }
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
                                color: '#eee'
                            }
                        },
                    },
                    yAxis: {
                        name: '里程(km)',
                        nameLocation: 'center',
                        nameGap: 30,
                        nameTextStyle: {
                            color: '#999',
                            fontSize: '12',
                            padding: [0, 0, 16, 0]
                        },
                        axisLabel: {
                            show: true,
                            interval: 0,
                            // rotate: 40,
                            textStyle: {
                                color: '#333'
                            }
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
                                color: '#eee'
                            }
                        },
                    },
                    series: [{
                        symbolSize: 5,
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
                        type: 'scatter',
                    }]
                })
            },
            drawPie(v1, v2, total) {
                let pieGraph = echarts.init(document.getElementById('pieGraph'));
                pieGraph.setOption({
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                    },
                    graphic: [{　　　　　　　　　　　　　　　　//环形图中间添加文字
                        type: 'text',　　　　　　　　　　　　//通过不同top值可以设置上下显示
                        left: 'center',
                        top: '40%',
                        style: {
                            text: "总值(km)",
                            textAlign: 'center',
                            fill: '#8F9399',　　　　　　　　//文字的颜色
                            width: 30,
                            height: 30,
                            fontSize: 14,
                            color: "#4d4f5c",
                            fontFamily: "Microsoft YaHei"
                        }
                    }, {
                        type: 'text',
                        left: 'center',
                        top: '50%',
                        style: {
                            text: total,
                            textAlign: 'center',
                            fill: '#000',
                            width: 30,
                            height: 30,
                            fontSize: 18,
                        }
                    }],
                    series: [
                        {
                            name: '总值(km)',
                            type: 'pie',
                            center: ['50%', '50%'],
                            radius: ['40%', '70%'],
                            avoidLabelOverlap: false,
                            labelLine: {
                                normal: {
                                    length: 20,
                                    length2: 70,
                                }
                            },
                            label: {
                                normal: {
                                    formatter: '{c|{c}%}  \n  {b|{b}}  \n\n',       //图形外文字上下显示
                                    borderWidth: 20,
                                    borderRadius: 4,         //文字和图的边距
                                    padding: [0, -70, 20, -70],
                                    rich: {
                                        a: {
                                            color: '#333',
                                            fontSize: 12,
                                            lineHeight: 33
                                        },
                                        b: {                        //name 文字样式
                                            fontSize: 12,
                                            lineHeight: 20,
                                            color: '#000000'
                                        },
                                        c: {                   //value 文字样式
                                            fontSize: 14,
                                            lineHeight: 20,
                                            color: '#63BF6A',
                                            align: "center"
                                        }
                                    }
                                }
                            },
                            data: [
                                {
                                    value: v1,
                                    name: '纯氢续驶里程',
                                    itemStyle: {
                                        normal: {
                                            color: '#7585A2',
                                            label: {
                                                show: true,
                                                position: 'inside',
                                                formatter: '{b}:{d}%',
                                                textStyle: {
                                                    baseline: 'bottom',
                                                    fontSize: '16'
                                                }
                                            },
                                            labelLine: {
                                                show: true
                                            }
                                        }
                                    }
                                },
                                {
                                    value: v2,
                                    name: '纯电续驶里程',
                                    itemStyle: {
                                        normal: {
                                            color: '#73DEB3',
                                        }
                                    }
                                },
                            ]
                        }
                    ]
                })
            },
            // drawCategory() {
            //     let pieGraph = echarts.init(document.getElementById('categoryGraph'));
            //     pieGraph.setOption({
            //         tooltip: {
            //             trigger: 'axis',
            //             axisPointer: {
            //                 type: 'cross',
            //                 label: {
            //                     backgroundColor: '#6a7985'
            //                 }
            //             }
            //         },
            //         legend: {
            //             left: 'center',
            //             bottom: '5%',
            //             data: ['图例1', '图例2', '图例3', '图例4', '图例5', '图例6', '图例7']
            //         },
            //         grid: {
            //             left: '6%',
            //             right: '4%',
            //             top: '15%',
            //             containLabel: true
            //         },
            //         xAxis: [
            //             {
            //                 type: 'category',
            //                 boundaryGap: false,
            //                 data: ['北京', '天津', '河北', '江西', '山西', '河南', '哈尔滨', '福建']
            //             }
            //         ],
            //         yAxis: [
            //             {
            //                 type: 'value',
            //                 name: '里程(km)',
            //                 nameLocation: 'center',
            //                 nameGap: 30,
            //                 nameTextStyle: {
            //                     color: '#999',
            //                     fontSize: '12',
            //                     padding: [0, 0, 16, 0]
            //                 },
            //             }
            //         ],
            //         series: [
            //             {
            //                 name: '图例1',
            //                 type: 'line',
            //                 stack: '总量',
            //                 areaStyle: {},
            //                 data: [120, 132, 101, 134, 90, 230, 210, 356]
            //             },
            //             {
            //                 name: '图例2',
            //                 type: 'line',
            //                 stack: '总量',
            //                 areaStyle: {},
            //                 data: [220, 182, 191, 234, 290, 330, 310, 290]
            //             },
            //             {
            //                 name: '图例3',
            //                 type: 'line',
            //                 stack: '总量',
            //                 areaStyle: {},
            //                 data: [150, 232, 201, 154, 190, 330, 410, 290]
            //             },
            //             {
            //                 name: '图例4',
            //                 type: 'line',
            //                 stack: '总量',
            //                 areaStyle: {},
            //                 data: [320, 332, 301, 334, 390, 330, 320, 290]
            //             },
            //             {
            //                 name: '图例5',
            //                 type: 'line',
            //                 stack: '总量',
            //                 areaStyle: {},
            //                 data: [320, 332, 301, 334, 390, 330, 320, 290]
            //             },
            //             {
            //                 name: '图例6',
            //                 type: 'line',
            //                 stack: '总量',
            //                 label: {
            //                     normal: {
            //                         show: true,
            //                         position: 'top'
            //                     }
            //                 },
            //                 areaStyle: {},
            //                 data: [820, 932, 901, 934, 1290, 1330, 1320, 1620]
            //             }
            //         ]
            //     })
            // },
            drawPie1(v1, v2, v3, r1, r2, r3, total) {
                // 基于dom，初始化echarts实例
                let barGraph = echarts.init(document.getElementById('pie1Graph'));
                // 绘制图表
                barGraph.setOption({
                    tooltip: {
                        trigger: 'item',
                        formatter: '{b} : {c} {kg}'
                    },
                    graphic: [{　　　　　　　　　　　　　　　　//环形图中间添加文字
                        type: 'text',　　　　　　　　　　　　//通过不同top值可以设置上下显示
                        left: 'center',
                        top: '40%',
                        style: {
                            text: "总值(km)",
                            textAlign: 'center',
                            fill: '#8F9399',　　　　　　　　//文字的颜色
                            width: 30,
                            height: 30,
                            fontSize: 16,
                            color: "#4d4f5c",
                            fontFamily: "Microsoft YaHei"
                        }
                    }, {
                        type: 'text',
                        left: 'center',
                        top: '50%',
                        style: {
                            text: total,
                            textAlign: 'center',
                            fill: '#000',
                            width: 30,
                            height: 30,
                            fontSize: 25,
                        }
                    }],
                    series: [
                        {
                            name: '总值(km)',
                            type: 'pie',
                            radius: ['40%', '70%'],
                            avoidLabelOverlap: false,
                            roseType: 'radius',
                            label: {
                                normal: {
                                    formatter: '{b|{b}}  \n  {c|{c}kg}  \n\n',       //图形外文字上下显示
                                    borderWidth: 20,
                                    borderRadius: 4,         //文字和图的边距
                                    rich: {
                                        a: {
                                            color: '#333',
                                            fontSize: 12,
                                            lineHeight: 20
                                        },
                                        b: {                        //name 文字样式
                                            fontSize: 12,
                                            lineHeight: 20,
                                            color: '#000000'
                                        },
                                        c: {                   //value 文字样式
                                            fontSize: 12,
                                            lineHeight: 20,
                                            color: '#63BF6A',
                                            align: "center"
                                        }
                                    }
                                }
                            },
                            data: [
                                {
                                    value: v1, name: '高(' + r1 + "%)", itemStyle: {
                                        normal: {
                                            color: '#5B8FF9',
                                            label: {
                                                show: true,
                                                position: 'center',
                                                formatter: '{b}:{d}%',
                                                textStyle: {
                                                    baseline: 'bottom',
                                                    fontSize: '16'
                                                }
                                            },
                                            labelLine: {
                                                show: true
                                            }
                                        }
                                    }
                                },
                                {
                                    value: v2, name: '中(' + r2 + "%)", itemStyle: {
                                        normal: {
                                            color: '#7585A2',
                                        }
                                    }
                                },
                                {
                                    value: v3, name: '低(' + r3 + "%)", itemStyle: {
                                        normal: {
                                            color: '#73DEB3',
                                        }
                                    }
                                },
                            ]
                        }
                    ]

                })
            },
            drawCategory1(area, data) {
                // 基于dom，初始化echarts实例
                let category1Graph = echarts.init(document.getElementById('category1Graph'));
                // 绘制图表
                category1Graph.setOption({
                    grid: {
                        left: '8%',
                        right: '5%',
                        top: '10%',
                        bottom: '5%',
                        containLabel: true
                    },
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0, color: '#35D2AA'
                        }, {
                            offset: 1, color: '#f2fffc'
                        }],
                        globalCoord: false // 缺省为 false
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: area,
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
                        },
                        //data: ['北京', '天津', '河北', '江西', '山西', '河南', '哈尔滨','福建']
                    },
                    yAxis: {
                        type: 'value',
                        name: '加氢量(t)',
                        nameLocation: 'center',
                        nameGap: 50,
                        nameTextStyle: {
                            color: '#999',
                            fontSize: '12',
                            padding: [0, 0, 16, 16]
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
                        },
                    },
                    series: [{
                        data: data,
                        //data: [820, 932, 901, 934, 1290, 1330, 1320, 999],
                        type: 'line',
                        areaStyle: {}
                    }]

                })
            },
            drawBar1(area, data) {
                // 基于dom，初始化echarts实例
                let barGraph = echarts.init(document.getElementById('bar1Graph'));
                // 绘制图表
                barGraph.setOption({
                    title: {
                        subtext: '70MPa加氢量(t)',
                        left: 'center',
                        bottom: '1.5%',
                    },
                    grid: {
                        left: '4%',
                        right: '5%',
                        top: '10%',
                        bottom: '12%',
                        containLabel: true
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{b} : {c}'
                    },
                    color: ['#879CFF', '#C4D9E9', '#61a0a8'],
                    xAxis: {
                        axisLine: {
                            lineStyle: {
                                color: '#eee'
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            color: '#606266'
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#eee',
                                type: 'dashed'
                            }
                        },
                    },
                    yAxis: {
                        type: 'category',
                        data: area,
                        axisLabel: {
                            show: true,
                            interval: 0,
                            rotate: 40,
                            textStyle: {
                                color: '#333'
                            }
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
                        },
                        //data: ['北京', '天津', '河北', '江西', '山西', '河南', '哈尔滨','福建']
                    },
                    series: [{
                        data: data,
                        //data: [20, 5, 80, 65, 35, 99, 20, 56],
                        type: 'bar',
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true,		//开启显示
                                    position: 'right',	//在上方显示
                                    textStyle: {	    //数值样式
                                        color: 'black',
                                        fontSize: 16
                                    }
                                }
                            }
                        }
                    }]

                })
            },
            // zBar() {
            //     // 基于dom，初始化echarts实例
            //     let barGraph = echarts.init(document.getElementById('linGraph'));
            //     // 绘制图表
            //     let data = [
            //         [[28604, 77, 17096869, 'Australia', 1990], [31163, 77.4, 27662440, 'Canada', 1990], [1516, 68, 1154605773, 'China', 1990], [13670, 74.7, 10582082, 'Cuba', 1990], [28599, 75, 4986705, 'Finland', 1990], [29476, 77.1, 56943299, 'France', 1990], [31476, 75.4, 78958237, 'Germany', 1990], [28666, 78.1, 254830, 'Iceland', 1990], [1777, 57.7, 870601776, 'India', 1990], [29550, 79.1, 122249285, 'Japan', 1990], [2076, 67.9, 20194354, 'North Korea', 1990], [12087, 72, 42972254, 'South Korea', 1990], [24021, 75.4, 3397534, 'New Zealand', 1990], [43296, 76.8, 4240375, 'Norway', 1990], [10088, 70.8, 38195258, 'Poland', 1990], [19349, 69.6, 147568552, 'Russia', 1990], [10670, 67.3, 53994605, 'Turkey', 1990], [26424, 75.7, 57110117, 'United Kingdom', 1990], [37062, 75.4, 252847810, 'United States', 1990]],
            //         [[44056, 81.8, 23968973, 'Australia', 2015], [43294, 81.7, 35939927, 'Canada', 2015], [13334, 76.9, 1376048943, 'China', 2015], [21291, 78.5, 11389562, 'Cuba', 2015], [38923, 80.8, 5503457, 'Finland', 2015], [37599, 81.9, 64395345, 'France', 2015], [44053, 81.1, 80688545, 'Germany', 2015], [42182, 82.8, 329425, 'Iceland', 2015], [5903, 66.8, 1311050527, 'India', 2015], [36162, 83.5, 126573481, 'Japan', 2015], [1390, 71.4, 25155317, 'North Korea', 2015], [34644, 80.7, 50293439, 'South Korea', 2015], [34186, 80.6, 4528526, 'New Zealand', 2015], [64304, 81.6, 5210967, 'Norway', 2015], [24787, 77.3, 38611794, 'Poland', 2015], [23038, 73.13, 143456918, 'Russia', 2015], [19360, 76.5, 78665830, 'Turkey', 2015], [38225, 81.4, 64715810, 'United Kingdom', 2015], [53354, 79.1, 321773631, 'United States', 2015]]
            //     ];
            //     barGraph.setOption({
            //         grid: {
            //             left: '6%',
            //             right: '4%',
            //             top: '10%',
            //             bottom: '10%',
            //             containLabel: true
            //         },
            //         xAxis: {
            //             splitLine: {
            //                 lineStyle: {
            //                     type: 'dashed'
            //                 }
            //             }
            //         },
            //         yAxis: {
            //             splitLine: {
            //                 lineStyle: {
            //                     type: 'dashed'
            //                 }
            //             },
            //             scale: true
            //         },
            //         series: [{
            //             name: '1990',
            //             data: data[0],
            //             type: 'scatter',
            //             symbolSize: function (data) {
            //                 return Math.sqrt(data[2]) / 5e2;
            //             },
            //             emphasis: {
            //                 label: {
            //                     show: true,
            //                     formatter: function (param) {
            //                         return param.data[3];
            //                     },
            //                     position: 'top'
            //                 }
            //             },
            //             itemStyle: {
            //                 shadowBlur: 10,
            //                 shadowColor: 'rgba(120, 36, 50, 0.5)',
            //                 shadowOffsetY: 5,
            //                 color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
            //                     offset: 0,
            //                     color: 'rgb(251, 118, 123)'
            //                 }, {
            //                     offset: 1,
            //                     color: 'rgb(204, 46, 72)'
            //                 }])
            //             }
            //         }, {
            //             name: '2015',
            //             data: data[1],
            //             type: 'scatter',
            //             symbolSize: function (data) {
            //                 return Math.sqrt(data[2]) / 5e2;
            //             },
            //             emphasis: {
            //                 label: {
            //                     show: true,
            //                     formatter: function (param) {
            //                         return param.data[3];
            //                     },
            //                     position: 'top'
            //                 }
            //             },
            //             itemStyle: {
            //                 shadowBlur: 10,
            //                 shadowColor: 'rgba(25, 100, 150, 0.5)',
            //                 shadowOffsetY: 5,
            //                 color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
            //                     offset: 0,
            //                     color: 'rgb(129, 227, 238)'
            //                 }, {
            //                     offset: 1,
            //                     color: 'rgb(25, 183, 207)'
            //                 }])
            //             }
            //         }]
            //
            //     })
            // },
            // drawLiquidFill() {
            //     // 基于dom，初始化echarts实例
            //     let barGraph = echarts.init(document.getElementById('liquidfill-chart'));
            //     // 绘制图表
            //     barGraph.setOption({
            //         series: [{
            //             type: 'liquidFill',
            //             name: '系统剩余空间',
            //             center: ['50%', '45%'],
            //             radius: '70%',
            //             data: [60, 0.5, 0.4, 0.3],
            //             label: {
            //                 normal: {
            //                     formatter: '{a}\n\n{c}%',
            //                     textStyle: {
            //                         fontSize: 22
            //                     }
            //                 }
            //             },
            //         }]
            //
            //     })
            // },
            // drawRadar() {
            //     // 基于dom，初始化echarts实例
            //     let radarGraph = echarts.init(document.getElementById('radarGraph'));
            //     // 绘制图表
            //     radarGraph.setOption({
            //         legend: {
            //             left: 'right',
            //             bottom: '1%',
            //             data: ['图例一', '图例二']
            //         },
            //         radar: [
            //             {
            //                 splitArea: {
            //                     areaStyle: {
            //                         color: ['rgba(114, 172, 209, 0.2)',
            //                             'rgba(114, 172, 209, 0.4)', 'rgba(114, 172, 209, 0.6)',
            //                             'rgba(114, 172, 209, 0.8)', 'rgba(114, 172, 209, 1)'],
            //                         shadowColor: 'rgba(0, 0, 0, 0.3)',
            //                         shadowBlur: 10
            //                     }
            //                 },
            //                 axisLine: {
            //                     lineStyle: {
            //                         color: 'rgba(255, 255, 255, 0.5)'
            //                     }
            //                 },
            //                 splitLine: {
            //                     lineStyle: {
            //                         color: 'rgba(255, 255, 255, 0.5)'
            //                     }
            //                 }
            //             },
            //             {
            //                 indicator: [
            //                     {text: '指标一', max: 150},
            //                     {text: '指标二', max: 150},
            //                     {text: '指标三', max: 150},
            //                     {text: '指标四', max: 120},
            //                     {text: '指标五', max: 108},
            //                     {text: '指标六', max: 72}
            //                 ],
            //                 center: ['50%', '50%'],
            //                 radius: 90
            //             }
            //         ],
            //         series: [
            //             {
            //                 name: '',
            //                 type: 'radar',
            //                 radarIndex: 1,
            //                 data: [
            //                     {
            //                         value: [120, 118, 130, 100, 99, 70],
            //                         name: '图例一',
            //                         label: {
            //                             show: true,
            //                             formatter: function (params) {
            //                                 return params.value;
            //                             }
            //                         }
            //                     },
            //                     {
            //                         value: [90, 113, 140, 30, 70, 60],
            //                         name: '图例二',
            //                         areaStyle: {
            //                             opacity: 0.9,
            //                             color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
            //                                 {
            //                                     color: '#B8D3E4',
            //                                     offset: 0
            //                                 },
            //                                 {
            //                                     color: '#72ACD1',
            //                                     offset: 1
            //                                 }
            //                             ])
            //                         }
            //                     }
            //                 ]
            //             }
            //         ]
            //
            //     })
            // },
            // drawFunnel() {
            //     // 基于dom，初始化echarts实例
            //     let barGraph = echarts.init(document.getElementById('funnelGraph'));
            //     // 绘制图表
            //     barGraph.setOption({
            //         tooltip: {
            //             trigger: 'item',
            //             formatter: "{a} <br/>{b} : {c}%"
            //         },
            //
            //         series: [
            //             {
            //                 name: '',
            //                 type: 'funnel',
            //                 left: 0,
            //                 top: 20,
            //                 //x2: 80,
            //                 bottom: 20,
            //                 width: '100%',
            //                 // height: {totalHeight} - y - y2,
            //                 min: 0,
            //                 max: 100,
            //                 minSize: '20%',
            //                 maxSize: '100%',
            //                 sort: 'descending',
            //                 gap: 2,
            //                 label: {
            //                     show: true,
            //                     position: 'inside'
            //                 },
            //                 labelLine: {
            //                     length: 10,
            //                     lineStyle: {
            //                         width: 1,
            //                         type: 'solid'
            //                     }
            //                 },
            //                 itemStyle: {
            //                     borderColor: '#fff',
            //                     borderWidth: 1
            //                 },
            //                 emphasis: {
            //                     label: {
            //                         fontSize: 20
            //                     }
            //                 },
            //                 data: [
            //                     {value: 20, name: 'item1'},
            //                     {value: 40, name: 'item2'},
            //                     {value: 60, name: 'item3'},
            //                     {value: 80, name: 'item4'}
            //                 ]
            //             }
            //         ]
            //
            //     })
            // },
            // drawPie2() {
            //     // 基于dom，初始化echarts实例
            //     let pie2Graph = echarts.init(document.getElementById('pie2Graph'));
            //     // 绘制图表
            //     pie2Graph.setOption({
            //         left: 0,
            //         top: 20,
            //         //x2: 80,
            //         bottom: 20,
            //         width: '100%',
            //
            //         color: ['#5B8FF9'],
            //
            //         series: [
            //
            //             {
            //                 name: '',
            //                 type: 'pie',
            //                 startAngle: 0,
            //                 radius: ['40%', '70%'],
            //                 center: ['50%', '50%'],
            //                 legendHoverLink: false,
            //                 hoverAnimation: false,
            //                 avoidLabelOverlap: false,
            //                 label: {
            //                     normal: {
            //                         show: false,
            //                         position: 'center'
            //                     },
            //                     emphasis: {
            //                         show: true,
            //                         textStyle: {
            //                             fontSize: '30',
            //                             fontWeight: 'bold'
            //                         }
            //                     }
            //                 },
            //                 labelLine: {
            //                     normal: {
            //                         show: false
            //                     }
            //                 },
            //                 data: [{
            //                     value: 300,
            //                     itemStyle: {
            //                         normal: {
            //                             color: "rgba(35,206,167,0)"
            //                         }
            //                     }
            //                 },
            //                     {
            //                         value: 210,
            //                         itemStyle: {
            //                             normal: {
            //                                 color: "rgba(35,206,167,1)"
            //                             }
            //                         }
            //
            //                     },
            //                     {
            //                         value: 90,
            //                         itemStyle: {
            //                             normal: {
            //                                 color: "rgba(35,206,167,0.1)"
            //                             }
            //                         }
            //                     },
            //
            //                 ]
            //             },
            //
            //         ]
            //
            //     })
            // },
            // drawCategory2() {
            //     // 基于dom，初始化echarts实例
            //     let category2Graph = echarts.init(document.getElementById('category2Graph'));
            //     // 绘制图表
            //     category2Graph.setOption({
            //         tooltip: {
            //             trigger: 'axis',
            //             axisPointer: {
            //                 type: 'shadow'
            //             }
            //         },
            //         legend: {
            //             left: 'center',
            //             bottom: '3%',
            //             data: ['图例一', '图例二', '图例三']
            //         },
            //         grid: {
            //             left: '3%',
            //             right: '4%',
            //             top: '5%',
            //             containLabel: true
            //         },
            //         xAxis: {
            //             type: 'value',
            //             boundaryGap: [0, 0.01]
            //         },
            //         yAxis: {
            //             type: 'category',
            //             data: ['北京', '上海', '杭州']
            //         },
            //         series: [
            //             {
            //                 name: '图例一',
            //                 type: 'bar',
            //                 data: [18203, 23489, 29034]
            //             },
            //             {
            //                 name: '图例二',
            //                 type: 'bar',
            //                 data: [19325, 23438, 31000]
            //             },
            //             {
            //                 name: '图例三',
            //                 type: 'bar',
            //                 data: [19325, 23438, 31000]
            //             }
            //         ]
            //
            //     })
            // },
            goBasicPerformance() {
                this.$router.push('/statistics/basicPerformance');
            },
            goTechnologyUpgrading() {
                this.$router.push('/statistics/technologyUpgrading');
            },
            init() {
                const self = this;

                window.onresize = function () {
                    setTimeout(() => {
                        self.chart1 = echarts.init(self.$refs.barChart);
                        self.chart1.resize();
                        self.chart2 = echarts.init(self.$refs.scatterChart);
                        self.chart2.resize();
                        self.chart3 = echarts.init(self.$refs.pieChart);
                        self.chart3.resize();
                        self.chart4 = echarts.init(self.$refs.pie1Chart);
                        self.chart4.resize();
                        self.chart5 = echarts.init(self.$refs.categoryChart);
                        self.chart5.resize();
                        self.chart6 = echarts.init(self.$refs.category1Chart);
                        self.chart6.resize();
                        self.chart7 = echarts.init(self.$refs.bar1Chart);
                        self.chart7.resize();
                        self.chart8 = echarts.init(self.$refs.linChart);
                        self.chart8.resize();
                        self.chart9 = echarts.init(self.$refs.liquidfill);
                        self.chart9.resize();
                        self.chart10 = echarts.init(self.$refs.radarChart);
                        self.chart10.resize();
                        self.chart11 = echarts.init(self.$refs.pie2Chart);
                        self.chart11.resize();
                        self.chart12 = echarts.init(self.$refs.funnelChart);
                        self.chart12.resize();
                        self.chart13 = echarts.init(self.$refs.category2Chart);
                        self.chart13.resize();
                    }, 20)
                }
                setTimeout(() => {
                    self.chart1 = echarts.init(self.$refs.barChart);
                    self.chart1.resize();
                    self.chart2 = echarts.init(self.$refs.scatterChart);
                    self.chart2.resize();
                    self.chart3 = echarts.init(self.$refs.pieChart);
                    self.chart3.resize();
                    self.chart4 = echarts.init(self.$refs.pie1Chart);
                    self.chart4.resize();
                    self.chart5 = echarts.init(self.$refs.categoryChart);
                    self.chart5.resize();
                    self.chart6 = echarts.init(self.$refs.category1Chart);
                    self.chart6.resize();
                    self.chart7 = echarts.init(self.$refs.bar1Chart);
                    self.chart7.resize();
                    self.chart8 = echarts.init(self.$refs.linChart);
                    self.chart8.resize();
                    self.chart9 = echarts.init(self.$refs.liquidfill);
                    self.chart9.resize();
                    self.chart10 = echarts.init(self.$refs.radarChart);
                    self.chart10.resize();
                    self.chart11 = echarts.init(self.$refs.pie2Chart);
                    self.chart11.resize();
                    self.chart12 = echarts.init(self.$refs.funnelChart);
                    self.chart12.resize();
                    self.chart13 = echarts.init(self.$refs.category2Chart);
                    self.chart13.resize();
                }, 20)

            },
            getDurability() {
                getDurability().then(res => {
                    if (res.code == 200) {
                        let data = [];
                        if (res.code == '200') {
                            res.data.forEach(element => {
                                data.push([element.time, element.odometer]);
                            });
                        }
                        this.drawScatter(data);
                    }
                });
            },

            getFuelDrivingOdometer() {
                getFuelDrivingOdometer().then(res => {
                    if (res.code == 200) {
                        let items = [];
                        let area = [];
                        res.data.forEach(element => {
                            items.push(element.odometer);
                            area.push(element.area);
                        });
                        this.drawBar(items, area);
                    }
                });
            },

            getAddHydrogenTypeRateVo() {
                getAddHydrogenTypeRateVo().then(res => {
                    if (res.code == 200) {
                        this.amountL = res.data.details[0].amount;
                        this.rateL = parseFloat(res.data.details[0].rate).toFixed(2) * 100;
                        this.rateL = Math.round(this.rateL);
                        this.amountR = res.data.details[1].amount;
                        this.rateR = parseFloat(res.data.details[1].rate).toFixed(2) * 100;
                        this.rateR = Math.round(this.rateR);
                        this.totalAmount = res.data.totalAmount;
                    }
                });
            },

            getFuelDrivingOdometerRate() {
                getFuelDrivingOdometerRate().then(res => {
                    if (res.code == 200) {
                        let v1 = parseFloat(res.data.electricityDrivingOdometerRate).toFixed(2) * 100;
                        let v2 = parseFloat(res.data.fuelDrivingOdometerRate).toFixed(2) * 100;
                        let total = res.data.totalOdometer;
                        v1 = Math.round(v1);
                        v2 = Math.round(v2);
                        this.drawPie(v1, v2, total);
                    }

                });
            },

            getFaultTypeStatisticsVo() {
                getFaultTypeStatisticsVo().then(res => {
                    if (res.code == 200) {
                        let r1, r2, r3, v1, v2, v3;
                        res.data.details.forEach(element => {
                            switch (element.level) {
                                case '高' :
                                    r1 = (parseFloat(element.rate).toFixed(2)) * 100;
                                    v1 = element.amount;
                                    break;
                                case '中' :
                                    r2 = (parseFloat(element.rate).toFixed(2)) * 100;
                                    v2 = element.amount;
                                    break;
                                case '低' :
                                    r3 = (parseFloat(element.rate).toFixed(2)) * 100;
                                    v3 = element.amount;
                                    break;
                            }
                        })
                        r1 = Math.round(r1);
                        r2 = Math.round(r2);
                        r3 = Math.round(r3);
                        let total = res.data.totalAmount;
                        this.drawPie1(v1, v2, v3, r1, r2, r3, total)
                    }

                });
            },

            getAddHydrogenAmountStatistics() {
                getAddHydrogenAmountStatistics().then(res => {
                    if (res.code == 200) {
                        let area = [];
                        let items = []
                        res.data.forEach(element => {
                            area.push(element.area);
                            items.push(element.amount);
                        })
                        this.drawCategory1(area, items);
                    }
                });
            },

            getAddHydrogenAmount70MPaStatistics() {
                getAddHydrogenAmount70MPaStatistics().then(res => {
                    if (res.code == 200) {
                        let area = [];
                        let items = []
                        res.data.forEach(element => {
                            area.push(element.area);
                            items.push(element.amount);
                        })
                        this.drawBar1(area, items);
                    }
                })
            },
            getProvinceList () {
                let params = {};
                params.page = this.page;
                params.querys = [
                    {
                        eq: {
                            areaLevel: 'A'
                        },
                        like:{
                            id:'0000'
                        }
                    }
                ]
                getAreaList(params).then(({ data }) => {
                    this.provinceList = data;
                    this.provinceList.unshift({name: '全国', id: 0})
                })
            },
            getModelList() {
                getModelListByPage({querys: [{eq: {status: 1}}]}).then((res) => {
                    this.modelList = res.data.records;
                })
            }
        },
        mounted() {
            this.getProvinceList();
            this.getModelList();
            this.drawBar();
            this.drawScatter();
            this.drawPie();
            // this.drawCategory();
            //this.drawPie1();
            // this.drawCategory1();
            // this.drawBar1();
            // this.zBar();
            // this.drawLiquidFill();
            // this.drawRadar();
            // this.drawFunnel();
            // this.drawPie2();
            // this.drawCategory2();
            this.init();
            this.getDurability();
            this.getFuelDrivingOdometer();
            this.getAddHydrogenTypeRateVo();
            this.getFuelDrivingOdometerRate();
            this.getFaultTypeStatisticsVo();
            this.getAddHydrogenAmountStatistics();
            this.getAddHydrogenAmount70MPaStatistics();
        },

    }
</script>

<style scoped>
  img {
    vertical-align: middle;
  }

  .charts{
    height: calc(100% - 41px);
  }

  .flexBlock {
    display: flex;
    flex-grow: 1;
  }

  .content {
    width: 100%;
    height: 100%;
    overflow: auto;
  }

  .content-rowTop {
    margin: 0.5%;
  }

  .content-row {
    margin: 0.5%;
    padding: 0.5%;
  }

  .backgroundColorFFF {
    background-color: #fff;
  }

  .content-col {
    margin: 0.5%;
    padding: 0.5%;
  }

  .content-colBlock {
    /*padding: 0.5%;*/
  }

  .content-colBlockInn {
    height: 391px;
    /*padding: 0.5%;*/
    background-color: #fff;
  }

  @media screen and (max-width: 1366px) {
    .content-colBlockInn{
      height: 236px;
    }
    .statisticalAnalysis .tit{
      font-size: 12px!important;
    }

    .content-row span{
      font-size: 12px;
    }

    .clearfix{
      padding-top: 0!important;
    }

    .progressBarL{
      height: 40px!important;
      margin-top: 5% !important;
    }
    .progressBarR{
      height: 40px!important;
      margin-top: 5% !important;
    }
    .clearfix+div{
      padding: 16px!important;
    }

    .progressBarL span, .progressBarR span{
      line-height: 40px!important;
    }
  }

  ul.ulStyle, ul.ulStyle li {
    list-style: none;
  }

  ul.ulStyle li {
    padding: 10px;
  }

  ul.ulStyle li img {
    margin-right: 5px;
    vertical-align: middle;
  }

  .contentBlock {
    padding: 0.5%;
  }

  .contentBlock .left {
    float: left;
    width: 49.5%;
    background-color: #fff;
    /*padding: 1%;*/
  }

  .contentBlock .right {
    float: right;
    width: 49.5%;
    background-color: #fff;
    /*padding: 1%;*/
  }

  .progressBar {
    width: 90%;
    height: 40px;
    margin: 0 auto;
  }

  .progressBarL {
    float: left;
    height: 50px;
    background-color: #BF93ED;
    border-top-left-radius: 25px;
    border-bottom-left-radius: 25px;
    -moz-border-top-left-radius: 25px;
    -moz-border-bottom-left-radius: 25px;
    text-align: center;
    margin-top: 10%;
  }

  .progressBarR {
    float: left;
    height: 50px;
    background-color: #9C68D4;
    border-top-right-radius: 25px;
    border-bottom-right-radius: 25px;
    -moz-border-top-right-radius: 25px;
    -moz-border-bottom-right-radius: 25px;
    text-align: center;
    margin-top: 10%;
  }

  .progressBarL span, .progressBarR span {
    color: #ffffff;
    line-height: 50px;
  }

  .inline {
    display: inline;
  }

  .box {
    width: 100%;
    padding: 1% 1% 0;
  }

  .fontSubTit {
    text-align: center;
    color: #999;
    margin-top: 10px;
    font-size: 10px;
  }

  .fontTit {
    text-align: center;
    font-size: 30px;
    margin-top: 10px;
  }

  .tit {
    font-size: 16px;
    /*margin: 10px;*/
    padding: 10px;
    text-align: left;
    font-weight: bolder;
  }

  .col5 {
    width: 100%;
  }

  .col5L {
    float: left;
    width: 20%;
    padding: 0.5%;
  }

  .col5LInn {
    height: 300px;
    padding: 0.5%;
    background-color: #fff;
  }

  .clearfix:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden
  }

  /deep/.statisticalAnalysis .el-tabs__nav-scroll {
    background-color: #FFFFFF;
    border-top: 1px solid #DCDFE6;
    box-sizing: border-box;
  }

  /deep/.statisticalAnalysis .el-tabs--border-card {
    background-color: #F0F2F5;
    border: 0;
    box-shadow: 0 0px 0px 0 rgba(0, 0, 0, .12), 0 0 0px 0 rgba(0, 0, 0, .04);
  }

  /deep/.statisticalAnalysis .el-tabs--border-card > .el-tabs__content {
    padding: 9px 0 0 0;
  }

  /deep/.statisticalAnalysis .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
    color: #606266;
    background-color: #F0F2F5;
  }

  /deep/.statisticalAnalysis .el-tabs--border-card > .el-tabs__header .el-tabs__item {
    color: #4A90E2;
    border-right: 1px solid #DCDFE6;
    line-height: 34px;
    height: 34px;
  }

  /deep/.statisticalAnalysis .content-row {
    margin: 0 0.5% 0 0.5%;
  }

  /deep/.statisticalAnalysis .tit {
    font-size: 14px;
  }

  /deep/.statisticalAnalysis .contentBlock {
    padding: 0.5% 0 0.5% 0;
  }
</style>
