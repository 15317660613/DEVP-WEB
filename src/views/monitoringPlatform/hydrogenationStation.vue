<template>
<div class="content">
  <div class="content-back">
    <div class="content-backBtn" @click="backHydrogenation"><img src="./images/back.png"> 返回</div>
    <div style="font-size: 12px;padding-left: 9px;float: left">{{$router.history.current.params.tenantName ? $router.history.current.params.tenantName : platformBasicV.platformName}}</div>
  </div>
    <el-row class="content-row">
      <el-col :span="14">
        <div class="clearfix">
          <div style="float:left;margin-right: 20px;">
            <div>
              <img v-show="!myMpa" src="./images/img-35.png" height="244px" />
              <img v-show="myMpa=='MPA35'" src="./images/img-35.png" height="244px" />
              <img v-show="myMpa=='MPA70'" src="./images/img-70.png" height="244px" />
            </div>
          </div>
          <div style="float:left;width:50%;">
            <ul class="ulStyle">
              <li style="font-size:18px; font-weight:bold;">{{platformBasicV.platformName}}</li>
              <li :class="{'fontsizes': screen}"><img src="./images/img_2.jpg">地址：{{platformBasicV.address == null ? '一' : platformBasicV.address}}<img src="./images/img_7.jpg" style="margin-left:5px;" v-show="platformBasicV.address != null"></li>
              <li :class="{'fontsizes': screen}"><img src="./images/img_3.jpg">城市：{{platformBasicV.city == null ? '一' : platformBasicV.city}}</li>
              <li :class="{'fontsizes': screen}"><img src="./images/img_4.jpg">营业时间：{{platformBasicV.businessHours == null ? '一' : platformBasicV.businessHours}}</li>
              <li :class="{'fontsizes': screen}"><img src="./images/img_5.jpg">电话：{{platformBasicV.telephone == null ? '一' : platformBasicV.telephone}}</li>
              <li :class="{'fontsizes': screen}"><img src="./images/img_6.jpg">上线时间：{{platformBasicV.onlineTime == null ? '一' : platformBasicV.onlineTime}}</li>
            </ul>
          </div>
        </div>
      </el-col>
      <el-col :span="10">
        <div class="loading"><img src="./images/img_9.jpg" style="margin-right:5px;">加氢中</div>
        <el-col :span="24" style="margin-top:10px;">
          <div class="box clearfix">
            <div class="box-left">
              <img src="./images/img_8.jpg" style="margin-right:10px;vertical-align: bottom;"/>累计加氢量：{{platformBasicV.addTotal | formatNumber}}
            </div>
            <div style="width: 55%;float: right">
              <div class="clearfix">
                <div style="float:left;width:50%;">
                  <div class="fontSubTit">累计35MPa加氢量</div>
                  <div class="fontTit">{{platformBasicV.addTotalThr | formatNumber}}</div>
                </div>
                <div style="float:left;width:50%;">
                  <div class="fontSubTit">累计70MPa加氢量</div>
                  <div class="fontTit">{{platformBasicV.addTotalSev | formatNumber}}</div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="24" style="margin-top:10px;">
          <div class="box clearfix">
            <div class="box-left">
              <img src="./images/img_8.jpg" style="margin-right:10px;vertical-align: bottom;"/>平均日加氢量：{{platformBasicV.avgAdd | formatNumber}}
            </div>
            <div style="width: 55%;float: right">
              <div class="clearfix">
                <div style="float:left;width:50%">
                  <div class="fontSubTit">平均日35MPa加氢量</div>
                  <div class="fontTit">{{platformBasicV.avgAddThr | formatNumber}}</div>
                </div>
                <div style="float:left;width:50%;">
                  <div class="fontSubTit">平均日70MPa加氢量</div>
                  <div class="fontTit">{{platformBasicV.avgAddSev | formatNumber}}</div>
                </div>
              </div>
            </div>
          </div>

        </el-col>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div  class="chartName" style="margin: 0 5px 0 10px;">每日加氢量</div>
        <div class="charts" style="margin:0 5px 0 10px;">
          <div id="barGraph" ref="barChart" :class="[screen ?'screenS':'screenL']" v-show="dataY"></div>
          <div style="width:100%;height:280px;font-size:26px;text-align:center;padding-top:110px;" v-show="dataN">无数据</div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="chartName" style="margin: 0 10px 0 5px;">加氢时间分布</div>
        <div class="charts" style="margin:0 10px 0 5px;">
          <div id="scatterGraph" ref="scatterChart" :class="[screen ?'screenS':'screenL']" v-show="dataY"></div>
          <div style="width:100%;height:280px;font-size:26px;text-align:center;padding-top:110px;" v-show="dataN">无数据</div>
          </div>
      </el-col>
    </el-row>
