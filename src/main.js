//let data  = sessionStorage.getItem('wechat.oauth_user')
//if(data){
//	alert(data)
//}else{
//	window.location.href='http://www.paipaiwang.com.cn/getcode.php?auk=demo1';
//}

import Vue from 'vue'
import Vonic from 'vonic'
import store from './store/store'
import routes from './router/router.js'
import VueRouter from 'vue-router'
//过度动画
import animate from 'animate.css'

import rate from 'vue-rate';
 
Vue.use(rate)
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
let option = {
	 fullscreenEl:false
}
Vue.use(preview,option)

/*global 参数*/
const GLOBAL = require('./config/config.js')
Vue.prototype.GLOBAL = GLOBAL

//global functions
import globalFunc from './config/globalFuncs.js'
Vue.use(globalFunc)


//上下拉加载
import VueQuickLoadmore from 'vue-quick-loadmore';
import 'vue-quick-loadmore/dist/index.css';  // 引入插件相关的css
Vue.use(VueQuickLoadmore)

//默认连接socket
store.dispatch('initSocket')

//引入axios
import axios from 'axios'
Vue.prototype.$axios = axios

//监听关闭浏览器关闭socket
window.onbeforeunload = ()=>{
	store.dispatch('socketOnClose')
}

//页面加载 判断用户手机类型
window.onload = Vue.prototype.checkPhone()

//移动端rem
import './config/size'
Vue.use(Vonic.app, {
  defaultRouterUrl: '/',
  routes,
  store
})
//修改vonic图标
import './assets/style/common.css'







