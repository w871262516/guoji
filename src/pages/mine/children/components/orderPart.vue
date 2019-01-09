<template>
	<div style="position: relative;">
		<!-- <section @click="deleteThisOrder(data.auction_id)" class="guide_item" v-if="data.pay_status==0 || data.pay_status==5">
	    	<svg class="icon_style">
	            <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#delete'"></use>
	      </svg>
	   </section> -->
		<router-link class="box" :to="{path:'/mine/myOrders/orderStatus',query:{order_sn:data.order_sn,status:data.status}}">
			<save-money :data="data.convert_rate" v-if="data.convert_rate"></save-money>
			<svgs style="display: none;"></svgs>
			<div class="headerBox">
				<div class="userBox">
					<div :style="{backgroundImage:'url('+data.business_logo+')'}" class="userImg"></div>
					<p class="userName">{{data.business_name}}</p>
				</div>
			</div>
			<div class="contentBox">
				<div :style="{backgroundImage:'url('+data.thumb+')'}" class="goodImg"></div>
				<div class="goodBox">
					<p class="goodName">{{data.title}}</p>
					<!--<p>市场价：￥{{data.market_price}}</p>-->
					<p v-if="data.amount">成交价：￥{{data.amount}}</p>
					<p v-if="tabIndex == 1">下单时间：{{data.c_time}}</p>
					<p v-if="tabIndex == 1">有效期：{{data.dl_time}}</p>
					<p v-if="tabIndex == 5">申请时间：{{data.c_time}}</p>
					<p v-if="tabIndex == 5">退款金额：￥{{data.refund_amount}}</p>
				</div>
			</div>
			<div class="bottomBox" >
				<div>
					<p class="default"  v-if="tabIndex == 5">{{data.statusText}}</p>
				</div>
				
				<!--待付款-->
				<md-button class="button button-light btn" v-if="data.pay_status == 0&&!data.overTime" @click.native="goPay">立即付款</md-button>
				<p class="default"  v-if="data.pay_status == 0&&data.overTime">订单已过期</p>
				<!--<md-button class="button button-light btn" v-if="data.pay_status == 0">已失效</md-button>-->
				<!--待发货-->
				<md-button class="button button-light btn" v-if="data.pay_status == 1 && data.express_status == 0" :class="{done:isDone==true}" @click.native="remind">提醒发货</md-button>
				<!--待收货-->
				<md-button class="button button-light btn" v-if="data.pay_status == 1 && data.express_status == 1 && data.receive_status == 0" @click.native="sureGot">确认收货</md-button>
				<!--待评价-->
				<md-button class="button button-light btn" v-if="data.pay_status == 1 && data.express_status == 1 && data.receive_status == 1 && data.comment_status == 0" @click.native="toEvaluate">立即评价</md-button>
				<!-- 已完成	 -->
				<md-button class="button button-light btn" disabled="disabled" v-if="data.pay_status == 1 && data.express_status == 1 && data.receive_status == 1 && data.comment_status == 1">已完成</md-button>
				<!-- 退货状态  -->
				<md-button class="button button-light btn" v-if="tabIndex == 5&&data.status==0"  @click.native="cancelRefund(data.refund_num)">取消申请</md-button>
				<!--<span class="default">成交价：￥{{data.price}}</span>-->
			</div>
		</router-link>
	</div>
</template>

