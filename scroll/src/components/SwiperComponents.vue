<template>
    <div class="swiper_container">
        <ul class="shell">
            <li v-for="(item, index) in imgArr" :class="presentShow(index)"  :key="index"><img :src="item" alt=""> </li>

        </ul>
        <button @click="lastImg" class="left"> L </button>
        <button @click="nextImg" class="right"> N </button>
    </div>
</template>

<script>


export default {
    data() {
        return {
            presentIndex: 1,
            imgArr: [require('../assets/wallhaven-429mjm.jpg'), require('../assets/wallhaven-429mjm.jpg'), require('../assets/wallhaven-429mjm.jpg'), require('../assets/wallhaven-429mjm.jpg')]
        }
    },
    mounted() {

    },
    computed: {
        presentShow() {
            return (index) => {
                return index == this.presentIndex ? "present_img" : ""
            }
        }
    },
    methods: {
        lastImg() {
            this.presentIndex--
         },
        nextImg() {
            this.presentIndex++
         }
    },
    beforeDestroy() {

    },
}
</script>
<style lang='less' scoped>
.swiper_container{
    height: 400px;
    width: 800px;
    border: 1px solid red;
}
.shell {
    list-style: none;
    padding: 0;
    margin: auto;
    display: flex;
   
}

ul>li {
    cursor: pointer;
}

li>img {
    width: 400px;
    height: 200px;
}

.present_img {
    transform: scale(1.3);
}
</style>