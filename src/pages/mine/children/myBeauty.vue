<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">我的美物志</span>
			  <button class="button button-icon " slot="right" @click="addBeauty"  style="font-size: .28rem;color: #E87439;">
			  	<section class="guide_item">
		        	<svg class="icon_style">
		                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#edit'"></use>
		          </svg>
		        </section>
			  </button>
			</von-header>
	  		<tabs :tab-items="tabs" :tab-index="tabIndex" :on-tab-click="onTabClick" top="44px"></tabs>
	  		<svgs style="display: none;"></svgs>
	  		<!--已发布-->
	  		<quick-loadmore :top-method="onRefresh" ref="vueLoad" 
                    :top-status-change="handleStatusChange" 
                    :bottom-method="onInfinite" 
                    :bottom-status-change="handleBottomStatusChange" 
                    :disable-top="disableTop" :disable-bottom="disableBottom" >
	  			<div class="sendBox" v-for="(data,index) in beautyDatas" v-if="beautyDatas!=null" v-show="tabIndex==0">
  					<div class="flexImgBox" :style="{backgroundImage:'url('+data.photo+')'}"  @click="goInfo(data.id)"></div>
	  				<div class="bottomBox">
	  					<span class="beautyName" v-html="data.title"></span>
	  					<div class="iconBox">
	  						<section class="guide_item">
					        	<svg class="icon_style">
					                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#love'"></use>
					         	</svg>
					         	<span>{{ data.fabulous }}</span>
					       </section>
					       <section class="guide_item">
					        	<svg class="icon_style">
					                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#eyes'"></use>
					          	</svg>
					         	<span>{{ data.see }}</span>
					        </section>
	  					</div>
	  				</div>
		  		</div>
		  		<!--草稿箱-->
		  		<div class="sendBox" v-for="(data,index) in beautyDatas" v-show="tabIndex==1">
	  				<div class="flexImgBox" :style="{backgroundImage:'url('+data.photo+')'}" @click="goView(data)"></div>
	  				<div class="bottomBox">
	  					<span class="beautyName" v-html="data.title"></span>
	  					<div class="iconBox">
	  						<section class="guide_item" @click="deleteBeauty(data.id)">
					        	<svg class="icon_style">
					                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#delete'"></use>
					        	 </svg>
					      </section>
	  					</div>
	  				</div>
		  		</div>
			</quick-loadmore>	
  		</div>
  	</div>
</template>

