<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">店铺名称</span>
			</von-header>
	  		<von-input type="text" v-model="storeName" placeholder="请输入您的店铺名称。（最多10个字）"> </von-input>
			<div class="btnBar">
				<md-button class="button button-positive button-block" @click.native="clicked()">
					确&nbsp;&nbsp;定
				</md-button>
			</div>
	  	</div>
	</div>	
</template>

<script>
	export default{
		name:'setStoreName',
		data(){
			return{
		  		storeName:''
			}
		},
		methods:{
			back(){
				this.$router.go(-1)
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
	.mt30{
		margin-top: .3rem;
	}
	.btnBar{
		width: 6rem;
		margin: 0 auto;
	}
}
</style>