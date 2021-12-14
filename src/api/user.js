// 用户相关请求模块

// 引入请求
import request from '@/utils/request'

// 用户登录
export const login = data => {
    return request({
        method: 'POST',
        url: '/mp/v1_0/authorizations',
        data
    })
}

// 获取用户信息
export const getUserProfile = () => {
    return request({
        method: 'GET',
        url: '/mp/v1_0/user/profile',
        headers: {
            // 属性名：Authorization，接口要求的
            // 属性值：Bearer空格token
            Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NzA5Mzc4NDcsInVzZXJfaWQiOjEsInJlZnJlc2giOmZhbHNlLCJ2ZXJpZmllZCI6dHJ1ZX0.2aFA44KOddeKigwy1DULBP3KuJZiBZGiHynog7Yt9Po'
        }
    })
}
