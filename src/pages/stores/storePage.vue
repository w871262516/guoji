<template>
	<div>
		<div class="page">
		  	<div class="page-content">
		  		<svgs style="display: none;"></svgs>
		  		<svgs-follow style="display: none;"></svgs-follow>
				<div class="head">
					<div class="headUp">
						<div class="infoBox">
							<!--店家头像-->
							<div :style="{backgroundImage:'url('+shopData.shop_logo+')'}" class="storeImg"></div>
							<!--店家信息-->
							<div class="storeInfoBox">
								<p class="storeName">{{shopData.shop_name}}</p>
								<div class="storeBox">
									<span>粉丝数：{{shopData.shop_fans}}</span>
									<span>评分：{{shopData.shop_grade}}</span>							
								</div>
							</div>
						</div>
						<!--关注-返回-->
						<div class="followBack">
							<section class="guide_item" @click="follow">
					        	<svg class="icon_style">
					                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#follow'" v-show="!isFollowed" fill="#ffffff"></use>
					                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#followed'" v-show="isFollowed" fill="#ffffff"></use>
					          	</svg>
					          	<span v-show="isFollowed == false">关注</span>
					          	<span v-show="isFollowed">已关注</span>
					        </section>
					        <section class="guide_item" @click="back">
					        	<svg class="icon_style">
					                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#close'" fill="#ffffff"></use>
					         </svg>
					        </section>
						</div>
					</div>
					
					<div class="headDown">
						<i @click="goSearch"><input type="search" placeholder="搜索店内商品" disabled="disabled"/></i>
						<div class="shareOrChat">
							<section class="guide_item fleRow bdr" @click="share">
					        	<svg class="icon_style">
					                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#share'" fill="#ffffff"></use>
					         </svg>
					          	<span>分享</span>
              </section>
					        <section class="guide_item fleRow" @click="goChat">
					        	<svg class="icon_style">
					                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#comment'" fill="#ffffff"></use>
					         </svg>
					          	<span>私聊</span>
					        </section>
						</div>
					</div>
					
				</div>
				<!--四个分类-->
				<div class="storeClassifyDiv">
					<section class="guide_item" @click="setActive('0')" :class="{default:active == 0}">
			        	<svg class="icon_style">
			                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#homeStore'" fill="#E87439" v-show="active==0"></use>
			                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#homeStore'" fill="#323232" v-show="active!=0"></use>
			        	</svg>
			          	<span>首页</span>
			        </section>
					<!-- <section @click="setActive('1')" :class="{default:active == 1}">
						<span>{{count.must_count}}</span>
						<span>必拍</span>
					</section> -->
					<section @click="setActive('2')" :class="{default:active == 2}">
						<span>{{count.remit_count}}</span>
						<span>汇拍</span>
					</section>
					<section @click="setActive('3')" :class="{default:active == 3}">
						<span>{{count.last_count}}</span>
						<span>即将结拍</span>
					</section>
				</div>
				
				<quick-loadmore :top-method="onRefresh" ref="vueLoad" 
                    :top-status-change="handleStatusChange" 
                    :bottom-method="onInfinite" 
                    :bottom-status-change="handleBottomStatusChange" 
                    :disable-top="disableTop" :disable-bottom="disableBottom" >
					<div class="storeContent">
						<div class="todayPretty" v-show="active == 0 && oneList.length" >
							<tips-bar tipMarginTop="0.2rem" title="今日精选"></tips-bar>
							<div class="prettyBox">
								<div class="prettyInfo">
									<p class="prettyTitle">{{oneList.title}}</p>
									<p class="prettyLately">近期成交价:<span class="default">￥{{oneList.price}}</span></p>
									<p class="prettyTime" v-if='oneList.time>0 && !oneList.start && oneList.room == 1'>{{oneList.time}}</p>
									<p class="prettyTime" v-if="oneList.time>0 && oneList.start>0 && oneList.room == 1">即将开始</p>
									<p class="prettyTime" v-if="oneList.time<0 && !oneList.period_new && oneList.period">出价结束</p>
									<p class="prettyTime" v-if="oneList.time<0 && !oneList.period_new && !oneList.period">活动结束</p>
								</div>
								<img :src="oneList.thumb" class="prettyImg"/>
							</div>
						</div>
						<div class="doubleGoodsFlexBox">
							<double-goods :data="data"  v-for="(data,b) in indexDatas" v-if="active == 0 "></double-goods>
							<double-goods :data="data"  v-for="(data,b) in needRoomDatas" v-if="active == 1"></double-goods>
							<double-goods :data="data"  v-for="(data,c) in remitRoomDatas" v-if="active == 2"></double-goods>
							<double-goods :data="data"  v-for="(data,c) in lastEndDatas" v-if="active == 3"></double-goods>
						</div>
					</div>
				</quick-loadmore>
			</div>
		</div>
		<share-model v-show="showShareModel" @hideShareModel="hideShareModel" :Height="modelHeight" :Top="modelTop"></share-model>
	</div>	
