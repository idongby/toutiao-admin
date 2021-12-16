<template>
    <el-container class="layout-container">
        <el-aside width='200px' class="aside">
            <app-aside class="aside-menu" />
        </el-aside>
        <el-container>
            <el-header class="header">
                <div>
                    <i class="el-icon-s-fold"></i>
                    <span>阿栋头条内容发布管理系统</span>
                </div>
                <el-dropdown>
                    <div class="avatar-wrap">
                        <el-avatar class="avatar-img" :src="user.photo"></el-avatar>
                        <span>{{user.name}}<i class="el-icon-arrow-down el-icon--right"></i></span>
                    </div>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>设置</el-dropdown-item>
                        <el-dropdown-item>推出</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-header>
            <el-main class="main">
                <!-- 子路由出口 -->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import AppAside from './components/aside.vue'
import { getUserProfile } from '@/api/user'
export default {
    name: 'layout',
    components: {
        AppAside
    },
    data () {
        return {
            user: {} // 用户信息
        }
    },
    created () {
        // 组件初始化好，请求获取用户资料
        this.loadUserProfile()
    },
    methods: {
        loadUserProfile () {
            // 获取用户信息
            getUserProfile().then(res => {
                console.log(res)
                this.user = res.data.data
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
