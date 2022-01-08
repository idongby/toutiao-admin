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

// 获取素材列表
export const getImages = params => {
    return request({
        method: 'GET',
        url: '/mp/v1_0/user/images',
        params
    })
}

// 收藏素材列表
export const collectImage = (imageId, collect) => {
    return request({
        method: 'PUT',
        url: `/mp/v1_0/user/images/${imageId}`,
        data: {
            collect
        }
    })
}

// 删除素材列表
export const deleteImage = imageId => {
    return request({
        method: 'DELETE',
        url: `/mp/v1_0/user/images/${imageId}`
    })
}
