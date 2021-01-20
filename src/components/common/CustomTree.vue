<template>
  <tree
    :nodes="nodes"
    :setting="setting"
    @onClick="onClick"
    @onCheck="onCheck"
    @onCreated="handleCreated"
  />
</template>
<script>
import tree from "vue-giant-tree";
export default {
  name: "CustomTree",
  props: ["nodes", "setting"],
  data() {
    return {
      zTreeNodes: [],
    };
  },
  components: {
    tree
  },
  methods: {
    onClick(val, treeId, node) {
      this.$emit("onCustomClick", val, treeId, node);
    },
    onCheck(val) {
      this.$emit("onCustomCheck", val);
    },
    handleCreated(ztreeObj) {
      this.zTreeNodes = ztreeObj.transformToArray(ztreeObj.getNodes());
    },
  },
};
</script>
<style lang="less" scoped>
/deep/ .AREA_ico_close {
  background-image: url("../../assets/img/statistics/shengji.png");
  background-color: transparent;
  background-repeat: no-repeat;
  background-attachment: scroll;
  background-size: contain;
  width: 14px !important;
  height: 11px !important;
}
/deep/ .AREA_ico_open {
  background-image: url("../../assets/img/statistics/shengji.png");
  background-color: transparent;
  background-repeat: no-repeat;
  background-attachment: scroll;
  background-size: contain;
  width: 14px !important;
  height: 11px !important;
}
/deep/ .VEHICLE_COMPANY_ico_close {
  background-image: url("../../assets/img/statistics/gongsi.png");
  background-color: transparent;
  background-repeat: no-repeat;
  background-attachment: scroll;
  background-size: contain;
  width: 14px !important;
  height: 11px !important;
}
/deep/ .VEHICLE_COMPANY_ico_open {
  background-image: url("../../assets/img/statistics/gongsi.png");
  background-color: transparent;
  background-repeat: no-repeat;
  background-attachment: scroll;
  background-size: contain;
  width: 14px !important;
  height: 11px !important;
}
/deep/ .VEHICLE_TYPE_ico_open {
  background-image: url("../../assets/img/statistics/chexing.png");
  background-color: transparent;
  background-repeat: no-repeat;
  background-attachment: scroll;
  background-size: contain;
  width: 14px !important;
  height: 11px !important;
}
/deep/ .VEHICLE_TYPE_ico_close {
  background-image: url("../../assets/img/statistics/chexing.png");
  background-color: transparent;
  background-repeat: no-repeat;
  background-attachment: scroll;
  background-size: contain;
  width: 14px !important;
  height: 11px !important;
}
/deep/ .AREA_ico_docu {
  background-image: url("../../assets/img/statistics/shengji.png");
  background-color: transparent;
  background-repeat: no-repeat;
  background-attachment: scroll;
  background-size: contain;
  width: 14px !important;
  height: 11px !important;
}
/deep/ .SITE_ico_docu {
  background-image: url("../../assets/img/statistics/jiaqing.png");
  background-color: transparent;
  background-repeat: no-repeat;
  background-attachment: scroll;
  background-size: contain;
  width: 14px !important;
  height: 11px !important;
}
/deep/ .VEHICLE_TYPE_ico_docu {
  background-image: url("../../assets/img/statistics/chexing.png");
  background-color: transparent;
  background-repeat: no-repeat;
  background-attachment: scroll;
  background-size: contain;
  width: 14px !important;
  height: 11px !important;
}
/deep/ .VEHICLE_ico_docu {
  background-image: url("../../assets/img/statistics/cheliang.png");
  background-color: transparent;
  background-repeat: no-repeat;
  background-attachment: scroll;
  background-size: contain;
  width: 14px !important;
  height: 11px !important;
}
/deep/ .VEHICLE_COMPANY_ico_docu {
  background-image: url("../../assets/img/statistics/gongsi.png");
  background-color: transparent;
  background-repeat: no-repeat;
  background-attachment: scroll;
  background-size: contain;
  width: 14px !important;
  height: 11px !important;
}
// switch (item.type) {
//   case "AREA":
//      item.icon = this.shengji;
//     break;
//   case "SITE":
//     item.icon = this.jiaqing;
//     break;
//   case "VEHICLE_TYPE":
//     item.icon = this.chexing;
//     break;
//   case "VEHICLE":
//     item.icon = this.cheliang;
//     break;
//   case "VEHICLE_COMPANY":
//     item.icon = this.gongsi;
//     break;
// }
// /deep/.roots_open,
// /deep/.roots_open,
// /deep/.bottom_open,
// /deep/.center_open {
//   background-image: url("../../assets/img/statistics/file_open.png");
//   background-color: transparent;
//   background-repeat: no-repeat;
//   background-attachment: scroll;
//   background-size: contain;
//   width: 14px !important;
//   height: 11px !important;
// }
// /deep/.roots_close,
// /deep/.center_close,
// /deep/.bottom_close,
// /deep/.center_close {
//   background-image: url("../../assets/img/statistics/file_close.png");
//   background-color: transparent;
//   background-repeat: no-repeat;
//   background-attachment: scroll;
//   background-size: contain;
//   width: 14px !important;
//   height: 11px !important;
// }
// /deep/.roots_open:before,
// /deep/.roots_open:before,
// /deep/.bottom_open:before,
// /deep/.center_open:before,
// /deep/.roots_close:before,
// /deep/.center_close:before,
// /deep/.bottom_close:before,
// /deep/.center_close:before {
//   display: none !important;
// }
/deep/.line {
  border-bottom: none;
}
</style>
