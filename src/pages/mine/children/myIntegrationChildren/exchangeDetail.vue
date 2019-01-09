<template>
	<div class="page">
	  	<div class="page-content">
	  		<svgs style="display: none;"></svgs>
	  		<svgs-two style="display: none;"></svgs-two>
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">订单详情</span>
			  <!-- <button v-if="status == 2||status == 3||status == 4" class="button button-icon" slot="right" @click="returnGoods" style="font-size: .28rem;color: #E87439;">退货</button> -->
			</von-header>
	  		<div class="orderStatus">
	  			<!--评价已完成-->
	  			<p v-if="orderInfo.status == 3">
	  				<section class="guide_item">
			        	<svg class="icon_style">
			                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#rightFull'" fill="#48ab59"></use>
			          	</svg>
			        </section>
			                         已通过并发货
	  			</p>
	  			<!--商家处理中-->
	  			<p v-if="orderInfo.status == 1">
	  				<section class="guide_item">
			        	<svg class="icon_style">
			                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#rightFull'" fill="#E87439"></use>
			          	</svg>
			        </section>
			                        申请中
	  			</p>
	  			<!--订单失效-->
	  			<p v-if="orderInfo.status == 2">
	  				<section class="guide_item">
			        	<svg class="icon_style">
			                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#bad'"></use>
			          	</svg>
			        </section>
			                        申请未通过
	  			</p>	
	  		</div>
	  		
	  		<!--收货地址-->
			<div class="mt15 tilte-bar">
				<i>
					<section class="guide_item">
						<svg class="icon_style">
							<use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#location'"></use>
						</svg>
					收货地址
					</section>
				</i>
			</div>
	  		<div class="addressBox">
	  			<div>
	  				<p>收货人：{{orderInfo.receiver_name}}</p>
					<p>电&nbsp;&nbsp;&nbsp;话：{{orderInfo.receiver_phone}}</p>
	  				<p>地&nbsp;&nbsp;&nbsp;址：{{orderInfo.receiver_address}}</p>
	  			</div>
	  		</div>
	  		<div class="mt15 tilte-bar">
				<i>
					<section class="guide_item">
						<svg class="icon_style">
							<use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#orderDetail'"></use>
						</svg>
					订单详情
					</section>
				</i>
			</div>
	  		<div class="orderBox">
	  			<div>
					<div :style="{backgroundImage:'url('+goodsInfo.goods_img+')'}" class="userImg"></div>
					<div class="pay-info">
						<p>{{goodsInfo.goods_name}}</p>
						<p>积分：{{orderInfo.deduct_integral}}</p>
						<p>运费：0</p>
					</div>
	  				<!--<i>
		  				<section class="guide_item">
				        	<svg class="icon_style">
				                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#integration'" fill="#E87439"></use>
				          	</svg>
				        </section>
				        <span>80</span>
		  			</i>-->
	  			</div>
	  			<!-- <div class="feeBox">
	  				<p>
	  					积分：
	  					<span>-{{orderInfo.deduct_integral}}</span>
	  				</p>
	  			</div> -->
	  		</div>
	  		<div class="orderInfo mt15">
	  			<p>
	  				<span>物流单号：</span>
	  				{{orderInfo.express_num}}
	  			</p>
	  			<p>
	  				<span>兑换时间：</span>
	  				{{orderInfo.create_time}}
	  			</p>
	  		</div>
	  	</div>
	</div>
</template>

<script>
	import svgsTwo from '../components/svgs.vue'
	import svgs from '../../../goodInfor/components/svgs.vue'
	export default{
		name:'orderStatus',
		components:{
	  		svgs,
	  		svgsTwo
		},
		data(){
			return{
				isMoney:true,
				isIntegration:false,
				orderInfo:'',
				goodsInfo:'',
				exchange_id:this.$route.query.exchangeId
			}
		},
		methods:{
			back(){
				this.$router.go(-1)
			},
			goPay(){
				// this.$router.push({
				// 	name:'waitforPay',
				// 	params:{order_sn:this.order_sn}
				// })
			},
			getGoodsDetail(){
				let that = this
				that.$axios({
					method:'post',
					url:that.GLOBAL.develop_url+'api/integral_goods_info',
					data:{
						goods_id:that.exchange_id
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
						
							that.goodsInfo = res.data.data
							that.goodsInfo.goods_img = eval(that.goodsInfo.goods_img)[0].img
							break;
						case "400":
							$toast.show('获取信息失败，请重新登录！', 1000).then(() => {
								that.$router.push('/login')
							})
							break;
						case "404":
							$toast.show(res.data.msg, 1000).then(() => {
								this.$router.push('/login')
							})
							break;
						default:
							$toast.show(res.data.msg)
							break;
					}
				})
			},
			getThisOrderInfo(){//获取订单详情
				let that = this
				that.$axios({
					method:'post',
					url:that.GLOBAL.develop_url+'api/integral_exchange_goods_info',
					data:{
						token:localStorage.getItem('token'),
						exchange_id:that.exchange_id
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
							that.orderInfo = res.data.data
							// that.receiveInfo = res.data.data.receiving_address
							that.orderInfo.create_time =  that.timeFormer(that.orderInfo.create_time)
							//that.orderInfo.pay_time = that.timeFormer(that.orderInfo.pay_time)
							break;
						default:
							break;
					}
				})
			},
			sureGot(){
				alert('sure before！！')
			},
			returnGoods(){
				this.$router.push({
					path:'/mine/myOrders/returnGoods',
					query:{order_sn:this.order_sn}
				})
			}
		},
		created(){
			console.log(this.$route)
			this.getThisOrderInfo();
			this.getGoodsDetail();

		}
	}
