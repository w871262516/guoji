<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">保证金</span>
			</von-header>
			<div class="flexBox bgf">
				<span>保证金余额：<span class="default">{{deposit}}</span></span>
				<img src="../../../../static/saler/what.png" @click="showHideModel">
			</div>
			<list class="list-ios item-icon-right">
				<item>
				    <section class="alicenter">
			  		 	<span>保证金特权一览</span>
			  		 	<!-- <span>消保金明细</span> -->
       				</section>
       				<!-- <i class="icon ion-ios-arrow-right"></i> -->
				</item>
			</list> 
			<div class="mt2 bondIntroBox">
				<div class="flexBox bgg">
					<p class="w4">功能权限</p>
					<p class="w3">缴纳前</p>
					<p class="w3">缴纳后</p>
				</div>
				<div class="flexBox bg7">
					<p class="w4">"逛逛"频道展示</p>
					<p class="w3"><img src="../../../../static/saler/close.png"></p>
					<p class="w3"><img src="../../../../static/saler/right.png"></p>
				</div>
				<div class="flexBox bg7">
					<p class="w4">"精选"频道报名</p>
					<p class="w3"><img src="../../../../static/saler/close.png"></p>
					<p class="w3"><img src="../../../../static/saler/right.png"></p>
				</div>
				<div class="flexBox bg7">
					<p class="w4">"分类"频道展示</p>
					<p class="w3"><img src="../../../../static/saler/close.png"></p>
					<p class="w3"><img src="../../../../static/saler/right.png"></p>
				</div>
				<div class="flexBox bg7">
					<p class="w4">参加平台活动</p>
					<p class="w3"><img src="../../../../static/saler/close.png"></p>
					<p class="w3"><img src="../../../../static/saler/right.png"></p>
				</div>
				<div class="flexBox bg7">
					<p class="w4">专属信任印记</p>
					<p class="w3"><img src="../../../../static/saler/close.png"></p>
					<p class="w3"><img src="../../../../static/saler/right.png"></p>
				</div>
				<div class="flexBox">
					<p>注：保证金可全额退回。</p>
				</div>
			</div>
			
			<div class="btnBar">
				<md-button class="button button-positive button-block" @click.native="to('/mine/recharge')">
					缴纳保证金
				</md-button>
			</div>
		</div>
		<transition name="fade" enter-active-class="animated fadeInUp faster">
	  		<div class="model" v-show="show">
				<div class="wrap" @click="showHideModel"></div>	
				<div class="content" v-show="show">
					<img src="../../../../static/saler/closeGray.png" class="close" @click="showHideModel">
					<div class="div">
						<h5>微拍堂消费者保障保证金功能开通</h5>
						<div id="agreement"></div>
					</div>
					<md-button class="button button-positive button-block" @click.native="showHideModel">
						知道了
					</md-button>
				</div> 
			</div>
		</transition>
	</div>
</template>

<script>
	export default{
		name:'setStoreName', 
		data(){
			return{
				show: false,
				deposit:''
			}
		},
		methods:{
			back(){
				this.$router.go(-1)
			},
			showHideModel(){
				this.show = !this.show
			},
			to(arg){
				this.$router.push(arg)
			},
			getAgreement(){
				let that = this
				that.$axios({
					method:'get',
					url:that.GLOBAL.develop_url+'api/agreement',
					params:{
						type:'deposit'
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
					if(res.data.code == "200"){
						document.getElementById('agreement').innerHTML = res.data.data
					}else{
						$toast.show(res.data.msg, 1000)
					}
				})
			}
		},
		created(){
			this.deposit = this.$route.params.deposit
			this.getAgreement()
		}
	}
</script>

<style scoped lang="less">
.page-content {
  	padding-top: 44px;
	.flexBox{
		display: flex;
		display: -webkit-flex;
		justify-content: space-between;
		align-items: center;
		padding: 0rem 16px;
		border-bottom: 1px solid #E4E4E4;
		img{
			display: block;
			box-sizing: content-box;
			width: .3rem;
			height: .3rem;
			padding: .25rem;
		}
	}
	.list-ios{
		margin-bottom: 0 !important;
		padding-right: 0 !important;	
		.alicenter{
			display: flex;
			display: -webkit-flex;
			align-items: center;
			justify-content: space-between;
			padding-right: .4rem;
		}
	}
	.bondIntroBox{
		background-color: #fff;
		padding: .2rem;
		.flexBox{
			padding: .2rem;
			width:95%;
			margin: 0 auto;
			text-align: center;
			border-bottom:none;
			.w4{
				width: 40%;
			}
			.w3{
				width: 30%;
			}
			p{
				display: flex;
				display: -webkit-flex;
				align-items: center;
				justify-content: center;
				img{
					display: block;
					width: .3rem;
					height: .3rem;
					padding: 0rem !important;
				}
			}
		}
	}
	.btnBar{
		width: 6rem;
		margin: 0 auto;
	}
}
.model{
	width: 100%;
	height: calc(100% - 44px);
	position: fixed;
	top: 44px;
	left: 0;
	z-index: 1000;
	.wrap{
		width: 100%;
		height: 100%;
		background-color: rgba(0,0,0,0.5);
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1001;
	}
	.content{
		width: 85%;
		padding: .6rem .4rem .3rem;
		border-radius: 5px;
		height: 70%;
		background-color: #fff;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		z-index: 1002;
		.div{
			height: 100%;
			overflow-y: scroll;
			padding-bottom: .25rem;
		}
		.close{
			display: block;
			width: .4rem;
			height: .4rem;
			position: absolute;
			right: .15rem;
			top: .15rem;
		}
		h5{
			font-size: .33rem;
			font-weight: bold;
			margin-bottom: .3rem;
			color: #333;
		}
		p{
			font-size: .26rem;
			margin: .3rem 0 !important;
		}
		.button-block{
			position: absolute;
			left: 0;
			bottom: -16px;
			width: 100%;
		}
	}
}
.ion-ios-arrow-right{
	color: #1c1c1c;position: absolute;right: .16rem;top: 50%;transform: translateY(-50%);-webkit-transform: translateY(-50%);height: auto;
}
.icon{
	font-size: .35rem !important;
}
.mt2{
	margin-top: .2rem;
}
.bgg{
	background-color: #efefef;
}
.bg7{
	background-color: #f7f7f7;
}
.bgf{
	background-color: #fff;
}
.default{
	color: #E87439;
}
</style>