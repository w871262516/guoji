<template>  
	<keep-alive>
	<div class="page has-navbar">
		<div class="page-content">
			<svgs style="display: none;"></svgs>
			<svg-collect style="display: none;"></svg-collect>
			<von-header>
			    <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			    <span slot="title">
			    	<p class="specialBar" v-if="auctionInfo.time>0 && !auctionInfo.start && (auctionInfo.room==1 || auctionInfo.room ==2)">
			    		距离拍卖结束还剩<br />
			    		<span>{{auctionInfo.time | expTime}}</span>
			    	</p>
			    	<p class="specialBar" v-if="auctionInfo.time>0 && auctionInfo.start>0 && (auctionInfo.room==1 || auctionInfo.room ==2)">
			    		距离拍卖开始还剩<br />
			    		<span>{{auctionInfo.start | expTime}}</span>
			    	</p>
    				<p class="specialBar1" v-if="auctionInfo.time<=0 && !auctionInfo.period_new && auctionInfo.period">出价结束</p>
    				<p class="specialBar1" v-if="auctionInfo.time<=0 && !auctionInfo.period_new && !auctionInfo.period">活动结束</p>
			    </span>
			</von-header>
			<!--轮播图组件-->
			<good-carousel :picWidth="imgWidth" picHight="5rem" :showPagination="true" :speed="300" :imgs="carouselImgs" :swiperBgColor="bgColor"></good-carousel>
			<div class="goodBox">
				<p class="goodTitle">{{auctionInfo.title}}</p>
				<p class="goodPrice">￥<span>{{auctionInfo.price}}</span></p>
				<!--<p class="times">(2次出价)</p>-->
				<p class="collectThis">
					<section class="guide_item" @click="collectThisGood">
			        	<svg class="icon_style">
			                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#collect'" v-show="!isCollected"></use>
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
						竞拍倒计时:{{auctionInfo.period_interval}}秒 {{isEntrust}}
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
					<p class="follow" @click="followHim"  v-if="businessInfo.id!=localMid">
						<section class="guide_item" v-show="!isFollow">
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
					<router-link :to="{path:'/chat/'+businessInfo.id,query:{id:businessInfo.id}}" class="btn">
						<!--进入专场-->联系商家
					</router-link>
					<router-link :to="{path:'/stores/'+businessInfo.id,query:{id:businessInfo.id}}" class="btn">
						进店逛逛
					</router-link>
				</div>
			</div>
			
			<!--底部规则tab-->
			<div class="footTab mt20">
				<tabs :tab-items="tabs" :tab-index="tabIndex" :on-tab-click="onTabClick" top="0px"></tabs>
				<!--商品详情-->
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
			<!--底部按钮 room1-->
			<div class="buttonBar" v-if="auctionInfo.room == 1 && auctionInfo.time>0 && !auctionInfo.start && isHightest == false && isEntrust == 0 && auction_stat == 1">
				<div class="service" @click="buyByMe">
					手动出价
				</div>
				<div class="buyIt" @click="showAnotherBtn">
					委托出价
				</div>
			</div>
			
			<!--底部按钮 取消委托-->
			<div class="buttonBar" v-if="auctionInfo.room == 1 && auctionInfo.time>0 && !auctionInfo.start && isHightest == false && isEntrust == 1 && auction_stat == 1">
				<div class="room2Btn" @click="cancelEntrust">
					取消委托（委托价格：{{bidPrice}}）
				</div>
			</div>
			
			<!--底部按钮  您已最高-->
			<div class="buttonBar" v-if="auctionInfo.time>0 && !auctionInfo.start && auctionInfo.room==1 && isHightest == true">
				<div class="room2Btn">
					您已最高
				</div>
			</div>
			
			<!--底部按钮  拍币不足-->
			<div class="buttonBar" v-if="auctionInfo.time>0 && !auctionInfo.start && auctionInfo.room==1 && auction_stat == 0 && token !=null">
				<div class="room2Btn">
					您的拍币不足，请先充值！
				</div>
			</div>
			
			<!--底部按钮  即将开始-->
			<div class="buttonBar" v-if="auctionInfo.time>0 && auctionInfo.start>0 && auctionInfo.room==1 ">
				<div class="room2Btn">
					即将开始
				</div>
			</div>
			
			<!--底部按钮  出价结束-->
			<div class="buttonBar" v-if="auctionInfo.time<=0&& !auctionInfo.period_new && auctionInfo.period">
				<div class="room2Btn">
					出价结束
				</div>
			</div>
			
			<!--底部按钮  活动结束-->
			<div class="buttonBar" v-if="auctionInfo.time<=0&& !auctionInfo.period_new && !auctionInfo.period">
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
			
			<!--委托按钮-->
			<div class="btnModel" v-show="anotherBtnShow">
				<div class="btnWrap" @click="showAnotherBtn"></div>
				<div class="anotherBar">
					<div class="infoBox">
						<img class="goodImg" :src="thumb"/>
						<div class="priceBox">
							<p class="NowPrice default">当前价:￥ {{auctionInfo.price}}</p>
							<span>加价幅度  {{auctionInfo.per_price}}</span>
						</div>
					</div>
					<div class="checkEntrust">
						<span>
							委托价格
						</span>
						<div>
							<span>{{myprice}}</span>
						</div>
					</div>
					<div class="checkEntrust">
						<span>
							委托次数
						</span>
						<div>
							<section class="guide_item" @click="reducePrice">
					        	<svg class="icon_style">
					                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#reduceNums'"></use>
					          	</svg>
					        </section>
							<span>{{count}}</span>
							<section class="guide_item" @click="addPrice">
					        	<svg class="icon_style">
					                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#addNums'"></use>
					          	</svg>
					        </section>
						</div>
					</div>
					<div class="sureBtn" @click="entrustPrice()">
						确认出价
					</div>
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
				localMid:'',
				token:'',
				isHightest:false,//是否最高价
				isFollow:false,//是否关注店家
				isCollected:false,
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
				count:2,//委托次数
				myprice:0, //点击委托加减按钮时 处理的价格 绑定到页面
				bidPrice:0,//委托价格
				show:false,
				isFirstClik:true, //委托按钮是否第一次点击（true：显示委托 false:隐藏委托 ） 默认是  是：this.myprice+this.perPrice 设置最低委托价 
			}
		},
		watch:{
			fav_stat(val){
				this.isCollected = val
			},
			fans_stat(val){
				this.isFollow = val
			},
			count(val){
				let per = Number(this.auctionInfo.per_price)*val
				this.myprice = parseFloat((Number(this.auctionInfo.price) + per).toFixed(2))
			},
			auctionLog(val){//观察出价队列 当前最高价的人是谁
				if(val.length > 0){
					let nm = val[0].mid
					if(nm == this.localMid){
						this.isHightest = true
					}else{
						this.isHightest = false
					}
				}else{
					return
				}
			},
			autoMid(val){
				if(val == this.localMid){
					this.isHightest = true
				}else{
					this.isHightest = false
				}
			},
			autoPrice(val){//监听价格 改变页面价格和出价队列
				if(parseFloat(val)>0){//委托有返回
					this.$store.state.goodInfoData.auctionInfo.price = val //绑定新价格
					this.myprice = val
					if(this.auctionLog.length>2){
						this.auctionLog.pop()
						this.auctionLog.unshift(this.$store.state.autoBid.auctionLog)
					}else{
						this.auctionLog.unshift(this.$store.state.autoBid.auctionLog)
					}
				}
				if(this.$store.state.autoBid.ck_client=="client" && (this.$store.state.autoBid.code == "200"  || this.$store.state.autoBid.code == "100013")){
					this.$store.state.goodInfoData.auctionInfo.isEntrust = 1
					console.log('监听价格 改变页面价格和出价队列');
					
				}else if(this.$store.state.autoBid.ck_client=="client" && !this.$store.state.autoBid.code == "200"  && !this.$store.state.autoBid.code == "100013"){
					this.$store.state.goodInfoData.auctionInfo.isEntrust = 0
					console.log('监听价格 改变页面价格和出价队列');
				}
					
			},
			autoCode(val){//委托成功后 后台返回的code
				switch (val){
					case "200"://委托成功
						if(this.$store.state.autoBid.ck_client=="client"){
							this.$store.state.goodInfoData.auctionInfo.isEntrust = 1
							console.log('委托成功后 后台返回的code委托成功');
						}
						break;
					case "100013"://委托已经是最高价
						if(this.$store.state.autoBid.ck_client=="client"){
							this.$store.state.goodInfoData.auctionInfo.isEntrust = 1
							console.log('委托成功后 后台返回的code 最高价');
						}
						break;
					default://其他状态  包含委托次数（价格）过期
						if(this.$store.state.autoBid.ck_client=="client"){
							this.$store.state.goodInfoData.auctionInfo.isEntrust = 0
							console.log('委托成功后 后台返回的code,其他状态  包含委托次数（价格）过期');
						}
						break;
				}
			},
			code(val,old){//判断后台返回code 进行提示
				switch (val){
					case "400":
						$toast.show('请先登录', 1000).then(() => {
							this.$router.push('/login')
						})
						break;
					case "200":
						this.$store.state.goodInfoData.auctionInfo.auction_stat = 1
						break;
					case "100013"://您已最高
						if(parseInt(this.newMid) == this.localMid && this.auction_stat == 1){
							this.isHightest = true
						}
						break;
					case "100014"://拍币不足
						this.$store.state.goodInfoData.auctionInfo.auction_stat = 0
						$toast.show(this.msg, 1500)
						break;
					case "404"://登录过期
						$toast.show(this.msg, 1500).then(() => {
							this.$router.push('/login')
						})
						break;

				}
			},
			newPrice(val){//有人出价或者本人出价 更新当前商品价格 更新出价记录
				if(this.code == "200"){
					this.auctionInfo.price = val
					this.myprice = val
					if(this.auctionLog.length>2){
						this.auctionLog.pop()
						this.auctionLog.unshift(this.$store.state.joinActionData.list)
					}else{
						this.auctionLog.unshift(this.$store.state.joinActionData.list)
					}
				}
				if(this.autoMid == this.localMid){
					this.isHightest = true
				}else{
					this.isHightest = false
				}
			},
			newMid(val){//有人出价或者本人出价 切换显示底部的您已最高bar
				if(val == this.localMid){
					this.isHightest = true
				}else{
					this.isHightest = false
				}
			},
			mid(val){//页面刷新或者创建时 改变了mid的值 进行判断 是否为本人 再进行显示对应的按钮
				this.checkMid()
			},
			myprices(val){//页面刷新或者创建时 获取到商品的价格 来改变绑定委托的价格
				console.log(val)
				this.myprice = val
				if(this.myprice!=0.00){
					this.bidPrice = this.myprice + Number(this.auctionInfo.per_price).toFixed(1)
				}
				
			}
		},
		computed:{
			autoAction_stat(){
				return parseInt(this.$store.state.autoBid.auction_stat)
			},
			autoIsEntrust(){
				console.log('监听autoBid.isEntrust');
				return parseInt(this.$store.state.autoBid.isEntrust)
			},
			autoPrice(){//监听委托新价格 委托返回 自动更新页面价格和出价队列
				return this.$store.state.autoBid.auctionLog.price
			},
			autoCode(){//用来区别 委托的状态码
				return this.$store.state.autoBid.code
			},
			autoMid(){
				return parseInt(this.$store.state.autoBid.auctionLog.mid)
			},
			isEntrust(){//是否委托状态 1委托 0不委托
				console.log('监听goodInfoData.auctionInfo.isEntrust');
				return parseInt(this.$store.state.goodInfoData.auctionInfo.isEntrust)
			},
			myprices(){//获取商品的当前价
				return this.$store.state.goodInfoData.auctionInfo.price
			},
			childPrice(){
				return this.$store.state.goodInfoData.auctionInfo.price
			},
			auction_stat(){//页面创建或者刷新时获取到的用户拍币情况 1代表可以继续拍  0表示提示充值
				return parseInt(this.$store.state.goodInfoData.auctionInfo.auction_stat)
			},
			fav_stat(){//该用户是否收藏过该商品
				return parseInt(this.$store.state.goodInfoData.auctionInfo.fav_stat)
			},
			newMid(){//出价的对应人mid
				return parseInt(this.$store.state.joinActionData.list.mid)
			},
			newPrice(){//出价的最新价格
				return this.$store.state.joinActionData.list.price
			},
			mid(){//页面创建时或者刷新时 获取到的当前最高价用户mid
				return parseInt(this.$store.state.goodInfoData.auctionInfo.mid)
			},
			code(){//获取socket返回的状态码
				return this.$store.state.joinActionData.code
			},
			msg(){//获取socket返回的msg 提示给用户
				return this.$store.state.joinActionData.msg
			},
			auctionInfo(){//商品详情信息
				return this.$store.state.goodInfoData.auctionInfo
			},
			auctionLog(){//商品竞拍记录
				return this.$store.state.goodInfoData.auctionLog
			},
			fans_stat(){//是否关注过店家
				this.isFollow = this.$store.state.goodInfoData.fans_stat
				return this.$store.state.goodInfoData.fans_stat
			},
			businessInfo(){//店家信息
				return this.$store.state.goodInfoData.businessInfo
			},
			carouselImgs(){//头部轮播图
				return this.$store.state.goodInfoData.auctionInfo.thumbs
			},
			thumb(){//商品封面
				return this.$store.state.goodInfoData.auctionInfo.thumb
			},
			content(){//处理商品详情的图片字符串
				return this.$store.state.goodInfoData.auctionInfo.content
			},
			auctionRules(){//竞拍规则
				return this.$store.state.goodInfoData.auctionRules
			},
			auctionHistory(){//竞拍历史记录
				return this.$store.state.goodInfoData.auctionHistory
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
		methods:{
			showHideModel(){
				this.show = !this.show
			},
			back(){
				this.$router.go(-1)
			},
			cancelEntrust(){//取消委托
				this.checkToken()
				let that = this
				that.$axios({
	    			method:'post',
	    			url:that.GLOBAL.develop_url+'api/cancelBid',
	    			data:{
	    				id:that.auctionId,
	    				token: localStorage.getItem('token'),
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
					$toast.show(res.data.msg, 1000).then(() => {})
	    			if(res.data.code == "200"){
						that.$store.state.goodInfoData.auctionInfo.isEntrust = 0
						
						console.log('取消监听的接口');
    					console.log(that.isEntrust);

	    			}
						
	    		}).catch(function(err){
	    			console.log(err)
	    		})
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
			buyByMe(){//手动出价
				this.checkToken()
				let per = Number(this.auctionInfo.per_price)
				let myprice = Number(this.auctionInfo.price)
				let data='{"type":"join_auction","id":'+this.auctionInfo.id+',"token":"'+this.token+'","price":'+parseFloat(( myprice + per).toFixed(1))+',"path":"joinAction"}'
				this.$store.dispatch('socketOnSend',data)
			},
			collectThisGood(){ //收藏该商品
				let that = this
				that.$axios({
					method:'post',
					url:that.GLOBAL.develop_url+'api/collect',
					data:{
						token:that.token,
						id:that.auctionInfo.id
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
						that.$store.state.goodInfoData.auctionInfo.fav_stat = 1;
					}else if(res.data.code == 1000036){
						$toast.show(res.data.msg, 1000)
						that.$store.state.goodInfoData.auctionInfo.fav_stat = 0;
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
			followHim(){ //关注店家
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
			showAnotherBtn(){ //切换显示anotherBtn按钮
			
				let mid = localStorage.getItem('mid')
				if(this.token==null || mid == null){ //判断token是否登录
					$toast.show('请先登录', 1000).then(() => {
						this.$router.push('/login')
					})
					return
				}
				if(this.anotherBtnShow == false){ //委托按钮显示前 先判断委托价是否小于商品当前价 小于的话就等于当前价
					if(this.myprice < this.myprices){this.myprice = this.myprices} //myprice 委托控件的动态价格 myprices商品的价格
					if(this.isFirstClik == true){
						this.addPrice()
						this.isFirstClik = false
					}
				}
				this.anotherBtnShow = !this.anotherBtnShow
			},
			entrustPrice(){//委托出价
				let data = '{"type":"auto_bid", "id": '+this.auctionInfo.id+', "token": "'+ this.token +'", "price": '+this.count+',"path":"autoBid"}' //委托data
				this.$store.dispatch('socketOnSend',data) //触发后台委托
				this.showAnotherBtn()
			},
			checkMid(){//页面创建或者刷新判断传进来的mid和本地mid以及拍币>0 或者 本地mid和页面信息的mid是否相等以及拍币>0 相等显示我最高价
				let stat = parseInt(this.$store.state.goodInfoData.auctionInfo.auction_stat)
				let routeMind = parseInt(this.$route.query.mid)
				if(stat>0){ //如果用户拍币大于0 隐藏提示充值 
					// if(this.localMid==parseInt(this.mid) || this.localMid == routeMind ){//再根据判断当前出价的mid 和 页面刷新获取的mid 是否为本人 是则显示最高价
					if(this.localMid==parseInt(this.mid)){
						this.isHightest = true
					}else{
						this.isHightest = false
					}
					this.isPoor = false
				}else{//如果用户拍币不足 显示提示充值 隐藏您已最高
					this.isHightest = false
					this.isPoor = true
				}
			},
			
			reducePrice(){ //委托-
				if(this.count<3){
					return
//					let per = Number(this.auctionInfo.per_price)
//					this.myprice = parseFloat((Number(this.myprice) * this.count).toFixed(2))
				}else{
					this.count--
				}
//				let per = Number(this.auctionInfo.per_price)
//				let min = parseFloat((Number(this.myprices) + per).toFixed(2))
//				if(Number(this.myprice) == min){
//					return
//				}
//				this.myprice = parseFloat((Number(this.myprice) - per).toFixed(2))
			},
			addPrice(){ //委托+
//				let per = Number(this.auctionInfo.per_price)
//				this.myprice = parseFloat((Number(this.myprice) + per).toFixed(2))
				this.count++
//				this.myprice = parseFloat((Number(this.myprice) * this.count).toFixed(2))
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
			this.$store.state.joinActionData.code = 200
			this.token = localStorage.getItem('token')||''
			let goodsInfo = '{"type":"get_auction", "id": '+ this.$route.query.auctionId +',"token":"'+this.token +'" ,"path":"goodInfo"}';
			//this.$store.dispatch('initSocket') //初始化整个页面的websocket
			this.$store.dispatch('socketOnSend',goodsInfo)
			this.checkMid() //页面刷新 判断我是否为最高价
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
					width: 50%;
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