// 基于 axios 封装的请求模块
import router from '@/router'
import axios from 'axios'

import JSONbig from 'json-bigint'

// 非组件模块可以这样加载使用 element 的 message 提示组件
import { Message } from 'element-ui'

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
// 响应拦截器
request.interceptors.response.use(function (response) {
    // 所以响应码为 2xx 的响应都会进入这里
    return response
}, function (error) {
    const { status } = error.response
    if (status === 401) {
        // 清楚本地存储中的用户登录状态
        window.localStorage.removeItem('user')
        // 跳转到登录页
        router.push('/login')
        Message('登录状态无效，请重新登录')
    } else if (status === 400) {
        // 客户端参数错误
        Message.error('请求参数错误，请检查请求参数')
    } else if (status === 403) {
        // token 未携带 或 已过期
        Message({
            type: 'warning',
            message: '没有操作权限'
        })
    } else if (status >= 500) {
        // 服务器错误
        Message.error('服务的内部异常，请稍后重试')
    }
})

// 导出请求方法
export default request
