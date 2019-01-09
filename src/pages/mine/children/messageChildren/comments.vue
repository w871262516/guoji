<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">评论</span>
			</von-header>
	  		<!--<tabs :tab-items="tabs" :tab-index="tabIndex" :on-tab-click="onTabClick" top="44px"></tabs>-->
	  		<quick-loadmore :top-method="onRefresh" ref="vueLoad" 
                    :top-status-change="handleStatusChange" 
                    :bottom-method="onInfinite" 
                    :bottom-status-change="handleBottomStatusChange" 
                    :disable-top="disableTop" :disable-bottom="disableBottom">
				<list class="list-ios item-icon-right" v-if="circleDatas.length > 0">
					<!--圈子评论-->
					<item v-for="data in circleDatas" class="tab1" @click.native="goInfo(data.cid)">
						<section>
							<div :style="{backgroundImage:'url('+data.picture+')'}" class="userImg"></div>
							<div class="userBox">
		   				 		<div class="contentBox">
		   				 			<p>{{ data.nickname}}</p>
		   				 			<p>评论：<span v-html="data.content"></span></p>
		   				 			<p>{{ data.c_time }}</p>
		   				 		</div>
								<div :style="{backgroundImage:'url('+data.photo+')'}" class="commentImg"  v-if="data.photo != ''"></div>
							</div>
		       			</section>
					</item>
					<!--商品评论-->
					<!--<item v-for="data in goodsDatas" v-show="tabIndex==1" class="tab1">
						<section>
		   				 		<img :src="data.userImg" class="userImg"/>
		   				 		
							<div class="userBox">
		   				 		<div class="contentBox">
		   				 			<p>{{ data.userName}}</p>
		   				 			<p>{{ data.comments }}</p>
		   				 			<p>{{ data.time }}</p>
		   				 		</div>
	   				 			<img :src="data.commentImg" class="commentImg"/>
							</div>
		       			</section>
					</item>-->
					<!--买家评论-->
					<!--<item v-for="data in buyerDatas" v-show="tabIndex==2" class="tab3">
						<section>
							<div class="buyerInfo">
								<img :src="data.userImg" class="userImg"/>
								<p>{{ data.userName}}</p>
							</div>
							<div class="buyGoodsInfo">
								<p>{{ data.comments }}</p>
								<p>{{ data.time }} &nbsp; 颜色：{{ data.color }} &nbsp;规格：{{ data.size }} &nbsp;</p>
	   				 			<img :src="imgs.img" class="commentImgs" v-for="imgs in data.commentImgs"/>
							</div>
		       			</section>
					</item>-->
				</list>
				<h5 v-if="circleDatas.length < 1 && loadFinish == true">暂无数据</h5>
			</quick-loadmore>
	  	</div>
	</div>
</template>

