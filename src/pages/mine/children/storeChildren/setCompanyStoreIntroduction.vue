<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">店铺简介</span>
			</von-header>
	  		<textarea v-model="storeIntroduction" :maxlength="100" rows="5" placeholder="请输入您的店铺简介，最多100个字">

		  	</textarea>
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
		name:'setStoreIntroduction',
		data(){
			return{
		  		storeIntroduction:''
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
	textarea{
		width: 100%;
		line-height: 1.2;
		padding: .15rem;
	}
}
</style>