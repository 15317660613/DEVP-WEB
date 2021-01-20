<template>
  <div class="content">
    <el-row class="content-rowTop">
      <el-button size="small" @click="goBicycle" ref="carInfo">车辆基本信息</el-button>
      <el-button size="small" @click="goStatistics">统计分析</el-button>
      <el-button size="small" type="primary">历史轨迹</el-button>
    </el-row>
    <el-row class="content-row backgroundColorFFF">
      <el-row style="margin-top:10px;" v-show="historyF">
        <el-col :span="6">
          <span style="display:inline;margin-left:10px;">车牌号：</span>
          <div style="display:inline;">
            <el-input v-model="licensePlateInput" placeholder style="width:70%;" :disabled="true"></el-input>
          </div>
        </el-col>
        <el-col :span="7">
          <el-date-picker
            v-model="value1"
            type="datetimerange"
            value-format="yyyy-MM-dd hh:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width:95%;"
          ></el-date-picker>
        </el-col>
        <el-col :span="10">
          <el-button type="primary" @click="getList()">查询</el-button>
          <el-button
            type="success"
            icon="el-icon-video-play"
            style="margin-left:5%;"
            @click="startMove"
          >开始</el-button>
          <el-button type="success" icon="el-icon-video-pause" @click="pauseMove">暂停</el-button>
          <el-button type="warning" icon="el-icon-d-arrow-right" @click="resumeMove">快放</el-button>
          <el-button type="danger" icon="el-icon-close" @click="stopMove">取消</el-button>
        </el-col>
      </el-row>

      <el-col :span="16" class="map-col">
        <div :class="mapStyle" id="railMap"></div>

        <!--<div class="tabZujian">
          <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="静态信息" name="first" :key="'first'">
                  <child1 :infov="infov"></child1>
              </el-tab-pane>

              <el-tab-pane label="动态信息" name="second" :key="'second'">
                  <child2></child2>
              </el-tab-pane>

              <el-tab-pane label="预警信息" name="three" :key="'three'">
                  <child3></child3>
              </el-tab-pane>
          </el-tabs>

        </div>-->
      </el-col>
      <el-col :span="8" class="map-col">
        <div style="width:100%;background-color:#fff;margin-left:10px;padding:3%;">
          <div class="charts" v-show="dataY">
            <div id="barGraph" ref="barChart" :class="[screen=='0'?'screenS':'screenL']"></div>
          </div>
          <div v-show="dataN" :class="[screen=='0'?'screenS':'screenL']" class="dataNStyle">
            <div>燃料电池单体电压</div>
            <div class="txtinfo"><img src="@/assets/img/statistics/noData.png" alt=""></div>
          </div>
          <div class="charts" v-show="dataY">
            <div id="scatterGraph" ref="scatterChart" :class="[screen=='0'?'screenS':'screenL']"></div>
          </div>
          <div v-show="dataN" :class="[screen=='0'?'screenS':'screenL']" class="dataNStyle">
            <div>耐久性衰减情况</div>
            <div class="txtinfo"><img src="@/assets/img/statistics/noData.png" alt=""></div>
          </div>
          <div>
            <el-col :span="12">
              <div class="charts" v-show="dataY">
                <div id="pieGraphL" ref="pieLChart" :class="[screen=='0'?'screenS':'screenL']"></div>
              </div>
              <div v-show="dataN" :class="[screen=='0'?'screenS':'screenL']" class="dataNStyle1">
                <div>纯氢续驶里程</div>
                <div class="txtinfo"><img src="@/assets/img/statistics/noData.png" alt=""></div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="charts" v-show="dataY">
                <div id="pieGraphR" ref="pieRChart" :class="[screen=='0'?'screenS':'screenL']"></div>
              </div>
              <div v-show="dataN" :class="[screen=='0'?'screenS':'screenL']" class="dataNStyle1">
                <div>纯电续驶里程</div>
                <div class="txtinfo"><img src="@/assets/img/statistics/noData.png" alt=""></div>
              </div>
            </el-col>
          </div>
          <div v-show="dataY">
            <el-form ref="ruleForm" label-width="100px">
              <el-form-item label-width="0">
                <el-button>更多分析</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Config from "@/assets/js/config.js";
