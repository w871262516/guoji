<template>
	<div class="page">
		<div class="page-content">
			<svgs-common></svgs-common>
			<svgs style="display: none;"></svgs>
			<von-header theme="light">
		    <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  
			  <span slot="title" class="flexbox">
			  	<img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1531463973802&di=d50aa3aa511aadb674a961492d087bd0&imgtype=0&src=http%3A%2F%2Fimg4.duitang.com%2Fuploads%2Fitem%2F201603%2F19%2F20160319141050_Qxk8S.thumb.700_0.jpeg" class="headBarImg"/>
			  	这是一个用户名
			  </span>
			</von-header>
			
			<!--动态封面-->
			<div class="coverDiv"></div>
			
			<div class="titleP">
				吃吃吃吃hi呵呵而后的标题
				<div class="timeBox">
					发布时间 2018-05-18 22:41:07
					<section class="guide_item">
			        	<svg class="icon_style">
			                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#eyes'" ></use>
			         	</svg>
			         	<span>99</span>
			       </section>
				</div>
			</div>
			<section class="contentBox">那就呵呵顺德区我卡呢欧群殴我很多时候佛法撒娇哦度会请勿诶话说多好委屈额</section>
			
			<div class="infoBox">
				<!--喜欢列表-->
				<div class="loveDiv">
					<img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1530699913209&di=e71ca3bf4c31be9bd8e3d12370362ce4&imgtype=0&src=http%3A%2F%2Fp3.wmpic.me%2Farticle%2F2018%2F01%2F05%2F1515116768_NFxkUZSy.jpg" class="loveUser"/>
					<img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1530699913209&di=e71ca3bf4c31be9bd8e3d12370362ce4&imgtype=0&src=http%3A%2F%2Fp3.wmpic.me%2Farticle%2F2018%2F01%2F05%2F1515116768_NFxkUZSy.jpg" class="loveUser"/>
					<img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1530699913209&di=e71ca3bf4c31be9bd8e3d12370362ce4&imgtype=0&src=http%3A%2F%2Fp3.wmpic.me%2Farticle%2F2018%2F01%2F05%2F1515116768_NFxkUZSy.jpg" class="loveUser"/>
				</div>
				
				<p class="infoP">
					<span>评论 0 </span>
					<span>喜欢 0 </span>
				</p>
				
				<!--评论列表-->
				<div class="commentDiv" v-if="hasComment">
					<div class="commentBox">
						<img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1530699922928&di=16640932c87ab068d5b4f41710fd6d95&imgtype=jpg&src=http%3A%2F%2Fimg3.imgtn.bdimg.com%2Fit%2Fu%3D2570764178%2C2072195131%26fm%3D214%26gp%3D0.jpg" class="userImg"/> 
						<div class="userBox">
							<div class="userInfo">
								<span class="userName">username</span>
								<span class="time">30分钟前</span>
							</div>
							<p class="commentP">
								别人说这是个好东西。
								别人说这是个好东西。
								别人说这是个好东西。
								别人说这是个好东西。
								别人说这是个好东西。
								别人说这是个好东西。
								别人说这是个好东西。
							</p>
						</div>
					</div>
					<div class="commentBox">
						<img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1530699922928&di=16640932c87ab068d5b4f41710fd6d95&imgtype=jpg&src=http%3A%2F%2Fimg3.imgtn.bdimg.com%2Fit%2Fu%3D2570764178%2C2072195131%26fm%3D214%26gp%3D0.jpg" class="userImg"/> 
						<div class="userBox">
							<div class="userInfo">
								<span class="userName">username</span>
								<span class="time">30分钟前</span>
							</div>
							<p class="commentP">
								别人说这是个好东西。
								别人说这是个好东西。
								别人说这是个好东西。
								别人说这是个好东西。
								别人说这是个好东西。
								别人说这是个好东西。
								别人说这是个好东西。
							</p>
						</div>
					</div>
				</div>
				
				<!--没有评论的时候显示这里-->
				<div class="withoutComments" v-else="hasComment == false">
					快来发表你的评论吧
				</div>
				
			</div>
			
			<!--底部bar-->
			<div class="bottomBar">
				<div @click="toggleFullScreenCommentBox" class="inputDiv"></div>
				<section class="guide_item" @click="collectThisDynamics">
		        	<svg class="icon_style">
		                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#collect'" v-show="isCollected == false"></use>
		                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#collected'" v-show="isCollected" fill="#E87439"></use>
		        	</svg>
		        </section>
		        <section class="guide_item" @click="share">
		        	<svg class="icon_style">
		                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#share'"></use>
		        	</svg>
		        </section>
		        <section class="guide_item" @click="dealThisDynamics">
		        	<svg class="icon_style">
		                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#more'"></use>
		        	</svg>
		        </section>
			</div>
			
			
			<!--写评论-->
			<div class="FullScreenCommentBox" v-show="writeComments">
				<von-header theme="light">
		 		   <button class="button button-icon headWord" slot="left" @click="toggleFullScreenCommentBox">取消</button>
					<span slot="title">
					  	发评论
					</span>
					<button class="button button-icon headWord" slot="right" @click="toggleFullScreenCommentBox">发送</button>
				</von-header>
				<textarea class="yourCommentsBox" rows="100" :value="yourComments" autofocus="autofocus" :maxlength="commentMaxLength">
					坚实的护卫开门萨迪克贫困柬埔寨小客车坚实的稍等权威寻址方式管理
				</textarea>
			</div>
		</div>
		<share-model v-show="showShareModel" @hideShareModel="hideShareModel"></share-model>
	</div>
