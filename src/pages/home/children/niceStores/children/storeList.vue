<template>
	<div class="listBox">
		<div class="head">
			<div class="headBox">
				<!--<img :src="list.bussiness.logo"/>-->
				<div :style="{backgroundImage:'url('+list.bussiness.logo+')'}" class="img"></div>
				<div class="userBox">
					<p>{{list.bussiness.name}}</p>
					<span>{{list.bussiness.truename}}</span>
					<i>
						<section class="guide_item">
				        	<svg class="icon_style">
				                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#diamonds'"></use>
				          	</svg>
				       </section>
						<section class="guide_item" v-show="">
				        	<svg class="icon_style">
				                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#crown'"></use>
				          	</svg>
				        </section>
					</i>
				</div>
				<router-link :to="{path:'/stores/'+list.bussiness.id,params:{id:list.bussiness.id}}" class="btn">进店</router-link>
			</div>
		</div>
		<div class="bottom" v-if="list.goods_0">
			<div class="leftBox">
				<div :style="{backgroundImage:'url('+list.goods_0.thumb+')'}" class="left" @click="toGoodInfo(list.goods_0.id,list.goods_0.mid,list.goods_0.room)"></div>
				<!-- <img :src="list.goods_0.thumb" class="left" @click="toGoodInfo(list.goods_0.id,list.goods_0.mid,list.goods_0.room)"/> -->
			</div>
			<!-- <div class="rightBox">
				<div v-if="list.goods_1">
					<div :style="{backgroundImage:'url('+list.goods_1.thumb+')'}"  @click="toGoodInfo(list.goods_1.id,list.goods_1.mid,list.goods_1.room)"></div>
					<img :src="list.goods_1.thumb"  @click="toGoodInfo(list.goods_1.id,list.goods_1.mid,list.goods_1.room)" />	
				</div>
				<div v-if="list.goods_2">
					<div :style="{backgroundImage:'url('+list.goods_2.thumb+')'}"  @click="toGoodInfo(list.goods_2.id,list.goods_2.mid,list.goods_2.room)"></div>
					<img :src="list.goods_2.thumb"  @click="toGoodInfo(list.goods_2.id,list.goods_2.mid,list.goods_2.room)"/>	
				</div>
			</div> -->
		</div>	
	</div>
</template>

<script>
	export default{
		name:'storeList',
		props:['list'],
		data(){
			return{
				
			}
		},
		methods:{
			toGoodInfo(id,mid,room){
				let rm = parseInt(room)
				if(rm == 1){
					this.$router.push({
						path:'/goodInfo/'+id,
						query:{
							auctionId:id,
							mid:mid
						}
					})
				}else{
					this.$router.push({
						path:'/goodInfoRemit/'+id,
						query:{
							auctionId:id,
							mid:mid
						}
					})
				}
			}
		}
	}
</script>

<style lang="less" scoped>
.listBox{
	background-color: #fff;
	padding: .25rem;
	margin-top: .2rem;
	.head{
		position: relative;
		display: flex;
		display: -webkit-flex;
		justify-content: space-between;
		.headBox{
			display: flex;
			display: -webkit-flex;
			justify-content: space-between;
			align-content: center;
			.img{
				display: block;
				width: .8rem;
				height: .8rem;
				border-radius: 50%;
  				background-size: cover;
  				background-repeat: no-repeat;
  				background-position: center center;
			}
			.userBox{
				height: .8rem;
				display: flex;
				display: -webkit-flex;
				justify-content: space-between;
				flex-direction: column;
				margin-left: .1rem;
				p{
					font-size: .26rem;
					line-height: .8rem;
				}
				span{
					color: #8c8b8b;
					font-size: .18rem;
				}
				i{
					.guide_item{
						display: inline;
						display: flex;
						display: -webkit-flex;
						.icon_style{
							display: inline-block;
							width: .25rem;
							height: .22rem;
							margin-right: .05rem;
						}
					}
					.default{
						color: #E87439 !important;
					}
				}
			}
		}
		.btn{
			height: .6rem;
			color: #E87439 !important;
			border: 1px solid #E87439;
			padding: .1rem .35rem;
			line-height: .4rem;
			border-radius: 20px;
			position: absolute;
			right: .25rem;
			top: 50%;
			transform: translateY(-50%);
			-webkit-transform: translateY(-50%);
		}
	}
	.bottom{
		border-radius: 50px;
		margin-top: .15rem;
		height: 4rem;
		display: flex;
		display: -webkit-flex;
		justify-content: space-between;
		align-items: center;
		.leftBox{
			width: 60%;
			.left{
				display: block;
				// width: 4rem;
				width: 7rem;
				padding-top: 80%;
				margin: 0 auto;
  				background-size: cover;
  				background-repeat: no-repeat;
  				background-position: center center;
			}
		}
		.rightBox{
			width: 40%;
			display: flex;
			display: -webkit-flex;
			justify-content: space-between;
			flex-direction: column;
			div{
				height: 1.58rem;
				display: flex;
				display: -webkit-flex;
				justify-content: space-between;
				align-items: center;
				&:first-child{
					margin-bottom: .1rem;
				}
				div{
					display: block;
					width: 100%;
					max-width: 2rem;
					margin: 0 auto;
	  				background-size: cover;
	  				background-repeat: no-repeat;
	  				background-position: center center;
				}
			}
		}
	}
}
</style>