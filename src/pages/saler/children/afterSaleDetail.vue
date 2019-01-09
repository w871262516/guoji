<template>
	<div class="page">
	  	<div class="page-content">
	  		<svga style="display: none;"></svga>
	  		<svgs style="display: none;"></svgs>
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">订单详情</span>
			</von-header>
	  		<div class="orderStatus">
				<!--售后-->
				<!-- 2:商家同意  3:退款申请完成 -->
	  			<p v-if="orderInfo.refund_status==2||orderInfo.refund_status==3">
	  				<section class="guide_item">
			        	<svg class="icon_style">
			                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#rightFull'" fill="#48ab59"></use>
			          	</svg>
			        </section>
									{{orderInfo.statusText}}
	  			</p>
				  <!-- 0:申请中 -->
				<p v-if="orderInfo.refund_status==0">
					<section class="guide_item">
						<svg class="icon_style">
							<use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#rightFull'" fill="#E87439"></use>
						</svg>
					</section>
									{{orderInfo.statusText}}
				</p>
				<!-- 1:商家拒绝  4:已取消退款 -->
				<p v-if="orderInfo.refund_status==1||orderInfo.refund_status==4">
					<section class="guide_item">
						<svg class="icon_style">
							<use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#bad'"></use>
						</svg>
					</section>
									{{orderInfo.statusText}}
				</p>	
	  		</div>
	  		
	  		<!--收货地址-->
	  		<div class="mt15 addressBox" v-if="orderInfo.refund_type==2">
	  			<i>
	  				<section class="guide_item">
			        	<svg class="icon_style">
			                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#location'"></use>
			          	</svg>
			        </section>
	  			</i>
	  			<div>
	  				<p>
	  					<span>收货人：{{orderInfo.receive_name}}</span>
	  					<span>{{orderInfo.mobile}}</span>
	  				</p>
	  				<p>
	  					收货地址：{{orderInfo.address}}
	  				</p>
	  			</div>
	  		</div>
	  		
	  		<div class="mt15 orderBox">
	  			<div>
					<div :style="{backgroundImage:'url('+orderInfo.thumb+')'}" class="userImg"></div>
					<div class="pay-info">
						<p>{{orderInfo.title}}</p>
					</div>
	  			</div>
	  			<div class="feeBox">
					<p>
						退款金额：
						<span>￥{{orderInfo.refund_amount}}</span>
					</p>
	  			</div>
	  		</div>
	  		<div class="orderInfo mt15">
	  			<p>
	  				<span>退款编号：</span>
	  				{{orderInfo.refund_num}}
	  			</p>
	  			<p>
	  				<span>申请时间：</span>
	  				{{orderInfo.c_time}}
	  			</p>
	  			<p>
	  				<span>售后类型：</span>
	  				{{orderInfo.refund_typeTxet}}
	  			</p>
	  		</div>
			<div class="orderInfo mt15" v-if="orderInfo.note!=''">
	  			<p>
	  				<span>申请理由：</span>
	  				{{orderInfo.note}}
	  			</p>
	  		</div>
	  		<div class="orderInfo mt15" v-if="orderInfo.refund_type==2&&orderInfo.express_num!=''">
	  			<p>
	  				<span>快递公司：</span>
	  				{{orderInfo.express}}
	  			</p>
	  			<p>
	  				<span>退货物流单号：</span>
	  				{{orderInfo.express_num}}
	  			</p>
	  		</div>
            <!-- 底部按钮 -->
			<div class="footTab" v-if="orderInfo.refund_status==0">
				<!--申请中  取消申请-->
	  			<a class="btn" @click="refuseBack(orderInfo.order_sn)">拒绝退款</a>
				<!--商家拒绝后再次申请-->
	  			<a class="btn" @click="agreeBack(orderInfo.order_sn)">同意退款</a>
	  		</div>
			<div class="footTab" v-if="orderInfo.refund_status==3&&orderInfo.refund_type==2&&orderInfo.express_num ==''">
	  			<p>等待买家退货</p>
	  		</div>
	  	</div>
	</div>
</template>

