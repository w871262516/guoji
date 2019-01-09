<template>
	<list class="list-ios item-icon-right">
		<item class="item1">
			<div class="typeBox" @click="howPay(1)">
				<img src="../../../../../static/common/wechatIcon.png" class="rechargeIcon"/>
				<span>
					微信支付
				</span>
				<section>
					<label :class="{isDefault:payType==1}"></label>
       			</section>
			</div>
		</item>
		<item class="item1">
			<div class="typeBox" @click="howPay(2)">
				<img src="../../../../../static/common/alipayIcon.png" class="rechargeIcon"/>
				<span>
					支付宝支付
				</span>
				<section>
					<label :class="{isDefault:payType==2}"></label>
       			</section>
			</div>
		</item>
	</list>
</template>

<script>
	export default{
		name:'rechargeList',
		data(){
			return{
				payType:1
			}
		},
		methods:{
			howPay(payType){
				this.payType = payType
				this.$emit('payType',this.payType)
			}
		}
	}
</script>

<style scoped lang="less">
.list-ios{
		padding-right: 0 !important;
		.item1{
			padding-right: .65rem;
			font-size: .27rem;
			line-height: .4rem;
			.typeBox{
				display: flex;
				display: -webkit-flex;
				justify-content: flex-start;
				align-items: center;
				.rechargeIcon{
					display: block;
					width: .55rem;
					height: .55rem;
					border-radius: 50%;
					margin-right: .25rem;
				}
				section{
					display: flex;
					display: -webkit-flex;
					align-items:center;
					position: absolute;
					right: .2rem;
					top: 50%;
					transform: translateY(-50%);
					-webkit-transform:translateY(-50%);
					label{
						margin-right: .15rem;
						display: inline-block;
						width: .3rem;
						height: .3rem;
						box-sizing: content-box;
						border: 1px solid #E87439;
						border-radius: 50%;
						position: relative;
					}
					.isDefault:before{
						content: '';
						position: absolute;
						display: block;
						width: .17rem;
						height: .17rem;
						background-color: #E87439;
						border-radius: 50%;
						left: 50%;
						top: 50%;
						transform: translate(-50%,-50%);
						-webkit-transform: translate(-50%,-50%);
					}
				}
			}
		}
	}
</style>