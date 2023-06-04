<template>
    <div class="wrapper">
        <!-- 列表容器 -->
        <div class="virtual_list" ref="virtual_list" @scroll="handleScroll" :style="{ height: `${height * size}px` }">
            <!-- 根据数据多少获取元素高度(撑起滚动高度) -->
            <div :style="{ height: `${originalList.length * height}px` }"></div>
            <!-- 可视区域 -->
            <div class="container" :style="{ top: `${scrollTop}px` }">
                <!-- 需要渲染的内容 -->
                <div class="dataItem" v-for="(item, index) in renderList" :key="index" :style="{ height: `${height}px` }">{{
                    item  }}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            originalList: [],
            start: 0, //开始的位置
            size: 20,  // 可见元素
            height: 20, // item的高度
            scrollTop: 0, // 滚动的距离
        }
    },
    mounted() {
        this.fakeData()
    },
    computed: {
        // 需要渲染的列表
        renderList() {
            return this.originalList.slice(this.start, this.start + this.size)
        }
    },
    methods: {
        fakeData() {
            for (let index = 0; index < 10000; index++) {

                this.originalList.push(`But look at me now${index}`)
            }
        },
        handleScroll() {
            //scrollTop 滚动条向下滚动的距离
            this.scrollTop = this.$refs.virtual_list.scrollTop
               //scrollTop 滚动条向下滚动的距离 除以单个item的高频度得到start
            this.start = this.scrollTop / this.height
            console.log(this.start)
        },
    },
    beforeDestroy() {

    },
}
</script>
<style lang='less' scoped>
.wrapper {
    .virtual_list {
        overflow: auto;
        position: relative;
        width: 300px;
        border: 1px solid red;

    }

    .container {
        position: absolute;
        left: 0;
        top: 0;
    }
}
</style>