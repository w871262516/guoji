<template>
		<div class="page">
		  	<div class="page-content">
		  		<von-header theme="light">
				  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
				  <span slot="title">卖家消息中心</span>
				</von-header>
		  		<list class="list-ios item-icon-right">
					<item  v-for="list in lists">
						<router-link :to="list.to" class="section">
							<div :style="{backgroundColor:list.divBg}" class="msgImg">
	       				 		<svgs :id="list.id" class="icon_style" iconWidth=".5rem" iconHeight=".5rem" fill="#ffffff"></svgs>
							</div>
					  		<p>
					  			{{list.text}}
					  			<i class="icon ion-ios-arrow-right"></i>
					  		</p>
	       				</router-link>
					</item>
				</list>
				
				<quick-loadmore  ref="vueLoad" 
                    :top-status-change="handleStatusChange" 
                    :bottom-method="onInfinite" 
                    :bottom-status-change="handleBottomStatusChange" 
                    :disable-top="disableTop" :disable-bottom="disableBottom" >
					<div class="" v-if="chatLists.length">
						<slip-del ref="slipDel" del-text="删除" @del-click="deleteSession(list.mid,index)"  @slip-open="slipOpen" v-for="(list,index) in chatLists" :key="index" class="box">
							<div slot="item"  class="fansList" @click="to(list)">
								<div :style="{backgroundImage:'url('+list.photo+')'}" class="img"></div>
								<p>{{ list.nickname }}</p>
								<badge :num="list.unRead" v-if="list.unRead" style="position: absolute;right:.8rem;"></badge>
								<section class="guide_item">
									<svg class="icon_style">
										<use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#more'"></use>
									</svg>
								</section>
							</div>
						</slip-del>
					</div>
				</quick-loadmore>
			</div>
		</div>
</template>

