<template>
	<div>
		<div class="page">
		  	<div class="page-content">
		  		<von-header theme="light">
				  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
				  <span slot="title">消息</span>
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
						<slip-del ref="slipDel" del-text="删除" @del-click="deleteSession(list.business_id,index)"  @slip-open="slipOpen" v-for="(list,index) in chatLists" :key="index" class="box">
							<div slot="item"  class="fansList" @click="to(list)">
								<div :style="{backgroundImage:'url('+list.business_logo+')'}" class="img"></div>
								<p>{{ list.business_name }}</p>
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
	</div>
</template>

<script>
	import svgs from './components/svgs.vue'
	import SlipDel from 'vue-slip-delete'
	export default{
		name:'myMessage',
		components:{
			svgs,
			SlipDel
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
		data(){
			return{
				token:localStorage.getItem('token'),
				lists:[
					{
						id:'#system',
						text:'系统消息',
						divBg:'#af8c70',
						to:'/mine/message/systemMessage'
					},
					{
						id:'#comment',
						text:'评论',
						divBg:'#bac6ba',
						to:'/mine/message/comments'
					},
					{
						id:'#loveWhite',
						text:'喜欢',
						divBg:'#39a0fd',
						to:'/mine/message/loves'
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
		created(){
			this.getSessions()
		},
		methods:{
			back(){
				this.$router.go(-1)
			},
			to(list){
				this.$router.push({
					path:'/onlineService/business_'+list.business_id,
					query:{
						img:list.business_logo,
						title:list.business_name,
						sessionId:'business_'+list.business_id,
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
						type:1,
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
								if(that.unRead['business_'+item.business_id]){
								console.log("that.unRead['business_66400']",that.unRead['business_'+item.business_id]);
									item.unRead = that.unRead['business_'+item.business_id].length
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
			deleteSession(id,idx) {// 删除回调
				let that = this
				that.$axios({
	    			method:'post',
	    			url:that.GLOBAL.develop_url+'live/del_chat_log',
	    			data:{
						token:that.token,
						type:1,
						id:id
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
						// that.$store.dispatch('deleteSession','business_'+id)
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
				height: .84rem;
				width: .84rem;
				display: flex;
				display: -webkit-flex;
				justify-content: center;
				align-items: center;
				border-radius:50%;
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