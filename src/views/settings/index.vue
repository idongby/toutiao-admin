<template>
    <div class="settingis-container">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>个人设置</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <el-row>
                <el-col :span=15>
                    <el-form ref="userForm" :rules="rules" :model="user" label-width="80px">
                        <el-form-item label="编号">
                            {{ user.id }}
                        </el-form-item>
                        <el-form-item label="手机">
                            {{ user.mobile }}
                        </el-form-item>
                        <el-form-item form-item label="媒体名称" prop="name">
                            <el-input v-model="user.name"></el-input>
                        </el-form-item>
                        <el-form-item label="媒体介绍">
                            <el-input type="textarea" v-model="user.intro"></el-input>
                        </el-form-item>
                        <el-form-item form-item label="邮箱" prop="email">
                            <el-input v-model="user.email"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button
                                type="primary"
                                :loading="updateProfileLoading"
                                @click="onUpdateUser"
                            >保存</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :offset="2" :span="4">
                    <!-- <p @click="$refs.file.click()">点击修改头像</p> -->
                    <label for="file">
                        <el-avatar
                            shape="square"
                            :size="150"
                            fit="cover"
                            :src="user.photo"
                        ></el-avatar>
                    </label>
                    <p>修改头像</p>
                    <input
                        id="file"
                        type="file"
                        hidden
                        ref="file"
                        @change="onFileChange"
                    >
                </el-col>
            </el-row>
        </el-card>
        <el-dialog
            title="修改头像"
            :visible.sync="dialogVisible"
            width="30%"
            append-to-body
            @opened="onDialogOpened"
            @closed="onDialogClosed"
        >
            <div class="preview-image-wrap">
                <img
                    class="preview-image"
                    :src="previewImage"
                    ref="preview-image"
                >
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" :loading="updatePhotoLoading" @click="onUpdatePhoto">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getUserProfile, updateUserPhoto, updateUserProfile } from '@/api/user'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import globalBus from '@/utils/global-bus'

export default {
    name: 'SettingsIndex',
    components: {

    },
    props: {

    },
    data () {
        return {
            user: {
                email: '',
                id: null,
                intro: '',
                mobile: '',
                name: '',
                photo: ''
            }, // 用户资料
            dialogVisible: false, // 控制上传图片裁切预览的显示状态
            previewImage: '', // 预览图片
            cropper: null, // 裁切器实例
            updatePhotoLoading: false, // 更新用户头像的 loading 状态
            updateProfileLoading: false, // 更新用户信息的 loading 状态
            rules: {
                name: [
                    { required: true, message: '请输入名字', trigger: 'blur' },
                    { min: 1, max: 7, message: '请输入1-7位数名字', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                ]
            }
        }
    },
    computed: {

    },
    watch: {

    },
    created () {
        this.loadUser()
    },
    mounted () {

    },
    methods: {
        onUpdateUser () {
            // 表单验证
            this.$refs.userForm.validate((valid) => {
                if (!valid) {
                    return false
                }

                this.updateProfileLoading = true
                updateUserProfile(this.user).then(res => {
                    if (res.data.message === 'OK') {
                        this.updateProfileLoading = false

                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        })

                        globalBus.$emit('update-user', this.user)
                    }
                })
            })
        },
        loadUser () {
            getUserProfile().then(res => {
                this.user = res.data.data
            })
        },
        onFileChange () {
            // 处理图片预览
            const file = this.$refs.file
            const blobData = window.URL.createObjectURL(file.files[0])
            this.previewImage = blobData

            this.dialogVisible = true

            this.$refs.file.value = ''
        },

        onDialogOpened () {
            // 注意：img 必须是可见状态才能正常裁切
            //  这里要在对话框里面初始化才解气
            //  所以要在对话框完全打开的时候才能初始化

            // 获取图片 DOM 节点
            const image = this.$refs['preview-image']

            // 第1次初始化好以后i，如果预览裁切的图片发生改变，
            // 裁切器默认不会更新
            // 如果需要预览图片发生变化，更新裁切器：
            // 1：裁切器.replace方法
            // 2. 销毁裁切器，重新初始化

            // 初始化裁切器
            // if (this.cropper) {
            //     this.cropper.replace(this.previewImage)
            //     return
            // }
            this.cropper = new Cropper(image, {
                aspectRatio: 1,
                viewMode: 1,
                dragMode: 'none',
                cropBoxResizable: false
            })
        },

        onDialogClosed () {
            // 对话框关闭，销毁裁切器
            this.cropper.destroy()
        },

        onUpdatePhoto () {
            this.updatePhotoLoading = true
            // 获取裁切的图片对象
            this.cropper.getCroppedCanvas().toBlob(file => {
                const fd = new FormData()
                fd.append('photo', file)
                updateUserPhoto(fd).then(res => {
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    })
                    // 关闭对话框
                    this.dialogVisible = false
                    // 更新视图展示
                    this.user.photo = window.URL.createObjectURL(file)
                    // 关闭 loading
                    this.updatePhotoLoading = false

                    globalBus.$emit('update-user', this.user)
                })
            })
        }
    }
}
</script>

<style scoped lang="less">
.preview-image-wrap {
    .preview-image {
        display: block;
        /* This rule is very important, please don't ignore this */
        max-width: 100%;
        height: 200px;
    }
}
</style>
