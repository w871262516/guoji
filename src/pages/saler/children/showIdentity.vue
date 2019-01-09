<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">查看身份信息</span>
			</von-header>
			<div class="infoBox">
				<img class="userHead" src="http://img3.duitang.com/uploads/item/201601/20/20160120003154_iPuTw.jpeg"/>
				<div class="alicenter">
					<span class="userName">**哥</span>
					<img src="../../../../static/saler/isIdentity.png" class="isIdentity"/>
				</div>
				<span class="userCard">4654316345461316465</span>
				<img src="../../../../static/saler/isTrust.png" class="isTrust"/>
			</div>
			<div class="btnBar">
				<md-button class="button button-positive button-block" @click.native="changeMyPayPsd">
					修改身份信息
				</md-button>
			</div>
			<div class="model" v-show="boardShow">
				<div class="modelBg"></div>
				<div class="wrap">
					<p>请输入支付密码</p>
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
	export default{
		name:'showIdentity',
		data(){
			return{
				boardShow:false,
				inputBox:['','','','','',''],
				board:[1,2,3,4,5,6,7,8,9,'取消',0,'delete'],
				myPsd:[]
			}
		},
		watch:{
			myPsd(val){
				console.log(val)
				console.log(val.length)
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
					$loading.show('')
					setTimeout(()=>{
						$loading.hide()
						this.$router.push('/mine/salerCenter/changeResult')
					},2000)
					return
				}
			}
		},
		methods:{
			back(){
				this.$router.go(-1)
			},
			to(arg){
				this.$router.push(arg)
			},
			toggleBoard(){
				this.boardShow = ! this.boardShow
			},
			inputPsd(i){
				if(this.myPsd.length == 6){
					return
				}
				if(i != '取消' && i != 'delete'){
					this.myPsd.push(i)
				}else if(i == 'delete'){
					this.myPsd.pop()
				}else if(i == '取消'){
					this.myPsd =[]
					this.toggleBoard()
				}
			},
			changeMyPayPsd(){
				let options = {
		          effect: 'scale',
		          title: '提示',
		          buttons: [
		            {text: '取消'},
		            {text: '确定'}
		          ]
		        }
		        let popup = $popup.fromTemplate('<p style="margin-bottom:15px !important; text-align: center;">如需修改身份信息，请先解绑所有银行卡</p>', options)
		        popup.show().then((buttonIndex) => {
		          this.toggleBoard()
		        })
				
			}
		},
		created(){
			
		}
	}
</script>

<style lang="less" scoped>
.page-content {
  	padding-top: 44px;
  	.infoBox{
  		width: 7rem;
  		height: 3.4rem;
  		margin: 1rem auto .6rem;
  		background: url(../../../../static/saler/identyityBg.png) no-repeat top left;
  		background-size: 100% 100%;
  		position: relative;
  		color: #fff;
  		font-size: .265rem;
  		.userHead{
  			display: block;
  			width: 1.3rem;
  			height: 1.3rem;
  			border-radius: 50%;
  			position: absolute;
  			top: 0;
  			left: 50%;
  			z-index: 2;
  			transform: translate(-50%,-50%);
  		}
  		.alicenter{
  			display: flex;
  			display: -webkit-flex;
  			flex-direction: row;
			align-items: center;
			position: absolute;
			top: 1.3rem;
			left: .8rem;
			img{
  				display: block;
  				width: .87rem;
  				height: .24rem;
				margin-left: .2rem;
			}
  		}
  		.userCard{
			position: absolute;
			top: 2.1rem;
			left: .8rem;
  		}
  		.isTrust{
  			display: block;
  			width: 1.36rem;
  			height: 1.24rem;
			position: absolute;
			top: 50%;
			right: .8rem;
  			transform: translateY(-50%);
  		}
  	}
	.btnBar{
		width: 6rem;
		margin: .2rem auto;
	}
	.model{
		position: fixed;
		height:68%;
		width: 100%;
		bottom: 0;
		left: 0;
		.modelBg{
			width: 100%;
			height:100%;
			position: absolute;
			bottom: 0;
			left: 0;
			background-color: #F2F2F2;
			border-top: 1px solid #D9D9D9;
		}
		.wrap{
			height:100%;
			width: 100%;
			position: absolute;
			bottom: 0;
			left: 0;
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
</style>