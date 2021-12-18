<template>
    <el-container class="layout-container">
        <el-aside width='auto' class="aside">
            <app-aside :is-collapse="isCollapse" class="aside-menu" />
        </el-aside>
        <el-container>
            <el-header class="header">
                <div>
                    <!--
                        class 样式处理
                        {
                            css类名：布尔值
                        }
                     -->
                    <i :class="{
                        'el-icon-s-fold': isCollapse,
                        'el-icon-s-unfold': !isCollapse
                       }"
                       @click='isCollapse = !isCollapse'
                    ></i>
                    <span>阿栋头条内容发布管理系统</span>
                </div>
                <el-dropdown>
                    <div class="avatar-wrap">
                        <el-avatar class="avatar-img" :src="user.photo"></el-avatar>
                        <span>{{user.name}}<i class="el-icon-arrow-down el-icon--right"></i></span>
                    </div>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>设置</el-dropdown-item>
                        <!--
                            组件默认是不识别原生事件的，除非内部做了处理
                         -->
                        <el-dropdown-item
                          @click.native='onLogout'
                        >退出</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-header>
            <el-main class="main">
                <!-- 子路由出口 -->
                <router-view />
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import AppAside from './components/aside.vue'
import { getUserProfile } from '@/api/user'
export default {
    name: 'LayoutIndex',
    components: {
        AppAside
    },
    data () {
        return {
            user: {}, // 用户信息
            isCollapse: false // 侧边菜单栏的展示状态
        }
    },
    created () {
        // 组件初始化好，请求获取用户资料
        this.loadUserProfile()
    },
    methods: {
        // 获取用户信息
        loadUserProfile () {
            // 获取用户信息
            getUserProfile().then(res => {
                // console.log(res)
                this.user = res.data.data
            })
        },
        // 退出用户登录
        onLogout () {
            this.$confirm('确定退出登录吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 把用户的登录状态清除
                window.localStorage.removeItem('user')

                this.$message({
                    type: 'success',
                    message: '退出成功!'
                })
                // 跳转到登录页面
                this.$router.push('/login')
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消退出'
                })
            })
        }
    }
}
</script>

<style lang='less'>
.layout-container{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
}
.aside{
    background-color: #d3dce6;
    .aside-menu{
        height: 100%;
    }
}
.header{
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ccc;
    // background-color: #b3c0d1;
}
.main{

}
.avatar-wrap{
    display: flex;
    justify-content: center;
    align-items: center;
    .avatar-img{
        margin-right: 10px;
    }
}
</style>
