<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">添加账户</span>
			</von-header>
	  		<list class="list-ios item-icon-right">
				<item class="item1">
					<div @click="toShow" class="typeBox">
						<span>提现类型</span>
						<span>{{applyType}}</span>
					</div>
   					<i class="icon ion-ios-arrow-right"></i>
				</item>
				<item class="item1" v-if="isWechat">
					<div class="typeBox">
						<span>微信验证</span>
						<span>请点击完成验证</span>
					</div>
   					<i class="icon ion-ios-arrow-right"></i>
				</item>
				<item class="item1">
					<div class="typeBox">
						<span>
							真实姓名
						</span>
						<span class="short">
							<input type="text" placeholder="请输入真实姓名"/>
						</span>
					</div>
				</item>
			</list>
			
			 <vue-pickers
		      :show="show"
     		  :defaultData="defaultData"
      		  :selectData="pickData"
		      @cancel="close"
		      @confirm="confirmFn"></vue-pickers>
			
			<div class="wechatTips">
				<p v-if="isWechat">
					为保证用户账户安全，请务必完成微信验证
					<br />
					并填写微信钱包所绑定银行卡的真实姓名。
				</p>
				<md-button class="button button-positive button-block" @click.native="addCardNow()">
					添&nbsp;&nbsp;加
				</md-button>
			</div>
		</div>
	</div>
</template>

<script>
	//import mPicker from 'picker/src/components/picker/index'
	import vuePickers from 'vue-pickers'
	export default{
		name:'addAccount',
		components:{
	  		//mPicker
	  		vuePickers
		},
		data(){
			return{
		  		username:'',
		  		isWechat:true,
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
			            text: "微信钱包",
			            value: 0
			          },
			          {
			            text: "支付宝",
			            value: 1
			          },
			          {
			            text: "银行卡",
			            value: 2
			          }
			        ]
			    },
		  		applyType:'请选择',
			}
		},
		methods:{
			back(){
				this.$router.go(-1)
			},
	        addCardNow(){
	        	alert('adding!!')
	        },
	        close() {
		      this.show = false
		    },
		    confirmFn(val) {
		    	console.log(val)
		      this.show = false
		      this.applyType = val.select1.text
		      this.defaultData = [val.select1]
		    },
		    toShow() {
		      this.show = true
		    }
		}
	}
</script>

<style scoped lang="less">
.page-content {
  	padding-top: 44px;
	color: #1C1C1C !important;
	.list-ios{
		padding-right: 0 !important;
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
	.wechatTips{
		width: 6rem;
		margin: .5rem auto;
		font-size: .25rem;
		display: flex;
		display: -webkit-flex;
		flex-direction: column;
		justify-content: space-between;
		p{
			width: 5.4rem;
			line-height: .45rem;
			margin: .25rem auto !important;
			color: #1c1c1c !important;
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