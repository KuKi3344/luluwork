import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import {
	Message
} from 'element-ui';
import axios from 'axios'
import SlideVerify from 'vue-monoplasty-slide-verify';
import {
	getCookieValue,
	setCookieValue,
	clearCookie
} from './assets/js/cookie.js'
import {
	getuserinfo
} from './api/api.js'
import {
	formatTime
} from './assets/js/time.js'
Vue.use(ElementUI);
Vue.use(SlideVerify)

Vue.prototype.$axios = axios;
Vue.prototype.getCookieValue = getCookieValue;
Vue.prototype.setCookieValue = setCookieValue;
Vue.prototype.clearCookie = clearCookie;
Vue.prototype.imgsrc = 'https://img2.baidu.com/it/u=3803857813,3124478720&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
Vue.config.productionTip = false


axios.interceptors.request.use(config => {
	//如果存在token，请求携带这个token
	if (getCookieValue('Authorization')) {
		config.headers['Authorization'] = getCookieValue('Authorization');
	}
	return config;
}, error => {
	console.log(error);
})


router.beforeEach((to, from, next) => {
	if (getCookieValue('Authorization')) {
		if (JSON.parse(window.sessionStorage.getItem('user'))) {
			document.title = `${to.name}	-	LULU WORK`
			next();
		} else {
			getuserinfo().then(resp => {
				if (resp.data.data != null) {
					window.sessionStorage.setItem('user', JSON.stringify(resp.data.data));
					store.state.id = resp.data.data.id;
					store.state.login = true;
					document.title = `${to.name}	-	LULU WORK`
					next();
				} else {
					clearCookie('Authorization');
					Message.error("登陆超时，请重新登录");
				}
			})

		}

	}
	if (!getCookieValue('Authorization')) {
		//如果没有token就拦截，如果去登录页面不拦截，如果去别的就给调到404页面
		if (to.path == '/Login' || to.path == '/Regist') {
			document.title = `${to.name}	-	LULU WORK`;
			next();
		} else {
			Message.error("请先登录");
		}
	}
})
Vue.filter('format', formatTime)
new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
