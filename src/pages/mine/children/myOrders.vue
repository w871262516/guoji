<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">我的订单</span>
			</von-header>
			<div class="tabs">
		  			<tabs :tab-items="tabs" :tab-index="tabIndex" :on-tab-click="onTabClick" top="0" style="width: 100%;"></tabs>
				</div>
			<quick-loadmore :top-method="onRefresh" ref="vueLoad" 
                    :top-status-change="handleStatusChange" 
                    :bottom-method="onInfinite" 
                    :bottom-status-change="handleBottomStatusChange" 
                    :disable-top="disableTop" :disable-bottom="disableBottom" >
		  		<order-part v-for="(data,index) in 	allDatas" :data="data" class="mt30" :tabIndex="tabIndex" v-if="loadFinish && allDatas.length>0" @sureGot="sureGot"></order-part>
		  		<!--<h5 v-if="allDatas < 1 && loadFinish == true">暂无订单</h5>-->
			</quick-loadmore>	
	  	</div>
	</div>
</template>

<script>
	import orderPart from './components/orderPart.vue'
	export default{
		name:'myOrders',
		components:{
	  		orderPart
		},
		data(){
			return{
				token:localStorage.getItem('token'),
				tabs:['全部','待付款','待发货','待收货','待评价','售后'],
				tabIndex:0,
				allDatas:[],
				flag:'fresh',
		        disableTop:false,//是否禁止下拉，默认允许
		        disableBottom:false,
		        loadFinish:true,
		        isAll:false,
		        per:6,//前端自定义每页请求多少条数据
				page:1,
				urlType:0 //定义访问路由
			}
		},
		watch:{
			tabIndex(val){ //切换tab时设置this.page = 1
				this.allDatas = []
				console.log("##########tabIndex############",this.flag);
				
			 	switch (val){
			 		case 0:
			 			this.urlType = ''//0全部订单
			 			this.page = 1
			 			this.isAll = false
			 			this.flag == 'fresh'
			 			this.getOrders()
			 			break;
			 		case 1:
			 			this.urlType = 1//1待付款订单
			 			this.page = 1
			 			this.isAll = false
			 			this.flag == 'fresh'
			 			this.getOrders()
			 			break;
			 		case 2:
			 			this.urlType = 2//2待发货订单
			 			this.page = 1
			 			this.isAll = false
			 			this.flag == 'fresh'
			 			this.getOrders()
			 			break;
			 		case 3:
			 			this.urlType = 3//3待收货订单
			 			this.page = 1
			 			this.isAll = false
			 			this.flag == 'fresh'
			 			this.getOrders()
			 			break;
			 		case 4:
			 			this.urlType = 4//4待评价订单
			 			this.page = 1
			 			this.isAll = false
			 			this.flag == 'fresh'
			 			this.getOrders()
						 break;
					case 5:
						this.urlType = 5//5售后退款订单
						this.page = 1
						this.isAll = false
						this.flag == 'fresh'
						this.getAfterSaleList()
						break;
			 		default:
			 			break;
			 	}
			},
			loadFinish(val){
				this.loadFinish = val
			}
		},
		methods:{
			back(){
				this.$router.go(-1)
			},
			onTabClick(index){
				this.tabIndex = index
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
				if(this.urlType == 5){
					this.getAfterSaleList()
				}else{
					this.getOrders()
				}
				
	    	},
	    	onInfinite(){//上拉加载
	    		this.disableTop = true
				this.flag = 'infinite'
				this.page++ //下一页
				if(this.urlType == 5){
					this.getAfterSaleList()
				}else{
					this.getOrders()
				}
	    	},
			getOrders(){//获取订单 type为类型路由
				let that = this
	    		if(!that.loadFinish){
	    			return
	    		}
				that.$axios({
					method:'get',
					url:that.GLOBAL.develop_url+'api/hompage/orderlist',
					params:{
						token:that.token,
						type:that.urlType,
						page:that.page
					},
					xhrFields:{
		    			withCredentials:true
	    			},
		    		crossDomain:true,
		    		headers: { //解决跨域
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				}).then(function(res){
					console.log(res.data)
					var ti = new Date;
					switch(res.data.code){
						case 200:
							if(res.data.data.length == 0){
								that.disableBottom = true
								that.$refs.vueLoad.onBottomLoaded(false)
								if(that.flag == 'fresh'){
									that.allDatas = []
									that.isAll = true
		    						that.$refs.vueLoad.onTopLoaded()
								}else{
									that.isAll = true
								}
							}else{
								that.disableBottom = false
								that.$refs.vueLoad.onBottomLoaded(true)
								if(that.flag == 'fresh'){
									that.allDatas = []
									res.data.data.forEach(function(item){
										item.photo =  item.photo
										item.thumb =  item.thumb
										item.dl_time = that.timeFormer(item.c_time+24*60*60*3)
										if(ti.getTime()/1000<item.c_time+24*60*60*3){
											item.overTime = false
										}else{
											item.overTime = true
										}
										item.c_time = that.timeFormer(item.c_time)
										that.allDatas.push(item)
									})
									
		    						that.$refs.vueLoad.onTopLoaded()
								}else{
									res.data.data.forEach(function(item){
										item.photo =  item.photo
										item.thumb =  item.thumb
										item.dl_time = that.timeFormer(item.c_time+24*60*60*3)
										if(ti.getTime()/1000<item.c_time+24*60*60*3){
											item.overTime = false
										}else{
											item.overTime = true
										}
										item.c_time = that.timeFormer(item.c_time)
										that.allDatas.push(item)
									})
								}
							}
							break;
						case "400":
							$toast.show('获取用户信息失败，请重新登录', 1000).then(() => {
								that.$router.push('/login')
							})
							break;
					}
					if(res.data.code==404){
						$toast.show(res.data.msg, 1000).then(() => {
							that.$router.push('/login')
						})
					}
	    			that.loadFinish = true
				}).catch(function(err){
					//$toast.show('网络错误', 2000).then(() => {})
				})
			},
			getAfterSaleList(){
				let that = this
	    		if(!that.loadFinish){
	    			return
	    		}
				that.$axios({
					method:'post',
					url:that.GLOBAL.develop_url+'api/hompage/after_sale_list',
					data:{
						token:that.token,
						page:that.page
					},
	    			transformRequest:[function(data){
	    				let ret = ''
	    				for(let it in data){
	    					ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
	    				}
	    				return ret
	    			}],
					xhrFields:{
		    			withCredentials:true
	    			},
		    		crossDomain:true,
		    		headers: { //解决跨域
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				}).then(function(res){
					console.log(res.data)
					switch(res.data.code){
						case 200:
							if(res.data.data.length == 0){
								that.disableBottom = true
								that.$refs.vueLoad.onBottomLoaded(false)
								if(that.flag == 'fresh'){
									that.allDatas = []
									that.isAll = true
		    						that.$refs.vueLoad.onTopLoaded()
								}else{
									that.isAll = true
								}
							}else{
								that.disableBottom = false
								that.$refs.vueLoad.onBottomLoaded(true)
								if(that.flag == 'fresh'){
									that.allDatas = []
		    						that.$refs.vueLoad.onTopLoaded()
								}
								res.data.data.forEach(function(item){
									item.business_logo =  item.logo
									item.business_name =  item.name
									item.status =  item.refund_status
									item.order_sn =  item.refund_num
									item.thumb =  eval(item.thumbs)[0].path
									item.c_time = that.timeFormer(item.c_time)
									switch(item.status){
										case 0: item.statusText = '申请中'; break;
										case 1: item.statusText = '商家拒绝 '; break;
										case 2: item.statusText = '商家同意'; break;
										case 3: item.statusText = '退款申请完成'; break;
										case 4: item.statusText = '已取消退款'; break;
									}
									that.allDatas.push(item)
								})
							}
							break;
						case "400":
							$toast.show('获取用户信息失败，请重新登录', 1000).then(() => {
								that.$router.push('/login')
							})
							break;
					}
					if(res.data.code==404){
						$toast.show(res.data.msg, 1000).then(() => {
							that.$router.push('/login')
						})
					}
	    			that.loadFinish = true
				}).catch(function(err){
					//$toast.show('网络错误', 2000).then(() => {})
				})
			},
			sureGot(data){
				console.log(data);
				if(data==2){
					this.getAfterSaleList()
				}else{
					this.getOrders()
				}
				
			},
		},
		created(){
			this.tabIndex = this.$route.params.index ||0
			if(this.tabIndex==0){
				this.getOrders()
			}
		}
	}
</script>

<style scoped lang="less">
.page-content {
  	padding-top: 93px;
  	.mt30{
  		margin-top: .3rem;
  	}
  	.tabs{
  		position: fixed;
  		top: 44px;
  		width: 100%;
  	}
}
</style>