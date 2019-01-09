<template>
	<div class="page">
	  	<div class="page-content">
		  	<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">我的余额</span>
			  <button class="button button-icon headWord" slot="right" style="font-size: .23rem;" @click="to('/mine/salerCenter/balanceLists',user_money)">余额明细</button>
			</von-header>
			<div class="headerBox">
				<p class="default">{{salerWallet.user_money}}</p>
				<p class="blue">冻结款项：{{salerWallet.freezing_money}}</p>
			</div>
			<!--关注、粉丝、喜欢-->
			<div class="flexBox">
				<router-link to="" class="div">
					<p>待付款</p>
					<span class="default">{{salerWallet.payment_money}}</span>
				</router-link>
				<router-link to="" class="div">
					<p>待发货</p>
					<span class="default">{{salerWallet.delivery_money}}</span>
				</router-link>
				<router-link to="" class="div">
					<p>待收货</p>
					<span class="default">{{salerWallet.collect_money}}</span>
				</router-link>
			</div>
			
			<list class="list-ios item-icon-right mt30">
				<!-- <item @click.native="to('/mine/salerCenter/balanceRecharge')">
				    <section class="alicenter" >
       				 	<svgs id="#recharge1" class="icon_style" iconWidth=".33rem" iconHeight=".33rem"></svgs>
				  		 充值
       				</section>
       				<i class="icon ion-ios-arrow-right"></i>
				</item> -->
				<item @click.native="to('/mine/myWallet/applyCash',withdrawData)">
				    <section class="alicenter">
       				 	<svgs id="#withdraw" class="icon_style" iconWidth=".34rem" iconHeight=".34rem" ></svgs>
				  		提现
       				</section>
       				<i class="icon ion-ios-arrow-right"></i>
				</item>
			</list> 
			<list class="list-ios item-icon-right mt30">
				<!-- <item @click.native="to('/mine/salerCenter/managerBankCards')">
				    <section class="alicenter"  >
       				 	<svgs id="#accountManager" class="icon_style" iconWidth=".38rem" iconHeight=".28rem" ></svgs>
				  		管理银行卡
       				</section>
       				<i class="icon ion-ios-arrow-right"></i>
				</item>
				<item  @click.native="to('/mine/salerCenter/paySave')">
				    <section class="alicenter">
       				 	<svgs id="#save" class="icon_style" iconWidth=".31rem" iconHeight=".37rem" ></svgs>
				  		支付安全
       				</section>
       				<i class="icon ion-ios-arrow-right"></i>
				</item> -->
				<item @click.native="goBond()">
				    <section class="alicenter justBetween pdr4">
				    	<div>
				    		<svgs id="#bond" class="icon_style" iconWidth=".35rem" iconHeight=".34rem" ></svgs>
				  			保证金
				    	</div>
				  		<span class="default">
				  			{{salerWallet.deposit}}
				  		</span>
       				</section>
       				<i class="icon ion-ios-arrow-right"></i>
				</item>
			</list>
  		</div>
  		<svgs style="display: none;"></svgs>
  	</div>
</template>