<script>
	import svgs from '../components/svgs.vue'
	import saveMoney from '../../../../components/common/saveMoney.vue'
	export default{
		name:'orderPart',
		props:['data','tabIndex'],
		components:{
			svgs,saveMoney
		},
		data(){
			return{
				isDone:false,
				token:localStorage.getItem('token')
			}
		},
		created(){
			var data = this.data
			if(data.pay_status == 0){
				this.data['status'] = 1 //待付款
			}else if(data.pay_status == 1 && data.express_status == 0){
				this.data['status'] = 2 //待发货
			}else if(data.pay_status == 1 && data.express_status == 1 && data.receive_status == 0){
				this.data['status'] = 3 //确认收货
			}else if(data.pay_status == 1 && data.express_status == 1 && data.receive_status == 1 && data.comment_status == 0){
				this.data['status'] = 4 //待评价
			}else if(data.pay_status == 1 && data.express_status == 1 && data.receive_status == 1 && data.comment_status == 1){
				this.data['status'] = 5 //已完成
			}else if(this.tabIndex == 5){
				this.data['status'] = 6 //退款申请中
			}
		},
		methods:{
			remind(){
				if(this.isDone == false) {
					this.isDone = true
					$toast.show('提醒成功！请耐心等待！', 1000).then(() => {
					  
					})
				}
			},
			toEvaluate(){//立即评价

				let that = this
				this.$router.push({
					path:'/mine/myOrders/evaluateOrder',
					query:{
						order_sn:that.data.order_sn,
						thumb:that.data.thumb	
					}
				})
			},
			deleteThisOrder(id){
				let that = this
				that.$axios({
					method:'get',
					url:that.GLOBAL.develop_url+'api/hompage/footprintdel',
					params:{
						token:that.token,
						id:id
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
					if(res.data.code==200){
						$toast.show('删除成功！', 1000).then(() => {
							that.$emit("sureGot",0)
						})
					}else if(res.data.code==404){
						$toast.show(res.data.msg, 1000).then(() => {
							that.$router.push('/login')
						})
					}else{
						$toast.show(res.data.msg, 1000)
					}
				})
			},
			goPay(){//立即支付
				var that = this;
				this.$router.push({
					name:'waitforPay',
					params:{
						order_sn:that.data.order_sn
					}
				})
			},
			sureGot(){//确认收货
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
						that.$emit("sureGot",2)
					}else if(res.data.code == 404){
						that.$router.push('/login')
					}
				})
			},
			cancelRefund(refund_num){//取消退货申请
				// alert('sure before！！')
				let that = this
				that.$axios({
					method:'post',
					url:that.GLOBAL.develop_url+'api/hompage/cancel_after_sale',
					data:{
						token:that.token,
						refund_num:refund_num
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
						that.$emit("sureGot",1)
					}else if(res.data.code == 404){
						that.$router.push('/login')
					}
				})
			},
			returnGoods(){
				this.$router.push({
					path:'/mine/myOrders/returnGoods',
					query:{order_sn:this.order_sn}
				})
			}
		},
	}
</script>

<style scoped lang="less">

.guide_item{
	display: flex;
	display: -webkit-flex;
	align-items: center;
	font-size:.24rem;
	position: absolute;
	right: .05rem;
	top: .1rem;
	box-sizing: border-box;
    padding: 0.1rem;
	z-index: 100;
	.icon_style{
		display: inline-block;
		width: .34rem;
		height: .33rem;
		margin: 0.05rem 0;
		margin-right: .0275rem;
	}
}
.box{
	display: block;
	background-color: #fff;
	font-size: .22rem;
	position: relative;
	overflow: hidden;
	.headerBox{
		padding: .2rem .2rem 0;
		display: flex;
		display: -webkit-flex;
		align-items:center;
		justify-content: space-between;
		.userBox{
			display: flex;
			display: -webkit-flex;
			align-items:center;
			.userImg{
				display: block;
				width: .51rem;
				height: .51rem;
				border-radius: 50%;
				margin-right: .15rem;
  				background-size: cover;
  				background-repeat: no-repeat;
  				background-position: center center;
			}
		}
	}
	.contentBox{
		padding: .2rem;
		display: flex;
		display: -webkit-flex;
		align-items:center;
		border-bottom: 1px solid #e5e5e5;
		.goodImg{
			display: block;
			width: 1.55rem;
			height: 1.55rem;
			margin-right: .15rem !important;
			background-size: cover;
			background-repeat: no-repeat;
			background-position: center center;
		}
		.goodBox{
			display: flex;
			display: -webkit-flex;
			flex-direction: column;
			justify-content: space-around;
			.goodName{
				width:4rem;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}
	}
	.bottomBox{
		padding: .15rem;
		display: flex;
		display: -webkit-flex;
		justify-content: space-between;
		align-items: center;
		.btn{
			display: inline-block;
			padding: 0rem .2rem !important;
			border-radius: 5px;
			border:1px solid #E87439;
			height: .55rem !important;
			line-height: .55rem !important;
			font-size: .24rem;
			min-height: 0 !important;
			color: #E87439 !important;
			margin-right: .15rem;
		}
		.done{
			color: #848483 !important;
			border-color: #848483 !important;
		}
	}
}
.default{
	color: #E87439;
}
</style>