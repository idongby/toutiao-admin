// 文章相关请求模块

import request from '@/utils/request'

// 获取文章列表
export const getArticle = params => {
    return request({
        method: 'GET',
        url: '/mp/v1_0/articles',
        // Body 参数使用 data 设置
        // Query 参数使用 params 设置
        // Headers 参数使用 headers 设置
        params
    })
}

// 获取文章频道
export const getArticleChannels = () => {
    return request({
        method: 'GET',
        url: '/mp/v1_0/channels'
    })
}

// 删除文章
export const deleteArticle = articleId => {
    return request({
        method: 'DELETE',
        url: `/mp/v1_0/articles/${articleId}`
    })
}

// 发布文章
export const addArticle = (data, draft) => {
    return request({
        method: 'POST',
        url: '/mp/v1_0/articles',
        params: {
            draft // 是否存为草稿，true为草稿
        },
        data
    })
}

// 编辑文章
export const updateArticle = (articleId, data, draft = false) => {
    return request({
        method: 'PUT',
        url: `/mp/v1_0/articles/${articleId}`,
        params: {
            draft // 是否存为草稿，true为草稿
        },
        data
    })
}

// 获取指定文章
export const gatArticle = articleId => {
    return request({
        method: 'GET',
        url: `/mp/v1_0/articles/${articleId}`
    })
}

// 修改文章评论状态
export const updataCommentStatus = (articleId, allowComment) => {
    return request({
        method: 'PUT',
        url: '/mp/v1_0/comments/status',
        params: {
            article_id: articleId
        },
        data: {
            allow_comment: allowComment
        }
    })
}
