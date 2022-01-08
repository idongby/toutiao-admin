<template>
    <div class="image-container">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <!-- 标题 -->
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>素材管理</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <!-- 分类 -->
            <div class="action-head">
                <el-radio-group
                    v-model="collect"
                    size="mini"
                    @change="loadImages(1)">
                    <el-radio-button
                        :label="false"
                    >全部</el-radio-button>
                    <el-radio-button
                        :label="true"
                    >收藏</el-radio-button>
                </el-radio-group>
                <el-button
                    size="mini"
                    type="success"
                    @click="dialogUploadVisible = true"
                >上传素材</el-button>
            </div>
            <!-- 素材列表 -->
            <el-row :gutter="10">
                <el-col :xs="12" :sm="6" :md="6" :lg="4"
                    v-for="(item,index) in images"
                    :key="index"
                    class="image-item">
                    <el-image
                        style="height: 100px"
                        :src="item.url"
                        fit="cover"
                    ></el-image>
                    <div class="image-action">
                        <el-button
                            type="warning"
                            :icon="item.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'"
                            circle
                            size="small"
                            @click="onCollect(item)"
                            :loading="item.loading"
                        ></el-button>
                        <el-button
                            type="danger"
                            icon="el-icon-delete-solid"
                            circle
                            size="small"
                            @click="onDelete(item)"
                            :loading="item.loading"
                        ></el-button>
                    </div>
                </el-col>
            </el-row>
            <!-- 页码 -->
            <el-pagination
                class="pagination"
                background
                @current-change="onCurrentChange"
                :current-page.sync="page"
                :page-size="perPage"
                layout="prev, pager, next, jumper"
                :total="totalCount">
            </el-pagination>
        </el-card>
        <el-dialog
            title="上传素材"
            :visible.sync="dialogUploadVisible"
            :append-to-body="true">
            <!--
                upload 组件本身就支持请求提交上传操作，
                不用自己发起请求，它会自己发。
                请求方法：默认是POST
                请求路径：action，必须是完整路径
                请求头：headers
            -->
            <el-upload
                class="upload-demo"
                drag
                action="http://api-toutiao-web.itheima.net/mp/v1_0/user/images"
                multiple
                :headers="uploadHeaders"
                name="image"
                :on-success="onUploadSuccess">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
        </el-dialog>
    </div>
</template>

<script>
import {
    getImages,
    collectImage,
    deleteImage
} from '@/api/image.js'
export default {
    name: 'ImageIndex',
    components: {},
    props: {},
    data () {
        const user = JSON.parse(window.localStorage.getItem('user'))
        return {
            collect: false, // 默认  查询全部图片
            images: [], // 图片素材列表
            dialogUploadVisible: false, // 上传 图片弹窗层
            uploadHeaders: {
                Authorization: `Bearer ${user.token}`
            },
            perPage: 10,
            page: 1,
            totalCount: 0
        }
    },
    computed: {},
    watch: {},
    created () {
        this.loadImages()
    },
    mounted () {},
    methods: {
        // 获取图片列表
        loadImages (page = 1) {
            this.page = page
            getImages({
                collect: this.collect,
                page: this.page
            }).then(res => {
                const images = res.data.data.results
                images.forEach(img => {
                    img.loading = false
                })
                this.images = images
                this.perPage = res.data.data.per_page
                this.totalCount = res.data.data.total_count
            })
        },

        // 上传成功
        onUploadSuccess () {
            // 关闭上传弹窗
            this.dialogUploadVisible = false

            // 更新素材列表
            this.collect = false
            this.loadImages()

            this.$message({
                message: '上传成功',
                type: 'success'
            })
        },

        // 页码改变
        onCurrentChange (page) {
            this.loadImages(page)
        },

        // 收藏按钮
        onCollect (img) {
            img.loading = true
            collectImage(img.id, !img.is_collected).then(res => {
                img.is_collected = !img.is_collected
                img.loading = false
            })
        },

        // 删除图片
        onDelete (img) {
            img.loading = true
            deleteImage(img.id).then(res => {
                this.loadImages(this.page)
                img.loading = false
            })
        }
    }
}
</script>

<style scoped lang="less">
.action-head {
    padding-bottom:20px;
    display: flex;
    justify-content: space-between;
}
/deep/ .el-upload{
    display: flex;
    justify-content: center;
}
.el-upload__tip {
    text-align: center;
}
.pagination{
    display: flex;
    justify-content: center;
}
.image-item {
    position: relative;
}
.image-action {
    font-size: 25px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    color: #fff;
    height: 40px;
    background-color: rgba(204, 204, 204, .5);
    position: absolute;
    bottom: 4px;
    left: 5px;
    right: 5px;
}
</style>
