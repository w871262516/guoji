<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">店铺设置</span>
			</von-header>
			<div class="storeHeader">
				<img :src="salerInfo.logo"  class="storeImg"/>
				<p class="storeName">{{salerInfo.name}}</p>
			</div>
			
			<i class="tip">资质信息</i>
			<list class="list-ios item-icon-right mt2">
				<item>
				    <section class="alicenter">
				    	<div>
				  		 	<span class="leftSpan">实名认证</span>
				  		 	<span class="gray">认证后享受8大特权</span>
				    	</div>
				    	<span class="default" >已认证</span>
       				</section>
       				<i class="icon ion-ios-arrow-right"></i>
				</item>
				<item>
				    <section class="alicenter" @click="to({name:'salerBond',params:{deposit:salerInfo.deposit}})">
				    	<div>
				  		 	<span class="leftSpan">消保金</span>
				  		 	<span class="gray">缴纳后增加店铺曝光</span>
				    	</div>
				    	<span class="default">{{salerInfo.deposit}}</span>
       				</section>  
       				<i class="icon ion-ios-arrow-right"></i>
				</item>
			</list> 
			
			<i class="tip">店铺设置</i>
			<list class="list-ios item-icon-right mt2">
				<item>
				    <section class="alicenter">
				    	<span class="leftSpan">联系人</span>
				    	<span>{{salerInfo.realname}}</span>
       				</section>
       				<i class="icon ion-ios-arrow-right"></i>
				</item>
				<item>
				    <section class="alicenter">
			  		 	<span class="leftSpan">手机号</span>
				    	<span>{{salerInfo.mobile}}</span>
       				</section>
       				<i class="icon ion-ios-arrow-right"></i>
				</item>
				<item>
				    <section class="alicenter" @click="to({name:'salerSetStoreIntroduction',params:{intru:salerInfo.introduce}})">
			  		 	<span class="leftSpan">店铺简介</span>
       				</section>
       				<i class="icon ion-ios-arrow-right"></i>
				</item>
				<item>
				    <section class="alicenter" @click="to('/mine/salerCenter/salerEditAddress')">
			  		 	<span class="leftSpan">退货地址</span>
       				</section>
       				<i class="icon ion-ios-arrow-right"></i>
				</item>
			</list> 
<!--			
			<i class="tip">竞拍设置</i>
			<list class="list-ios item-icon-right mt2">
				<item>
				    <section class="alicenter">
				    	<span class="leftSpan">竞拍设置</span>
       				</section>
       				<i class="icon ion-ios-arrow-right"></i>
				</item>
				<item>
				    <section class="alicenter">
			  		 	<span class="leftSpan">买家出价条件设置</span>
				    	<span class="default">未设置</span>
       				</section>
       				<i class="icon ion-ios-arrow-right"></i>
				</item>
			</list> -->
			
			<!-- <i class="tip">用户设置</i>
			<list class="list-ios item-icon-right mt2">
				<item>
				    <section class="alicenter" @click="to('/mine/salerCenter/salerFans')">
				    	<span class="leftSpan">粉丝</span>
				    	<span class="default">{{salerInfo.fans_num}}</span>
       				</section>
       				<i class="icon ion-ios-arrow-right"></i>
				</item> -->
				<!-- <item>
				    <section class="alicenter" @click="to('/mine/salerCenter/salerBlackLists')">
			  		 	<span class="leftSpan">黑名单</span>
				    	<span class="default">{{salerInfo.black_list}}</span>
       				</section>
       				<i class="icon ion-ios-arrow-right"></i>
				</item> -->
			</list> 
	  	</div>
	</div>
</template>

<script>
	export default{
		name:'chat',
		data(){
			return{
				salerInfo:''	
			}
		},
		methods:{
			back(){
				this.$router.go(-1)
			},
			to(arg){
				this.$router.push(arg)
			},
			getSalerInfoAction(){ //获取商家基本信息
				if(localStorage.getItem('token')==null || localStorage.getItem('mid')==null){this.$router.push('/login')}
				let that = this
				that.$axios({
					method:'post',
					url:that.GLOBAL.develop_url+'api/shop_setting',
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
			this.getSalerInfoAction()
		}
	}
</script>

<style scoped lang="less">
.page-content {
  	padding-top: 44px;
  	padding-bottom: 44px;
  	.storeHeader{
  		background-color: #fff;
  		padding: .4rem 0;
  		display: flex;
  		display: -webkit-flex;
  		justify-content: center;
  		flex-direction: column;
  		align-items: center;
  		.storeImg{
  			display: block;
  			width: .96rem;
  			height: .96rem;
  			border-radius: 50%;
  		}
  		.storeName{
  			font-size: .26rem;
  			color: #454545;
  			margin-top: .2rem !important;
  		}
  	}
	.tip{
		display: inline-block;
		font-size: .24rem;
		margin-top: .2rem;
		margin-left: .25rem;
	}
	.list-ios{
		margin-bottom: 0 !important;
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
	.alicenter{
		display: flex;
		display: -webkit-flex;
		align-items: center;
		justify-content: space-between;
		padding-right: .4rem;
		div{
			display: flex;
			display: -webkit-flex;
			align-items: center;
			justify-content: flex-start;
			.leftSpan{
				width: 1.45rem;
			}
			.gray{
				margin-left: .4rem;
				color: #9D9C9C;
			}
		}
	}
  	.mt15{
  		margin-top: .15rem;
  	}
  	.mt2{
  		margin-top: .2rem;
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
}
</style>