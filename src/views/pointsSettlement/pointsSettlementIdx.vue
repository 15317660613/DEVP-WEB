<template>
  <div class="flexBlock">
    <div class="pSheader">
      <div class="pS_tabs">
        <el-button :class="{actived:tab == 1}" @click="tabDeclare">清算申报</el-button>
        <el-button :class="{actived:tab == 2}" @click="tabExamine">清算审核</el-button>
        <el-button :class="{actived:tab == 3}" @click="tabLiquidationSummary">清算汇总</el-button>
      </div>
    </div>
    <div class="content">
      <Declare v-if="tab==1" />
      <Examine v-if="tab==2" />
      <LiquidationSummary v-if="tab==3" />
    </div>
  </div>
</template>
<script>
import Declare from "@/components/pointsSettlement/Declare.vue"; //申报
import Examine from "@/components/pointsSettlement/Examine.vue"; //审核
import LiquidationSummary from "@/components/pointsSettlement/LiquidationSummary.vue"; //清算汇总
export default {
  name: "tem1",
  data() {
    return {
      tab: 1,
      pop: false,
      popbg: false,
      provinceList: [],
      options: [
        {
          name: "北京市",
          id: 11,
        },
        {
          name: "天津市",
          id: 12,
        },
        {
          name: "河北省",
          id: 13,
        },
        {
          name: "山西省",
          id: 14,
        },
        {
          name: "上海市",
          id: 31,
        },
        {
          name: "江苏省",
          id: 32,
        },
        {
          name: "山东省",
          id: 37,
        },
        {
          name:"广东省",
          id: 44,
        },
      ],
    };
  },
  components: {
    Declare,
    Examine,
    LiquidationSummary,
  },
  methods: {
    search() {},
    tabDeclare() {
      this.tab = 1;
    },
    tabLiquidationSummary() {
      this.tab = 3;
    },
    tabExamine() {
      this.tab = 2;
    },
  },
};
</script>

<style lang="less" scoped>
.flexBlock {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  flex-grow: 1;
  .pSheader {
    margin: 0.5% 0.5% 0 0.5%;
    height: 40px;
  }
  .pS_tabs {
    float: left;
    width: 50%;
    .actived {
      background-color: #409eff;
      color: #ffffff;
    }
  }
}
.content {
  margin: 0.5%;
  flex: 1;
  overflow: auto;
}
.content-rowTop {
  margin: 0.5%;
}
.bg {
  position: absolute;
  top: 0;
  left: 0;
  content: "";
  background-color: black;
  opacity: 0.4;
  z-index: 1;
  width: 100%;
  height: 100%;
}
</style>