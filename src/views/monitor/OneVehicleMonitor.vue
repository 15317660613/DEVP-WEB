<template>
  <div class="content">
    <el-tag
      :key="item.vin"
      v-for="item in monitorVehicles"
      closable
      color="#ffffff"
      :disable-transitions="false"
      @click="selectVehicle(item)"
      @close="handleClose(item.vin)"
    >
      <span :class="currentSelectTags(item.vin)">
        <span class="indent"></span>
        <span class="text">{{item.vin}}</span>
      </span>
    </el-tag>
    <div>
      <ChildOneVehicleMonitor v-if="monitorVehicles.length>0" :vehicle="vehicle"></ChildOneVehicleMonitor>
    </div>
  </div>
  <!-- <el-tabs v-model="currentMonitorVehicle" type="card" closable @tab-remove="removeTab">
    <el-tab-pane v-for="vin in monitorVehicles" :key="vin" :label="vin" :name="vin">
    </el-tab-pane>
  </el-tabs>-->
</template>

<script>
import ChildOneVehicleMonitor from "@/components/monitor/OneVehicleMonitor/ChildOneVehicleMonitor.vue";
export default {
  name: "OneVehicleMonitor",
  data() {
    return {
      vehicle: {}
    };
  },
  created() {
    this.vehicle = this.$store.state.currentMonitorVehicle;
    this.checkLogin();
    if (this.monitorVehicles.length == 0) {
      this.$message.warning("请在车辆监控界面选择指定车辆");
    }
  },
  components: {
    ChildOneVehicleMonitor
  },
  methods: {
    handleClose(vin) {
      this.$store.commit("removeMonitorVehicles", vin);
    },
    checkLogin(){
      this.$http.get('/login/check')
    },
    selectVehicle(row) {
      this.$store.commit("changeCurrentMonitorVehicle", row);
    },
    // 判断当前页签是否为被选中，改变样式
    currentSelectTags(vin) {
      if (this.$store.state.currentMonitorVehicle.vin == vin) {
        return "active";
      } else {
        return "noActive";
      }
    }
  },
  computed: {
    //计算list改变
    monitorVehicles() {
      return this.$store.state.monitorVehicles;
    }
  },
  watch: {
    "$store.state.currentMonitorVehicle": function() {
      this.vehicle = this.$store.state.currentMonitorVehicle;
    }
  },
};
</script>

<style lang='less' scoped>
.content {
  width: 100%;
  height: 550px;
}
.el-tabs {
  width: 100%;
}
.active {
  .indent {
    display: inline-block;
    height: 8px;
    width: 8px;
    border-radius: 50%;
    background-color: #52f93c;
    margin-right: 8px;
  }
}
.noActive {
  .indent {
    display: inline-block;
    height: 8px;
    width: 8px;
    border-radius: 50%;
    background-color: #e8eaec;
    margin-right: 8px;
  }
  .text {
    color: #aaaaaa;
  }
}
</style>
