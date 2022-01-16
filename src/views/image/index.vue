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
            <!-- 图片列表 -->
            <ImageList/>
            <!-- /图片列表 -->
        </el-card>
    </div>
</template>

<script>
import ImageList from './components/image-list.vue'
export default {
    name: 'ImageIndex',
    components: {
        ImageList
    },
    props: {},
    data () {
        return {}
    },
    computed: {},
    watch: {},
    created () {},
    mounted () {},
    methods: {}
}
</script>

<style scoped lang="less">
// .action-head {
//     padding-bottom:20px;
//     display: flex;
//     justify-content: space-between;
// }
// /deep/ .el-upload{
//     display: flex;
//     justify-content: center;
// }
// .el-upload__tip {
//     text-align: center;
// }
// .pagination{
//     display: flex;
//     justify-content: center;
// }
// .image-item {
//     position: relative;
// }
// .image-action {
//     font-size: 25px;
//     display: flex;
//     justify-content: space-evenly;
//     align-items: center;
//     color: #fff;
//     height: 40px;
//     background-color: rgba(204, 204, 204, .5);
//     position: absolute;
//     bottom: 4px;
//     left: 5px;
//     right: 5px;
// }
</style>
