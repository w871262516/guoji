<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">个人认证</span>
			</von-header>
	  		<svgs style="display: none;"></svgs>
	  		<div v-if="status==1">
	  			<img src="../../../../static/common/checkBg.png" class="stateImg"/>
	  			<p class="stateWord">审核状态</p>
	  			<div class="stateTip">
	  				<h4>正在审核中，请耐心等待后台审核！</h4>
	  			</div>
	  		</div>
	  		<div v-if="status==2">
	  			<img src="../../../../static/common/checkBg_fail.png" class="stateImg"/>
	  			<p class="stateWord">审核状态</p>
	  			<div class="stateTip">
	  				<h4>失败原因：{{reason}}</h4>
	  			</div>
				<div class="btnBar">
					<md-button class="button button-positive button-block" @click.native="applyNow">
						重新申请
					</md-button>
				</div>
	  		</div>
		</div>
	</div>
</template>

<script>
	import svgs from './components/svgs.vue'
	export default{
		name:'storeCenter',
		components:{
			svgs
		},
		data(){
			return{
				token:'',
				status:2,
				reason:''
			}
		},
		methods:{
			back(){
				this.$router.go(-1)
			},
			applyNow(){
				this.$router.push('/mine/chooseAuthentication')
			}
		},
		created(){
			this.token = localStorage.getItem('token')
			this.status = this.$store.state.applyInfo.status
			this.reason = this.$store.state.applyInfo.reason
		}
	}
</script>

<style scoped lang="less">
.page-content {
  	padding-top: 44px;
	color: #323232;
  	font-size: .23rem;
  	background-color: #fff;
	.btnBar{
		width: 6rem;
		margin: 0 auto;
	}
	.stateImg{
		display: block;
		width: 100%;
	}
	.stateWord{
		position: absolute;
		left: 0;
		top: 1.4rem;
		z-index: 1;
		text-align: center;
		color: #fff;
		font-size: .4rem;
		width: 100%;
	}
	.stateTip{
		background-color: #fff;
		height: 4rem;
		padding-top: .3rem;
		h4{
			color: #666666;
			font-size: .36rem;
			width: 100%;
			text-align: center;
			margin: 0 auto;
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