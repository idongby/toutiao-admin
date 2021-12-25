// 素材请求相关模块

import request from '@/utils/request'

// 上传图片素材
export const uploadImage = data => {
    return request({
        method: 'POST',
        url: '/mp/v1_0/user/images',
        // 一般文件上传的接口都需要把请求头的 Conteent-Type
        // 设置为 multipart/form-data
        // 但是使用 axios 上传文件的话不需要手动设置
        // 给 data 一个 FormData 对象即可。
        // new FormData()
        data
    })
}
