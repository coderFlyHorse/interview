<template>
  <div id="app">
    <h1 class="font-semibold text-4xl text-purple-700">vue2</h1>
    <img alt="Vue logo" src="./assets/logo.png">
    <input type="file" name="" @change="getFile" id="">
     <div v-for="(chunk,index) in fileChunkList" :key="index">
    <div> {{ chunk.name }}</div> 
    <input type="range" name="" :value="chunk.percentAge"   id="">
    </div>
  </div>
</template>

<script>

import SparkMD5 from 'spark-md5'
import { uploadFile, mergeChunks } from "./request/request"


export default {
  name: 'App',
  data() {
    return {
      currentFile: "",
      // 切好的数组
      fileChunkList: []

    }
  },
  methods: {
    async getFile(e) {


      this.currentFile = e.target.files[0]

      let fileHash = await this.getFileChunks(this.currentFile, 1024 * 1024)
      await this.uploadChunk(fileHash)
      console.log(fileHash)


    },
    getFileChunks(file, chunkSize) {

      let that = this
      return new Promise((resolve, reject) => {

        let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,

          chunks = Math.ceil(file.size / chunkSize), //总共会切多少块

          currentChunk = 0, //切到第几块
          spark = new SparkMD5.ArrayBuffer(), //文件哈希
          fileReader = new FileReader();

        fileReader.onload = function (e) {

          spark.append(e.target.result);                   // Append array buffer
          currentChunk++;

          if (currentChunk < chunks) {
            loadNext();
          } else {
            let fileHash = spark.end()

            resolve(fileHash)
            console.log('finished loading');
            console.info('computed hash', spark.end());  // Compute hash
          }
        };




        fileReader.onerror = function () {
          reject('oops, something went wrong.');
        };
        function loadNext() {
          var start = currentChunk * chunkSize, //开始切的位置
            end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize; //结束的位置

          let chunk = blobSlice.call(file, start, end)
          that.fileChunkList.push({
            chunk, size: chunk.size, name: that.currentFile.name, percentAge: 0
          })

          fileReader.readAsArrayBuffer(chunk)
        }
        loadNext()

      }

      )
    },
    onUploadProgressive(item){
      return function (e) {
        console.log(e)
        item.percentAge = parseInt(e.loaded/e.total*100)
      }
    },
    uploadChunk(fileHash) {
      let that = this
      let request = this.fileChunkList.map((item, index) => {
        const formData = new FormData()
        formData.append(`${this.currentFile.name}--${fileHash}--${index}`, item.chunk)

        return uploadFile('upload', formData,that.onUploadProgressive(item))

      })
      console.log(request)

      Promise.all(request).then(() => {
        // 合并
        mergeChunks('mergeChunks', { size: this.currentFile.size, fileName: this.currentFile.name })
      })

    }

  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
