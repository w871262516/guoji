<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">拍币兑换</span>
			</von-header>
			<svgs style="display: none;"></svgs>
			<div class="CoinBox">
				<p class="moneyTip">账户余额&nbsp;(元)</p>
				<p class="moneyP">￥<span class="moneySpan">{{leftCoin}}</span></p>
				<p class="exchangeTip">兑换个数</p>
				<div class="inputBox">
					<section class="guide_item">
			        	<svg class="icon_style">
			                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#integration'" ></use>
			          	</svg>
			        </section>
			        <input type="text" v-model.trim="coinNums" @input="watchType($event)" placeholder="请输入兑换拍币个数" />
				</div>
			</div> 
			<section class="section">
				<md-button class="button button-positive button-block" @click.native="addCoin">
					立即兑换
				</md-button>
			</section>
		</div>
	</div>
</template>

<script>
	import svgs from './components/svgs.vue'
	export default{
		name:'exchangeCoin',
		components:{
			svgs
		},
		data(){
			return{
				leftCoin:'',
				coinNums:null
			}
		},
		methods:{
			back(){
				this.$router.go(-1)
			},
			watchType(e){//不准乱输入内容
				this.coinNums = e.target.value.replace(/[^\d]/g,'')
			},
			showPopup() {//余额不足弹窗
		        let options = {
		          effect: 'scale',
		          title: '温馨提示',
		          buttons: [
		            {text: '取消'},
		            {text: '前往充值'}
		          ]
		        }
		
		        let popup = $popup.fromTemplate('<p style="font-size:.22rem;line-height:.5rem;">账户余额不足，是否立即充值?</p>', options)
		
		        popup.show().then((buttonIndex) => {
			          if(buttonIndex == 1){
			          	this.$router.push('/mine/recharge')
			          }
			       })
			},
			addCoin(){//充值
				let that = this
				that.$axios({
	    			method:'post',
	    			url:that.GLOBAL.develop_url+'api/hompage/exchange_coin',
	    			data:{
	    				token:localStorage.getItem('token'),
	    				exchange_number:that.coinNums
	    			},
	    			transformRequest:[function(data){
	    				let ret = ''
	    				for(let it in data){
	    					ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
	    				}
	    				return ret
	    			}],
	    			xhrFields:{
	    				widthCredentials:true
	    			},
	    			crossDomain:true,
	    			header:{
	    				'Content-Type': 'application/x-www-form-urlencoded'
	    			}
	    		}).then(function(res){
					console.log(res.data)
					
	    			if(res.data.code == 200){
						that.leftCoin = that.leftCoin - that.coinNums
						that.coinNums = null
	    				$toast.show(res.data.msg, 1000)
	    			}else{
	    				$toast.show(res.data.msg, 1000)
	    				
						//that.showPopup() 弹窗提示余额不足要充值
	    			}
	    		}).catch(function(err){
	    			$toast.show('网络错误', 1000)
	    		})
			}
		},
		created(){
			this.leftCoin = this.$store.state.userInfo.allInfo.user_money
		}
	}
</script>

<style lang="less" scoped>
.page-content {
  	padding-top: 44px;
	color: #323232;
	.CoinBox{
		background-color: #fff;
		padding: .3rem;
		.moneyP{
			width: 100%;
			display: flex;
			display: -webkit-flex;
			justify-content: center;
			align-items: baseline;
			color: #E87439;
			font-weight: 400;
			margin-top: 1rem !important;
			.moneySpan{
				font-size: .55rem !important;
			}
		}
		.exchangeTip{
			margin-top: .4rem !important;
		}
		.inputBox{
			display: flex;
			display: -webkit-flex;
			width: 100%;
			justify-content: flex-start;
			align-items: center;
			.guide_item{
				display: flex;
				display: -webkit-flex;
				align-items: center;	
				.icon_style{
					display: inline-block;
					width: .3rem;
					height: .3rem;
				}
			}
			input{
				margin-left: .2rem;
			}
		}
	}
	.section{
		width: 85%;
		margin: .25rem auto; 
	}
}
</style>