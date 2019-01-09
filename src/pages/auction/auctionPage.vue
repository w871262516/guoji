<template>
	<div>
		<div class="page">
		  	<div class="page-content">
				<head-top v-nav="{hideNavbar:true }" :headerShow='false'></head-top>
	  			<quick-loadmore :top-method="onRefresh" ref="vueLoad" 
                    :top-status-change="handleStatusChange" 
                    :bottom-method="onInfinite" 
                    :bottom-status-change="handleBottomStatusChange" 
                    :disable-top="disableTop" :disable-bottom="disableBottom" >
			  		<div class="searchHeader" >
			  			<!--搜索组件-->
			  			<div @click="onSearch">
			  			<search-bar :placeholder="placeholder" :searchWidth="searchWidth" :backgroundColor="backgroundColor" :searchPadding="searchPadding"></search-bar>
			  			</div>
			  			<!--大小标题组件-->
			  			<tips-bar :title="tipsTitle" :tips="tipsTips" :tipMarginTop="tipMarginTop"></tips-bar>
			  			<!--分类入口组件-->
			  			<classify-icons></classify-icons>
			  		</div>
		  		
			  		<div class="recommendBox">
			  			<!--大小标题组件-->
			  			<tips-bar :title="tipsTitle1" :tips="tipsTips1" tipMarginTop=".15rem"></tips-bar>
			  			<!--推荐（商家）组件-->
			  			<recommend :users="users"></recommend>
			  		</div>
			  		<div class="doubleGoodsFlexBox" v-if="auctionDataLists.length>0">
			  			<double-goods :data="data"  v-for="(data,index) in auctionDataLists" :key="index"></double-goods>
			  		</div>
			  		<!--<h5 v-if="auctionDataLists.length < 1 && loadFinish == true">暂无数据</h5>-->
				</quick-loadmore>	
			</div>
		</div>
		<bottom></bottom>
	</div>	
</template>

<script>
	import headTop from '../../components/header/header.vue'
	import searchBar from '../../components/search/searchBar.vue'
	import tipsBar from '../../components/common/tipsBar.vue'
	import classifyIcons from './components/classifyIcons.vue'
	import recommend from '../../components/common/recommend.vue'
	import doubleGoods from '../../components/common/doubleGoods.vue'
	import bottom from '../../components/footer/bottom.vue'
	export default{
		name:'auctionPage',
		components:{
			headTop,
			searchBar,
			tipsBar,
			classifyIcons,
			recommend,
			doubleGoods,
	  		bottom
	  	},
		data(){
			return{
				placeholder:'搜索店铺、商品',//搜索组件的占位符
				searchWidth:'75%', //搜索组件宽度
				backgroundColor:'#eeeeee',
				searchPadding:'0.05rem 0.4rem 0.05rem .87rem', //搜索组件的内补
				tipsTitle:'推荐分类',
				tipsTips:'HOT RECOMMEND',
				tipsTitle1:'推荐店铺',
				tipsTips1:'HOT RECOMMEND',
				tipMarginTop:'.36rem', //大小标题到顶部距离
				bgColor:'#f2f2f2', //轮播图组件背景颜色
	        	imgWidth:'100%',//轮播图图片宽度
	        	swiperH:'auto',//轮播图高度
		        users:[],//推荐商家组价 数组
		        tabs:'',
		        page:1,
		        disableTop:false,//是否禁止下拉，默认允许
		        disableBottom:false,
		        sendAuctionData:''
			}
		},
	    computed:{
	    	auctionDataLists(){//绑定拍卖页数据
	    		let arr = []
	    		this.$store.state.auctionData.data.forEach(item=>{
	    			if(item.time != -2){
						arr.push(item)
	    			}
	    		})
	    		return arr
	    		//return this.$store.state.auctionData.data
	    	},
	    	loadFinish(val){//数据加载操作是否已完成  默认加载状态完成 false 为加载中
	    		if(!this.$store.state.auctionData.loadFinish){
	    			this.$store.state.auctionData.loadFinish = false
	    		}
	    		return this.$store.state.auctionData.loadFinish
	    	}
	    },
	    watch:{
	    	loadFinish(val){
	    		this.$store.state.auctionData.loadFinish = val
	    		if(val){
	    			if(this.flag == "fresh"){
	    				this.disableBottom = false
	    				this.$refs.vueLoad.onBottomLoaded(true);
	    				this.$refs.vueLoad.onTopLoaded();
	    			}
	    			if(this.flag == "infinite"){
	    				this.disableTop = false
	    				this.$refs.vueLoad.onTopLoaded();
	    				if(this.$store.state.auctionData.isAll){
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
			onSearch(words){
				console.log(words)
				this.$router.push('/search')
			},
	    	getRecommendStores(){//获取推荐店铺
	    		let that = this
	    		this.$axios({
		    		method:'get',
		    		url:that.GLOBAL.develop_url+'api/recommend',
		    		xhrFields:{
		    			withCredentials:true
	    			},
		    		crossDomain:true,
		    		headers: { //解决跨域
						'Content-Type': 'application/x-www-form-urlencoded'
					}
		    	}).then(function(res){
		    		console.log(res.data)
					that.users = res.data.list
		    	})
	    	},
    		onRefresh(){ //下拉刷新  		
	    		this.disableBottom = true
				this.flag = 'fresh'
	    		this.page = 1 //第一页
				this.sendAuctionData = '{"type":"get_auctions", "page":'+ this.page +', "per_page": 4, "cid": 0, "for_new": 0, "mid": 0, "room": 0,"path":"auction"}'
				this.threadPoxi(this.sendAuctionData)
	    	},
	    	onInfinite(){//上拉加载
	    		this.disableTop = true
				this.flag = 'infinite'
				this.page++ //下一页
				this.sendAuctionData = '{"type":"get_auctions", "page":'+ this.page +', "per_page": 4, "cid": 0, "for_new": 0, "mid": 0, "room": 0,"path":"auction"}'
				this.threadPoxi(this.sendAuctionData)
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
	    	threadPoxi(){//发送数据方法
	    		this.$store.dispatch('socketOnSend',this.sendAuctionData)
	    	}
		},
	    created(){
	    	this.getRecommendStores()
			this.sendAuctionData = '{"type":"get_auctions", "page":'+ 1 +', "per_page": 4, "cid": 0, "for_new": 0, "mid": 0, "room": 0,"path":"auction"}'
			//this.$store.dispatch('initSocket') //初始化整个页面的websocket
			this.threadPoxi()//默认请求第一页数据
	    }
	}
</script>

<style lang="less" scoped>
.page-content {
  	padding-bottom: 1rem;
	  	.page-content{
	  		margin-bottom:.94rem;
	  	}
  	.searchHeader{
		background-color: #fff;
		padding: 0.2rem 0;
	}
	.recommendBox{
		background-color: #fff;
		padding-top: .2rem;
	}
  	.doubleGoodsFlexBox{
  		display: flex;
  		display: -webkit-box;
  		display: -webkit-flex;
  		flex-wrap: wrap;
  		flex-direction: row;
  		justify-content: space-between;
		padding: 0 2.5%;	  		
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