<template>
	<div class="page">
	  	<div class="page-content">
			<svgs style="display: none;"></svgs>
			
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title" style="width: 80%;margin: 0 auto;display: inline-block;position: relative;display: flex;display: -webkit-flex;align-items: center;">
			  	<tabs :tab-items="tabs" :tab-index="tabIndex" :on-tab-click="onTabClick" top="0px" aheight="42px" lheight="47px" dheight="47px" style="height: 42px;width: 100%;position: relative;display: flex;display: -webkit-flex;align-items: center;"></tabs>
			  </span>
			  <button class="button button-icon" slot="right" @click="share">
			  	<section class="guide_item">
		        	<svg class="icon_style">
		                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#share'" fill="#323232"></use>
		          	</svg>
		        </section>
			  </button>
			</von-header>
			
			<div class="mallDiv" v-show="tabIndex==0">
	  			<div class="mallInfo">
	  				<good-carousel :picWidth="imgWidth" :showPagination="true" :speed="300" :imgs="carouselImgs" :swiperBgColor="bgColor"></good-carousel>
					<p class="mallGoodTitle">{{goodsData.goods_name}}</p>
					<p class="mallGoodPrice"><span>{{goodsData.integral}}</span>积分</p>
	  			</div>
	  			<div class="mallStore">
	  				<!-- <div class="storeInfo">
	  					<img class="userImg" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1530699922928&di=16640932c87ab068d5b4f41710fd6d95&imgtype=jpg&src=http%3A%2F%2Fimg3.imgtn.bdimg.com%2Fit%2Fu%3D2570764178%2C2072195131%26fm%3D214%26gp%3D0.jpg" />
	  					<span class="userName">userName</span>
	  					<section class="guide_item">
				        	<svg class="icon_style">
				                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#homeStore'" fill="#323232"></use>
				          	</svg>
				          	<span>进店</span>
				        </section>
	  				</div> -->
	  				<div class="mallGoodInfo">
	  					<div>
	  						<span>【名称】：{{goodsData.goods_name}}</span>
	  						<span>【市场价】：{{goodsData.price}}</span>
	  					</div>
	  					<div>
	  						<span>【所需积分】：{{goodsData.integral}}</span>
	  						<span>【库存】：{{goodsData.inventory}}</span>
	  					</div>
	  				</div>
	  			</div>
				<img src="../../../../../static/integration/integralImg.png" class="goodsImg" />
				<div id="goods_info"></div>
			</div>
			
			<div class="historyDiv" v-show="tabIndex==1">
				<exchange :historyList="historyList" :hasHistory="hasHistory"></exchange>
				<!-- <div class="historyBox">
					<img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1530699913209&di=e71ca3bf4c31be9bd8e3d12370362ce4&imgtype=0&src=http%3A%2F%2Fp3.wmpic.me%2Farticle%2F2018%2F01%2F05%2F1515116768_NFxkUZSy.jpg" class="userImg"/>
					<span class="userName">打我会死的回复</span>
					<span class="time">2018-03-18 15:30:48</span>
				</div>
				<div class="historyBox">
					<img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1530699913209&di=e71ca3bf4c31be9bd8e3d12370362ce4&imgtype=0&src=http%3A%2F%2Fp3.wmpic.me%2Farticle%2F2018%2F01%2F05%2F1515116768_NFxkUZSy.jpg" class="userImg"/>
					<span class="userName">打我会死的回复</span>
					<span class="time">2018-03-18 15:30:48</span>
				</div> -->
			</div>
  		</div>
		<share-model v-show="showShareModel" @hideShareModel="hideShareModel"></share-model>
  	</div>
</template>

