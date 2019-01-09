<template>
	<list class="list">
		<item v-for="(list,index) in commentList">
		   	<svgs style="display: none;"></svgs>
		   	<div class="commentBox">
		   		<!--<img :src="list.photo"/>-->
				<div :style="{backgroundImage:'url('+list.photo+')'}" class="img"></div>
		   		<div class="infoBox">
		   			<div class="userBox">
		   				<p>{{list.nickname}}</p>
		   				<span>{{list.c_time}}</span>
		   			</div>
		   			<!-- <div class="loveBox">
		   				<section class="guide_item" v-show="isCollect==false">
				        	<svg class="icon_style">
				                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#collect'"></use>
				            </svg>
				            <span>{{list.fabulous}}</span>
			     	    </section>
			     	    <section class="guide_item" v-show="isCollect" :class="{default:isCollect}">
				        	<svg class="icon_style">
				                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#collected'" fill="#E87439"></use>
				            </svg>
				            <span>{{list.fabulous}}</span>
			     	    </section>
		   			</div> -->
		   		</div>
		   	</div>
		   	<section class="commentContent">
		   		<p v-html="list.content">
		   		</p>
		   	</section>
		</item>
	</list>
</template>

<script>
	import svgs from '../../../../components/common/svgs.vue'
	export default {
		name:'circleList',
		components:{
			svgs
		},
		props:['commentList'],
		data(){
			return{
				isCollect:false
			}
		},
		methods:{
			collectThis(){
				this.isCollect = true
			}
		}
	}
</script>

<style scoped lang="less">
	.list{
		.item{
			padding: .2rem .2rem;
			.commentBox{
				display: flex;
				display: -webkit-flex;
				align-items: center;
				height: .76rem;
				.img{
					display: block;
					width: .6rem;
					height: .6rem;
					border-radius: 50%;
	  				background-size: cover;
	  				background-repeat: no-repeat;
	  				background-position: center center;
				}
				.infoBox{
					width: 100%;
					display: flex;
					display: -webkit-flex;
					justify-content: space-between;
					align-items: center;
					.userBox{
						height: 100%;
						margin-left: .2rem;
						display: flex;
						display: -webkit-flex;
						flex-direction: column;
						justify-content: center;
						p{
							font-size: .28rem;
							line-height: 1;
							margin-bottom: 0 !important;
							color: #000;
						}
						span{
							font-size: .24rem;
							margin-top: .09rem;
							color: #a7a7a7;
						}
					}
					.loveBox{
						.guide_item{
							display: flex;
							display: -webkit-flex;
							padding-right: 0.23rem;
							align-items: center;
							font-size:.24rem;
							padding: .2rem;
							.icon_style{
								display: inline-block;
								width: .34rem;
								height: .28rem;
								margin-right: .075rem;
							}
						}
					}
				}
			}
			.commentContent{
				display: -webkit-flex;
				display: flex;
				justify-content: flex-end;
				margin-top: .15rem;
				p{
					width: calc(100% - .8rem);
					font-size: .26rem;
					line-height: .35rem;
					overflow: hidden;
					white-space: normal;
				}
			}
		}	
	}
.default{
	color: #E87439 !important;
}
</style>