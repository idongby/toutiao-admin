<template>
    <div class="comment-container">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>评论管理</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <el-table
                class="table-list"
                :data="articels"
                style="width: 100%">
                <el-table-column
                    prop="title"
                    label="标题">
                </el-table-column>
                <el-table-column
                    prop="total_comment_count"
                    label="总评论数">
                </el-table-column>
                <el-table-column
                    prop="fans_comment_count"
                    label="粉丝评论数">
                </el-table-column>
                <el-table-column
                    prop="comment_status"
                    label="状态">
                    <template slot-scope="scope">
                        {{scope.row.comment_status ? '正常' : '关闭'}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="comment_status"
                    label="操作">
                    <template slot-scope="scope">
                        <el-switch
                            v-model="scope.row.comment_status"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            :disabled="scope.row.statusDisabled"
                            @change="onStatusChange(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                class="pagination"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="page"
                :page-sizes="[10, 20, 30, 40, 50]"
                :page-size.sync="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount"
                background>
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
import {
    getArticle,
    updataCommentStatus
} from '@/api/article'
export default {
    name: 'CommentIndex',
    components: {

    },
    props: {

    },
    data () {
        return {
            articels: [], // 文章数据列表
            totalCount: 0, // 总数据条数
            pageSize: 10, // 每页条数
            page: 1 // 当前激活的页码
        }
    },
    computed: {

    },
    watch: {

    },
    created () {
        this.loadArticles()
    },
    mounted () {

    },
    methods: {
        handleSizeChange () {
            this.loadArticles(1)
        },
        handleCurrentChange (page) {
            this.loadArticles(page)
        },
        loadArticles (page = 1) {
            this.page = page
            getArticle({
                response_type: 'comment',
                page,
                per_page: this.pageSize
            }).then(res => {
                const { results } = res.data.data
                results.forEach(article => {
                    article.statusDisabled = false
                })
                this.articels = results
                this.totalCount = res.data.data.total_count
            })
        },

        onStatusChange (article) {
            // console.log(article)
            article.statusDisabled = true
            updataCommentStatus(article.id.toString(), article.comment_status).then(res => {
                // console.log(res)
                article.statusDisabled = false
                this.$message({
                    type: 'success',
                    message: article.comment_status ? '开启评论' : '关闭评论'
                })
            })
        }
    }
}
</script>

<style scoped lang="less">
.table-list {
    margin-bottom: 30px;
}
.pagination{
    display: flex;
    justify-content: center;
}
</style>