<script>
	import svgs from './components/svgs.vue'
	export default{
		name:'myBeauty',
		components:{
	  		svgs
		},
		data(){
			return{
		  		tabs:['已发表','草稿箱'],
		  		tabIndex:0,
				flag:'fresh',
		        disableTop:false,//是否禁止下拉，默认允许
		        disableBottom:false,
		        loadFinish:true,
		        isAll:false,
		        per:10,//前端自定义每页请求多少条数据
				page:1,
				urlType:'magazine', //定义访问路由
		  		beautyDatas:[]
			}
		},
		watch:{
			tabIndex(val){ //切换tab时设置this.page = 1
		 		this.beautyDatas = []
			 	switch (val){
			 		case 0:
			 			this.urlType = 'magazine'
			 			this.page = 1
			 			this.isAll = false
			 			this.flag == 'fresh'
						this.getMyBeauty()
			 			break;
			 		case 1:
			 			this.urlType = 'magazinelise'
			 			this.page = 1
			 			this.isAll = false
			 			this.flag == 'fresh'
						this.getMyBeauty()
			 			break;
			 	}
			},
			loadFinish(val){
				this.loadFinish = val
			}
		},
		methods:{
			back(){
				this.$router.go(-1)
			},	
			goInfo(id){
				this.$router.push({path:'/circle/circleInfo',query:{'id':id}})
			},
			goView(data){
				this.$router.push({name:'addBeauty',params:{'data':data}})
			},
			addBeauty(){
				this.$router.push('/mine/myBeauty/addBeauty')
			},
			onTabClick(index){
				this.tabIndex = index
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
				this.getMyBeauty()
	    	},
	    	onInfinite(){//上拉加载
	    		this.disableTop = true
				this.flag = 'infinite'
				this.page++ //下一页
				this.getMyBeauty()
	    	},
			getMyBeauty(){//获取美物志列表/草稿箱列表
				let that = this
	    		if(!that.loadFinish){
	    			return
	    		}
				that.$axios({
					method:'get',
					url:that.GLOBAL.develop_url+'api/hompage/'+this.urlType,
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
					switch(res.data.code){
						case 200:
							if(res.data.data == null){
								that.disableBottom = true
								that.$refs.vueLoad.onBottomLoaded(false)
								if(that.flag == 'fresh'){
									that.beautyDatas = []
									that.isAll = true
		    						that.$refs.vueLoad.onTopLoaded()
								}else{
									that.isAll = true
								}
							}else{
								that.disableBottom = false
								that.$refs.vueLoad.onBottomLoaded(true)
								if(that.flag == 'fresh'){
									that.beautyDatas = []
									res.data.data.forEach(i=>{
										i.title = that.toChina(i.title)
										i.content = that.toChina(i.content)
										that.beautyDatas.push(i)
									})
		    						that.$refs.vueLoad.onTopLoaded()
								}else{
									res.data.data.forEach(i=>{
										i.title = that.toChina(i.title)
										i.content = that.toChina(i.content)
										that.beautyDatas.push(i)
									})
								}
							}
							break;
						case "400":
							$toast.show('获取用户信息失败，请重新登录', 1000).then(() => {
								that.$router.push('/login')
							})
							break;
					}
					if(res.data.code==404){
						$toast.show(res.data.msg, 1000).then(() => {
							that.$router.push('/login')
						})
					}
	    			that.loadFinish = true
				}).catch(function(err){
					//$toast.show('网络错误', 2000).then(() => {})
				})
			},
			deleteBeauty(id){
				console.log(id)
				let that = this
				that.$axios({
					method:'get',
					url:that.GLOBAL.develop_url+'api/hompage/magdel',
					params:{
						token:localStorage.getItem('token'),
						id:id
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
						$toast.show('删除成功', 1000).then(() => {
							that.getMyBeauty()
						})
					}else if(res.data.code=400){
						$toast.show('获取用户信息失败，请重新登录', 1000).then(() => {
							that.$router.push('/login')
						})
					}
				}).catch(function(err){
					//$toast.show('网络错误', 2000).then(() => {})
				})
			}
		},
		created(){
			this.page = 1
			this.getMyBeauty()
		}
	}
</script>

<style scoped lang="less">
.page-content {
  	padding-top: 93px;
  	background-color: #F2F2F2;
  	.sendBox{
  		width: 100%;
  		background-color: #fff;
  		margin-bottom: .2rem;
  		.flexImgBox{
  			width: 100%;
  			height: 4rem;
  			background-position: center center;
  			background-repeat: no-repeat;
  			background-size: cover;
  		}
  		.bottomBox{
  			display: flex;
  			display: -webkit-flex;
  			justify-content: space-between;
			align-items: center;
  			padding: .1rem .2rem;
  			color: #757373;
  			font-size: .26rem;
  			.beautyName{
  				display: inline-block;
  				max-width: 60%;
  				overflow: hidden;
  				text-overflow: ellipsis;
  				white-space: nowrap;
   			}
  			.iconBox{
				height: 100%;
				display: flex;
				display: -webkit-flex;
				flex: 1;
				justify-content: flex-end;
  				.guide_item{
					display: flex;
					display: -webkit-flex;
					align-items: center;
					font-size:.25rem;
					margin-right: .2rem;
					.icon_style{
						display: inline-block;
						width: .3rem;
						height: .3rem;
						margin: 0.05rem 0;
						margin-right: .0275rem;
					}
				}
  			}
  		}
  	}
}
.button-icon{
	.guide_item{
		display: flex;
		display: -webkit-flex;
		align-items: center;
		font-size:.25rem;
		.icon_style{
			display: inline-block;
			width: .44rem;
			height: .4rem;
			margin: 0.05rem 0;
			margin-right: .0275rem;
		}
	}
}

</style>