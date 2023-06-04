<template>
    <div class="block_render">
        <div class="item" v-for="(item, index) in dealList" :key="index">{{ item }}</div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            start: 1,
            size: 20,
            originalList: [],
            dealList: []
        }
    },
    mounted() {
        this.fakeData()
        this.load()
    },
    methods: {
        fakeData() {
            for (let index = 0; index < 10000; index++) {

                this.originalList.push("But look at me now")
            }
        },
        load() {
            let temList = this.originalList.slice(this.start, this.start + this.size)
            if (temList && temList.length > 0) {
                setTimeout(() => {
                    this.dealList = [...this.dealList, ...temList]
                    this.start = this.start + this.size
                    this.load()
                }, 150);

            }
        }
    },
    beforeDestroy() {

    },
}
</script>
<style>
.block_render{
    height: 200px;
    overflow: scroll;
    
}
.item{
    text-align: center;
}
</style>