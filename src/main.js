import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 加载 element 组件库
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI) // 全局注册 组件库

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
