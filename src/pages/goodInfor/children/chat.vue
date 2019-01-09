<template>
	<keep-alive>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light" style="background-color: #F2F2F2 !important;border-bottom: none;box-shadow: none;height: 54px !important;line-height: 54px  !important;">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">联系客服</span>
			  <button class="button button-icon headWord" slot="right" @click="goStore">进店</button>
			</von-header>
			
			<!--聊天内容-->
			<div class="chatContent" ref="chatContent">
				<!--发送链接-->
				<div class="sendLink">
					<span class="time">18:00</span>
					<div style="background-color: #fff;">
					<div class="linkDiv">
						<img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1530699922928&di=16640932c87ab068d5b4f41710fd6d95&imgtype=jpg&src=http%3A%2F%2Fimg3.imgtn.bdimg.com%2Fit%2Fu%3D2570764178%2C2072195131%26fm%3D214%26gp%3D0.jpg" class="goodImg"/>
						<div class="linkInfo">
							<p class="linkTitle">是的大幅度的发给我去额干啥开幕式的哦啊接手父亲被我IEUI柯基吧科技中心耦合剂收到货方宏伟秋日看速度快放假啊</p>
							<span>￥<i class="linkPrice">364</i></span>
						</div>
					</div>
					<a class="btn">发送商品链接</a>
					</div>
				</div>
				<template  v-for="(data,index) in datas">
					<div class="dataBox" v-if="data.receive_user_id != mid && data.msg_type == 'receive'">
						<span class="time">{{ data.time }}</span>
						<div class="contentBox">
							<img :src="data.userImg" class="userImg"/>
							<p>
								{{data.tcontentext}}
							</p>
						</div>
					</div>
					
					<div class="dataBox Me"  v-if="data.send_user_id == mid && data.msg_type == 'send'">
						<span class="time">{{ data.time }}</span>
						<div class="contentBox">
							<p>
								{{data.content}}
							</p>
							<img :src="data.userImg" class="userImg"/>
						</div>
					</div>
				</template>
				
				<svgs style="display: none;"></svgs>
				
				<!--底部bar-->
				<div class="barBottom">
					<section class="guide_item">
			        	<svg class="icon_style">
			                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#saying'"></use>
			        	</svg>
			        </section>
			        <input type="text" v-model="myWords" @keyup.enter="sendMyWords"/>
			        <section class="guide_item">
			        	<svg class="icon_style">
			                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#face'"></use>
			        	</svg>
			        </section>
			        <section class="guide_item">
			        	<svg class="icon_style">
			                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#addBtn'" fill="#E87439"></use>
			        	</svg>
			        </section>
				</div>
			</div>
		</div>
	</div>
	</keep-alive>
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
				mid:0,
				myWords:'',
	        	sendChatData:''
			}
		},
		computed:{
			datas(){
				return this.$store.state.chatData
			}
		},
		methods:{
			back(){
				this.$router.go(-1)
			},
			goStore(){
				this.$router.push({name:'stores'})
			},
			sendMyWords(){//监听回车键 发送内容
				this.$refs.chatContent.scrollTop = this.$refs.chatContent.scrollHeight || 0
				this.sendChatData = '{"receive_user_id":'+parseInt(this.$route.params.storesId)+',"send_user_id":'+this.mid+',"content":"'+this.myWords+'","type":"contact_customer_service","path":"chatting"}'
				this.$store.dispatch('socketOnSend',this.sendChatData)
				this.myWords = ''
			}
		},
		created(){
			this.mid = parseInt(localStorage.getItem('mid'))
			this.$refs.chatContent.scrollTop = this.$refs.chatContent.scrollHeight || 0
		}
	}
</script>

<style lang="less" scoped>
.page-content {
	color: #323232;
	.chatContent{
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
		.sendLink{
			display: flex;
			display: -webkit-flex;
			justify-content: center;
  			align-items: center;
			flex-direction: column;
			margin-bottom: .3rem;
			.time{
				width: auto;
				text-align: center;
				padding: .1rem .24rem;
				background-color: #b5b5b5;
				color: #fff;
				font-size: .24rem;
				border-radius: 20px;
				margin: .2rem 0;
			}
			.linkDiv{
				width: 100%;
				display: flex;
				display: -webkit-flex;
				justify-content: center;
				flex-direction: row;
				padding: .4rem 0;
				background-color: #fff;
				.goodImg{
					display: block;
					width: 1.6rem;
					height: 1.6rem;
					margin-right: .2rem;
				}
				.linkInfo{
					
					display: flex;
					display: -webkit-flex;
					justify-content: flex-start;
					flex-direction: column;
					.linkTitle{
						font-size: .24rem;
						line-height: .35rem;
						margin-bottom: .15rem !important;
					}
					span{
						color: #E87439;
						font-size: .24rem;
						i{
							font-size: .3rem;
						}
					}
				}
			}
			.btn{
				display: block;
				width: 2.4rem;
				height: .6rem;
				line-height: .6rem;
				font-size: .24rem;
				color: #E87439 !important;
				border: 1px solid #E87439;
				border-radius: 15px;
				text-align: center;
				margin: 0 auto .2rem;
			}
		}
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
			z-index: 100;
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
				span{
					font-size: .2rem;
					color: #b3b2b2;
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
	  		}
		}
	}
	.Other{
		.contentBox{
	  		padding-right: .9rem;
			p{
	  			
	  			background-color: #fff;
	  			padding: .15rem .2rem;
	  			margin-top: .25rem !important;
	  			margin-left: .25rem !important;
	  			position: relative;
	  			max-width: 5.2rem;
	  			border-radius:.075rem; 
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
	  			padding: .15rem .2rem;
	  			margin-top: .25rem !important;
	  			margin-right: .25rem !important;
	  			position: relative;
	  			max-width: 5.2rem;
	  			border-radius:.075rem; 
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