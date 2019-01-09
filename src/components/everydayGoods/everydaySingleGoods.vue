<template>
	<div class="box" @click="toGoodInfo(data.id,data.mid,data.room)">
		<p class="default" v-show="data.time>0 && !data.start">{{data.time | expTime}}</p>
		<p class="default" v-show="data.time>0 && data.start>0">即将开始</p>
		<p class="default" v-show="data.time<0 && !data.period_new && data.period">出价结束</p>
		<p class="default" v-show="data.time<0 && !data.period_new && !data.period">活动结束</p>
		<div>
			<div class="left">
				<h3>{{data.title}}</h3>
				<p><span class="default">￥{{data.price}}</span></p>
				<div class="bottom">
					<p v-show="data.time>0 && !data.start">参与竞拍</p>
					<p v-show="data.time>0 && data.start>0">即将开始</p>
					<p v-show="data.time<=0 && !data.period_new && data.period">出价结束</p>
					<p v-show="data.time<=0 && !data.period_new && !data.period">活动结束</p>
		    	</div>
			</div>
			<div class="right">
				<!--<img :src="data.thumb" />-->
				<div :style="{backgroundImage:'url('+data.thumb+')'}" class="img"></div>
			</div>
		</div>
	</div>
</template>

<script>
	export default{
		name:'everydaySingleGoods',
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
				if(this.data.time<=0 && !this.data.period_new && !this.data.period){
					$toast.show('活动已结束！',1000)
					return
				}
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
.box{
	margin-top: .17rem;
	background-color: #fff;
	padding:.27rem .21rem;

	div{
		display: flex;
		display: -webkit-flex;    
		justify-content: space-around;
		align-items: center;
		.left{
			max-width: 35%;
			display: flex;
			display: -webkit-flex;
			flex-direction: column;
			align-items: center;
			h3{
				font-size: .24rem;
				letter-spacing: 1.5px;
				width: 100%;
				text-align: center;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
			}
			p{
				font-size: .2rem;
			}
			.bottom{
				display: flex;
				display: -webkit-flex;
				flex: 1;
				justify-content: space-between;
				padding: .21rem .21rem .12rem;
				color: #e87439;	
				align-items: center;
				i{
					padding: .1rem .15rem;
					border: 1px solid #e87439;
					font-size: .18rem;
					text-align: center;
					display: inline-block;
					border-radius: 10px;
				}
				span{
					font-size: .25rem;
				}
			}
			&:last-child{
				width: 1.7rem;
			}
			img{
				display: block;
				width: 100%;
				margin: 0 auto;
			}
		}
		.right{
			width: 35%;
			max-width: 2.5rem;
			.img{
				display: block;
				width: 100%;
				padding-top: 100%;
				margin: 0 auto;
				background-size: cover;
				background-repeat: no-repeat;
				background-position: center center;
			}
		}
	}
}
.default{
	color: #E87439;
}
</style>