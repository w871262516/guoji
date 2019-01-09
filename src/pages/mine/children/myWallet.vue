<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">我的钱包</span>
			  <button class="button button-icon" slot="right" @click="toRecharge" style="font-size: .28rem;color: #757373;">充值</button>
			</von-header>
	  		<tabs :tab-items="tabs" :tab-index="tabIndex" :on-tab-click="onTabClick" top="44px"></tabs>
			<quick-loadmore :top-method="onRefresh" ref="vueLoad" 
                    :top-status-change="handleStatusChange" 
                    :bottom-method="onInfinite" 
                    :bottom-status-change="handleBottomStatusChange" 
                    :disable-top="disableTop" :disable-bottom="disableBottom" >
				<list class="list-ios" v-show="tabIndex < 3" v-for="item in typeDatas" :key="item.id">
					<item class="myItem">
						<div class="flexBox">
							<p>{{item.marks}}</p>
							<div>
								<p class="time">{{item.c_time}}</p>
								<span>
									{{item.addOrSub}}{{item.amounts}}
								</span>
							</div>
						</div>
					</item>
				</list>
				<list class="list-ios" v-show="tabIndex == 3" v-for="item in bankCardsLists">
					<item>
						<div class="cardDiv">
							<div class="cardBox">
								<p>
									<img src="../../../../static/common/wechat.png" class="cardType" />
									<span>微信支付</span>
								</p>
								<span class="success">正常</span>
							</div>
							<p class="default userName">{{item.username}}</p>
							<p class="default userCard">**** ***** ****{{item.cardLast5}}</p>
							<p class="borderLine"></p>
							<div class="setDefault">
								<span>添加日期：2018-06-28</span>
								<div>
									<span class="default" v-if="item.is_default">
										默认
									</span>
									<span class="default">
										删除
									</span>
								</div>
							</div>
						</div>
					</item>
				</list>
			</quick-loadmore>
			<!--账户明细底部-->
			<div class="bottomBar bgfff" v-show="tabIndex==0">
				<section class="section1">
					<div>
						<p>
							余额
							<span class="default">￥{{amountData.total_amount}}</span>
						</p>
						<p>
							可用余额
							<span class="default">￥{{amountData.user_money}}</span>
						</p>
					</div>
					<p>
						冻结余额
						<span class="default">￥{{amountData.frozen_money}}</span>
					</p>
				</section>
			</div>
			<!--余额提现底部-->
			<div class="bottomBar bgfff" v-show="tabIndex==1">
				<section class="section2">
					<div>
						<p>
							提现中：
							<span class="default">￥{{amountData.pending_withdraw_amount}}</span>
						</p>
						<p>
							可提现：
							<span class="default">￥{{amountData.able_withdraw_amount}}</span>
						</p>
					</div>
					<md-button class="button button-positive button-block" @click.native="applyCash">
						申请提现
					</md-button>
				</section>
			</div>
			<!--保证金底部-->
			<div class="bottomBar bgfff" v-show="tabIndex==2">
				<section class="section2">
					<div>
						<p>
							可提现金额：
							<span class="default">￥{{amountData.wallet_pledge}}</span>
						</p>
						<p>
							已冻结金额：
							<span class="default">￥{{amountData.wallet_pledge_freeze}}</span>
						</p>
					</div>
					<md-button class="button button-positive button-block" @click.native="applyCash">
						申请提现
					</md-button>
				</section>
			</div>
			<!--提现账户-->
			<div class="bottomBar " v-show="tabIndex==3">
				<section>
					<md-button class="button button-positive button-block" @click.native="addAccount">
						添加账户
					</md-button>
				</section>
			</div>
  		</div>
  	</div>
</template>

