import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index.vue'
const originalPush = VueRouter.prototype.push;
// 修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => err)
}
Vue.use(VueRouter)

const routes = [{
		path: '/',
		redirect: '/Login'
	},
	{
		path: '/Regist',
		name: '注册',
		component: () => import( /* webpackChunkName: "about" */ '../views/Regist.vue')
	},
	{
		path: '/Login',
		name: '登录',
		component: () => import( /* webpackChunkName: "about" */ '../views/Login.vue')
	},
	{
		path: '/index',
		component: Index,
		redirect: '/Home',
		children: [{
				path: '/Home',
				name: '首页',
				component: () => import( /* webpackChunkName: "about" */ '../views/Home.vue')
			},
			{
				path: '/article/:id',
				name: '查看文章',
				component: () => import( /* webpackChunkName: "about" */ '../views/articleview.vue')
			},
			{
					path: '/category/all/:id?',
					name: '文章分类',
					component: () => import( /* webpackChunkName: "about" */ '../views/Category.vue')
				},
		]
	},

]

const router = new VueRouter({
	routes
})

export default router
