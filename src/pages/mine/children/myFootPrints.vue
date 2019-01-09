<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">我的足迹</span>
			  <button class="button button-icon headWord" slot="right" @click="clearFootPrints">
			  	清空足迹
			  </button>
			</von-header>
			<quick-loadmore :top-method="onRefresh" ref="vueLoad" 
                    :top-status-change="handleStatusChange" 
                    :bottom-method="onInfinite" 
                    :bottom-status-change="handleBottomStatusChange" 
                    :disable-top="disableTop" :disable-bottom="disableBottom" >
		  		<list class="list-ios item-icon-right" v-if="footPrintLists != null">
					<item class="myItem" v-for="(list,index) in footPrintLists" @click.native="toGoodInfo(list.id,list.mid,list.room,list.time,list.start,list.overTime)">
						<div :style="{backgroundImage:'url('+list.thumb+')'}" class="img"></div>
						<div class="infoBox">
							<p>{{ list.title }}</p>
							<p>市场价：￥{{ list.market_price }}</p>
							<p class="default">当前价：￥{{ list.price }}</p>
						</div>
						<span class="default deleteBtn" @click="deleteThisFootPrint(list.id)">
							删除
						</span>
						<span class="default" v-if="list.overTime">活动已过期</span>
					</item>
				</list>
				<h5 v-else>暂无数据</h5>
			</quick-loadmore>
	  	</div>
  	</div>
</template>

