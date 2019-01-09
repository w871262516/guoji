<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">申请提现</span>
			</von-header>
	  		<list class="list-ios item-icon-right">
				<item class="item1">
					<div class="typeBox">
						<span>
							金额 (元) 
						</span>
						<input type="number" v-model="cash" placeholder="请输入提现金额"/>
					</div>
				</item>
			</list>
			<card-list :bankCardsLists="bankCardsLists" url='' @getCardId="getCardId" v-if="bankCardsLists.length"></card-list>
			<!-- <von-radio :options="cardsListInfo" v-model="chooseCard" theme="positive"></von-radio> -->
			<list class="list-ios item-icon-right mt2">
				<item @click.native="to('/mine/salerCenter/addBankCard')">
				    <section class="alicenter">
				  		添加银行卡
       				</section>
       				<i class="icon ion-ios-arrow-right"></i>
				</item>
			</list>
			<div class="btnBar">
				<md-button class="button button-positive button-block" @click.native="applyNow">
					提&nbsp;&nbsp;现
				</md-button>
			</div>
			
			<!--输入密码弹窗-->
			<div class="model" v-show="boardShow">
				<div class="modelBg"></div>
				<div class="wrap1">
					<p>请输入支付密码{{cardsListInfo[chooseCard]}}</p>
					<div class="inputBox" ref='inputBox'>
						<div v-for="i in inputBox">
							<span>{{i}}</span>
						</div>
					</div>
					<div class="inputBoard">
						<div class="board"  v-for="i in board" @click="inputPsd(i)">{{i}}</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import cardList from '../../../saler/components/cardList.vue'
	export default{
		name:'addAccount',
		components:{
			cardList
		},
		data(){
			return{
				cash:'',
				bankCardsLists:[],
				cardsListInfo:[],
				boardShow:false,
				inputBox:['','','','','',''],
				board:[1,2,3,4,5,6,7,8,9,'取消',0,'delete'],
				myPsd:[],
				chooseCard:0,
				member_type:this.$route.query.member_type,
				withdraw_type:this.$route.query.withdraw_type,
				cardId:''
			}
		},
		watch:{
			myPsd(val){ //支付密码检测
				let len = val.length-1
				for(let j=0;j<6;j++){
					if(j<=len){
						this.inputBox[j] = '*'
						this.$refs.inputBox.childNodes[j].childNodes[0].innerHTML = '*'
					}else{
						this.inputBox[j] = ''
						this.$refs.inputBox.childNodes[j].childNodes[0].innerHTML = ''
					}
				}
				if(this.myPsd.length == 6){
					this.payPsd = this.myPsd.join("")
					this.boardShow = !this.boardShow
					
					this.withdraw()
				}
			}
		},
		created(){
			this.getBankCards()
		},
		methods:{
			back(){
				this.$router.go(-1)
			},
			getCardId(id){
				this.cardId = id
			},
			applyNow(){
				if(this.cash == ''){
					$toast.show('请输入提现金额', 1000).then(() => {})
					return
				}else if(this.cardId==''){
					$toast.show('请选择提现账户', 1000)
				}else{
					this.toggleBoard()
				}
			},
			withdraw(){
				let that = this
				var data={
					token:localStorage.getItem('token'),
					amount:that.cash,
					member_type:that.member_type,		//类型 1 个人提现 2商家提现
					withdraw_type:that.withdraw_type,	//	类型 1 余额提现 2保证金提现
					bank_id:that.cardId,			//	银行卡id
					pay_password:that.payPsd	
				}
				that.$axios({
					method:'post',
					url:that.GLOBAL.develop_url+'api/hompage/withdraw_deposit',
					data:data,
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
						$toast.show(res.data.msg, 1000).then(() => {
							that.$router.go(-1)
						})
					}else if(res.data.code == 404){
						$toast.show(res.data.msg, 1000).then(() => {
							that.$router.push('/login')
						})
					}else{
						that.myPsd =[]
						$toast.show(res.data.msg, 1000)
					}
				})
			},
			getBankCards(){ //获取银行卡列表
				if(localStorage.getItem('token')==null || localStorage.getItem('mid')==null){this.$router.push('/login')}
				let that = this
				that.$axios({
					method:'post',
					url:that.GLOBAL.develop_url+'api/business_bank_list',
					data:{
						token:localStorage.getItem('token')
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
					switch (res.data.code){
						case "200":	
							that.bankCardsLists = res.data.data
							that.bankCardsLists.forEach((item)=>{
								item.cardLast4 = item.bankcard.substring(item.bankcard.length-4)
								that.cardsListInfo.push(item.bankname+"("+item.cardLast4+")")
							})
							break;
						case "400":
							$toast.show('获取信息失败，请重新登录！', 1000).then(() => {
								that.$router.push('/login')
							})
						default:
							break;
					}
					if(res.data.code == 404){
						$toast.show(res.data.msg, 1000).then(() => {
							that.$router.push('/login')
						})
					}
				})
			},
			toggleBoard(){
				this.boardShow = !this.boardShow
			},
			inputPsd(i){//弹窗密码面板
				if(i !="取消" && i != "delete"){
					this.myPsd.push(i)
				}else if(i == "delete"){
					this.myPsd.pop()
					this.inputBox.pop()
				}else if(i=="取消"){
					this.myPsd =[]
					this.toggleBoard()	
				}
			},
			to(arg){
				this.$router.push(arg)
			},
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
			font-size: .27rem;
			line-height: .4rem;
			.typeBox{
				display: flex;
				display: -webkit-flex;
				justify-content: space-between;
				align-items: center;
				input{
					width:2.1rem;
					height: auto !important;
					text-align: right;
					font-size: .27rem;
					margin: 0 .4rem;
				}
			}
		}
	}
	.btnBar{
		width: 6rem;
		margin: 0 auto;
	}
	.model{
		position: fixed;
		height:68%;
		width: 100%;
		bottom: 0;
		left: 0;
		z-index: 10;
		.modelBg{
			width: 100%;
			height:100%;
			position: absolute;
			bottom: 0;
			left: 0;
			background-color: #F2F2F2;
			border-top: 1px solid #D9D9D9;;
		}
		.wrap1{
			height:100%;
			width: 100%;
			position: absolute;
			bottom: 0;
			left: 0;;
			z-index: 10;
			color: #000;
			p{
				font-size: .26rem;
				text-align: center;
				margin-top: .25rem !important;
			}
			.inputBox{
				width: calc(4.8rem + 1px);
				margin: .25rem auto;
				display: flex;
				display: -webkit-flex;
				justify-content: center;
				align-items: center;
				flex-direction: row;
				border-right: 1px solid #D9D9D9;
				span{
					display: flex;
					display: -webkit-flex;
					justify-content: center;
					align-items: center;
					width: 0.8rem;
					height: 0.8rem;
					font-size: .26rem;
					line-height: .8rem;
					background-color: #fff;
					border-top: 1px solid #D9D9D9;
					border-left: 1px solid #D9D9D9;
					border-bottom: 1px solid #D9D9D9;
				}
			}
			.inputBoard{
				display: flex;
				display: -webkit-flex;
				flex-direction: row;
				flex-wrap: wrap;
				width: 100%;
				height: calc(100% - 2rem);
				position: absolute;
				bottom: 0;
				left: 0;
				.board{
					height: 25%;
					width: 33.333%;
					display: flex;
					display: -webkit-flex;
					justify-content: center;
					align-items: center;
					background-color: #fff;
					border: 1px solid #D9D9D9;
					border-right-color: transparent;
					border-bottom-color: transparent;
					&:nth-child(10){
						background-color: #F2F2F2;
					}
					&:nth-child(12){
						background-color: #F2F2F2;
					}
				}
			}
		}
	}
}

.mt2{
	margin-top: .2rem;
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