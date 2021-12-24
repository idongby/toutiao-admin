import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/views/login/'
import Home from '@/views/home/'
import Layout from '@/views/layout/'

// 在VueCli 创建的项目中 @ 表示 src 目录
// 它是 src 目录的路径别名
// 好处：它不受当前文件路径影响
// 需要注意的：@ 就是 src 路径，后面别忘记得加个 斜杠
// 使用建议：如果加载的资源路径就在当前目录下，那就正常写
//          如果需要进行父级路径查找的都使用 @

Vue.use(VueRouter)

// 路由配置表
const routes = [
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/',
        // 命名 layout 有一个默认子路由，这个名字没有意义，所以警告
        // 如果 有默认子路由 ，就不要给 父路由起名字了
        // name: 'layout',
        component: Layout,
        children: [
            {
                path: '', // path 为空，会作为默认子路由渲染
                //   路由的名字 路由导航时候比较方便 router-link
                name: 'home',
                component: Home
            },
            {
                path: '/article',
                name: 'article',
                component: () => import('@/views/article/')
            },
            {
                path: '/publish',
                name: 'publish',
                component: () => import('@/views/publish/')
            }
        ]
    }
]

const router = new VueRouter({
    routes
})

// 路由导航守卫： 所有页面导航都会经过这里
// 守卫页面的导航
// to: 要去的路由路由信息
// from：来自哪里的路由信息
// next：放行方法
router.beforeEach((to, from, next) => {
    // 如果要访问的页面不是 /login 就校验登录状态
    // 如果没有登录，则跳转到登录页面
    // 如果登录了，则允许通过
    const user = JSON.parse(window.localStorage.getItem('user'))

    if (to.path !== '/login') {
        // 不是登录页面的
        if (user) {
            // 已经登录，允许通过
            next()
        } else {
            // 没有登录，跳转到登录页面
            next('/login')
        }
    } else {
        // 登录页面，正常允许通过
        next()
    }
})
export default router
