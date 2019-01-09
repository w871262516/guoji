<template>
	<div class="page has-navbar">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">优铺</span>
			</von-header>
	  		<!--轮播图组件-->
	  		<quick-loadmore :top-method="onRefresh" ref="vueLoad" 
                    :top-status-change="handleStatusChange" 
                    :bottom-method="onInfinite" 
                    :bottom-status-change="handleBottomStatusChange" 
                    :disable-top="disableTop" :disable-bottom="disableBottom" >
				<carousel :picWidth="imgWidth" :showPagination="true" :speed="300" :imgs="carouselImgs" :swiperBgColor="bgColor"  isPadding=".15rem 0"></carousel>
				<!--店铺列表-->
				<store-list :list=list v-for="(list,index) in storeLists" :key="index" v-if="storeLists.length>0"></store-list>
				<h5 v-if="storeLists.length < 1 && loadFinish == true">暂无数据</h5>
			</quick-loadmore>	
		</div>
	</div>
</template>

<script>
	import carousel from '../../../../components/common/carousel.vue'
	import storeList from './children/storeList.vue'
	export default{
		name:'niceStores',
		components:{
			carousel,
			storeList
		},
		data(){
			return{
				imgWidth:'94.667%',
		        bgColor:'#fff',
		        carouselImgs:[{},{}],
		        flag:'',
		        disableTop:false,//是否禁止下拉，默认允许
		        disableBottom:false,
		        page:1,//默认首页
		        sendNiceStoresData:''
			}
		},
	    computed:{
	    	storeLists(){//首页数据
	    		console.log(this.$store.state.niceStoresData.data)
	    		return this.$store.state.niceStoresData.data
	    	},
	    	loadFinish(val){//数据加载操作是否已完成  默认加载状态完成 false 为加载中
	    		if(!this.$store.state.niceStoresData.loadFinish){
	    			this.$store.state.niceStoresData.loadFinish = false
	    		}
	    		return this.$store.state.niceStoresData.loadFinish
	    	}
	    },
	    watch:{
	    	loadFinish(val){
	    		this.$store.state.niceStoresData.loadFinish = val
	    		if(val){
	    			if(this.flag == "fresh"){
	    				this.disableBottom = false
	    				this.$refs.vueLoad.onBottomLoaded(true);
	    				this.$refs.vueLoad.onTopLoaded();
	    			}
	    			if(this.flag == "infinite"){
	    				this.disableTop = false
	    				this.$refs.vueLoad.onTopLoaded();
	    				if(this.$store.state.niceStoresData.isAll){
		    				this.disableBottom = true //禁止上拉
	    					this.$refs.vueLoad.onBottomLoaded(false);//设置底部显示已加载完
							console.log('上拉：所有数据已经加载完')
	    				}else{
	    					this.disableBottom = false //允许上拉
	    					this.$refs.vueLoad.onBottomLoaded(true);//设置底部显示加载中
	    				}	
	    			}
	    		}
	    	}
	    },
		methods:{
			back(){
				this.$router.go(-1)
			},
	    	handleStatusChange(status) {
		      // status监控下拉刷新状态--等待/下拉/到达阙值/刷新
		      const TOPSTATUS = {
		        wait: "wait",
		        pulling: "pulling",
		        limit: "limit",
		        loading: "loading"
		      }; 
		    },
		    handleBottomStatusChange(status) {
		      // status监控上拉加载状态--等待/加载/没有更多数据  
		      const BOTTOMSTATUS = {
		        wait: "wait",
		        loading: "loading",
		        nodata: "nodata"
		      };
		    },
	    	onRefresh(){ //下拉刷新  		
	    		this.disableBottom = true
    			this.flag = 'fresh'
	    		this.page = 1 //第一页
				this.sendNiceStoresData = '{"type":"getShops", "page":'+ this.page +', "per_page": 3, "cid": 0, "for_new": 0, "mid": 0, "room": 0,"path":"niceStores"}'
    			this.threadPoxi()
	    	},
	    	onInfinite(){//上拉加载
	    		this.disableTop = true
				this.flag = 'infinite'
				this.page++ //下一页
				this.sendNiceStoresData = '{"type":"getShops", "page":'+ this.page +', "per_page": 3,"cid": 0, "for_new": 0, "mid": 0, "room": 0, "path":"niceStores"}'
				this.threadPoxi()
	    	},
	    	threadPoxi(){//发送数据方法
	    		this.$store.dispatch('socketOnSend',this.sendNiceStoresData)
			},
			getCarousels(){//轮播图
	    		let that = this
	    		this.$axios({
		    		method:'get',
		    		url:that.GLOBAL.develop_url+'api/banner',
		    		xhrFields:{
		    			withCredentials:true
	    			},
		    		crossDomain:true,
		    		headers: { //解决跨域
						'Content-Type': 'application/x-www-form-urlencoded'
					}
		    	}).then(function(res){
		    		res.data.data.list.forEach(i=>{
		    			i.src = 'http://img.paipaiwang.com.cn/' + i.src
		    		})
		    		that.carouselImgs = res.data.data.list
		    	})
	    	},
		},
		created(){
			this.sendNiceStoresData = '{"type":"getShops", "page":'+ 1 +', "per_page": 3, "cid": 0, "for_new": 0, "mid": 0, "room": 0,"path":"niceStores"}'
			//this.$store.dispatch('initSocket') //初始化整个页面的websocket
			this.threadPoxi()//默认请求第一页数据
			this.getCarousels()
	   }
	}
</script>

<style scoped lang="less">
.page.has-navbar{
	.page-content {
	  	padding-top: 44px;
	  	
	  	h5{
	  		text-align: center;height: 3rem;line-height: 3rem;color: #323232 ;
	  	}
	}
} 
h5{
	height: 1rem;
	width: 100%;
	line-height: 1rem;
	text-align: center;
	color: #323232;
}
</style>