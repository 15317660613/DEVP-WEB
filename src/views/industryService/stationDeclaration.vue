<template>
  <div class="container">
    <div class="btn-group">
      <div class="btn" v-for="(item, index) in btnText" :class="{activeBtn:istrue==index}" @click="istrue = index">{{item}}</div>
    </div>
    <Parts v-if="istrue===0"></Parts>
    <Model v-if="istrue===1"></Model>
    <Vehicle v-if="istrue===2"></Vehicle>
  </div>
</template>

<script>
    import Parts from '@/components/industryService/parts'
    import Vehicle from '@/components/industryService/vehicle'
    import Model from '@/components/industryService/model'

    export default {
        name: "stationDeclaration",
        components: {
            Parts,
            Vehicle,
            Model
        },
        data() {
            return {
                istrue: 0,
                btnText: ['零部件', '车型', '车辆']
            }
        }
    }
</script>

<style scoped>
  .container {
    width: 100%;
  }

  .btn-group {
    display: flex;
    margin: 10px 10px 10px 20px;
  }

  .btn-group .btn {
    width: 108px;
    height: 40px;
    line-height: 40px;
    color: #6a9edb;
    font-size: 14px;
    text-align: center;
    margin-right: 10px;
    background-color: #FFF;
    border-radius: 1px;
    border: 1px solid rgba(214, 214, 214, 1);
    box-shadow: 0 0 5px rgba(214, 214, 214, 1);
    cursor: pointer;
  }

  .btn-group .btn.activeBtn {
    color: #FFF;
    background-color: #4a90e4;
  }
</style>
