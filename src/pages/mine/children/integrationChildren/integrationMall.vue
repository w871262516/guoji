<template>
	<div class="page">
	  	<div class="page-content">
			<svgs style="display: none;"></svgs>
			
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">积分兑换商城</span>
			  <button class="button button-icon" slot="right" @click="share">
			  	<section class="guide_item">
		        	<svg class="icon_style">
		                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#share'" fill="#323232"></use>
		          	</svg>
		        </section>
			  </button>
			</von-header>
			
			<div class="myInfo">
				<span>
					积分：<i class="default">{{score}}</i>
				</span>
				<span class="default" @click="goExchangeHistory">
					积分记录
				</span>
			</div>
			
			<div class="mallDiv">
	  			<tabs :tab-items="tabs" :tab-index="tabIndex" :on-tab-click="onTabClick" top="0px"></tabs>
	  			<!--商城商品列表-->
				  <quick-loadmore :top-method="onRefresh" ref="vueLoad" 
                    :top-status-change="handleStatusChange" 
                    :bottom-method="onInfinite" 
                    :bottom-status-change="handleBottomStatusChange" 
                    :disable-top="disableTop" :disable-bottom="disableBottom" >
					<div v-for="item in mallList">
						<div class="box">
							<router-link :to="{path:'/mine/integrationExchange/integrationMall/mallGoodInfo',query:{gid:item.id}}" class="mallBox" >
								<div class="mallImgBox">
									<!-- <img :src="item.goods_img" /> -->
									<div :style="{backgroundImage:'url('+ item.goods_img+')'}" class="mallImg"></div>
								</div>
								<div class="mallInfo">
									<p class="mallName">{{item.goods_name}}</p>
									<span class="mallTips">所需兑换积分</span>
									<i class="malllPrice">{{item.integral}}</i>
									<!-- <span class="mallTips">{{item.c_time}}</span>	 -->
								</div>
							</router-link>
							<div class="btn disable-btn" v-if="!item.status">不可兑换</div>
							<div class="btn" @click="goPay(item.id)" else>兑换</div>
						</div>
					</div>
				</quick-loadmore>	
			</div>
  		</div>
		<share-model v-show="showShareModel" @hideShareModel="hideShareModel"></share-model>
  	</div>
</template>

