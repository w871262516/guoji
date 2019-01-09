<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">积分兑换</span>
			</von-header>
	  		<list class="list-ios item-icon-right">
				<item class="myItem">
					<div :style="{backgroundImage:'url('+myIntegrationInfo.photo+')'}" class="img"></div>
					<div class="itemInfo">
						<p>我的积分：<span class="default">{{myIntegrationInfo.total_left}}</span></p>
					</div>
					<router-link class="default myRanking" :to="'/mine/integrationExchange/integrationRanking'">
						积分排名<br />
					</router-link>
				</item>
			</list>
			
			<svgs style="display: none;"></svgs>
			
			<div class="todayIntegration">
				<div class="default">
					<p>
						<section class="guide_item">
				        	<svg class="icon_style">
				                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#integration'" fill="#E87439"></use>
				          	</svg>
				        </section>
				        {{myIntegrationInfo.today_get_amount}}
					</p>
					<span>今日积分</span>
				</div>
			</div>
			
			<div class="mt30 recommendBox">
				<p @click="goMall">
					<span>积分兑换商城</span>
					<span>
						查看更多
						<i class="icon ion-ios-arrow-right"></i>
					</span>
				</p>
				<integrationRecommend :recommends="recommends"></integrationRecommend>
			</div>
			
			<div class="integrationBar mt30">
				<tabs :tab-items="tabs" :tab-index="tabIndex" :on-tab-click="onTabClick" top="0px"></tabs>
				<get-integration v-show="tabIndex==0"></get-integration>
				<integration-rules v-show="tabIndex==1"></integration-rules>
			</div>
  		</div>
  	</div>
</template>

