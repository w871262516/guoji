<template>
	<div class="page has-navbar">
	  	<div class="page-content">
	  		<von-header theme="light" style="position: fixed;">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">分类</span>
			</von-header>
				
			<svgs style="display: none;"></svgs>
			
	  		<div class="topBar">
	  			<div class="swiper-container" id="nav">
				    <div class="swiper-wrapper">
				      <div class="swiper-slide" v-for="(tab,index) in tabs" :key="index" >
				        <span>{{tab.catname}}</span></div>
					    <div class="bar">
					       <div class="color"></div>
					    </div>
				    </div>
				</div>
			    <div class="barBottom">
			    	<div class="bar" :class="{default:isDefaultSort==true}" @click="defaultSort">
			    		默认排序
			    	</div>
			    	<div @click="showSort" class="bar" :class="{default:isDefaultSort == false}">
			    		综合排序
			    		<section class="guide_item" :class="{toUp:toUp}">
				        	<svg class="icon_style">
				                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#toDown'"></use>
				          </svg>
				       </section>
			    	</div>
			    	<div @click="showModel" class="bar">
			    		筛选
			    		<section class="guide_item">
				        	<svg class="icon_style">
				                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#filter'"></use>
				          </svg>
				        </section>
			    	</div>
			    	<!--<div class="bar" @click="exchangeGoodsShowType">
			    		<section class="guide_item">
				        	<svg class="icon_style">
				                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#classiflyBig'" v-if="isSingleList"></use>
				                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#classiflySmall'" v-else="isSingleList == false"></use>
				          </svg>
				        </section>
			    	</div>-->
			    	<div class="listSort" v-show="sortDiv">
			        	<list class="list-ios">
							<!--<item @click.native="showSort">
								<p>新品优先</p>
							</item>
							<item @click.native="showSort">
								<p>销量优先</p>
							</item>-->
							<item @click.native="changeSort('2')">
								<p :class="{default:isDefaultSort == false && isSortBy == 'hight'}">价格由低到高</p>
							</item>
							<item @click.native="changeSort('1')">
								<p :class="{default:isDefaultSort == false && isSortBy == 'low'}">价格由高到低</p>
							</item>
						</list>
			        </div>
			    </div>
	  		</div>

			<recommend :users="users"></recommend>
	  		
  			<quick-loadmore :top-method="onRefresh" ref="vueLoad" 
                :top-status-change="handleStatusChange" 
                :bottom-method="onInfinite" 
                :bottom-status-change="handleBottomStatusChange" 
                :disable-top="disableTop" :disable-bottom="disableBottom" >
                <!--v-if="isSingleList"-->
			  		<div class="doubleGoodsFlexBox" >
	  					<double-goods :data="data"  v-for="(data,index) in classiflyDataLists" :key="index"></double-goods>
			  		</div>
					<!--<home-list :datas="classiflyDataLists" v-if="isSingleList == false"></home-list>-->
			</quick-loadmore>	
			
   			<transition name="fade" enter-active-class="animated fadeInRight faster">
		  		<div class="model" v-show="modelShow">
					<div class="wrap" @click="showModel"></div>	
					<div class="content">
						<p>价格区间 (推荐位段)</p>
						<ul>
							<li :class="{borderLi:borderNum=='border1'}" @click="changeLi('border1')">0-999</li>
							<li :class="{borderLi:borderNum=='border2'}" @click="changeLi('border2')">1000-9999</li>
							<li :class="{borderLi:borderNum=='border3'}" @click="changeLi('border3')">10000以上</li>
						</ul>
						<div class="myPrice">
							<input type="text" v-model="lessPrice" placeholder="最低价" />
							<i></i>
							<input type="text" v-model="maxPrice" placeholder="最高价" />
						</div>
						<div class="contentBottom">
							<div class="reset" @click="resetPrice">
								重置
							</div>
							<div class="finish" @click="requestByPrice">
								完成
							</div>
						</div>
					</div>
		  		</div>
			</transition>
		</div>
	</div>
</template>

<script>
	import Swiper from 'swiper';
	import recommend from '../../../../components/common/recommend.vue'
	import doubleGoods from '../../../../components/common/doubleGoods.vue'
	import svgs from '../../../../components/common/svgs.vue'
