<template>
	<!--v-nav 配置header内容  详情见：https://juejin.im/entry/58bd87f48d6d8100654cb0e2 -->
	<div class="page has-navbar">
	  	<div class="page-content">
	  		<von-header theme="light" >
			  <span slot="title">拍拍国际</span>
			</von-header>
			<quick-loadmore :top-method="onRefresh" ref="vueLoad" 
                    :top-status-change="handleStatusChange" 
                    :bottom-method="onInfinite" 
                    :bottom-status-change="handleBottomStatusChange" 
                    :disable-top="disableTop" :disable-bottom="disableBottom" >
				<!--轮播图组件-->
				<carousel :picWidth="imgWidth" :showPagination="false" :speed="300" :imgs="carouselImgs" :swiperBgColor="bgColor" isPadding ="0rem 0"></carousel>
				<!--卖点入口组件-->
				<sale-point></sale-point>
				<!--主页列表组件-->
				<home-list :datas="homeLists"></home-list>
			</quick-loadmore>
		</div>
		<bottom></bottom>
	</div>
</template>
<script>
	import {mapState,mapMutations,mapActions} from 'vuex'
	import carousel from '../../components/common/carousel.vue'
	import salePoint from './components/salePoint.vue'
	import homeList from './components/homeList.vue'
	import bottom from '../../components/footer/bottom.vue'
	export default {
	  	components:{
	  		carousel,
	  		homeList,
	  		salePoint,
	  		bottom
	  	},
	    data () {
	      return {
	        imgWidth:'100%',
	        bgColor:'#fff',
	        flag:'',
	        disableTop:false,//是否禁止下拉，默认允许
	        disableBottom:false,
	        carouselImgs:[],//首页轮播
	        page:1,//默认首页
	        sendHomeData:''
	      }
	    },
	    computed:{
	    	homeLists(){//首页数据
	    		let arr = []
	    		this.$store.state.homeData.data.forEach(item=>{
	    			if(item.time != -2){
						arr.push(item)
	    			}
	    		})
	    		return arr
	    		//return this.$store.state.homeData.data
	    	},
	    	loadFinish(val){//数据加载操作是否已完成  默认加载状态完成 false 为加载中
	    		if(!this.$store.state.homeData.loadFinish){
	    			this.$store.state.homeData.loadFinish = false
	    		}
	    		return this.$store.state.homeData.loadFinish
	    	}
	    },
	    watch:{
	    	loadFinish(val){
	    		this.$store.state.homeData.loadFinish = val
	    		if(val){
	    			if(this.flag == "fresh"){
	    				this.disableBottom = false
	    				this.$refs.vueLoad.onBottomLoaded(true);
	    				this.$refs.vueLoad.onTopLoaded();
	    			}
	    			if(this.flag == "infinite"){
	    				this.disableTop = false
	    				this.$refs.vueLoad.onTopLoaded();
	    				if(this.$store.state.homeData.isAll){
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
	    	getCarousels(){//首页轮播图
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
				this.sendHomeData = '{"type":"get_auctions", "page":'+ this.page +', "per_page": 5, "cid": 0, "for_new": 0, "mid": 0, "room": 0,"path":"home"}'
    			this.threadPoxi(this.sendHomeData)
	    	},
	    	onInfinite(){//上拉加载
	    		this.disableTop = true
				this.flag = 'infinite'
				this.page++ //下一页
				this.sendHomeData = '{"type":"get_auctions", "page":'+ this.page +', "per_page": 5, "cid": 0, "for_new": 0, "mid": 0, "room": 0,"path":"home"}'
				this.threadPoxi(this.sendHomeData)
	    	},
	    	threadPoxi(){//发送数据方法
	    		this.$store.dispatch('socketOnSend',this.sendHomeData)
	    	}
	    },
	    created(){
	    	this.getCarousels()
			this.sendHomeData = '{"type":"get_auctions", "page":'+ 1 +', "per_page": 5, "cid": 0, "for_new": 0, "mid": 0, "room": 0,"path":"home"}'
			//this.$store.dispatch('initSocket') //初始化整个页面的websocket
			this.threadPoxi()//默认请求第一页数据
	    }
	}
</script>
<style scoped lang="less">
.page.has-navbar{
	.page-content {
		width: 100%;
	  	padding-top: 44px;
	  	padding-bottom: 1rem;
	  	height: 100% !important;
	  	overflow-y:hidden;
	}
} 
</style>
