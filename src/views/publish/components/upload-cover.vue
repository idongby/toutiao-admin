<template>
    <div class="upload-cover" @click="showCoverSelect">
        <div class="cover-wrap">
            <!-- <img
                class="cover-image"
                ref="cover-image"
                :src="coverImage"
            > -->
            <img
                class="cover-image"
                ref="cover-image"
                :src="value"
            >
        </div>
        <el-dialog
            title="选择封面"
            :visible.sync="dialogVisible"
            width="60%"
            append-to-body>
            <el-tabs v-model="activeName">
                <el-tab-pane label="素材库" name="first">
                    <ImageList
                        :isShowAdd=false
                        :isShowAction=false
                        :isShowSelected=true
                        ref="image-list"
                    />
                </el-tab-pane>
                <el-tab-pane label="上传图片" name="second">
                    <input type="file" ref="file" @change="onFileChange">
                    <img
                        src=""
                        width="100"
                        ref="priview-image"
                    >
                </el-tab-pane>
            </el-tabs>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="onCoverConfirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { uploadImage } from '@/api/image'
import ImageList from '@/views/image/components/image-list.vue'
export default {
    name: 'UploadCover',
    components: {
        ImageList
    },
    props: ['cover-image', 'value'],
    data () {
        return {
            dialogVisible: false, // 选择封面弹窗
            activeName: 'first' // 默认状态
        }
    },
    computed: {

    },
    watch: {

    },
    created () {

    },
    mounted () {

    },
    methods: {
        showCoverSelect () {
            // 展示选择封面的弹窗
            this.dialogVisible = true
        },

        onFileChange () {
            // 获取文件对象
            const file = this.$refs.file.files[0]

            // 图片预览
            const blob = window.URL.createObjectURL(file)
            this.$refs['priview-image'].src = blob
        },

        onCoverConfirm () {
            // 如果 tab 是上传图片，并且 input-file 有选择文件
            // 才执行上传图片的操作
            if (this.activeName === 'second') {
                const file = this.$refs.file.files[0]
                if (!file) {
                    this.$message('请选择文件')
                    return
                }
                // 执行上传文件的操作
                const fd = new FormData()
                fd.append('image', file)
                uploadImage(fd).then(res => {
                    if (res.data.message === 'OK') {
                        // this.$refs['cover-image'].src = res.data.data.url
                        this.dialogVisible = false

                        // 将图片地址发送给父组件
                        // this.$emit('update-cover', res.data.data.url)
                        this.$emit('input', res.data.data.url)
                    }
                })
            } else if (this.activeName === 'first') {
                const imageList = this.$refs['image-list']
                const selected = imageList.selected
                if (!selected && selected !== 0) {
                    this.$message('请选择封面图片')
                    return false
                }
                // 关闭对话框
                this.dialogVisible = false
                // 修改父组件 绑定数据
                this.$emit('input', imageList.images[selected].url)
            }
        }
    }
}
</script>

<style scoped lang="less">
.cover-wrap {
    width: 200px;
    height: 180px;
    border: 1px solid #000;
    .cover-image {
        height: 120px;
        max-width: 100%;
    }
}
</style>