<script>
	import exchange from '../myIntegrationChildren/components/exchange.vue'
	import goodCarousel from '../../../../components/common/goodCarousel.vue'
	import shareModel from '../../../../components/common/shareModel.vue'
	import svgs from '../../../../components/common/svgs.vue'
	export default{
		name:'mallGoodInfo',
		components:{
			svgs,
			shareModel,
			goodCarousel,
			exchange
		},
		data(){
			return{
				tabs:[
					'商品详情',
					'兑换记录'
				],
				imgWidth:'100%',
		        bgColor:'#fff',
				tabIndex:0,
				showShareModel:false,
				gid:this.$route.query.gid,
				goodsData:{},
				carouselImgs:[],
				historyList:[],
				hasHistory:true,
			}
		},
		created(){
			this.getGoodsDetail();
			this.getHistory();
		},
		methods:{
			back(){
				this.$router.go(-1)
			},
			getGoodsDetail(){
				let that = this
				that.$axios({
					method:'post',
					url:that.GLOBAL.develop_url+'api/integral_goods_info',
					data:{
						goods_id:that.gid
					},
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
						
							that.goodsData = res.data.data
							var imgsList = eval(that.goodsData.goods_img)
							imgsList.forEach((item)=>{
								that.carouselImgs.push(item.img)
							})
							console.log(that.carouselImgs);
							document.getElementById("goods_info").innerHTML = that.goodsData.goods_info;
							break;
						case "400":
							$toast.show('获取信息失败，请重新登录！', 1000).then(() => {
								that.$router.push('/login')
							})
							break;
						default:
							break;
					}
					document.getElementById("goods_info").innerHTML = that.goodsData.goods_info;
				})
			},
			share(){
				this.showShareModel = !this.showShareModel
			},
			hideShareModel(){
				this.showShareModel = false
			},
			goExchangeHistory(){
				
			},
			getHistory(){//获取兑换历史记录
	    		let that = this
	    		that.$axios({
	    			method:'post',
	    			url:that.GLOBAL.develop_url+'api/integral_exchange_goods_log',
	    			data:{
	    				token:localStorage.getItem('token'),
	    			},
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
						res.data.data.forEach((item) => {
							item.create_time = that.timeFormer(item.create_time);
							item.goods_img = eval(item.goods_img)[0].img
							that.historyList.push(item);
							
						});
					}else{
						$toast.show(res.data.msg)
					}
				})
			},
			onTabClick(index){
				this.tabIndex = index
				console.log(index)
			}
		}
	}
</script>
<style>

#goods_info img{
	width: 100%;
}
</style>

<style lang="less"scoped>
.page-content {
  	padding-top: 44px;
	color: #323232;
  	font-size: .23rem;
	background-color: #fff;
  	.mallDiv{
  		.mallInfo{
  			margin-top: .2rem;
			background-color: #fff;
			padding: .05rem 0;
			text-align: center;
			.mallGoodImg{
				display: block;
				width: 100%;
				max-width: 7.5rem;
				margin: 0 auto;
			}
			.mallGoodTitle{
				margin: .075rem 0 !important;
				font-size: .22rem;
			}
			.mallGoodPrice{
				margin: .1rem 0 !important;
				color: #E87439;
				font-size: .24rem;
			}
		}
		.mallStore{
			width: 100%;
			padding: .2rem;
			.storeInfo{
				width: 100%;
				display: flex;
				display: -webkit-flex;
				justify-content: flex-start;
				align-items: center;
				position: relative;
				.userImg{
					display: block;
					width: .72rem;
					height: .72rem;
					border-radius: 50%;
					margin-right: .2rem;
				}
				.userName{
					font-size: .32rem;
				}
				.guide_item{
					display: block;
					width: 1.1rem;
					height: .42rem;
					position: absolute;
					top: 50%;
					right: 0rem;
					transform: translateY(-50%);
					-webkit-transform: translateY(-50%);
					border:1px solid #aaaaaa;
					display: flex;
					display: -webkit-flex;
					justify-content: center;
					align-items: center;
					font-size: .2rem;
					border-radius: 10px;
					.icon_style{
						display: inline-block;
						width: .25rem;
						height: .25rem;
						margin-right: .075rem;
					}
				}
			}
			.mallGoodInfo{
				display: flex;
				display: -webkit-flex;
				flex-direction: column;
				padding: .2rem;
				margin: .2rem auto;
				background-color: #f2f2f2;
				div{
					display: flex;
					display: -webkit-flex;
					align-items: center;
					margin-top: .2rem;
					&:first-child{
						margin-top: 0;
					}
					span{
						width: 50%;
					}
				}
			}
		}
		.goodsImg{
			display: block;
			width: 100%;
		}
  	}
  	.historyDiv{
  		.historyBox{
  			width: 100%;
  			border-bottom: 1px solid #dcdcdc;
  			display: flex;
  			display: -webkit-flex;
  			justify-content: flex-start;
  			align-items: center;
  			padding: .35rem .2rem;
  			position: relative;
			.userImg{
				display: block;
				width: .72rem;
				height: .72rem;
				border-radius: 50%;
				margin-right: .2rem;
			}
			.userName{
				font-size: .24rem;
			}
			.time{
				position: absolute;
				right: .2rem;
				top: 50%;
				transform: translateY(-50%);
				-webkit-transform: translateY(-50%);
				font-size: .2rem;
				color: #9C9A9A;
			}
  		}
  	}
	.default{
		color: #E87439 !important; 
	}
}
.guide_item{
	display: flex;
	display: -webkit-flex;
	align-items: center;
	.icon_style{
		display: inline-block;
		width: .34rem;
		height: .33rem;
		margin-right: .075rem;
	}
}
</style>