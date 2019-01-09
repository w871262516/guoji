<template>
	<div class="page has-navbar">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">明日精品</span>
			</von-header>
			<quick-loadmore :top-method="onRefresh" ref="vueLoad" 
                    :top-status-change="handleStatusChange" 
                    :bottom-method="onInfinite" 
                    :bottom-status-change="handleBottomStatusChange" 
                    :disable-top="disableTop" :disable-bottom="disableBottom" >
		  		<div class="doubleGoodsFlexBox" v-if="tomorrowLists">
		  			<double-goods :data="data"  v-for="(data,index) in tomorrowLists" :key="index"></double-goods>
		  		</div>
		  		<h5 v-if="tomorrowLists.length < 1&& loadFinish == true">暂无数据</h5>
			</quick-loadmore>	
	  		
		</div>
	</div>
</template>

<script>
	import doubleGoods from '../../../../components/common/doubleGoods.vue'
	export default{
		name:'tomorrowGoodsPage',
		components:{
			doubleGoods
		},
		data(){
			return{
		        flag:'',
		        disableTop:false,//是否禁止下拉，默认允许
		        disableBottom:false,
	        	page:1,//默认首页
	        	sendTomorrowData:''
			}
		},
		computed:{
	    	tomorrowLists(){//绑定明日精品数据
	    		return this.$store.state.tomorrowData.data
	    	},
	    	loadFinish(val){//数据加载操作是否已完成  默认加载状态完成 false 为加载中
	    		if(!this.$store.state.tomorrowData.loadFinish){
	    			this.$store.state.tomorrowData.loadFinish = false
	    		}
	    		return this.$store.state.tomorrowData.loadFinish
	    	}
	    },
	    watch:{
	    	loadFinish(val){
	    		this.$store.state.tomorrowData.loadFinish = val
	    		if(val){
	    			if(this.flag == "fresh"){
	    				this.disableBottom = false
	    				this.$refs.vueLoad.onBottomLoaded(true);
	    				this.$refs.vueLoad.onTopLoaded();
	    			}
	    			if(this.flag == "infinite"){
	    				this.disableTop = false
	    				this.$refs.vueLoad.onTopLoaded();
	    				if(this.$store.state.tomorrowData.isAll){
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
				this.sendTomorrowData = '{"type":"getNextAuctions", "page":'+ this.page +', "per_page": 6, "cid": 0, "for_new": 0, "mid": 0, "room": 2,"path":"tomorrow"}'
    			this.threadPoxi(this.sendTomorrowData)
	    	},
	    	onInfinite(){//上拉加载
	    		this.disableTop = true
				this.flag = 'infinite'
				this.page++ //下一页
				this.sendTomorrowData = '{"type":"getNextAuctions", "page":'+ this.page +', "per_page": 6, "cid": 0, "for_new": 0, "mid": 0, "room": 2,"path":"tomorrow"}'
				this.threadPoxi(this.sendTomorrowData)
	    	},
	    	threadPoxi(){//发送数据方法
	    		this.$store.dispatch('socketOnSend',this.sendTomorrowData)
	    	}
			
		},
	    created(){
			this.sendTomorrowData = '{"type":"getNextAuctions", "page":'+ 1 +', "per_page": 6, "cid": 0, "for_new": 0, "mid": 0, "room": 2,"path":"tomorrow"}'
			this.threadPoxi()//默认请求第一页数据
			console.log(this.tomorrowLists.length==0)
	    }
	}
</script>

<style lang="less" scoped>
.page.has-navbar{
	.page-content {
	  	padding-top: 44px;
	  	padding-bottom: 1rem;
	  	.doubleGoodsFlexBox{
	  		width: 100%;
	  		display: flex;
	  		display: -webkit-box;
	  		display: -webkit-flex;
	  		flex-wrap: wrap;
	  		flex-direction: row;
	  		justify-content: space-between;
			padding: 0 2.5%;	  
		  	h5{
		  		text-align: center;height: 3rem;line-height: 3rem;
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