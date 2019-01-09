<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">充值</span>
			  <button class="button button-icon" slot="right" @click="showPopup" style="font-size: .28rem;color: #757373;">使用规则</button>
			</von-header>
	  		<p class="tips">请选择充值类型</p>
	  		<list class="list-ios item-icon-right">
				<item class="item1">
					<div @click="toShow" class="typeBox">
						<span>充值类型</span>
						<span>{{applyType}}</span>
					</div>
   					<i class="icon ion-ios-arrow-right"></i>
				</item>
			</list>
	  		<p class="tips">请选择充值金额（元）</p>
	  		<div class="chooseDiv">
	  			<ul>
	  				<li :class="{isActive:isActive=='50'}" @click="setMoney('50')">50</li>
	  				<li :class="{isActive:isActive=='100'}" @click="setMoney('100')">100</li>
	  				<li :class="{isActive:isActive=='200'}" @click="setMoney('200')">200</li>
	  			</ul>
	  			<ul>
	  				<li :class="{isActive:isActive=='300'}" @click="setMoney('300')">300</li>
	  				<li :class="{isActive:isActive=='500'}" @click="setMoney('500')">500</li>
	  				<li :class="{isActive:isActive == rechargeMoney}" @click="setMoney('0')">
	  					<input type="text" v-model="rechargeMoney" @keyup="setMoney(rechargeMoney)" placeholder="请输入金额"/>
	  				</li>
	  			</ul>
	  		</div>
	  		
	  		<p class="tips">请选择支付方式</p>
	  		
	  		<recharge-list @payType="choosePayType"></recharge-list>
	  		
	  		<p class="tips">
	  			*新用户专享 送50赠币
	  			<span class="default total">
	  				实付: ￥{{finalMoney}}
	  				<!-- 实付: ￥0.01 -->
	  			</span>
	  		</p>
	  		
			<div class="btnBar">
				<md-button class="button button-positive button-block" @click.native="payNow">
					立即支付
				</md-button>
			</div>
			<div id='applyForm' style="display:none"></div>
		</div>
		
		 <vue-pickers
	      :show="show"
 		  :defaultData="defaultData"
  		  :selectData="pickData"
	      @cancel="close"
	      @confirm="confirmFn"></vue-pickers>
			
	</div>
</template>

<script>
	import vuePickers from 'vue-pickers'
	import rechargeList from '../components/rechargeList.vue'
	export default{
		name:'recharge',
		components:{
			rechargeList,
			vuePickers
		},
		data(){
			return{
				rechargeMoney:'',
				finalMoney:50,
				isActive:'50',
				show: false,
				columns: 1,
				defaultData: [
			        {
			          text: "微信钱包",
			          value: 0
			        }
			    ],
			    pickData: {
			        // 第一列的数据结构
			        data1: [
			          {
			            text: "余额",
			            value: 0
			          },
			          {
			            text: "保证金",
			            value: 1
			          }
			        ]
			    },
				  applyType:'请选择',
				  pay_id:'',
				  order_type:0
			}
		},
		methods:{
			back(){
				this.$router.go(-1)
			},
			choosePayType(data){
				this.pay_id = data
				console.log('>>>>>>>>>',data);
				
			},
			payNow(){
				if(this.order_type){
					var data = {
						token:localStorage.getItem('token'),
						pay_id:this.pay_id || '1',	//支付方式（1-微信 2-支付宝 3-连连）
						trade_type:'0',   //支付类型(H5值为0)   
						order_id:'0',  //订单id、活动id(像充值类的值为0)
						// amount:'0.01',
						amount:this.finalMoney,
						order_type:this.order_type   //amount-充值余额, business_deposit-商家充值保证金, member_deposit-个人充值保证金,pay_order-支付订单
					}
					this.payMoney(data,'/mine/myWallet',this.payCall)
				}else{
					$toast.show('请选择充值类型')
					this.show = true;
				}
			},
			payCall(res){
				document.getElementById('applyForm').innerHTML = res;
				this.$nextTick(()=>{
					document.forms[0].submit()
				})
				console.log(">>>>>>>>>>>>>>>",res);
				
			},
	        close() {
		      this.show = false
		    },
		    confirmFn(val) {
		    	console.log(val)
		      this.show = false
			  this.applyType = val.select1.text
			  if(val.select1.value){
					this.order_type = 'business_deposit'//此处还要判断是商家保证金还是个人
				}else{
					this.order_type = 'amount'//余额
				}
		      this.defaultData = [val.select1]
		    },
		    toShow() {
		      this.show = true
		    },
			setMoney(a){
				this.isActive = a
				this.finalMoney = a
				// this.finalMoney = parseInt(a) || 0
			},
			showPopup() {
		        let options = {
		          effect: 'scale',
		          title: '使用规则',
		          buttons: [
		            {text: '好的'}
		          ]
		        }
		
		        let popup = $popup.fromTemplate('<p style="font-size:.22rem;line-height:.5rem;">1.商家券仅在拍拍国际商城使用</br>2.本商城兑换拍币，参与竞拍</br>3.在本商城低价购买海量商品</p>', options)
		
		        popup.show().then((buttonIndex) => {
		          	console.log(buttonIndex)
		        })
		     }
		}
	}
</script>

<style scoped lang="less">
.page-content {
  	padding-top: 44px;
	color: #1C1C1C !important;
	.tips{
		padding: .2rem;
		font-size: .28rem;
		position: relative;	
		.total{
			font-size: .3rem;
			position: absolute;
			right: .2rem;
			top: 50%;
			transform: translateY(-50%);
			-webkit-transform: translateY(-50%);
		}
	}
	
	.list-ios{
		padding-right: 0 !important;
		margin-bottom: .2rem !important;
		.item1{
			padding-right: .65rem;
			font-size: .27rem;
			line-height: .4rem;
			.typeBox{
				display: flex;
				display: -webkit-flex;
				justify-content: space-between;
				align-items: center;
				.short{
					display: inline-block;
					border: none;
					width:2.2rem;
					input{
						width:2.2rem;
						height: auto !important;
						text-align: right;
						font-size: .27rem;
					}
				}
			}
		}
	}
	.chooseDiv{
		padding: .38rem .25rem;
		background-color: #fff;
		ul{
			display: flex;
			display: -webkit-flex;
			justify-content: space-between;
			&:first-child{margin-bottom: .38rem;}
			li{
				border: 1px solid #8a8989;
				width: 1.82rem;
				height: .82rem;
				line-height: .82rem;
				font-size: .32rem;
				color: #323232;
				border-radius: 10px;
				display: flex;
				display: -webkit-flex;
				justify-content: center;
				align-items: center;
				input{
					width: 90%;
					margin: 0 auto;
					text-align: center;
					color: #E87439 !important;
				}
			}
		}
	}
	.btnBar{
		width: 6rem;
		margin: 0 auto;
	}
}
.default{
	color: #E87439 !important;
}
.isActive{
	border-color: #E87439 !important;
	color: #E87439 !important;
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