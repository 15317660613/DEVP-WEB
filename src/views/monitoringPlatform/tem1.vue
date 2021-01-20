<template>
  <div class="flexBlock">
  <div class="content">
    <div><img src="./images/tem1.jpg" width="100%" height="100%"></div>
  </div>
  </div>
</template>

<script>
    export default {
      name: 'tem1',
      data() {
      return {}
      }
    }
</script>

<style scoped>
.flexBlock {
  display: flex;
  flex-grow: 1;
}
.content {
  width: 100%;
  height: 100%;
  overflow: auto;
}
.content-rowTop {
  margin: 0.5%;
}
</style>