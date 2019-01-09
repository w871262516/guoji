<template>
	<router-link class="box" :to="{path:'/mine/salerCenter/afterSaleDetail',query:{refund_num:data.refund_num}}">
		<svgs style="display: none;"></svgs>
		<div class="afterSaleBox">
			<div class="headStatus">
				<span class="default" v-show="data.refund_status==0">申请中</span>
				<span class="default" v-show="data.refund_status==1">已拒绝</span>
				<span class="default" v-show="data.refund_status==2">已同意</span>
				<span class="default" v-show="data.refund_status==3">退款申请完成</span>
				<span class="default" v-show="data.refund_status==4">买家取消退款</span>
			</div>		
			<div class="contentBox">
				<div class="rowOne">
					<div :style="{backgroundImage:'url('+data.thumb+')'}" class="goodImg" ></div>
					<div class="goodInfo">
						<p class="goodName">{{data.title}}</p>
						<p class="goodPrice default">￥ {{data.refund_amount}}</p>
					</div>
				</div>
				<div class="rowTwo">
					<div class="nums">
						退款编号：{{data.refund_num}}
					</div>
					<div class="nums">
						订单编号：{{data.order_sn}}
					</div>
					<div class="nums">
						商品编号：{{data.auction_id}}
					</div>
					<div class="nums">
						申请日期：{{data.c_time}}
					</div>
				</div>
			</div>
			<!-- <div class="bottonBox">
				<md-button class="button button-light btn" v-if="data.refund_status==0" @click.native="refuseBack(data.order_sn)">拒绝退款</md-button>
				<md-button class="button button-light btn" v-if="data.refund_status==0" @click.native="agreeBack(data.order_sn)">同意退款</md-button>
				<p class="default" v-if="data.refund_status==3">买家已退货</p>
				<md-button class="button button-light btn" v-if="data.refund_status==3" @click.native="goRouter('checkLogistics',data.order_sn)">查看物流</md-button>
			</div> -->
		</div>
	</router-link>
</template>

<script>
	import svgs from '../../mine/components/svgs.vue'
	export default{
		name:'afterSalerPart',
		props:['data'],
		components:{
			svgs
		},
		data(){
			return{
				isDone:false
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
			toEvaluate(){
				console.log(this.$router.push('/mine/myOrders/evaluateOrder'))
			},
			goRouter(path,params){
				this.$router.push({name:path,params:{'orderId':params}})
			},
		}
	}
</script>

<style scoped lang="less">
.afterSaleBox{
	width: 92%;
	margin: 0 auto;
	margin-top: .1rem;
	background-color: #FFFFFF;
	border-radius: 5px;
	.headStatus{
		padding: .2rem;
		height: .7rem;
		box-sizing: border-box;
		display: flex;
		display: -webkit-flex;
		align-items: center;
		border-bottom: 1px solid #eee;
	}
	.contentBox{
		padding: .2rem;
		display: flex;
		display: -webkit-flex;
		flex-direction: column;
		.rowOne{
			display: flex;
			display: -webkit-flex;
			flex-direction: row;
			.goodImg{
				display: block;
				height: 1.2rem;
				width: 1.2rem;
				background-size: cover;
				background-repeat: no-repeat;
				background-position: center center;
			}
			.goodInfo{
				margin-left: .2rem;
				width: calc(100% - 1rem);
			}
		}
		.rowTwo{
			display: flex;
			display: -webkit-flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: space-between;
			align-items: center;
			margin-top: .2rem;
			.nums{
				width: 47.5%;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
		}
	}
	.bottonBox{
		padding: .15rem;
		display: flex;
		display: -webkit-flex;
		justify-content: space-around;
		align-items: center;
		.btn{
			display: inline-block;
			padding: 0rem .3rem !important;
			border-radius: 5px;
			border:1px solid #42abdb;
			height: .7rem !important;
			line-height: .7rem !important;
			font-size: .24rem;
			min-height: 0 !important;
			color: #42abdb !important;
			margin-right: .15rem;
		}
	}
}
.default{
	color: #E87439;
}
</style>