<script>
	import svgs from '../../mine/children/components/svgs.vue'	
	import SlipDel from 'vue-slip-delete'
	export default{
		name:'salerMessages',
		components:{
			svgs,
			SlipDel
		},
		data(){
			return{
				token:localStorage.getItem('token'),
				lists:[
					{
						id:'#system',
						text:'系统消息',
						divBg:'#3dabea',
						to:'/mine/salerCenter/salerSystemMessage'
					},
					{
						id:'#comment',
						text:'评论',
						divBg:'#bac6ba',
						to:'/mine/salerCenter/salerComments'
					},
					{
						id:'#loveWhite',
						text:'喜欢',
						divBg:'#E87439',
						to:'/mine/salerCenter/salerLoves'
					}
				],
				chatLists:[],
				flag:'fresh',
		        disableTop:true,//是否禁止下拉，默认允许
		        disableBottom:false,
				loadFinish:true,
				page:1,
				slipIndex:0,

			}
		},
		watch:{
			unRead(val){
				this.unRead = val
			}
		},
		computed:{
			unRead:{
				get: function () {
					return this.$store.state.unRead
				},
				set: function () {

				}
			}
		},
		created(){
			this.getSessions()
		},
		methods:{
			back(){
				this.$router.go(-1)
			},
			to(list){
				this.$router.push({
					path:'/onlineService/member_'+list.mid,
					query:{
						img:list.photo,
						title:list.nickname,
						sessionId:'member_'+list.mid,
						hasUnRead:list.unRead
					}
				})
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
	    	// onRefresh(){ //下拉刷新  		
	    	// 	this.disableBottom = true
    		// 	this.flag = 'fresh'
	    	// 	this.page = 1 //第一页
			// 	this.getBalanceList()
	    	// },
	    	onInfinite(){//上拉加载
	    		this.disableTop = true
				this.flag = 'infinite'
				this.page++ //下一页
				this.getSessions()
	    	},
			getSessions(){//获取会话列表
				let that = this
				that.$axios({
	    			method:'post',
	    			url:that.GLOBAL.develop_url+'live/get_chat_log',
	    			data:{
						token:that.token,
						type:2,
						page:that.page
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
						if(that.flag == 'fresh'){
							that.chatLists = []
						}
						if(res.data.data.length == 0){
							that.disableBottom = true
							that.$refs.vueLoad.onBottomLoaded(false)
						}else{	
							that.disableBottom = false
							that.$refs.vueLoad.onBottomLoaded(true)
							res.data.data.forEach((item) => {
								if(that.unRead['member_'+item.mid]){
									console.log("that.unRead['member_'+item.mid]",that.unRead['member_'+item.mid]);
									item.unRead = that.unRead['member_'+item.mid].length
								}
								that.chatLists.push(item)
							});
						}
					}else if(res.data.code==404){
						$toast.show(res.data.msg, 1000).then(() => {
							that.$router.push('/login')
						})
					}
	    		}).catch(function(err){
					console.log(err);
	    			$toast.show('网络错误', 1000)
	    		})
			},
			slipOpen(vm) {// 无需手动关闭
				this.slipIndex = vm
			},
			deleteSession(mid,idx) {// 删除回调
				let that = this
				that.$axios({
	    			method:'post',
	    			url:that.GLOBAL.develop_url+'live/del_chat_log',
	    			data:{
						token:that.token,
						type:2,
						id:mid
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
						$toast.show(res.data.msg, 1000).then(()=>{
							that.chatLists.splice(idx,1)
						})
					}else if(res.data.code==404){
						$toast.show(res.data.msg, 1000).then(() => {
							that.$router.push('/login')
						})
					}
	    		}).catch(function(err){
					console.log(err);
	    			$toast.show('网络错误', 1000)
	    		})
			}
		}
	}
</script>

<style lang="less" scoped>
.page-content {
  	padding-top: 44px;
  	padding-bottom: 1rem;
	color: #323232;
	  font-size: .23rem;
	  .box{
		.fansList{
			padding: .2rem;
			width: 100%;
			display: flex;
			display: -webkit-flex;
			justify-content: flex-start;
			align-items: center;
			position: relative;
			&:after{
				content: '';
				display: block;
				width:calc(100% - 1.32rem);
				height: 1px;
				background-color: #e4e4e4;
				position: absolute;
				bottom: 0;
				right: 0;
			}
			.img{
				display: block;
				width: .84rem;
				height: .84rem;
				border-radius: 50%;
				margin-right: .3rem;
  				background-size: cover;
  				background-repeat: no-repeat;
  				background-position: center center;
			}
			p{
				height: .32rem;
				line-height: .32rem;
				font-size: .32rem;
			}
		}
	}
	.box{
		&:last-child{
			.fansList{
				&:after{
					display: none;
				}
			}
		}
	}
	.guide_item{
		display: flex;
		display: -webkit-flex;
		align-items: center;
		position: absolute;
		top: 50%;
		right: .2rem;
		transform: translateY(-50%);
		-webkit-transform: translateY(-50%);
		.icon_style{
			display: inline-block;
			width: .34rem;
			height: .33rem;
			margin-right: .075rem;
		}
	}
	.item-icon-right{
		padding-right:0 !important;
		
		.section{
			display: flex;
			display: -webkit-flex;
			align-items: center;
			.msgImg{
				height: .84rem;width: .84rem;display: flex;display: -webkit-flex;justify-content: center;align-items: center;border-radius:50%;
				margin: 0  .2rem 0 0;
			}
			.userImg{
  				background-size: cover;
  				background-repeat: no-repeat;
  				background-position: center center;
			}
		}
  		.item{
			font-size: .3rem;
			line-height: .3rem;
			color: #323232;
			
  			.logoImg{
  				height: .84rem;width: .84rem;display: flex;display: -webkit-flex;justify-content: center;align-items: center;border-radius:50%;
  			}
  			p{
  				.specal{
  					font-size: .18rem;
  					border: 1px solid #E87439;
  					color: #E87439;
  					border-radius: 5px;
  					height: .27rem;
  					line-height: .27rem;
  					padding: 0rem .1rem;
  				}
				  font-size: .26rem;
				  padding: .1rem 0;
  				span{
  					font-size: .2rem !important;
  					color: #a2a2a2;
  				}
  			}
  		}
	}	
}
.ion-ios-arrow-right{
	color: #1c1c1c;position: absolute;right: .16rem;top: 50%;transform: translateY(-50%);-webkit-transform: translateY(-50%);height: auto;
}
.ion-ios-arrow-left{
	color: #1c1c1c;position: absolute;right: .16rem;top: .18rem;height: auto;
}
.icon{
	font-size: .35rem !important;
}
</style>