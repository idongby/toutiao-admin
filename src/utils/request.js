// 基于 axios 封装的请求模块
import axios from 'axios'

import JSONbig from 'json-bigint'

// 创建一个axios 实例
const request = axios.create({
    baseURL: 'http://api-toutiao-web.itheima.net', // 请求的基础路径

    // 定义后端返回的原生数据的处理
    // 参数 data 就是后端返回的原始数据 （未经处理的 JSON 格式）
    transformResponse: [function (data) {
        // 后端返回的数据可能不是 JSON 格式字符串
        // 如果不是的话，JSONbig.parse 调用就会报错
        // 所以需要用 try-catch 来捕获异常，处理异常的发生
        try {
            return JSONbig.parse(data)
        } catch (err) {
            return data
        }

        // axios 默认在内部使用 JSON.parse 来转换处理数据
    }]
})

// 请求拦截器
request.interceptors.request.use(
    // config 是当前请求相关的配置信息对象
    // config 是可以修改的
    function (config) {
        const user = JSON.parse(window.localStorage.getItem('user'))

        // 如果有登录用户的信息，则统一设置 token
        if (user) {
            config.headers.Authorization = `Bearer ${user.token}`
        }
        return config
    }
)
// 相应拦截器

// 导出请求方法
export default request
