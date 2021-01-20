<template>
  <div class="content">
    <el-row type="flex" justify="space-between" class="content-row">
      <el-col :span="16" class="map-col">
        <el-form class="vinOrVehicleNum" v-show="searchFlag" :model="formSearch">
          <el-input v-model="formSearch.vinOrVehicleNum" placeholder="请输入vin|车牌号"></el-input>
          <el-button type="primary" @click="searchVehicle">搜索</el-button>
        </el-form>
        <div class="map" id="map"></div>
        <!-- <el-amap
          ref="map"
          vid="map"
          :amapManager="amapManager"
          :center="center"
          :zoom="zoom"
          class="amap-demo"
          :events="events"
        >
        </el-amap>-->
      </el-col>
      <el-col :span="8" style="display: flex;flex-direction: column">
        <el-row type="flex" justify="space-between">
          <el-col :span="12" class="box-item" style="background: #20c7b9">
            <span class="unit">单位：量</span>
            <i class="el-icon-ali-ruwang"></i>
            <div
              class="boxItemText"
              :title="statistics.vehicleCounts == 'null'?'-':statistics.vehicleCounts"
            >
              <div>入网数量</div>
              <div>{{statistics.vehicleCounts == 'null'?'-':statistics.vehicleCounts}}</div>
            </div>
          </el-col>
          <el-col :span="12" class="box-item" style="background: #3048a5">
            <span class="unit">单位：小时</span>
            <i class="el-icon-ali-gongzuoshijian"></i>
            <div class="boxItemText" :title="statistics.vehicleDuration|formatVehicleDuration">
              <div>累计工作时间</div>
              <div>{{statistics.vehicleDuration|formatVehicleDuration}}</div>
            </div>
          </el-col>
        </el-row>
        <el-row type="flex" justify="space-between">
          <el-col :span="12" class="box-item" style="background: #01b3d7">
            <span class="unit">单位：公里</span>
            <i class="el-icon-ali-licheng1"></i>
            <div
              class="boxItemText"
              :title="statistics.vehicleMileage== 'null'?'-':statistics.vehicleMileage"
            >
              <div>里程数量</div>
              <div>{{statistics.vehicleMileage== 'null'?'-':statistics.vehicleMileage}}</div>
            </div>
          </el-col>
          <el-col :span="12" class="box-item" style="background: #ff7e52">
            <span class="unit">单位：量</span>
            <i class="el-icon-ali-baojingguanli"></i>
            <div
              class="boxItemText"
              :title="statistics.vehicleAlarms== 'null'?'-':statistics.vehicleAlarms"
            >
              <div>报警数量</div>
              <div>{{statistics.vehicleAlarms== 'null'?'-':statistics.vehicleAlarms}}</div>
            </div>
          </el-col>
        </el-row>
        <div style="flex: 1;width:100%;" class="echartContant">
          <v-chart autoresize :options="options"></v-chart>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import "echarts/lib/component/title";
