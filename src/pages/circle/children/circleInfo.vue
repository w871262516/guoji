<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">详情</span>
			</von-header>
			<quick-loadmore :top-method="onRefresh" ref="vueLoad" 
                    :top-status-change="handleStatusChange" 
                    :bottom-method="onInfinite" 
                    :bottom-status-change="handleBottomStatusChange" 
                    :disable-top="disableTop" :disable-bottom="disableBottom" >
				<div class="head">
					<div class="headBox">
						<div :style="{backgroundImage:'url('+circleInfo.member_photo+')'}" class="img"></div>
				   		<div>
				   			<p>{{circleInfo.nickname}}</p>
				   			<span>{{circleInfo.c_time}}</span>
				   		</div>
				   		<section class="guide_item" @click="followHim('followadd',circleInfo.mid)" v-show="circleInfo.is_fans==0 && circleInfo.mid != mid">
				        	<svg class="icon_style">
				                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#followed'" fill="#323232"></use>
				            </svg>
				            <span>关注</span>
				        </section>
				   		<section class="guide_item" @click="followHim('magfollowadel',circleInfo.mid)" v-show="circleInfo.is_fans==1  && circleInfo.mid != mid" :class="{default:isFollow}">
				        	<svg class="icon_style">
				                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#follow'" fill="#E87439"></use>
				            </svg>
				            <span>已关注</span>
				        </section>
			   		</div>
				   	<div class="contentBox">
				   		<p class="title" v-html="circleInfo.title"></p>
						<section v-html="circleInfo.content">
						</section>
				   	</div>
					<!--<div class="flexImgBox">
						<template v-for="photo in circleInfo.photo">	
							<div :style="{backgroundImage:'url('+photo.img+')'}" :class="{bgImg:circleInfo.photo.length==1,bgImg2:circleInfo.photo.length==2 || circleInfo.photo.length==4,bgImg3:circleInfo.photo.length==3||circleInfo.photo.length==5||circleInfo.photo.length==6||circleInfo.photo.length==7||circleInfo.photo.length==8||circleInfo.photo.length==9}" @click="showClickImg(photo.img)"></div>
						</template>
					</div>-->
					<div class="flexImgBox">
						<template v-for="(photo,index) in circleInfo.photo">
							<div :style="{backgroundImage:'url('+photo.img+')'}" :class="{bgImg:circleInfo.photo.length==1,bgImg2:circleInfo.photo.length==2 || circleInfo.photo.length==4,bgImg3:circleInfo.photo.length==3||circleInfo.photo.length==5||circleInfo.photo.length==6||circleInfo.photo.length==7||circleInfo.photo.length==8||circleInfo.photo.length==9}" style="position: relative;">
								<img :src="photo.img" style="display: inline-block;position: absolute;left: 0;top: 0;height: 100%;width: 100%;opacity: 0;" preview="1"/>
							</div>
						</template>
					</div>
				   	<svgs style="display: none;"></svgs>
				   	<svgs-follow style="display: none;"></svgs-follow>
				   	<div class="bottomBox">
				   		<section class="guide_item" @click="collectThis(circleInfo.id,circleInfo.heart_status)">
				        	<svg class="icon_style">
				                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#collect'" v-show="circleInfo.heart_status == 0"></use>
				                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#collected'" fill="#E87439" v-show="circleInfo.heart_status == 1"></use>
				            </svg>
				            <span>{{circleInfo.fabulous}}</span>
				        </section>
				   		<section class="guide_item">
				        	<svg class="icon_style">
				                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#comment'"></use>
				            </svg>
				            <span>{{circleInfo.comment_count}}</span>
				        </section>
				   		<section class="guide_item" @click="share">
				        	<svg class="icon_style">
				                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#share'"></use>
				           </svg>
				        </section>
				   	</div>
				</div>
				<div class="bigImg" v-show="showClick" @click="hideClickImg">
					<img :src="clickImg"/>
				</div>
				<p class="commentP">全部评论</p>
				<!--评论组件-->
				<comments :commentList="comment_list" v-if="comment_list.length > 0"></comments>
			<!--	<h5 v-if="comment_list.length == 0">暂无评论，快来评论吧！</h5>-->
			</quick-loadmore>	
			<div class="bottomBar">
				<input type="text" placeholder="请输入你的评论" v-model="content"/>
				<span @click="commentThis(circleInfo.id)">发送</span>
				<!--<div class="bottomBtn">
					<section class="guide_item">
			        	<svg class="icon_style">
			                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#photo'"></use>
			           </svg>
			        </section>
			        <section class="guide_item">
			        	<svg class="icon_style">
			                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#at'"></use>
			           </svg>
			        </section>
			        <section class="guide_item">
			        	<svg class="icon_style">
			                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#face'"></use>
			           </svg>
			        </section>
				</div>-->
			</div>
		</div>
		<share-model v-show="showShareModel" @hideShareModel="hideShareModel"></share-model>
	</div>
