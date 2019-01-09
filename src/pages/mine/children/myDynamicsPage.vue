<template>
	<div class="page">
		  	<div class="page-content">
		  		<von-header theme="light">
			  		<button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			 	<span slot="title">我的动态</span>
			</von-header>
		  		<template v-for="(dynamic,index) in dynamics">
				  	<section class="dynamicBox" @click="goDynamicsInfo">
				  		<img :src="dynamic.img"/>
				  		<div>
				  			<p>{{dynamic.title}}</p>
				  			<span>{{dynamic.time}}前</span>
				  			<div class="bottomBox">
				  				<svgs></svgs>
						   		<section class="guide_item">
						        	<svg class="icon_style">
						                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#collect'"></use>
						            </svg>
						            <span>{{dynamic.collect}}</span>
						        </section>
						   		<section class="guide_item">
						        	<svg class="icon_style">
						                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#comment'"></use>
						            </svg>
						            <span>{{dynamic.comment}}</span>
						       </section>
						   	</div>
				  		</div>
				  	</section>
		  		</template>
  		</div>
  	</div>
</template>

<script>
	import svgs from '../../../components/common/svgs.vue'
	export default{
		name:'myDynamicsPage',
		components:{
			svgs
		},
		data(){
			return{
				dynamics:[
					{
						img:'static/dynamics/dynamicBg.png',
						title:'不知道这是什么鬼，但是感觉应该很值钱',
						time:'2小时',
						collect:'2233',
						comment:'2333'
					},
					{
						img:'static/dynamics/dynamicBg.png',
						title:'不知道这是什么鬼，但是感觉应该很值钱',
						time:'2小时',
						collect:'2233',
						comment:'2333'
					},
					{
						img:'static/dynamics/dynamicBg.png',
						title:'不知道这是什么鬼，但是感觉应该很值钱',
						time:'2小时',
						collect:'2233',
						comment:'2333'
					}
				]
			}
		},
		methods:{
			back(){
				this.$router.go(-1)
			},
			goDynamicsInfo(){
				this.$router.push('/mine/myDynamics/viewDynamics')
			}
		}
	}
</script>

<style lang="less"	scoped>
.page-content {
  	padding-top: 44px;
  	padding-bottom: 1rem;
	color: #323232;
  	font-size: .23rem;
	.dynamicBox{
		background-color: #fff;
		padding: .28rem .2rem;
		border-bottom: 1px solid #f2f2f2;
		display: flex;
		display: -webkit-flex; 
		justify-content: normal;
		img{
			display: block;
			width: 2.68rem;
			height: 1.97rem;
			border-radius: 10px;
			margin-right: .35rem;
		}
		div{
			width: calc(100% - 2.68rem);
			padding: .14rem 0;
			position: relative;
			p{
				font-size: .24rem;margin-bottom: .1rem !important;
				
			}
			.bottomBox{
				width: 100%;
				height: .5rem;
				position: absolute;
				bottom: 0;
				display: flex;
				display: -webkit-flex;
				flex: 1;
				justify-content: flex-end;
				.guide_item{
					display: flex;
					display: -webkit-flex;
					padding-right: 0.53rem;
					align-items: center;
					font-size:.24rem;
					&:last-child{
						padding-right: 0;
					}
					.icon_style{
						display: inline-block;
						width: .38rem;
						margin-right: .075rem;
					}
				}
			}
		}
	}	
}
</style>