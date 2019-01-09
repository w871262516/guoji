<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">我的关注</span>
			</von-header>
	  		<svgs style="display: none;"></svgs>
	  		<quick-loadmore :top-method="onRefresh" ref="vueLoad" 
                    :top-status-change="handleStatusChange" 
                    :bottom-method="onInfinite" 
                    :bottom-status-change="handleBottomStatusChange" 
                    :disable-top="disableTop" :disable-bottom="disableBottom" >
				<slip-del ref="slipDel" del-text="取消关注" @del-click="unFollow(follow.mid)"  @slip-open="slipOpen" v-for="(follow,index) in followLists" :key="index" v-if="followLists!=null" class="box">
					<div slot="item"  class="fansList">
						<div :style="{backgroundImage:'url('+follow.photo+')'}" class="img"></div>
						<p>{{ follow.nickname }}</p>
						<section class="guide_item">
				        	<svg class="icon_style">
				                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#more'"></use>
				          	</svg>
				        </section>
					</div>
				</slip-del>
				<div v-if="followLists==null" class="blackList">
					<img src="../../../../static/saler/blackLists.png"/>
				</div>
				<h5 v-if="followLists==null">暂无关注</h5>
			</quick-loadmore>	
		</div>
	</div>
</template>

<script>
	import svgs from './components/svgs.vue'	
	import SlipDel from 'vue-slip-delete'
	export default{
		name:'myFollow',
		components:{
	  		svgs,
	  		SlipDel
		},
		data(){
			return{
		  		followLists:[],
				flag:'fresh',
		        disableTop:false,//是否禁止下拉，默认允许
		        disableBottom:false,
		        loadFinish:true,
		        isAll:false,
		        per:15,
				page:1,
				slipIndex:0
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
			slipOpen(vm) { //记录当前的左滑控件
				this.slipIndex = vm
		    },
			unFollow(id){//取消关注
				let that = this
				that.$axios({
					method:'post',
					url:that.GLOBAL.develop_url+'api/hompage/followdel',
					data:{
						token:localStorage.getItem('token'),
						follow_id:id
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
					that.slipIndex.offset = 0
					switch (res.data.code){
						case 200:
							$toast.show('取消成功', 1500).then(() => {
								that.onRefresh()
							})
							break;
						default:
							break;
					}
					if(res.data.code==404){
						$toast.show(res.data.msg, 1000).then(() => {
							that.$router.push('/login')
						})
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
	    	onRefresh(){ //下拉刷新  		
	    		this.disableBottom = true
    			this.flag = 'fresh'
	    		this.page = 1 //第一页
				this.getMyFollows()
	    	},
	    	onInfinite(){//上拉加载
	    		this.disableTop = true
				this.flag = 'infinite'
				this.page++ //下一页
				this.getMyFollows()
	    	},
			getMyFollows(){//获取我的关注
				let that = this
	    		if(!that.loadFinish){
	    			return
	    		}
				that.$axios({
					method:'get',
					url:that.GLOBAL.develop_url+'api/hompage/follow',
					params:{
						token:localStorage.getItem('token'),
						pe:that.per,
						page:that.page
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
							if(res.data.data==null){
			    				that.isAll = true
			    			}
			    			if(that.flag == 'fresh'){
			    				that.$refs.vueLoad.onTopLoaded();
			    				that.disableBottom = false
			    				that.isAll = false
			    				that.followLists = res.data.data
			    			}else{
			    				if(that.isAll){
			    					that.disableBottom = true
			    					that.$refs.vueLoad.onBottomLoaded(false)
			    				}else{
									that.followLists.push(res.data.data)
			    					that.disableBottom = false
			    					that.$refs.vueLoad.onBottomLoaded(true)
			    				}
			    			}
			    			if(res.data.data!=null){
								that.followLists.forEach(function(item){
									item.photo =  item.photo
									item.thumb =  item.thumb
								})
							}
							break;
						case 400:
							$toast.show('获取信息失败，请重新登录！', 1000).then(() => {
								that.$router.push('/login')
							})
							break;
						default:
							break;
					}
					if(res.data.code==404){
						$toast.show(res.data.msg, 1000).then(() => {
							that.$router.push('/login')
						})
					}
	    			that.loadFinish = true
				})
			}
		},
		created(){
			this.flag = 'fresh'
			this.page = 1
			this.getMyFollows()
		}
	}
</script>

<style scoped lang="less">
.page-content {
  	padding-top: 44px;
	color: #323232;
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
				width: .92rem;
				height: .92rem;
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
	.btnBar{
		width: 6rem;
		margin: 0 auto;
	}
}

h5{
	height: 1rem;
	width: 100%;
	line-height: 1rem;
	text-align: center;
	color: #323232;
}
.blackList{
	width: 100%;
	display: flex;
	display: -webkit-flex;
	justify-content: center;
	align-content: center;
	margin-top: .4rem;
	img{
		display: block;
		width: 2.64rem;
		height: 2.64rem;
		margin: 0 auto;
	}
}
</style>