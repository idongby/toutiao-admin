<template>
  <div class="login-container">
      <div class="login-wrap">
            <div class="login-head">
                <div class="login"></div>
            </div>
            <!--
                配置 Form 表单验证：
                1、必须给 el-form组件绑定 model 为表单数据对象
                2、给需要验证的表单项 el-form-item 绑定 prop 属性
                    注意：prop 属性需要指定表单对象中的数据名称(最好这样，方便认识)
                    prop属性名字和rules里面的属性名是 一一对应 的
                3、通过 el-form 组件的 rules 属性配置验证规则

                手动触发表单验证：
                1、给 el-form 设置 ref 起个名字（随便起，不充分即可）
                2、通过 ref 获 el-form 组件，调用组件的 validate 进行验证
             -->
            <el-form class="login-form" ref="login-form" :model="user" :rules='formRules'>
                <el-form-item prop='mobile'>
                    <el-input v-model="user.mobile" placeholder="请输入手机号" ></el-input>
                </el-form-item>
                <el-form-item prop='code'>
                    <el-input v-model="user.code" placeholder="请输入验证码" ></el-input>
                </el-form-item>
                <el-form-item prop='agree'>
                    <el-checkbox v-model="user.agree"></el-checkbox>
                    我已阅读并同意用户协议和隐私条款
                </el-form-item>
                <el-form-item>
                    <el-button class="login-btn" type="primary" :loading="loginLoading" @click="onLogin">立即创建</el-button>
                </el-form-item>
            </el-form>
      </div>
  </div>
</template>

<script>
import { login } from '@/api/user'
export default {
    name: 'LoginIndex',
    components: {},
    prop: {},
    data () {
        return {
            user: {
                mobile: '13911111111',
                code: '246810',
                agree: false // 是否同意验证
            },
            checked: true, // 默认选中
            loginLoading: false, // 登录按钮loading
            formRules: { // 表单验证配置规则
                mobile: [
                    { required: true, message: '手机号不能为空', trigger: 'change' },
                    { pattern: /^1[3|5|6|7|8|9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'change' }
                ],
                code: [
                    { required: true, message: '验证码不能为空', trigger: 'change' },
                    { pattern: /^\d{6}$/, message: '请输入正确的验证码格式', trigger: 'change' }
                ],
                agree: [
                    {
                        // 自定义验证规则
                        // 验证成功 callback()
                        // 验证失败 callback(new Error('错误信息'))
                        validator: (rule, value, callback) => {
                            if (value) {
                                callback()
                            } else {
                                callback(new Error('请同意用户协议'))
                            }
                        },
                        trigger: 'change'
                    }
                ]
            }
        }
    },
    methods: {
        onLogin () {
            // 表单验证
            this.$refs['login-form'].validate((valid, err) => {
                // 如果表单验证失败，停止请求提交，直接返回
                if (!valid) {
                    return
                }
                // 验证通过，则请求登录
                this.login()
            })

            // 处理后端响应结果
        },
        login () {
            // 开启登录 loading...
            this.loginLoading = true
            // 验证通过，提交登录
            login(this.user).then(res => {
                // console.log(res)
                if (res.data.message === 'OK') {
                    this.$message({
                        message: '登录成功',
                        type: 'success'
                    })
                }
                this.loginLoading = false

                // 接口返回的数据  存到 本地
                window.localStorage.setItem('user', JSON.stringify(res.data.data))

                // 登录成功跳转页面
                this.$router.push('/')
            }).catch(err => {
                // console.log('登陆失败', err)
                this.$message.error('登陆失败，手机号或验证码错误', err)
                this.loginLoading = false
            })
        }
    }
}
</script>

<style lang="less">
.login-container{
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: url("login_bg.jpg") no-repeat;
    background-size: cover;
    .login-wrap{
        background-color: #fff;
        padding: 30px;
        padding-bottom: 20px;
        min-width: 300px;
        .login-head{
            width: 300px;
            height: 57px;
            padding-bottom: 20px;
            margin: 0 auto;
            display: flex;
            justify-content: center;
            .login{
                width: 259px;
                height: 100%;
                background: url("login_index.png") no-repeat;
            }
        }
        .login-form{
            .el-form-item{
                margin-bottom: 16px;
            }
            .login-btn{
                width: 100%;
            }
        }
    }
}
</style>