</div>
</template>

<script>
import Config from "@/assets/js/config.js";
let echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/bar');
require('echarts/lib/chart/pie');
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
  export default {
    name: 'hydrogenationStation',
    data() {
      return {
        screen: this.GLOBAL.screenfun(),
        firstF: true,
        platformBasicV: {},
        dataY: true,
        dataN: false,
        myMpa: 'MPA70',
      }
    },
    methods: {
      backHydrogenation(){
        this.$router.push({
          name: "HydrogenationStationList"
        });
      },
    drawBar(date,value1,value2){
      // 基于dom，初始化echarts实例
      let barGraph = echarts.init(document.getElementById('barGraph'));
      // 绘制图表
      barGraph.setOption({
        title : {
          subtext: '加氢量（kg）',
          x:'left'
        },

        tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    legend: {
        show: true,
        left: 'center',
        data: ['35MPa','70MPa'],
        bottom:0
      },
    color: ['#4A90E2','#50E3C2'],
    grid: {
        left: '20px',
      top: '35px',
        right: '30px',
        bottom: '40px',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        data: date

    },
    yAxis: {
       type: 'value'
    },
    series: [
        {
            name: '35MPa',
            type: 'bar',
            stack: '总量',
            label: {
                show: true,
                align: 'center'
            },
            data: value1
        },
        {
            name: '70MPa',
            type: 'bar',
            stack: '总量',
            label: {
                show: true,
                align: 'center'
            },
            data: value2
        }

    ]

      })
    },
  drawScatter(valueR,week){
    let pieGraph = echarts.init(document.getElementById('scatterGraph'));
    pieGraph.setOption({
      title : {
        subtext: '时间',
        x:'left'
      },
      tooltip : {
      trigger: 'item',
      formatter: "{c}{时}"
    },
    color: ['#4A90E2','#2f4554', '#61a0a8'],
    xAxis: {
      axisTick: {show: false},
      data: week,
    },
      grid: {
        left: '20px',
        right: '30px',
        bottom: '0px',
        top: '35px',
        containLabel: true
      },
    yAxis: {},
      series: [{
        type: 'scatter',
        symbolSize: 10,
          data: valueR
      }]
    })
  },
  screenfun() {
    let widthv = document.body.clientWidth;
    if(widthv < 1366 || widthv == 1366){
      this.screen = true;
    }else{
      this.screen = false;
    }
  },
  init() {
    const self = this;//因为箭头函数会改变this指向，指向windows。所以先把this保存

      window.onresize = function() {
        setTimeout(() => {
          self.chart = echarts.init(self.$refs.barChart);
          self.chart.resize();
          self.chart1 = echarts.init(self.$refs.scatterChart);
          self.chart1.resize();
        },20)
      }
      setTimeout(() => {
          self.chart = echarts.init(self.$refs.barChart);
          self.chart.resize();
          self.chart1 = echarts.init(self.$refs.scatterChart);
          self.chart1.resize();
        },20)
  },
    //websoket连接
  webSocketLink(url) {
    console.log(url);
    let that = this;
    let value1L = [];
    let value2L = [];
    let value1R = [];

    let dateL = [];
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
      //that.websocket.send('1280045291061088257');
      heartCheck.reset();
    };
    that.websocket.onmessage = function(event) {
      let data = JSON.parse(event.data);
      console.log(data);
      if(data.platformDailyHydVolumeList[0] != null){
        that.dataY = true;
        that.dataN = false;
      if(that.firstF){
        that.firstF = false;
        that.platformBasicV = data.platformBasic;

        for(let i=0; i<6; i++){
          let time = new Date(data.platformDailyHydVolumeList[i].statisticalDate);
          let d = time.getDate() + "日";
          dateL.push(d);
        }

        data.platformDailyHydVolumeList.forEach((item, index) => {
          value1L.push(item.addTotalThr);
          value2L.push(item.addTotalSev);
        });

        that.$options.methods.drawBar(dateL,value1L,value2L);
      }
        let week = [];
        data.platformDailyHydVolumeList.forEach((v,i) => {
          let f = true;
          let wv = '';
          v.distribution.forEach((item, index) => {
            let time1 = new Date(item);
            let w = time1.getDay();

            if(f){
              f = false;
              switch(w){
                case 0: week.push('周日');wv = '周日';break;
                case 1: week.push('周一');wv = '周一';break;
                case 2: week.push('周二');wv = '周二';break;
                case 3: week.push('周三');wv = '周三';break;
                case 4: week.push('周四');wv = '周四';break;
                case 5: week.push('周五');wv = '周五';break;
                case 6: week.push('周六');wv = '周六';break;
              };
            }
            let h = time1.getHours();
            value1R.push([wv,h]);

          });
        });
        that.$options.methods.drawScatter(value1R,week);
      // }else{
      //   that.platformBasicV = data.platformBasic;
      //   value1R.shift();
      //   week.shift();

      //     let f = true;
      //     let wv = '';
      //     data.platformDailyHydVolumeList[0].distribution.forEach((item, index) => {
      //       let time1 = new Date(item);
      //       let w = time1.getDay();

      //       if(f){
      //         f = false;
      //         switch(w){
      //           case 0: week.push('周日');wv = '周日';break;
      //           case 1: week.push('周一');wv = '周一';break;
      //           case 2: week.push('周二');wv = '周二';break;
      //           case 3: week.push('周三');wv = '周三';break;
      //           case 4: week.push('周四');wv = '周四';break;
      //           case 5: week.push('周五');wv = '周五';break;
      //           case 6: week.push('周六');wv = '周六';break;
      //         };
      //       }
      //       let h = time1.getHours();
      //       value1R.push([wv,h]);

      //     });

      //   //console.log(value1R);
      //   //console.log(week);
      //   that.$options.methods.drawScatter(value1R,week);
      // }
      }else{
        that.dataY = false;
        that.dataN = true;
        console.log('无数据');
      }

    };
    that.websocket.onclose = function(event) {
      //that.$message.error("断开连接，30s后重新了连接");
      heartCheck.reset().start();
    };
  },

  },
  created() {
    this.screenfun();
    this.webSocketLink(Config.webLocalHost + "/platform/"+ this.$router.history.current.query.platformId);
    this.myMpa = this.$router.history.current.query.mpa;
  },

  mounted() {
    this.drawBar();
    this.init();
  },

  }
