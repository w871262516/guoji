<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light" style="background-color: #F2F2F2 !important;border-bottom: none;box-shadow: none;height: 54px !important;line-height: 54px  !important;">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">{{title}}</span>
			</von-header>
			
			<!--聊天内容-->
			<div class="chatContent">
				<div v-for="(data,index) in myChatData" class="dataBox" :class="data.to==to?'Me':'Other'">
					<span class="time">{{ data.time }}</span>
					<div class="contentBox">
						<p v-if="data.to==to"> 
							<img :src="data.file.url" class="chat-img" v-if="data.file"/>
							{{data.text}}
						</p>
						<!--<img :src="data.userImg" class="userImg"/>-->
						<div :style="{backgroundImage:'url('+data.userImg+')'}" class="userImg"></div>
						<p v-if="data.to!=to">
							<img :src="data.file.url" class="chat-img" v-if="data.file"/>
							{{data.text}}
						</p>
					</div>
				</div>
				<svgs style="display: none;"></svgs>
				
				<!--底部bar-->
				<div class="barBottom">
					<!-- <section class="guide_item">
			        	<svg class="icon_style">
			                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#saying'"></use>
			        	</svg>
			        </section> -->
			        <input type="text" v-model="myWords"/>
			        <section class="guide_item" @click="send">
			        	<svg class="icon_style_send">
			                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#send'"></use>
			        	</svg>
			        </section>
			        <section class="guide_item">
			        	<svg class="icon_style">
			                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#addBtn'" fill="#E87439"></use>
			        	</svg>
						<form ref="uploadForm" id="uploadForm" method="post" enctype="multipart/form-data" class="formInput">
							<input type="file" id="file" name="file" accept="image/*" multiple="multiple" @change="chooseImg($event)" v-if="isIphone"/>
							<!-- <input type="file" id="file" name="file" runat="server" capture="camera" accept="image/*" multiple="multiple" @change="chooseImg($event)" v-if="!isIphone"/> -->
							<input type="file" id="file" name="file" runat="server" accept="image/*" multiple="multiple" @change="chooseImg($event)" v-if="!isIphone"/>
						</form>
			        </section>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import svgs from '../../../components/common/svgs.vue'
	export default{
		name:'chat',
		components:{
			svgs
		},
		data(){
			return{
				myWords:'',
				myChatData:[],
				nowChatData:[],
				myRole:localStorage.getItem('myRole'),
				token:localStorage.getItem('token'),
				to:this.$route.query.sessionId,
				sessionId:"p2p-"+this.$route.query.sessionId,
				otherImg: this.$route.query.img?this.$route.query.img:"http://img.paipaiwang.com.cn/images/fb4a0e0620c25bd04a2110961d2d482b.png",
				userImg:this.$store.state.userInfo.allInfo.photo,
				iSay:{},
				heSay:{},
				title:this.$route.query.title?this.$route.query.title:'在线客服',
				sessionIdList:[],
				file:'',
				isIphone:true,
				isFirst:true,//是否是第一次聊天
			}
		},
		watch:{
			file(val){//监控图片变化 一但用户选好图片 马上自动上传
				console.log(val)
				var data = {
					to:this.to,
					fileInput:document.getElementById('file'),
				}
				this.$store.dispatch('p2pSendFiel',data)
			},
			otherChat(val){
				this.heSay = val
				this.heSay.userImg = this.otherImg
				if(this.heSay.IMstatus=="success"){
					this.myChatData.push(this.heSay)
				}else{
					
				}
			},
			myChat(val){
				this.iSay = val
				this.iSay.userImg = this.userImg
				if(this.iSay.IMstatus=="success"){
					this.$store.state.IMstatus = ''
					this.myWords = ''
				}else{
					
				}
			},
			historyData:{
				handler(val,oldVal){
					if(val[this.sessionId]){
						this.myChatData = val[this.sessionId]
						if(this.myChatData){
							this.myChatData.forEach(item => {
								if(item.from == 'business_66400'){
									item.userImg = this.otherImg
								}else{
									item.userImg = this.userImg
								}
							});
						}
					}
					
				},
				deep:true,
				immediate: true
			}
		},
		computed:{
			otherChat(){
				return this.$store.state.received
			},
			myChat(){
				return this.$store.state.sendOne
			},
			historyData(){
				// this.$set(this.historyData, this.sessionId, this.$store.state.historyData[this.sessionId])
				return this.$store.state.historyData
			},
			unRead(){
				// this.$set(this.historyData, this.sessionId, this.$store.state.historyData[this.sessionId])
				return this.$store.state.unRead
			}
		},
		created(){
			this.isIphone = this.thisIsIphone
			// this.$store.dispatch('initNimSDK',this.myRole)
			if(this.$store.state.historyData[this.sessionId]){
				console.log("历史historyData已存在",this.$store.state.historyData[this.sessionId]);
				this.myChatData = this.$store.state.historyData[this.sessionId]
				this.isFirst = false
			}else{
				this.getHistoryMsgs()
			}
			if(this.$route.query.hasUnRead){
				console.log(this.unRead);
				
				this.$store.dispatch('markMsgRead',this.unRead[this.to])
			}
			
		},
		mounted () {
			this.scrollToBottom();
		},
		//每次页面渲染完之后滚动条在最底部
		updated(){
			this.scrollToBottom();
		},
		methods:{
			scrollToBottom () {
				this.$nextTick(() => {
					var container = this.$el.querySelector(".chatContent");
					container.scrollTop = container.scrollHeight;
				})
			},
			back(){
				this.$router.go(-1)
			},
			getHistoryMsgs() {//获取云端历史记录
				let that = this
				this.$store.state.nim.getHistoryMsgs({
					scene: 'p2p',
					to: this.to,
					asc:true,
					done: ((error,obj) => {
						console.log('获取云端历史记录' + (!error?'成功':'失败'), error, obj);
						if (!error) {
							console.log(obj.msgs);
							if (obj.msgs.length>0) {
								var list = []
								obj.msgs.forEach((msg) => {
									var chat = {
										sessionId:msg.sessionId,
										text: msg.text,
										time: that.timeFormer(Number(msg.time) / 1000),
										to: msg.to,
										from: msg.from,
									}
									if(msg.from == that.to){
										chat.userImg = that.otherImg
									}else{
										chat.userImg = that.userImg
									}
									if (msg.file) {
										chat.file = msg.file
									}
									list.push(chat)
								})
								that.myChatData = list
								that.$store.commit("historyData",list)
							}
						}
					})
				})
				
			},
			send(){
				var data = {
					scene:'p2p',
					to:this.to,
					text:this.myWords
				}
				this.$store.dispatch('p2pSendMsg',data)
				if(this.isFirst){
					this.addSession();
				}
			},
			chooseImg(i){//选择图片
				this.file = i.target.files
				console.log("选择图片",this.file)
			},
			addSession(){//添加一条会话列表
				let that = this
				that.$axios({
	    			method:'post',
	    			url:that.GLOBAL.develop_url+'live/add_chat_log',
	    			data:{
						token:that.token,
						business_id:that.to.split('_')[1]
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
	    		}).catch(function(err){
					console.log(err);
	    			$toast.show('网络错误', 1000)
	    		})
			},
			
		}
	}
	
</script>

<style lang="less" scoped>
.page-content {
	color: #323232;
	.chatContent{
		padding-top: .2rem;
		background-color: #f2f2f2;
		border-top-left-radius: 15px;
		border-top-right-radius: 15px;
		border-top: 1px solid #eeeeee;
		box-shadow: 0px -8px 30px -3px 
		rgba(184, 183, 183, 0.35);
		position: fixed;
		top: 45px;
		left: 0;
		width: 100%;
		height: calc(100% - 45px);
		padding-bottom: 1.2rem;
		overflow: scroll;
		z-index: 1000;
		.barBottom{
			width: 100%;
			height: 1.2rem;
			background-color: #fff;
			position: fixed;
			left: 0;
			bottom: 0;
			display: flex;
			display: -webkit-flex;
			justify-content:space-around;
			align-items: center;
			padding: .3 .2rem;
			z-index: 2;
			input{
				width: 5.2rem;
				height: .6rem;
				border: 1px solid #e5e5e5; 
				border-radius: 20px;
				padding: 0 .25rem;
			}
			.guide_item{
				display: inline;
				display: flex;
				display: -webkit-flex;
				align-items: center;
				.icon_style{
					display: inline-block;
					width: .54rem;
					height: .54rem;
				}	
				.icon_style_send{
					display: inline-block;
					width: .48rem;
					height: .48rem;
				}
				span{
					font-size: .2rem;
					color: #b3b2b2;
				}
				.formInput{
					position: absolute;
					width: .54rem;
    				height: .54rem;
					opacity: 0;
					input{
						padding: 0 !important;
						position: absolute;
						width: 100%;
						height: 100%;
						opacity: 0;
					}
				}
			}
		}
	}
}
	.dataBox{
		padding: 0 .2rem;
		display: flex;
  		display: -webkit-flex;
  		justify-content: flex-start;
  		flex-direction: column;
  		align-items: center;
  		margin-bottom:.3rem;
		.time{
			width: auto;
			text-align: center;
			padding: .1rem .24rem;
			background-color: #b5b5b5;
			color: #fff;
			font-size: .24rem;
			border-radius: 20px;
			margin-bottom: .1rem;
		}
		.contentBox{
			width: 100%;
			display: flex;
	  		display: -webkit-flex;
	  		justify-content: flex-start;
	  		.userImg{
	  			display: block;
	  			width: .7rem;
	  			height: .7rem;
	  			border-radius: 50%;
  				background-size: cover;
  				background-repeat: no-repeat;
  				background-position: center center;
			  }
			  .chat-img{
				  width: 100%;
			  }
		}
	}
	.Other{
		.contentBox{
			padding-right: .9rem;	
			p{
	  			
	  			background-color: #fff;
	  			padding: .25rem .25rem .25rem .25rem;
	  			margin-top: .25rem !important;
	  			margin-left: .25rem !important;
	  			position: relative;
				max-width: 5rem;
	  			&:before{
	  				content: '';
	  				display: block;
	  				width: .35rem;
	  				height: .125rem;
	  				position: absolute;
	  				top: -0.02rem;
	  				left: -.3rem;
            	 	border-top: 2px solid transparent;
    	    	   	border-right: .2rem solid #fff;
            	 	border-bottom: .1rem solid transparent;
            	 	transform:rotate(10deg);
            	 	z-index: 1;
	  			}
	  		}
		}
	}
	.Me{
		.contentBox{
	  		justify-content: flex-end;
			padding-left: .9rem;  
	  		p{
				background-color: #9eea6a;
	  			padding: .25rem .25rem;
	  			margin-top: .25rem !important;
	  			margin-right: .25rem !important;
	  			position: relative; 
				max-width: 5rem;
	  			&:before{
	  				content: '';
	  				display: block;
	  				width: .35rem;
	  				height: .125rem;
	  				position: absolute;
	  				top: -0.02rem;
	  				right: -0.3rem;
            	 	border-top: 2px solid transparent;
    	    	   	border-left: .2rem solid #9eea6a;
            	 	border-bottom: .1rem solid transparent;
            	 	transform:rotate(-10deg);
            	 	z-index: 1;
	  			}
	  		}
		}
	}
.headWord{
	font-size: .26rem !important;color: #E87439 !important;
}
</style>