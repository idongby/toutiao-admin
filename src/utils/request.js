// 基于 axios 封装的请求模块
import axios from 'axios'

// 创建一个axios 实例
const request = axios.create({
    baseURL: 'http://api-toutiao-web.itheima.net' // 请求的基础路径
})

// 导出请求方法
export default request