</template>
<script>
	import shareModel from '../../../../components/common/shareModel.vue'
  import svgsCommon from '../../../../components/common/svgs.vue'
  import svgs from '../components/svgs.vue'
  export default {
  	name:'viewDynamics',
  	components:{
  		svgsCommon,
  		svgs,
		shareModel
  	},
    data() {
	    return {
	    		yourComments:'',//用户评论
	    		isCollected:false,//是否已收藏
	    		hasComment:true,//是否有评论
	    		writeComments:false,//写评论的Div默认隐藏
	    		commentMaxLength:300, //评论最大长度
				showShareModel:false
	    }
    },

    methods: {
	    back() {
	        this.$router.go(-1)
	    },
		share(){
			this.showShareModel = !this.showShareModel
		},
		hideShareModel(){
			this.showShareModel = false
		},
	    collectThisDynamics(){
	      	this.isCollected = !this.isCollected
	    },
	    toggleFullScreenCommentBox(){
	      	this.writeComments = !this.writeComments
	    },
	    dealThisDynamics(){
	      	$actionSheet.show({
			  // 支持三种主题样式 ios/android/weixin
			  theme: 'ios',
			  title: '请进行操作',
			  buttons: {
			    // 操作列表选项文字及回调函数
			    '删除': () => {
			      console.log('action 1 called.')
			    },
			
			    '编辑': () => {
			      console.log('action 2 called.')
			    }
			  }
			})
      	}
    }
  }
</script>

<style scoped lang="less">

.page-content {
  	padding-top: 44px;
  	padding-bottom: 1.1rem;
	color: #323232;
	.flexbox{
		display: flex;
		display: -webkit-flex;
		justify-content: center;
		align-items: center;
		.headBarImg{
			display: block;
			width: .44rem;
			border-radius: 50%;
			margin-right: .1rem;
		}
	}
  	.coverDiv{
		width: 100%;
		height: 3rem;
		background: url(../../../../../static/auction/auctionbg.png) no-repeat top left;
		background-size: cover;
		display: flex;
		display: -webkit-flex;
		justify-content: center;
		align-items: center;
		
	}
	.titleP{
		background-color: #fff;
		padding: .2rem .2rem;
		border-bottom: 1px solid #eeeeee;
 		font-size: .26rem;
 		.timeBox{
			width: 100%;
			display: flex;
			display: -webkit-flex;
			justify-content: flex-start;
			align-items: center;
			font-size: .24rem;
	 		.guide_item{
				display: flex;
				display: -webkit-flex;
				align-items: center;
				margin-left: .2rem;
				.icon_style{
					display: inline-block;
					width: .47rem;
					height: .35rem;
				}
			}
 		}
	}
	.contentBox{
		padding: .35rem .2rem;
		background-color: #fff;
		font-size: .24rem;
	}
	.infoBox{
		margin-top: .1rem;
		background-color: #fff;
		.loveDiv{
			display: flex;
			display: -webkit-flex;
			align-items: center;
			justify-content: flex-start;
			flex-wrap: wrap;
			padding: .2rem;
			.loveUser{
				display: block;
				width: .44rem;
				border-radius: 50%;
				margin: .1rem;
			}
		}
		.infoP{
			display: flex;
			display: -webkit-flex;
			align-items: center;
			justify-content: space-between;
			padding: .2rem;
			border-bottom:1px solid #eeeeee;
			font-size: .2rem;
		}
		.withoutComments{
			height: 3rem;
			background-color: #fff;
			line-height: 3rem;
			font-size: .22rem;
			text-align: center;
		}
		.commentDiv{
			.commentBox{
				width: 100%;
				display: flex;
				display: -webkit-flex;
				justify-content: flex-end;
				align-items: center;
				padding: .15rem .15rem .15rem .15rem;
				position: relative;
				min-height: 1rem;
				&:after{
					content: '';
					height: 1px;
					width:calc(100% - 1rem);
					position: absolute;
					right: 0;
					bottom: 0;
					background-color: #eeeeee;
				}
				.userImg{
					position: absolute;
					top: .2rem;
					left: .2rem;
					display: block;
					width: .62rem;
					height: .62rem;
					border-radius: 50%;
				}
				.userBox{
					width: calc(100% - 1rem);
					display: flex;
					display: -webkit-flex;
					flex-direction: column;
					padding-right: .2rem;
					.userInfo{
						width: 100%;
						display: flex;
						display: -webkit-flex;
						justify-content: space-between;
						align-items: center;
						span{
							font-size: .2rem;
							&:first-child{
								font-size: .24rem !important;
							}
						}
					}
					.commentP{
						line-height: .35rem;
						font-size: .2rem;
						color: #777777;
					}
				}
			}
		}
	}
	.bottomBar{
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 1rem;
		background-color: #fff;
		display: flex;
		display: -webkit-flex;
		justify-content: space-around;
		align-items: center;
		.inputDiv{
			display: inline-block;
			width: 4rem;
			height: .63rem;
			border-radius: 5px;
			border: solid 1px #eeeeee;
			padding: .15rem;
		}
		.guide_item{
			display: flex;
			display: -webkit-flex;
			align-items: center;
			margin-left: .2rem;
			.icon_style{
				display: inline-block;
				width: .47rem;
				height: .35rem;
			}
		}
	}
	.FullScreenCommentBox{
		position: fixed;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		background-color: #fff;
		z-index: 1000;
		padding-top: 44px;
		.yourCommentsBox{
			padding: .2rem;
			width: 100%;
			text-indent: 0;
		}
	}
}

.headWord{
	font-size: .26rem !important;color: #757373 !important;
}
</style>