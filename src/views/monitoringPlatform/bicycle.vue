<template>
  <div class="content">
    <el-row class="content-rowTop">
      <el-button size="small" ref="carInfo" type="primary">车辆基本信息</el-button>
      <el-button size="small" @click="goStatistics">统计分析</el-button>
      <el-button size="small" @click="goHistory(vinCode)">历史轨迹</el-button>
    </el-row>
    <el-row class="content-row">
      <div class="map-col1">
        <el-row style="margin-top:10px;" v-show="historyF">
          <el-col :span="6">
            <span style="display:inline;">车牌号：</span>
            <div style="display:inline;">
              <el-input v-model="licensePlateInput" placeholder="请输入车牌号" style="width:70%;"></el-input>
            </div>
          </el-col>
          <el-col :span="12">
            <el-date-picker
              v-model="value1"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width:95%;"
            ></el-date-picker>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="goSearch">查询</el-button>
          </el-col>
        </el-row>
        <div id="railMap"></div>
        <div class="carinfoBlock">
          <div class="carinfoTit">车辆信息</div>
          <div class="tableBlock">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tbody>
                <tr>
                  <td style="width:35%;">
                    <span style="font-weight:bold;">车牌号：</span>
                  </td>
                  <td v-show="infov.vehicleNum == null" class="infoStyle">一</td>
                  <td v-show="infov.vehicleNum != null" class="infoStyle">{{infov.vehicleNum}}</td>
                </tr>
                <tr>
                  <td>
                    <span style="font-weight:bold;">VIN号：</span>
                  </td>
                  <td v-show="infov.vin==null" class="infoStyle">一</td>
                  <td v-show="infov.vin!=null" class="infoStyle">{{infov.vin}}</td>
                </tr>
                <tr>
                  <td>
                    <span style="font-weight:bold;">总里程：</span>
                  </td>
                  <td v-show="infov.odometer==null" class="infoStyle">一</td>
                  <td v-show="infov.odometer!=null" class="infoStyle">{{infov.odometer}}</td>
                </tr>
                <tr>
                  <td>
                    <span style="font-weight:bold;">SOC：</span>
                  </td>
                  <td v-show="infov.soc==null" class="infoStyle">一</td>
                  <td v-show="infov.soc!=null" class="infoStyle">{{infov.soc}}</td>
                </tr>
                <tr>
                  <td>
                    <span style="font-weight:bold;">终端ID：</span>
                  </td>
                  <td v-show="infov.terminalId=='null'" class="infoStyle">一</td>
                  <td v-show="infov.terminalId!='null'" class="infoStyle">{{infov.terminalId}}</td>
                </tr>
                <tr>
                  <td>
                    <span style="font-weight:bold;">经度：</span>
                  </td>
                  <td v-show="infov.lon==null" class="infoStyle">一</td>
                  <td v-show="infov.lon!=null" class="infoStyle">{{infov.lon}}</td>
                </tr>
                <tr>
                  <td>
                    <span style="font-weight:bold;">纬度：</span>
                  </td>
                  <td v-show="infov.lat==null" class="infoStyle">一</td>
                  <td v-show="infov.lat!=null" class="infoStyle">{{infov.lat}}</td>
                </tr>
                <tr>
                  <td>
                    <span style="font-weight:bold;">时间：</span>
                  </td>
                  <td v-show="infov.onlineTime==null" class="infoStyle">一</td>
                  <td v-show="infov.onlineTime!=null" class="infoStyle">{{infov.onlineTime}}</td>
                </tr>
                <tr>
                  <td>
                    <span style="font-weight:bold;">速度：</span>
                  </td>
                  <td v-show="infov.vehicleSpeed==null" class="infoStyle">一</td>
                  <td v-show="infov.vehicleSpeed!=null" class="infoStyle">{{infov.vehicleSpeed}}</td>
                </tr>
                <tr>
                  <td>
                    <span style="font-weight:bold;">状态：</span>
                  </td>
                  <td v-show="infov.vehicleStatus==null" class="infoStyle">一</td>
                  <td v-show="infov.vehicleStatus!=null" class="infoStyle">{{infov.vehicleStatus}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="map-col2">
        <div class="vehicleInforChart">
          <div class="charts" v-show="dataY">
            <div id="barGraph" ref="barChart" :class="[screen=='0'?'screenS':'screenL']"></div>
          </div>
          <div v-show="dataN" :class="[screen=='0'?'screenS':'screenL']" class="dataNStyle">
            <div>燃料电池单体电压</div>
            <div class="txtinfo"><img src="@/assets/img/statistics/noData.png" alt=""></div>
          </div>
          <div class="charts" v-show="dataY">
            <div id="scatterGraphB" ref="scatterChart" :class="[screen=='0'?'screenS':'screenL']"></div>
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
      </div>
    </el-row>

    <el-row style="margin:0.5%;">
      <el-tabs type="border-card" style="margin-top:1%;">
        <el-tab-pane label="静态信息">
          <el-tabs v-model="activeName1">
            <el-tab-pane
              v-for="title in staticInfo"
              :label="title.name"
              :name="title.key"
              :key="title.key"
            >
              <table border="0" width="100%" padding="1" class="tableStyle">
                <tr>
                  <th v-for="item1 in title.children">{{item1.name}}</th>
                </tr>
                <tr>
                  <td
                    v-show="item2.children == null"
                    v-for="item2 in title.children"
                  >{{item2.value == null ? "一" : item2.value}}</td>
                  <td v-show="item2.children != null" v-for="item2 in title.children">
                    <table border="0" width="100%" padding="1" class="tableStyle1">
                      <tr>
                        <th v-for="sub1Th in item2.children">{{sub1Th.name}}</th>
                      </tr>
                      <tr>
                        <td
                          v-for="sub1Td in item2.children"
                        >{{sub1Td.value == null ? "一" : sub1Th.value}}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <!-- <el-table
              border
              style="width: 100%">
              <el-table-column :label="item.name" v-for="item in title.children">
                <template>
                  <span>{{item.value}}</span>
                </template>
              </el-table-column>
              </el-table>-->
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
        <el-tab-pane label="动态信息">
          <el-tabs v-model="activeName2" @tab-click="handleClick">
            <el-tab-pane label="燃料电池数据" name="first">
              <table border="0" width="100%" padding="1" class="tableStyle">
                <tr>
                  <th>燃料电池电压</th>
                  <th>燃料电池电流</th>
                  <th>燃料消耗率</th>
                  <th>探针温度值</th>
                  <th>燃料电池发动机工作状态</th>
                  <th>燃料电池单体电压</th>
                </tr>
                <tr>
                  <td>{{vehicleFuelCellIfo.voltage == null ? "一" : vehicleFuelCellIfo.voltage}}</td>
                  <td>{{vehicleFuelCellIfo.eleCurrent == null ? "一" : vehicleFuelCellIfo.eleCurrent}}</td>
                  <td>{{vehicleFuelCellIfo.rate == null ? "一" : vehicleFuelCellIfo.rate}}</td>
                  <td>{{vehicleFuelCellIfo.probeTempValue == null ? "一" : vehicleFuelCellIfo.probeTempValue}}</td>
                  <td>{{vehicleFuelCellIfo.engineWorkState == null ? "一" : vehicleFuelCellIfo.engineWorkState}}</td>
                  <td>{{vehicleFuelCellIfo.unitVoltage == null ? "一" : vehicleFuelCellIfo.unitVoltage}}</td>
                </tr>
                <tr>
                  <th>单电池电压最高值</th>
                  <th>单电池电压最低值</th>
                  <th>单电池电压平均值</th>
                  <th>最高单体电压编号</th>
                  <th>最低单体电压编号</th>
                  <th>燃料电池堆氢气入口压力</th>
                </tr>
                <tr>
                  <td>{{vehicleFuelCellIfo.unitVoltageMax == null ? "一" : vehicleFuelCellIfo.unitVoltageMax}}</td>
                  <td>{{vehicleFuelCellIfo.unitVoltageMin == null ? "一" : vehicleFuelCellIfo.unitVoltageMin}}</td>
                  <td>{{vehicleFuelCellIfo.unitVoltageAvg == null ? "一" : vehicleFuelCellIfo.unitVoltageAvg}}</td>
                  <td>{{vehicleFuelCellIfo.unitVoltageMaxNum == null ? "一" : vehicleFuelCellIfo.unitVoltageMaxNum}}</td>
                  <td>{{vehicleFuelCellIfo.unitVoltageMinNum == null ? "一" : vehicleFuelCellIfo.unitVoltageMinNum }}</td>
                  <td>{{vehicleFuelCellIfo.hydInletPressure == null ? "一" : vehicleFuelCellIfo.hydInletPressure}}</td>
                </tr>
                <tr>
                  <th>燃料电池堆氢气入口温度</th>
                  <th>燃料电池堆空气入口压力</th>
                  <th>燃料电池堆空气入口温度</th>
                  <th>燃料电池入口冷却液温度</th>
                  <th>燃料电池出口冷却液温度</th>
                  <th>燃料电池堆空气入口流量</th>
                </tr>
                <tr>
                  <td>{{vehicleFuelCellIfo.hydInletTemp == null ? "一" : vehicleFuelCellIfo.hydInletTemp}}</td>
                  <td>{{vehicleFuelCellIfo.airInletPressure == null ? "一" : vehicleFuelCellIfo.airInletPressure}}</td>
                  <td>{{vehicleFuelCellIfo.airInletTemp == null ? "一" : vehicleFuelCellIfo.airInletTemp}}</td>
                  <td>{{vehicleFuelCellIfo.inletCoolantTemp == null ? "一" : vehicleFuelCellIfo.inletCoolantTemp}}</td>
                  <td>{{vehicleFuelCellIfo.outletCoolantTemp == null ? "一" : vehicleFuelCellIfo.outletCoolantTemp}}</td>
                  <td>{{vehicleFuelCellIfo.airInletFlow == null ? "一" : vehicleFuelCellIfo.airInletFlow}}</td>
                </tr>
              </table>
            </el-tab-pane>
            <el-tab-pane label="辅助系统数据">
              <table border="0" width="100%" padding="1" class="tableStyle">
                <tr>
                  <th>空气压缩机电机控制器的输入电压</th>
                  <th>空气压缩机电机控制器的输入电流</th>
                  <th>空气压缩机转速</th>
                  <th>氢气循环泵电机控制器的输入电压</th>
                  <th>氢气循环泵电机控制器的输入电流</th>
                  <th>氢气泵转速</th>
                  <th>PTC电压</th>
                  <th>PTC电流</th>
                </tr>
                <tr>
                  <td>{{vehicleAuxiliarySysInfo.airInputVoltage == null ? "一" : vehicleAuxiliarySysInfo.airInputVoltage}}</td>
                  <td>{{vehicleAuxiliarySysInfo.airInputCurrent == null ? "一" : vehicleAuxiliarySysInfo.airInputCurrent}}</td>
                  <td>{{vehicleAuxiliarySysInfo.airCompSpeed == null ? "一" : vehicleAuxiliarySysInfo.airCompSpeed}}</td>
                  <td>{{vehicleAuxiliarySysInfo.hydInputVoltage == null ? "一" : vehicleAuxiliarySysInfo.hydInputVoltage}}</td>
                  <td>{{vehicleAuxiliarySysInfo.hydInputCurrent == null ? "一" : vehicleAuxiliarySysInfo.hydInputCurrent}}</td>
                  <td>{{vehicleAuxiliarySysInfo.hydPumpSpeed == null ? "一" : vehicleAuxiliarySysInfo.hydPumpSpeed}}</td>
                  <td>{{vehicleAuxiliarySysInfo.ptcVoltage == null ? "一" : vehicleAuxiliarySysInfo.ptcVoltage}}</td>
                  <td>{{vehicleAuxiliarySysInfo.ptcCurrent == null ? "一" : vehicleAuxiliarySysInfo.ptcCurrent}}</td>
                </tr>
              </table>
            </el-tab-pane>
            <el-tab-pane label="氢系统数据">
              <table border="0" width="100%" padding="1" class="tableStyle">
                <tr>
                  <th>氢系统中最高温度</th>
                  <th>氢系统中最高温度探针代号</th>
                  <th>气瓶压力</th>
                  <th>气瓶温度</th>
                  <th>剩余氢量</th>
                </tr>
                <tr>
                  <td>{{vehicleHydSysInfo.hydSystemTempMax == null ? "一" : vehicleHydSysInfo.hydSystemTempMax}}</td>
                  <td>{{vehicleHydSysInfo.probeNum == null ? "一" : vehicleHydSysInfo.probeNum}}</td>
                  <td>{{vehicleHydSysInfo.storagePressure == null ? "一" : vehicleHydSysInfo.storagePressure}}</td>
                  <td>{{vehicleHydSysInfo.storageTemp == null ? "一" : vehicleHydSysInfo.storageTemp}}</td>
                  <td>{{vehicleHydSysInfo.remain == null ? "一" : vehicleHydSysInfo.remain}}</td>
                </tr>
              </table>
            </el-tab-pane>
            <el-tab-pane label="氢安全监控">
              <table border="0" width="100%" padding="1" class="tableStyle">
                <tr>
                  <th>氢气最高浓度</th>
                  <th>氢气最高浓度传感器编号</th>
                </tr>
                <tr>
                  <td>{{vehicleHydSafetyInfo.concentrationMax == null ? "一" : vehicleHydSafetyInfo.concentrationMax}}</td>
                  <td>{{vehicleHydSafetyInfo.concMaxSensorNum == null ? "一" : vehicleHydSafetyInfo.concMaxSensorNum}}</td>
                </tr>
              </table>
            </el-tab-pane>
            <el-tab-pane label="燃料电池DC/DC">
              <table border="0" width="100%" padding="1" class="tableStyle">
                <tr>
                  <th>高压DC/DC状态（工作、断开、异常）</th>
                  <th>燃料电池DC/DC输出端电压</th>
                  <th>燃料电池DC/DC输出端电流</th>
                  <th>燃料电池DC/DC温度</th>
                  <th>燃料电池DC/DC冷却液温度</th>
                </tr>
                <tr>
                  <td>{{vehicleFuelCellDCInfo.highVoltageState == null ? "一" : vehicleFuelCellDCInfo.highVoltageState}}</td>
                  <td>{{vehicleFuelCellDCInfo.outputVoltage == null ? "一" : vehicleFuelCellDCInfo.outputVoltage}}</td>
                  <td>{{vehicleFuelCellDCInfo.outputCurrent == null ? "一" : vehicleFuelCellDCInfo.outputCurrent}}</td>
                  <td>{{vehicleFuelCellDCInfo.temperature == null ? "一" : vehicleFuelCellDCInfo.temperature}}</td>
                  <td>{{vehicleFuelCellDCInfo.coolantTemp == null ? "一" : vehicleFuelCellDCInfo.coolantTemp}}</td>
                </tr>
              </table>
            </el-tab-pane>
            <el-tab-pane label="动力电池数据">
              <table border="0" width="100%" padding="1" class="tableStyle">
                <tr>
                  <th>可充电储能子系统数</th>
                  <th>动力电池数据值</th>
                </tr>
                <tr>
                  <td>{{vehiclePowerBatteryInfo.vehiclePowerBatteryCount == null ? "一" : vehiclePowerBatteryInfo.vehiclePowerBatteryCount}}</td>
                  <td>
                    <table border="0" width="100%" padding="1">
                      <tr>
                        <th>可充电储能子系统号</th>
                        <th>可充电储能装置电压</th>
                        <th>可充电储能装置电流</th>
                        <th>动力电池SOH值</th>
                        <th>电池包平均单体电压</th>
                      </tr>
                      <tr>
                        <td>{{vehiclePowerBatteryValue.subsystemNum == null ? "一" : vehiclePowerBatteryValue.subsystemNum}}</td>
                        <td>{{vehiclePowerBatteryValue.deviceVoltage == null ? "一" : vehiclePowerBatteryValue.deviceVoltage}}</td>
                        <td>{{vehiclePowerBatteryValue.deviceCurrent == null ? "一" : vehiclePowerBatteryValue.deviceCurrent}}</td>
                        <td>{{vehiclePowerBatteryValue.soh == null ? "一" : vehiclePowerBatteryValue.soh}}</td>
                        <td>{{vehiclePowerBatteryValue.packUnitVoltageAvg == null ? "一" : vehiclePowerBatteryValue.packUnitVoltageAvg}}</td>
                      </tr>
                      <tr>
                        <th>电池包平均单体温度</th>
                        <th>单体最高电压</th>
                        <th>单体最低电压</th>
                        <th>温度探针最高温度</th>
                        <th>温度探针最低温度</th>
                      </tr>
                      <tr>
                        <td>{{vehiclePowerBatteryValue.packUnitTempAvg == null ? "一" : vehiclePowerBatteryValue.packUnitTempAvg}}</td>
                        <td>{{vehiclePowerBatteryValue.pUnitVoltageMax == null ? "一" : vehiclePowerBatteryValue.pUnitVoltageMax}}</td>
                        <td>{{vehiclePowerBatteryValue.pUnitVoltageMin == null ? "一" : vehiclePowerBatteryValue.pUnitVoltageMin}}</td>
                        <td>{{vehiclePowerBatteryValue.probeTempValueMax == null ? "一" : vehiclePowerBatteryValue.probeTempValueMax}}</td>
                        <td>{{vehiclePowerBatteryValue.probeTempValueMin == null ? "一" : vehiclePowerBatteryValue.probeTempValueMin}}</td>
                      </tr>
                      <tr>
                        <th>所有单体电池电压</th>
                        <th>可充电储能子系统各温度探针检测到的温度值</th>
                        <th></th>
                        <th></th>
                        <th></th>
                      </tr>
                      <tr>
                        <td>{{vehiclePowerBatteryValue.powerUnitVoltageList == null ? "一" : vehiclePowerBatteryValue.powerUnitVoltageList}}</td>
                        <td>{{vehiclePowerBatteryValue.subsystemTempProbesValueList == null ? "一" : vehiclePowerBatteryValue.subsystemTempProbesValueList}}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </el-tab-pane>
            <el-tab-pane label="驱动电机数据">
              <table border="0" width="100%" padding="1" class="tableStyle">
                <tr>
                  <th>驱动电机个数</th>
                  <th>驱动电机数据值</th>
                </tr>
                <tr>
                  <td>{{vehicleDrivingMotorInfo.driveMotorCount == null ? "一" : vehicleDrivingMotorInfo.driveMotorCount}}</td>
                  <td>
                    <table border="0" width="100%" padding="1">
                      <tr>
                        <th>驱动电机转速</th>
                        <th>驱动电机转矩</th>
                        <th>驱动电机温度</th>
                        <th>电机控制器输入电压</th>
                        <th>电机控制器直流母线电流</th>
                      </tr>
                      <tr>
                        <td>{{vehicleDrivingMotorValue.driveMotorSpeed == null ? "一" : vehicleDrivingMotorValue.driveMotorSpeed}}</td>
                        <td>{{vehicleDrivingMotorValue.driveMotorTorque == null ? "一" : vehicleDrivingMotorValue.driveMotorTorque}}</td>
                        <td>{{vehicleDrivingMotorValue.driveMotorTemp == null ? "一" : vehicleDrivingMotorValue.driveMotorTemp}}</td>
                        <td>{{vehicleDrivingMotorValue.motorInputVoltage == null ? "一" : vehicleDrivingMotorValue.motorInputVoltage}}</td>
                        <td>{{vehicleDrivingMotorValue.motorDcBusCurrent == null ? "一" : vehicleDrivingMotorValue.motorDcBusCurrent}}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </el-tab-pane>
            <el-tab-pane label="低压DC-DC数据">
              <table border="0" width="100%" padding="1" class="tableStyle">
                <tr>
                  <th>低压DC-DC输出电压</th>
                  <th>低压DC-DC输出电流</th>
                </tr>
                <tr>
                  <td>{{vehicleLowVoltageInfo.lowOutputVoltage == null ? "一" : vehicleLowVoltageInfo.lowOutputVoltage}}</td>
                  <td>{{vehicleLowVoltageInfo.lowOutputCurrent == null ? "一" : vehicleLowVoltageInfo.lowOutputCurrent}}</td>
                </tr>
              </table>
            </el-tab-pane>
            <el-tab-pane label="整车数据">
              <table border="0" width="100%" padding="1" class="tableStyle">
                <tr>
                  <th>车辆状态</th>
                  <th>车速</th>
                  <th>累计里程</th>
                  <th>动力电池总电压</th>
                  <th>动力电池总电流</th>
                  <th>动力电池SOC值</th>
                  <th>档位</th>
                </tr>
                <tr>
                  <td>{{vehicleDataInfo.lowOutputVoltage == null ? "一" : vehicleDataInfo.lowOutputVoltage}}</td>
                  <td>{{vehicleDataInfo.lowOutputCurrent == null ? "一" : vehicleDataInfo.lowOutputCurrent}}</td>
                  <td>{{vehicleDataInfo.lowOutputVoltage == null ? "一" : vehicleDataInfo.lowOutputVoltage}}</td>
                  <td>{{vehicleDataInfo.lowOutputCurrent == null ? "一" : vehicleDataInfo.lowOutputCurrent}}</td>
                  <td>{{vehicleDataInfo.lowOutputVoltage == null ? "一" : vehicleDataInfo.lowOutputVoltage}}</td>
                  <td>{{vehicleDataInfo.lowOutputCurrent == null ? "一" : vehicleDataInfo.lowOutputCurrent}}</td>
                  <td>{{vehicleDataInfo.lowOutputVoltage == null ? "一" : vehicleDataInfo.lowOutputVoltage}}</td>
                </tr>
                <tr>
                  <th>绝缘电阻</th>
                  <th>时间</th>
                  <th>运行模式</th>
                  <th>环境温度</th>
                  <th>环境压力</th>
                  <th>加速度（碰撞）传感器输出</th>
                  <th></th>
                </tr>
                <tr>
                  <td>{{vehicleDataInfo.lowOutputVoltage == null ? "一" : vehicleDataInfo.lowOutputVoltage}}</td>
                  <td>{{vehicleDataInfo.lowOutputCurrent == null ? "一" : vehicleDataInfo.lowOutputCurrent}}</td>
                  <td>{{vehicleDataInfo.lowOutputVoltage == null ? "一" : vehicleDataInfo.lowOutputVoltage}}</td>
                  <td>{{vehicleDataInfo.lowOutputCurrent == null ? "一" : vehicleDataInfo.lowOutputCurrent}}</td>
                  <td>{{vehicleDataInfo.lowOutputVoltage == null ? "一" : vehicleDataInfo.lowOutputVoltage}}</td>
                  <td>{{vehicleDataInfo.lowOutputCurrent == null ? "一" : vehicleDataInfo.lowOutputCurrent}}</td>
                  <td>{{vehicleDataInfo.lowOutputVoltage == null ? "一" : vehicleDataInfo.lowOutputVoltage}}</td>
                </tr>
              </table>
            </el-tab-pane>
            <el-tab-pane label="车辆实时位置状态">
              <table border="0" width="100%" padding="1" class="tableStyle">
                <tr>
                  <th>纬度</th>
                  <th>经度</th>
                  <th>离在线状态</th>
                </tr>
                <tr>
                  <td>{{vehiclePositionStatus.latitude == null ? "一" : vehiclePositionStatus.latitude}}</td>
                  <td>{{vehiclePositionStatus.longitude == null ? "一" : vehiclePositionStatus.longitude}}</td>
                  <td v-show="vehiclePositionStatus.status == null">一</td>
                  <td
                    v-show="vehiclePositionStatus.status != null && vehiclePositionStatus.status==-1"
                  >故障</td>
                  <td
                    v-show="vehiclePositionStatus.status != null && vehiclePositionStatus.status==0"
                  >离线</td>
                  <td
                    v-show="vehiclePositionStatus.status != null && vehiclePositionStatus.status==1"
                  >在线</td>
                </tr>
              </table>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
        <el-tab-pane label="预警信息">
          <table border="0" width="100%" padding="1" class="tableStyle">
            <tr>
              <th>最高报警等级</th>
              <th>最高温度报警</th>
              <th>温度差异报警</th>
              <th>车载储能装置类型欠压报警</th>
              <th>车载储能装置类型过压报警</th>
              <th>单体电池过压报警</th>
              <th>单体电池欠压报警</th>
              <th>SOC过高报警</th>
              <th>SOC低报警</th>
              <th>SOC跳变报警</th>
            </tr>
            <tr>
              <td>{{vehicleWarningInfo.alarmLevelMax == null ? "一" : vehicleWarningInfo.alarmLevelMax}}</td>
              <td>{{vehicleWarningInfo.alarmTempMax == null ? "一" : vehicleWarningInfo.alarmTempMax}}</td>
              <td>{{vehicleWarningInfo.alarmDiffTemp == null ? "一" : vehicleWarningInfo.alarmDiffTemp}}</td>
              <td>{{vehicleWarningInfo.deviceTypeUnderAlarm == null ? "一" : vehicleWarningInfo.deviceTypeUnderAlarm}}</td>
              <td>{{vehicleWarningInfo.deviceTypeOverAlarm == null ? "一" : vehicleWarningInfo.deviceTypeOverAlarm}}</td>
              <td>{{vehicleWarningInfo.unitBatteryOverAlarm == null ? "一" : vehicleWarningInfo.unitBatteryOverAlarm}}</td>
              <td>{{vehicleWarningInfo.unitBatteryUnderAlarm == null ? "一" : vehicleWarningInfo.unitBatteryUnderAlarm}}</td>
              <td>{{vehicleWarningInfo.socOverAlarm == null ? "一" : vehicleWarningInfo.socOverAlarm}}</td>
              <td>{{vehicleWarningInfo.socUnderAlarm == null ? "一" : vehicleWarningInfo.socUnderAlarm}}</td>
              <td>{{vehicleWarningInfo.socJumpAlarm == null ? "一" : vehicleWarningInfo.socJumpAlarm}}</td>
            </tr>
            <tr>
              <th>可充电储能系统不匹配报警</th>
              <th>单体电池一致性差报警</th>
              <th>绝缘报警</th>
              <th>DC-DC温度报警</th>
              <th>制动系统报警</th>
              <th>DC-DC状态报警</th>
              <th>驱动电机控制器温度报警</th>
              <th>高压互锁状态报警</th>
              <th>驱动电机温度报警</th>
              <th></th>
            </tr>
            <tr>
              <td>{{vehicleWarningInfo.sysNoMatchAlarm == null ? "一" : vehicleWarningInfo.sysNoMatchAlarm}}</td>
              <td>{{vehicleWarningInfo.unitBatteryUniformityAlarm == null ? "一" : vehicleWarningInfo.unitBatteryUniformityAlarm}}</td>
              <td>{{vehicleWarningInfo.insulationAlarm == null ? "一" : vehicleWarningInfo.insulationAlarm}}</td>
              <td>{{vehicleWarningInfo.dcTempAlarm == null ? "一" : vehicleWarningInfo.dcTempAlarm}}</td>
              <td>{{vehicleWarningInfo.brakingSysAlarm == null ? "一" : vehicleWarningInfo.brakingSysAlarm}}</td>
              <td>{{vehicleWarningInfo.dcStateAlarm == null ? "一" : vehicleWarningInfo.dcStateAlarm}}</td>
              <td>{{vehicleWarningInfo.driveMotorControlTempAlarm == null ? "一" : vehicleWarningInfo.driveMotorControlTempAlarm}}</td>
              <td>{{vehicleWarningInfo.highPresInterlockAlarm == null ? "一" : vehicleWarningInfo.highPresInterlockAlarm}}</td>
              <td>{{vehicleWarningInfo.driveMotorTempAlarm == null ? "一" : vehicleWarningInfo.driveMotorTempAlarm}}</td>
              <td></td>
            </tr>
          </table>
        </el-tab-pane>
      </el-tabs>
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
import { getBicycleStatic } from "@/assets/api/bicycle.js";
let echarts = require("echarts/lib/echarts");
require("echarts/lib/chart/bar");
require("echarts/lib/chart/pie");
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
export default {
  name: "Bicycle",
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
      activeName: 1,
      activeName1:"",
      activeName2: "first",
      screen: 1,
      historyF: false,
      licensePlateInput: "",
      mapStyle: "map",
      autofocus: true,
      firstF: true,
      dataY: true,
      dataN: false,
      unitVoltageV: [],
      vehicleActionInfo: {}, //动态信息
      vehicleFuelCellIfo: {}, //燃料电池数据
      vehicleAuxiliarySysInfo: {}, //辅助系统数据
      vehicleHydSysInfo: {}, //氢系统数据
      vehicleHydSafetyInfo: {}, //氢安全监控
      vehicleFuelCellDCInfo: {}, //燃料电池DC/DC数据
      vehiclePowerBatteryInfo: {}, //动力电池数据
      vehiclePowerBatteryValue: {}, //动力电池数据值
      vehicleDrivingMotorInfo: {}, //驱动电机数据
      vehicleDrivingMotorValue: {}, //驱动电机详细数据
      vehicleLowVoltageInfo: {}, //低压DC-DC数据
      vehicleDataInfo: {}, //整车数据
      vehiclePositionStatus: {}, //车辆实时位置状态
      vehicleWarningInfo: {}, //预警信息
      staticHtml: "",
      forItem1: {},
      forItem2: {},
      infov: {},
      infovalue: {},
      vinCode: "",
      lineArr: [],
      lineArr1: [
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
      ],
      lineArrN: 0,
      markerObj: {},
      narker: null, //车辆market对象
      staticInfo: {}, //静态信息
      propertiesList: [], //静态信息子资源
      isChildUpdate1: true,
      isChildUpdate2: false,
      searchFlag: false, //搜索框
      carLine: {},
      polyLinelastArr: [], //上次传入轨迹
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
    // mapInit() {
    //   this.map = new AMap.Map("map", {
    //     zoom: 4, //级别
    //     center: [117.094048, 39.149218] //中心点坐标
    //   });
    //   AMap.plugin(["AMap.ToolBar"], () => {
    //     // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
    //     this.map.addControl(
    //       new AMap.ToolBar({
    //         // 简易缩放模式，默认为 false
    //         liteStyle: true
    //       })
    //     );
    //   });
    //   this.map.on("zoomend", () => {
    //     this.searchFlag = true;
    //     if (this.map.getZoom() > 9 && this.groupShow) {
    //       this.markerGroups.show();
    //     } else {
    //       this.markerGroups.hide();
    //     }
    //   });
    //   this.loadMapUi();
    // },

    //搜索当前车辆
    searchVehicle() {
      if (this.formSearch.vinOrVehicleNum) {
        this.groupShow = false;
        //判断输入框是否有内容
        let currentVehicleList = this.vehicleList.filter((item) => {
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
              currentVehicleList[0].latitude,
            ],
            content: content,
            draggable: true,
            offset: new AMap.Pixel(-20, -30),
          });
          this.currentMarker.on("click", (e) => {
            this.$store.commit("addMonitorVehicles", currentVehicleList[0]);
            this.$router.push({
              path: "/monitor/oneVehicleMonitor",
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
      let data;
      if (dataItems.length > 10) {
        data = dataItems.slice(dataItems.length - 11, dataItems.length - 1);
      } else {
        data = dataItems;
      }
      console.log(data)
      // 基于dom，初始化echarts实例
      let barGraph = echarts.init(document.getElementById("barGraph"));
      // 绘制图表
      barGraph.setOption({
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
          formatter: "{a} <br/>{b} : {c}",
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
      let pieGraph = echarts.init(document.getElementById("scatterGraphB"));
      pieGraph.setOption({
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
          formatter: "{a} <br/>{b} : {c} ({d}%)",
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
            symbolSize: 20,
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
      let pieGraph = echarts.init(document.getElementById("pieGraphL"));
      pieGraph.setOption({
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
                show: false,
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
      let pieGraph = echarts.init(document.getElementById("pieGraphR"));
      pieGraph.setOption({
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
                show: false,
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
                hoverAnimation: false,
                name: "纯氢比值",
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
    goHistory(data) {
      this.$router.push({
        name: "BicycleHistory",
        query: { vin: data, vehicleNum: this.infov.vehicleNum },
      });
      //this.$router.push('/monitoringPlatform/bicycleHistory');
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
      this.historyF = false;
      this.mapStyle = "map";
    },
    mapInit() {
      this.railMap = new AMap.Map("railMap", {
        resizeEnable: true,
        center: [116.397428, 39.90923],
        zoom: 17,
      });
    },
    searchRailHistory() {
      var marker;
      //var lineArr =  [[116.478935,39.997761],[116.478939,39.997825],[116.478912,39.998549],[116.478912,39.998549],[116.478998,39.998555],[116.478998,39.998555],[116.479282,39.99856],[116.479658,39.998528],[116.480151,39.998453],[116.480784,39.998302],[116.480784,39.998302],[116.481149,39.998184],[116.481573,39.997997],[116.481863,39.997846],[116.482072,39.997718],[116.482362,39.997718],[116.483633,39.998935],[116.48367,39.998968],[116.484648,39.999861]];
      //let marker,linArr;
      //this.lineArr =  [[116.478935,39.997761],[116.478912,39.998549]];
      marker = new AMap.Marker({
        map: this.railMap,
        position: [116.478935, 39.997761],
        //position: trackPoint[0],
        icon: "https://webapi.amap.com/images/car.png",
        offset: new AMap.Pixel(-26, -13),
        autoRotation: true,
        angle: -90,
      });

      // 绘制轨迹
      var polyline = new AMap.Polyline({
        map: this.railMap,
        path: this.lineArr1,
        showDir: true,
        strokeColor: "#28F", //线颜色
        // strokeOpacity: 1,     //线透明度
        strokeWeight: 6, //线宽
        // strokeStyle: "solid"  //线样式
      });

      var passedPolyline = new AMap.Polyline({
        map: this.railMap,
        // path: lineArr,
        strokeColor: "#AF5", //线颜色
        // strokeOpacity: 1,     //线透明度
        strokeWeight: 6, //线宽
        // strokeStyle: "solid"  //线样式
      });
      marker.on("moving", function (e) {
        passedPolyline.setPath(e.passedPath);
      });

      this.railMap.setFitView(polyline);
      marker.moveAlong(this.lineArr1, 1000);
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
    setdrawBar(data) {
      //console.log(data.vehicleFuelCellIfo.unitVoltage);
      //for(let i=0; i<6; i++){
      this.unitVoltageV.push(data.vehicleFuelCellIfo.unitVoltage);
      //}
      this.drawBar(this.unitVoltageV);
    },
    setdrawScatter(data) {
      //耐久性衰减情况
      let dateV = data.durability.sysTime;
      let durabilityTime = [];
      let durabilityListV = [];
      let date = new Date(dateV.replace(/-/g, "/").replace(/T|Z/g, " ").trim());
      var h = date.getHours();
      let m = date.getMinutes();
      let hS = "";
      let mS = "";
      h = h - 2;
      for (let i = 0; i < 12; i++) {
        m = 10 + m;
        mS = m;
        hS = h;
        if (m >= 60) {
          m = m - 60;
          mS = m;
          h = h + 1;
          hS = h;
        }
        if (h >= 24) {
          h = h - 24;
          hS = h;
        }
        if (h < 10) {
          hS = "0" + h;
        }
        if (m < 10) {
          mS = "0" + m;
        }
        durabilityTime.push(hS + ":" + mS);
      }

      data.durability.durabilityList.forEach((item, index) => {
        durabilityListV.push(item);
      });
      this.drawScatter(durabilityListV, durabilityTime);
    },
    setcarLine(arr) {
      // if (!this.firstF) {
      //   this.markerObj.setMap(null);
      // }
      if (this.firstF) {
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
          position: arr[arr.length - 1],
          icon: carIcon,
          offset: new AMap.Pixel(-26, -8),
          autoRotation: true,
          angle: -90,
        });
      }
      let icon = null;
      let polyline, passedPolyline, moveLine;

      //  icon = new AMap.Icon({
      //   size: new AMap.Size(33, 40), // 图标尺寸
      //   image: require("@/assets/img/statistics/vehicle35.png"), // Icon的图像
      //   imageSize: new AMap.Size(33, 40), // 根据所设置的大小拉伸或压缩图片
      // });

      // 绘制轨迹
      polyline = new AMap.Polyline({
        map: this.railMap,
        //path: [[116.478935,39.997761],[116.478912,39.998549]],
        path: arr,
        //path: [lat,lon],
        showDir: true,
        strokeColor: "#28F", //线颜色
        // strokeOpacity: 1,     //线透明度
        strokeWeight: 6, //线宽
        // strokeStyle: "solid"  //线样式
      });
      passedPolyline = new AMap.Polyline({
        map: this.railMap,
        zIndex: 51,
        path: this.polyLinelastArr,
        // path: lineArr,
        strokeColor: "#AF5", //线颜色
        // strokeOpacity: 1,     //线透明度
        strokeWeight: 6, //线宽
        // strokeStyle: "solid"  //线样式
      });
      moveLine = new AMap.Polyline({
        map: this.railMap,
        zIndex: 51,
        // path: lineArr,
        strokeColor: "#AF5", //线颜色
        // strokeOpacity: 1,     //线透明度
        strokeWeight: 6, //线宽
        // strokeStyle: "solid"  //线样式
      });
      this.marker.on("moving", function (e) {
        // console.log(e.passedPath)
        moveLine.setPath(e.passedPath);
      });

      // if(this.firstF){
      //   this.railMap.setCenter([
      //     lon,
      //     lat
      //   ]);
      // }
      let moveArr;
      if (arr.length > 2) {
        moveArr = arr.slice(arr.length - 3, arr.length - 1);
      } else {
        moveArr = arr;
      }
      let speed = 0;
      if (moveArr.length > 1) {
        speed =
          this.getDistance(
            moveArr[0].lng,
            moveArr[0].lat,
            moveArr[1].lng,
            moveArr[1].lat
          ) / 2.78;
      }
      this.railMap.setFitView(polyline);
      //this.railMap.setFitView();
      this.marker.moveAlong(arr, speed);
      this.$nextTick(() => {
        this.polyLinelastArr = arr;
      });
    },
    getBicycleStatic(vin) {
      getBicycleStatic(vin).then((res) => {
        this.staticInfo = res.data.propertiesList;
        this.staticInfo.forEach((item) => {
          this.propertiesList.push(item);
        });
        //console.log(this.propertiesList);
      });
    },
    getDistance(lng1, lat1, lng2, lat2) {
      var radLat1 = (lat1 * Math.PI) / 180.0;
      var radLat2 = (lat2 * Math.PI) / 180.0;
      var a = radLat1 - radLat2;
      var b = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0;
      var s =
        2 *
        Math.asin(
          Math.sqrt(
            Math.pow(Math.sin(a / 2), 2) +
              Math.cos(radLat1) *
                Math.cos(radLat2) *
                Math.pow(Math.sin(b / 2), 2)
          )
        );
      s = s * 6378.137;
      s = Math.round(s * 10000) / 10;
      return s;
    },
    //websoket连接
    webSocketLink(url) {
      //console.log(url);
      let that = this;
      let lineArrN = [];
      let lineArrNb = "";
      let lineArrNe = "";
      let f = true;
      //console.log(lineArrN);
      let heartCheck = {
        timeout: 30000,
        timeoutObj: null,
        reset: function () {
          clearInterval(this.timeoutObj);
          return this;
        },
        start: function () {
          this.timeoutObj = setInterval(function () {
            that.websocket = new WebSocket(url);
          }, this.timeout);
        },
      };
      that.websocket = new WebSocket(url);
      that.websocket.onopen = function () {
        console.log("连接成功");
        that.websocket.send("1280045291061088257");
        // that.websocket.send('1286548813734649858');

        //that.websocket.send(that.$store.state.userId);
        heartCheck.reset();
      };
      that.websocket.onmessage = function (event) {
        let data = JSON.parse(event.data);
        console.log(data);

        that.vehicleFuelCellIfo = data.vehicleActionInfo.vehicleFuelCellIfo;
        that.vehicleAuxiliarySysInfo =
          data.vehicleActionInfo.vehicleAuxiliarySysInfo;
        that.vehicleHydSysInfo = data.vehicleActionInfo.vehicleHydSysInfo;
        that.vehicleHydSafetyInfo = data.vehicleActionInfo.vehicleHydSafetyInfo;
        that.vehicleFuelCellDCInfo =
          data.vehicleActionInfo.vehicleFuelCellDCInfo;
        that.vehiclePowerBatteryInfo =
          data.vehicleActionInfo.vehiclePowerBatteryInfo;
        that.vehiclePowerBatteryValue =
          data.vehicleActionInfo.vehiclePowerBatteryInfo.vehiclePowerBatteryValueList;
        that.vehicleDrivingMotorInfo =
          data.vehicleActionInfo.vehicleDrivingMotorInfo;
        that.vehicleDrivingMotorValue =
          data.vehicleActionInfo.vehicleDrivingMotorInfo.vehicleDrivingMotorValueList;
        that.vehicleLowVoltageInfo =
          data.vehicleActionInfo.vehicleLowVoltageInfo;
        that.vehicleDataInfo = data.vehicleActionInfo.vehicleDataInfo;
        that.vehiclePositionStatus =
          data.vehicleActionInfo.vehiclePositionStatus;
        that.vehicleWarningInfo = data.vehicleWarningInfo
          ? data.vehicleWarningInfo
          : "";
        that.infov = data.vehicleBasic;
        console.log(data);
        if (that.firstF) {
          that.infovalue = data.vehicleBasic;
          // lineArrNb = that.lineArr1[0][0];
          // lineArrNe = that.lineArr1[0][1];
          // let lineArrN = [[that.lineArr1[0][0],that.lineArr1[0][1]]];

          lineArrNb = that.infov.lon;
          lineArrNe = that.infov.lat;
          let lineArrN = [[that.infov.lon, that.infov.lat]];

          that.setcarLine(lineArrN);
          that.setdrawBar(data.vehicleActionInfo);

          //纯氢续航里程
          let addV =
            parseInt(data.vehicleBasic.pureHydOdometer) +
            parseInt(data.vehicleBasic.odometer);
          if (addV == 0) {
            addV = 1;
          }
          let per =
            Math.round(
              (parseInt(data.vehicleBasic.pureHydOdometer) / addV) * 100
            ) + "%";
          if (per == 0) {
            per = 1;
          }
          that.$options.methods.drawPieL(
            per,
            parseInt(data.vehicleBasic.pureHydOdometer),
            parseInt(data.vehicleBasic.odometer)
          );

          //纯电续航里程
          let addV1 =
            parseInt(data.vehicleBasic.pureHydOdometer) +
            parseInt(data.vehicleBasic.odometer);
          if (addV1 == 0) {
            addV1 = 1;
          }
          let per1 =
            Math.round((parseInt(data.vehicleBasic.odometer) / addV1) * 100) +
            "%";
          if (per1 == 0) {
            per1 = 1;
          }
          that.$options.methods.drawPieR(
            per1,
            parseInt(data.vehicleBasic.odometer),
            parseInt(data.vehicleBasic.pureHydOdometer)
          );
          that.setdrawScatter(data);
          that.firstF = false;
        } else {
          if (data.type == 1) {
            that.setdrawScatter(data);
          } else {
            that.infov = data.vehicleBasic;
            // let lineArrN = [[lineArrNb,lineArrNe],[that.lineArr1[that.lineArrN][0],that.lineArr1[that.lineArrN][1]]];
            // lineArrNb = that.lineArr1[that.lineArrN][0];
            // lineArrNe = that.lineArr1[that.lineArrN][1];
            let lineArrN = [
              [lineArrNb, lineArrNe],
              [that.infov.lon, that.infov.lat],
            ];

            lineArrNb = that.infov.lon;
            lineArrNe = that.infov.lat;

            that.setcarLine(lineArrN);

            that.setdrawBar(data.vehicleActionInfo);

            //纯氢续航里程
            let addV =
              parseInt(data.vehicleBasic.pureHydOdometer) +
              parseInt(data.vehicleBasic.odometer);
            if (addV == 0) {
              addV = 1;
            }
            let per =
              Math.round(
                (parseInt(data.vehicleBasic.pureHydOdometer) / addV) * 100
              ) + "%";
            if (per == 0) {
              per = 1;
            }
            that.$options.methods.drawPieL(
              per,
              parseInt(data.vehicleBasic.pureHydOdometer),
              parseInt(data.vehicleBasic.odometer)
            );

            //纯电续航里程
            let addV1 =
              parseInt(data.vehicleBasic.pureHydOdometer) +
              parseInt(data.vehicleBasic.odometer);
            if (addV1 == 0) {
              addV1 = 1;
            }
            let per1 =
              Math.round((parseInt(data.vehicleBasic.odometer) / addV1) * 100) +
              "%";
            if (per1 == 0) {
              per1 = 1;
            }
            that.$options.methods.drawPieR(
              per1,
              parseInt(data.vehicleBasic.odometer),
              parseInt(data.vehicleBasic.pureHydOdometer)
            );
            that.firstF = false;
          }
          that.lineArrN += 1;
        }
      };
      that.websocket.onclose = function (event) {
        //that.$message.error("断开连接，30s后重新了连接");
        //heartCheck.reset().start();
        that.dataN = true;
        that.dataY = false;
      };
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
    //  this.webSocketLink(Config.webLocalHost + "/vehicleData/"+ "LFV2A21K9J4002009");
    //  this.getBicycleStatic("LFV2A21K9J4002009");
    this.webSocketLink(
      Config.webLocalHost +
        "/vehicleData/" +
        this.$router.history.current.query.vin
    );
    this.getBicycleStatic(this.$router.history.current.query.vin);

    this.vinCode = this.$router.history.current.query.vin;
    console.log("vin:" + this.$router.history.current.query.vin);
    this.screenfun();
  },

  mounted() {
    this.mapInit();
    this.drawBar();
    //this.drawScatter();
    this.drawPieL();
    this.drawPieR();
    //this.searchRailHistory();
    this.init();
    //this.searchRailHistory();
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
/deep/.content {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
}
/deep/.map {
  width: 100%;
  height: 100%;
  margin-top: 10px;
}
.vehicleInforChart {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ;
  > div {
    flex-grow: 1;
  }
}
.mapM {
  width: 100%;
  height: 85%;
  margin-top: 10px;
}
#railMap{
  height: 100%;
  width: 100%;
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
}

.content-row {
  height: 80%;
  margin: 0.5%;
  padding: 0;
  display: flex;
  >div{
    
  }
}

.map-col1 {
  background: #fff;
  padding: 10px;
  width: 67%;
  //margin-right: 15px;
}
.map-col2 {
  background: #fff;
  padding: 10px;
  flex: 1;
  margin-left: 10px;
}

.box-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  height: 100px;
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
  height: 180px;
}
.content-rowTop {
  margin: 0 0.5% 0.5% 0.5%;
}
.backgroundColorFFF {
  background-color: #fff;
}
.carinfo {
  position: absolute;
  width: 18%;
  height: 30%;
  top: 2%;
  left: 0.4%;
  background-color: #fff;
  opacity: 0.7;
  box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.3);
}
.carinfoBlock {
  position: absolute;
  width: 250px;
  height: 300px;
  top: 5%;
  left: 1%;
  border: #f1f1f1 solid 2px;
  background-color: #fff;
}
.carinfoBlock td {
  padding: 1%;
  font-size: 14px;
  text-align: right;
  color: #bdbdbd;
  font-weight: bold;
}
.carinfoBlock td.infoStyle {
  text-align: left;
  color: #333;
}
.carinfoTit {
  width: 100%;
  text-align: center;
  font-size: 18px;
  padding: 2% 0;
  background-color: #dbeefc;
}
.tableBlock {
  padding: 10px;
}
.carinfoS {
  position: absolute;
  width: 18%;
  height: 35%;
  top: 2%;
  left: 0.4%;
  background-color: #fff;
  opacity: 0.7;
  box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.3);
}
.carinfoBlockS {
  position: absolute;
  width: 18%;
  height: 35%;
  top: 2%;
  left: 0.4%;
  padding: 10px;
}
.carinfoBlockS td {
  padding: 0.6%;
  font-size: 10px;
}
.tableStyle {
  background-color: #f2f2f2;
}
.tableStyle th,
.tableStyle td {
  background-color: #ffffff;
  padding: 1%;
  font-size: 12px;
  text-align: center;
}
.tableStyle1 th,
.tableStyle td {
  background-color: #ffffff;
  padding: 0.2%;
  font-size: 12px;
  text-align: center;
}
.tableStyle th,
.tableStyle1 th {
  background-color: #f7f7f7;
}
.dataNStyle {
  width: 90%;
  padding: 1%;
  margin: 2%;
  border: #f6f6f6 solid 1px;
}
.dataNStyle .txtinfo {
  text-align: center;
  margin-top: 10%;
}
.dataNStyle1 {
  width: 80%;
  padding: 1%;
  margin: 2% 0 0 3.5%;
  border: #f6f6f6 solid 1px;
}
.dataNStyle1 .txtinfo {
  text-align: center;
  margin-top: 20%;
}
</style>
