<template>
    <div class="pubulish-container">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>{{ $route.query.id ? '修改文章' : '发布文章'}}</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <el-form ref="publish-form" :model="article" :rules="formRules" label-width="60px">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="article.title"></el-input>
                </el-form-item>
                <el-form-item label="内容" prop="content">
                    <!-- <el-input type="textarea" v-model="article.content"></el-input> -->
                    <el-tiptap
                      v-model="article.content"
                      :extensions="extensions"
                      lang="zh"
                      height="350"
                      placeholder="请输入文章内容">
                    </el-tiptap>
                </el-form-item>
                <el-form-item label="封面">
                    <el-radio-group v-model="article.cover.type">
                        <el-radio :label="1">单图</el-radio>
                        <el-radio :label="3">三图</el-radio>
                        <el-radio :label="0">无图</el-radio>
                        <el-radio :label="-1">自助</el-radio>
                    </el-radio-group>
                    <!--
                        $event 代表的事件本身的参数，子组件穿进来的参数

                        给子组件提供的数据 还要修改的时候，可以使用 v-model 数据绑定
                        v-model="article.cover.images[index]"
                            给子组件传递了一个名字叫 value 的数据
                            :value="article.cover.images[index]"
                            默认监听 input 事件，
                            当事件发生，它会让绑定数据 = 事件参数
                            @imput="article.cover.images[index] = 事件参数"
                    -->
                    <template v-if="article.cover.type > 0">
                        <upload-cover
                            v-for="(cover, index) in article.cover.type"
                            :key="index"
                            v-model="article.cover.images[index]"
                        />
                        <!-- <upload-cover
                            v-for="(cover, index) in article.cover.type"
                            :key="index"
                            :cover-image="article.cover.images[index]"
                            @update-cover="onUpdateCover(index, $event)"
                        /> -->
                    </template>
                </el-form-item>
                <el-form-item label="频道" prop="channel_id">
                    <el-select v-model="article.channel_id" placeholder="请选择频道">
                    <el-option
                        v-for="(channel, index) in channels"
                        :key="index"
                        :label="channel.name"
                        :value="channel.id"
                    >
                    </el-option>
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
import UploadCover from './components/upload-cover'
import { getArticleChannels, addArticle, updateArticle, gatArticle } from '@/api/article'
import {
    ElementTiptap,
    Doc,
    Text,
    Paragraph,
    Heading,
    Bold,
    Underline,
    Italic,
    Strike,
    ListItem,
    BulletList,
    OrderedList,
    TodoItem,
    TodoList,
    HorizontalRule,
    Fullscreen,
    Preview,
    CodeBlock,
    Image,
    TextColor
} from 'element-tiptap'
import 'element-tiptap/lib/index.css'
import { uploadImage } from '@/api/image'
export default {
    name: 'PublishIndex',
    components: {
        'el-tiptap': ElementTiptap,
        'upload-cover': UploadCover
    },
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
            channels: [], // 频道列表
            // 编辑器的 extensions
            // 按照生命的顺序被添加到菜单栏和气泡菜单中
            extensions: [
                new Doc(),
                new Text(),
                new Paragraph(),
                new Heading({ level: 5 }), // 最多几级标题
                new Bold({ bubble: true }), // 气泡菜单中渲染菜单按钮
                new Underline({ bubble: true, menubar: false }), // 下划线
                new Italic(), // 斜体
                new Image({
                    // 默认会把图片生成 base64
                    // 字符串和内容存储在一起，如果需要自定义图片上传
                    uploadRequest (file) {
                        // 如果接口要求 Content-Type 是 multipart/form-data，
                        // 则请求体必须使用 FormData
                        const fd = new FormData()
                        fd.append('image', file)
                        return uploadImage(fd).then(res => {
                            return res.data.data.url
                        })
                    }// 图片的上传方法，返回一个 Promise<url>
                }), // 图片
                new Strike(), // 删除线
                new HorizontalRule(), // 华丽的分割线
                new ListItem(),
                new BulletList(), // 无序列表
                new OrderedList(), // 有序列表
                new TodoList(), // 复选框
                new TodoItem(), // 复选框
                new Fullscreen(), // 全屏
                new Preview(), // 预览
                new CodeBlock(), // 代码块
                new TextColor() // 文字颜色
            ],
            formRules: {
                title: [
                    { required: true, message: '请输入文章标题', trigger: 'blur' },
                    { min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'blur' }
                ],
                content: [
                    { required: true, message: '请输入文章内容', trigger: 'blur' },
                    {
                        validator (rule, value, callback) {
                            if (value === '<p></p>') {
                                // 验证失败
                                callback(new Error('请输入文章'))
                            } else {
                                // 验证通过
                                callback()
                            }
                        }
                    }
                ],
                channel_id: [
                    { required: true, message: '请选择文章频道' }
                ]
            }
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
            this.$refs['publish-form'].validate(valid => {
                // 验证失败，停止提交表单
                if (!valid) {
                    return
                }

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
            })
        },
        // 修改文章：加载文章内容
        loadArticle () {
            gatArticle(this.$route.query.id).then(res => {
                console.log(res)
                this.article = res.data.data
            })
        },
        onUpdateCover (index, url) {
            console.log('onUpdateCover', url)
            // 用 set 来解决DOM不更新问题
            this.$set(this.article.cover.images, index, url)
        }
    }
}
</script>

<style scoped lang="less">

</style>
