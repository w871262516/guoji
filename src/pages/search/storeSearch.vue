<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header style="background-color: #f3f3f3;">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title" class="specialBar">
			  	<!--<search-bar v-model="words" :placeholder="placeholder" :searchWidth="searchWidth" :backgroundColor="backgroundColor" :searchPadding="searchPadding"></search-bar>-->
			  	<input type="search" name="search" id="search" v-model.trim="words" :placeholder="placeholder"/>
			  </span>
			  <button class="button button-icon btn" slot="right" @click="onSearch">搜索</button>
			</von-header>
			<svgs style="display: none;"></svgs>
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
			<div v-show="showHistory==false && searching == false">
				<home-list :datas="homeLists" v-show="homeLists.length > 0"></home-list>
				<h5 v-show="homeLists.length < 1">找不到对应商品</h5>
			</div>
			<h5 v-show="searching">努力搜索中...</h5>
  		</div>
  	</div>
</template>

<script>
	import homeList from '../home/components/homeList.vue'
	import searchBar from '../../components/search/searchBar.vue'
	import svgs from '../mine/children/components/svgs.vue'
	export default{
		name:'storeSearch',
		components:{
			searchBar,
			homeList,
			svgs
		},
		data(){
			return{
				words:'',//搜索内容
				showHistory:true,
				searching:false,
				homeLists:[],//过滤后的商品列表
		  		page:1,
		  		per:10,
				placeholder:'搜索店铺、商品',//搜索组件的占位符
				searchWidth:'75%', //搜索组件宽度
				backgroundColor:'#eeeeee',
				searchPadding:'0.05rem 0.4rem 0.05rem .87rem' //搜索组件的内补
			}
		},
		computed:{
			historyLists(){
				if(this.$store.state.userInfo.searchStoreHistoryLists.length<0){
					console.log(1)
					return
				}else{
					return this.$store.state.userInfo.searchStoreHistoryLists
				}
				
			}
		},
		watch:{
			words(val){
				if(this.words.length < 1){
					this.searching = false
					this.showHistory = true
				}
			}
		},
		methods:{
			back(){
				this.$router.go(-1)
			},
			reSearch(list){
				console.log(list)
				this.words = list
				this.onSearch()
			},
			deleteHistory(){//删除我的搜索历史记录
				localStorage.removeItem('storeHistoryList')
				this.$store.state.userInfo.searchStoreHistoryLists = []
			},
			onSearch(){//点击搜索
				if(!this.words){//判断输入框是否为空
					$toast.show('请输入搜索内容！', 1000).then(() => {})
					return
				}
				localStorage.removeItem('storeHistoryList')
				let js = {'word':this.words}
				this.$store.commit('setSearchStoreHistoryLists',js)
				localStorage.setItem('storeHistoryList',JSON.stringify(this.historyLists))
				this.showHistory = false
				this.searching = true
				let that = this
				that.$axios({
	    			method:'post',
	    			url:that.GLOBAL.develop_url+'api/exsearch',
	    			data:{
	    				token:that.$store.state.userInfo.token,
	    				keyword:that.words,
	    				page:that.page,
	    				per_page:that.per,
	    				bid:that.$route.params.bid,
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
	    					res.data.list.forEach(i=>{
	    						that.homeLists.push(i.auction)
	    					})
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
			if(localStorage.getItem('storeHistoryList')){
				this.$store.state.userInfo.searchStoreHistoryLists =JSON.parse(localStorage.getItem('storeHistoryList'))
			}
		}
	}
</script>

<style scoped lang="less">
.page-content {
  	padding-top:44px;
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