<script>
	import cardList from '../../saler/components/cardList'
	export default{
		name:'myWallet',
		components:{
			cardList
		},
		data(){
			return{
				flag:'fresh',
		        disableTop:false,//是否禁止下拉，默认允许
		        disableBottom:false,
				loadFinish:true,
				type:1,
				page:1,
				title:'我的钱包',
				tabs:[
					'账户明细',
					'余额',
					'保证金',
					'提现账户'
				],
				tabIndex:0,
				birthday:'',
				typeDatas:[],
				amountData:{},
				bankCardsLists:[]
			}
		},
		watch:{
			tabIndex(val){ //切换tab时设置this.page = 1
				this.allDatas = []
				switch (val){
					case 0:
						this.type = 1//1账户明细
						this.page = 1
						this.flag == 'fresh'
						this.getTypeDatas()
						break;
					case 1:
						this.type = 2//2余额明细
						this.page = 1
						this.flag == 'fresh'
						this.getTypeDatas()
						break;
					case 2:
						this.type = 3//3保证金明细
						this.page = 1
						this.flag == 'fresh'
						this.getTypeDatas()
						break;
					case 3:
						this.getBankCards()
						break;
					default:
						break;
				}
			},
			loadFinish(val){
				this.loadFinish = val
			},
		},
		created(){
			this.page = 1
			this.token = localStorage.getItem('token')
			this.getTypeDatas()
		},
		mounted(){
			this.$previewRefresh() //不知道为什么要加这一句 不加的话有的会点不出来  可能是异步加载图片的原因
		},
		methods:{
			back(){
				this.$router.go(-1)
			},
			onTabClick(index){
				
				this.typeDatas = []
				this.tabIndex = index
			},
			handleStatusChange(status) {
		      // status监控下拉刷新状态--等待/下拉/到达阙值/刷新
		      const TOPSTATUS = {
		        wait: "wait",
		        pulling: "pulling",
		        limit: "limit",
		        loading: "loading"
		      }; 
		    },
		    handleBottomStatusChange(status) {
		      // status监控上拉加载状态--等待/加载/没有更多数据  
		      const BOTTOMSTATUS = {
		        wait: "wait",
		        loading: "loading",
		        nodata: "nodata"
		      };
		    },
	    	onRefresh(){ //下拉刷新  		
	    		this.disableBottom = true
    			this.flag = 'fresh'
	    		this.page = 1 //第一页
				this.getTypeDatas()
	    	},
	    	onInfinite(){//上拉加载
	    		this.disableTop = true
				this.flag = 'infinite'
				this.page++ //下一页
				this.getTypeDatas()
	    	},
			getTypeDatas(){//获取不同type详细信息
				if(!this.loadFinish){
					return 
				}
	    		let that = this
	    		that.$axios({
	    			method:'post',
	    			url:that.GLOBAL.develop_url+'/api/hompage/my_wallet',
	    			data:{
	    				token:that.token,
						page:that.page, //评论的页数
						type:that.type,//tab类型
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
					if(res.data.code == "200"){
						that.amountData = res.data.data.wallet_info
						if(that.flag == 'fresh'){
							that.typeDatas = []
							that.$refs.vueLoad.onTopLoaded()
						}
						if(res.data.data.money_log.length == 0){
							that.disableBottom = true
							that.$refs.vueLoad.onBottomLoaded(false)
						}else{	
							that.disableBottom = false
							that.$refs.vueLoad.onBottomLoaded(true)
							res.data.data.money_log.forEach((item) => {
								item.c_time = that.timeFormer(item.c_time);
								if(item.type == 1||item.type == 2||item.type == 6||item.type == 9){	
									item.addOrSub = "+"
								}else{
									item.addOrSub = "-"
								}
								that.typeDatas.push(item)
							});
						}
					}else{
						$toast.show(res.data.msg)
					}
				})
				that.loadFinish = true
			},
			toRecharge(){
				this.$router.push('/mine/recharge')
			},
			applyCash(){
				let that = this;
				this.$router.push({
					path:'/mine/myWallet/applyCash',
					query:{
						member_type:1,
						withdraw_type:that.type-1
					}
				})
			},
			addAccount(){
				this.$router.push('/mine/salerCenter/addBankCard')
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
								console.log('>>>>>>>>>>>>>>',item.bankcard.substring(item.bankcard.length-5))
								item.cardLast5 = item.bankcard.substring(item.bankcard.length-5)
							})
							break;
						case "400":
							$toast.show('获取信息失败，请重新登录！', 1000).then(() => {
								that.$router.push('/login')
							})
						default:
							break;
					}
				})
			}
		}
	}
