<template>
	<div>
		<div class="page">
		  	<div class="page-content">
				<von-header theme="light">
				  <span slot="title">个人中心</span>
				</von-header>
				<!--头像区域-->
				<div class="headerBox">
					<router-link class="leftBar" :to="'/mine/accountManager'">	
						账户管理
						<svgs id="#setting" class="icon_style" iconWidth=".27rem" iconHeight=".25rem" style="margin-left: .15rem !important;"></svgs>
					</router-link>
					
					<router-link class="centerBar" :to="'/mine/accountManager'">	
					<div :style="{backgroundImage:'url('+userInfo.photo+')'}" class="img"></div>
					<p class="username">{{userInfo.nickname}}</p>
					</router-link>
					<!--已认证按钮-->
					<router-link class="rightBar" :to="'/mine/salerCenter'" v-if="isSaler">
						<svgs id="#store" class="icon_style" iconWidth=".27rem" iconHeight=".25rem"></svgs>
						商家中心
					</router-link>
					<!--未认证按钮-->
					<router-link class="rightBar" :to="whitchPage" v-if="isSaler==false">
						<svgs id="#store" class="icon_style" iconWidth=".27rem" iconHeight=".25rem"></svgs>
						商家入驻
					</router-link>
				</div>
				<!--关注、粉丝、喜欢-->
				<div class="flexBox">
					<router-link :to="'/mine/myFollow'" class="div">
						<span>{{userInfo.follow_count}}</span>
						<p>我的关注</p>
					</router-link>
					<router-link :to="'/mine/myFans'" class="div">
						<span>{{userInfo.fans_count}}</span>
						<p>我的粉丝</p>
					</router-link>
					<router-link :to="'/mine/myLoves'" class="div">
						<span>{{userInfo.like_count}}</span>
						<p>我的喜欢</p>
					</router-link>
				</div>
				
				<list class="list-ios item-icon-right">
					<item>
	       				<router-link :to="{name:'myOrders',params:{'index':0}}" class="section">
	       				<i class="icon ion-ios-arrow-right"></i>
	       				 	<svgs id="#fullOrders" class="icon_style" iconWidth=".23rem" iconHeight=".27rem"></svgs>
					  		 全部订单
	       				</router-link>
	       				<div class="flexBox">
	       					<router-link :to="{name:'myOrders',params:{'index':1}}" class="div">
	       						<svgs id="#waitPaying" class="icon_style mtrImportant" iconWidth=".37rem" iconHeight=".31rem"></svgs>
	       						<p>待付款</p>
	       					</router-link>
	       					<router-link :to="{name:'myOrders',params:{'index':2}}" class="div">
	       						<svgs id="#waitSending" class="icon_style mtrImportant" iconWidth=".37rem" iconHeight=".31rem"></svgs>
	       						<p>待发货</p>
	       					</router-link>
	       					<router-link :to="{name:'myOrders',params:{'index':3}}" class="div">
	       						<svgs id="#waitGetting" class="icon_style mtrImportant" iconWidth=".37rem" iconHeight=".31rem"></svgs>
	       						<p>待收货</p>
	       					</router-link>
	       					<router-link :to="{name:'myOrders',params:{'index':4}}" class="div">
	       						<svgs id="#waitEvaluate" class="icon_style mtrImportant" iconWidth=".37rem" iconHeight=".31rem"></svgs>
	       						<p>待评价</p>
	       					</router-link>
	       					<router-link :to="{name:'myOrders',params:{'index':5}}" class="div">
	       						<svgs id="#afterSale" class="icon_style mtrImportant" iconWidth=".37rem" iconHeight=".31rem"></svgs>
	       						<p>售后</p>
	       					</router-link>
	       				</div>
					</item>
					<item>
					   	<router-link :to="'/mine/myWallet'" class="section1">
	       				 	<svgs id="#myWallet" class="icon_style" iconWidth=".23rem" iconHeight=".27rem"></svgs>
					  		 我的钱包
	       					<i class="icon ion-ios-arrow-right"></i>
	       				</router-link>
	       				<div class="flexBox">
	       					<div class="div1">
	       						<router-link :to="'/mine/myWallet'">
	       							<span class="fz36">{{userInfo.user_money}}</span>
	       							<p>账户余额</p>
	       						</router-link>
	       					</div>
	       					
	       					<div class="div1">
	       						<router-link :to="{name:'exchangeCoin',params:{coin:userInfo.coin}}">
	       							<span class="fz36">{{userInfo.coin}}</span>
	       							<p>我的拍币</p>
       							</router-link>
	       					</div>
	       					
	       					<div class="div1">
	       						<router-link :to="'/mine/myCoupons'">
	       							<span class="fz36">{{userInfo.coupon}}</span>
	       							<p>优惠券</p>
	       						</router-link>
	       					</div>
	       					<div class="div1">
	       						<router-link :to="'/mine/myIntegrations'">
	       							<span class="fz36">{{userInfo.score}}</span>
	       							<p>积分</p>
	       						</router-link>
	       					</div>
	       				</div>
					</item>
					<!--<item>
					    <section class="alicenter">
	       				 	<svgs id="#shoppingCart" class="icon_style" iconWidth=".23rem" iconHeight=".27rem" ></svgs>
					  		 我的保证金
	       				</section>
	       				<i class="icon ion-ios-arrow-right"></i>
					</item>-->
					<!--<item>
					    <section class="alicenter">
	       				 	<svgs id="#allHistory" class="icon_style" iconWidth=".23rem" iconHeight=".27rem" ></svgs>
					  		我的拍卖
	       				</section>
	       				<i class="icon ion-ios-arrow-right"></i>
					</item>-->
				</list> 
				
				<list class="list-ios item-icon-right">
					<item  v-for="list in lists1">
						<router-link :to="list.router" >
							<section  class="alicenter">
		       				 	<svgs :id="list.id" class="icon_style" iconWidth=".23rem" iconHeight=".27rem" ></svgs>
						  		  {{list.text}}
		       				</section>
		       				<i class="icon ion-ios-arrow-right"></i>
	       				</router-link>
					</item>
				</list>
				
				<list class="list-ios item-icon-right">
					<item  v-for="list in lists2">
						<router-link :to="list.router">
							<section class="alicenter">
		       				 	<svgs :id="list.id" class="icon_style" iconWidth=".23rem" iconHeight=".27rem" ></svgs>
						  		{{list.text}}
								<badge :num="list.badge" v-if="list.badge" style="position: absolute;right:.8rem;"></badge>
								<span v-if="list.phone" class="phoneColor">{{list.phone}}</span>
		       					<i class="icon ion-ios-arrow-right"></i>
		       				</section>
						</router-link>
					</item>
				</list>
			</div>
		</div>
		<bottom></bottom>
	</div>	