//	import homeList from '../../../home/components/homeList.vue'
	export default{
		name:'classiflyPage',
		components:{
			doubleGoods,
			recommend,
			svgs
		},
		data(){
			return{
				borderNum:'',
				sortDiv:false,//综合排序的div
				modelShow:false,//价格区间的model
				toUp:false,//综合排序的小图标旋转样式
				isDefaultSort:true,//默认排序 绑定样式
				isSortBy:'',//综合排序 默认为高到低
				isSingleList:'',//false 为 双列展示，true为单列显示
				lessPrice:'',//筛选最低价
				maxPrice:'',//筛选最高价
				tabIndex:this.$route.params.type || 0,//auction页进classify页 点击的类型值
				users:[],//推荐商家组价 数组
				cate:'{"cid":'+this.$route.params.type+'}',//类型值
				nowCate:0,
				sort:1,//排序 默认为正序
				sendClassiflyData:'',
		        flag:'',
		        page:1,
		        disableTop:false,//是否禁止下拉，默认允许
		        disableBottom:false
				//tabs:this.$store.state.classifly //顶部横向tabs数据
			}
		},
	    computed:{
	    	tabs(){
	    		return this.$store.state.classifly
	    	},
			classiflyDataLists(){//绑定拍卖页数据
			
				// this.resetPrice()
				
	    		let arr = []
	    		this.$store.state.classiflyData.data.forEach(item=>{
	    			if(item.time != -2){
						arr.push(item)
	    			}
	    		})
	    		return arr
	    		//return this.$store.state.classiflyData.data
	    	},
	    	loadFinish(val){//数据加载操作是否已完成  默认加载状态完成 false 为加载中
	    		if(!this.$store.state.classiflyData.loadFinish){
	    			this.$store.state.classiflyData.loadFinish = false
	    		}
	    		return this.$store.state.classiflyData.loadFinish
	    	}
	    },
		watch:{
			cate(val){ //观察头部tabs的值的变化，动态的更新socket参数
				this.nowCate = eval('('+val+')').cid
				this.lessPrice = -1
				this.maxPrice = -1
				this.onRefresh()
			},
			sort(val){//观察排序 一旦改变就触发socket请求
				this.onRefresh()
			},
			loadFinish(val){
	    		this.$store.state.classiflyData.loadFinish = val
	    		if(val){
	    			if(this.classiflyDataLists.length ==0){
						this.disableBottom = true
						this.$refs.vueLoad.onBottomLoaded(false)
						return
	    			}
	    			if(this.flag == "fresh"){
	    				this.disableBottom = false
	    				this.$refs.vueLoad.onBottomLoaded(true);
	    				this.$refs.vueLoad.onTopLoaded();
	    			}
	    			if(this.flag == "infinite"){
	    				this.disableTop = false
	    				this.$refs.vueLoad.onTopLoaded();
	    				if(this.$store.state.classiflyData.isAll){
		    				this.disableBottom = true //禁止上拉
	    					this.$refs.vueLoad.onBottomLoaded(false);//设置底部显示已加载完
							console.log('上拉：所有数据已经加载完')
	    				}else{
	    					this.disableBottom = false //允许上拉
	    					this.$refs.vueLoad.onBottomLoaded(true);//设置底部显示加载中
	    				}	
	    			}
	    		}
	    	}
		},
		methods:{
			back(){ //返回上一页
				this.$router.go(-1)
			},
			changeLi(arg){
				this.borderNum = arg
				switch (arg){
					case 'border1':
						this.lessPrice = 0
						this.maxPrice = 999
						break;
					case 'border2':
						this.lessPrice = 1000
						this.maxPrice = 9999
						break;
					case 'border3':
						this.lessPrice = 10000
						this.maxPrice = 0
						break;
					default:
						break;
				}
			},
			showModel(){//筛选弹窗
			if(this.lessPrice = -1){
				this.resetPrice()
			}
				this.modelShow = !this.modelShow
			},
			resetPrice(){//如果之前传过去时未设定筛选价格 数据返回后 重置价格为'' 否则会input会出现-1 
			
				this.lessPrice = ''
				this.maxPrice = ''
				this.borderNum = ''
			},
			requestByPrice(){//筛选
				this.sendClassiflyData = '{"type":"get_auctions", "page":'+ this.page +', "per_page": 6,"cid":'+this.nowCate+', "for_new": 0, "mid": 0, "room": 0,"path":"classifly","sort":'+this.sort+',"min":'+this.lessPrice+',"max":'+this.maxPrice+'}'
				this.onRefresh()
				this.showModel()
			},
			showSort(){//筛选div
				this.isDefaultSort = false
				this.sortDiv = !this.sortDiv
				if(this.sortDiv){
					this.toUp = true
				}else{
					this.toUp = false
				}
			},
			defaultSort(){//默认排序
				this.isDefaultSort = true
				this.resetPrices()
				this.sort = 1
			},
			resetPrices(){//若没有设置筛选价格 则初始化价格 然后传给后台
				if(this.lessPrice==''){
					this.lessPrice=-1
				}
				if(this.maxPrice==''){
					this.maxPrice=-1
				}
			},
			changeSort(num){//改变排序 价格高低
				if(num == '2'){ //设置排序tab的样式
					this.isSortBy = 'hight'
				}else{
					this.isSortBy = 'low'
				}
				this.sort = num
				this.resetPrices()
				this.sendClassiflyData = '{"type":"get_auctions", "page":'+ this.page +', "per_page": 6,"cid":'+this.nowCate+', "for_new": 0, "mid": 0, "room": 0,"path":"classifly","sort":'+this.sort+',"min":'+this.lessPrice+',"max":'+this.maxPrice+'}'
				this.showSort()
			},
			exchangeGoodsShowType(){
				this.isSingleList = ! this.isSingleList
				localStorage.setItem('isSingleList',this.isSingleList)
			},
			getRecommendStores(){//获取推荐店铺
	    		let that = this
	    		this.$axios({
		    		method:'get',
		    		url:'http://www.paipaiwang.com.cn/api/recommend',
		    		xhrFields:{
		    			withCredentials:true
	    			},
		    		crossDomain:true,
		    		headers: { //解决跨域
						'Content-Type': 'application/x-www-form-urlencoded'
					}
		    	}).then(function(res){
		    		console.log(res.data)
		    		res.data.list.forEach(item=>{
		    			that.users.push(item)
		    		})
		    	})
	    	},
			getCategory(){//获取所有类型
				let that = this
	    		this.$axios({
		    		method:'get',
		    		url:that.GLOBAL.develop_url+'api/cate',
		    		xhrFields:{
		    			withCredentials:true
	    			},
		    		crossDomain:true,
		    		headers: { //解决跨域
						'Content-Type': 'application/x-www-form-urlencoded'
					}
		    	}).then(function(res){
		    		console.log(res.data)
		    		that.$store.commit('setClassifly',res.data.data)
		    	})
			},
    		onRefresh(){ //下拉刷新  		
	    		this.disableBottom = true
				this.flag = 'fresh'
	    		this.page = 1 //第一页
				this.sendClassiflyData = '{"type":"get_auctions", "page":'+ this.page +', "per_page": 6,"cid":'+this.nowCate+', "for_new": 0, "mid": 0, "room": 0,"path":"classifly","sort":'+this.sort+',"min":'+this.lessPrice+',"max":'+this.maxPrice+'}'
				this.threadPoxi()
	    	},
	    	onInfinite(){//上拉加载
	    		this.disableTop = true
				this.flag = 'infinite'
				this.page++ //下一页
				this.sendClassiflyData = '{"type":"get_auctions", "page":'+ this.page +', "per_page": 6,"cid":'+this.nowCate+', "for_new": 0, "mid": 0, "room": 0,"path":"classifly","sort":'+this.sort+',"min":'+this.lessPrice+',"max":'+this.maxPrice+'}'
				this.threadPoxi()
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
	    	threadPoxi(){//发送数据方法
	    		this.$store.dispatch('socketOnSend',this.sendClassiflyData)
	    	},
	    	formatOpts(opts, defaults){//格式化cateData
	    		let origin_array = JSON.parse(defaults)
	    		let search = JSON.parse(opts)
			   	for(let key in origin_array){
			   		if(search[key] == undefined && origin_array[key] == undefined){
			   			delete origin_array[key]
			   		}else{
			   			origin_array[key] = typeof search[key] != 'undefined' ? search[key]:origin_array[key]
			   		}
			   	}
			    this.sendClassiflyData = JSON.stringify(origin_array);
			}
		},
		created(){ //默认进来发起一次socket
			let is = localStorage.getItem('isSingleList')
			if(is == null || is == 'false'){
				this.isSingleList = false
			}else{
				this.isSingleList = is
			}
			this.getCategory()
	    	this.getRecommendStores()
			this.flag = 'fresh'
	    	this.page=1
			this.sendClassiflyData =  '{"type":"get_auctions", "page":'+ this.page +', "per_page": 6,"cid":'+this.$route.params.type+', "for_new": 0, "mid": 0, "room": 0,"path":"classifly","sort":'+this.sort+',"min":"-1","max":"-1"}'
			this.threadPoxi()//发送数据
		},
		mounted(){
			let app = this
			let tSpeed = 300 //切换速度300ms
			setTimeout(function(){
				new Swiper('#nav', {
				  	slidesPerView: 6,
				  	freeMode: true,
				  	onInit:function(swiper){
				  		let that = swiper
			  			let navSlideWidth = that.slides.eq(0).css('width'); //导航字数需要统一,每个导航宽度一致
			  			let bar = that.$('#nav').find('.bar')
			  			that.slides.find('.bar').css('width', navSlideWidth)
			  			bar.transition(tSpeed)
			  			let navSum = that.slides[that.slides.length - 1].offsetLeft //最后一个slide的位置
			  			let clientWidth = parseInt(that.$('.swiper-wrapper').css('width')) //Nav的可视宽度
			  			let navWidth = 0
			  			for (let i = 0; i < that.slides.length; i++) {
			  				navWidth += parseInt(that.slides.eq(i).css('width'))
			  			}
			  			if(app.tabIndex || app.tabIndex == 0){
			  				app.cate ='{"cid":'+app.tabIndex+'}' //更变类型
					  		app.nowCate = app.tabIndex
				  			let navSlideWidth = parseFloat(that.slides.eq(0).css('width'));
						  	let clickIndex = app.tabIndex
						  	let clickSlide = that.slides.eq(clickIndex)
						  	let bar = that.$('#nav').find('.bar')
						  	bar.transition(tSpeed)
						  	bar.transform('translateX(' + clickIndex*navSlideWidth + 'px)')
						  	that.slides.find('span').css('color', 'rgba(51,51,51,1)');
						  	clickSlide.find('span').css('color', 'rgba(232,116,57,1)');
						  	
						 	let navActiveSlideLeft = that.slides[clickIndex].offsetLeft
				  			let clientWidth = parseInt(that.$('.swiper-wrapper').css('width')) //Nav的可视宽度
				  			let navWidth = 0
				  			for (let i = 0; i < that.slides.length; i++) {
				  				navWidth += parseInt(that.slides.eq(i).css('width'))
				  			}
						  	if (navActiveSlideLeft < (clientWidth - parseInt(navSlideWidth)) / 2) {
						  		that.setWrapperTransition(300)
				  				that.setWrapperTranslate(0)
				  			} else if (navActiveSlideLeft > navWidth - (parseInt(navSlideWidth) + clientWidth) / 2) {
						  		that.setWrapperTransition(300)
				  				that.setWrapperTranslate(clientWidth - navWidth)
				  			} else {
						  		that.setWrapperTransition(300)
				  				that.setWrapperTranslate((clientWidth - parseInt(navSlideWidth)) / 2 - navActiveSlideLeft)
				  			}
				  		}
				  	},
				  	onTap:function(swiper,event){
			  			let that = swiper
			  			let navSlideWidth = parseFloat(that.slides.eq(0).css('width'));
					  	let clickIndex = that.clickedIndex
					  		app.cate ='{"cid":'+clickIndex+'}'
					  		app.nowCate = clickIndex
					  	let clickSlide = that.slides.eq(clickIndex)
					  	let bar = that.$('#nav').find('.bar')
					  	bar.transition(tSpeed)
					  	bar.transform('translateX(' + clickIndex*navSlideWidth + 'px)')
					  	that.slides.find('span').css('color', 'rgba(51,51,51,1)');
					  	clickSlide.find('span').css('color', 'rgba(232,116,57,1)');
					  	
					 	let navActiveSlideLeft = that.slides[clickIndex].offsetLeft
			  			let clientWidth = parseInt(that.$('.swiper-wrapper').css('width')) //Nav的可视宽度
			  			let navWidth = 0
			  			for (let i = 0; i < that.slides.length; i++) {
			  				navWidth += parseInt(that.slides.eq(i).css('width'))
			  			}
					  	if (navActiveSlideLeft < (clientWidth - parseInt(navSlideWidth)) / 2) {
						  		that.setWrapperTransition(300)
			  				that.setWrapperTranslate(0,clickIndex)
			  			} else if (navActiveSlideLeft > navWidth - (parseInt(navSlideWidth) + clientWidth) / 2) {
						  		that.setWrapperTransition(300)
			  				that.setWrapperTranslate(clientWidth - navWidth,clickIndex)
			  			} else {
						  		that.setWrapperTransition(300)
			  				that.setWrapperTranslate((clientWidth - parseInt(navSlideWidth)) / 2 - navActiveSlideLeft,clickIndex)
			  			}
			  		}
				});
			},500)	
		}
	}
</script>

<style lang="less" scoped>
.page.has-navbar{
	.page-content {
	  	padding-top:calc(.8rem + .77rem + 44px);
	  	padding-bottom: .2rem;
	  	overflow:scroll;
	  	.topBar{
  			z-index: 999;
	  		position: fixed;
	  		left: 0;
	  		top: 44px;
	  		width: 100%;
	  		height: .8rem;
			line-height: .8rem;
	  		background-color: #fff;
	  		#nav {
				.swiper-slide{
					width: 1.25rem;
					span {
						margin:0 5px;
						text-align:center;
						display:block;
						font-size:.24rem;
						color:#333333;
					}
				}
				.bar {
					width:1.25rem;
					height:2px;
					position:absolute;
					bottom:0px;
					background-size: 0 0 !important;
					.color {
						width:100%;
						margin:0 auto;
						height:2px;
						background:#e87439;
					}
				}
			}
			.barBottom{
				height: .77rem;
				background-color: #fff;
				width: 100%;
				border-bottom: 1px solid #d2d2d2;
				display: flex;
				display: -webkit-flex;
				justify-content: space-around;
				align-items: center;
				position: relative;
				.bar{
					display: block;
					height: 100%;
					width: 25%;
					position: relative;
					display: flex;
					display: -webkit-flex;
					justify-content: center;
					align-items: center;
					background-image:none !important;
					/*&:nth-child(3){
						border-right: 1px solid #d2d2d2;
					}*/
				}
				.listSort{
					width: 100%;
					position: absolute;
					top: 44px;
					left: 0;
					border-bottom: 1px solid #eeeeee;
				}
			}
	  	}
	}
} 
.doubleGoodsFlexBox{
	display: flex;
	display: -webkit-box;
	display: -webkit-flex;
	flex-wrap: wrap;
	flex-direction: row;
	justify-content: space-between;
	padding: 0 2.5%;	  		
}
section{
	display: flex;
	display: -webkit-flex;
	align-items: center;
}
.guide_item{
	height: 100%;
	.icon_style{
		display: inline-block;
		width: .32rem;
		height: .3rem;
	}
}
.default{
	color: #E87439 !important;	
}
.toUp{
	transform: rotate(180deg);
	-webkit-transform: rotate(180deg);
}
.model{
	width: 100%;
	height: 100%;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 1000;
	.wrap{
		width: 100%;
		height: 100%;
		background-color: rgba(0,0,0,0.5);
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1001;
	}
	.content{
		width: 75%;
		height: 100%;
		background-color: #fff;
		position: absolute;
		top: 0;
		right: 0;
		z-index: 1002;
		padding: .2rem;
		p{
			font-size: .26rem;
			margin: .3rem 0 !important;
		}
		ul{
			width: 100%;
			display: flex;
			display: -webkit-flex;
			justify-content: space-around;
			li{
				width: 30%;
				background-color: #eeeeee;
				padding: .2rem 0;
				text-align: center;
				border-radius: 10px;
				border: 1px solid #eeeeee;
				color: #323232;
			}
			.borderLi{
				border: 1px solid #E87439 !important;
				color: #E87439 !important; 
			}
		}
		.myPrice{
			display: flex;
			display: -webkit-flex;
			justify-content: space-around;
			align-items: center;
			margin-top: .75rem;
			i{
				display: inline-block;
				width: .5rem;
				height: 2px;
				background-color: #eeeeee;
				
			}
			input{
				width: 2rem;
				height: .68rem;
				padding: .25rem;
				border: 1px solid #E4E4E4;
				border-radius: 10px;
				text-align: center;
			}
		}
		.contentBottom{
			width: 100%;
			position: absolute;
			right: 0;
			bottom: 0;
			display: flex;
			display: -webkit-flex;
			justify-content: space-around;
			align-items: center;
			border-top: 1px solid #eeeeee;
			div{
				width: 50%;
				text-align: center;
				height: .85rem;
				line-height: .85rem;
			}
			.reset{
				background-color: #eeeeee;
			}
			.finish{
				background-color: #E87439;
				color: #fff;
			}
		}
	}
}
input[type="text"]:focus{
	border: 1px solid #e87439 !important;
}
</style> 