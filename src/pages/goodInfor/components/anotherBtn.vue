<template>
		<div class="btnModel">
			<div class="btnWrap" @click="hideBtn"></div>
			<svgs style="display: none;"></svgs>
			<div class="anotherBar">
				<div class="infoBox">
					<img class="goodImg" :src="thumb"/>
					<div class="priceBox">
						<p class="NowPrice default">当前价:￥ {{auctionInfo.price}}</p>
						<span>加价幅度  {{perPrice}}</span>
					<!--	<span>出价次数  2</span>-->
					</div>
				</div>
				<div class="checkEntrust">
					<span>
						出价金额
					</span>
					<div>
						<section class="guide_item" @click="reducePrice">
				        	<svg class="icon_style">
				                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#reduceNums'"></use>
				          	</svg>
				        </section>
						<span>{{myprices}}</span>
						<section class="guide_item" @click="addPrice">
				        	<svg class="icon_style">
				                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#addNums'"></use>
				          	</svg>
				        </section>
					</div>
				</div>
				<!--<div class="checkEntrust" @click="doEntrust">
					<span>
						委托出价
					</span>
					<section class="guide_item">
			        	<svg class="icon_style">
			                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#rightFull'" :fill="fill"></use>
			          	</svg>
			        </section>
				</div>-->
				<div class="sureBtn" @click="hideBtn">
					确认出价
				</div>
			</div>
		</div>
</template>

<script>
	import svgs from './svgs.vue'
	export default{
		name:'anotherBar',
		components:{
			svgs
		},
		props:['perPrice','thumb','auctionInfo','price'],
		data(){
			return{
				isEntrust:false, //记录是否选择委托
				fill:"#48ab59",
				myprices:this.$props.price,
			}
		},
		methods:{
			hideBtn(){//触发父级隐藏 anotherBtn方法
				let data = '{"type":"auto_bid", "id": '+this.auctionInfo.id+', "mid": 66039, "price": '+parseFloat(( this.myprices).toFixed(1))+',"path":"joinAction"}';
				this.$emit('hideAnotherBtn','')
			},
			doEntrust(){ //切换显示委托勾选icon 并且记录是否选择委托
				this.isEntrust = !this.isEntrust
				if(this.isEntrust){
					this.fill = "#48ab59"
				}else{
					this.fill = "#323232"
				}
			},
			reducePrice(){
				let per = Number(this.$props.perPrice)
				let min = parseFloat((Number(this.$props.price) + per).toFixed(2))
				if(Number(this.myprices) == min){
					return
				}
				this.myprices = parseFloat((Number(this.myprices) - per).toFixed(2))
			},
			addPrice(){
				let per = Number(this.$props.perPrice)
				this.myprices = parseFloat((Number(this.myprices) + per).toFixed(2))
			}
		},
		created(){
			console.log(this.$props.price)
			let newPrice = this.$store.state.joinActionData.list.price
			console.log(newPrice)
			if(newPrice == '') {
				newPrice = this.$props.price
			}
			this.myprices = newPrice
			this.addPrice() //进来默认自动加一次价
		}
	}
</script>

<style scoped lang="less">
.btnModel{
	height: 100%;
	width: 100%;
	position: fixed;
	left: 0;
	top: 0;
	z-index: 999;
	.btnWrap{
		height: 100%;
		width: 100%;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 1000;
		background-color: rgba(0,0,0,0.6);
	}
	.anotherBar{
		background-color: #fff;
		position: absolute;
		bottom: 0;
		left: 0;
		z-index: 1000;
		width: 100%;
		height: 4.6rem;
		text-align: center;
		display: flex;
		display: -webkit-flex;
		flex-direction: column;
		.infoBox{
			background-color: #fff;
			position:relative;
			height: 2rem;
			padding: .2rem .2rem 0 .2rem;
			.goodImg{
				position: absolute;
				top: -.5rem;
				left: .2rem;
				display: block;
				width: 2rem;
				height: 2rem;
				border: 5px solid #fff;
				border-radius: 5px;
				background-color: #fff;
			}
			.priceBox{
				width: 100%;
				padding-left: 2.2rem;
				display: flex;
				display: -webkit-flex;
				flex-direction: column;
				align-items: flex-start;
				.NowPrice{
					font-size: .3rem;
					margin-bottom: .3rem !important;
				}
			}
		}
		.checkEntrust{
			height: 1rem;
			display: flex;
			display: -webkit-flex;
			justify-content: space-between;
			align-items: center;
			padding: .2rem;
			div{
				display: flex;
				display: -webkit-flex;
				justify-content: space-between;
				align-items: center;
				span{
					display: inline-block;
					margin: 0 .2rem;
					font-size: .26rem;
				}
				.guide_item{
					display: inline;
					display: flex;
					display: -webkit-flex;
					.icon_style{
						display: inline-block;
						width: .52rem;
						height: .52rem;
						margin-right: 0 !important;
					}
				}
			}
		}
		.sureBtn{
			height: 1rem;
			line-height: 1rem;
			font-size: .36rem;
			color: #fff;
			background-color: #E87439;
		}
	}	
}

.guide_item{
	display: inline;
	display: flex;
	display: -webkit-flex;
	.icon_style{
		display: inline-block;
		width: .32rem;
		height: .32rem;
		margin-right: .075rem;
	}
}
.default{
	color: #E87439;
}
</style>