<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">账户管理</span>
			</von-header>
	  		<list class="list-ios item-icon-right mt30">
				<router-link :to="'/mine/accountManager/editInfo'" class="section ">
					<item class="item1">
						修改资料
       					<i class="icon ion-ios-arrow-right"></i>
					</item>
   				</router-link>
				<router-link :to="'/mine/accountManager/setPassword'" class="section">
					<item>
						设置密码
       					<i class="icon ion-ios-arrow-right"></i>
					</item>
   				</router-link>
			</list>
			<list class="list-ios item-icon-right mt30">
				<router-link :to="'/mine/salerCenter/forgetPayPassword'" class="section">
					<item>
						设置支付密码
						<i class="icon ion-ios-arrow-right"></i>
					</item>
   				</router-link>
			</list>
			<list class="list-ios item-icon-right mt30">
				<router-link :to="'/mine/accountManager/feedback'" class="section">
					<item class="item1">
							意见反馈
	       				<i class="icon ion-ios-arrow-right"></i>
					</item>
   				</router-link>
				<div class="section" @click="getAgreement">
					<item>
						服务协议
       					<i class="icon ion-ios-arrow-right"></i>
					</item>
   				</div>
			</list>
			
			<!-- <list class="list-ios item-icon-right mt30">
				<router-link :to="''" class="section">
					<item>
						评价我们
       					<i class="icon ion-ios-arrow-right"></i>
					</item>
   				</router-link>
			</list> -->
			
			<div class="btnBar">
				<md-button class="button button-positive button-block" @click.native="logout()">
					退出当前账号
				</md-button>
			</div>
			<transition name="fade" enter-active-class="animated fadeInUp faster">
				<div class="model" v-show="show">
					<div class="wrap" @click="showHideModel"></div>	
					<div class="content" v-show="show">
						<img src="../../../../static/saler/closeGray.png" class="close" @click="showHideModel">
						<div class="div">
							<!-- <h5>服务协议</h5> -->
							<div id="agreement"></div>
						</div>
						<md-button class="button button-positive button-block" @click.native="showHideModel">
							知道了
						</md-button>
					</div> 
				</div>
			</transition>
		</div>
	</div>
</template>

<script>
	export default{
		name:'accountManager',
		data(){
			return{
				show: false,
			}
		},
		methods:{
			showHideModel(){
				this.show = !this.show
			},
			back(){
				this.$router.go(-1)
			},
			logout(){
				localStorage.removeItem('mid')
				localStorage.removeItem('token')
				this.$router.push('/login')
			},
			getAgreement(){
				let that = this
				that.$axios({
					method:'get',
					url:that.GLOBAL.develop_url+'api/agreement',
					params:{
						type:'service'
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
						that.showHideModel()
					}else{
						$toast.show(res.data.msg, 1000)
					}
				})
			}
		}
	}
</script>

<style scoped lang="less">
.page-content {
  	padding-top: 44px;
  	padding-bottom: 1rem;
	color: #323232;
  	font-size: .23rem;
	.list-ios{
		font-size: .24rem;
		padding-left: 0 !important;
		padding-right: 0 !important;
		.section{
			.item1{
				position: relative;
				&:after{
					content: '';
					display: block;
					width: calc(100% - 16px);
					height: 1px;
					background-color: #e5e5e5;
					position: absolute;
					bottom: 1px;
					right: 0;
					z-index: 1000;
				}	
			}
					
		}
	}
	.mt30{
		margin-top: .3rem;
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
.ion-ios-arrow-left{
	color: #1c1c1c;position: absolute;right: .16rem;top: .18rem;height: auto;
}
.icon{
	font-size: .35rem !important;
}
</style>