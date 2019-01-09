<template>  
	<keep-alive>
	<div class="page has-navbar">
		<div class="page-content">
			<svgs style="display: none;"></svgs>
			<svg-collect style="display: none;"></svg-collect>
			<von-header>
			    <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			    <span slot="title">
			    	<p class="specialBar" v-if="auctionInfo.time>0 && !auctionInfo.start">
			    		距离拍卖结束还剩<br />
			    		<span>{{auctionInfo.time | expTime}}</span>
			    	</p>
			    	<p class="specialBar" v-if="auctionInfo.time>0 && auctionInfo.start>0">
			    		距离拍卖开始还剩<br />
			    		<span>{{auctionInfo.start | expTime}}</span>
			    	</p>
    				<p class="specialBar1" v-if="auctionInfo.time<=0  && !auctionInfo.period_new && auctionInfo.period">出价结束</p>
    				<p class="specialBar1" v-if="auctionInfo.time<=0 && !auctionInfo.period_new && !auctionInfo.period">活动结束</p>
			    </span>
			</von-header>
			<!--轮播图组件-->
			<quick-loadmore :top-method="onRefresh" ref="vueLoad" 
                    :top-status-change="handleStatusChange" 
                    :disable-top="disableTop" :disable-bottom="disableBottom" >
				<good-carousel :picWidth="imgWidth"  picHight="5rem" :showPagination="true" :speed="300" :imgs="carouselImgs" :swiperBgColor="bgColor"></good-carousel>
				<div class="goodBox">
					<p class="goodTitle">{{auctionInfo.title}}</p>
					<p class="goodPrice">￥<span>{{auctionInfo.price}}</span></p>
					<!--<p class="times">(2次出价)</p>-->
					<p class="collectThis">
						<section class="guide_item" @click="collectThisGood">
				        	<svg class="icon_style">
				                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#collect'" v-show="isCollected==false"></use>
				                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#collected'" fill="#e87439" v-show="isCollected"></use>
				          	</svg>
			       	 	</section>
					</p>
				</div>
				<div class="inforBox">
					<div class="box">
						<span>
							起拍价格:￥{{auctionInfo.start_price}}
						</span>
						<span>
							加价幅度：￥{{auctionInfo.per_price}}
						</span>
						<!--<span>
							网服费：￥{{auctionInfo.brokerage}}
						</span>-->
					</div>
					<div class="box mt20">
						<span>
							竞拍倒计时:{{auctionInfo.period_interval}}秒
						</span>
						<span>
							返积分倍率：{{auctionInfo.returns_rate}}
						</span>
						<!--<span>
							报名人数：2/100
						</span>-->
					</div>
					<div class="ads">
						<p v-for="(ad,index) in ads" :key="index">
							<section class="guide_item">
					        	<svg class="icon_style">
					                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#rightEmpty'" fill="#E87439"></use>
					          	</svg>
					        </section>
					        <span>{{ad.text}}</span>
						</p>
					</div>
					<div class="tips">
						<p>
							<section class="guide_item">
					        	<svg class="icon_style">
					                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#rightFull'" :fill="fill"></use>
					          	</svg>
					      </section>
	                       <span @click="agreeTCP">我同意</span> 
					        <div class="default" @click="agreeMent">《拍拍国际用户协议》</div>
						</p>
						<span>
							声明：所有竞买活动与apple公司无关
						</span>
					</div>
				</div>
				<!--出价记录-->
				<div class="recordListBox">
					<router-link class="header" :to="{path:'/moreRecords',query:{orderSn:auctionInfo.order_sn}}">
						<p>
							<section class="guide_item">
					        	<svg class="icon_style">
					                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#list'" fill="#E87439"></use>
					          	</svg>
					        </section>
					 		 <span>出价记录</span>
						</p>
						<p>
							<span>更多</span>
							<section class="guide_item">
					        	<svg class="icon_style">
					                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#toRight'"></use>
					          	</svg>
					        </section>
						</p>
					</router-link>
					<div class="bottom"  v-if="auctionLog.length > 0">
						<div class="list" :class="{default:index==0}" v-for="(list,index) in auctionLog" :key="index">
							<div>
								<img class="userImg" :src="list.photo" />
								<span>{{list.nickname || list.phone}}</span>
							</div>
							<p v-show="index==0">抢先（{{list.ip}}）</p>
							<p v-show="index!=0">已出局（{{list.ip}}）</p>
							<p>￥<span>{{list.price}}</span></p>
						</div>
					</div>
					<h5 v-else="auctionLog.length == 0">暂无出价记录</h5>
				</div>
				<!--店铺Div-->
				<div class="mt20 storeBox">
					<div class="header" v-if="businessInfo">
						<div>
							<!--<img :src="businessInfo.logo" />-->
							<div :style="{backgroundImage:'url('+businessInfo.logo+')'}" class="img"></div>
							<p class="storeName">
								<span>{{businessInfo.name}}</span>
								<!-- <span>专场：化妆品</span> -->
							</p>
						</div>
						<p class="follow" @click="followHim" v-if="businessInfo.id!=localMid">
							<section class="guide_item" v-show="isFollow==false">
					        	<svg class="icon_style">
					                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#followed'"></use>
					          	</svg>
					        </section>
					        <section class="guide_item" v-show="isFollow">
					        	<svg class="icon_style">
					                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#follow'" fill="#E87439"></use>
					          	</svg>
					        </section>
					 		<span>{{isFollow?'已关注':'关注'}}</span>
						</p>
					</div>
					<!-- <div class="content">
						<p>
							<span>
								{{businessInfo.room_1_num}}
							</span>
							<span>
								必拍
							</span>
						</p>
						<p>
							<span>
								{{businessInfo.room_2_num}}
							</span>
							<span>
								汇拍
							</span>
						</p>
					</div> -->
					<div class="bottom">
						<router-link :to="{path:'/onlineService/business_'+businessInfo.id,query:{img:businessInfo.logo,title:businessInfo.name,sessionId:'business_'+businessInfo.id}}" class="btn">
							<!--进入专场-->联系商家
						</router-link>
						<router-link :to="{path:'/stores/'+businessInfo.id,params:{id:businessInfo.id}}" class="btn">
							进店逛逛
						</router-link>
					</div>
				</div>
				
				<!--底部规则tab-->
				<div class="footTab mt20">
					<tabs :tab-items="tabs" :tab-index="tabIndex" :on-tab-click="onTabClick" top="0px"></tabs>
					<!--商品详情-->
					<!-- <div v-show="tabIndex==0"  class="rules">
						<p>{{auctionInfo.content}}</p>
					</div> -->
					<div v-for="(imgs,index) in content" v-show="tabIndex==0">
						<img :src="imgs.path" class="goodImg" />
					</div>
					<!--往期成交-->
					<!-- <div v-show="tabIndex==1" class="recordLists">
						<list class="list-ios item-icon-right">
							<item v-for="(history,index) in auctionHistory">
								<div class="listDiv">
									<img :src="history.photo" class="userImg" />
									<div>
										<p>{{history.username}}</p>
										<span class="default">成交价：￥{{history.pay_amount}}</span>
									</div>
								</div>
									<save-money :data="history.discount" right="0rem"></save-money>
							</item>
						</list>
					</div> -->
					<!--竞拍规则-->
					<div v-show="tabIndex==1" class="rules">
						<p>
							{{auctionRules}}
						</p>
					</div>
				</div>
			</quick-loadmore>	
			
			<!--底部按钮 取消委托-->
			<div class="buttonBar" v-if="auctionInfo.time>0 && !auctionInfo.start && isHightest == false && auctionStat == 1">
				<div class="room2Btn" @click="buyByMe">
					出价
				</div>
			</div>
			
			<!--底部按钮  您已最高-->
			<div class="buttonBar" v-if="auctionInfo.time>0 && !auctionInfo.start && isHightest == true && auctionStat == 1">
				<div class="room2Btn">
					您已最高
				</div>
			</div>
			
			<!--底部按钮  拍币不足-->
			<div class="buttonBar" v-if="auctionInfo.time>0 && !auctionInfo.start && token !=null && auctionStat == 0">
				<div class="room2Btn">
					您的拍币不足，请先充值！
				</div>
			</div>
			
			<!--底部按钮  即将开始-->
			<div class="buttonBar" v-if="auctionInfo.time>0 && auctionInfo.start>0">
				<div class="room2Btn">
					即将开始
				</div>
			</div>
			
			<!--底部按钮  出价结束-->
			<div class="buttonBar" v-if="auctionInfo.time<=0 && !auctionInfo.period_new && auctionInfo.period">
				<div class="room2Btn">
					出价结束
				</div>
			</div>
			
			<!--底部按钮  活动结束-->
			<div class="buttonBar" v-if="auctionInfo.time<=0 && !auctionInfo.period_new && !auctionInfo.period">
				<div class="room2Btn">
					活动结束
				</div>
			</div>
			
			<!--底部按钮  进入下一期-->
			<div class="buttonBar" v-if="!auctionInfo.time && auctionInfo.period_new==1 && auctionInfo.period">
				<div class="room2Btn">
					进入下一期
				</div>
			</div>
			<transition name="fade" enter-active-class="animated fadeInUp faster">
				<div class="model" v-show="show">
					<div class="wrap" @click="showHideModel"></div>	
					<div class="content" v-show="show">
						<img src="../../../static/saler/closeGray.png" class="close" @click="showHideModel">
						<div class="div">
							<!-- <h5>服务协议</h5> -->
							<div id="agreement"></div>
						</div>
						<md-button class="button button-positive button-block" @click.native="showHideModel">
							知道了
						</md-button>
					</div> 
				</div>
			</transition>
		</div>
	</div>
	</keep-alive>
