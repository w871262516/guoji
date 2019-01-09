<template>
	<div class="page">
	  	<div class="page-content">
	  		<svgs style="display: none;"></svgs>
	  		<svgs-two style="display: none;"></svgs-two>
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">订单详情</span>
			  <button v-if="status == 2||status == 3||status == 4" class="button button-icon" slot="right" @click="returnGoods" style="font-size: .28rem;color: #E87439;">退货</button>
			</von-header>
	  		<div class="orderStatus">
	  			<!--评价已完成-->
	  			<p v-if="status == 5">
	  				<section class="guide_item">
			        	<svg class="icon_style">
			                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#rightFull'" fill="#48ab59"></use>
			          	</svg>
			        </section>
			                         已完成
	  			</p>
	  			<!--交易成功-->
	  			<p v-if="status == 4">
	  				<section class="guide_item">
			        	<svg class="icon_style">
			                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#rightFull'" fill="#48ab59"></use>
			          	</svg>
			        </section>
			                         交易完成(待评价)
	  			</p>
	  			<!--商家处理中-->
	  			<p v-if="status == 2">
	  				<section class="guide_item">
			        	<svg class="icon_style">
			                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#rightFull'" fill="#E87439"></use>
			          	</svg>
			        </section>
			                        待发货
	  			</p>
	  			<!--交易成功-->
	  			<p v-if="status == 1&&!orderInfo.overTime">
	  				<section class="guide_item">
			        	<svg class="icon_style">
			                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#rightFull'" fill="#E87439"></use>
			          	</svg>
			        </section>
			                         待付款
	  			</p>
	  			<!--订单失效-->
	  			<p v-if="status == 1&&orderInfo.overTime">
	  				<section class="guide_item">
			        	<svg class="icon_style">
			                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#bad'"></use>
			          	</svg>
			        </section>
			                        已失效
	  			</p>
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
	  		<div class="mt15 addressBox" v-if="receiveInfo!=''">
	  			<i>
	  				<section class="guide_item">
			        	<svg class="icon_style">
			                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#location'"></use>
			          	</svg>
			        </section>
	  			</i>
	  			<div>
	  				<p>
	  					<span>收货人：{{receiveInfo.name}}</span>
	  					<span>{{receiveInfo.mobile}}</span>
	  				</p>
	  				<p>
	  					收货地址：{{receiveInfo.area}}&nbsp;{{receiveInfo.address}}
	  				</p>
	  			</div>
	  		</div>
	  		
	  		<div class="mt15 orderBox">
	  			<div>
					<div :style="{backgroundImage:'url('+orderInfo.thumb+')'}" class="userImg"></div>
					<div class="pay-info">
						<p>{{orderInfo.title}}</p>
						<!-- <p>平台服务费：{{orderInfo.service_charge}}</p>
						<p>应支付总金额：{{orderInfo.pay_amount_total}}</p> -->
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
	  			<div class="feeBox">
	  				<p v-if="status!=6">
	  					应付：
	  					<span v-if="isMoney">￥{{orderInfo.amount}}</span>
	  				</p>
					<p v-if="status==6">
						退款金额：
						<span v-if="isMoney">￥{{orderInfo.refund_amount}}</span>
					</p>
	  			</div>
	  		</div>
	  		<div class="orderInfo mt15">
	  			<p>
	  				<span v-if="status!=6">订单编号：</span><span v-if="status==6">退款编号：</span>
	  				{{orderInfo.order_sn}}
	  			</p>
	  			<p>
	  				<span v-if="status!=6">下单时间：</span><span v-if="status==6">申请时间：</span>
	  				{{orderInfo.c_time}}
	  			</p>
	  		</div>
			<div class="orderInfo mt15" v-if="orderInfo.refund_status==1">
	  			<p>
	  				<span>拒绝理由：</span>
	  				{{orderInfo.refuse_reason}}
	  			</p>
	  		</div>
	  		<div class="orderInfo mt15" v-if="status==6&&orderInfo.express!=''">
	  			<p>
	  				<span>快递公司：</span>
	  				{{orderInfo.express}}
	  			</p>
	  			<p>
	  				<span>退货物流单号：</span>
	  				{{orderInfo.express_num}}
	  			</p>
	  		</div>
			<!-- <div class="express" v-if="orderInfo.refund_status==2&&orderInfo.refund_type==2&&orderInfo.express==''"> -->
			<div class="express" v-if="orderInfo.refund_status==2&&orderInfo.refund_type==2">
				<p>快递公司</p>
				<div class="relativeBox">
					<p class="chooseExpress" @click="toShow">{{applyType}}</p>
					<section class="guide_item" :class="{toUp:show}">
						<svg class="icon_style">
							<use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#toDown'"></use>
						</svg>
					</section>
				</div>
				<input type="text" v-model.trim="expressNum" placeholder="请输入快递单号"/>
			</div>
			<vue-pickers
				:show="show"
				:defaultData="defaultData"
				:selectData="pickData"
				@cancel="close"
				@confirm="confirmFn"></vue-pickers>
			<!-- <div class="btnBar"  v-if="orderInfo.refund_status==2&&orderInfo.refund_type==2&&orderInfo.express==''"> -->
			<div class="btnBar"  v-if="orderInfo.refund_status==2&&orderInfo.refund_type==2">
				<md-button class="button button-positive button-block" @click.native="sureSendThisGood">
					确定
				</md-button>
			</div>
	  		<!--底部确定收货按钮-->
	  		<div class="footTab" v-if="status==3">
	  			<a class="btn" @click="sureGot">确认收货</a>
	  		</div>
	  		<!--底部待付款按钮-->
	  		<div class="footTab" v-if="status==1&&!orderInfo.overTime">
	  			<a class="btn" @click="goPay">立即付款</a>
	  		</div>
			<!--申请中  取消申请-->
			<div class="footTab" v-if="orderInfo.refund_status==0">
	  			<a class="btn" @click="cancel">取消申请</a>
	  		</div>
			<!--商家拒绝后再次申请-->
			<div class="footTab" v-if="orderInfo.refund_status==1">
	  			<a class="btn" @click="returnGoods(orderInfo.order_sn)">再次申请</a>
	  		</div>
	  	</div>
	</div>
