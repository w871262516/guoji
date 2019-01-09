<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header style="background-color: #f3f3f3;box-shadow: none;background-image: none !important;">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title" class="specialBar">
			  	<!--<search-bar v-model="words" :placeholder="placeholder" :searchWidth="searchWidth" :backgroundColor="backgroundColor" :searchPadding="searchPadding"></search-bar>-->
			  	<input type="search" name="search" id="search" v-model.trim="words" :placeholder="placeholder"/>
			  </span>
			  <button class="button button-icon btn" slot="right" @click="onSearch">搜索</button>
			</von-header>
			<svgs style="display: none;"></svgs>
			<tabs :tab-items="tabs" :tab-index="tabIndex" :on-tab-click="onTabClick" top="44px" bgColor="#f3f3f3"></tabs>
			<div class="historyDiv" v-show="showHistory">
				<div class="historyTop">
					<span>历史搜索</span>
					<section class="guide_item" @click="deleteHistory">
			        	<svg class="icon_style">
			                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#delete'"></use>
			        	 </svg>
			        </section>
				</div>
				<div class="historyBox">
					<template v-for="list in historyLists">
						<span @click="reSearch(list.word)">{{list.word}}</span>
					</template>
				</div>
			</div>
			<quick-loadmore ref="vueLoad" 
                    :bottom-method="onInfinite" 
                    :bottom-status-change="handleBottomStatusChange" 
                    :disable-bottom="disableBottom" >
				<div v-show="showHistory==false && searching == false ">
					<!--店家数据-->
					<store-list :list=list v-for="(list,index) in storeLists" :key="index" v-show="tabIndex==0 && storeLists.length > 0"></store-list>
					<!--商品数据-->
					<home-list :datas="homeLists" v-show="tabIndex==1 && homeLists.length > 0"></home-list>
					<!--<h5 v-show="storeLists.length < 1 && tabIndex == 0">找不到对应店铺</h5>
					<h5 v-show="homeLists.length < 1 && tabIndex == 1">找不到对应商品</h5>-->
				</div>
				<h5 v-show="searching">努力搜索中...</h5>
			</quick-loadmore>	
  		</div>
  	</div>
</template>

