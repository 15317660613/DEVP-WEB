<template>
  <div class="content">
    <div style="font-size:16px;font-weight:bold;color:#333;margin-bottom:10px;">{{infov.vehicleNum}}</div>
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tbody>
        <tr>
          <td style="width:20%">企业：{{infov.tenantStatus == '1' ? '在线' : '不在线'}}</td>
          <td style="width:15%">城市：{{infov.city}}</td>
          <td style="width:15%">累计总里程：{{infov.odometer}}</td>
          <td>累计纯氢里程：{{infov.pureHydOdometer}}</td>
        </tr>
        <tr>
          <td>累计纯氢里程比例：{{infov.ratio}}</td>
          <td>其他信息：{{infov.otherInfo}}</td>
          <td>车辆状态：{{infov.vehicleStatus == '1' ? '在线' : '不在线'}}</td>
          <td>车速：{{infov.vehicleSpeed}}</td>
        </tr>
        <tr>
          <td>上线时间：{{infov.onlineTime}}</td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script>
    export default {
      name: 'child1',
      props: ["infov"],
      mounted(){
          
      }
    }
</script>

<style lang='less' scoped>
.content {
  font-size: 12px;
  padding: 0.2%;
  color: #999;
}
table td {
  padding: 5px;
}
</style>