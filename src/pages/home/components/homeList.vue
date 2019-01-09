<template>
	<list class="list">
	  	<item v-for="(data,index) in datas" :key="index">
	  		<div @click="toGoodInfo(data.id,data.mid,data.room,data.time,data.start)">
				<div :style="{backgroundImage:'url('+data.thumb+')'}" class="goodImg"></div>
			    <div class="userBox">
					<div :style="{backgroundImage:'url('+data.business.logo+')'}" class="img"  v-if="data.business"></div>
			    	<div class="infoBox">
			    		<h3>{{data.title}}</h3>
			    		<p>
			    			<span>当前价：{{data.price}}</span>
			    		</p>
			    	</div>
			    </div>
		    	<div class="bottom">
		    		<i v-if="data.time>0 && data.start>0">即将开始</i>
		    		<i v-if="data.time>0 && !data.start">参与竞拍</i>
		    		<i v-if="data.time<=0 && !data.period_new && data.period">出价结束</i>
		    		<i v-if="data.time<=0 && !data.period_new && !data.period">活动结束</i>
		    		<span v-if="data.start>0">{{data.start | expTime}}</span>
		    		<span v-if="!data.start">{{data.time | expTime}}</span>
		    	</div>
	  		</div>
	  	</item>
	</list>
</template>

<script>
	export default{
		name:'homeList',
		props:['datas'],
		data(){
			return{
			}
		},
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
				if(s>0 && s<=60){
					if(s<10){
						let t = '00' + ':' + '00'  + ':' +'0'+ parseInt(s)
						return t
					}else{
						let t = '00' + ':' + '00'  + ':' + parseInt(s)
						return t
					}
					
				}else{
					return 
				}
			}
		},
		methods:{
			toGoodInfo(id,mid,room,time,start){
				if(mid == undefined){
					mid = "0"
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
						mid:mid,
						time:time,
						start:start
					}
				})
				}
			}
		},
		mounted(){
			setInterval(()=>{
				for(let index in this.$props.datas){
					if(this.$props.datas[index]["start"]){
						let start = this.$props.datas[index]["start"]
						start -- 
						this.$props.datas[index]["start"]=start
					}else{
						let time = this.$props.datas[index]["time"]
						if(time>0){
							time--
							this.$props.datas[index]["time"]=time
						}
					}
				}
			},1000)
		}
	}
</script>

<style scoped lang="less">
.list{
	margin-bottom: 0 !important;
}
	.item{
		padding:0 0 2px 0 !important;
		margin-top: .17rem;
		.goodImg{
			display: block;
			padding-top: 35%;
			width: 4.4rem;
			margin: 0.2rem auto;
			background-size: cover;
			background-repeat: no-repeat;
			background-position: center center;
		}
		.userBox{
			padding: .21rem .21rem .12rem;
			display: flex;
			display: -webkit-flex;
			flex: 1;
			justify-content: flex-start;
			position: relative; 
			.img{
				display: inline-block;
				height: .75rem;
				width: .75rem;
				border-radius: 50%;
				margin-right: .21rem;
  				background-size: cover;
  				background-repeat: no-repeat;
  				background-position: center center;
			}
			&:after{
				content: '';
				display: block;
				height: 1px;
				width: 95%;
				color: #efefef;
				background-color: #efefef;
				position: absolute;
				bottom: 0;
				left: 2.5%;
			}
			.infoBox{
				height: .75rem;
				display: flex;
				display: -webkit-flex;
				flex-direction: column;
				justify-content: space-around;
				h3{
					font-size: .26rem;
					color: #000;
				}
				p{
					display: flex;
					display: -webkit-flex;
					flex-direction: row;
					font-size: .24rem;
					span{
						display: inline-block;
						color:#e87439;
					}
					
					
				}
			}	
		}
		.bottom{
			display: flex;
			display: -webkit-flex;
			justify-content: space-between;
			padding: .21rem .21rem .12rem;
			color: #e87439;	
			align-items: center;
			i{
				padding: .12rem .15rem;
				border: 1px solid #e87439;
				font-size: .24rem;
				text-align: center;
				display: inline-block;
				border-radius: 10px;
			}
			span{
				font-size: .24rem;
			}
		}
	}
</style>