</script>

<style lang="less"	scoped>
.page-content {
  	padding-top: 93px;
  	padding-bottom: 1.51rem;
	color: #323232;
  	font-size: .23rem;
  	.timeBar{
		display: flex;
		display: -webkit-flex;
		align-items: center;
		justify-content: space-between;
  		p{
  			display: flex;
  			display: -webkit-flex;
			align-items: center;
			justify-content: space-between;
			font-size: .2rem;
			padding: .15rem;
  			span{
  				i{
  					color: #b8b8b8;
  				}
  			}
  			&:first-child{
  				width: 1.85rem;
  			}
  			
  		}
  		.guide_item{
			display: flex;
			display: -webkit-flex;
			align-items: center;
			.icon_style{
				display: inline-block;
				width: .25rem;
				height: .25rem;
			}
		}
  	}
  	.list-ios{
  		padding-right: 0 !important;
  		.myItem{
  			// padding:.25rem .2rem .25rem 0 !important;
  			.flexBox{
	  			display: flex;
		  		display: -webkit-flex;
		  		justify-content: space-between;
		  		align-items: center;
		  		position:relative;
		  		line-height: .3rem;
		  		p{
		  			font-size: .28rem;
		  			color: #323232;
		  			span{
		  				font-size: .3rem;
		  				color: #000;
		  			}
		  		}
		  		div{
		  			display: flex;
			  		display: -webkit-flex;
			  		flex-direction: column;
			  		align-items: flex-end;
			  		p{
			  			color: #9D9C9C;
		  				font-size: .22rem;
			  		}
			  		span{
		  				color: #323232;
			  			font-size: .26rem;
			  		}
		  		}
  			}
  		}
  	}
	.item{
		// padding:.2rem .25rem .2rem 0 !important;
		}
  	.cardDiv{
  		font-size: .24rem;
  		.cardBox{
  			width: 100%;
  			display: flex;
	  		display: -webkit-flex;
	  		justify-content: space-between;
	  		align-items: center;
	  		p{
	  			display: flex;
		  		display: -webkit-flex;
		  		justify-content: flex-start;
		  		align-items: center;
		  		img{
		  			display: block;
		  			width: .6rem;
		  			height: .6rem;
		  			margin-right: .15rem;
		  		}
	  		}
		}
		.borderLine{
			height: 1px;
			width: 100%;
			background-color: #ededed;
		}
		p{
	  		margin-bottom: .15rem !important;
		}
		.setDefault{
			display: flex;
			display: -webkit-flex;
			justify-content: space-between;
	  		margin-top: .25rem !important;
			div{
				display: flex;
				display: -webkit-flex;
				justify-content: space-between;
				span{
					&:first-child{
						margin-right: .45rem;
					}
				}
			}
		}
  	}
  	.bottomBar{
  		width: 100%;
  		height: 1.5rem;
  		padding: .2rem;
  		position: fixed;
  		// backface-visibility: ;
  		bottom: 0;
  		left: 0;
  		font-size: .26rem;
  		.section1{
  			height: 100%;
  			display: flex;
  			display: -webkit-flex;
  			flex-direction: column;
  			justify-content: space-around;
  			div{
	  			display: flex;
	  			display: -webkit-flex;
	  			p{
	  				margin-right: .25rem !important;
	  			}
  			}
  		}
  		.section2{
  			height: 100%;
  			display: flex;
  			display: -webkit-flex;
  			justify-content: space-between;
  			align-items: center;
  		}
  	}
}
.bgfff{
	background-color: #fff !important;
}
.default{
	color: #E87439 !important;
}
.success{
	color: #49a151 !important;
}
.ml20{
	margin-left: .2rem;
}
</style>