</template>

<script>
	import svgsTwo from '../components/svgs.vue'
	// import svg from '../../../../components/common/svgs.vue'
	import svgs from '../../../goodInfor/components/svgs.vue'
	import vuePickers from 'vue-pickers'
	export default{
		name:'orderStatus',
		components:{
			svgs,
	  		svgsTwo,
			vuePickers
		},
		data(){
			return{
				token:localStorage.getItem('token'),
				isMoney:true,
				isIntegration:false,
				orderInfo:'',
				receiveInfo:'',
				status:this.$route.query.status,
				order_sn:this.$route.query.order_sn,
				expressNum:'',//快递单号
				expressPy:'',//快递拼音名称？后台要的
				show: false,
				columns: 1,
				defaultData: [
			        {
			          text: "",
			          value: 0
			        }
			    ],
			    pickData: {
			        // 第一列的数据结构
			        data1: [
			          {
			            text: "",
			            value: 0
			          },
			        ]
			    },
		  		applyType:'请选择快递公司'
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
			goPay(){
				this.$router.push({
					name:'waitforPay',
					params:{order_sn:this.order_sn}
				})
			},
			getThisOrderInfo(){//获取订单详情
				let that = this
				that.$axios({
					method:'get',
					url:that.GLOBAL.develop_url+'api/hompage/orderdetail',
					params:{
						token:that.token,
						order_sn:that.order_sn
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
					var ti = new Date;
					if(res.data.code==200){
							that.orderInfo = res.data.data.order_info
							that.receiveInfo = res.data.data.receiving_address
							that.orderInfo.dl_time = that.orderInfo.c_time+24*60*60*3
							if(ti.getTime()/1000<that.orderInfo.dl_time){
								that.orderInfo.overTime = false
							}else{
								that.orderInfo.overTime = true
							}
							that.orderInfo.dl_time = that.timeFormer(that.orderInfo.dl_time)
							that.orderInfo.c_time =  that.timeFormer(that.orderInfo.c_time)
							//that.orderInfo.pay_time = that.timeFormer(that.orderInfo.pay_time)
					}else if(res.data.code==404){
						$toast.show(res.data.msg, 1000).then(() => {
							that.$router.push('/login')
						})
					}else{
						$toast.show(res.data.msg, 1000)
					}
				})
			},
			sureGot(){
				// alert('sure before！！')
				let that = this
				that.$axios({
					method:'post',
					url:that.GLOBAL.develop_url+'api/hompage/confirm_receipt',
					data:{
						token:that.token,
						order_sn:that.order_sn
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
					$toast.show(res.data.msg, 1000)
					if(res.data.code == "200"){
						that.getThisOrderInfo()	
					}else if(res.data.code == 404){
						that.$router.push('/login')
					}
				})
			},
			getRefundOrderInfo(){//获取售后订单详情
				let that = this
				that.$axios({
					method:'post',
					url:that.GLOBAL.develop_url+'api/hompage/after_sale_info',
					data:{
						token:that.token,
						refund_num:that.order_sn
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
					if(res.data.code == 200){	
						that.orderInfo = res.data.data
						that.orderInfo.c_time =  that.timeFormer(that.orderInfo.c_time)
						that.orderInfo.thumb = eval(that.orderInfo.thumbs)[0].path
						if(res.data.data.business_refund_address){
							that.receiveInfo = res.data.data.business_refund_address
							that.receiveInfo.area = that.receiveInfo.address
							that.receiveInfo.address = that.receiveInfo.address_info
						}
						
						console.log(eval(that.orderInfo.thumbs)[0].path);
						
						switch(that.orderInfo.refund_status){
							case 0: that.orderInfo.statusText = '申请中'; break;
							case 1: that.orderInfo.statusText = '商家拒绝 '; break;
							case 2: that.orderInfo.statusText = '商家同意'; that.getExpressCompany(); break;
							case 3: that.orderInfo.statusText = '退款申请完成'; break;
							case 4: that.orderInfo.statusText = '已取消退款'; break;
						}
					}else if(res.data.code==404){
						$toast.show(res.data.msg, 1000).then(() => {
							that.$router.push('/login')
						})
					}
				})
			},
			getExpressCompany(){//获取快递公司列表
		    	let that = this
				that.$axios({
					method:'post',
					url:that.GLOBAL.develop_url+'api/express_list',
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
							that.pickData.data1 = res.data.data
							that.pickData.data1.forEach(item=>{
								item.value = item.id
								item.text = item.name
							})
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
			confirmFn(val) {
				this.show = false
				this.applyType = val.select1.text
				this.defaultData = [val.select1]
				this.expressPy = val.select1.byname
			},
			sureSendThisGood(){//确认提交退货物流信息
				if(this.expressNum == ''){
					$toast.show('请输入快递单号！',1000)
					return
				}
				if(this.expressPy == ''){
					$toast.show('请输入快递公司！',1000)
					return
				}
				let that = this
				that.$axios({
					method:'post',
					url:that.GLOBAL.develop_url+'api/hompage/after_sale_refunds',
					data:{
						token:localStorage.getItem('token'),
						refund_num:that.order_sn,
						express:that.applyType,
						express_num:that.expressNum,
						express_flag:that.expressPy
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
						$toast.show(res.data.msg, 1000).then(() => {
							that.getRefundOrderInfo()
						})
					}else if(res.data.code == 404||res.data.code == 400){
						$toast.show(res.data.msg, 1000).then(() => {
							that.$router.push('/login')
						})
					}
				})
			},
			cancel(){//取消退货申请
				// alert('sure before！！')
				let that = this
				that.$axios({
					method:'post',
					url:that.GLOBAL.develop_url+'api/hompage/cancel_after_sale',
					data:{
						token:that.token,
						refund_num:that.order_sn
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
					$toast.show(res.data.msg, 1000)
					if(res.data.code == "200"){
						that.getRefundOrderInfo()
					}else if(res.data.code == 404){
						that.$router.push('/login')
					}
				})
			},
			returnGoods(refundOrder){
				
				if(refundOrder==this.orderInfo.order_sn){
					var order_sn = refundOrder//退货单号的订单号
				}else{
					var order_sn = this.order_sn
				}
				
				this.$router.push({
					path:'/mine/myOrders/returnGoods',
					query:{order_sn:order_sn}
				})
			},
		},
		created(){
			console.log(this.$route)
			// if(this.$route.params.order_sn){
			// 	localStorage.setItem('order_sn',this.order_sn)
			// }else{
			// 	this.order_sn = localStorage.getItem('order_sn')
			// }
			// if(this.$route.query.status){
			// 	localStorage.setItem('status',this.$route.query.status)
			// }else{
			// 	this.status = localStorage.getItem('status')
			// }
			if(this.status == 6){
				this.getRefundOrderInfo()
			}else{
				this.getThisOrderInfo()	
			}
			
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