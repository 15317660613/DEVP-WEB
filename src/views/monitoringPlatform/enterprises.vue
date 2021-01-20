<template>
  <div style="width: 800px">
    <model-obj
      id="place"
      :src="`${publicPath}3D/Model_SUV.obj`"
      :mtl="`${publicPath}3D/Model_SUV.mtl`"
      background-color="rgb(0,0,0)"
      :scale="{ x: 0.8, y: 0.8, z: 0.8 }"
      width="600px"
    />
  </div>
</template>manage_process
<!--import { OBJLoader, MTLLoader } from 'three-obj-mtl-loader'-->

<script>
import { ModelObj } from 'vue-3d-model'
export default {
  name: 'enterprises',
  components: {
    // eslint-disable-next-line no-undef
    ModelObj
  },
  data () {
    return {
      publicPath: process.env.BASE_URL
    }
  },
  methods: {
    /* init () {
      let mtlLoader = new MTLLoader()
      let _this = this
      mtlLoader.load(`3D/Model_SUV.mtl`, function (materials) {
        materials.preload()
        let objLoader = new OBJLoader()
        objLoader.load(`3D/Model_SUV.obj`, function (obj) {
          obj.scale.x = obj.scale.y = obj.scale.z = 100
          obj.rotation.y = 500
          let mesh = obj
          mesh.position.y = -50
          _this.scene.add(mesh)
        })
      })
    } */
  }
}
</script>

<style scoped>

</style>