<script>
	import storeList from '../home/children/niceStores/children/storeList.vue'
	import homeList from '../home/components/homeList.vue'
	import searchBar from '../../components/search/searchBar.vue'
	import svgs from '../mine/children/components/svgs.vue'
	export default{
		name:'search',
		components:{
			searchBar,
			storeList,
			homeList,
			svgs
		},
		data(){
			return{
				words:'',//搜索内容
				showHistory:true,
				searching:false,
				storeLists:[],//过滤后的店铺列表
				homeLists:[],//过滤后的商品列表
		        disableBottom:false,
		        flag:'infinite',
		        isAll0:false,
		        isAll1:false,
		  		tabs:['店铺','商品'],
		  		tabIndex:0,
		  		page0:1,
		  		page1:1,
		  		per:10,
				placeholder:'搜索店铺、商品',//搜索组件的占位符
				searchWidth:'75%', //搜索组件宽度
				backgroundColor:'#eeeeee',
				searchPadding:'0.05rem 0.4rem 0.05rem .87rem' //搜索组件的内补
			}
		},
		computed:{
			historyLists(){
				return this.$store.state.userInfo.searchHistoryLists
			}
		},
		watch:{
			words(val){
				if(this.words.length < 1){
					this.searching = false
					this.showHistory = true
				}
			},
			tabIndex(val){ //切换tab
				this.disableBottom = false
				this.$refs.vueLoad.onBottomLoaded(true)
				switch (val){
					case 0:
						this.storeLists = []
						this.onSearch()
						break;
					case 1:
						this.homeLists = []
						this.onSearch()
						break;
					default:
						break;
				}
			}
		},
		methods:{
			back(){
				this.$router.go(-1)
			},
			reSearch(list){
				this.words = list
				this.onSearch()
			},
		    handleBottomStatusChange(status) {
		      // status监控上拉加载状态--等待/加载/没有更多数据  
		      const BOTTOMSTATUS = {
		        wait: "wait",
		        loading: "loading",
		        nodata: "nodata"
		      };
		    },
	    	onInfinite(){//上拉加载
				this.flag = 'infinite'
				if(this.isAll0 == false && this.tabIndex ==0){
					this.page0++ //下一页
					this.searchStores()
				}
				if(this.isAll1 == false && this.tabIndex == 1){
					this.page1++ //下一页
					this.searchGoods()
				}
	    	},
			deleteHistory(){//删除我的搜索历史记录
				localStorage.removeItem('historyList')
				this.$store.state.userInfo.searchHistoryLists = []
			},
			setLocalStorage(){
				localStorage.removeItem('historyList')
				let js = {'word':this.words}
				this.$store.commit('setSearchHistory',js)
				localStorage.setItem('historyList',JSON.stringify(this.historyLists))
			},
			onTabClick(index){
				this.tabIndex = index
			},
			onSearch(){//点击搜索
				if(!this.words){//判断输入框是否为空
					$toast.show('请输入搜索内容！', 1000).then(() => {})
					return
				}
				this.homeLists = []
				this.storeLists = []
				this.disableBottom = false
				this.$refs.vueLoad.onBottomLoaded(true)
				this.setLocalStorage()
				this.showHistory = false
				this.isAll1 = false
				this.isAll0 = false
				this.page0=1
				this.page1=1
				if(this.tabIndex==0){
					this.searching = true
					this.searchStores()
				}else{
					this.searchGoods()
					this.searching = false
				}
			},
			searchStores(){//搜索店铺
				let that = this
				if(this.isAll0) return;
				that.$axios({
	    			method:'post',
	    			url:that.GLOBAL.develop_url+'api/exsbusines',
	    			data:{
	    				keyword:that.words,
	    				page:that.page0,
	    				per_page:that.per
	    			},
	    			transformRequest:[function(data){
	    				let ret = ''
	    				for(let it in data){
	    					ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
	    				}
	    				return ret
	    			}],
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
	    					that.searching = false
	    					if(res.data.list.length <1){
	    						that.isAll0 = true
								that.disableBottom = true
								that.$refs.vueLoad.onBottomLoaded(false)
	    						if( that.page0 == 1){
									that.storeLists = []
	    						}
	    					}else{
    							that.isAll0==false
	    						if(that.page0 == 1){
	    							that.disableBottom = false
									that.$refs.vueLoad.onBottomLoaded(true)
									res.data.list.forEach(item=>{
										item.bussiness.logo = that.GLOBAL+item.bussiness.logo
									})
									that.storeLists = res.data.list
	    						}else{
	    							that.disableBottom = false
									that.$refs.vueLoad.onBottomLoaded(true)
									res.data.list.forEach(item=>{
										item.bussiness.logo = that.GLOBAL+item.bussiness.logo
										that.storeLists.push(item)
									})
	    						}
								
	    					}
	    					break;
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
			searchGoods(){//搜索商品
				let that = this
				if(this.isAll1) return;
				that.$axios({
	    			method:'post',
	    			url:that.GLOBAL.develop_url+'api/exsearch',
	    			data:{
	    				token:that.$store.state.userInfo.token,
	    				keyword:that.words,
	    				page:that.page1,
	    				per_page:that.per
	    			},
	    			transformRequest:[function(data){
	    				let ret = ''
	    				for(let it in data){
	    					ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
	    				}
	    				return ret
	    			}],
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
	    					that.searching = false
	    					if(res.data.list.length <1){
	    						that.isAll1 = true
								that.disableBottom = true
								that.$refs.vueLoad.onBottomLoaded(false)
	    						if( that.page1 == 1){
									that.homeLists = []
	    						}
	    					}else{
	    						if(that.page == 1){
		    						that.isAll1 = false
									that.disableBottom = false
									that.$refs.vueLoad.onBottomLoaded(true)
									res.data.list.forEach(item=>{
										//item.bussiness.logo = that.GLOBAL+item.bussiness.logo
										that.homeLists.push(item.auction)
									})
									
	    						}else{
	    							that.isAll1 = false
		    						that.disableBottom = false
									that.$refs.vueLoad.onBottomLoaded(true)
									res.data.list.forEach(item=>{
										//item.bussiness.logo = that.GLOBAL+item.bussiness.logo
										that.homeLists.push(item.auction)
									})
	    						}
	    					}
	    					break;
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
			this.tabIndex = 0
			if(localStorage.getItem('historyList')){
				this.$store.state.userInfo.searchHistoryLists = JSON.parse(localStorage.getItem('historyList'))
			}
		}
	}
</script>

<style scoped lang="less">
.page-content {
  	padding-top: 93px;
  	.specialBar{
  		position: absolute;
  		width: 100%;
  		left: 45%;
  		top: 50%;
  		transform: translate(-50%,-50%);
  		-webkit-transform: translate(-50%,-50%);
  		input{
  			display: block;
  			width: 68% !important;
  			margin: 0 auto;
  			background-color: #fff;
  			border-radius: 30px;
  			width: 100%;
  			padding:0.05rem 0.4rem 0.05rem .4rem ;
  		}
  	}	
  	.btn{
  		font-size: .26rem;
  		padding:.025rem .2rem;
  		border-radius: 10px;
  		color: #fff;
  		background-color: #E87439;
  		margin-right: .1rem;
  	}
  	.historyDiv{
  		background-color: #fff;
  		height: 100%;
		padding: .2rem;
  		.historyTop{
  			display: flex;
  			display: -webkit-flex;
  			justify-content: space-between;
  			align-items: center;
  		}
  		.historyBox{
  			width: 100%;
  			display: flex;
  			display: -webkit-flex;
  			flex-wrap: wrap;
  			justify-content: flex-start;
  			span{
  				padding: .15rem .25rem;
  				display: flex;
  				display: -webkit-flex;
  				align-items: center;
  				justify-content: center;
  				font-size: .24rem;
  				background-color: #f1efef;
  				color: #323232;
  				border-radius: 15px;
  				margin-top: .2rem;
  				margin-right: .2rem;
  			}
  		}
  	}
}
.guide_item{
		display: flex;
		display: -webkit-flex;
		align-items: center;
		font-size:.25rem;
		padding: 0 .2rem;
		.icon_style{
			display: inline-block;
			width: .35rem;
			height: .35rem;
		}
	}
h5{text-align: center;color: #323232;height: 2rem;line-height: 2rem;width: 100%;}
</style>