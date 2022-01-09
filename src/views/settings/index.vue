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
                    <el-form ref="form" :model="user" label-width="80px">
                        <el-form-item label="编号">
                            {{ user.id }}
                        </el-form-item>
                        <el-form-item label="手机">
                            {{ user.mobile }}
                        </el-form-item>
                        <el-form-item form-item label="媒体名称">
                            <el-input v-model="user.name"></el-input>
                        </el-form-item>
                        <el-form-item label="媒体介绍">
                            <el-input type="textarea" v-model="user.intro"></el-input>
                        </el-form-item>
                        <el-form-item form-item label="邮箱">
                            <el-input v-model="user.email"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">保存</el-button>
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
        >
            <img width="150" :src="previewImage" alt="">
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
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
            previewImage: '' // 预览图片
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

            this.$refs.file.value = ''
            this.dialogVisible = true
        }
    }
}
</script>

<style scoped lang="less">

</style>
