<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">确认发货</span>
			</von-header>
			
			<svgs style="display: none;"></svgs>
			
			<div class="goodInfoBox">
				<div class="contentBox borderBottom">
					<div :style="{backgroundImage:'url('+orderInfo.thumb+')'}" class="goodImg"/>
					<div class="goodBox">
						<p class="goodName">{{orderInfo.title}}</p>
						<p class="gray">共1件商品，实付：￥{{orderInfo.pay_amount}}</p>
					</div>
				</div>
				<div class="line"></div>
				<div class="bottomBox borderBottom">
					<div>
						<p>订单编号：{{orderInfo.order_sn}}</p>
						<p>下单时间：{{orderInfo.c_time}}</p>
					</div>
				</div>
				<div class="bottomBox">
					<div>
						<p>用户名称：{{orderInfo.receive_name}}</p>	
						<p>收货名称：{{orderInfo.receive_name}}</p>
						<p>收货电话：{{orderInfo.mobile}}</p>
						<p>收货地址：{{orderInfo.area}} {{orderInfo.address}}</p>
					</div>
				</div>
			</div>
			
			<div class="express" v-if="!orderInfo.is_virtual">
				<p>快递公司</p>
				<div class="relativeBox">
					<p class="chooseExpress" @click="toShow">{{applyType}}</p>
					<section class="guide_item" :class="{toUp:show}">
			        	<svg class="icon_style">
			                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#toDown'"></use>
			          </svg>
			       </section>
				</div>
				<input type="text" v-model.trim="expressNum" placeholder="请输入快递单号"/>
				<textarea rows="8" v-model="expressContents" placeholder="发货留言"></textarea>
			</div>
			
			<div class="btnBar">
				<md-button class="button button-positive button-block" @click.native="sureSendThisGood">
					确认发货
				</md-button>
			</div>
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
	import svgs from '../../../components/common/svgs.vue'
	export default{
		name:'setStoreName',
		components:{
			vuePickers,
			svgs
		},
		data(){
			return{
				toUp:false,//综合排序的小图标旋转样式
				orderInfo:{},
				expressNum:'',//快递单号
				expressId:'',//快递ID
				expressPy:'',//快递拼音名称？后台要的不知道为何
				expressContents:'',//卖家留言
				show: false,
				columns: 1,
				defaultData: [
			        {
			          text: "",
			          value: 0
			        }
			    ],
			    pickData: {
			        // 第一列的数据结构
			        data1: [
			          {
			            text: "",
			            value: 0
			          },
			        ]
			    },
		  		applyType:'请选择快递公司'
			}
		},
		methods:{
			back(){
				this.$router.go(-1)
			},
	        close() {
		      this.show = false
		    },
		    confirmFn(val) {
		      this.show = false
		      this.applyType = val.select1.text
		      this.defaultData = [val.select1]
		      this.expressId = val.select1.id
		      this.expressPy = val.select1.byname
		    },
		    toShow() {
		      this.show = true
		    },
		    getExpressCompany(){//获取快递公司列表
		    	let that = this
				that.$axios({
					method:'post',
					url:that.GLOBAL.develop_url+'api/express_list',
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
							that.pickData.data1 = res.data.data
							that.pickData.data1.forEach(item=>{
								item.value = item.id
								item.text = item.name
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
		   	},
		   	getOrderInfo(){ //获取订单信息
				let that = this
				that.$axios({
					method:'post',
					url:that.GLOBAL.develop_url+'api/send_goods',
					data:{
						token:localStorage.getItem('token'),
						order_sn:that.$route.params.orderId
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
							that.orderInfo = res.data.data.order_info
							that.orderInfo.c_time = that.timeFormer(that.orderInfo.c_time)
							break;
						case "404":
							$toast.show(res.data.msg, 1000).then(() => {
								that.$router.push('/login')
							})
							break;
						default:
							$toast.show(res.data.msg, 1000)
							break;
					}
				})
			},
			sureSendThisGood(){//确认发货按钮
				if(this.expressNum == ''){
					$toast.show('请输入快递单号！',1000)
					return
				}
				let that = this
				that.$axios({
					method:'post',
					url:that.GLOBAL.develop_url+'api/confirm_send_goods',
					data:{
						token:localStorage.getItem('token'),
						order_sn:that.$route.params.orderId,
						express_id:that.expressId,
						express_name:that.applyType,
						express_num:that.expressNum,
						express_pinyin:that.expressPy,
						express_price:0,//忽视
						express_message:that.expressContents
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
						$toast.show(res.data.msg, 1000).then(() => {
							that.$router.push({
								path:'/mine/salerCenter/salerOrders'
							})
						})
					}else if(res.data.code == 404||res.data.code == 400){
						$toast.show(res.data.msg, 1000).then(() => {
							that.$router.push('/login')
						})
					}
				})
			}
		},
		created(){
			this.getOrderInfo()
			this.getExpressCompany()
		}
	}
</script>

<style scoped lang="less">
.page-content {
  	padding-top: calc(44px + .2rem);
  	.goodInfoBox{
  		width: 95%;
  		margin:0 auto;
  		border-radius: 8px;
  		background-color: #fff;
  		.contentBox{
  			width: 100%;
			padding: .3rem .2rem;
			display: flex;
			display: -webkit-flex;
			align-items:center;
			.goodImg{
				width: 1.35rem;
				height: 1.35rem;
				margin-right: .15rem !important;
  				background-size: cover;
  				background-repeat: no-repeat;
  				background-position: center center;
			}
			.goodBox{
				width:calc(100% - 1.65rem);
				display: flex;
				display: -webkit-flex;
				flex-direction: column;
				height: 1.25rem;
				.goodName{
					width: 100%;
					word-break: break-all;
				}
			}
		}
		.bottomBox{
			padding: .3rem .2rem;
			display: flex;
			display: -webkit-flex;
			justify-content: space-between;
			align-items: center;
			div{
				p{
					color:#484848 !important;
					margin-bottom: .2rem !important;
					&:last-child{
						margin-bottom: 0 !important;
					}
				}
			}
		}
  	}
	.express{
  		width: 95%;
  		margin:0 auto;
  		p{
  			margin: .3rem 0 !important;
  		}
  		.relativeBox{
  			position: relative;
  			section{
  				position: absolute;
  				top: 0;
  				left: calc(60% - .5rem);
  			}
			.toUp{
				transform: rotate(180deg);
				-webkit-transform: rotate(180deg);
			}
  		}
  		.chooseExpress{
  			width: 60%;
  			padding: .15rem;
  			align-items: center;
  			background-color: #fff;
  			border-radius: 8px;
  		}
		input{
			width: 100%;
			border-radius: 8px;
			padding-left: .2rem;
		}
		textarea{
  			margin: .3rem auto !important;
			width: 100%;
			padding: .2rem;
			border-radius: 8px;
		}
	}
	.btnBar{
		width: 6rem;
		margin: .5rem auto;
	}
}
.gray{
	color:#484848 !important;
}
.borderBottom{
	border-bottom: 1px solid #e5e5e5;
}

section{
	display: flex;
	display: -webkit-flex;
	align-items: center;
}
.guide_item{
	height: 100%;
	.icon_style{
		display: inline-block;
		width: .32rem;
		height: .3rem;
	}
}
.default{
	color: #E87439 !important;	
}
</style>