<script>
	export default{
		name:'myFootPrints',
		data(){
			return{
				footPrintLists:[],
				flag:'fresh',
		        disableTop:false,//是否禁止下拉，默认允许
		        disableBottom:false,
		        loadFinish:true,
		        isAll:false,
		        pe:10,//设置默认取10条数据
				page:1
			}
		},
		watch:{
			loadFinish(val){
				this.loadFinish = val
			}
		},
		methods:{
			back(){
				this.$router.go(-1)
			},
			toGoodInfo(id,mid,room,time,start,overTime){
				if(overTime){
					$toast.show('活动已结束！',1000)
					return
				}
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
			},
			handleStatusChange(status) {
		      // status监控下拉刷新状态--等待/下拉/到达阙值/刷新
		      const TOPSTATUS = {
		        wait: "wait",
		        pulling: "pulling",
		        limit: "limit",
		        loading: "loading"
		      }; 
		    },
		    handleBottomStatusChange(status) {
		      // status监控上拉加载状态--等待/加载/没有更多数据  
		      const BOTTOMSTATUS = {
		        wait: "wait",
		        loading: "loading",
		        nodata: "nodata"
		      };
		    },
	    	onRefresh(){ //下拉刷新  		
	    		this.disableBottom = true
    			this.flag = 'fresh'
	    		this.page = 1 //第一页
				this.getMyFootPrints()
	    	},
	    	onInfinite(){//上拉加载
	    		this.disableTop = true
				this.flag = 'infinite'
				this.page++ //下一页
				this.getMyFootPrints()
	    	},
			getMyFootPrints(){//获取足迹
				let that = this
	    		if(!that.loadFinish){
	    			return
	    		}
				that.$axios({
					method:'get',
					url:that.GLOBAL.develop_url+'api/hompage/footprint',
					params:{
						token:localStorage.getItem('token'),
						pe:that.per,
						page:that.page
					},
					xhrFields:{
						widthCredentials:true
					},
					crossDomain:true,
					header:{
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				}).then(function(res){
					console.log(res.data)
					var time = new Date;
					switch (res.data.code){
						case "200":	
							if(res.data.data == null||res.data.data.length<1){
			    				that.isAll = true
			    			}
			    			if(that.flag == 'fresh'){
								that.footPrintLists = []
			    				that.$refs.vueLoad.onTopLoaded();
			    				that.disableBottom = false
			    				that.isAll = false
								res.data.data.forEach(item => {
									if(time.getTime()/1000<Number(item.auction_end_time)){
										item.overTime = false
									}else{
										item.overTime = true
									}
									that.footPrintLists.push(item)
								});
			    			}else{
			    				if(that.isAll){
			    					that.disableBottom = true
			    					that.$refs.vueLoad.onBottomLoaded(false)
			    				}else{
									res.data.data.forEach(item => {
										
										if(time.getTime()/1000<Number(item.auction_end_time)){
											item.overTime = false
										}else{
											item.overTime = true
										}
										that.footPrintLists.push(item)
									});
			    					that.disableBottom = false
			    					that.$refs.vueLoad.onBottomLoaded(true)
			    				}
			    			}
			    			if(that.footPrintLists!=null){
			    				that.footPrintLists.thumb = 'http://img.paipaiwang.com.cn/' + res.data.data.thumb
			    			}
							break;
						case "400":
							$toast.show('获取信息失败，请重新登录！', 1000).then(() => {
								that.$router.push('/login')
							})
						default:
							break;
					}
	    			that.loadFinish = true
				})
			},
			deleteThisFootPrint(id){//删除足迹
				let that = this
				that.$axios({
					method:'get',
					url:that.GLOBAL.develop_url+'api/hompage/footprintdel',
					params:{
						token:localStorage.getItem('token'),
						id:id
					},
					xhrFields:{
						widthCredentials:true
					},
					crossDomain:true,
					header:{
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				}).then(function(res){
					console.log(res.data)
					switch (res.data.code){
						case 200:	
							$toast.show('删除成功！', 1000).then(() => {
								that.page=1
								that.flag == 'fresh'
								that.getMyFootPrints()
							})
							break;
						case "400":
							$toast.show('获取信息失败，请重新登录！', 1000).then(() => {
								that.$router.push('/login')
							})
						default:
							break;
					}
					if(res.data.code==404){
						$toast.show(res.data.msg, 1000).then(() => {
							that.$router.push('/login')
						})
					}
				})
			},
			clearFootPrints(){//清空足迹
				let that = this
				that.$axios({
					method:'get',
					url:that.GLOBAL.develop_url+'/api/hompage/footprintdelall',
					params:{
						token:localStorage.getItem('token'),
					},
					xhrFields:{
						widthCredentials:true
					},
					crossDomain:true,
					header:{
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				}).then(function(res){
					console.log(res.data)
					switch (res.data.code){
						case 200:	
							$toast.show('清空成功！', 1000).then(() => {
								that.page=1
								that.flag == 'fresh'
								that.getMyFootPrints()
							})
							break;
						case "400":
							$toast.show('获取信息失败，请重新登录！', 1000).then(() => {
								that.$router.push('/login')
							})
						default:
							break;
					}
					if(res.data.code==404){
						$toast.show(res.data.msg, 1000).then(() => {
							that.$router.push('/login')
						})
					}
				})
			}
		},
		created(){
			this.flag = 'fresh'
			this.getMyFootPrints()
		}
	}
</script>

<style scoped lang="less">
.page-content {
  	padding-top: 44px;
	color: #323232;
		.list-ios{
	  		padding-right:0 !important;
	  		box-shadow: 0px 3px 7px 0px rgba(174, 173, 173, 0.18);
	  		margin-bottom:0 !important;
	  		z-index:1;
	  	.myItem{
	  		display: flex;
	  		display: -webkit-flex;
	  		justify-content: flex-start;
	  		align-items: center;
	  		position:relative;
	  		.img{
	  			display: block;
	  			width: 1.8rem;
	  			height: 1.8rem;
	  			border-radius: 5px;
	  			margin-right: .25rem;
  				background-size: cover;
  				background-repeat: no-repeat;
  				background-position: center center;
	  		}
	  		.infoBox{
	  			width: calc(100% - 2rem);
	  			height: 1.8rem;
	  			display: flex;
	  			display: -webkit-flex;
	  			justify-content: space-around;
	  			flex-direction: column;
	  			p{
	  				height:.28rem;
	  				line-height: .28rem;
	  				&:first-child{
	  					font-size: .28rem;
	  				}
	  				&:nth-child(2){
	  					font-size: .22rem;
	  				}
	  				&:last-child{
	  					font-size: .28rem;
	  				}
	  			}
	  		}
	  		.deleteBtn{
	  			text-align: center;
	  			font-size: .24rem;
	  			position: absolute;
	  			right: .2rem;
	  			bottom: 0;
	  			transform: translateY(-50%);
	  			-webkit-transform: translateY(-50%);
	  			padding: .15rem .25rem;
	  			border-radius: 5px;
	  			border: 1px solid #E87439;
	  		}
	  	}
	  }
	  
	.headWord{
		font-size: .26rem !important;color: #E87439 !important;
	}
}
.default{
	color: #E87439 !important;
}
h5{text-align: center;color: #323232;height: 1rem;line-height: 1rem;width: 100%;}
</style>