</template>

<script>
	import svgs from './components/svgs.vue'
	import bottom from '../../components/footer/bottom.vue'
	export default{
		name:'minePage',
		components:{
	  		svgs,
	  		bottom
	  	},
		data(){
			return{
				account:'business_66400',
				whitchPage:'',
				title:'个人中心',
				back:false,
				userInfo:{},
				isSaler:false,
				lists1:[
					{
						text:'我的评价',
						id:'#myComments',
						router:'/mine/myComments'
					},
					{
						text:'我的美物志',
						id:'#myBeauty',
						router:'/mine/myBeauty'
					},
//					{
//						text:'我的动态',
//						id:'#myDynamic',
//						router:'/mine/myDynamics'
//					},
					{
						text:'我的足迹',
						id:'#myFootPrint',
						router:'/mine/myFootPrints'
					},
					{
						text:'积分兑换',
						id:'#exchangeIntegration',
						router:'/mine/integrationExchange'
					},
					{
						text:'地址管理',
						id:'#addressManager',
						router:'/mine/addressManager'
					},
					{
						text:'管理银行卡',
						id:'#accountManager',
						router:'/mine/salerCenter/managerBankCards'
					}
				],
				lists2:[
					{
						text:'消息',
						id:'#myNews',
						badge:this.$store.state.unReadNum,
						router:'/mine/message'
					},
					{
						text:'在线客服',
						id:'#onlineService',
						router:{
							path:'/onlineService/business_66400',
							query:{sessionId:'business_66400'}
						}
					},
					{
						text:'客服热线',
						id:'#serviceNumber',
						phone:'400-321-1234',
						router:''
					}
				]
			}
		},
		methods:{
			getUserInfoAction(){ //获取用户具体信息
				if(localStorage.getItem('token')==null || localStorage.getItem('mid')==null){this.$router.push('/login')}
				let that = this
				that.$axios({
					method:'get',
					url:that.GLOBAL.develop_url+'api/hompage/show',
					params:{
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
						case 200:	
							that.$store.state.userInfo.allInfo = res.data.data
							that.$store.state.userInfo.allInfo.photo = res.data.data.photo
							that.userInfo = that.$store.state.userInfo.allInfo
							if(res.data.data.type==3){
								that.isSaler = true
							}else if(res.data.data.type==0){
								that.isSaler = false
								that.whitchPage = '/mine/chooseAuthentication'
							}else{
								that.whitchPage = '/mine/applyResult'
								that.$store.commit('setApplyStatus',res.data.data.type)
								that.$store.commit('setApplyReason',res.data.data.refuse_reason)
							}
							break;
						case "400":
							$toast.show('获取信息失败，请重新登录！', 1000).then(() => {
								that.$router.push('/login')
							})
							break;
						case "404":
							$toast.show(res.data.msg, 1000).then(() => {
								that.$router.push('/login')
							})
							break;
						default:
							break;
					}
					if(res.data.code==404){
						$toast.show(res.data.msg, 1000).then(() => {
							that.$router.push('/login')
						})
					}
				})
			}
		},
		created(){
			var myRole = localStorage.getItem('myRole')
			var mid = localStorage.getItem('mid')
			if(myRole == 'business_'+mid){
				// this.$store.dispatch('initNimSDK','member_'+mid)
				localStorage.setItem("myRole",'member_'+mid)
			}
			this.getUserInfoAction()
		}
	}