</template>

<script>
	import shareModel from '../../../components/common/shareModel.vue'
	import svgs from '../../../components/common/svgs.vue'
	import svgsFollow from '../../goodInfor/components/svgs.vue'
	import comments from './components/comments.vue'
	export default{
		name:'circleInfo',
		components:{
			shareModel,
			svgs,
			svgsFollow,
			comments
		},
		data(){
			return{
				mid:'',
				token:'',
				flag:'fresh',
		        disableTop:false,//是否禁止下拉，默认允许
		        disableBottom:false,
		        loadFinish:true,
		        isAll:false,
				isFollow:false,
				isCollect:false,
				showShareModel:false,
				content:'',
				commentPage:1,
				showClick:false,
				clickImg:'',
				comment_list:[],
				circleInfo:{comment_list:[]}
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
			share(){
				this.showShareModel = !this.showShareModel
			},
			commentThis(id){//评论
				if(this.content == ''){
					return
				}
				let that = this
				that.$axios({
	    			method:'post',
	    			url:that.GLOBAL.develop_url+'api/circle_comment',
	    			data:{
	    				id:id,
	    				token:that.token,
	    				content:that.toUnicode(that.content)//检测表情转码that.utf16toEntities(that.content)
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
	    			if(res.data.code == 200){
						$toast.show('评论成功', 1000)
						that.content = ''
						that.getCirclesInfoAjax()
	    			}
	    		})
			},
			hideShareModel(){
				this.showShareModel = false
			},
			collectThis(id,status){//点赞收藏
				if(parseInt(status) == 1){
					$toast.show('您已经点过赞啦！(*^▽^*)', 1000) 
					return
				}
				let that = this
				that.$axios({
	    			method:'post',
	    			url:that.GLOBAL.develop_url+'api/mark_heart',
	    			data:{
	    				id:id,
	    				token:that.token,
	    				action:1
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
	    			if(res.data.code == 200){
						$toast.show('点赞成功', 1000)
						that.getCirclesInfoAjax()
	    			}
	    		})
			},
			followHim(url,id){//切换关注
				let that = this
	    		that.$axios({
	    			method:'get',
	    			url:that.GLOBAL.develop_url+'api/hompage/'+url,
	    			params:{
	    				token:that.token,
	    				mid_follow:id //评论的页数
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
							that.circleInfo.is_fans = !that.circleInfo.is_fans 
	    					if(url=='followadd'){
	    						$toast.show('关注成功', 1000)
	    					}else{
	    						$toast.show('已取消关注', 1000)
	    					}
	    					break;
					}
					if(res.data.code==404){
						$toast.show(res.data.msg, 1000).then(() => {
							that.$router.push('/login')
						})
					}
	    		})
			},
			showClickImg(img){
				this.clickImg = img
				this.showClick = !this.showClick
			},
			hideClickImg(){
				this.showClick = !this.showClick
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
	    		this.commentPage = 1 //第一页
				this.getCirclesInfoAjax()
	    	},
	    	onInfinite(){//上拉加载
	    		this.disableTop = true
				this.flag = 'infinite'
				this.commentPage++ //下一页
				this.getCirclesInfoAjax()
	    	},
			getCirclesInfoAjax(){//获取圈子详情页的信息
				if(!this.loadFinish){
					return 
				}
	    		let that = this
	    		that.$axios({
	    			method:'post',
	    			url:that.GLOBAL.develop_url+'api/circle_info',
	    			data:{
	    				id:that.$route.query.id,
	    				token:that.token,
	    				page:that.commentPage //评论的页数
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
	    				case '200':
	    					that.circleInfo = res.data.data
			    			that.circleInfo.title = that.toChina(that.circleInfo.title)
			    			that.circleInfo.content = that.toChina(that.circleInfo.content)
			    			that.circleInfo.c_time = that.timeFormer(that.circleInfo.c_time)
	    					if(res.data.data.comment_list.length == 0){
								that.disableBottom = true
								that.$refs.vueLoad.onBottomLoaded(false)
								if(that.flag == 'fresh'){
									that.comment_list = []
									that.isAll = true
		    						that.$refs.vueLoad.onTopLoaded()
								}else{
									that.isAll = true
								}
							}else{
								that.disableBottom = false
								that.$refs.vueLoad.onBottomLoaded(true)
								if(that.flag == 'fresh'){
									that.comment_list = []
									res.data.data.comment_list.forEach(i=>{
										i.c_time = that.timeFormer(i.c_time)
			    						i.content = that.toChina(i.content)//检测表情转码
										that.comment_list.push(i)
									})
		    						that.$refs.vueLoad.onTopLoaded()
								}else{
									res.data.data.forEach(i=>{
										i.c_time = that.timeFormer(i.c_time)
			    						i.content = that.toChina(i.content)//检测表情转码
										that.comment_list.push(i)
									})
								}
							}
	    					break;
	    				default:
	    					break;
	    			}
	    			that.loadFinish = true
	    		})
			}
		},
		created(){
			this.commentPage = 1
			this.mid = localStorage.getItem('mid')
			this.token = localStorage.getItem('token')
			this.getCirclesInfoAjax()
		},
		mounted(){
			this.$previewRefresh() //不知道为什么要加这一句 不加的话有的会点不出来  可能是异步加载图片的原因
		}
	}
</script>

<style scoped lang="less">
.page{
	.page-content{
		padding-top: 44px;
		padding-bottom: .95rem;
		.head{
			background-color: #fff;
			padding: .3rem .2rem;
			.headBox{
				display: flex;
				display: -webkit-flex;
				align-items: center;
				position: relative;
				.img{
					display: block;
					width: .6rem;
					height: .6rem;
					border-radius: 50%;
	  				background-size: cover;
	  				background-repeat: no-repeat;
	  				background-position: center center;
				}
				div{
					height: 100%;
					margin-left: .2rem;
					display: flex;
					display: -webkit-flex;
					flex-direction: column;
					justify-content: space-around;
					p{
						font-size: .28rem;
						line-height: .35rem;
						margin-bottom: 0 !important;
						color: #000;
					}
					span{
						font-size: .22rem;
						line-height: .35rem;
						color: #a7a7a7;
					}
				}
				.guide_item{
					margin-top: 0 !important;
					display: flex;
					display: -webkit-flex;
					padding: 0.23rem;
					align-items: center;
					font-size:.24rem;
					position:absolute;
					top:50%;
					transform: translateY(-50%); 
					-webkit-transform: translateY(-50%);
					right:-.2rem;
					color: #a7a7a7;
					.icon_style{
						display: inline-block;
						width: .38rem;
						height: .35rem;
						margin-right: .075rem;
					}
				}
			}
			.goodImg{
				display: block;
				width: 100%;
				max-width: 7rem;
				margin: 0 auto;
				margin-top: .25rem;
			}
			.contentBox{
	  			width:  calc(100% - 1.4rem);
	  			margin: 0 auto;
	  			margin-left: .8rem;
	  			.title{
	  				text-align: left;font-size: .26rem;margin: .1rem 0 !important;
	  			}
				section{
					width: 100%;
					display: block;
					white-space: normal;
					font-size: .26rem;
				    margin-bottom: 0.1rem;
				}
			}
			.flexImgBox{
	  			display: flex;
	  			display: -webkit-flex;
	  			flex-direction: row;
	  			width:  calc(100% - 1.4rem);
	  			margin: 0 auto;
	  			margin-left: .8rem;
	  			flex-wrap: wrap;
	  			justify-content: flex-start;
	  			align-items: center;
	  			.bgImg{
	  				width: 80%;
	  				height: 3rem;
	  				background-size: cover;
	  				background-repeat: no-repeat;
	  				background-position: center center;
	  			}
	  			.bgImg2{
	  				width: 45%;
	  				height: 2rem;
	  				background-size: cover;
	  				background-repeat: no-repeat;
	  				background-position: center center;
	  				&:nth-child(2){
	  					margin-left: 5%;
	  				}
	  				&:nth-child(3){
	  					margin-top: .2rem;
	  				}
	  				&:nth-child(4){
	  					margin-left: 5%;
	  					margin-top: .2rem;
	  				}
	  			}
	  			.bgImg3{
	  				width: 30%;
	  				margin-left: 3%;
	  				padding-top: 30%;
	  				margin-top: .2rem;
	  				background-size: cover;
	  				background-repeat: no-repeat;
	  				background-position: center center;
	  				&:first-child{
	  					margin-left: 0%;
	  				}
	  				&:nth-child(1){
	  					margin-top: 0;
	  				}
	  				&:nth-child(2){
	  					margin-top: 0;
	  				}
	  				&:nth-child(3){
	  					margin-top: 0;
	  				}
	  				&:nth-child(4){
	  					margin-left: 0%;
	  				}
	  				&:nth-child(7){
	  					margin-left: 0%;
	  				}
	  			}
	  		}
			.bottomBox{
				height: .5rem;
				margin: .2rem auto 0;
				display: flex;
				display: -webkit-flex;
				justify-content: flex-end;
				.guide_item{
					display: flex;
					display: -webkit-flex;
					padding-right: 0.23rem;
					align-items: center;
					font-size:.24rem;
					&:last-child{
						padding-right: 0;
					}
					.icon_style{
						display: inline-block;
						width: .34rem;
						height: .31rem;
						margin-right: .075rem;
					}
				}
			}
		}
		.commentP{
			font-size: .26rem;
			height: .6rem;
			padding-left: .2rem;
			width: 100%;
			display: flex;
			display: -webkit-flex;
			align-items: center;
		}
		.bottomBar{
			z-index: 997;
			width: 100%;
			/*height: 1.45rem;*/
			height: .95rem;
			background-color: #fff;
			border-top: 1px solid #D9D9D9;
			padding: .1rem .2rem;
			position: fixed;
			bottom: 0;
			left: 0;
			display: flex;
			display: -webkit-flex;
			flex-direction: row;
			align-items: center;
			input{
				width: calc(100% - 1.5rem);
				height: .85rem;
			}
			span{
				background-color: #E87439;
				color: #fff;
				font-size: .3rem;
				display: flex;
				display: -webkit-flex;
				justify-content: center;
				align-items: center;
				width: 1.5rem;
				height: .95rem;
				position: absolute;
				right: 0;
				top: 0;
			}
			.bottomBtn{
				display: flex;
				display: -webkit-flex;
				justify-content: flex-start;
				.guide_item{
					margin-top: 0 !important;
					display: flex;
					display: -webkit-flex;
					padding: .2rem;
					margin-right: 1rem;
					justify-content: space-around;
					align-items: center;
					font-size:.24rem;
					color: #a7a7a7;
					.icon_style{
						display: inline-block;
						width: .44rem;
						height: .42rem;
						margin-right: .075rem;
					}
				}
			}
		}
	}
}
.bigImg{
	position: fixed;
	top: 0;
	left: 0;
	height: 100%;
	width: 100%;
	background-color: rgba(0,0,0,1);
	z-index: 999;
	display: flex;
	display: -webkit-flex;
	align-items: center;
	img{
		display: block;
		width: 100%;
		max-height: 100%;
	}
}
h5{
	text-align: center;height: 1rem;line-height: 1rem;color: #323232 ;
}
.default{
	color: #E87439 !important;
}
</style>