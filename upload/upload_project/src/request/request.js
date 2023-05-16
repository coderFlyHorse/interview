import axios from "axios"

const baseUrl = "http://localhost:3000"

const instance = axios.create({
    baseURL: baseUrl,
    
  })
  

// 上传
export const uploadFile = (url, data,onUploadProgressive) => {
    return instance({
        method: "post",
        url: url,
        data: data,
        onUploadProgressive,
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
}
// 合并
export const mergeChunks = (url, data) => {
    return instance({
        method: "post",
        url: url,
        data,
        headers: {
            "Content-Type": "application/json"
        }
    })
}