</script>

<style scoped>
img {
  vertical-align: middle;
}
.content {
  position: relative;
  width: 100%;
  height: 100%;
  overflow-x:hidden;
}
.content-row {
  background: #fff;
  margin: 0 8px 8px 8px;
  padding: 5px;
  height: 280px;
}
.content-back{
  height: 34px;
  line-height: 34px;
  border-bottom: 1px solid #DCDFE6;
  margin: 0 8px;
  background-color: #FFFFFF;
  border-radius: 4px 4px 0px 0px
}
.content-backBtn {
  font-size: 12px;
  float: left;
  height: 17px;
  line-height: 17px;
  border-right: 1px solid black;
  padding: 0 9px;
  margin-top: 9px;
  cursor: pointer;
}
.content-backBtn:hover{
  color: #3D88CB;
}
.content-backBtn img {
  width: 12px;
  height: 10px;
  vertical-align:middle;
  margin-bottom: 4px;
}
.chartName {
  background:rgba(255,255,255,1);
  border-radius:4px 4px 0px 0px;
  border-bottom: 1px solid #DCDFE6;
  font-size: 14px;
  height: 32px;
  line-height: 32px;
  color:rgba(48,49,51,1);
  padding-left: 10px;
  font-family:PingFangSC-Medium,PingFang SC;
  font-weight: bolder;
}
.content-col {
  background: #fff;
}
.map-col {
  height: 100%;
  background: #fff;
  padding: 10px;
  /*margin-right: 15px;*/
}
ul.ulStyle, ul.ulStyle li {
  list-style: none;
}
ul.ulStyle li {
  padding: 2%;
}
ul.ulStyle li.fontsizes {
  font-size: 16px;
}
ul.ulStyle li img {
  margin-right: 5px;
  vertical-align: middle;
}
.loading {
  width: 98%;
  padding: 15px;
  background-color: #F0F9EA;
  text-align: center;
  color: #67C239;
}
.box {
  border: #E8E8E8 solid 2px;
  padding: 10px;
  height: 94px;
  margin-right: 10px;
}
.box-left{
  width: 45%;
  float: left;
  padding: 20px 20px 20px 10px;
  border-right: 1px solid #E8E8E8
}
.fontSubTit {
  text-align:center; color:#999;margin-top:10px;font-size:12px;
}
.fontTit {
  text-align:center;font-size:18px;margin-top:10px;
}

.contentBlock {
  width: 100%;
  margin: 5px;
  padding: 5px;
}
.contentBlock .left {
  float: left;
  width: 49%;
  background-color: #fff;
  padding: 8px;
}
.contentBlock .right {
  float: right;
  width: 49%;
  background-color: #fff;
  padding: 8px;
}
.charts {
  padding: 10px;
  background-color: #fff;
}
.screenS{
  width: 100%;
  height: calc(100vh - 460px);
}
.screenL{
  width: 100%;
  height: calc(100vh - 460px);
}
.clearfix:after{content:".";display:block;height:0;clear:both;visibility:hidden}
</style>
