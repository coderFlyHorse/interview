const path = require('path')
const fs = require('fs')
const { koaBody } = require('koa-body')
const router = require('koa-router')()
const outPath = path.join(__dirname, '/upload/')
router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})
router.post('/upload', koaBody({
  multipart: true, //处理formData数据
  formidable: {
    uploadDir: outPath,
    onFileBegin(name, file) {
      let [filename, fileHash, index] = name.split("--")

      let dir = path.join(outPath, filename)

      //  检测是否存在dir这个目录
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
      }
      // 修改存放位置
      file.filepath = `${dir}/${fileHash}--${index}`


    },
    onError() {
      console.log("上传失败")
    }
  }
}), async (ctx, next) => {
  console.log(ctx.request.body)

  ctx.body = {
    title: 'koa2 json'
  }
})
router.post('/mergeChunks', async (ctx, next) => {
  const { fileName, size } = ctx.request.body
  console.log("接受到的内容",fileName,size)
  await mergeChunks(fileName, size)
  ctx.body = {
    title: 'koa2 json'
  }
})
const mergeChunks = (filename, size) => {
  let readPath = path.join(outPath, filename)

  let chunkList = fs.readdirSync(readPath)


  if (!chunkList.length) {
    return
  } else {

    // 排序
    chunkList.sort((a, b) => { return a.split('--')[1] - b.split('--')[1] })
    let count = 0
    let length = chunkList.length
    console.log(chunkList)
    chunkList.forEach((chunkPath, index) => {
      let readStream = fs.createReadStream(path.resolve(readPath, chunkPath))

      let writeStream = fs.createWriteStream(path.join(outPath, "_" + filename), { start: index * size, end: (index + 1) * size })

      readStream.pipe(writeStream)
      readStream.on('end', () => {
        // 删掉读取的文件分块
        console.log(path.resolve(readPath, chunkPath))
        fs.rmSync(path.resolve(readPath, chunkPath))
        count++
        if (count >= length) {
          //  所有块完成
          console.log(count)
          fs.rmSync(readPath)
        }
      })
    })

  }
}
module.exports = router