import "echarts/lib/component/tooltip";
import Config from "@/assets/js/config.js";
import China from "../../../node_modules/echarts/map/js/china.js"; // 引入中国地图数据
import AMap from "AMap";
export default {
  name: "VehicleSurvey",
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
        650000
      ],
      searchFlag: false, //搜索框
      formSearch: {
        vinOrVehicleNum: "" //车架号或者车牌号搜索
      },
      map: null, //地图的实例对象
      currentMarker: {}, //添加文本点
      vehicleList: [], //当前车辆数
      markers: [],
      center: [117.094048, 39.149218],
      zoom: 4,
      groupShow: true, //判断覆盖物分组是否显示
      markerGroups: [],
      chart: null,
      statistics: {},
      mapInitFlag: false, //判断高德是否初始化
      options: {
        // 进行相关配置
        tooltip: {
          trigger: "item",
          formatter: function(params) {
            let value = 0;
            if (!isNaN(params.value)) {
              value = params.value;
            }
            return params.name + "：" + value;
          }
        },
        backgroundColor: "#FFFFFF",
        visualMap: {
          show: true,
          min: 0,
          max: 500,
          text: ["High", "Low"],
          realtime: true,
          calculable: true,
          color: ["#304DA4", "#20C4B7"]
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
                fontSize: 8
              }
            }
          },
          itemStyle: {
            normal: {
              borderColor: "rgba(0, 0, 0, 0.2)"
            },
            emphasis: {
              areaColor: null,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowBlur: 20,
              borderWidth: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            }
          }
        },

        series: [
          {
            type: "scatter",
            coordinateSystem: "geo" // 对应上方配置
          },
          {
            type: "map",
            geoIndex: 0,
            data: []
          }
        ]
      }
    };
  },

  computed: {
    num() {
      return this.formatNum(5266);
    }
  },
  methods: {
    //加载相关组件
    loadMapUi() {
      let that = this;
      AMapUI.load(["ui/geo/DistrictCluster", "lib/$"], function(
        DistrictCluster,
        $
      ) {
        //启动页面
        that.initPage(DistrictCluster, $);
      });
    },
    mapInit() {
      this.map = new AMap.Map("map", {
        zoom: 4, //级别
        center: [117.094048, 39.149218] //中心点坐标
      });
      AMap.plugin(["AMap.ToolBar"], () => {
        // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
        this.map.addControl(
          new AMap.ToolBar({
            // 简易缩放模式，默认为 false
            liteStyle: true
          })
        );
      });
      this.map.on("zoomend", () => {
        this.searchFlag = true;
        if (this.map.getZoom() > 9 && this.groupShow) {
          this.markerGroups.show();
        } else {
          this.markerGroups.hide();
        }
      });
      this.loadMapUi();
    },
    //当前车辆展示
    showOverlayGroup() {
      let markers = this.vehicleList.map(item => {
        let markerClass;
        if (item.status == 1) {
          markerClass = "onlineMapCar";
        } else if (item.status == 0) {
          markerClass = "offlineMapCar";
        } else {
          markerClass = "abnormal";
        }
        let content = `<div class="${markerClass}">${item.vehicleNum}</div>`;
        let marker = new AMap.Marker({
          position: [item.longitude, item.latitude],
          extData: item.vin,
          content: content,
          anchor: "bottom-center",
          offset: new AMap.Pixel(0, 0)
        });
        let menuMonitor = this.$store.state.menu.filter(item => item.id == "2");
        let flag = false;
        if (menuMonitor.length > 0) {
          flag = menuMonitor[0].children.some(item => item.id == "22");
        }
        if (flag) {
          marker.on("click", e => {
            let clickVehicleList = this.vehicleList.filter(item => {
              return item.vin == e.target.getExtData();
            });
            this.$store.commit("addMonitorVehicles", clickVehicleList[0]);
            this.$router.push({
              path: "/monitor/oneVehicleMonitor"
            });
          });
        }
        return marker;
      });
      this.map.remove(this.markerGroups);
      this.markerGroups = new AMap.OverlayGroup(markers);
      this.map.add(this.markerGroups);
      this.markerGroups.hide();
    },
    //搜索当前车辆
    searchVehicle() {
      if (this.formSearch.vinOrVehicleNum) {
        this.groupShow = false;
        //判断输入框是否有内容
        let currentVehicleList = this.vehicleList.filter(item => {
          return (
            item.vin == this.formSearch.vinOrVehicleNum ||
            item.vehicleNum == this.formSearch.vinOrVehicleNum
          );
        });
        if (currentVehicleList.length > 0) {
          clearInterval(this.serchVehiclesInterval);
          window.distCluster.hide();
          this.map.remove(this.currentMarker);
          let markerClass;
          if (currentVehicleList[0].status == 1) {
            markerClass = "onlineMapCar";
          } else if (currentVehicleList[0].status == 0) {
            markerClass = "offlineMapCar";
          } else {
            markerClass = "abnormal";
          }
          let content = `<div class="${markerClass}">${currentVehicleList[0].vehicleNum}</div>`;
          this.currentMarker = new AMap.Marker({
            position: [
              currentVehicleList[0].longitude,
              currentVehicleList[0].latitude
            ],
            content: content,
            draggable: true,
            offset: new AMap.Pixel(-20, -30)
          });
          this.currentMarker.on("click", e => {
            this.$store.commit("addMonitorVehicles", currentVehicleList[0]);
            this.$router.push({
              path: "/monitor/oneVehicleMonitor"
            });
          });
          this.currentMarker.setMap(this.map);
          this.map.setFitView([this.currentMarker]);
        } else {
          this.$message.warning("搜索车辆不存在");
        }
      } else {
        this.groupShow = true;
        this.map.remove(this.currentMarker);
        this.serchVehiclesLink();
        this.map.setCenter([117.094048, 39.149218]);
        this.map.setZoom(4);
      }
    },
    //初始化页面
    initPage(DistrictCluster, $) {
      let that = this;
      var distCluster = new DistrictCluster({
        map: that.map, //所属的地图实例
        zIndex: 11,
        autoSetFitView: false,
        getPosition: function(item) {
          if (!item) {
            return null;
          }

          var parts = item.split(",");

          //返回经纬度
          return [parseFloat(parts[0]), parseFloat(parts[1])];
        }
      });
      window.distCluster = distCluster;
      this.serchVehiclesLink();
      this.mapInitFlag = true;
    },
    getClickInfo(e) {
      this.center.lng = e.point.lng;
      this.center.lat = e.point.lat;
    },
     regionForMat(key){
         let regionNameObj = {
           "北京市":"北京",
           "天津市":"天津",
           "河北省":"河北",
           "山西省":"山西",
           "内蒙古自治区":"内蒙古",
           "辽宁省":"辽宁",
           "吉林省":"吉林",
           "黑龙江省":"黑龙江",
           "上海市":"上海",
           "江苏省":"江苏",
           "浙江省":"浙江",
           "安徽省":"安徽",
           "福建省":"福建",
           "江西省":"江西",
           "山东省":"山东",
           "河南省":"河南",
           "湖北省":"湖北",
           "湖南省":"湖南",
           "广东省":"广东",
           "广西壮族自治区":"广西",
           "海南省":"海南",
           "重庆市":"重庆",
           "四川省":"四川",
           "贵州省":"贵州",
           "云南省":"云南",
           "西藏自治区":"西藏",
           "陕西省":"陕西",
           "甘肃省":"甘肃",
           "青海省":"青海",
           "宁夏回族自治区":"宁夏",
           "新疆维吾尔自治区":"新疆"
         }
         return regionNameObj[key]
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
    webSocketLink(url) {
      let that = this;
      let heartCheck = {
        timeout: 30000,
        timeoutObj: null,
        reset: function() {
          clearInterval(this.timeoutObj);
          return this;
        },
        start: function() {
          this.timeoutObj = setInterval(function() {
            that.websocket = new WebSocket(url);
          }, this.timeout);
        }
      };
      that.websocket = new WebSocket(url);
      that.websocket.onopen = function() {
        console.log("连接成功");
        that.websocket.send(that.$store.state.userId);
        heartCheck.reset();
      };
      that.websocket.onmessage = function(event) {
        let data = JSON.parse(event.data);
        that.statistics = data;
      };
      that.websocket.onclose = function(event) {
        that.$message.error("断开连接，30s后重新了连接");
        heartCheck.reset().start();
      };
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
      this.$http.get(`/monitor/map-vehicles/state`).then(({ data }) => {
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
      });
    }
  },
  filters: {
    formatVehicleDuration(time) {
      if (time == "null" || time == undefined) {
        return "-";
      } else {
        return (time / 3600).toFixed(2);
      }
    }
  },
  created() {},

  mounted() {
    this.mapInit();
   this.webSocketLink(Config.webLocalHost + "/platform/statistics");
  },

  beforeDestroy() {
    if (this.websocket) {
      //判断websoket存在关闭
      this.websocket.onclose = function() {
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
      this.websocket.onclose = function() {
        console.log("关闭心跳发送");
      };
      clearInterval(this.serchVehiclesInterval);
      this.websocket.close();
    }
    next();
  }
};
</script>

<style lang='less' scoped>
// 地图标记
/deep/.onlineMapCar {
  background: #22b14c;
  color: #000000;
  text-align: center;
  white-space: nowrap;
}

/deep/.offlineMapCar {
  background: #7f7f7f;
  color: #ffffff;
  text-align: center;
  white-space: nowrap;
}
/deep/.abnormal {
  background: #fa7d26;
  color: #000000;
  text-align: center;
  white-space: nowrap;
}
/deep/.onlineMapCar:after {
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

/deep/.onlineMapCar:before {
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
/deep/.offlineMapCar:after {
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
/deep/.offlineMapCar:before {
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
/deep/.abnormal:after {
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
/deep/.abnormal:before {
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
.content {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
}
.map {
  width: 100%;
  height: 100%;
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
  width: 100%;
}

.content-row {
  height: 100%;
}

.map-col {
  height: 100%;
  background: #fff;
  padding: 10px;
  margin-right: 15px;
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
</style>
