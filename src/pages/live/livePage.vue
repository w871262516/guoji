<template>
	<div class="page has-navbar">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <span slot="title">直播</span>
			</von-header>
			<quick-loadmore :top-method="onRefresh" ref="vueLoad" 
                    :top-status-change="handleStatusChange" 
                    :bottom-method="onInfinite" 
                    :bottom-status-change="handleBottomStatusChange" 
                    :disable-top="disableTop" :disable-bottom="disableBottom">
				<p class="recom">推荐</p>
				<div class="live-box">
					<router-link :to="{name:'liveRoom',params:{data:item}}" class="live-item" v-for="item in liveList" :style="{background:'url('+item.live_cover+')  no-repeat center center'}">
						<div class="info">
							<!-- <p class="localtion">上海市</p> -->
							<div class="title">
								<div class="name">{{item.live_name}}</div>
								<!-- <div class="like">3928</div> -->
							</div>
						</div>
					</router-link>
				</div>
			</quick-loadmore>
		</div>
		<bottom></bottom>
	</div>
</template>

<script>
	import bottom from '../../components/footer/bottom.vue'
	export default {
		name:'livePage',
	  	components:{
	  		bottom
	  	},
	  	data(){
	  		return{
				token:localStorage.getItem('token'),
				flag:'fresh',
		        disableTop:false,//是否禁止下拉，默认允许
		        disableBottom:false,
		        loadFinish:true,
		        isAll:false,
		        per:10,//前端自定义每页请求多少条数据
				page:1,
	  			liveList:[]
	  		}
		  },
		  created(){
			  this.getLiveList();
		  },
		  methods:{
			back(){
				this.$router.go(-1)
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
				this.getLiveList();
			},
			onInfinite(){//上拉加载
				this.disableTop = true
				this.flag = 'infinite'
				this.page++ //下一页
				this.getLiveList();
			},
			getLiveList(){
				let that = this
				if(!that.loadFinish){
					return
				}
				that.$axios({
					method:'POST',
					url:'http://new.paipaiwang.com.cn/live/getChannelList',
					data:{
						token:that.token,
						records:that.per,
						pnum:that.page,
						// status:1,//（0：空闲,1：直播，2：禁用，3：录制中）
					},
					xhrFields:{
						widthCredentials:true
					},
					transformRequest:[function(data){
						let ret = ''
						for(let it in data){
							ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
						}
						return ret
					}],
					crossDomain:true,
					header:{
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				}).then(function(res){
					console.log(res.data)
					if(res.data.code == 200){
						if(res.data.data.length<1){
							that.isAll = true
							that.disableBottom = true
							that.$refs.vueLoad.onBottomLoaded(false)
						}
						
						if(that.flag == 'fresh'){
							that.$refs.vueLoad.onTopLoaded();
							that.disableBottom = false
							that.isAll = false
							res.data.data.live_list.forEach(item => {
								item.c_time =  that.timeFormer(item.c_time)
							});
							that.liveList= res.data.data.live_list
						}else{
							if(that.isAll){
								that.disableBottom = true
								that.$refs.vueLoad.onBottomLoaded(false)
							}else{
								res.data.data.live_list.forEach(item => {
									item.c_time =  that.timeFormer(item.c_time)
								});
								that.liveList.push(res.data.data.live_list)
								that.disableBottom = false
								that.$refs.vueLoad.onBottomLoaded(true)
							}
						}
					}else if(res.data.code == 404){
						$toast.show(res.data.msg, 1000).then(() => {
							that.$router.push('/login')
						})
					}
					that.loadFinish = true
				})
			}
		}
	 }
</script>
<style lang="less" scoped>
	.page-content{
		background-color: #fff;
		margin-bottom: 1rem;
		.recom{
			font-size: .34rem;
			padding: .3rem .4rem .1rem .4rem ;
		}
		.live-box{
			display: flex;
			display: -webkit-flex;
			flex-direction: row;
			flex-wrap: wrap;
			padding: .06rem;
			.live-item{
				width: 3.56rem;	
				height: 3.7rem;
				background: url(../../../static/live/live1.png) no-repeat center center;
				background-size: cover;
				border-radius: .1rem;
				margin: .06rem;
				position: relative;
				.info{
					position: absolute;
					// width: 100%;
					width: 90%;
					bottom: .3rem;
					margin: 0 5%;
					color: #fff;
					.localtion{
						font-size: .12rem;
					}
					.title{
						display: flex;
						display: -webkit-flex;
						flex-direction: row;
						justify-content: space-between;
					}

				}
			}
		}
	}
</style>