<script>
	import svgs from '../components/svgs.vue'
	export default{
		name:'salerBalance',
		components:{
			svgs
		},
		data(){
			return{
				salerWallet:'',
				withdrawData:{
					member_type:2,
					withdraw_type:1
				},
				user_money:'0.00'
			}
		},
		methods:{
			back(){
				this.$router.go(-1)
			},
			to(arg,data){
				if(data){
					this.$router.push({
						path:arg,
						query:data
					})
				}
				this.$router.push(arg)
			},
			goBond(){
				this.$router.push({name:'salerBond',params:{deposit:this.salerWallet.deposit}})
			},
			getSalerWalletoAction(){ //获取商家钱包信息
				if(localStorage.getItem('token')==null || localStorage.getItem('mid')==null){this.$router.push('/login')}
				let that = this
				that.$axios({
					method:'post',
					url:that.GLOBAL.develop_url+'api/account_balance',
					data:{
						token:localStorage.getItem('token')
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
					switch (res.data.code){
						case "200":	
							that.salerWallet = res.data.data
							that.user_money = {
								user_money:that.salerWallet.user_money
							}
							break;
						case "400":
							$toast.show('获取信息失败，请重新登录！', 1000).then(() => {
								that.$router.push('/login')
							})
						default:
							break;
					}
				})
			}
		},
		created(){
			this.getSalerWalletoAction()
		}
	}
</script>

<style lang="less" scoped>
.page-content {
  	padding-top: 44px;
  	.headerBox{
		background-color:#fff;
		height:2.5rem;
		position:relative;
		color: #323232;
		display: flex;
		display: -webkit-flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border-bottom:1px solid #e5e5e5;
		.default{
			font-size: .56rem;
			font-weight: bold;
			margin-bottom: .2rem !important;
		}
		.blue{
			color: #5580ba;
		}
		.leftBar{
			width: 2rem;
			height: .65rem;
			padding-left: .4rem;
			font-size: .24rem;
			position: absolute;
			left: 0;
			top: 50%;
			transform:translateY(-50%);
			-webkit-transform: translateY(-50%);
			border: 1px solid #d2d2d2;
			border-left: none;
			border-top-right-radius: 20px;
			border-bottom-right-radius: 20px;
			display: flex;
			display: -webkit-flex;
			align-items: center;
		}
		.centerBar{
			img{
				display: block;
				width: 1.15rem;
				height: 1.15rem;
				border-radius: 50%;
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%,-50%);
				-webkit-transform: translate(-50%,-50%);
			}
			.username{
				width: 100%;
				font-size: .3rem;
				text-align: center;
				position: absolute;
				top: 75%;
			}
		}
		.rightBar{
			width: 2rem;
			height: .65rem;
			line-height: .65rem;
			padding-right: .4rem;
			text-align: right;
			font-size: .24rem;
			position: absolute;
			right: 0;
			top: 50%;
			transform:translateY(-50%);
			-webkit-transform: translateY(-50%);
			border: 1px solid #d2d2d2;
			border-right: none;
			border-top-left-radius: 20px;
			border-bottom-left-radius: 20px;
			display: flex;
			display: -webkit-flex;
			justify-content: flex-end;
			align-items: center;
		}
	}
	.flexBox{
		background-color:#fff;
		display: flex;
		display: -webkit-flex;
		justify-content: space-around;
		text-align: center;
		padding: 0.23rem 0;
		.div{
			width: 33.3333%;	
			position: relative;
			&:after{
				content: '';
				display: block;
				height: 100%;
				width: 1px;
				position: absolute;
				right: 0;
				top: 0;
				background-color: #d9d9d9;
			}
			&:last-child{
				&:after{
					display: none;
				}
			}
			span{
				display: inline-block;
				margin-top: .1rem;
				font-size: .26rem;
			}
			p{
				color: #323232;
				height: .23rem;
				line-height: 1;
			  	font-size: .26rem;
				&:last-child{
					margin-top: 0.11 !important;
				}
			}
		}
	}
	.list-ios{
		padding-right: 0 !important;	
		.item{
			position: relative;
			.contentBox{
				width: calc(100% - 30px);
				display: flex;
				display: -webkit-flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
			}
		.flexBox{
			background-color:#fff;
			display: flex;
			display: -webkit-flex;
			justify-content: space-around;
			text-align: center;
			padding: 0.23rem 0;
				.div{
					width: 33.3333%;	
					position: relative;
					span{
						display: inline-block;
						margin-bottom: .1rem;
					}
					p{
						color: #323232;
						height: .23rem;
						line-height: 1;
					  	font-size: .23rem;
						&:last-child{
							margin-top: 0.11 !important;
						}
					}
				}
				.div1{
					span{
						display: inline-block;
						margin-bottom: .15rem;
					  	font-size: .36rem !important;
					  	color: #E87439;
					}
					p{
						color: #323232;
						height: .23rem;
						line-height: 1;
					  	font-size: .23rem;
						&:last-child{
							margin-top: 0.11 !important;
						}
					}
				}
			}
		}
	}
}
.alicenter{
	display: flex;
	display: -webkit-flex;
	align-items: center;
	div{
		display: flex;
		display: -webkit-flex;
		align-items: center;
	}
}
.icon_style{
	display: inline-block !important;
	margin-right: .11rem;
	transform: scale(1.1);
	-webkit-transform: scale(1.1);
}
.pdr4{
	padding-right: .4rem;
}
.justBetween{
	justify-content: space-between;
}
.mt30{
	margin-top: .3rem;
}
.ion-ios-arrow-right{
	color: #1c1c1c;position: absolute;right: .16rem;top: 50%;transform: translateY(-50%);-webkit-transform: translateY(-50%);height: auto;
}
.icon{
	font-size: .35rem !important;
}
.default{
	color: #E87439;
}
</style>