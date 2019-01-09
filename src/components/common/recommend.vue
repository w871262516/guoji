<template>
	<swiper :options="swiperOption" ref="newSwiper" class="swiperBox">
	    <swiper-slide v-for="(user,index) in users" :key="index">
	    	<div @click="goThisStore(user)" class="div">
				<!--<img :src="user.photo" class="storeImg" />-->
				<div :style="{backgroundImage:'url('+user.logo+')'}" class="storeImg"></div>
				<p>{{user.name}}</p>
			</div>
	    </swiper-slide>
	</swiper>
</template>

<script>
	import 'swiper/dist/css/swiper.css'
	import { swiper, swiperSlide } from 'vue-awesome-swiper'
	export default{
		name:'recommend',
		props:['users'],
		components: {
		    swiper,
		    swiperSlide
		},
		methods:{
			goThisStore(user){
				this.$router.push({path:'/stores/'+user.id,params:{id:user.id}})
			}
		},
		data(){
			return{
				swiperOption:{
					slidesPerView :3.6,
					observer:true,//修改swiper自己或子元素时，自动初始化swiper 
					observeParents:true//修改swiper的父元素时，自动初始化swiper 
				}
			}
		},
		created(){
			console.log(this.users)
		}
	}
</script>

<style scoped lang="less">
	.swiperBox{
		height: 2.15rem;background-color: #fff;
		.swiper-wrapper{
		 	.swiper-slide{
		 		display: flex;
		 		align-items: center;
		 		justify-content: space-around;
		 		 .div{
					height: 1.7rem;
					display: flex;
					display: -webkit-flex;
					justify-content: space-around;
					align-items: center;
					flex-direction: column;
					.storeImg{
						display: block;
						width: .9rem ;
						height: .9rem;
						max-width: .9rem !important;
						max-height: .9rem !important;
						border-radius: 50%;
						margin: 0 auto;
		  				background-size: cover;
		  				background-repeat: no-repeat;
		  				background-position: center center;
					}
					p{
						text-align: center;
						font-size: .24rem;
						margin-top: 0.15rem;
					}
				}
		 	}
		 } 
	}
</style>