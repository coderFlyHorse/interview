<template>
  <div>
    <main class="outside_container">
      <p class="refreshText">refreshText</p>
      <ul @touchstart="touch" @touchmove="touchmove" ref="refreshContainer" id="refreshContainer">
        <li>111</li>
        <li>222</li>
        <li>333</li>
        <li>444</li>
        <li>555</li>
        ...
      </ul>
    </main>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      startProps: 0,
      transitionHeight: 0
    }
  },
  methods: {
    // 触发
    touch(e) {
      this.$refs.refreshContainer.style.position = "relative"
      this.$refs.refreshContainer.style.transition = 'transform 0s'
      this.startProps = e.touches[0].pageY
    },
    //  touchmove
    touchmove(e) {
      // 下拉的时候记录差值
      this.transitionHeight = e.touches[0].pageY - this.startProps
      // 下拉的时候大于0 上拉的时候小于0
      console.log(this.transitionHeight)
    }
  } 
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.outside_container{
  height: 300px;
  .refreshText{
    height:300px;
    border: 1px solid red;
  }
}
</style>
