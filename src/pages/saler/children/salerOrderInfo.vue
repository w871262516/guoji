<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">订单详情</span>
			</von-header>
			<svgs style="display: none;"></svgs>
			<list class="list-ios item-icon-right mt2">
				<item class="item" v-if="normalStatus == 4">
					<div class="box">
						<section class="alicenter" >
	       				 	<svgs id="#evolution" class="icon_style" iconWidth=".46rem" iconHeight=".46rem" fill="#fb6464" ></svgs>
	       				</section>
	       				<div class="boxInfo">
	       					<p>已评价</p>
	       					<p>评价时间：{{orderInfo.comment_time}}</p>
	       				</div>
					</div>
       				<i class="icon ion-ios-arrow-right"></i>
				</item>
				<item class="item" v-if="normalStatus >= 3">
					<div class="box">
						<section class="alicenter" >
	       				 	<svgs id="#getIt" class="icon_style" iconWidth=".47rem" iconHeight=".47rem" fill="#fb6464" ></svgs>
	       				</section>
	       				<div class="boxInfo">
	       					<p>已确认收货，交易完成</p>
	       					<p>收货时间：{{orderInfo.receive_time}}</p>
	       				</div>
					</div>
       				<i class="icon ion-ios-arrow-right"></i>
				</item>
				<item class="item" v-if="normalStatus >=2">
					<div class="box">
						<section class="alicenter" >
	       				 	<svgs id="#sended" class="icon_style" iconWidth=".5rem" iconHeight=".42rem" fill="#fb6464" ></svgs>
	       				</section>
	       				<div class="boxInfo">
	       					<p>已发货</p>
	       					<p>发货时间：{{orderInfo.express_time}}</p>
	       				</div>
					</div>
       				<i class="icon ion-ios-arrow-right"></i>
				</item>
				<item class="item" v-if="normalStatus >=0">
					<div class="box">
						<section class="alicenter" >
	       				 	<svgs id="#success" class="icon_style" iconWidth=".46rem" iconHeight=".46rem" fill="#fb6464" ></svgs>
	       				</section>
	       				<div class="boxInfo">
	       					<p>已竞拍成功</p>
	       					<p>成功时间：{{orderInfo.c_time}}</p>
	       				</div>
					</div>
       				<i class="icon ion-ios-arrow-right"></i>
				</item>
				<item class="item">
					<div class="box">
						<section class="alicenter" >
	       				 	<svgs id="#hammer" class="icon_style" iconWidth=".53rem" iconHeight=".45rem" fill="#fb6464" ></svgs>
	       				</section>
	       				<div class="boxInfo">
	       					<p>开始竞拍</p>
	       					<p>开始时间：{{orderInfo.start_time}}</p>
	       				</div>
					</div>
       				<i class="icon ion-ios-arrow-right"></i>
				</item>
			</list> 
			
			<div class="goodBox">
				<div class="goodHead default">
					{{statusText}}
				</div>
				<div class="goodBody">
					<div class="flexBox">
						<div :style="{backgroundImage:'url('+orderInfo.thumb+')'}" class="goodPic"></div>
						<!-- <img src="../../../../static/common/logo.png" class="goodPic"/> -->
						<div class="goodInfo">
							<p class="goodName">{{orderInfo.title}}</p>
							<p class="goodFor">共1件商品，应付：￥{{orderInfo.amount}}</p>
						</div>
					</div>
				</div>
				<div class="goodFoot">
					<p class="goodPrice">成交金额：￥{{orderInfo.pay_amount}}</p>
					<p class="goodPrice">下单时间：{{orderInfo.c_time}}</p>
				</div>
			</div>
			
			<p class="tips">订单信息</p>
			<div class="orderInfoBox">
				<von-input  type="text"  :value="buyerPhone"  label="买家电话" :disable="disable"></von-input>
				<von-input  type="text"  :value="auction_id"  label="拍品编号" :disable="disable"></von-input>
				<von-input  type="text"  :value="order_sn"  label="订单编号" :disable="disable"></von-input>
			</div>
			
			<p class="tips"  v-if="normalStatus >=2">发货信息</p>
			<div class="logisticsInfoBox"  v-if="normalStatus >=2">
				<von-input  type="text"  :value="getName"  label="收货人" :disable="disable"></von-input>
				<von-input  type="text"  :value="getPhone"  label="联系方式" :disable="disable"></von-input>
				<von-input  type="text"  :value="getAddress"  label="收货地址" :disable="disable"></von-input>
				<von-input  type="text"  :value="logistics"  label="物流信息" :disable="disable" v-if="!orderInfo.is_virtual"></von-input>
				<von-input  type="text"  :value="logisticsNum"  label="物流单号" :disable="disable" v-if="!orderInfo.is_virtual"></von-input>
			</div>
		</div>
	</div>
</template>

