<template>
	<div class="page has-navbar">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">每日精品</span>
			</von-header>
	  		<div class="topBar">
	  			<span>年度精选SALE</span>
	  			<span>高达50%OFF</span>
	  		</div>
	  		<quick-loadmore :top-method="onRefresh" ref="vueLoad" 
                    :top-status-change="handleStatusChange" 
                    :bottom-method="onInfinite" 
                    :bottom-status-change="handleBottomStatusChange" 
                    :disable-top="disableTop" :disable-bottom="disableBottom" >
				<!--轮播图组件-->
				<good-carousel :picWidth="imgWidth" :picHight="imgHight" :showPagination="true" :speed="300" :imgs="carouselImgs" :swiperBgColor="bgColor" isPadding=".15rem 0"></good-carousel>
				<single-goods :data="data" v-for="(data,index) in everyDayLists" :key="index" v-if="everyDayLists"></single-goods>
		  		<h5 v-if="everyDayLists.length < 1&& loadFinish == true">暂无数据</h5>
			</quick-loadmore>	
		</div>
	</div>
</template>

<script>
	import goodCarousel from '../../../../components/common/goodCarousel.vue'
	import carousel from '../../../../components/common/carousel.vue'
	import singleGoods from '../../../../components/everydayGoods/everydaySingleGoods.vue'
	export default{
		name:'everydayGoodsPage',
		components:{
			goodCarousel,
			carousel,
			singleGoods
		},
		data(){
			return{
				imgWidth:'96%',
				imgHight:'2.6rem',
				bgColor:'#fff',
				carouselImgs:[],
		        flag:'',
		        disableTop:false,//是否禁止下拉，默认允许
		        disableBottom:false,
		        page:1,//默认首页
		        sendEveryDayData:''
			}
		},
		computed:{
	    	everyDayLists(){//首页数据
	    		let arr = []
	    		this.$store.state.everyDayData.data.forEach(item=>{
	    			if(item.time != -2){
						arr.push(item)
	    			}
	    		})
	    		return arr
	    		//return this.$store.state.everyDayData.data
	    	},
	    	loadFinish(val){//数据加载操作是否已完成  默认加载状态完成 false 为加载中
	    		if(!this.$store.state.everyDayData.loadFinish){
	    			this.$store.state.everyDayData.loadFinish = false
	    		}
	    		return this.$store.state.everyDayData.loadFinish
	    	}
	    },
	    watch:{
	    	loadFinish(val){
	    		this.$store.state.everyDayData.loadFinish = val
	    		if(val){
	    			if(this.flag == "fresh"){
	    				this.disableBottom = false
	    				this.$refs.vueLoad.onBottomLoaded(true);
	    				this.$refs.vueLoad.onTopLoaded();
	    			}
	    			if(this.flag == "infinite"){
	    				this.disableTop = false
	    				this.$refs.vueLoad.onTopLoaded();
	    				if(this.$store.state.everyDayData.isAll){
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
			getCarousels(){
	    		let that = this
	    		this.$axios({
		    		method:'get',
		    		url:that.GLOBAL.develop_url+'api/quality',
		    		xhrFields:{
		    			withCredentials:true
	    			},
		    		crossDomain:true,
		    		headers: { //解决跨域
						'Content-Type': 'application/x-www-form-urlencoded'
					}
		    	}).then(function(res){
					res.data.data.list.forEach(item=>{
						that.carouselImgs.push('http://img.paipaiwang.com.cn/'+item.src)
						
					})
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
				this.sendEveryDayData = '{"type":"get_auctions", "page":'+ this.page +', "per_page": 3, "cid": 0, "for_new": 0, "mid": 0, "room": 2,"path":"everyDay"}'
    			this.threadPoxi(this.sendEveryDayData)
	    	},
	    	onInfinite(){//上拉加载
	    		this.disableTop = true
				this.flag = 'infinite'
				this.page++ //下一页
				this.sendEveryDayData = '{"type":"get_auctions", "page":'+ this.page +', "per_page": 3, "cid": 0, "for_new": 0, "mid": 0, "room": 2,"path":"everyDay"}'
				this.threadPoxi(this.sendEveryDayData)
	    	},
	    	threadPoxi(){//发送数据方法
	    		this.$store.dispatch('socketOnSend',this.sendEveryDayData)
	    	}
		},
	    created(){
	    	this.getCarousels()
			this.sendEveryDayData = '{"type":"get_auctions", "page":'+ 1 +', "per_page": 3, "cid": 0, "for_new": 0, "mid": 0, "room": 2,"path":"everyDay"}'
			//this.$store.dispatch('initSocket') //初始化整个页面的websocket
			this.threadPoxi()//默认请求第一页数据
	    }
	}
</script>

<style lang="less" scoped>
.page.has-navbar{
	.page-content {
	  	padding-top: 44px;
	  	padding-bottom: .54rem;
	  	.topBar{
	  		height: .54rem;
	  		color: #e87439;
	  		display: flex;
	  		display: -webkit-flex;
	  		justify-content: center;
	  		align-items: center;
	  		background-color: #f2f2f2;
	  		position:relative;
	  		span{
	  			height: .28rem;
	  			line-height: .28rem;
	  			font-size: .25rem;
	  			position:relative;
	  			padding: 0 .25rem;
	  			letter-spacing: 1px;
	  			&:first-child{
	  				&:after{
		  				content: '';
		  				display: block;
		  				width: 1px;
		  				height: 100%;
		  				position: absolute;
		  				top: 0;
		  				right: 0;
		  				background-color: #e87439;
	  				}
	  			}
	  		}
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