<script>
	import shareModel from '../../../../components/common/shareModel.vue'
	import svgs from '../../../../components/common/svgs.vue'
	export default{
		name:'integrationRanking',
		components:{
			svgs,
			shareModel
		},
		data(){
			return{
				tabs:[
					'全部',
					'10000积分',
					'20000积分',
					'50000积分'
				],
				tabIndex:0,
				flag:'fresh',
		        disableTop:false,//是否禁止下拉，默认允许
		        disableBottom:false,
		        loadFinish:true,
				isAll:false,
				page:1,
				showShareModel:false,
				score:0,
				mallList:[]
			}
		},
		watch:{
			tabIndex(val){ //切换tab时设置this.page = 1
			
				this.mallList = []
			 	switch (val){
			 		case 0:
			 			this.page = 1
			 			this.isAll = false
			 			this.flag == 'fresh'
						this.getIntegralList();
			 			break;
			 		case 1:
			 			this.page = 1
			 			this.isAll = false
			 			this.flag == 'fresh'
						this.getIntegralList();
			 			break;
			 		case 2:
			 			this.page = 1
			 			this.isAll = false
			 			this.flag == 'fresh'
						this.getIntegralList();
			 			break;
			 		case 3:
			 			this.page = 1
			 			this.isAll = false
			 			this.flag == 'fresh'
						this.getIntegralList();
			 			break;
			 		default:
			 			break;
			 	}
			},
			loadFinish(val){
				this.loadFinish = val
			}
		},
		created(){
			this.getMyIntegrationInfo();
			this.getIntegralList();
		},
		methods:{
			back(){
				this.$router.go(-1)
			},
			share(){
				this.showShareModel = !this.showShareModel
			},
			hideShareModel(){
				this.showShareModel = false
			},
			goExchangeHistory(){
				this.$router.push('/mine/myIntegrations/exchangeHistory')
			},
			onTabClick(index){
				this.tabIndex = index
				console.log(index)
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
				this.getIntegralList()
	    	},
	    	onInfinite(){//上拉加载
	    		this.disableTop = true
				this.flag = 'infinite'
				this.page++ //下一页
				this.getIntegralList()
	    	},
			getMyIntegrationInfo(){
				let that = this
				that.$axios({
					method:'post',
					url:that.GLOBAL.develop_url+'api/hompage/personscoreinfo',
					data:{
						token:localStorage.getItem('token')
					},
					xhrFields:{
						widthCredentials:true
					},
					crossDomain:true,
					header:{
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				}).then(function(res){
					console.log(res.data)
					switch (res.data.code){
						case "200":	
							that.score = res.data.data.total_left
							break;
						case "400":
							$toast.show('获取信息失败，请重新登录！', 1000).then(() => {
								that.$router.push('/login')
							})
						default:
							break;
					}
				})
			},
			getIntegralList(){
				let that = this
				that.$axios({
					method:'post',
					url:that.GLOBAL.develop_url+'api/integral_goods',
					data:{
						page:that.page,
						type:that.tabIndex
					},
					xhrFields:{
						widthCredentials:true
					},
					crossDomain:true,
					header:{
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				}).then(function(res){
					console.log(res.data)
					switch (res.data.code){
						case "200":	
							if(res.data.data.length == 0){
								that.disableBottom = true
								that.isAll = true
								that.$refs.vueLoad.onBottomLoaded(false)
								if(that.flag == 'fresh'){
									that.$refs.vueLoad.onTopLoaded()
								}
							}else{
								if(that.flag == 'fresh'){
									that.mallList = []
									that.$refs.vueLoad.onTopLoaded()
								}
								that.disableBottom = true
								that.$refs.vueLoad.onBottomLoaded(false)
								res.data.data.forEach((item)=>{
									item.create_time = that.timeFormer(item.create_time);
									item.goods_img = eval(item.goods_img)[0].img
									that.mallList.push(item)
								})
							}
							console.log(that.mallList);
								
							break;
						case "400":
							$toast.show('获取信息失败，请重新登录！', 1000).then(() => {
								that.$router.push('/login')
							})
							break;
						default:
							break;
					}
				})
			},
			goPay(gid){
				this.$router.push({
					path:'/mine/integrationExchange/integrationMall/integrationPay',
					query:{
						gid:gid,
						total_left:this.score
					}
				})
			}
		}
	}
</script>

<style lang="less"scoped>
.page-content {
  	padding-top: 44px;
	color: #323232;
  	font-size: .23rem;
  	.myInfo{
  		background-color: #fff;
  		display: flex;
  		display: -webkit-flex;
  		justify-content: space-around;
  		align-items: center;
  		font-size: .26rem;
  		height:.8rem;
  		span{
  			color: #323232;
  		}
  	}
  	.mallDiv{
  		position: absolute;
  		top: 1rem;
  		background-color: #fff;
  		width: 100%;
  		padding-top: 44px;
		margin-top: 44px;
		.box{
			display: flex;
			display: -webkit-flex;
			border-bottom: 1px solid #dcdcdc;
			align-items: center;
			.mallBox{
				display: flex;
				display: -webkit-flex;
				align-items: center;
				justify-content: space-around;
				width: 100%;
				padding: .35rem;
				.mallImgBox{
					width: 1.7rem;
					height: 1.7rem;
					margin-right: .2rem;
					position: relative;
					.mallImg{
						width: 100%;
						height: 100%;
						background-position: center center;
						background-repeat: no-repeat;
						background-size: cover;
					}
				}
				.mallInfo{
					width: calc(100% - 3rem);
					display: flex;
					display: -webkit-flex;
					flex-direction: column;
					.mallName{
						color: #323232;
						font-size: .24rem;
						width: 100%;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
					.mallTips{
						color: #a4a3a3;
						font-size: .2rem;
					}
					.malllPrice{
						color: #E87439;
						font-size: .24rem
					}
				}
			}  	
			.btn{
				display: inline-block;
				width: .95rem;
				height: .48rem;
				line-height: .48rem;
				background-color: #E87439;
				color: #FFFFFF !important;
				border-radius: 5px;
				text-align: center;
				margin: 0 .4rem;
			}	
			.disable-btn{
				width: 1.2rem;
				background-color: rgb(121, 119, 118);
				padding: 0 1%;
			}
  		
  		}
  	}
}
.default{
	color: #E87439 !important; 
}
.guide_item{
		display: flex;
		display: -webkit-flex;
		align-items: center;
		.icon_style{
			display: inline-block;
			width: .34rem;
			height: .33rem;
			margin-right: .075rem;
		}
	}
</style>