import China from "../../../node_modules/echarts/map/js/china.js"; // 引入中国地图数据
import AMap from "AMap";
import tabChild1 from "@/views/monitoringPlatform/tabChild1";
import tabChild2 from "@/views/monitoringPlatform/tabChild2";
import tabChild3 from "@/views/monitoringPlatform/tabChild3";
import { getHistory } from "@/assets/api/bicycleHistory.js";

let echarts = require("echarts/lib/echarts");
require("echarts/lib/chart/bar");
require("echarts/lib/chart/pie");
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
export default {
  name: "VehicleSurvey",
  components: {
    child1: tabChild1,
    child2: tabChild2,
    child3: tabChild3,
  },
  data() {
    let self = this;
    return {
      adcode: [
        110000,
        120000,
        130000,
        140000,
        150000,
        210000,
        220000,
        230000,
        310000,
        320000,
        330000,
        340000,
        350000,
        360000,
        370000,
        410000,
        420000,
        430000,
        440000,
        450000,
        460000,
        500000,
        510000,
        520000,
        530000,
        540000,
        610000,
        620000,
        630000,
        640000,
        650000,
      ],
      durability: [], //耐久性
      lonAlat: [], //经纬度
      pureEleOdometer: [], //累计纯电里程
      pureHydOdometer: [], //累计纯氢里程
      voltage: [], //电压
      timeList: [], //耐久度时间
      timeOutObj: {},
      marker: {},
      lineArr: [],
      startMoveF: false,
      activeName: "first",
      screen: 1,
      historyF: true,
      speed: 200, //车辆速度
      speedn: 0, //图形数组下标
      drawt: 0, //图形重新生成时间
      licensePlateInput: this.$router.history.current.query.vehicleNum,
      vinCode: this.$router.history.current.query.vin,
      mapStyle: "map",
      autofocus: true,
      firstF: true,
      dataY: true,
      dataN: false,
      unitVoltageV: [],
      infov: {},
      isChildUpdate1: true,
      isChildUpdate2: false,
      searchFlag: false, //搜索框
      carLine: {},
      formSearch: {
        vinOrVehicleNum: "", //车架号或者车牌号搜索
      },
      railMap: null, //地图的实例对象
      currentMarker: {}, //添加文本点
      vehicleList: [], //当前车辆数
      markers: [],
      center: [117.094048, 39.149218],
      zoom: 4,
      groupShow: true, //判断覆盖物分组是否显示
      markerGroups: [],
      chart: null,
      statistics: {},
      statisticsF: {},
      mapInitFlag: false, //判断高德是否初始化
      options: {
        // 进行相关配置
        tooltip: {
          trigger: "item",
          formatter: function (params) {
            let value = 0;
            if (!isNaN(params.value)) {
              value = params.value;
            }
            return params.name + "：" + value;
          },
        },
        backgroundColor: "#FFFFFF",
        visualMap: {
          show: true,
          min: 0,
          max: 500,
          text: ["High", "Low"],
          realtime: true,
          calculable: true,
          color: ["#304DA4", "#20C4B7"],
        },
        geo: {
          // 这个是重点配置区
          map: "china", // 表示中国地图
          roam: false, //禁止缩放
          label: {
            normal: {
              show: true, // 是否显示对应地名
              textStyle: {
                color: "rgba(0,0,0,1)",
                fontSize: 8,
              },
            },
          },
          itemStyle: {
            normal: {
              borderColor: "rgba(0, 0, 0, 0.2)",
            },
            emphasis: {
              areaColor: null,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowBlur: 20,
              borderWidth: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },

        series: [
          {
            type: "scatter",
            coordinateSystem: "geo", // 对应上方配置
          },
          {
            type: "map",
            geoIndex: 0,
            data: [],
          },
        ],
      },

      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      value1: "",
      value2: "",
      echarts1: null,
      echarts2: null,
      echarts3: null,
      echarts4: null,
    };
  },
  methods: {
    //加载相关组件
    loadMapUi() {
      let that = this;
      AMapUI.load(["ui/geo/DistrictCluster", "lib/$"], function (
        DistrictCluster,
        $
      ) {
        //启动页面
        that.initPage(DistrictCluster, $);
      });
    },
    //初始化页面
    initPage(DistrictCluster, $) {
      let that = this;
      var distCluster = new DistrictCluster({
        map: that.map, //所属的地图实例
        zIndex: 11,
        autoSetFitView: false,
        getPosition: function (item) {
          if (!item) {
            return null;
          }

          var parts = item.split(",");

          //返回经纬度
          return [parseFloat(parts[0]), parseFloat(parts[1])];
        },
      });
      window.distCluster = distCluster;
      this.serchVehiclesLink();
      this.mapInitFlag = true;
    },
    getClickInfo(e) {
      this.center.lng = e.point.lng;
      this.center.lat = e.point.lat;
    },
    regionForMat(key) {
      let regionNameObj = {
        北京市: "北京",
        天津市: "天津",
        河北省: "河北",
        山西省: "山西",
        内蒙古自治区: "内蒙古",
        辽宁省: "辽宁",
        吉林省: "吉林",
        黑龙江省: "黑龙江",
        上海市: "上海",
        江苏省: "江苏",
        浙江省: "浙江",
        安徽省: "安徽",
        福建省: "福建",
        江西省: "江西",
        山东省: "山东",
        河南省: "河南",
        湖北省: "湖北",
        湖南省: "湖南",
        广东省: "广东",
        广西壮族自治区: "广西",
        海南省: "海南",
        重庆市: "重庆",
        四川省: "四川",
        贵州省: "贵州",
        云南省: "云南",
        西藏自治区: "西藏",
        陕西省: "陕西",
        甘肃省: "甘肃",
        青海省: "青海",
        宁夏回族自治区: "宁夏",
        新疆维吾尔自治区: "新疆",
      };
      return regionNameObj[key];
    },
    formatNum(num) {
      if (!/^(\+|-)?(\d+)(\.\d+)?$/.test(num)) {
        alert("wrong!");
        return num;
      }
      var a = RegExp.$1,
        b = RegExp.$2,
        c = RegExp.$3;
      var re = new RegExp().compile("(\\d)(\\d{3})(,|$)");
      while (re.test(b)) b = b.replace(re, "$1,$2$3");
      return a + "" + b + "" + c;
    },
    //websoket连接
    serchVehiclesLink() {
      clearInterval(this.serchVehiclesInterval);
      this.getVechicles();
      this.serchVehiclesInterval = setInterval(() => {
        this.getVechicles();
      }, 1000 * 60 * 30);
    },
    getVechicles() {
      let that = this;
      /*this.$http.get(`/monitor/map-vehicles/state`).then(({ data }) => {
                  if (data.code === "200") {
                    if (data.data) {
                      this.vehicleList = data.data;
                      if (window.distCluster && this.vehicleList.length > 0) {
                        this.showOverlayGroup(); //覆盖车牌及点载入
                        let postionData = [];
                        this.vehicleList.forEach(item => {
                          postionData.push(item.longitude + "," + item.latitude);
                        });
                        window.distCluster.setData(postionData);
                        window.distCluster.show();
                        let echartData = [];
                        for (let i = 0; i < this.adcode.length; i++) {
                          distCluster.getClusterRecord(this.adcode[i], function(
                            err,
                            res
                          ) {
                            if (res.dataItems.length != 0) {
                              echartData.push({
                                name: that.regionForMat(res.name),
                                value: res.dataItems.length || 0
                              });
                            }
                          });
                        }
                        this.options.series[1].data = echartData;
                      }
                    }
                  } else {
                    this.$message.error(data.msg);
                  }
                });*/
    },
    drawBar(dataItems) {
      // 基于dom，初始化echarts实例
      let data;
      if (dataItems && dataItems.length > 10) {
        data = dataItems.slice(dataItems.length - 11, dataItems.length - 1);
      } else {
        data = dataItems;
      }
      if (!this.echarts1) {
        this.echarts1 = echarts.init(document.getElementById("barGraph"));
      }
      // 绘制图表
      this.echarts1.setOption({
        title: {
          text: "燃料电池单体电压",
          subtext: "电压（v）",
          left: "left",
          textStyle: {
            fontSize: "16",
          },
          subtextStyle: {
            lineHeight: 0,
          },
        },
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c}",
        },
        grid: {
          left: "10%",
          right: "5%",
          top: "35%",
          bottom: "20%",
        },
        legend: {
          left: "center",
          data: [],
          bottom: 0,
        },
        color: ["#4A90E2", "#C4D9E9", "#61a0a8"],
        xAxis: {
          type: "category",
          //data: ['0', '20', '40', '60', '80', '100']
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            //data: [20, 5, 80, 65, 35, 99],
            data: data,
            type: "bar",
          },
        ],
      });
    },
    drawScatter(dataItems, date) {
      if (!this.echarts2) {
        this.echarts2 = echarts.init(document.getElementById("scatterGraph"));
      }
      this.echarts2.setOption({
        title: {
          text: "耐久性衰减情况",
          subtext: "电压（v）",
          x: "left",
          textStyle: {
            fontSize: "16",
          },
          subtextStyle: {
            lineHeight: 0,
          },
        },
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c} ",
        },
        grid: {
          left: "10%",
          right: "5%",
          top: "32%",
          bottom: "20%",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        color: ["#4A90E2", "#C4D9E9", "#61a0a8"],
        xAxis: {
          //data: ['11:10','11:10','11:10','11:10','11:10','11:10','11:10','11:10','11:11','11:10','11:11','11:10']
          data: date,
        },
        yAxis: {},
        series: [
          {
            symbolSize: 2,
            /*data: [
                            [10.0, 8.04],
                            [8.0, 6.95],
                            [13.0, 7.58],
                            [9.0, 8.81],
                            [11.0, 8.33],
                            [14.0, 9.96],
                            [6.0, 7.24],
                            [4.0, 4.26],
                            [12.0, 10.84],
                            [7.0, 4.82],
                            [5.0, 5.68]
                        ],*/
            data: dataItems,
            type: "scatter",
          },
        ],
      });
    },
    drawPieL(per, value1, value2) {
      if (!this.echarts3) {
        this.echarts3 = echarts.init(document.getElementById("pieGraphL"));
      }
      this.echarts3.setOption({
        title: {
          text: "纯氢续驶里程",
          left: "left",
          textStyle: {
            fontSize: "16",
          },
        },
        grid: {
          left: "10%",
          right: "0",
          top: "40%",
          bottom: "0",
        },
        graphic: [
          {
            type: "text",
            left: "center",
            top: "center",
            bottom: 0,
            style: {
              text: per,
              textAlign: "center",
              fill: "#000",
              width: 30,
              height: 30,
              fontSize: 22,
              color: "#2C405A",
              fontFamily: "Microsoft YaHei",
            },
          },
        ],
        series: [
          {
            name: "",
            type: "pie",
            radius: ["50%", "70%"],
            center: ["50%", "52%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
              fontSize: "26",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "30",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: true,
            },
            data: [
              {
                value: value1,
                name: "60%",
                itemStyle: {
                  normal: {
                    color: "#64D284",
                    label: {
                      show: true,
                      position: "center",
                      formatter: "{b}:{d}%",
                      textStyle: {
                        baseline: "bottom",
                        fontSize: "16",
                      },
                    },
                    labelLine: {
                      show: true,
                    },
                  },
                },
              },
              {
                value: value2,
                name: "40%",
                itemStyle: {
                  normal: {
                    color: "#4A90E2",
                  },
                },
              },
            ],
          },
        ],
      });
    },

    drawPieR(per, value1, value2) {
      if (!this.echarts4) {
        this.echarts4 = echarts.init(document.getElementById("pieGraphR"));
      }
      this.echarts4.setOption({
        title: {
          text: "纯电续驶里程",
          left: "left",
          y: "top",
          textStyle: {
            fontSize: "16",
          },
        },
        grid: {
          left: "10%",
          right: "0",
          top: "40%",
          bottom: "0",
        },
        graphic: [
          {
            type: "text",
            left: "center",
            top: "center",
            bottom: 0,
            style: {
              text: per,
              textAlign: "center",
              textVerticalAlign: "bottom",
              fill: "#000",
              width: 30,
              height: 30,
              fontSize: 22,
              color: "#2C405A",
              fontFamily: "Microsoft YaHei",
            },
          },
        ],
        series: [
          {
            name: "",
            type: "pie",
            radius: ["50%", "70%"],
            center: ["50%", "52%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
              fontSize: "26",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "50",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: true,
            },
            data: [
              {
                value: value1,
                name: "90%",
                itemStyle: {
                  normal: {
                    color: "#64D284",
                    label: {
                      show: true,
                      position: "center",
                      formatter: "{b}:{d}%",
                      textStyle: {
                        baseline: "bottom",
                        fontSize: "16",
                      },
                    },
                    labelLine: {
                      show: true,
                    },
                  },
                },
              },
              {
                value: value2,
                name: "10%",
                itemStyle: {
                  normal: {
                    color: "#4A90E2",
                  },
                },
              },
            ],
          },
        ],
      });
    },
    goHistory() {
      this.historyF = true;
      if (this.screen == 0) {
        this.mapStyle = "mapS";
      } else {
        this.mapStyle = "mapM";
      }
    },
    goBicycle() {
      this.$router.push({
        name: "Bicycle",
        query: { vin: this.vinCode },
      });
    },
    goSearch() {
      if (this.licensePlateInput == "null" || this.licensePlateInput == "") {
        this.$message.warning("请输入车牌号！");
        return;
      }
      if (this.value1 == "null" || this.value1 == "") {
        this.$message.warning("请选择开始和结束时间！");
        return;
      }
      this.historyF = true;
      this.mapStyle = "map";
    },
    searchRailHistory() {
      var marker,
        lineArr = [
          [116.478935, 39.997761],
          [116.478939, 39.997825],
          [116.478912, 39.998549],
          [116.478912, 39.998549],
          [116.478998, 39.998555],
          [116.478998, 39.998555],
          [116.479282, 39.99856],
          [116.479658, 39.998528],
          [116.480151, 39.998453],
          [116.480784, 39.998302],
          [116.480784, 39.998302],
          [116.481149, 39.998184],
          [116.481573, 39.997997],
          [116.481863, 39.997846],
          [116.482072, 39.997718],
          [116.482362, 39.997718],
          [116.483633, 39.998935],
          [116.48367, 39.998968],
          [116.484648, 39.999861],
        ];
      //let marker,linArr;
      this.railMap = new AMap.Map("railMap", {
        resizeEnable: true,
        center: [116.397428, 39.90923],
        zoom: 17,
      });

      // marker = new AMap.Marker({
      //     map: this.map,
      //     position: [116.478935,39.997761],
      //     //position: trackPoint[0],
      //     icon: "https://webapi.amap.com/images/car.png",
      //     offset: new AMap.Pixel(-26, -13),
      //     autoRotation: true,
      //     angle:-90,
      // });

      // // 绘制轨迹
      // var polyline = new AMap.Polyline({
      //     map: this.map,
      //     path: lineArr,
      //     showDir:true,
      //     strokeColor: "#28F",  //线颜色
      //     // strokeOpacity: 1,     //线透明度
      //     strokeWeight: 6,      //线宽
      //     // strokeStyle: "solid"  //线样式
      // });

      // var passedPolyline = new AMap.Polyline({
      //     map: this.map,
      //     // path: lineArr,
      //     strokeColor: "#AF5",  //线颜色
      //     // strokeOpacity: 1,     //线透明度
      //     strokeWeight: 6,      //线宽
      //     // strokeStyle: "solid"  //线样式
      // });
      // marker.on('moving', function (e) {
      //     passedPolyline.setPath(e.passedPath);
      // });

      // this.map.setFitView(polyline);
      // marker.moveAlong(lineArr, 1000);
    },
    init() {
      const self = this;
      window.onresize = function () {
        setTimeout(() => {
          self.chart1 = echarts.init(self.$refs.barChart);
          self.chart1.resize();
          self.chart2 = echarts.init(self.$refs.scatterChart);
          self.chart2.resize();
          self.chart3 = echarts.init(self.$refs.pieLChart);
          self.chart3.resize();
          self.chart4 = echarts.init(self.$refs.pieRChart);
          self.chart4.resize();
        }, 20);
      };
      setTimeout(() => {
        self.chart1 = echarts.init(self.$refs.barChart);
        self.chart1.resize();
        self.chart2 = echarts.init(self.$refs.scatterChart);
        self.chart2.resize();
        self.chart3 = echarts.init(self.$refs.pieLChart);
        self.chart3.resize();
        self.chart4 = echarts.init(self.$refs.pieRChart);
        self.chart4.resize();
      }, 20);
    },
    handleClick(tab) {
      if (tab.name == "first") {
        this.isChildUpdate1 = true;
        this.isChildUpdate2 = false;
      } else if (tab.name == "second") {
        this.isChildUpdate1 = false;
        this.isChildUpdate2 = true;
      }
    },
    screenfun() {
      let widthv = document.body.clientWidth;
      if (widthv < 1366 || widthv == 1366) {
        this.screen = 0;
      } else {
        this.screen = 1;
      }
    },
    goStatistics() {
      this.$router.push("/statistics/statisticalAnalysis");
    },
    //计算list改变
    monitorVehicles() {
      return this.$store.state.currentMonitorVehicle;
    },

    getList() {
      console.log(this.value1);
      getHistory({
        // startTime: "2020-07-01 00:00:00",
        // endTime: "2020-07-01 23:59:59",
        // vin: "LFV2A21K9J4002009"
        startTime: this.value1[0],
        endTime: this.value1[1],
        vin: this.$router.history.current.query.vin,
      })
        .then((resp) => {
          if (resp.data.vehicleList.length == 0) {
            //this.$message.warning("查询数据为空！");
            this.dataN = true;
            this.dataY = false;
          } else {
            this.dataN = false;
            this.dataY = true;
            console.log(resp);
            resp.data.vehicleList.forEach((item) => {
              this.durability.push(item.durability);
              this.lineArr.push([item.longitude, item.latitude]);
              this.pureEleOdometer.push(item.pureEleOdometer);
              this.pureHydOdometer.push(item.pureHydOdometer);
              this.voltage.push(item.voltage);
              this.timeList.push(item.time);
            });
            this.$nextTick(() => {
              this.drawHistoryLine();
              console.log(this.voltage.slice(0, 10));
              this.drawBar(this.voltage.slice(0, 10));
              this.drawScatter(this.durability, this.timeList);
              this.setdrawPie(this.pureHydOdometer, this.pureEleOdometer);
            });
          }
        })

        .catch((error) => {
          this.$message.error("查询失败");
        });
    },
    setdrawBar(data) {
      let dataArr = [];
      for (let i = 0; i < 6; i++) {
        dataArr.push(data[i]);
      }
      this.drawBar(dataArr);
    },
    setdrawScatter(data) {
      this.drawScatter(data);
    },
    setdrawPie(arrL, arrR) {
      let addV = parseInt(arrL[0]) + parseInt(arrR[0]);
      if (addV == 0) {
        addV = 1;
      }
      let per = Math.round((parseInt(arrL[0]) / addV) * 100) + "%";
      if (per == 0) {
        per = 1;
      }
      let per1 = Math.round((parseInt(arrR[0]) / addV) * 100) + "%";
      if (per1 == 0) {
        per1 = 1;
      }
      this.drawPieL(per, parseInt(arrL[0]), parseInt(arrR[0]));
      this.drawPieR(per1, parseInt(arrR[0]), parseInt(arrL[0]));
    },
    setdrawPieM(L, R) {
      let addV = parseInt(L) + parseInt(R);
      if (addV == 0) {
        addV = 1;
      }
      let per = Math.round((parseInt(L) / addV) * 100) + "%";
      if (per == 0) {
        per = 1;
      }
      let per1 = Math.round((parseInt(R) / addV) * 100) + "%";
      if (per1 == 0) {
        per1 = 1;
      }
      this.drawPieL(per, parseInt(L), parseInt(R));
      this.drawPieR(per1, parseInt(L), parseInt(R));
    },
    mapInit() {
      this.railMap = new AMap.Map("railMap", {
        resizeEnable: true,
        center: [116.397428, 39.90923],
        zoom: 17,
      });
    },
    drawHistoryLine() {
      //this.lineArr = [[116.478935,39.997761],[116.478939,39.997825],[116.478912,39.998549],[116.478912,39.998549],[116.478998,39.998555],[116.478998,39.998555],[116.479282,39.99856],[116.479658,39.998528],[116.480151,39.998453],[116.480784,39.998302],[116.480784,39.998302],[116.481149,39.998184],[116.481573,39.997997],[116.481863,39.997846],[116.482072,39.997718],[116.482362,39.997718],[116.483633,39.998935],[116.48367,39.998968],[116.484648,39.999861]];
      let deviceSize = new AMap.Size(26, 13);
      let carIcon = new AMap.Icon({
        image: "https://webapi.amap.com/images/car.png",
        size: deviceSize,
        //会以base64的方式传参iconCar
        imageSize: deviceSize,
      });
      this.marker = new AMap.Marker({
        map: this.railMap,
        //position: [116.478935,39.997761],
        position: this.lineArr[0],
        icon: carIcon,
        offset: new AMap.Pixel(-26, -5),
        autoRotation: true,
        angle: -90,
      });

      // 绘制轨迹
      let polyline = new AMap.Polyline({
        map: this.railMap,
        path: this.lineArr,
        showDir: true,
        strokeColor: "#28F", //线颜色
        // strokeOpacity: 1,     //线透明度
        strokeWeight: 6, //线宽
        // strokeStyle: "solid"  //线样式
      });

      let passedPolyline = new AMap.Polyline({
        map: this.railMap,
        // path: lineArr,
        strokeColor: "#AF5", //线颜色
        // strokeOpacity: 1,     //线透明度
        strokeWeight: 6, //线宽
        // strokeStyle: "solid"  //线样式
      });

      this.marker.on("moving", function (e) {
        passedPolyline.setPath(e.passedPath);
      });

      this.railMap.setFitView();
    },

    startMove() {
      clearInterval(this.timeOutObj);
      this.speed = 200;
      this.drawt = 500;
      this.mainControl();
      if (!this.startMoveF) {
        this.marker.moveAlong(this.lineArr, this.speed);
      } else {
        this.marker.moveAlong(this.lineArr, this.speed);
        this.marker.resumeMove();
      }
    },

    pauseMove() {
      clearInterval(this.timeOutObj);
      this.marker.pauseMove();
      this.startMoveF = true;
    },

    resumeMove() {
      clearInterval(this.timeOutObj);
      this.speed = 2000;
      this.speedn = 0;
      this.drawt = 100;
      this.mainControl();
      this.marker.moveAlong(this.lineArr, this.speed);
      this.marker.resumeMove();
    },

    stopMove() {
      clearInterval(this.timeOutObj);
      this.speedn = 0;
      this.marker.stopMove();
      this.startMoveF = false;
    },

    mainControl() {
      let len = this.durability.length;
      let durabilityA = [];
      let pureEleOdometerA = [];
      let pureHydOdometerA = [];
      let voltageA = [];

      this.timeOutObj = setInterval(() => {
        durabilityA.push(this.durability[this.speedn]);
        pureEleOdometerA.push();
        pureHydOdometerA.push();
        voltageA.push(this.voltage[this.speedn]);
        //this.timeList.push(item.time);
        this.drawBar(voltageA);
        this.drawScatter(durabilityA, this.timeList);

        this.setdrawPieM(
          this.pureHydOdometer[this.speedn],
          this.pureEleOdometer[this.speedn]
        );

        this.speedn++;
      }, this.drawt);
    },
  },
  computed: {
    num() {
      return this.formatNum(5266);
    },
  },
  watch: {},

  filters: {
    formatVehicleDuration(time) {
      if (time == "null" || time == undefined) {
        return "-";
      } else {
        return (time / 3600).toFixed(2);
      }
    },
  },

  created() {
    //this.webSocketLink(Config.webLocalHost + "/vehicleData/"+ 'LFV2A21K9J4002009');
    this.screenfun();
  },

  mounted() {
    this.drawBar();
    //this.drawScatter();
    this.drawPieL();
    this.drawPieR();
    this.mapInit();
    //this.init();
    this.getList();
  },

  beforeDestroy() {
    if (this.websocket) {
      //判断websoket存在关闭
      this.websocket.onclose = function () {
        console.log("关闭心跳发送");
      };
      this.websocket.close();
    }
    clearInterval(this.serchVehiclesInterval);
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  beforeRouteLeave(to, form, next) {
    if (this.websocket) {
      //判断websoket存在关闭
      this.websocket.onclose = function () {
        console.log("关闭心跳发送");
      };
      clearInterval(this.serchVehiclesInterval);
      this.websocket.close();
    }
    next();
  },
};
</script>