</template>       

<script>
	import shareModel from '../../components/common/shareModel.vue'
	import svgs from '../../components/common/svgs.vue'
	import svgsFollow from '../goodInfor/components/svgs.vue'
	import doubleGoods from './children/doubleGoods.vue'
	import tipsBar from '../../components/common/tipsBar.vue'
	export default{
		name:'storePage',
		components:{
			svgs,
			shareModel,
			svgsFollow,
			doubleGoods,
			tipsBar
	  	},
		data(){
			return{
				token:localStorage.getItem('token'),
				modelHeight:"100%",
				modelTop:"0px",
				isFollowed:false,
				showShareModel:false,
				active:0,
				storesId:this.$route.params.storesId,
		        flag:'fresh',
		        disableTop:false,//是否禁止下拉，默认允许
		        disableBottom:false,
		        page:1,//默认首页
		        sendStoreData:'',
				localMid:'',
				shopData:{}
			}
		},
	    computed:{
	    	oneList(){//首页数据
	    		return this.$store.state.storesData.oneList
			},
	    	indexDatas(){
	    		return this.$store.state.storesData.indexData
	    	},
	    	needRoomDatas(){
	    		return this.$store.state.storesData.needRoomData
	    	},
	    	remitRoomDatas(){
	    		return this.$store.state.storesData.remitRoomData
			},
			newsRoomDatas(){
				return this.$store.state.storesData.newsRoomData
			},
			lastEndDatas(){
				return this.$store.state.storesData.lastEndData
			},
			count(){
				return this.$store.state.storesData.count
			},
	    	loadFinish(val){//数据加载操作是否已完成  默认加载状态完成 false 为加载中
	    		if(!this.$store.state.storesData.loadFinish){
	    			this.$store.state.storesData.loadFinish = false
	    		}
	    		return this.$store.state.storesData.loadFinish
	    	}
	    },
	    watch:{
	    	loadFinish(val){
				
	    		this.$store.state.storesData.loadFinish = val
	    		if(val){
	    			if(this.flag == "fresh"){
	    				this.disableBottom = false
	    				this.$refs.vueLoad.onBottomLoaded(true);
	    				this.$refs.vueLoad.onTopLoaded();
	    			}
	    			if(this.flag == "infinite"){
	    				this.disableTop = false
	    				this.$refs.vueLoad.onTopLoaded();
	    				if(this.$store.state.storesData.isAll){
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
			follow(){
				if(this.isFollowed){
					var is_fans = 0 //不关注
				}else{
					var is_fans = 1 //关注
				}
				let that = this
				that.$axios({
					method:'post',
					url:that.GLOBAL.develop_url+'api/concern_shop',
					data:{
						token:that.token,
						business_id:that.storesId
					},
	    			transformRequest:[function(data){
	    				let ret = ''
	    				for(let it in data){
	    					ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
	    				}
	    				return ret
	    			}],
					xhrFields:{
						widthCredentials:true
					},
					crossDomain:true,
					header:{
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				}).then(function(res){
					console.log(res.data)
					if(res.data.code == "200"){
						that.isFollowed = !that.isFollowed
						if(that.isFollowed){
							$toast.show("关注成功", 1000)
						}else{
							$toast.show("取消关注", 1000)
						}
					}else{
						$toast.show(res.data.msg, 1000)
					}
				})
			},
			share(){
				this.showShareModel = !this.showShareModel
			},
			goSearch(){
				this.$router.push({name:'storeSearch',params:{"bid":this.storesId}})
			},
			hideShareModel(){
				this.showShareModel = false
			},
			setActive(index){
				this.active = index
			},
			goChat(){
				this.$router.push({
					path:'/onlineService/business_'+ this.storesId,
					query:{img:this.shopData.shop_logo,title:this.shopData.shop_name,sessionId:'business_'+ this.storesId}
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
				this.sendStoreData = '{"type":"shopIndexAuction", "page":'+ this.page +', "per_page": 6, "cid": 0, "for_new": 0, "mid": 0, "bid":"'+this.storesId+'","room": 0,"path":"store"}'
    			this.threadPoxi()
	    	},
	    	onInfinite(){//上拉加载
	    		this.disableTop = true
				this.flag = 'infinite'
				this.page++ //下一页
				this.sendStoreData = '{"type":"shopIndexAuction", "page":'+ this.page +', "per_page": 6, "cid": 0, "for_new": 0, "mid": 0, "bid":"'+this.storesId+'","path":"store"}'
				this.threadPoxi()
	    	},
	    	threadPoxi(){//发送数据方法
	    		this.$store.dispatch('socketOnSend',this.sendStoreData)
			},
			getShopInfo(){//获取店铺信息
				let that = this
				that.$axios({
					method:'post',
					url:that.GLOBAL.develop_url+'api/shop_info',
					data:{
						token:that.token,
						business_id:that.storesId
					},
	    			transformRequest:[function(data){
	    				let ret = ''
	    				for(let it in data){
	    					ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
	    				}
	    				return ret
	    			}],
					xhrFields:{
						widthCredentials:true
					},
					crossDomain:true,
					header:{
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				}).then(function(res){
					console.log(res.data)
					if(res.data.code == "200"){
						that.shopData = res.data.data
						that.isFollowed = res.data.data.is_concern
						
					}else{
						$toast.show(res.data.msg, 1000)
					}
				})
			},
		},
		created(){
			this.localMid = parseInt(localStorage.getItem('mid'))
			this.sendStoreData = '{"type":"shopIndexAuction", "page":'+ 1 +', "per_page": 6, "cid": 0, "for_new": 0, "mid": 0, "bid":"'+this.storesId+'","room": 0,"path":"store"}'
			this.$store.dispatch('initSocket') //初始化整个页面的websocket
			this.threadPoxi()//默认请求第一页数据
			this.getShopInfo();
		}
	}
</script>

<style scoped lang="less">
.page{
	.page-content{
		.head{
			color: #fff;
			width: 100%;
			height: 2.25rem;
			background-color: #E87439;
			padding: .2rem;
			display: flex;
			display: -webkit-flex;
			flex-direction: column;
			justify-content: space-around;
			position: relative;
			&:after{
				content: '';
				display: block;
				width: 100%;
				height: 100%;
				position: absolute;
				left: 0;
				top: 0;
				background-color: rgba(0,0,0,0.1555);
				z-index: 0;
			}
			.headUp{
				z-index: 1;
				display: flex;
				display: -webkit-flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				.infoBox{
					display: flex;
					display: -webkit-flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
					.storeImg{
						display: block;
						width: .85rem;
						height: .85rem;
						border-radius: 50%;
						margin-right: .2rem;
		  				background-size: cover;
		  				background-repeat: no-repeat;
		  				background-position: center center;
					}
					.storeInfoBox{
						max-width: calc(100% -3.1rem);
					}
				}
				.followBack{
					width: 1.8rem;
					display: flex;
					display: -webkit-flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
				}
			}
			.headDown{
				z-index: 1;
				display: flex;
				display: -webkit-flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				i{
					input{
						width: 3.5rem;
						background-color: #fff;
						border-radius:25px;
						height: .6rem;
						padding: 0 .25rem;
						color: #989898;
						font-size: .24rem;
					}
				}
				.shareOrChat{
					width: 2.7rem;
					border: 1px solid #fff;
					height: .6rem;
					border-radius:25px;
					display: flex;
					display: -webkit-flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
					section{
						width: 50%;
						display: flex;
						display: -webkit-flex;
						flex-direction: row;
						justify-content: center;
						align-items: center;
					}
				}
			}
		}
		.storeClassifyDiv{
			width: 100%;
			height: 1.1rem;
			background-color: #fff;
			display: flex;
			display: -webkit-flex;
			justify-content: space-around;
			align-items: center;	
			section{
				flex-direction: column;
				display: flex;
				display: -webkit-flex;
				align-items: center;
				justify-content: center;
				.icon_style{
					margin-right: 0 !important;
				}
			}
		}
		.storeContent{
			margin-top: .2rem;
			.todayPretty{
				background-color: #fff;
				padding-top: .2rem;
				.prettyBox{
					display: flex;
					display: -webkit-flex;
					flex-direction: row;
					justify-content: center;
					align-items: center;
					padding: .3rem 0 .4rem;
					.prettyInfo{
						margin-right: .5rem;
						min-height: 1.5rem;
						display: flex;
						display: -webkit-flex;
						flex-direction: column;
						justify-content: space-around;
						align-items: center;
						.prettyTitle{
							font-size: .24rem;
						}
						.prettyLately{
							font-size: .2rem;
						}
						.prettyTime{
							font-size: .22rem;
							color: #E87439;
						}
					}
					.prettyImg{
						display: block;
						width: 1.7rem;
					}
				}
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
	}
}
.guide_item{
	display: inline;
	display: flex;
	display: -webkit-flex;
	align-items: center;
	font-size: .26rem;
	.icon_style{
		display: inline-block;
		width: .35rem;
		height: .35rem;
		margin-right: .075rem;
	}
}
.fleRow{
	flex-direction: row;
}
.bdr{
	border-right: 1px solid #fff;
}
.default{
	color: #E87439;
}
.mt20{
	margin-top: .2rem !important;
}

h5{
	height: 1rem;
	width: 100%;
	line-height: 1rem;
	text-align: center;
	color: #323232;
}
</style>
