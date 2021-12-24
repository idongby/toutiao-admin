<template>
    <div class="pubulish-container">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>{{ $route.query.id ? '修改文章' : '发布文章'}}</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <el-form ref="form" :model="article" label-width="40px">
                <el-form-item label="标题">
                    <el-input v-model="article.title"></el-input>
                </el-form-item>
                <el-form-item label="内容">
                    <el-input type="textarea" v-model="article.content"></el-input>
                </el-form-item>
                <el-form-item label="封面">
                    <el-radio-group v-model="article.cover.type">
                        <el-radio :label="1">单图</el-radio>
                        <el-radio :label="3">三图</el-radio>
                        <el-radio :label="0">无图</el-radio>
                        <el-radio :label="-1">自助</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="频道">
                    <el-select v-model="article.channel_id" placeholder="请选择频道">
                    <el-option
                      v-for="(channel, index) in channels"
                      :key="index"
                      :label="channel.name"
                      :value="channel.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onPublish(false)">发表</el-button>
                    <!-- <el-button @click="onPublish(true)">存入草稿</el-button> -->
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
import { getArticleChannels, addArticle, updateArticle, gatArticle } from '@/api/article'
export default {
    name: 'PublishIndex',
    props: {

    },
    data () {
        return {
            article: {
                title: '', // 文章标题
                content: '', // 文章内容
                cover: { // 文章封面
                    type: 1, // 封面类型
                    // -1：自动，0：无图，1：1张，3：3张
                    images: [] // 图片地址
                },
                channel_id: null // 频道id
            },
            channels: [] // 频道列表
        }
    },
    computed: {

    },
    created () {
        this.loadChannels()

        //  由于发布和修改使用的同一个组件
        //  所以这里要判断
        //  如果路由路径参数中 有 id，则请求展示文章内容
        if (this.$route.query.id) {
            this.loadArticle()
        }
    },
    mounted () {

    },
    watch: {

    },
    methods: {
        // 获取频道列表
        loadChannels () {
            getArticleChannels().then(({ data }) => {
                this.channels = data.data.channels
            })
        },
        // 发布文章
        onPublish (draft = false) {
            // 如果是修改文章，则执行修改操作，否则发布操作
            const articleId = this.$route.query.id
            if (articleId) {
                // 执行修改操作
                updateArticle(articleId, this.article, draft).then(res => {
                    this.$message({
                        type: 'success',
                        message: '修改成功'
                    })
                })
            } else {
                addArticle(this.article, draft).then(res => {
                    this.$message({
                        type: 'success',
                        message: '发布成功'
                    })
                })
                this.$router.push('/article')
            }
        },
        // 修改文章：加载文章内容
        loadArticle () {
            gatArticle(this.$route.query.id).then(res => {
                console.log(res)
                this.article = res.data.data
            })
        }
    },
    components: {

    }
}
</script>

<style scoped lang="less">

</style>