<style lang='less' scoped>
// 地图标记
/deep/ .onlineMapCar {
  background: #22b14c;
  color: #000000;
  text-align: center;
  white-space: nowrap;
}

/deep/ .offlineMapCar {
  background: #7f7f7f;
  color: #ffffff;
  text-align: center;
  white-space: nowrap;
}

/deep/ .abnormal {
  background: #fa7d26;
  color: #000000;
  text-align: center;
  white-space: nowrap;
}

/deep/ .onlineMapCar:after {
  content: "";
  display: block;
  position: absolute;
  width: 0;
  height: 0;
  border: solid rgba(0, 0, 0, 0);
  border-width: 6px;
  left: 28px;
  bottom: -12px;
  border-top-color: #22b14c;
}

/deep/ .onlineMapCar:before {
  content: "";
  display: block;
  position: absolute;
  border-radius: 50%;
  width: 6px;
  height: 6px;
  left: 31px;
  bottom: -12px;
  background: #22b14c;
}

/deep/ .offlineMapCar:after {
  content: "";
  display: block;
  position: absolute;
  width: 0;
  height: 0;
  border: solid rgba(0, 0, 0, 0);
  border-width: 6px;
  left: 28px;
  bottom: -12px;
  border-top-color: #7f7f7f;
}

/deep/ .offlineMapCar:before {
  content: "";
  display: block;
  position: absolute;
  border-radius: 50%;
  width: 6px;
  height: 6px;
  left: 31px;
  bottom: -12px;
  background: #7f7f7f;
}