</script>

<style scoped lang="less">
.page-content {
  	padding-top: 44px;
  	.mt30{
  		margin-top: .3rem;
  	}
  	.orderStatus{
  		padding: .5rem;
  		background-color: #fff;
  		p{
  			font-size: .32rem;
  			display: flex;
  			display: -webkit-flex;
  			justify-content: center;
  			align-items: center;
  			padding: .2rem;
  			.guide_item{
				display: inline;
				display: flex;
				display: -webkit-flex;
				.icon_style{
					display: inline-block;
					width: .4rem;
					height: .4rem;
					margin-right: .075rem;
				}
			}
  		}
	  }
	.tilte-bar{
  		background-color: #fff;
  		// display: flex;
  		// display: -webkit-flex;
  		// justify-content: flex-start;
  		align-items: center;
  		font-size: .24rem;
		line-height: .8rem;
  		.guide_item{
			display: inline;
			display: flex;
			display: -webkit-flex;
			font-size: .28rem;
			border-bottom: 1px solid #d2d2d2;
			.icon_style{
				display: inline-block;
				width: .37rem;
				height: .43rem;
				margin: .2rem .1rem;
			}
		}
	}
  	.addressBox{
  		padding: .2rem;
  		background-color: #fff;
  		// display: flex;
  		// display: -webkit-flex;
  		// justify-content: flex-start;
  		align-items: center;
  		font-size: .24rem;
		line-height: .4rem;
  		.guide_item{
			display: inline;
			display: flex;
			display: -webkit-flex;
			font-size: .28rem;
			.icon_style{
				display: inline-block;
				width: .37rem;
				height: .43rem;
				margin-right: .1rem;
			}
		}
		div{
			width: calc(100% - .57rem);
			margin-left: .2rem;
			display: flex;
			display: -webkit-flex;
			flex-direction: column;
			p{
				&:first-child{
			  		display: flex;
			  		display: -webkit-flex;
			  		justify-content: flex-start;
				}
				span{
					margin-right: .2rem;
				}
			}
		}	
  	}
  	.orderBox{
  		padding: .2rem;
  		background-color: #fff;
  		position: relative;
  		div{
  			width: 100%;
	  		display: flex;
	  		display: -webkit-flex;
	  		justify-content: flex-start;
	  		align-items: flex-start;
	  		.userImg{
	  			display: block;
				width: 1.8rem;
    			height: 1.4rem;
				margin-right: .2em;
  				background-size: cover;
  				background-repeat: no-repeat;
  				background-position: center center;
			  }
			  .pay-info{
				display: flex;
				display: -webkit-flex;
				flex-direction: column;
			  }
	  		p{
	  			width: calc(100% - 1.52rem);
				  font-size: .24rem;
				  line-height: .4rem;
				  padding: 0 .2rem;
	  		}
	  		i{
	  			color: #E87439;
		  		display: flex;
		  		display: -webkit-flex;
		  		justify-content: space-between;
		  		align-items: center;
	  			.guide_item{
					display: inline;
					display: flex;
					display: -webkit-flex;
					.icon_style{
						display: inline-block;
						width: .35rem;
						height: .32rem;
						margin-right: .075rem;
					}
				}
				span{
					font-size: .3rem;
				}
	  		}
  		}
  		.feeBox{
	  		display: flex;
	  		display: -webkit-flex;
	  		justify-content: space-between;
  			align-items: center;
  			margin-top: .2rem;
  			p{
  				width: 100%;
		  		display: flex;
		  		display: -webkit-flex;
		  		justify-content: flex-end;
		  		align-items: center;
		  		font-size: .28rem;
		  		span{
		  			color: #E87439;
		  		}
  			}
  		}
  	}
  	.orderInfo{
  		padding: .2rem;
  		background-color: #fff;
  		font-size: .24rem;
  		p{
  			span{
  				color: #afaeae;
  			}
  		}
  	}
  	.footTab{
  		background-color: #fff;
  		padding: .15rem;
  		position: fixed;
  		bottom: 0;
  		left: 0;
  		width: 100%;
  		display: flex;
  		display: -webkit-flex;
  		justify-content: flex-end;
  		align-items: center;
		border-top: 1px solid #d2d2d2;
  		a{
  			display: inline-block;
  			padding: .1rem .25rem;
  			border: 1px solid #E87439;
  			color: #E87439 !important;
  			border-radius: .5rem;
  			font-size: .24rem;
  		}
  	}
}
.mt15{
	margin-top: .15rem;
}
</style>