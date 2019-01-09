<template>
	<div class="goodsBox">
		<div @click="toGoodInfo(data.id,data.mid,data.room)">
    		<!--<span class="goodTime" v-show="data.time>0 && data.start>0">{{data.start | expTime}}</span>-->
			<span class="goodTime" v-show="data.time>0 && !data.start">{{data.time | expTime}}</span>
    		<span class="goodTime" v-show="data.time>0 && data.start>0">即将开始</span>
    		<span class="goodTime" v-show="data.time<=0 && !data.period_new && data.period">出价结束</span>
    		<span class="goodTime" v-show="data.time<=0 && !data.period_new && !data.period">活动结束</span>
			<!--<img class="goodImg" :src="data.thumb"/>-->
			<div :style="{backgroundImage:'url('+data.thumb+')'}" class="goodImg"></div>
			<p class="goodName">{{data.title}}</p>
			<p class="goodNowPrice" v-if="data.price">
				当前：￥
				<span>{{ data.price }}</span>
			</p>
			<p class="market" v-if="data.market_price">
				市场价：￥
				<span>{{ data.market_price }}</span>
			</p>
			<div class="bottomBox" v-if="data.business">
				<!--<img :src="data.business.logo" class="userImg"/>-->
				<div :style="{backgroundImage:'url('+data.business.logo+')'}" class="userImg"></div>
				<div class="userInfo">
					<p class="userName">{{data.business.name}}</p>
					<!--<span class="userIP">{{data.userIP}}</span>-->
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	 export default{
	 	name:'doubleGoods',
	 	props:['data'],
		filters:{
			expTime(val){
				let h = 0,
					m = 0,
					s = parseInt(val)
				if(s > 60){
					m = parseInt(s / 60)
					s = parseInt(s % 60)
					if(m > 60){
						h = parseInt(m / 60)
						m = parseInt(m % 60)
					}
					h=parseInt(h) >= 10 ? h : '0'+ h
					m=parseInt(m) >= 10 ? m : '0'+ m
					s=parseInt(s) >= 10 ? s : '0'+ s
					let t = h + ':' + m  + ':' + s
					return t
				}
				if(s>0 && s<60){
					if(s<10){
						s= '0'+s
					}
					let t = '00' + ':' + '00'  + ':' + parseInt(s)
					return t
				}else{
					return ''
				}
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
	 	},
		mounted(){
			setInterval(()=>{
				if(this.$props.data.time){
					let time = this.$props.data.time
					if(time>0){
						time--
						this.$props.data.time = time
					}
				}else{
					return
				}
			},1000)
		}
	 }
</script>

<style lang="less" scoped>
.goodsBox{
	margin-top: .15rem;
	width: 48.5%;
	div{
		padding: .2rem .15rem .1rem;
		background-color: #fff;
		.goodState{
			color: #E87439 !important;
			font-size: .24rem;
			letter-spacing: 1px;
		}		
		.goodTime{
			display: inline-block;
			margin-top: .05rem;
			font-size: .24rem;
			color: #E87439;
		}
		.goodImg{
			display: block;
			height: 2.5rem;
			margin:  .25rem auto;
			background-size: cover;
			background-repeat: no-repeat;
			background-position: center center;
		}
		.goodName{
			color: #323232;
			font-size: .26rem;
			text-align: center;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.market{
			color: #323232;
			font-size: .2rem;
			text-align: center;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.goodNowPrice{
			color: #E87439;
			font-size: .24rem;
			text-align: center;
			span{
				font-size: .26rem;
			}
		}
		.bottomBox{
			border-top: 1px solid #F2F2F2;
			margin-top: .1rem;
			width: 100%;
			display: flex;
			display: -webkit-flex;
			justify-content: center;
			align-items: center;
			.userImg{
				display: block;
				width: .55rem;
				height: .55rem;
				border-radius: 50%;
  				background-size: cover;
  				background-repeat: no-repeat;
				background-position: center center;
				margin-right: .2rem;
			}
			.userInfo{
			
				display: flex;
				display: -webkit-flex;
				flex-direction: column;
				padding: 0 !important;
				.userName{
					font-size: .24rem;
				}
				.userIP{
					font-size: .24rem;
				}
			}
		}
	}
}
</style>