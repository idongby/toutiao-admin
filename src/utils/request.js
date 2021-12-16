// 基于 axios 封装的请求模块
import axios from 'axios'

// 创建一个axios 实例
const request = axios.create({
    baseURL: 'http://api-toutiao-web.itheima.net' // 请求的基础路径
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
