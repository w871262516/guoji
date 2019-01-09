<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">我的粉丝</span>
			</von-header>
			<quick-loadmore :top-method="onRefresh" ref="vueLoad" 
                    :top-status-change="handleStatusChange" 
                    :bottom-method="onInfinite" 
                    :bottom-status-change="handleBottomStatusChange" 
                    :disable-top="disableTop" :disable-bottom="disableBottom" >
		  		<list class="list-ios item-icon-right" v-if="fansLists!=null">
					<item class="fansList" v-for="fans in fansLists">
					<!--	<img :src="fans.photo" />-->
						<div :style="{backgroundImage:'url('+fans.photo+')'}" class="img"></div>
						<p>{{ fans.nickname }}</p>
						<div @click="changeEach(fans.is_fans,fans.mid)" class="infoBox">
							<span v-show="fans.is_fans==0">
							<i class="default">+</i>
							关注
							</span>
							<span v-show="fans.is_fans==1">
							互相关注
							</span>
						</div>
					</item>
				</list>	
				<div v-if="fansLists==null" class="blackList">
					<img src="../../../../static/saler/blackLists.png"/>
				</div>
				<h5 v-if="fansLists==null">暂无粉丝</h5>
			</quick-loadmore>	
		</div>
	</div>
</template>

<script>
	export default{
		name:'myFans',
		components:{
		},
		data(){
			return{
		  		fansLists:[],
				flag:'fresh',
		        disableTop:false,//是否禁止下拉，默认允许
		        disableBottom:false,
		        loadFinish:true,
		        isAll:false,
		        per:10,
				page:1
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
			changeEach(it,id){
				if(it==0){
					it = 1
				}else{
					it = 0
				}
				console.log(id)
				console.log(it)
				let that = this
	    		if(!that.loadFinish){
	    			return
	    		}
				that.$axios({
					method:'get',
					url:that.GLOBAL.develop_url+'api/hompage/fanseach',
					params:{
						token:localStorage.getItem('token'),
						fans_id:id,
						is_fans:it
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
							if(it == 1){
								$toast.show('关注成功', 1000).then(() => {
									that.getMyFans()
								})
							}else{
								$toast.show('取关成功', 1000).then(() => {
									that.getMyFans()
								})
							}
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
				this.getMyFans()
	    	},
	    	onInfinite(){//上拉加载
	    		this.disableTop = true
				this.flag = 'infinite'
				this.page++ //下一页
				this.getMyFans()
	    	},
			getMyFans(){
				let that = this
	    		if(!that.loadFinish){
	    			return
	    		}
				that.$axios({
					method:'get',
					url:that.GLOBAL.develop_url+'api/hompage/fans',
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
			    				that.fansLists = res.data.data
			    			}else{
			    				if(that.isAll){
			    					that.disableBottom = true
			    					that.$refs.vueLoad.onBottomLoaded(false)
			    				}else{
									that.fansLists.push(res.data.data)
			    					that.disableBottom = false
			    					that.$refs.vueLoad.onBottomLoaded(true)
			    				}
			    			}
			    			if(res.data.data != null){
								that.fansLists.forEach(function(item){
									item.photo = item.photo
									item.thumb = item.thumb
								})
							}
							break;
						case "400":
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
			this.getMyFans()
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
		.fansList{
			display: flex;
			display: -webkit-flex;
			justify-content: flex-start;
			align-items: center;
			position: relative;
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
			.infoBox{
				position: absolute;
				right: .2rem;
				border: 1px solid #aaaaaa;
				padding: .1rem .17rem;
				text-align: center;
				line-height: 1;
				letter-spacing: 1px;
				border-radius: 5px;
				font-size: .24rem;
				span{
					.default{
						color: #E87439;
						letter-spacing: 1.5px;
					}
					i{
						font-weight: 500;
						font-size: .25rem;
					}
				}
			}
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