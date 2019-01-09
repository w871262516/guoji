<template>
	<div class="swiper-container swiperBox" id="recommendSwiper">
	  <div class="swiper-wrapper">
	    <div class="swiper-slide" v-for="(recommend,index) in recommends">
	    	<router-link :to="{path:'/mine/integrationExchange/integrationMall/mallGoodInfo',query:{gid:recommend.id}}" class="link">
    			<!-- <img :src="recommend.goods_img"/> -->
				<div :style="{backgroundImage:'url('+ recommend.goods_img+')'}" class="img"></div>
    			<p>{{recommend.goods_name}}</p>
    			<p>{{recommend.integral}}</p>
    		</router-link>
	    </div>
	  </div>
	</div>
</template>

<script>
	import Swiper from 'swiper';
	export default{
		name:'integrationRecommend',
		props:['recommends'],
		mounted(){
			var reSwiper = new Swiper('#recommendSwiper', {
				slidesPerView :3.25
			})
		}
	}
</script>

<style scoped lang="less">
	.swiperBox{
		height: 3.1rem;
		background-color: #fff;
		.swiper-wrapper{
		 	.swiper-slide{
		 		 .link{
					margin: 0.2rem 0 0;
					display: flex;
					display: -webkit-flex;
					align-items: center;
					flex-direction: column;
					.img{
						width: 2rem;
						height: 2rem;
						border-radius: 5px;
						margin: 0 auto;
						background-position: center center;
						background-repeat: no-repeat;
						background-size: cover;
					}
					p{
						text-align: center;
						font-size: .17rem;
						margin-top: 0.05rem !important;
					}
				}
		 	}
		 } 
	}
</style>