</template>

<script>
	import goodCarousel from '../../components/common/goodCarousel.vue'
	import carousel from '../../components/common/carousel.vue'
	import anotherBtn from './components/anotherBtn.vue'
	import svgs from './components/svgs.vue'
	import svgCollect from '../../components/common/svgs.vue'
	import saveMoney from '../../components/common/saveMoney.vue'
	export default{
		name:'goodInfo',
		components:{
			goodCarousel,
			carousel,
			svgs,
			svgCollect,
			anotherBtn,
			saveMoney
		},
		data(){
			return{
				flag:'fresh',
		        disableTop:false,//是否禁止下拉，默认允许
		        disableBottom:true,
		        loadFinish:true,
				auctionStat:'',
				content:'',//商品详情
				auctionHistory:'',
				auctionRules:'',
				businessInfo:{},
				auctionLog:[],
				carouselImgs:[],
				auctionInfo:{time:10,start:10},
				localMid:'',
				token:'',
				isHightest:false,//是否最高价
				isFollow:false,//是否关注店家
				isCollected:false,//是否收藏商品
				isAgree:true,//是否同意协议
				fill:'#E87439',//图标上色
				anotherBtnShow:false,//是否显示委托弹窗按钮
		        imgWidth:'100%',
		        bgColor:'#fff',
		        tabs:['商品详情','竞拍规则'],
		        tabIndex:0,
		        auctionId:this.$route.query.auctionId,
		        ads:[
		        	{text:'爱上竞拍'},
		        	{text:'省钱赚券'},
		        	{text:'好货低价'},
		        	{text:'天天来买'}
				],
				wallet_pledge:0,//用户保证金余额
				show:false,

			}
		},
		filters:{
			expTime(val){//处理时间
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
				}else if(s>0){
					if(s<10){
						let t = '00' + ':' + '00'  + ':' + '0' + parseInt(s)
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
		watch:{
			loadFinish(val){
				this.loadFinish = val
			}
		},
		methods:{
			showHideModel(){
				this.show = !this.show
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
				this.getGoodInfos()
	    	},
			back(){
				this.$router.go(-1)
			},
			checkToken(){
				let mid = localStorage.getItem('mid')
				let token = localStorage.getItem('token')
				if(token==null || mid == null){ //判断token是否登录
					$toast.show('请先登录', 1000).then(() => {
						this.$router.push('/login')
					})
					return
				}
			},
			getPledgeMoney(){//获取用户余额
	    		let that = this
	    		that.$axios({
	    			method:'post',
	    			url:that.GLOBAL.develop_url+'/api/hompage/my_wallet',
	    			data:{
	    				token:that.token,
						page:1, //评论的页数
						type:3,//tab类型
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
					if(res.data.code == "200"){
						that.wallet_pledge = res.data.data.wallet_info.wallet_pledge
					}
				})
			},
			buyByMe(){//出价
				let that = this
				that.$axios({
	    			method:'post',
	    			url:that.GLOBAL.develop_url+'api/join_remit',
	    			data:{
	    				type:'join_remit',
	    				id:that.$route.query.auctionId,
	    				token:that.token,
	    				price:Number(that.auctionInfo.price) + Number(that.auctionInfo.per_price),
	    				path:'getRemitLists'
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
	    			if(res.data.code == "200"){
						$toast.show(res.data.msg, 1000)
    					that.auctionInfo.price = res.data.auction_log.price
    					that.auctionLog.unshift(res.data.auction_log)
	    			}else if(res.data.code == "100070"){
						let options = {
							effect: 'scale',
							buttons: [
								{text: '取消'},
								{text: '确定'},
							]
						}
						let text = res.data.msg+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;请先缴纳保证金：'+res.data.pay_price+'元'
						let popup = $popup.fromTemplate('<p style="padding: 0.3rem;text-align:center;">'+text+'</p>', options)

						popup.show().then((buttonIndex) => {
							if(buttonIndex==1){
								that.$router.push({
									path:'/mine/recharge',
									query:{
										url:location.search
									}
								})
							}
						})
	    			}else if(res.data.code == "404"){
						$toast.show(this.msg, 1500).then(() => {
							this.$router.push('/login')
						})
					}else{
						$toast.show(res.data.msg, 1000).then(() => {})
					}
	    		}).catch(function(err){
	    			//console.log(err)
	    		})
			},
			collectThisGood(){ //收藏该商品
					let that = this
					that.$axios({
						method:'post',
						url:that.GLOBAL.develop_url+'api/collect',
						data:{
							token:that.token,
							id:that.$route.query.auctionId
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
						if(res.data.code == "200"){
							$toast.show("收藏成功", 1000)
							that.isCollected = 1

						}else if(res.data.code == 1000036){
							$toast.show(res.data.msg, 1000)
							that.isCollected = 0
						}else if(res.data.code == "404"){
							$toast.show(this.msg, 1500).then(() => {
								this.$router.push('/login')
							})
						}else{
							$toast.show(res.data.msg, 1000)
						}
					})
			},
			agreeTCP(){ //记录是否同意 拍拍协议 并根据状态切换显示勾选icon
				this.isAgree= !this.isAgree
				if(this.isAgree){
					console.log('同意')
					this.fill = "#E87439"
				}else{
					console.log('不同意')
					this.fill = "#9d9c9c"
				}
			},
			followHim(){ //是否关注店家
				if(this.isFollow){
					var is_fans = 0 //不关注
				}else{
					var is_fans = 1 //关注
				}
				let that = this
					that.$axios({
						method:'post',
						url:that.GLOBAL.develop_url+'api/concern_shop',
						data:{
							token:that.token,
							business_id:that.businessInfo.id
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
						if(res.data.code == "200"){
							that.isFollow = !that.isFollow
							if(that.isFollow){
								$toast.show("关注成功", 1000)
							}else{
								$toast.show("取消关注", 1000)
							}
						}else{
							$toast.show(res.data.msg, 1000)
						}
					})
			},
			onTabClick(index){//切换显示底部tab
				this.tabIndex = index
			},
			goChat(){//跳转 联系客服页面
				this.$router.push('/goodInfo/chat')
			},
			getGoodInfos(){//获取商品信息
				let that = this
				that.$axios({
	    			method:'post',
	    			url:that.GLOBAL.develop_url+'api/remit_lists',
	    			data:{
	    				type:'get_auction',
	    				id:that.$route.query.auctionId,
	    				token:that.token,
	    				path:'getRemitLists'
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
	    			that.loadFinish = true
	    			console.log(res.data)
	    			if(res.data.code==0){
    						that.$refs.vueLoad.onTopLoaded()
	    					that.auctionStat = Number(res.data.auction.auction_stat)
	    					that.auctionInfo = res.data.auction
	    					that.carouselImgs = that.auctionInfo.thumbs
	    					that.businessInfo = res.data.business_info
	    					that.auctionLog = res.data.auction_log
							that.auctionRules = res.data.auction_rule
							that.isCollected = res.data.fav_stat
							that.isFollow = res.data.fans_stat
	    					that.content = eval(res.data.auction.content)
							console.log(that.content)
	    			}else if(res.data.code == "404"){
						$toast.show(this.msg, 1500).then(() => {
							this.$router.push('/login')
						})
					}else{
						$toast.show(res.data.msg, 1000)
					}
	    		})
			},
			agreeMent(){
				let that = this
				that.$axios({
					method:'get',
					url:that.GLOBAL.develop_url+'api/agreement',
					params:{
						type:'user'
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
					if(res.data.code == "200"){
						document.getElementById('agreement').innerHTML = res.data.data
						that.showHideModel()
					}else{
						$toast.show(res.data.msg, 1000)
					}
				})
			}
		},
		created(){
			this.localMid = parseInt(localStorage.getItem('mid'))	
			this.token = localStorage.getItem('token')||''
			this.auctionInfo.time = this.$route.query.time
			this.auctionInfo.start = this.$route.query.start
			this.getGoodInfos()//获取汇拍详情
			this.getPledgeMoney()//获取用户余额
			
			//this.checkMid() //页面刷新 判断我是否为最高价
		},
		mounted(){
			setInterval(()=>{//进行倒计时
				if(this.auctionInfo.start){
					let start = this.auctionInfo.start
					if(start>0){
						start--
						this.auctionInfo.start = start
					}
				}else{
					let time = this.auctionInfo.time
					if(time>0){
						time--
						this.auctionInfo.time = time
					}
				}
			},1000)
		}
	}
</script>

<style scoped lang="less">
.page.has-navbar{
	.page-content {
	  	padding-top: 44px;
	  	padding-bottom:1rem;
		.specialBar{
			font-size: .22rem;position: absolute;top: 50%;transform: translateY(-50%);-webkit-transform: translateY(-50%);width: 100%;text-align: center;line-height: 22px;height: 44px;color: #757373;
			span{
				font-size: .22rem;color: #323232;
			}
		}
		.specialBar1{
			position: absolute;top: 50%;transform: translateY(-50%);-webkit-transform: translateY(-50%);width: 100%;text-align: center;color: #323232;
		}
		.goodBox{
			background-color: #fff;
			padding: .05rem 0;
			text-align: center;
			.goodTitle{
				font-size: .26rem;
			}
			.goodPrice{
				margin: .075rem 0 !important;
				color: #E87439;
				font-size: .25rem;
				span{
					font-size: .32rem;
				}
			}
			.times{
				font-size: .18rem;
				color: #9f9e9e;
			}
			.collectThis{
				width: 100%;
				display: flex;
				display: -webkit-flex;
				justify-content: center;
				margin: .2rem 0 !important;
				.guide_item{
					display: inline;
					display: flex;
					display: -webkit-flex;
					.icon_style{
						display: inline-block;
						width: .4rem !important;
						height: .32rem !important;
					}
				}
			}
		}
		.inforBox{
			padding:.2rem 0;
			font-size: .24rem;
			.box{
				padding: 0 .2rem;
				display: flex;
				display: -webkit-flex;
				justify-content: space-between;
				span{
					display: inline-block;
					width:50%;
				}
			}
			.ads{
				display: flex;
				display: -webkit-flex;
				justify-content: space-between;
				margin-top: .2rem;
				padding: .2rem;
				border-top: 1px solid #d2d2d2;
				p{
					display: flex;
					display: -webkit-flex;
					align-items: center !important;
					.guide_item{
						display: inline;
						display: flex;
						display: -webkit-flex;
						.icon_style{
							display: inline-block;
							width: .26rem;
							height: .26rem;
							margin-right: .075rem;
						}
					}
				}
			}
			.tips{
				background-color: #fff;
				padding: .2rem;
				display: inline;
				display: flex;
				display: -webkit-flex;
				justify-content: space-between;
				font-size: .22rem;
				p{
					display: inline;
					display: flex;
					display: -webkit-flex;
					align-items: center;
					.guide_item{
						display: inline;
						display: flex;
						display: -webkit-flex;
						.icon_style{
							display: inline-block;
							width: .23rem;
							height: .23rem;
							margin-right: .075rem;
						}
					}
				}
			}
		}
		.recordListBox{
			background-color: #fff;
			padding: .2rem .2rem;
			.header{
				display: flex;
				display: -webkit-flex;
				justify-content: space-between;
				align-items: center;
				p{
					display: inline;
					display: flex;
					display: -webkit-flex;
					align-items: center;
					&:first-child{
						span{
							font-size: .24rem;
						}
						.icon_style{
							display: inline-block;
							width: .35rem;
							height: .29rem;
						}
					}
					&:last-child{
						span{
							font-size: .24rem;
						}
						.guide_item{
						display: inline;
						display: flex;
						display: -webkit-flex;
						.icon_style{
							display: inline-block;
							width: .18rem;
							height: .21rem;
							margin-right: .075rem;
						}
					}
					}
					
				}
			}
			.bottom{
				width: 100%;
				padding: .15rem 0;
				color: #323232;
				font-size: .24rem;
				.list{
					display: flex;
					display: -webkit-flex;
					justify-content: space-between;
					align-items: center;
					width: 100%;
					div{
						display: flex;
						display: -webkit-flex;
						justify-content: flex-start;
						align-items: center;
						width: 33.3333%;
					}
					.userImg{
						display: block;
						width: .38rem;
						height: .38rem;
						border-radius: 50%;
						margin-right: .1rem;
					}
					p{
						width: 33.3333%;
						text-align: center;
						&:last-child{
							text-align: right;
						}
					}	
				}
			}
		  	h5{
		  		text-align: center;height: 1rem;line-height: 1rem;color: #323232 ;
		  	}
		}
		.storeBox{
			background-color: #fff;
			padding: .35rem .2rem;
			.header{
				display: flex;
				display: -webkit-flex;
				justify-content: space-between;
				align-items: center;
				height: .62rem;
				div{
					display: flex;
					display: -webkit-flex;
					justify-content: space-between;
					align-items: center;
					color: #323232;
				}
				.img{
					display: block;
					width: .62rem;
					height: .62rem;
					border-radius: 50%;
					margin-right: .15rem;
	  				background-size: cover;
	  				background-repeat: no-repeat;
	  				background-position: center center;
				}
				p{
					display: flex;
					display: -webkit-flex;
					justify-content: space-between;
				}
				.storeName{
					flex-direction: column;
					line-height: .3rem;
					span{
						&:first-child{
							font-size: .28rem;
						}
						&:last-child{
							font-size: .24rem;
						}
					}
				}
				.follow{
					align-items: center;
					font-size: .26rem;
					color: #999797;
					.icon_style{
						height: .36rem;
						width: .36rem;
					}
				}
			}
			.content{
				display: flex;
				display: -webkit-flex;
				justify-content: space-around;
				align-items: center;
				padding: .15rem 0;
				font-size: .24rem;
				line-height: .3rem;
				p{	
					/*width: 33.333%;*/
					width: 50%;
					display: flex;
					display: -webkit-flex;
					justify-content: space-between;
					flex-direction: column;
					align-items: center;
					border-right: 1px solid #9d9c9c;
					&:last-child{
						border: none;
					}
					span{
						&:last-child{
							color: #9d9c9c;
						}
					}
				}
			}
			.bottom{
				display: flex;
				display: -webkit-flex;
				justify-content: space-around;
				align-items: center;
				padding: .15rem 0;
				font-size: .24rem;
				color: #868685;
				.btn{
					padding: .15rem .35rem;
					border-radius: 20px;
					border: 1px solid #aeaead;
				}
			}
		}
		.buttonBar{
			position: fixed;
			bottom: 0;
			left: 0;
			z-index: 999;
			width: 100%;
			height: .98rem;
			line-height: .98rem;
			font-size: .28rem;
			text-align: center;
			display: flex;
			display: -webkit-flex;
			justify-content: space-around;
			.service{
				background-color: #fff;
				width: 50%;
				color: #323232;
			}
			.buyIt{
				width: 50%;
				background-color: #E87439;
				color: #fff;
			}
			.room2Btn{
				width: 100%;
				background-color: #E87439;
				color: #fff;
			}
		}
		.footTab{
			position: relative;
			padding-top: 44px;
			.goodImg{
				display: block;
				width: 100%;
			}
			.rules{
				background-color: #fff;
				padding: .25rem;
			}
			.recordLists{
				width: 100%;
				.list-ios{
					padding-right: .4rem !important;
					.listDiv{
						display: flex;
						display: -webkit-flex;
						align-items: center;
						.userImg{
							display: block;
							width: .74rem;
							height: .74rem;
							border-radius: 50%;
							margin-right: .2rem;
						}
						div{
							height: .74rem;
							display: flex;
							display: -webkit-flex;
							flex-direction: column;
							justify-content: space-around;
							line-height: .35rem;
							p{
								font-size: .26rem;
							}
							span{
								font-size: .24rem;
							}
						}
					}
				}
			}
		}
		.btnModel{
			height: 100%;
			width: 100%;
			position: fixed;
			left: 0;
			top: 0;
			z-index: 999;
			.btnWrap{
				height: 100%;
				width: 100%;
				position: absolute;
				left: 0;
				top: 0;
				z-index: 1000;
				background-color: rgba(0,0,0,0.6);
			}
			.anotherBar{
				background-color: #fff;
				position: absolute;
				bottom: 0;
				left: 0;
				z-index: 1000;
				width: 100%;
				height: 4.6rem;
				text-align: center;
				display: flex;
				display: -webkit-flex;
				flex-direction: column;
				.infoBox{
					background-color: #fff;
					position:relative;
					height: 2rem;
					padding: .2rem .2rem 0 .2rem;
					.goodImg{
						position: absolute;
						top: -.5rem;
						left: .2rem;
						display: block;
						width: 2rem;
						height: 2rem;
						border: 5px solid #fff;
						border-radius: 5px;
						background-color: #fff;
					}
					.priceBox{
						width: 100%;
						padding-left: 2.2rem;
						display: flex;
						display: -webkit-flex;
						flex-direction: column;
						align-items: flex-start;
						.NowPrice{
							font-size: .3rem;
							margin-bottom: .3rem !important;
						}
					}
				}
				.checkEntrust{
					height: 1rem;
					display: flex;
					display: -webkit-flex;
					justify-content: space-between;
					align-items: center;
					padding: .2rem;
					div{
						display: flex;
						display: -webkit-flex;
						justify-content: space-between;
						align-items: center;
						span{
							display: inline-block;
							margin: 0 .2rem;
							font-size: .26rem;
						}
						.guide_item{
							display: inline;
							display: flex;
							display: -webkit-flex;
							.icon_style{
								display: inline-block;
								width: .52rem;
								height: .52rem;
								margin-right: 0 !important;
							}
						}
					}
				}
				.sureBtn{
					height: 1rem;
					line-height: 1rem;
					font-size: .36rem;
					color: #fff;
					background-color: #E87439;
				}
			}	
		}
	}
	.mt20{
		margin-top: .20rem;
	}
	.default{
		color: #E87439 !important;
	}
	.model{
	width: 100%;
	height: calc(100% - 44px);
	position: fixed;
	top: 44px;
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
		width: 85%;
		padding: .6rem .4rem .3rem;
		border-radius: 5px;
		height: 70%;
		background-color: #fff;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		z-index: 1002;
		.div{
			height: 100%;
			overflow-y: scroll;
			padding-bottom: .25rem;
		}
		.close{
			display: block;
			width: .4rem;
			height: .4rem;
			position: absolute;
			right: .15rem;
			top: .15rem;
		}
		h5{
			font-size: .33rem;
			font-weight: bold;
		}
		p{
			font-size: .26rem;
			margin: .3rem 0 !important;
		}
		.button-block{
			position: absolute;
			left: 0;
			bottom: -16px;
			width: 100%;
		}
	}
}
}
</style>