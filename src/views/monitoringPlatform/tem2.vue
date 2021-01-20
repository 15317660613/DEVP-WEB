<template>
  <div class="flexBlock">
  <div class="content">
    <el-row>
      <el-col :span="8"><div style="position: relative;"><img src="@/assets/img/statistics/car1.jpg" width="100%" style="min-width:440px;">
        <div style="position:absolute;width:100%;left:0;top:0;padding:1%;border-bottom:#DCDFE6 solid 1px">
          <el-select v-model="value" placeholder="请选择车辆型号" style="width:40%;heigth:30px;">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-button type="primary" style="margin-left:5%;">查询</el-button>
        </div>
        <div style="position:absolute;width: 18%; height: 40px; left: 15%; top: 14%; cursor: pointer;" @click="goBasic"></div>
        <div style="position:absolute;width: 18%; height: 40px; right: 5%; top: 21%; cursor: pointer;" @click="goEconomy"></div>
        <div style="position:absolute;width: 18%; height: 40px; left: 10%; bottom: 14%; cursor: pointer;" @click="goDurability"></div>
        <div style="position:absolute;width: 18%; height: 40px; right: 16%; bottom: 18%; cursor: pointer;" @click="goColdStart"></div>
        </div>
      </el-col>
      <el-col :span="16">
          <el-row style="margin:0.2% 0 0 0;">
            <el-col :span="12">
              <div style="margin-left:1.4%;background-color:#fff;border:#DCDFE6 solid 1px;border-radius:5px;">
                <div class="tit">极化特性曲线</div>
                <div class="charts">
                  <div id="draw1Graph" ref="draw1Graph" :class="[screen==true ? 'heightS' : 'heightL']"></div>
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div style="margin-left:2%;background-color:#fff;border:#DCDFE6 solid 1px;border-radius:5px;">
                <div class="tit">电堆功率曲线</div>
                <div class="charts">
                  <div id="draw2Graph" ref="draw2Graph" :class="[screen==true ? 'heightS' : 'heightL']"></div>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row style="margin:0.7% 0 0 0;">
            <el-col :span="12">
              <div style="margin-left:1.4%;background-color:#fff;border:#DCDFE6 solid 1px;border-radius:5px;">
                <div class="tit">极化特性曲线</div>
                <div class="charts">
                  <div id="draw3Graph" ref="draw1Graph" :class="[screen==true ? 'heightS' : 'heightL']"></div>
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div style="margin-left:2%;background-color:#fff;border:#DCDFE6 solid 1px;border-radius:5px;">
                <div class="tit">电堆功率曲线</div>
                <div class="charts">
                  <div id="draw4Graph" ref="draw2Graph" :class="[screen==true ? 'heightS' : 'heightL']"></div>
                </div>
              </div>
            </el-col>
          </el-row>
      </el-col>
    </el-row>

    <el-row style="background-color:#fff;padding:1%;margin-top:0.5%;">
      <el-col :span="24"><div style="font-size:16px;font-weight:bold;color:#333;">问题定位</div></el-col>
      <el-col :span="8">
        <div style="margin:1% 0 0 1.4%;background-color:#fff;border:#DCDFE6 solid 1px;border-radius:5px;">
          <div class="tit">氢电里程</div>
          <div class="charts">
            <div id="bottom1Graph" class="heightS"></div>
          </div>
        </div>

      </el-col>
      <el-col :span="8">
        <div style="margin:1% 0 0 1.4%;background-color:#fff;border:#DCDFE6 solid 1px;border-radius:5px;">
          <div class="tit">阴阳极压力</div>
          <div class="charts">
            <div id="bottom2Graph" class="heightS"></div>
          </div>
        </div>

      </el-col>
      <el-col :span="8">
        <div style="margin:1% 0 0 1.4%;background-color:#fff;border:#DCDFE6 solid 1px;border-radius:5px;">
          <div class="tit">电堆工作点</div>
          <div class="charts">
            <div id="bottom3Graph" class="heightS"></div>
          </div>
        </div>

      </el-col>
    </el-row>
  </div>
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
      name: 'tem2',
      data() {
      return {
        screen: this.GLOBAL.screenfun(),
      }
      },
      methods: {
        drawBottom1Graph(){
          let barGraph = echarts.init(document.getElementById('bottom1Graph'));
          barGraph.setOption({
          title: {
              subtext: '70MPa加氢量(t)',
                  left: 'center',
                  bottom: '1%',    
          },
          grid: {
                left: '10%',
                right: '10%',
                top: '-10%',
                bottom: '10%'
              },
          tooltip: {
              trigger: 'axis',
              axisPointer: {     
                  type: 'shadow' 
              },
              formatter: function (params) {
                  var tar = params[1];
                  return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
              }
        },
        grid: {
          x: '18%',
          y: 20,
          x2: 20,
          y2: 50 //距离下边的距离
        },
        xAxis: {
            type: 'value'
            
        },
        yAxis: {
            type: 'category',
            splitLine: {show: false},
            data: ['高压水泵', '电池包', '低压附件…', '空气压缩机', '驱动电机', '驱动电机']
        },
        series: [
            {
                name: '辅助',
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
                data: [0, 1700, 1400, 1200, 300, 0]
            },
            {
                name: '生活费',
                type: 'bar',
                stack: '总量',
                label: {
                    show: true,
                    position: 'inside'
                },
                data: [2900, 1200, 300, 200, 900, 300]
            }
        ]
          })
        },
        

        drawBottom2Graph(){
          let barGraph = echarts.init(document.getElementById('bottom2Graph'));
          barGraph.setOption({
          title: {
                    subtext: '时间(s)',
                        left: 'center',
                        bottom: '1%',    
                },
          tooltip: {
              trigger: 'axis'
          },
        grid: {
          x: '15%',
          y: 30,
          x2: 20,
          y2: 50
        },
          legend: {
              data: ['阳极入口压强', '阴极入口压强', '压差']
          },
          xAxis: {
              type: 'category',
              boundaryGap: false,
              data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          },
          yAxis: {
              type: 'value',
              name: '压强(kpa)',
            nameLocation: 'center',
            nameGap: 30,
            nameTextStyle:{
              color: '#999',
              fontSize: '12',
              padding: [0, 0,16, 0]
            },
          },
          series: [
              {
                  name: '阳极入口压强',
                  type: 'line',
                  stack: '总量',
                  data: [120, 132, 101, 134, 90, 230, 210]
              },
              {
                  name: '阴极入口压强',
                  type: 'line',
                  stack: '总量',
                  data: [220, 182, 191, 234, 290, 330, 310]
              },
              {
                  name: '压差',
                  type: 'line',
                  stack: '总量',
                  data: [150, 232, 201, 154, 190, 330, 410]
              }
          ]
          })
        },

        drawBottom3Graph(){
          let barGraph = echarts.init(document.getElementById('bottom3Graph'));
          barGraph.setOption({
          grid: {
          x: '10%',
          y: 30,
          x2: 20,
          y2: 50
        },
          xAxis: {},
              yAxis: {},
              series: [{
                  symbolSize: 20,
                  data: [
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
                  ],
                  type: 'scatter'
              }]
          })
        }, 
        
        
        draw1Graph(){
          let barGraph = echarts.init(document.getElementById('draw1Graph'));
          barGraph.setOption({
          color: '#1890FF',
          xAxis: {},
          yAxis: {
            name: '电压(V)',
            nameLocation: 'center',
            nameGap: 30,
            nameTextStyle:{
            color: '#999',
            fontSize: '12',
            padding: [0,0,0,0]
          },
              },
          grid: {
            left: '13%',
            right: '5%',
            top: '10%',
            bottom: '20%',
          },
          series: [{
              symbolSize: 20,
              data: [
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
              ],
              type: 'scatter'
          }]
          })
        }, 
        
        draw2Graph(){
          let barGraph = echarts.init(document.getElementById('draw2Graph'));
          barGraph.setOption({
          color: '#23C4A1',
          xAxis: {},
          yAxis: {
            name: '功率(kw)',
            nameLocation: 'center',
            nameGap: 30,
            nameTextStyle:{
            color: '#999',
            fontSize: '12',
            padding: [0,0,0,0]
          },
              },
          grid: {
            left: '13%',
            right: '5%',
            top: '10%',
            bottom: '20%',
          },
          series: [{
              symbolSize: 20,
              data: [
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
              ],
              type: 'scatter'
          }]
          })
        }, 
        
        draw3Graph(){
          let barGraph = echarts.init(document.getElementById('draw3Graph'));
          barGraph.setOption({
          color: '#1890FF',
          xAxis: {},
          yAxis: {
            name: '电压(V)',
            nameLocation: 'center',
            nameGap: 30,
            nameTextStyle:{
            color: '#999',
            fontSize: '12',
            padding: [0,0,0,0]
          },
              },
          grid: {
            left: '13%',
            right: '5%',
            top: '10%',
            bottom: '20%',
          },
          series: [{
              symbolSize: 20,
              data: [
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
              ],
              type: 'scatter'
          }]
          })
        },

        draw4Graph(){
          let barGraph = echarts.init(document.getElementById('draw4Graph'));
          barGraph.setOption({
          color: '#23C4A1',
          xAxis: {},
          yAxis: {
            name: '功率(kw)',
            nameLocation: 'center',
            nameGap: 30,
            nameTextStyle:{
            color: '#999',
            fontSize: '12',
            padding: [0,0,0,0]
          },
              },
          grid: {
            left: '13%',
            right: '5%',
            top: '10%',
            bottom: '20%',
          },
          series: [{
              symbolSize: 20,
              data: [
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
              ],
              type: 'scatter'
          }]
          })
        }, 

        goBasic(){
          this.$router.push('/statistics/basicPerformance');
        },
        goEconomy(){
          this.$router.push('/statistics/economy');
        },
        goDurability(){
          this.$router.push('/statistics/durability');
        },
        goColdStart(){
          this.$router.push('/statistics/coldStart');
        }
      
      },
      mounted() {
        this.draw1Graph();
        this.draw2Graph();
        this.draw3Graph();
        this.draw4Graph();
        this.drawBottom1Graph();
        this.drawBottom2Graph();
        this.drawBottom3Graph();
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
  overflow: auto;
  margin: 0.5%;
}
.content-rowTop {
  margin: 0.5%;
}
.tit {
  font-size: 14px;
  font-weight: bold;
  border-bottom: #DCDFE6 solid 1px;
  padding: 1% 1% 1% 3%;
  text-align: left;
}
.heightL {
  height: 261px;
}
.heightS {
  height: 176px;
}
.clearfix:after{content:".";display:block;height:0;clear:both;visibility:hidden}
</style>