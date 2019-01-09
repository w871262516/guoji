<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">我的喜欢</span>
			</von-header>
	  		<tabs :tab-items="tabs" :tab-index="tabIndex" :on-tab-click="onTabClick" top="44px"></tabs>
  			<tabs :tab-items="goodsTabs" :tab-index="goodsTabIndex" :on-tab-click="onGoodsTabClick" top="94px"  v-show="tabIndex==1"></tabs>
  			<quick-loadmore :top-method="onRefresh" ref="vueLoad" 
                    :top-status-change="handleStatusChange" 
                    :bottom-method="onInfinite" 
                    :bottom-status-change="handleBottomStatusChange" 
                    :disable-top="disableTop" :disable-bottom="disableBottom"  :class="{padingtop140:tabIndex==1}" >
		  		<div v-show="tabIndex==0" v-if="lists.length >0">
					<circle-list :list="lists"  bottomBarWidth="100%"></circle-list>
		  		</div>
		  		<!--<h5 v-if="(lists.length < 1 || oneYuanGoodsDatas.length < 1 || everydayGoodsDatas.length < 1) && loadFinish == true">暂无喜欢</h5>-->
		  		<div v-show="tabIndex==1">
		  			<div class="doubleGoodsFlexBox">
		  				<double-goods :data="data"  v-for="(data,index) in oneYuanGoodsDatas" :key="index" v-show="goodsTabIndex==0"></double-goods>
		  			</div>
		  			<single-goods :data="data" v-for="(data,index) in everydayGoodsDatas" :key="index" v-show="goodsTabIndex==1"></single-goods>
		  		</div>
			</quick-loadmore>	
  		</div>
  	</div>
</template>

