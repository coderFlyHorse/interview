<template>
  <div id="app">

    <HelloWorld/>
    <SwiperComponents></SwiperComponents>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
const SwiperComponents =()=> import ('./components/SwiperComponents.vue') 
export default {
  name: 'App',
  components: {
    HelloWorld,
    SwiperComponents
  }
}
</script>

<style>

</style>
