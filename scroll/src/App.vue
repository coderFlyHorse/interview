<template>
  <div id="app">

    <BlockScroll/>
    <VirtualScroll/>
 
  </div>
</template>

<script>

const VirtualScroll = ()=> import ('./components/VirtualScroll.vue')
const BlockScroll = ()=> import ('./components/BlockScroll.vue')
export default {
  name: 'App',
  components: {
    // HelloWorld,
    // SwiperComponents,
    VirtualScroll,
    BlockScroll
  }
}
</script>

<style>
#app{
  margin: 0 auto;
 
}
</style>
