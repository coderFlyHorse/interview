<template>
  <div id="app">

    <HelloWorld/>
    <SwiperComponents></SwiperComponents>
    <VirtualScroll/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
const SwiperComponents =()=> import ('./components/SwiperComponents.vue') 
const VirtualScroll = ()=> import ('./components/VirtualScroll.vue')
export default {
  name: 'App',
  components: {
    HelloWorld,
    SwiperComponents,
    VirtualScroll
  }
}
</script>

<style>

</style>
