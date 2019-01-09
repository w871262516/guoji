<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">添加身份信息</span>
			</von-header>
			
			<p class="tips">
				请设置支付密码
			</p>
  			<von-input 
			  type="password" 
			  v-model.trim="psd" 
			  placeholder="请输入支付密码"
			  label="支付密码">
			</von-input>
			
			<p class="tips">
				请填写您的真实信息
			</p>
  			<von-input 
			  type="password" 
			  v-model.trim="trueName" 
			  placeholder="请输入真实姓名"
			  label="真实姓名">
			</von-input>
			<von-input v-model="cardType"  placeholder="身份证" label="证件类型"  :disable="disable"></von-input>
  			<von-input 
			  type="password" 
			  v-model.trim="cardNum" 
			  placeholder="请输入证件号"
			  label="证件号">
			</von-input>
			<div class="btnBar">
				<md-button class="button button-positive button-block" @click.native="addMyInfo">
					添加
				</md-button>
			</div>
		</div>
	</div>
</template>

<script>
	export default{
		name:'resetPayPassword',
		data(){
			return{
				disable:true,
				psd:'',
				trueName:'',
				cardType:'身份证',
				cardNum:'' 
			}
		},
		methods:{
			back(){
				this.$router.go(-1)
			},
			to(arg){
				this.$router.push(arg)
			},
			addMyInfo(){
				
			}
		},
		created(){
			
		}
	}
</script>

<style lang="less" scoped>
.page-content {
  	padding-top: 44px;
  	.tips{
  		padding: .2rem;
  		color: #9D9C9C;
  	}
	.btnBar{
		width: 6rem;
		margin: .2rem auto;
	}
}
</style>