<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">积分排行榜</span>
			</von-header>
	  		<tabs :tab-items="tabs" :tab-index="tabIndex" :on-tab-click="onTabClick" top="44px"></tabs>
	  		
			<quick-loadmore :top-method="onRefresh" ref="vueLoad" 
                    :top-status-change="handleStatusChange" 
                    :bottom-method="onInfinite" 
                    :bottom-status-change="handleBottomStatusChange" 
                    :disable-top="disableTop" :disable-bottom="disableBottom" >
	  			<ranking :rankingList="rankingList"></ranking>
			</quick-loadmore>	
  		</div>
  	</div>
</template>

<script>
	import ranking from '../components/ranking.vue'
	export default{
		name:'integrationRanking',
		components:{
			ranking
		},
		data(){
			return{
				tabs:[
					'今日',
					'本周',
					'本月'
				],
				tabIndex:0,
				flag:'fresh',
		        disableTop:false,//是否禁止下拉，默认允许
		        disableBottom:false,
		        loadFinish:true,
		        isAll:false,
		        per:10,//前端自定义每页请求多少条数据
				page:1,
				urlType:'personscorerandd', //定义访问路由
				rankingList:{
					all_info:[],
					per_info:{},
				}
			}
		},
		watch:{
			tabIndex(val){ //切换tab时设置this.page = 1
				this.rankingList = {
					all_info:[],
					per_info:{},
				}
			 	switch (val){
			 		case 0:
			 		console.log("case 0")
			 			this.urlType = 'personscorerandd'
			 			this.page = 1
			 			this.isAll = false
			 			this.flag = 'fresh'
			 			this.getIntegrationRanking()
			 			break;
			 		case 1:
			 		console.log("case 1")
			 			this.urlType = 'personscorerandw'
			 			
			 			this.page = 1
			 			this.isAll = false
			 			this.flag = 'fresh'
			 			this.getIntegrationRanking()
			 			break;
			 		case 2:
			 		console.log("case 2")
			 			this.urlType = 'personscorerandm'
			 			this.page = 1
			 			this.isAll = false
			 			this.flag = 'fresh'
			 			this.getIntegrationRanking()
			 			break;
			 		default:
			 			break;
			 	}
			},
			loadFinish(val){
				console.log("val",val)
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
	    		this.disableBottom = true,
    			this.flag = 'fresh',
	    		this.page = 1,//第一页
			 		console.log("onRefresh")
				this.getIntegrationRanking()
	    	},
	    	onInfinite(){//上拉加载
	    		this.disableTop = true,
				this.flag = 'infinite',
				this.page++, //下一页
			 		console.log("onInfinite")
				this.getIntegrationRanking()
	    	},
			getIntegrationRanking(){
				console.log(this.flag)
				let that = this
	    		if(!that.loadFinish){
	    			return
	    		}
				that.$axios({
					method:'get',
					url:that.GLOBAL.develop_url+'api/hompage/'+that.urlType,
					params:{
						token:localStorage.getItem('token'),
						pe:that.per,
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
					switch(res.data.code){
						case 200:
							if(res.data.data==null||res.data.data.length<1){
								$toast.show("暂无排名", 1000)
			    				that.isAll = true
								that.disableBottom = true
								that.$refs.vueLoad.onBottomLoaded(false)
								if(that.flag == 'fresh'){
										that.$refs.vueLoad.onTopLoaded()
								}
			    			}else{
		    					that.disableBottom = false
		    					that.$refs.vueLoad.onBottomLoaded(true)
		    					
			    				if(that.flag == 'fresh'){
			    					console.log(that.rankingList)
				    				that.rankingList = res.data.data
				    				that.$refs.vueLoad.onTopLoaded();
				    				that.isAll =false
				    				
				    			}else{
				    				console.log(that.rankingList)
				    				if(that.isAll){
				    					that.disableBottom = true
				    					that.$refs.vueLoad.onBottomLoaded(false)
				    				}else{
				    					res.data.data.all_info.forEach(o=>{
				    						that.rankingList.all_info.push(o)
				    					})
				    				}
				    			}
			    			}
							break;
						case "400":
							$toast.show('获取用户信息失败，请重新登录', 1000).then(() => {})
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
			}
		},
		created(){
			this.getIntegrationRanking()
		}
	}
</script>

<style lang="less"	scoped>
.page-content {
  	padding-top: 93px;
  	padding-bottom: 1rem;
	color: #323232;
  	font-size: .23rem;
  	
}
</style>