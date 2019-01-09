<template>
	<div class="salePointBox">
		<router-link to="index/tomorrowGoods"  class="leftBox">
			<h3>明日精品</h3>
			<span>明日10点上新拍场</span>
			<img src="../../../../static/home/mingrijingpin.png" />
		</router-link>
		<div class="rightBox" >
			<router-link to="index/oneYuan" class="topBox">
				<h3>一元捡漏</h3>
				<span>你意想不到的低价</span>
				<img src="../../../../static/home/yiyuanjianlou.png" />
			</router-link>
			<div class="bottomBox">
				<router-link to="index/everydayGoods" class="box">
					<h3>每日精品</h3>
					<span>多款产品&nbsp;超低价格</span>
					<img src="../../../../static/home/meirijingpin.png"/>
				</router-link>
				<router-link to="/index/niceStores" class="box">
					<h3>优铺</h3>
					<span>每日优铺为你淘好货</span>
					<img src="../../../../static/home/youpu.png" />
				</router-link>
			</div>
		</div>
	</div>	
</template>

<script>
	export default{
		name:"salePoint"
	}
</script>

<style scoped lang="less">
	.salePointBox{
		margin-top: 0.2rem;
		position: relative;
		display: flex;
		display: -webkit-flex;
		flex: 1;
		justify-content: space-around;
		background-color: #FFFFFF;
		.leftBox {
			width: 35.7333%;
			position: relative;
			padding: .33rem 0rem 0rem .22rem;
			h3 {
				font-size: .26rem;
				margin-bottom: 0;
				color: #000;
			}
			span{
				font-size: .22rem;
				color: #a4a4a4;
			}
			img{
				display: block;
				width: 1.23rem;
				margin: 1rem auto .34rem;
			}
			&:after{
				content: '';
				display: block;
				width: 0.02rem;
				background-color: #f2f2f2;
				height: 100%;
				position: absolute;
				right: 0;
				top: 0;
			}
		}
		.rightBox{
			width: calc(100% - 35.7333%);
			display: flex;
			display: -webkit-flex;
			flex: 1;
			flex-direction: column;
			h3{
				font-size: .26rem;
				margin-bottom: 0;
				color: #000;
			}
			span{
				font-size: .22rem;
				color: #a4a4a4;
			}
			.topBox{
				padding: .33rem 0rem 0rem .22rem;
				position: relative;
				img{
					display: block;
					width: 2.67rem;
					float: right;
				}
				&:after{
					content: '';
					display: block;
					width: 100%;
					background-color: #f2f2f2;
					height: 0.02rem;
					position: absolute;
					left: 0;
					bottom: 0rem;
				}
			}
			.bottomBox {
				display: flex;
				display: -webkit-flex;
				flex: 1;
				justify-content: space-around;
				img{
					display: block;
				}
				.box:first-child{
					width: 50%;
					padding: .33rem 0rem 0rem .22rem;
					position: relative;
					img{
						width: 1.38rem;
						margin: .42rem auto;
					}
					&:after{
						content: '';
						display: block;
						width: 0.02rem;
						background-color: #f2f2f2;
						height:100%;
						position: absolute;
						right: 0;
						top: 0rem;
					}
				}
				.box:last-child{
					width: 50%;
					padding: .33rem 0rem 0rem .22rem;
					img{
						width: .83rem;
						margin: .39rem auto;
					}
				}
			}	
		}
	}
</style>