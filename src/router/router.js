import Vue from 'vue'
import Router from 'vue-router'
import Login from '../pages/Login'
import { API_TOKEN } from '@/api/apis'
Vue.use(Router)

//解决多次点击同个地址的报错
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
const router = new Router({
    routes: [
        { path: '/', name: 'Login', component: Login },
        {
            path: '/index', name: 'Home', component: () => import('../pages/Index.vue'), meta: { role: ["super", "normal"] }, children: [
                { path: '/index/home', name: 'Home', component: () => import('../pages/index/Home.vue'), meta: { role: ["super", "normal"] } },//后台首页
                { path: '/index/order', name: 'HomePage', component: () => import('../pages/index/Order.vue'), meta: { role: ["super", "normal"] } },//订单管理
                { path: '/index/commodityStatistics', name: 'CommodityStatistics', component: () => import('../pages/index/statistics/CommodityStatistics.vue'), meta: { role: ["super", "normal"] } },//商品统计
                { path: '/index/orderStatistics', name: 'OrderStatistics', component: () => import('../pages/index/statistics/OrderStatistics.vue'), meta: { role: ["super", "normal"] } },//订单统计
                { path: '/index/commodityList', name: 'commodityList', component: () => import('../pages/index/commodity/CommodityList.vue'), meta: { role: ["super", "normal"] } },//商品列表
                { path: '/index/commodityAdd', name: 'commodityAdd', component: () => import('../pages/index/commodity/CommodityAdd.vue'), meta: { role: ["super", "normal"] } },//商品添加
                { path: '/index/commodityClassify', name: 'commodityClassify', component: () => import('../pages/index/commodity/CommodityClassify.vue'), meta: { role: ["super", "normal"] } },//商品分类
                { path: '/index/accountList', name: 'UserList', component: () => import('../pages/index/account/AccountList.vue'), meta: { role: ["super",] } },//账号列表
                { path: '/index/accountAdd', name: 'UserAdd', component: () => import('../pages/index/account/AccountAdd.vue'), meta: { role: ["super",] } },//添加账号
                { path: '/index/updatePwd', name: 'UpdateMsg', component: () => import('../pages/index/account/UpdatePwd.vue'), meta: { role: ["super",] } },//修改密码
                { path: '/index/shop', name: 'shop', component: () => import('../pages/index/Shop.vue'), meta: { role: ["super"] } },//店铺管理
                { path: '/index/personal', name: 'personal', component: () => import('../pages/index/Personal.vue'), meta: { role: ["super", "normal"] } },//个人中心
                { path: '/index/writeoff', name: 'personal', component: () => import('../pages/index/WriteOff.vue'), meta: { role: ["super", "normal"] } },//注销
            ]
        },
    ]
})
//路由守卫
router.beforeEach((to, from, next) => {
    if (to.path != '/') {
        API_TOKEN(localStorage.token).then(res => {
            if (res.data.code == 0) {
                // console.log(to.meta)
                if (to.meta.role.includes(localStorage.role)) {
                    next()
                } else {
                    next(from.path)
                }

            } else {
                next('/')
            }
        })
    } else {
        next()

    }


})
export default router