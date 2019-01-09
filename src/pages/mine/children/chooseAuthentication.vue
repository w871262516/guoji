<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">商家入驻</span>
			</von-header>
	  		<div class="flexBox">
	  			<div class="columBox">
	  				<img src="../../../../static/saler/personA.png"/>
	  				<span>个人实名认证</span>
	  				<md-button class="button button-positive button-block" @click.native="to('/mine/personAuthen')">
						申请认证
					</md-button>
	  			</div>
	  			<div class="columBox">
	  				<img src="../../../../static/saler/companyA.png"/>
	  				<span>企业实名认证</span>
	  				<md-button class="button button-positive button-block" @click.native="to('/mine/companyAuthen')">
						申请认证
					</md-button>
	  			</div>
	  		</div>
		</div>
	</div>
</template>

<script>
	export default{
		name:'storeCenter',
		components:{
		},
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
		}
	}
</script>

<style scoped lang="less">
.page-content {
 	background-color: #fff;
  	padding-top: 44px;
 	.flexBox{
 		padding: 1rem 0;
 		display: flex;
 		display: -webkit-flex;
 		flex-direction: row;
 		justify-content: center;
 		align-items: center;
 		width: 100%;
 		.columBox{
 			display: flex;
 			display: -webkit-flex;
 			flex-direction: column;
 			width: 50%;
 			justify-content: center;
 			align-items: center;
 			img{
 				display: block;
 				width: .88rem;
 				height: .88rem;
 			}
 			span{
 				margin: .25rem 0 .1rem;
 			}
 		}
 	}
}
</style>