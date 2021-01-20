<template>
  <div>
    <el-row>
      <el-col :span="12">
        <div style="margin-left:10px;background-color:#fff;border:#DCDFE6 solid 1px;border-radius:5px;">
          <div class="tit">实时氢泄漏报警</div>
          <div :class="[screen==true ? 'heightS' : 'heightL']" style="display: flex;align-items: center;justify-content: center">
            <div style="margin: 0 auto;display: flex">
              <div style="background-color: rgba(255,70,87,.14);padding: 20px;border-radius: 43px">
                <img src="@/assets/img/statistics/baojing.png" alt="" width="46px" height="46px">
              </div>
              <div style="margin-left: 30px;display: flex;flex-direction: column;justify-content: space-around">
                <div style="color: rgba(0,0,0,0.45);font-size: 14px">实时氢泄漏报警</div>
                <div><span style="font-size: 24px">{{realTimeHydrogenLeakageAlarm | formatNumber}}</span><span style="margin-left: 8px">%</span></div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div style="margin-left:10px;background-color:#fff;border:#DCDFE6 solid 1px;border-radius:5px;">
          <div class="tit">长期氢泄漏报警</div>
          <div :class="[screen==true ? 'heightS' : 'heightL']" style="display: flex;align-items: center;justify-content: center">
            <div style="margin: 0 auto;display: flex">
              <div style="background-color: rgba(255, 70, 87, 0.14);padding: 20px;border-radius: 43px" v-if="longTermHydrogenLeakageAlarm===1">
                <img src="@/assets/img/statistics/baojing.png" alt="" width="46px" height="46px">
              </div>
              <div v-else>
                <img src="@/assets/img/statistics/safe.png" alt="" width="86px" height="86px">
              </div>
<!--              <div style="margin-left: 30px;display: flex;flex-direction: column;justify-content: space-around">-->
<!--                <div style="color: rgba(0,0,0,0.45);font-size: 14px">长期氢泄漏报警</div>-->
<!--                <div><span style="font-size: 24px">{{realTimeHydrogenLeakageAlarm | formatNumber}}</span><span style="margin-left: 8px">%</span></div>-->
<!--              </div>-->
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row style="margin:10px 0 0 0;">
      <el-col :span="12">
        <div style="margin-left:10px;background-color:#fff;border:#DCDFE6 solid 1px;border-radius:5px;">
          <div class="tit">长期氢利用率</div>
          <div :class="[screen==true ? 'heightS' : 'heightL']" style="display: flex;align-items: center;justify-content: center">
            <div style="margin: 0 auto;display: flex">
              <div style="background-color: rgba(97,134,237,.14);padding: 17px 9px;border-radius: 43px">
                <img src="@/assets/img/statistics/qlyl.png" alt="" width="68px" height="51px">
              </div>
              <div style="margin-left: 30px;display: flex;flex-direction: column;justify-content: space-around">
                <div style="color: rgba(0,0,0,0.45);font-size: 14px">长期氢利用率</div>
                <div><span style="font-size: 24px">{{longTermHydrogenUtilization | formatNumber}}</span><span style="margin-left: 8px">%</span></div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div style="margin-left:2%;background-color:#fff;border:#DCDFE6 solid 1px;border-radius:5px;">
          <div class="tit">电堆寿命预警</div>
          <div :class="[screen==true ? 'heightS' : 'heightL']" style="display: flex;align-items: center;justify-content: center">
            <div style="margin: 0 auto;display: flex">
              <div style="background-color: rgba(255,157,61,.14);padding: 20px;border-radius: 43px">
                <img src="@/assets/img/statistics/ddsmyj.png" alt="" width="46px" height="46px">
              </div>
              <div style="margin-left: 30px;display: flex;flex-direction: column;justify-content: space-around">
                <div style="color: rgba(0,0,0,0.45);font-size: 14px">电堆寿命预警</div>
                <div><span style="font-size: 24px">{{earlyWarningOfStackLife | formatNumber}}</span><span style="margin-left: 8px">%</span></div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
    import {getRealTimeHydrogenLeakageAlarm, getLongTermHydrogenLeakageAlarm, getLongTermHydrogenUtilization, getEarlyWarningOfStackLife} from "@/assets/api/safety.js";

    let echarts = require('echarts/lib/echarts');
    export default {
        name: 'baseInfo',
        props: ['modelId'],
        data(){
            return {
                screen: this.GLOBAL.screenfun(),
                realTimeHydrogenLeakageAlarm: '',
                longTermHydrogenLeakageAlarm: 0,
                longTermHydrogenUtilization: '',
                earlyWarningOfStackLife: ''
            }
        },
        methods: {
            getRealTimeHydrogenLeakageAlarm(){
                getRealTimeHydrogenLeakageAlarm(this.modelId).then((res)=>{
                    this.realTimeHydrogenLeakageAlarm = res.data.toFixed(2)
                })
            },
            getLongTermHydrogenLeakageAlarm(){
                getLongTermHydrogenLeakageAlarm().then((res)=>{
                    this.longTermHydrogenLeakageAlarm = res.data;
                })
            },
            getLongTermHydrogenUtilization(){
                getLongTermHydrogenUtilization(this.modelId).then((res)=>{
                    this.longTermHydrogenUtilization = res.data;
                })
            },
            getEarlyWarningOfStackLife(){
                getEarlyWarningOfStackLife(this.modelId).then((res)=>{
                    this.earlyWarningOfStackLife = res.data;
                })
            },
            init(){
                this.getRealTimeHydrogenLeakageAlarm();
                this.getLongTermHydrogenLeakageAlarm();
                this.getLongTermHydrogenUtilization();
                this.getEarlyWarningOfStackLife();
            }
        },
        mounted() {
            // this.getBaseInformationChart();
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
