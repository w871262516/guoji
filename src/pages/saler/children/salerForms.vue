<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">店铺报表</span>
			</von-header>
	  		<tabs :tab-items="tabs" :tab-index="tabIndex" :on-tab-click="onTabClick" top="44px"></tabs>

	  		<div v-show="tabIndex==0">
		  		<list class="list-ios item-icon-right mt2">
					<item>
					    <div class="alicenter">
					  		<span>今日成拍：{{formDatas.success_order_amount}}</span>
					  		<span>笔数：{{formDatas.success_order_count}}</span>
	       				</div>
					</item>
				</list> 
				
		  		<list class="list-ios item-icon-right mt2">
					<item>
					    <div class="alicenter">
					  		 销售报表
					  		 <!-- <span class="more">更多</span> -->
	       				</div>
	       				<!-- <i class="icon ion-ios-arrow-right"></i> -->
					</item>
					<item>
					    <div class="alicenter">
					  		<span>今日已付款：{{formDatas.payment_amount}}</span>
					  		<span>笔数：{{formDatas.payment_count}}</span>
	       				</div>
					    <!--<div class="alicenter mt3">
					  		<span>今日已退款：{{formDatas.payment_count}}</span>
					  		<span>笔数：4</span>
	       				</div>-->
					</item>
				</list> 
				
		  		<list class="list-ios item-icon-right mt2">
					<item>
					    <div class="alicenter">
					  		收款报表
					  		 <!-- <span class="more">更多</span> -->
	       				</div>
	       				<!-- <i class="icon ion-ios-arrow-right" style="font-size: .24rem !important;"></i> -->
					</item>
					<item>
					    <div class="alicenter">
					  		<span>今日已收款：{{formDatas.receipt_amount}}</span>
					  		<span>笔数：{{formDatas.receipt_count}}</span>
	       				</div>
					</item>
				</list> 
				
		  		<list class="list-ios item-icon-right mt2">
					<item>
					    <div class="alicenter">
					  		 待收款报表
					  		 <!-- <span class="more">更多</span> -->
	       				</div>
	       				<!-- <i class="icon ion-ios-arrow-right" style="font-size: .24rem !important;"></i> -->
					</item>
					<item>
					    <div class="alicenter">
					  		<span>今日未发货：{{formDatas.not_deliver_amount}}</span>
					  		<span>笔数：{{formDatas.not_deliver_count}}</span>
	       				</div>
					    <div class="alicenter mt3">
					  		<span>今日待确认：{{formDatas.pending_confirm_amount}}</span>
					  		<span>笔数：{{formDatas.pending_confirm_count}}</span>
	       				</div>
					    <div class="alicenter mt3">
					  		<span>今日售后：{{formDatas.after_sale_amount}}</span>
					  		<span>笔数：{{formDatas.after_sale_count}}</span>
	       				</div>
					    <!--<div class="alicenter mt3">
					  		<span>今日退货中：4</span>
					  		<span>笔数：4</span>
	       				</div>-->
					</item>
				</list> 
			</div>
	  		
	  		<div v-show="tabIndex==1">
		  		<!-- <list class="list-ios item-icon-right mt2">
					<item>
					    <div class="alicenter">
					  		 访客报表
					  		 <span class="more">更多</span>
	       				</div>
	       				<i class="icon ion-ios-arrow-right" style="font-size: .24rem !important;"></i>
					</item>
					<item>
					    <div class="alicenter">
					  		<span>今日访问人数：514</span>
					  		<span>今日访问次数：234</span>
	       				</div>
					</item>
				</list>  -->
				
		  		<list class="list-ios item-icon-right mt2">
					<item>
					    <div class="alicenter">
					  		 粉丝报表
					  		 <!-- <span class="more">更多</span> -->
	       				</div>
	       				<!-- <i class="icon ion-ios-arrow-right" style="font-size: .24rem !important;"></i> -->
					</item>
					<item>
					    <div class="alicenter">
					  		<span>累积粉丝：{{manageDatas.fans_count}}</span>
					  		<span>今日增长粉丝：{{manageDatas.today_fans_add}}</span>
	       				</div>
					</item>
				</list> 
				
		  		<list class="list-ios item-icon-right mt2">
					<item>
					    <div class="alicenter">
					  		 拍品报表
					  		 <!-- <span class="more">更多</span> -->
	       				</div>
	       				<!-- <i class="icon ion-ios-arrow-right" style="font-size: .24rem !important;"></i> -->
					</item>
					<item>
					    <div class="alicenter">
					  		<span>今日发布件数：{{manageDatas.today_goods_add}}</span>
	       				</div>
					</item>
				</list> 
				
		  		<list class="list-ios item-icon-right mt2">
					<item>
					    <div class="alicenter">
					  		 客服报表
					  		 <!-- <span class="more">更多</span> -->
	       				</div>
	       				<!-- <i class="icon ion-ios-arrow-right" style="font-size: .24rem !important;"></i> -->
					</item>
					<item>
					    <div class="alicenter">
					  		<span>今日付款人数：11</span>
					  		<span>今日新客占比：1%</span>
	       				</div>
					</item>
				</list> 
			</div>
  		</div>
  	</div>