<script>
	export default{
		name:'comments',
		data(){
			return{
				tabIndex:0,
				tabs:['我的评论','买家评论'],
				flag:'fresh',
		        disableTop:false,//是否禁止下拉，默认允许
		        disableBottom:false,
		        loadFinish:true,
		        isAll:false,
		        per:10,//前端自定义每页请求多少条数据
				page:1,
				circleDatas:[],
				goodsDatas:[],
				buyerDatas:[]
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
			goInfo(id){
				this.$router.push({path:'/circle/circleInfo',query:{'id':id}})
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
				this.$refs.vueLoad.onBottomLoaded(false)
    			this.flag = 'fresh'
	    		this.page = 1 //第一页
	    		this.getMyComments()
	    	},
	    	onInfinite(){//上拉加载
	    		this.disableTop = true
				this.flag = 'infinite'
				this.page++ //下一页
	    		this.getMyComments()
	    	},
	    	getMyComments(){ //获取我收到的评论
				let that = this
	    		if(!that.loadFinish){
	    			return
	    		}
				that.$axios({
					method:'get',
					url:that.GLOBAL.develop_url+'api/hompage/msgcomment',
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
					if(res.data.code==200){
							if(res.data.data == null){
								that.disableBottom = true
								that.$refs.vueLoad.onBottomLoaded(false)
								if(that.flag == 'fresh'){
									that.isAll = true
			    					that.circleDatas = []
			    					that.$refs.vueLoad.onTopLoaded();
								}else{
									that.isAll = true
								}
							}else{
								that.disableBottom = false
								that.$refs.vueLoad.onBottomLoaded(true)
								if(that.flag == 'fresh'){
									that.circleDatas = []
									res.data.data.forEach(i=>{
										i.c_time = that.timeFormer(i.c_time)
										i.content = that.toChina(i.content)
										that.circleDatas.push(i)
									})
									that.$refs.vueLoad.onTopLoaded()
								}else{
									res.data.data.forEach(i=>{
										i.c_time = that.timeFormer(i.c_time)
										i.content = that.toChina(i.content)
										that.circleDatas.push(i)
									})
								}
							}
					}else if(res.data.code==404){
						$toast.show(res.data.msg, 1000).then(() => {
							that.$router.push('/login')
						})
					}else if(res.data.code==10006001){
						that.disableBottom = true
						that.$refs.vueLoad.onBottomLoaded(false)
					}else{
						$toast.show(res.data.msg, 1000)
					}
	    			that.loadFinish = true
				}).catch(function(err){
					//$toast.show('网络错误', 2000).then(() => {})
				})
			},
		},
		created(){
			this.getMyComments()
		}
	}
</script>

<style scoped lang="less">
.page-content {
  	padding-top: 44px;
  	.list-ios{
  		padding-right: 0 !important;
  	}
  	.tab1{
  		section{
  			width: 100%;
  			display: flex;
  			display: -webkit-flex;
  			flex-direction: row;
  			justify-content: space-between;
  			align-items: center;
  			.userBox{
	  			width: calc(100% - .88rem);
	  			display: flex;
	  			display: -webkit-flex;
	  			flex-direction: row;
  				justify-content: space-between;
	  			align-items: center;
  			}
  			.contentBox{
  				width: calc(100% - 2.08rem);
  				height: 1.4rem;
  				display: flex;
  				display: -webkit-flex;
  				flex-direction: column;
  				justify-content: space-around;
  				p{
  					line-height: 1;
  					font-size: .26rem;
  					span{
  						display: inline-block;
  						height: .35rem;
  						line-height: .35rem;
  					}
  				}
  			}
	  		.commentImg{
	  			display: block;
				width: 1.4rem;
				height: 1.4rem;
  				background-size: cover;
  				background-repeat: no-repeat;
  				background-position: center center;
	  		}
		  	.userImg{
				display: block;
				width: .88rem;
				height: .88rem;
				border-radius: 50%;
				margin-right: .1rem;
  				background-size: cover;
  				background-repeat: no-repeat;
  				background-position: center center;
			}
  		}
  		
  	}
  	.tab3{
		display: flex;
		display: -webkit-flex;
		flex-direction: column;
		.buyerInfo{
			width: 100%;
			display: flex;
			display: -webkit-flex;
			justify-content:flex-start;
			align-items: center;
			margin-bottom: .1rem;
			img{
				margin-right: .1rem;
			}
		}
		.buyGoodsInfo{
			p{
				margin-bottom: .15rem !important;		
				white-space: normal;
			}
		}
  		.commentImgs{
  			display: inline-block;
  			width: 1.28rem;
  			height: 1.28rem;
  			margin-right: .1rem;
  		}
	  	.userImg{
			display: block;
			width: .58rem;
			height: .58rem;
			border-radius: 50%;
			margin-right: .1rem;
		}
	}
}

h5{
	height: 1rem;
	width: 100%;
	line-height: 1rem;
	text-align: center;
	color: #323232;
}
</style>