<script>
	import svgs from './components/svgs.vue'
	import integrationRecommend from './components/integrationRecommend.vue'
	import getIntegration from './components/howToGetIntegration.vue'
	import integrationRules from './components/integrationRules.vue'
	export default{
		name:'integrationExchange',
		components:{
			svgs,
	  		integrationRecommend,
	  		getIntegration,
	  		integrationRules
	  	},
		data(){
			return{
				tabs:['如何获取积分','积分规则'],
				tabIndex:0,
				myIntegrationInfo:'',
				recommends:[
					{
						photo:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1532523640086&di=0f02d60deb86a8c8595e997972cf356e&imgtype=0&src=http%3A%2F%2Fimg5.duitang.com%2Fuploads%2Fitem%2F201601%2F14%2F20160114161349_BaMCA.jpeg',
						name:'初音',
						price:'20000'
					},
					{
						photo:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1532523655914&di=8b7981d3b407c660d1352dcce8ec4225&imgtype=jpg&src=http%3A%2F%2Fimg3.imgtn.bdimg.com%2Fit%2Fu%3D2435840008%2C1614768645%26fm%3D214%26gp%3D0.jpg',
						name:'呵呵呵',
						price:'23000'
					},
					{
						photo:'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1710475256,3666355084&fm=27&gp=0.jpg',
						name:'哦哦哦',
						price:'14000'
					},
					{
						photo:'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1885717375,3699997884&fm=27&gp=0.jpg',
						name:'嗯嗯嗯',
						price:'35000'
					},
					{
						photo:'https://timgsa.baidu.com/timg?image&quality=80&size=b10000_10000&sec=1532513614&di=e160ab8366c7cd2b7338c47801d885b2&src=http://img5q.duitang.com/uploads/item/201409/26/20140926110417_HcQTm.jpeg',
						name:'嘿嘿嘿',
						price:'210000'
					},
					{
						photo:'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3083693965,3642567609&fm=27&gp=0.jpg',
						name:'嘎嘎嘎',
						price:'210000'
					}
				]
			}
		},
		methods:{
			back(){
				this.$router.go(-1)
			},
			goMall(){
				this.$router.push('/mine/integrationExchange/integrationMall')
			},
			onTabClick(index){
				this.tabIndex = index
			},
			getMyIntegrationInfo(){
				let that = this
				that.$axios({
					method:'post',
					url:that.GLOBAL.develop_url+'api/hompage/personscoreinfo',
					data:{
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
						case "200":	
							that.myIntegrationInfo = res.data.data
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
			getIntegralList(){
				let that = this
				that.$axios({
					method:'post',
					url:that.GLOBAL.develop_url+'api/integral_goods',
					data:{
						page:that.page,
						type:that.tabIndex
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
							res.data.data.forEach((item) => {
								item.create_time = that.timeFormer(item.create_time);
								item.goods_img = eval(item.goods_img)[0].img
							});
							that.recommends = res.data.data
							console.log(that.recommends);
								
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
		},
		created(){
			this.getMyIntegrationInfo()
			this.getIntegralList()
		}
	}
</script>

<style lang="less"	scoped>
.page-content {
  	padding-top: 44px;
	color: #323232;
  	font-size: .23rem;
  	.list-ios{
  		padding-right:0 !important;
  		box-shadow: 0px 3px 7px 0px rgba(174, 173, 173, 0.18);
  		margin-bottom:0 !important;
  		z-index:1;
	  	.myItem{
	  		display: flex;
	  		display: -webkit-flex;
	  		justify-content: flex-start;
	  		align-items: center;
	  		position:relative;
	  		.img{
	  			display: block;
	  			width: .95rem;
	  			height: .95rem;
	  			border-radius: 50%;
	  			margin-right: .25rem;
  				background-size: cover;
  				background-repeat: no-repeat;
  				background-position: center center;
	  		}
	  		.itemInfo{
	  			p{
	  				height:.28rem;
	  				line-height:.28rem;
	  				&:first-child{
	  					font-size: .26rem;
	  				}
	  				&:last-child{
	  					font-size: .26rem ;
	  					span{
	  						font-size: .26rem !important;
	  					}
	  				}
	  			}
	  		}
	  		.myRanking{
	  			text-align: center;
	  			line-height: 1.5;
	  			font-size: .2rem;
	  			position: absolute;
	  			right: .2rem;
	  			top: 50%;
	  			transform: translateY(-50%);
	  			-webkit-transform: translateY(-50%);
	  			padding: .2rem 0 .2rem .2rem;
	  		}
	  	}
  	}

	.todayIntegration{
		width: 100%;
		height: 3.25rem;
		background-color: #fff;
		position: relative;
		top: 0;
		div{
			width: 2.75rem;
			height: 2.75rem;
			background: url(../../../../static/integration/integrationBg.png) no-repeat top left;
			background-size: cover;
			margin: 0 auto;
			display: flex;
			display: -webkit-flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%,-50%);
			-webkit-transform: translate(-50%,-50%);
			p{
				display: flex;
				display: -webkit-flex;
				justify-content:center;
				font-size: .55rem;
				margin-bottom: .35rem !important;
				.guide_item{
					display: flex;
					display: -webkit-flex;
					align-items: center;
					.icon_style{
						display: inline-block;
						width: .34rem;
						height: .33rem;
						margin-right: .075rem;
					}
				}
			}
			span{
				font-size: .3rem;
			}
		}
		
	}
	.recommendBox{
		width: 100%;
		display: flex;
		display: -webkit-flex;
		justify-content: space-between;	
		flex-direction: column;
		background-color: #fff;
		padding: .2rem 0 ;
		p{
			display: flex;
			display: -webkit-flex;
			align-items: center;
			justify-content: space-between;
			height: .28rem;
			line-height: 1;
			padding: 0 .2rem;
			span{
				&:first-child{
					font-size: .28rem;
				}
			}
		}
	}
	.integrationBar{
		position: relative;
		padding-top: 49px;
	}
}
.mt30{
	margin-top: .3rem;
}

.default{
	color: #E87439 !important;
}
</style>