<script>
	import svga from '../../../components/common/svgs.vue'
	import svgs from '../../goodInfor/components/svgs.vue'
	export default{
		name:'afterSaleDetail',
		components:{
			svga,
			svgs
		},
		data(){
			return{
				token:localStorage.getItem('token'),
				isMoney:true,
				isIntegration:false,
				orderInfo:'',
				receiveInfo:'',
				refund_num:this.$route.query.refund_num,
				expressNum:'',//快递单号
				columns: 1,
			}
		},
		methods:{
			back(){
				this.$router.go(-1)
			},
		    toShow() {
		      this.show = true
		    },
	        close() {
		      this.show = false
		    },
			getRefundOrderInfo(){//获取售后订单详情
				let that = this
				that.$axios({
					method:'post',
					url:that.GLOBAL.develop_url+'api/after_sale_info',
					data:{
						token:that.token,
						refund_num:that.refund_num
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
					if(res.data.code == 200){	
						that.orderInfo = res.data.data
						that.orderInfo.c_time =  that.timeFormer(that.orderInfo.c_time)
						that.orderInfo.thumb = eval(that.orderInfo.thumbs)[0].path
						if(res.data.data.business_refund_address){
							that.receiveInfo = res.data.data.business_refund_address
						}
						
						console.log(eval(that.orderInfo.thumbs)[0].path);
						
						switch(that.orderInfo.refund_status){
							case 0: that.orderInfo.statusText = '申请中'; break;
							case 1: that.orderInfo.statusText = '商家拒绝 '; break;
							case 2: that.orderInfo.statusText = '商家同意'; break;
							case 3: that.orderInfo.statusText = '退款申请完成'; break;
							case 4: that.orderInfo.statusText = '已取消退款'; break;
						}
						if(that.orderInfo.refund_type==1){
							that.orderInfo.refund_typeTxet = '退款'
						}else{
							that.orderInfo.refund_typeTxet = '退货退款'
						}
					}else if(res.data.code==404){
						$toast.show(res.data.msg, 1000).then(() => {
							that.$router.push('/login')
						})
					}else{
						$toast.show(res.data.msg, 1000)
					}
				})
			},
			refuseBack(id){//拒绝退款
				this.$router.push({
					path:"/mine/salerCenter/refund",
					query:{orderId:id}
				})
			},
			agreeBack(order_id){
				let that = this
				that.$axios({
					method:'POST',
					url:that.GLOBAL.develop_url+'api/approval_refund',
					data:{
						token:that.token,
						order_id:order_id
					},
	    			transformRequest:[function(data){
	    				let ret = ''
	    				for(let it in data){
	    					ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
	    				}
	    				return ret
	    			}],
					xhrFields:{
		    			withCredentials:true
	    			},
		    		crossDomain:true,
		    		headers: { //解决跨域
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				}).then(function(res){
					console.log(res.data)
					if(res.data.code == 200){
						
						
					}else if(res.data.code == 404){
						$toast.show(res.data.msg, 1000).then(() => {
							that.$router.push('/login')
						})
					}else{
						$toast.show(res.data.msg, 1000)
					}
	    			that.loadFinish = true
				}).catch(function(err){
					//$toast.show('网络错误', 2000).then(() => {})
				})
			}
		},
		created(){
			console.log(this.$route)
			this.getRefundOrderInfo()
			
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
  	.addressBox{
  		padding: .2rem;
  		background-color: #fff;
  		display: flex;
  		display: -webkit-flex;
  		justify-content: flex-start;
  		align-items: center;
  		font-size: .24rem;
  		line-height: .4rem;
  		.guide_item{
			display: inline;
			display: flex;
			display: -webkit-flex;
			.icon_style{
				display: inline-block;
				width: .37rem;
				height: .43rem;
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
	  			width: 1.27rem;
	  			height: 1.27rem;
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
	  .express{
  		width: 95%;
  		margin:0 auto;
  		p{
  			margin: .3rem 0 !important;
  		}
  		.relativeBox{
  			position: relative;
  			section{
  				position: absolute;
  				top: 0;
  				left: calc(60% - .5rem);
  			}
			.toUp{
				transform: rotate(180deg);
				-webkit-transform: rotate(180deg);
			}
  		}
  		.chooseExpress{
  			width: 60%;
  			padding: .15rem;
  			align-items: center;
  			background-color: #fff;
  			border-radius: 8px;
  		}
		input{
			width: 100%;
			border-radius: 8px;
			padding-left: .2rem;
		}
		textarea{
  			margin: .3rem auto !important;
			width: 100%;
			padding: .2rem;
			border-radius: 8px;
		}
	}
	.btnBar{
		width: 6rem;
		margin: .5rem auto;
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
  		justify-content: space-around;
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
		  p{
			color: #E87439;
		  }
  	}
}
.mt15{
	margin-top: .15rem;
}
section{
	display: flex;
	display: -webkit-flex;
	align-items: center;
}
.guide_item{
	height: 100%;
	.icon_style{
		display: inline-block;
		width: .32rem;
		height: .3rem;
	}
}
</style>