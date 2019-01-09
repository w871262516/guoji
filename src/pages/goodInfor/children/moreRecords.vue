<template>
	<div class="page has-navbar">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">出价记录</span>
			</von-header>
			
			<quick-loadmore :top-method="onRefresh" ref="vueLoad" 
                    :top-status-change="handleStatusChange" 
                    :bottom-method="onInfinite" 
                    :bottom-status-change="handleBottomStatusChange" 
                    :disable-top="disableTop" :disable-bottom="disableBottom" >
                    <list class="list" v-if="moreRecordsDataLists.length>0">
					  	<item v-for="(list,index) in moreRecordsDataLists" :key="index">
					  		<div class="listDiv">
					  			<div class="userBox">
					  				<img class="userImg" :src="list.photo"/>
					  				<span class="userName">{{list.phone}}</span>
					  			</div>
					  			<span class="action">{{index==0?'抢先':'已出局'}}</span>
					  			<span class="location">{{list.ip}}</span>
					  			<span class="price">￥{{list.price}}</span>
					  		</div>
					  	</item>
					</list>
					<h5 v-else>暂无出价记录</h5>
			</quick-loadmore>	
		</div>
	</div>
</template>

<script>
	export default{
		name:'moreRecords',
		data(){
			return{
				orderSn:this.$route.query.orderSn,
		        flag:'',
		        disableTop:false,//是否禁止下拉，默认允许
		        disableBottom:false,
	        	page:1,//默认首页
	       		sendMoreRecordsData:''
			}
		},
	    computed:{
	    	moreRecordsDataLists(){//首页数据
	    		return this.$store.state.moreRecordsData.data
	    	},
	    	loadFinish(val){//数据加载操作是否已完成  默认加载状态完成 false 为加载中
	    		if(!this.$store.state.moreRecordsData.loadFinish){
	    			this.$store.state.moreRecordsData.loadFinish = false
	    		}
	    		return this.$store.state.moreRecordsData.loadFinish
	    	}
	    },
	    watch:{
	    	loadFinish(val){
	    		this.$store.state.moreRecordsData.loadFinish = val
	    		if(val){
	    			if(this.flag == "fresh"){
	    				this.disableBottom = false
	    				this.$refs.vueLoad.onBottomLoaded(true);
	    				this.$refs.vueLoad.onTopLoaded();
	    			}
	    			if(this.flag == "infinite"){
	    				this.disableTop = false
	    				this.$refs.vueLoad.onTopLoaded();
	    				if(this.$store.state.moreRecordsData.isAll){
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
				this.sendMoreRecordsData = '{"type":"auction_log", "page":'+ this.page +', "order_sn": "'+ this.orderSn +'", "path":"moreRecords"}'
    			this.threadPoxi(this.sendMoreRecordsData)
	    	},
	    	onInfinite(){//上拉加载
	    		this.disableTop = true
				this.flag = 'infinite'
				this.page++ //下一页
				this.sendMoreRecordsData = '{"type":"auction_log", "page":'+ this.page +', "order_sn": "'+ this.orderSn +'", "path":"moreRecords"}'
				this.threadPoxi(this.sendMoreRecordsData)
	    	},
	    	threadPoxi(){//发送数据方法
	    		this.$store.dispatch('socketOnSend',this.sendMoreRecordsData)
	    	}
		},
		created(){
			this.page=1
			this.sendMoreRecordsData = '{"type":"auction_log", "page":'+ this.page +', "order_sn": "'+ this.orderSn +'","path":"moreRecords"}'
			this.$store.dispatch('initSocket') //初始化整个页面的websocket
			this.threadPoxi()
		}
	}
</script>

<style scoped lang="less">
.page.has-navbar{
	.page-content {
		width: 100%;
	  	padding-top: 44px;
	  	height: 100% !important;
	  	overflow-y:hidden;
	  	.list{
	  		margin-bottom: 0 !important;
	  		.item{
	  			&:first-child{
	  				color: #E87439 !important;
	  			}
	  			.listDiv{
		  			padding: 0rem .2rem;
		  			width: 100%;
		  			display: flex;
		  			display: -webkit-flex;
		  			align-items: center;
		  			justify-content: space-between;
					font-size: .24rem;
		  			.userBox{
		  				display: flex;
		  				display: -webkit-flex;
		  				align-items: center;
		  				justify-content: flex-start;
		  				.userImg{
		  					display: block;
		  					width: .45rem;
		  					height: .45rem;
		  					border-radius: 50%;
		  					margin-right: .2rem;
		  				}
		  			}
		  		}
	  		}
	  	}
	  	h5{
	  		text-align: center;height: 3rem;line-height: 3rem;color: #323232 ;
	  	}
	}
} 
</style>