/deep/ .abnormal:after {
  content: "";
  display: block;
  position: absolute;
  width: 0;
  height: 0;
  border: solid rgba(0, 0, 0, 0);
  border-width: 6px;
  left: 28px;
  bottom: -12px;
  border-top-color: #fa7d26;
}

/deep/ .abnormal:before {
  content: "";
  display: block;
  position: absolute;
  border-radius: 50%;
  width: 6px;
  height: 6px;
  left: 31px;
  bottom: -12px;
  background: #fa7d26;
}

/deep/ .content {
  position: relative;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
}

/deep/ .map {
  width: 100%;
  height: 85%;
  margin-top: 10px;
}

.mapM {
  width: 100%;
  height: 85%;
  margin-top: 10px;
}

.mapS {
  width: 100%;
  height: 81%;
  margin-top: 10px;
}

.echarts {
  width: 100%;
  height: 100%;
}

.vinOrVehicleNum {
  position: absolute;
  left: 20px;
  top: 10px;
  z-index: 100;

  .el-input {
    width: 200px;
    display: inline-block;
  }
}

#loadingTip {
  position: absolute;
  z-index: 9999;
  top: 0;
  left: 0;
  padding: 3px 10px;
  background: red;
  color: #fff;
  font-size: 14px;
}

.content {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.content-row {
  height: 100%;
  margin: 0.5%;
  padding: 0;
}

.map-col {
  height: 100%;
  background: #fff;
  padding: 10px;
  //margin-right: 15px;
}

.box-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  height: 90px;
  padding: 10px;
  color: #fff;
  border-radius: 5px;
  position: relative;

  .unit {
    position: absolute;
    left: 5px;
    top: 5px;
    font-size: 12px;
  }
}

