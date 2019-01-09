<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">卖家中心</span>
			  <button class="button button-icon headWord" slot="right" @click="to('/mine/salerCenter/storeSet')">
			  	<svgs id="#setting" class="icon_style" iconWidth=".3rem" iconHeight=".3rem" ></svgs>
			  </button>
			</von-header>
			
				<svgs style="display: none;"></svgs>
			<div class="salerCenterBox">
				<div class="salerInfoBox">
					<img :src="salerInfo.logo" class="salerInfoImg"  @click="to({path:'/mine/personAuthen',query:{'edit':1,'storePic':salerInfo.logo,'storeName':salerInfo.name}})"/>
					<p class="salerInfoName">{{salerInfo.name}}</p>
					<div class="salerInfoDiv">
						<span class="mr">积分：{{salerInfo.score}}</span>
						<span>粉丝：{{salerInfo.fav_num}}</span>
					</div>
				</div>
				<list class="list-ios item-icon-right mt30">
					<item>
	       				<router-link :to="{name:'salerOrders',params:{'index':0}}">
							<div class="contentBox">
								<span>店铺订单</span>
								<span style="font-size: .24rem !important;">查看更多</span>
							</div>
		       				<i class="icon ion-ios-arrow-right"></i>
	       				</router-link>
					</item>
					<item>
						<div class="flexBox">
	       					<router-link :to="{name:'salerOrders',params:{'index':1}}" class="div">
	       						<svgs id="#waitpay" class="icon_style mtrImportant" iconWidth=".37rem" iconHeight=".31rem"></svgs>
	       						<p>待付款</p>
	       					</router-link>
	       					<router-link :to="{name:'salerOrders',params:{'index':2}}" class="div">
	       						<svgs id="#waitsend" class="icon_style mtrImportant" iconWidth=".37rem" iconHeight=".31rem"></svgs>
	       						<p>待发货</p>
	       					</router-link>
	       					<router-link :to="{name:'salerOrders',params:{'index':3}}" class="div">
	       						<svgs id="#waitreceive" class="icon_style mtrImportant" iconWidth=".37rem" iconHeight=".31rem"></svgs>
	       						<p>待收货</p>
	       					</router-link>
	       					<router-link :to="{name:'afterSale'}" class="div">
	       						<svgs id="#afterSale" class="icon_style mtrImportant" iconWidth=".37rem" iconHeight=".31rem"></svgs>
	       						<p>售后</p>
	       					</router-link>
	       					<router-link :to="{name:'salerForm'}" class="div">
	       						<svgs id="#form" class="icon_style mtrImportant" iconWidth=".38rem" iconHeight=".31rem"></svgs>
	       						<p>店铺报表</p>
	       					</router-link>
	       				</div>
					</item>
				</list>
				
				<list class="list-ios item-icon-right mt30">
					<item @click.native="to('/mine/salerCenter/salerBalance')">
					    <section class="alicenter" >
	       				 	<svgs id="#balance" class="icon_style" iconWidth=".32rem" iconHeight=".32rem" fill="#fb6464" ></svgs>
					  		 余额
	       				</section>
	       				<i class="icon default" style="font-size: .26rem !important;padding-right: .2rem;">{{salerInfo.user_money}}元</i>
					</item>
					<item>
					    <section class="alicenter">
	       				 	<svgs id="#bussCard" class="icon_style" iconWidth=".35rem" iconHeight=".27rem" ></svgs>
					  		店铺名片
	       				</section>
	       				<i class="icon ion-ios-arrow-right"></i>
					</item>
				</list> 
				<list class="list-ios item-icon-right mt30">
					<item @click.native="to('/mine/salerCenter/salerMessages')">
					    <section class="alicenter"  >
	       				 	<svgs id="#message" class="icon_style" iconWidth=".3rem" iconHeight=".3rem" ></svgs>
					  		卖家消息中心
					  		<badge :num="unRead"  style="position: absolute;right:.8rem;"></badge>
	       				</section>
	       				<i class="icon ion-ios-arrow-right"></i>
					</item>
					<item  @click.native="to('/mine/salerCenter/salerGoodsManager')">
					    <section class="alicenter">
	       				 	<svgs id="#thingsManager" class="icon_style" iconWidth=".31rem" iconHeight=".31rem" ></svgs>
					  		拍品管理
	       				</section>
	       				<i class="icon ion-ios-arrow-right"></i>
					</item>
					<item>
					    <section class="alicenter">
	       				 	<svgs id="#sperand" class="icon_style" iconWidth=".23rem" iconHeight=".27rem" fill="#55a7db" ></svgs>
					  		产品推广
	       				</section>
	       				<i class="icon ion-ios-arrow-right"></i>
					</item>
				</list>
			</div>
  		</div>
  	</div>
</template>

<script>
	import svgs from './components/svgs.vue'
	export default{
		name:'chat',
		components:{
			svgs
		},
		data(){
			return{
				salerInfo:0,
				mid:localStorage.getItem('mid'),
			}
		},
		watch:{
			unRead(val){
				this.unRead = val
			}
		},
		computed:{
			unRead:{
				get: function () {
					return this.$store.state.unReadNum
				},
				set: function () {

				}
			}
		},
		methods:{
			back(){
				this.$router.go(-1)
			},
			to(arg){
				this.$router.push(arg)
			},
			getSalerInfoAction(){ //获取商家个人具体信息
				if(localStorage.getItem('token')==null || localStorage.getItem('mid')==null){this.$router.push('/login')}
				let that = this
				that.$axios({
					method:'post',
					url:that.GLOBAL.develop_url+'api/business_center',
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
							that.salerInfo = res.data.data
							that.$store.state.userInfo.allInfo.photo = res.data.data.logo
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

			localStorage.setItem("myRole",'business_'+this.mid)
			// this.$store.dispatch('initNimSDK','business_'+this.mid)
			this.getSalerInfoAction()
		}
	}
</script>

<style scoped lang="less">
.page-content {
  	padding-top: 44px;
  	padding-bottom: 24px;
	color: #f2f2f2;
	.salerCenterBox{
		width: 100%;
		.salerInfoBox{
			background-color: #fff;
			width: 100%;
			height: 2.8rem;
			display: flex;
			display: -webkit-flex;
			flex-direction:column;
			justify-content: center;
			align-items: center;
			.salerInfoImg{
				display: block;
				width: 1.1rem;
				height: 1.1rem;
				border-radius: 50%;
				margin-top: .4rem ;
			}
			.salerInfoName{
				font-size: .26rem;
				color:#454545;
				margin-top: .17rem !important;
			}
			.salerInfoDiv{
				display: flex;
				display: -webkit-flex;
				justify-content: center;
				flex-direction: row;
				margin-top: .15rem;
				margin-bottom: .32rem;
				span{
					font-size: .26rem;
					color:#454545;
					
				}
				.mr{
					margin-right: .35rem;
				}
			}
		}
		.list-ios{
			padding-right: 0 !important;	
			.item{
				position: relative;
				.contentBox{
					width: calc(100% - 20px);
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
						display: flex;
						display: -webkit-flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						span{
							display: inline-block;
							margin-bottom: .1rem;
						}
						p{
							color: #323232;
							// height: .23rem;
							line-height: .3rem;
						  	font-size: .23rem;
							margin-top: 0.11rem  !important;
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
	.icon_style{
		display: inline-block !important;
		margin-right: .15rem;
		transform: scale(1.125);
		-webkit-transform: scale(1.125);
	}
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
.icon_style{
	display: inline-block !important;
	transform: scale(1.35);
	-webkit-transform: scale(1.35);
}
</style>