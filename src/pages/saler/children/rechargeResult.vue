<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">充值详情</span>
			</von-header>
			<div class="flexBox">
				<img src="../../../../static/saler/changeSuccess.png" class="changeSuccess" />
				<p>充值成功</p>
			</div>
			<list class="list-ios item-icon-right">
				<item>
				    <section class="alicenter">
			  		 	<span>微信充值</span>
       				</section>
				</item>
				<item>
				    <section class="alicenter">
			  		 	<span>充值金额</span>
			  		 	<span>￥20.0</span>
       				</section>
				</item>
			</list> 
			<div class="btnBar">
				<md-button class="button button-positive button-block" @click.native="changeMyPayPsd">
					完成
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
				
			}
		},
		methods:{
			back(){
				this.$router.go(-1)
			},
			to(arg){
				this.$router.push(arg)
			}
		},
		created(){
			
		}
	}
</script>

<style lang="less" scoped>
.page-content {
  	padding-top: 44px;
  	.list-ios{
  		margin: .25rem auto;
  		background-color: #fff;
  		padding-right: .15rem !important;
  		.alicenter{
  			display: flex;
  			display: -webkit-flex;
  			align-items: center;
  			justify-content: space-between;
  			width: 100%;
  		}
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
		margin: .5rem auto;
	}
}
</style>