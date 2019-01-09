<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">喜欢</span>
			</von-header>
	  		<svgs style="display: none;"></svgs>
	  		<quick-loadmore :top-method="onRefresh" ref="vueLoad" 
                    :top-status-change="handleStatusChange" 
                    :bottom-method="onInfinite" 
                    :bottom-status-change="handleBottomStatusChange" 
                    :disable-top="disableTop" :disable-bottom="disableBottom">
					<list class="list-ios item-icon-right" v-if="lovesLists.length>0">
						<item v-for="(loves,index) in lovesLists"  class="loveList" @click.native="goInfo(loves.aid)">
							<div class="listBox">
								<div class="userBox">
									<div :style="{backgroundImage:'url('+loves.picture+')'}" class="userImg"></div>
									<div class="userInfo">
										<p>{{ loves.nickname }}</p>	
										<section class="guide_item">
								        	<svg class="icon_style">
								                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#collected'" fill="#E87439"></use>
								          	</svg>
								        </section>
										<p>{{ loves.c_time }}</p>	
									</div>
								</div>
								<div :style="{backgroundImage:'url('+loves.photo+')'}" class="goodImg" v-if="loves.photo != ''"></div>
							</div>
						</item>
					</list> 
					<h5 v-if="lovesLists.length < 1 && loadFinish == true">暂无数据</h5>
			</quick-loadmore>
		</div>
	</div>
</template>

<script>
	import svgs from '../../../../components/common/svgs.vue'	
	export default{
		name:'loves',
		components:{
	  		svgs
		},
		data(){
			return{
				flag:'fresh',
		        disableTop:false,//是否禁止下拉，默认允许
		        disableBottom:false,
		        loadFinish:true,
		        isAll:false,
		        per:10,//前端自定义每页请求多少条数据
				page:1,
		  		lovesLists:[]
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
			del(){
				alert('!!')
			},
			goInfo(id){
				this.$router.push({path:'/circle/circleInfo',query:{'id':id}})
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
	    		this.getMyLoves()
	    	},
	    	onInfinite(){//上拉加载
	    		this.disableTop = true
				this.flag = 'infinite'
				this.page++ //下一页
	    		this.getMyLoves()
	    	},
	    	getMyLoves(){ //获取我被喜欢的消息
				let that = this
	    		if(!that.loadFinish){
	    			return
	    		}
				that.$axios({
					method:'get',
					url:that.GLOBAL.develop_url+'api/hompage/msgmaglike',
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
			    					that.lovesLists = []
			    					that.$refs.vueLoad.onTopLoaded();
								}else{
									that.isAll = true
								}
							}else{
								that.disableBottom = false
								that.$refs.vueLoad.onBottomLoaded(true)
								if(that.flag == 'fresh'){
									that.lovesLists = []
									res.data.data.forEach(i=>{
										i.c_time = that.timeFormer(i.c_time)
										that.lovesLists.push(i)
									})
									that.$refs.vueLoad.onTopLoaded()
								}else{
									res.data.data.forEach(i=>{
										i.c_time = that.timeFormer(i.c_time)
										that.lovesLists.push(i)
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
			}
		},
		created(){
			this.getMyLoves()
		}
	}
</script>

<style scoped lang="less">
.page-content {
  	padding-top: 44px;
	color: #323232;
	.list-ios{
		font-size: .24rem;
		padding-right: 0 !important;
		position: relative;
		.loveList{
			.listBox{
				width: 100%;
				display: flex;
				display: -webkit-flex;
				justify-content: space-between;
				align-items: center;
				.userBox{
					height: 1rem;
					display:flex;
					display: -webkit-flex;
					align-items: center;
					display:-webkit-flex;
					.userImg{
						display: block;
						width: .9rem;
						height: .9rem;
						border-radius: 50%;
						margin-right: .1rem;
		  				background-size: cover;
		  				background-repeat: no-repeat;
		  				background-position: center center;
					}
					.userInfo{
						height:100%;
						display:flex;
						display: -webkit-flex;
						flex-direction: column;
						justify-content: space-between;
						.guide_item{
							display: flex;
							display: -webkit-flex;
							align-items: center;
							.icon_style{
								display: inline-block;
								width: .34rem;
								height: .31rem;
								margin: 0.05rem 0;
								transform: scale(0.8);
								-webkit-transform: scale(0.8);
							}
						}
					}
				}
				.goodImg{
					display: block;
					width: 1.28rem;
					height: 1.28rem;
	  				background-size: cover;
	  				background-repeat: no-repeat;
	  				background-position: center center;
				}
			}
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