.box-item:nth-child(1),
.box-item:nth-child(3) {
  margin-right: 10px;
}

.box-item i {
  font-size: 28px;
  margin-left: 10px;
}

.boxItemText {
  flex: 1;
  margin-left: 10px;
  line-height: 24px;
  cursor: pointer;
  overflow: hidden;

  div:first-child {
    font-size: 14px;
    text-align: center;
  }

  div:last-child {
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.tabBlock {
  background-color: #fff;
  padding: 10px;
  margin-top: 1%;
}

.el-form-item {
  text-align: center;
}

.screenS {
  width: 100%;
  height: 140px;
}

.screenL {
  width: 100%;
  height: 220px;
}

.content-rowTop {
  margin: 0 0.5% 0.5% 0.5%;
}

.backgroundColorFFF {
  background-color: #fff;
}

.dataNStyle {
  width: 90%;
  padding: 1%;
  margin: 2%;
  border: #f6f6f6 solid 1px;
}

.dataNStyle .txtinfo {
  text-align: center;
  margin-top: 15%;
}

.dataNStyle1 {
  width: 80%;
  padding: 1%;
  margin: 2% 0 0 3.5%;
  border: #f6f6f6 solid 1px;
}

.dataNStyle1 .txtinfo {
  text-align: center;
  margin-top: 30%;
}
</style>