</template>

<script>
	export default{
		name:'salerForms',
		data(){
			return{
		  		tabs:['资金报表','经营报表'],
		  		tabIndex:0,
		  		formDatas:[],
		  		manageDatas:[]
			}
		},
		watch:{
			tabIndex(val){ //切换tab时设置this.page = 1
			 	switch (val){
			 		case 0:
			 			this.getFormDatas()
			 			break;
			 		case 1:
			 			this.getManageDatas()
			 			break;
			 	}
			},
		},
		methods:{
			back(){
				this.$router.go(-1)
			},	
			onTabClick(index){
				this.tabIndex = index
			},
			getFormDatas(){//获取报表信息
				let that = this
				that.$axios({
					method:'POST',
					url:that.GLOBAL.develop_url+'api/money_report',
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
					that.formDatas = res.data.data
				})
			},
			getManageDatas(){//获取经营报表信息
				let that = this
				that.$axios({
					method:'POST',
					url:that.GLOBAL.develop_url+'api/operate_report',
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
					that.manageDatas = res.data.data
				})
			}
		},
		created(){
			this.getFormDatas()	
		}
	}
</script>

<style scoped lang="less">
.page-content {
  	padding-top: 93px;
  	.list-ios{
  		padding-right: 0 !important;
  	}
  	.sendBox{
  		width: 100%;
  		background-color: #fff;
  		padding:.15rem 0;
  		.mszImg{
  			width: 100%;
  		}
  		.bottomBox{
  			display: flex;
  			display: -webkit-flex;
  			justify-content: space-between;
			align-items: center;
  			padding: 0 .2rem;
  			color: #757373;
  			font-size: .26rem;
  			.beautyName{
  				display: inline-block;
  				max-width: 60%;
  				overflow: hidden;
  				text-overflow: ellipsis;
  				white-space: nowrap;
   			}
  			.iconBox{
				height: 100%;
				display: flex;
				display: -webkit-flex;
				flex: 1;
				justify-content: flex-end;
  				.guide_item{
					display: flex;
					display: -webkit-flex;
					align-items: center;
					font-size:.25rem;
					margin-right: .2rem;
					.icon_style{
						display: inline-block;
						width: .26rem;
						height: .26rem;
						margin: 0.05rem 0;
						margin-right: .0275rem;
					}
				}
  			}
  		}
  	}
}
.button-icon{
	.guide_item{
		display: flex;
		display: -webkit-flex;
		align-items: center;
		font-size:.25rem;
		.icon_style{
			display: inline-block;
			width: .44rem;
			height: .4rem;
			margin: 0.05rem 0;
			margin-right: .0275rem;
		}
	}
}
.mt2{
	margin-top: .2rem;
}
.mt3{
	margin-top: .3rem;
}
.alicenter{
	display: flex;
	display: -webkit-flex;
	align-items: center;
	justify-content: space-between;
	padding-right: .4rem;
	.more{
		font-size: .24rem;color:#444;
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