<script>
	import headTop from '../../../components/header/header.vue'
	import circleList from '../../circle/components/circleList.vue'
	import singleGoods from '../../../components/everydayGoods/everydaySingleGoods.vue'
	import doubleGoods from '../../../components/common/doubleGoods.vue'
	export default{
		name:'myLoves',
		components:{
			headTop,
			circleList,
			singleGoods,
			doubleGoods
		},
		data(){
			return{
				title:'我的喜欢',
				tabIndex:0,
				tabs:[
					'喜欢的圈子',
					'喜欢的商品'
				],
				goodsTabs:[
					'一元捡漏',
					'每日精品'
				],
				goodsTabIndex:0,
				flag:'fresh',
		        disableTop:false,//是否禁止下拉，默认允许
		        disableBottom:false,
		        loadFinish:true,
		        isAll:false,
		        per:10,//前端自定义每页请求多少条数据
				page:1,
				lists:[],
				everydayGoodsDatas:[],
				oneYuanGoodsDatas:[]
			}
		},
		watch:{
			tabIndex(val){ //切换tab时设置this.page = 1
			 	switch (val){
			 		case 0:
			 			this.page = 1
			 			this.isAll = false
			 			this.flag == 'fresh'
			 			this.lists = []
						this.getMyLoveCircles()
			 			break;
			 		case 1:
			 			this.goodsTabIndex = 0
			 			this.oneYuanGoodsDatas = []
			 			this.page = 1
			 			this.isAll = false
			 			this.flag == 'fresh'
						this.getMyLoveGoods()
			 			break;
			 	}
			},
			goodsTabIndex(val){
	 			if(val==0){
	 				this.oneYuanGoodsDatas = []
	 			}else{
	 				this.everydayGoodsDatas = []
	 			}
	 			this.page = 1
	 			this.isAll = false
	 			this.flag == 'fresh'
				this.getMyLoveGoods()
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
			onGoodsTabClick(index){
				this.goodsTabIndex = index
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
				this.$refs.vueLoad.onBottomLoaded(false)
    			this.flag = 'fresh'
	    		this.page = 1 //第一页
	    		if(this.tabIndex==0){
	    			this.getMyLoveCircles()
	    		}else{
	    			this.getMyLoveGoods()
	    		}
	    	},
	    	onInfinite(){//上拉加载
	    		this.disableTop = true
				this.flag = 'infinite'
				this.page++ //下一页
	    		if(this.tabIndex==0){
	    			this.getMyLoveCircles()
	    		}else{
	    			this.getMyLoveGoods()
	    		}
	    	},
			getMyLoveCircles(){ //获取我喜欢的圈子
				let that = this
	    		if(!that.loadFinish){
	    			return
	    		}
				that.$axios({
					method:'post',
					url:that.GLOBAL.develop_url+'api/hompage/myfavcircle',
					data:{
						token:localStorage.getItem('token'),
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
						case "200":
							if(res.data.data == null){
								that.disableBottom = true
								that.$refs.vueLoad.onBottomLoaded(false)
								if(that.flag == 'fresh'){
									that.isAll = true
			    					that.lists = []
			    					that.$refs.vueLoad.onTopLoaded();
								}else{
									that.isAll = true
								}
							}else{
								that.disableBottom = false
								that.$refs.vueLoad.onBottomLoaded(true)
								if(that.flag == 'fresh'){
									that.lists = []
									res.data.data.forEach(i=>{
										i.title = that.toChina(i.title)
										i.head =  i.head
										i.c_time = that.timeFormer(i.c_time)
			    						i.photo = JSON.parse(i.photo)
										that.lists.push(i)
									})
									that.$refs.vueLoad.onTopLoaded()
								}else{
									res.data.data.forEach(i=>{
										i.title = that.toChina(i.title)
										i.head =  i.head
										i.c_time = that.timeFormer(i.c_time)
			    						i.photo = JSON.parse(i.photo)
										that.lists.push(i)
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
			getMyLoveGoods(){ //获取我喜欢的商品
				let that = this
	    		if(!that.loadFinish){
	    			return
	    		}
				that.$axios({
					method:'get',
					url:that.GLOBAL.develop_url+'api/hompage/myfavgoods',
					params:{
						token:localStorage.getItem('token'),
						per_page:that.per,
						page:that.page,
						room:that.goodsTabIndex+1//1必拍，2汇拍
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
					if(res.data.code == 200||res.data.code == 1000033||res.data.code == 0){
						if(res.data.data.length<1){
							that.disableBottom = true
							that.$refs.vueLoad.onBottomLoaded(false)
							if(that.flag == 'fresh'){
								that.oneYuanGoodsDatas = []
								that.everydayGoodsDatas = []
								that.isAll = true
								that.$refs.vueLoad.onTopLoaded()
							}else{
								that.isAll = true
							}
						}else{
							that.disableBottom = false
							that.$refs.vueLoad.onBottomLoaded(true)
							if(that.flag == 'fresh'){
								if(that.goodsTabIndex==1){
									that.everydayGoodsDatas = []
									res.data.data.forEach(function(item){
										
										item.photo = 'http://img.paipaiwang.com.cn/' + item.photo
										that.everydayGoodsDatas.push(item)
									})
								}else{
									that.oneYuanGoodsDatas = []
									res.data.data.forEach(function(item){
										that.oneYuanGoodsDatas.push(item)
									})
								}
								that.$refs.vueLoad.onTopLoaded()
							}else{
								if(that.goodsTabIndex==1){
									res.data.data.forEach(function(item){
										that.everydayGoodsDatas.push(item)
									})
								}else{
									res.data.data.forEach(function(item){
										that.oneYuanGoodsDatas.push(item)
									})
								}
									
							}
						}
					}else if(res.data.code==404){
						$toast.show(res.data.msg, 1000).then(() => {
							that.$router.push('/login')
						})
					}else{
						$toast.show(res.data.msg, 1000)
					}
	    			that.loadFinish = true
				}).catch(function(err){
					//$toast.show('网络错误', 2000).then(() => {})
				})
			}
		},
		created(){
			this.getMyLoveCircles()
		}
	}
</script>

<style lang="less"	scoped>
.page-content {
  	padding-top: 93px;
	color: #323232;
  	font-size: .23rem;
	.doubleGoodsFlexBox{
		display: flex;
  		display: -webkit-box;
  		display: -webkit-flex;
  		flex-wrap: wrap;
  		flex-direction: row;
  		justify-content: space-between;
		padding: 0 2.5%;	  	
	}
  	.padingtop140{
  		margin-top: 52px;
  	}
  	
h5{
	height: 1rem;
	width: 100%;
	line-height: 1rem;
	text-align: center;
	color: #323232;
}
}
</style>