<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">添加身份信息</span>
			</von-header>
			<div v-if="beforeSuccess">
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
			<div v-else>
				<div class="flexBox">
					<img src="../../../../static/saler/changeSuccess.png" class="changeSuccess" />
					<p>修改成功</p>
				</div>
				<div class="btnBar">
					<md-button class="button button-positive button-block" @click.native="changeMyPayPsd">
						完成
					</md-button>
				</div>
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
				trueName:'',
				cardType:'身份证',
				cardNum:'',
				beforeSuccess:true
			}
		},
		methods:{
			back(){
				this.$router.go(-1)
			},
			to(arg){
				this.$router.push(arg)
			},
			changeMyInfo(){
				
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
		padding: .2rem .2rem 0 .2rem;
		color: #9D9C9C;
  	}
  	.flexBox{
  		height: 2.5rem;
  		display: flex;
  		display: -webkit-flex;
  		flex-direction: column;
  		justify-content: center;
  		align-items: center;
  		img{
  			display: block;
  			height: 1.1rem;
  			width: 1.1rem;
  		}
  		p{
  			font-size: .36rem;
  			margin: .2rem auto 0 !important;
  		}
  	}
	.btnBar{
		width: 6rem;
		margin: .2rem auto;
	}
}
</style>