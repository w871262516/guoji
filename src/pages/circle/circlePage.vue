<template>
	<div>
		<div class="page">
		  	<div class="page-content">
				<von-header theme="light">
					<span slot="title">圈子</span>
			  		<button class="button button-icon headWord" slot="right" @click="goCheckInPage">签到</button>
				</von-header>
				<!--list: 我喜欢的 数据列表
				bottomBarWidth 底部iconbar的宽度-->
				<quick-loadmore :top-method="onRefresh" ref="vueLoad" 
                    :top-status-change="handleStatusChange" 
                    :bottom-method="onInfinite" 
                    :bottom-status-change="handleBottomStatusChange" 
                    :disable-top="disableTop" :disable-bottom="disableBottom" >
					<circle-list :list="circleLists"  bottomBarWidth="6.2rem" v-if="circleLists.length>0"></circle-list>
				</quick-loadmore>	
			</div>
		</div>
		<bottom></bottom>
	</div>	
</template>

<script>
	import circleList from './components/circleList.vue'
	import bottom from '../../components/footer/bottom.vue'
	export default{
		name:'circlesPage',
		components:{
	  		circleList,
	  		bottom
	  	},
		data(){
			return{
				lists:[],
				circleLists:[],
				flag:'fresh',
		        disableTop:false,//是否禁止下拉，默认允许
		        disableBottom:false,
		        loadFinish:true,
		        isAll:false,
		        token:'',
				page:1
			}
		},
		watch:{
			loadFinish(val){
				this.loadFinish = val
			}
		},
		methods:{
			goCheckInPage(){
				this.$router.push('/circle/integralCheckIn')
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
				this.getCirclesAjax()
	    	},
	    	onInfinite(){//上拉加载
	    		this.disableTop = true
				this.flag = 'infinite'
				this.page++ //下一页
				this.getCirclesAjax()
	    	},
	    	getCirclesAjax(){//获取圈子数据列表
	    		let that = this
	    		if(!that.loadFinish){
	    			return
	    		}
	    		that.$axios({
	    			method:'get',
	    			url:that.GLOBAL.develop_url+'api/circle',
	    			params:{
	    				page:that.page,
	    				token:that.token || ''
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
	    				case '200':
			    			if(res.data.data.length==0){
								that.disableBottom = true
								that.$refs.vueLoad.onBottomLoaded(false)
								if(that.flag == 'fresh'){
									that.isAll = true
									res.data.data.forEach(i=>{
										i.photo = JSON.parse(i.photo)
										i.c_time = that.timeFormer(i.c_time)
										i.title = that.toChina(i.title)
										that.circleLists.push(i)
									})
			    					that.$refs.vueLoad.onTopLoaded();
								}else{
									that.isAll = true
								}
							}else{
								that.disableBottom = false
								that.$refs.vueLoad.onBottomLoaded(true)
								if(that.flag == 'fresh'){
									that.circleLists = []
									res.data.data.forEach(i=>{
										i.photo = JSON.parse(i.photo)
										i.c_time = that.timeFormer(i.c_time)
										i.title = that.toChina(i.title)
										that.circleLists.push(i)
									})
									that.$refs.vueLoad.onTopLoaded()
								}else{
									res.data.data.forEach(i=>{
										i.photo = JSON.parse(i.photo)
										i.c_time = that.timeFormer(i.c_time)
										i.title = that.toChina(i.title)
										that.circleLists.push(i)
									})
								}
							}
	    					break;
	    				default:
	    					break;
	    			}
	    			that.loadFinish = true
	    		})
	    	}
		},
		created(){
			this.flag = 'fresh'
			this.token = localStorage.getItem('token')
			this.getCirclesAjax()
		}
	}
</script>

<style scoped lang="less">
.page{
	.page-content{
		padding-top: 44px;
		padding-bottom: 1rem;
	}
}
.headWord{
	font-size: .26rem !important;color: #E87439 !important;
}
h5{
	height: 1rem;
	width: 100%;
	line-height: 1rem;
	text-align: center;
	color: #323232;
}
</style>