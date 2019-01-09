<template>
	<div class="box">
		<svgs style="display: none;"></svgs>
		<div class="headerBox">
			<span class="orderStatus default">{{statusText}}</span>
		</div>
		<div class="contentBox" @click="goRouter('salerOrderInfo',{order_sn:data.order_sn,auction_id:data.auction_id,statusText:statusText,normalStatus:normalStatus})">
			<div :style="{backgroundImage:'url('+data.thumb+')'}" class="goodImg"></div>
			<!-- <img :src="data.thumb" class="goodImg"/> -->
			<div class="goodBox">
				<p class="goodName">{{data.title}}</p>
				<!--<p>市场价：￥{{data.market_price}}</p>-->
				<p>成交价：￥{{data.pay_amount}}</p>
			</div>
		</div>
		<div class="bottomBox" >
			<div>
				<p>订单编号：{{data.order_sn}}</p>
				<p>下单时间：{{data.c_time}}</p>
			</div>
			<!--待付款无按钮-->

			<!-- 已付款待发货 -->
			<md-button class="button button-light btn" v-if="normalStatus == 1" @click.native="goRouter('salerSendGoods',{'orderId':data.order_sn})">发货</md-button>
			
			<!--已发货-->
			<md-button class="button button-light btn" v-if="normalStatus == 2&&!data.is_virtual" @click.native="goRouter('checkLogistics',{'orderId':data.order_sn})" >查看物流</md-button>
			<!-- 退款中 -->
			<md-button class="button button-light btn" v-if="data.status == 4" @click="afterSale">售后处理</md-button>
			<!--待评价无按钮-->
		</div>
	</div>
</template>

<script>
	import svgs from '../../mine/components/svgs.vue'
	export default{
		name:'orderPart',
		props:['data','tabIndex'],
		components:{
			svgs
		},
		data(){
			return{
				isDone:false,
				statusText:'',
				normalStatus:0
			}
		},
		created(){
			switch(this.data.status){
				case 0:	this.statusText = '禁用'; break;
				case 1:	
					if(this.data.pay_status == 0){
						this.statusText = '待付款';
						this.normalStatus = 0;
					}else if(this.data.pay_status == 1 && this.data.express_status == 0){
						this.statusText = '待发货';
						this.normalStatus = 1;
					}else if(this.data.pay_status == 1 && this.data.express_status == 1 && this.data.receive_status == 0){
						this.statusText = '待收货';
						this.normalStatus = 2;
					}else if(this.data.pay_status == 1 && this.data.express_status == 1 && this.data.receive_status == 1 && this.data.comment_status == 0){
						this.statusText = '待评论';
						this.normalStatus = 3;
					}else if(this.data.pay_status == 1 && this.data.express_status == 1 && this.data.receive_status == 1 && this.data.comment_status == 1){
						this.statusText = '已完成';
						this.normalStatus = 4;
					}
					break;
				case 2: this.statusText = '用户未付款关闭订单';break;
				case 3: this.statusText = '商家未发货关闭订单 ';break;
				case 4: this.statusText = '退款中';break;
				case 5: this.statusText = '退款成功关闭订单';break;
				case 6: this.statusText = '商家拒绝退款关闭';break;
			}
		},
		methods:{
			afterSale(){
				this.$router.push('/mine/salerCenter/afterSale')
					  
			},
			goRouter(path,params){
				this.$router.push({name:path,params:params})
			},

		}
	}
</script>

<style scoped lang="less">
.box{
	display: block;
	background-color: #fff;
	font-size: .22rem;
	position: relative;
	overflow: hidden;
	width: 95%;
	margin: 0 auto;
	border-radius: 5px;
	box-shadow: 1px 1px 5px #D1D3D6;
	.headerBox{
		padding: .2rem .2rem 0;
		display: flex;
		display: -webkit-flex;
		align-items:center;
		justify-content: space-between;
		.orderStatus{
			font-size: .24rem;
		}
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
			}
		}
		.guide_item{
			display: flex;
			display: -webkit-flex;
			align-items: center;
			font-size:.24rem;
			margin-right: .2rem;
			.icon_style{
				display: inline-block;
				width: .34rem;
				height: .33rem;
				margin: 0.05rem 0;
				margin-right: .0275rem;
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
			width: 1.33rem;
			height: 1.33rem;
			background-position: center center;
			background-size: cover;
			background-repeat: no-repeat;
			margin-right: .15rem !important;
		}
		.goodBox{
			display: flex;
			display: -webkit-flex;
			flex-direction: column;
			height: 1.25rem;
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