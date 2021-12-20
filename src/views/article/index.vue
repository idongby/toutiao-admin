<template>
    <div class="article-container">
        <el-card class="filter-card">
            <div slot="header" class="clearfix">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>活动管理</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <el-form ref="form"  label-width="40px" size='small'>
                <el-form-item label="状态">
                    <el-radio-group v-model="status">
                        <el-radio :label="null">全部</el-radio>
                        <el-radio :label="0">草稿</el-radio>
                        <el-radio :label="1">待审核</el-radio>
                        <el-radio :label="2">审核通过</el-radio>
                        <el-radio :label="3">审核失败</el-radio>
                        <el-radio :label="4">已删除</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="频道">
                    <el-select v-model="channelId" placeholder="请选择频道">
                    <el-option
                      label="全部"
                      :value="null"
                    ></el-option>
                    <el-option
                      :label="channels.name"
                      :value="channels.id"
                      v-for="(channels, index) in channels"
                      :key="index"
                    ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="日期">
                    <el-date-picker
                        v-model="rangeDate"
                        type="daterange"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-time="['12:00:00']"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary"
                     :disabled="loading"
                     @click="loadArticles(1)">查询</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <el-card class="box-card">
            <div slot="header" class="clearfix">
                根据筛选条件共查询到 {{totalCount}} 条结果：
            </div>
            <el-table
                :data="articles"
                stripe
                style="width: 100%"
                class="list-table"
                size="mini"
                v-loading="loading"
            >
                <el-table-column
                    prop="date"
                    label="封面"
                >
                    <template slot-scope="scope">
                        <el-image
                          style="width: 100px; height: 80px"
                          :src="scope.row.cover.images[0]"
                          fit="cover"
                          lazy
                        >
                            <div slot="placeholder" class="image-slot">
                                加载中<span class="dot">...</span>
                            </div>
                        </el-image>
                        <!-- <img v-if="scope.row.cover.images[0]" class="article-cover" :src="scope.row.cover.images[0]" alt="">
                        <img v-else class="article-cover" src="./no-image.gif" alt=""> -->
                    </template>
                </el-table-column>
                <el-table-column
                    prop="title"
                    label="标题"
                >
                </el-table-column>
                <el-table-column
                    label="状态"
                >
                <!--
                    如果需要在自定义列模板中获取当前遍历项数据，
                    那么就在 template 上声明
                    slot-scope="scope"
                 -->
                    <template slot-scope="scope">
                        <el-tag :type="statusTag[scope.row.status].type">
                            {{statusTag[scope.row.status].name}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="pubdate"
                    label="发布日期"
                >
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="操作"
                >
                    <template>
                        <el-button
                            size="mini"
                            circle
                            icon="el-icon-edit"
                            type="primary"
                        ></el-button>
                        <el-button
                            size="mini"
                            type="danger"
                            icon="el-icon-delete"
                            circle
                        ></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                background
                layout="prev, pager, next"
                :total="totalCount"
                :disabled="loading"
                @current-change="onCurrentChange">
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
import { getArticle, getArticleChannels } from '@/api/article'
export default {
    name: 'ArticleIndex',
    props: {

    },
    data () {
        return {
            statusTag: [ // 文章状态tag
                {
                    type: 'info',
                    name: '草稿'
                },
                {
                    type: '',
                    name: '待审核'
                },
                {
                    type: 'success',
                    name: '审核通过'
                },
                {
                    type: 'warning',
                    name: '审核失败'
                },
                {
                    type: 'danger',
                    name: '已删除'
                }
            ],
            articles: [], // 文章数据列表
            totalCount: 1, // 共多少条数据
            status: null, // 查询文章的状态
            channels: [], // 文章频道列表
            channelId: null, // 默认选择频道
            rangeDate: [], // 筛选的范围日期
            loading: false // loading 加载中
        }
    },
    computed: {

    },
    created () {
        this.loadArticles(1)
        this.loadChannels()
    },
    mounted () {

    },
    watch: {

    },
    methods: {
        // 调取 文章 数据
        loadArticles (page = 1) {
            this.loading = true // 加载中开启
            getArticle({
                page,
                per_page: 10,
                status: this.status,
                channel_id: this.channelId,
                begin_pubdate: this.rangeDate ? this.rangeDate[0] : null, // 开始日期
                end_pubdate: this.rangeDate ? this.rangeDate[1] : null // 截止日期
            }).then(res => {
                const { results, total_count: totalCount } = res.data.data
                this.articles = results
                this.totalCount = totalCount
                this.loading = false // 加载结束
            })
        },
        onSubmit () {
            console.log('submit!')
        },

        // 页码改变
        onCurrentChange (page) {
            this.loadArticles(page)
        },

        // 获取文章频道
        loadChannels () {
            getArticleChannels().then(res => {
                this.channels = res.data.data.channels
            })
        }
    },
    components: {

    }
}
</script>

<style scoped lang="less">
.filter-card {
    margin-bottom: 20px;
}
.list-table {
    margin-bottom: 20px;
}
.article-cover{
    width: 60px;
    background-size: cover;
}
</style>