</script>

<style scoped lang="less">
.page-content {
  	padding-top: 44px;
  	padding-bottom: 1rem;
	color: #323232;
  	font-size: .23rem;
	.headerBox{
		background-color:#fff;
		height:3.2rem;
		position:relative;
		color: #323232;
		border-bottom:1px solid #e5e5e5;
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
			.img{
				display: block;
				width: 1.15rem;
				height: 1.15rem;
				border-radius: 50%;
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%,-50%);
				-webkit-transform: translate(-50%,-50%);
  				background-size: cover;
  				background-repeat: no-repeat;
  				background-position: center center;
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
				margin-bottom: .1rem;
			}
			p{
				color: #323232;
				height: .28rem;
				line-height: .28rem;
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
				height: .28rem;
				line-height: .28rem;
			  	font-size: .23rem;
				&:last-child{
					margin-top: 0.11 !important;
				}
			}
		}
	}
	.list-ios{
		font-size: .24rem;
		margin-top: .2rem;
		padding-right: 0 !important;
		position: relative;
		.section{
			display: flex;
			display: -webkit-flex;
			justify-content: flex-start;
			align-items: center;
		}
		.flexBox{
			background-color:#fff;
			display: flex;
			display: -webkit-flex;
			justify-content: space-around;
			text-align: center;
			padding: 0.37rem 0 0rem;
			.div{
				width: 33.3333%;	
				position: relative;
				&:after{
					display: none;
				}
				p{
					margin-top: .11rem !important;
				}
				.fz36{
					height: .36rem !important;
					line-height: .36rem;
					font-size: .36rem;
					color: #E87439;
				}
			}
		}
		.phoneColor{
			color: #f96b21;
			margin-left: .22rem;
		}
	}
	.section1{
			display: flex;
			display: -webkit-flex;
			justify-content: flex-start;
			align-items: center;
			padding-left: .05rem;
	}
	.section{
		padding-left: .05rem;
	}
}
.icon_style{
	display: inline-block !important;
	margin-right: .15rem;
	transform: scale(1.35);
	-webkit-transform: scale(1.35);
}
.ion-ios-arrow-right{
	color: #1c1c1c;position: absolute;right: .16rem;top: 50%;transform: translateY(-50%);-webkit-transform: translateY(-50%);height: auto;
}
.ion-ios-arrow-left{
	color: #1c1c1c;position: absolute;right: .16rem;top: .18rem;height: auto;
}
.icon{
	font-size: .35rem !important;
}
.mtrImportant{
	margin-right: 0 !important;
}
.alicenter{
	display: flex;
	display: -webkit-flex;
	align-items: center;
	padding-left: .05rem;
}
</style>