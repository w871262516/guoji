<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">余额充值</span>
			</von-header>
			<list class="list-ios item-icon-right">
				<item>
					<p>充值金额</p>
					<div class="flexBox">
						<label>￥</label>
						<input type="text" v-model="user" />
					</div>
				</item>
				<item>
					<div class="flexBox">
						<img src="../../../../static/common/wechat.png" class="iconImg"/>
						<div class="columBox">
				    		<p>中国工商银行(5596)</p>
				    		<span>单笔最高限额50000元</span>
				    	</div>
				    	<label class="checkBox">
				    		<i class="isChecked"></i>
				    	</label>
					</div>
				</item>
				<item>
					<div class="flexBox">
						<img src="../../../../static/common/alipayIcon.png" class="iconImg"/>
						<div class="columBox">
				    		<p>中国工商银行(5596)</p>
				    		<span>单笔最高限额50000元</span>
				    	</div>
				    	<label class="checkBox">
				    		<i class="isChecked"></i>
				    	</label>
					</div>
				</item>
			</list>	
			
			<div class="btnBar">
				<md-button class="button button-balanced button-block" @click.native="to('/mine/salerCenter/rechargeResult')">
					安全支付
				</md-button>
			</div>
		</div>
	</div>
</template>

<script>
	export default{
		name:'balanceRecharge',
		data(){
			return{
		  		user:'',
		  		cardNum:'',
		  		cardType:'',
		  		phone:''
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
  	padding-top: 44px;
  	.list-ios{
  		width: 95%;
  		margin: .25rem auto;
  		background-color: #fff;
  		padding-right: .15rem !important;
  		.item{
  			.flexBox{
  				margin-top: .15rem;
  				position: relative;
  				display: flex;
  				display: -webkit-flex;
  				justify-content: flex-start;
  				align-items: center;
  				label{
  					font-size: .4rem;
  					font-weight: bold;
  				}
  				input{
  					padding: .5rem .2rem;
  					font-size: .6rem;
  				}
  				img{
					display: block;
					width: .65rem;
					height: .65rem;
					margin-right: .25rem;
				}
  				.columBox{
					display: flex;
					display: -webkit-flex;
					justify-content: flex-start;
					flex-direction: column;
					p{
					}
					span{
						color: #9C9A9A;
						margin-top: .1rem;
					}
				}
				.checkBox{
					width: .3rem;
					height: .3rem;
					background-color: #fff;
					border: 1px solid #E87439;
					border-radius: 50%;
					position: absolute;
					right: 0rem;
					top: 50%;
					transform: translateY(-50%);
					.isChecked{
						width: .15rem;
						height: .15rem;
						border-radius: 50%;
						background-color: #E87439;
						position: absolute;
						left: 50%;
						top: 50%;
						transform: translate(-50%,-50%);
					}
				}
  			}
  		}
  	}
  	
	.btnBar{
		width: 6rem;
		margin: .25rem auto;
	}
}
</style>