<script>
	import svgs from '../components/svgs.vue'
	export default{
		name:'salerOrderInfo',
		components:{
			svgs
		},
		data(){
			return{
				disable:true,
				buyerPhone:'',
				goodNum:'',
				orderNum:'',
				getName:'',
				getPhone:'',
				getAddress:'',
				logistics:'',
				logisticsNum:'',
				order_sn:this.$route.params.order_sn,
				auction_id:this.$route.params.auction_id,
				statusText:this.$route.params.statusText,
				normalStatus: parseInt(this.$route.params.normalStatus),
				orderInfo:{},
			}
		},
		created(){
			this.getOrderInfo()
		},
		methods:{
			back(){
				this.$router.go(-1)
			},
			to(arg){
				this.$router.push(arg)
			},
			getOrderInfo(){//获取订单详情
				let that = this
				that.$axios({
					method:'post',
					url:that.GLOBAL.develop_url+'api/order_info',
					data:{
						token:localStorage.getItem('token'),
						order_sn:that.order_sn,					
					},
	    			transformRequest:[function(data){
	    				let ret = ''
	    				for(let it in data){
	    					ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
	    				}
	    				return ret
	    			}],
					xhrFields:{
		    			withCredentials:true
	    			},
		    		crossDomain:true,
		    		headers: { //解决跨域
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				}).then(function(res){
					console.log(res.data)
					if(res.data.code==200){
							that.orderInfo = res.data.data.order_info
							that.orderInfo.start_time = that.timeFormer(that.orderInfo.start_time)//活动开始时间
							that.orderInfo.c_time = that.timeFormer(that.orderInfo.c_time)//订单创建时间
							that.orderInfo.pay_time = that.timeFormer(that.orderInfo.pay_time)//支付时间
							that.orderInfo.express_time = that.timeFormer(that.orderInfo.express_time)//发货时间
							that.orderInfo.receive_time = that.timeFormer(that.orderInfo.receive_time)//确认收货时间
							that.orderInfo.comment_time = that.timeFormer(that.orderInfo.comment_time)//评论时间
							that.getName = that.orderInfo.receive_name
							that.buyerPhone = that.orderInfo.mobile
							that.getPhone = that.orderInfo.mobile
							that.getAddress = that.orderInfo.address
							that.logistics = that.orderInfo.express_name
							that.logisticsNum = that.orderInfo.express_num
							// that.goodNum = that.orderInfo.receive_name
					}else if(res.data.data == 404){
						$toast.show(res.data.msg, 1000).then(() => {
							that.$router.push('/login')
						})
					}else{
						$toast.show(res.data.msg, 1000)
					}
				})
			}	
		}
	}
</script>

<style scoped lang="less">
.page-content {
  	padding-top: 44px;
	padding-bottom: .3rem;
  	.list-ios{
  		margin: .25rem auto;
  		background-color: #fff;
  		padding-right: .15rem !important;
  		.item{
			.box{
	  			display: flex;
	  			display: -webkit-flex;
	  			align-items: center;
	  			justify-content: flex-start;
		  		.alicenter{
		  			display: flex;
		  			display: -webkit-flex;
		  			align-items: center;
		  			justify-content: center;
		  			background-color: #fff;
		  			width: .68rem;
		  			height: .68rem;
		  			border-radius: 50%;
		  			margin-right: .2rem;
		  		}
		  		.boxInfo{
		  			display: flex;
		  			display: -webkit-flex;
		  			flex-direction: column;
		  			justify-content: flex-start;
		  			/*p{
		  				&:first-child{
		  					font-size: .26rem;
		  					line-height: 1;
		  				}
		  			}*/
		  		}
  			}
  		}
  	}
  	.goodBox{
  		width: 95%;
  		max-width: 7.1rem;
  		margin: 0 auto;
  		background-color: #fff;
  		padding: .2rem 0;
  		.goodHead{
  			border-bottom: 1px solid #f2f2f2;
  			padding: 0 .2rem;
  		}
  		.goodBody{
  			border-bottom: 1px solid #f2f2f2;
  			margin-top: .2rem;
  			padding: 0 .2rem;
  			.flexBox{
  				display: flex;
  				display: -webkit-flex;
				.goodPic{
					display: block;
					width: 1.2rem;
    				height: 1.2rem;
					margin-right: .15rem;
					background-position: center center;
					background-size: cover;
					background-repeat: no-repeat;
				}
				.goodName{
					width: 100%;
					line-height: .35rem;
					font-size: .25rem;
				}
  			}
  		}
  		.goodFoot{
  			margin-top: .2rem;
  			padding: 0 .2rem;
  		}
  	}
  	.tips{
  		padding: .2rem;
  		margin-top: .2rem !important;
  	}
  	.orderInfoBox{
  		width: 95%;
  		max-width: 7.1rem;
  		margin: 0 auto;
  		background-color: #fff;
  	}
	.logisticsInfoBox{
		width: 95%;
  		max-width: 7.1rem;
  		margin: 0 auto;
  		background-color: #fff;
	} 	
}
.ion-ios-arrow-right{
	color: #1c1c1c;position: absolute;right: .16rem;top: 50%;transform: translateY(-50%);-webkit-transform: translateY(-50%);height: auto;
}
.icon{
	font-size: .35rem !important;
}
.default{
	color: #E87439;
}


</style>

