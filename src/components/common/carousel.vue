<template>
	<swiper :options="swiperOption" ref="mySwiper" :style="{backgroundColor:swiperBgColor,padding:isPadding}" style="height: auto;">
	    <swiper-slide  v-for="(img,index) in imgs" :key="index">
	    	<img :src="img.src || img || img.path" :style="{width: picWidth}" style="display: block;max-width: 7.5rem !important;margin: 0 auto;"/>
	    </swiper-slide>
		<div class="swiper-pagination" slot="pagination" v-show="showPagination"></div>
	</swiper>	
</template>

<script>
	import 'swiper/dist/css/swiper.css'
	import { swiper, swiperSlide } from 'vue-awesome-swiper'
	export default{
		name:'carousel',
		components: {
		    swiper,
		    swiperSlide
		},
		props:['picWidth','imgs','showPagination','paginationColor','speed','swiperBgColor','isPadding'],   //picWidth 配置 轮播图宽度  swiperH轮播盒子高度  imgs轮播图  showPagination分页器 paginationColor分页器颜色
		data(){
			return{
				swiperOption:{
					speed: this.$props.speed,//可选选项，自动滑动
					loop:false,//可选选项，是否循环
					autoplay:2000,
					autoplayDisableOnInteraction : false, //pagination后一样能继续滚动
					pagination:'.swiper-pagination',
					paginationClickable:true,
					observer:true,//修改swiper自己或子元素时，自动初始化swiper 
					observeParents:true//修改swiper的父元素时，自动初始化swiper 
				}
			}
		}
	}
</script>

<style scoped lang="less">
.swiper-container{
	.swiperBox{
		.swiper-wrapper{
			.swiper-slide {
				img{
					display: block;
					margin: 0 auto;
					height: 100%;
				}
			}
		}
	}
}
</style>