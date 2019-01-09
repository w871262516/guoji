<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">售后处理</span>
			</von-header>
			<quick-loadmore :top-method="onRefresh" ref="vueLoad" 
                    :top-status-change="handleStatusChange" 
                    :bottom-method="onInfinite" 
                    :bottom-status-change="handleBottomStatusChange" 
                    :disable-top="disableTop" :disable-bottom="disableBottom" >
		  		<after-saler-part v-for="(data,index) in allDatas" :data="data" class="mt30"  v-if="loadFinish && allData.length>0"></after-saler-part>
			</quick-loadmore>	
		</div>
	</div>
</template>

<script>
	import afterSalerPart from '../components/afterSalerPart.vue'
	export default{
		name:'showIdentity',
		components:{
	  		afterSalerPart
		},
		data(){
			return{
				flag:'fresh',
		        disableTop:false,//是否禁止下拉，默认允许
		        disableBottom:false,
		        loadFinish:true,
		        isAll:false,
		        per:6,//前端自定义每页请求多少条数据
				page:1,
				allDatas:[],
				allData:[
					{
						goodStatus:"售中",
						goodImg:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1540356199789&di=6bf0285ecfeefcc2ff7ef3dcbccefeaf&imgtype=0&src=http%3A%2F%2Fphotocdn.sohu.com%2F20150708%2Fmp21851070_1436338308214_3.jpeg',
						goodName:'爱好速度还杀好看的还呼吁打算的哈萨克魂断蓝桥无我好了哈萨克的哈哈看得见',
						goodPrice:200.00,
						backNum:'52264645131365421313w122414asdasd',
						orderNum:'1321332131azsfasfadad13212t34121sdg314124y4y345234',
						goodNum:'123193879127rwq2afasdsd1313r2',
						applyTime:'2018-02-18'
					}
				]
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
			to(arg){
				this.$router.push(arg)
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
				this.getOrders()
	    	},
	    	onInfinite(){//上拉加载
	    		this.disableTop = true
				this.flag = 'infinite'
				this.page++ //下一页
				this.getOrders()
	    	},
			getOrders(){//获取订单 type为类型路由
				let that = this
	    		if(!that.loadFinish){
	    			return
	    		}
	    		console.log(that.urlType)
				that.$axios({
					method:'POST',
					url:that.GLOBAL.develop_url+'api/after_sale_list',
					data:{
						token:localStorage.getItem('token'),
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
		    			withCredentials:true
	    			},
		    		crossDomain:true,
		    		headers: { //解决跨域
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				}).then(function(res){
					console.log(res.data)
					switch(res.data.code){
						case "200":
							if(res.data.data.length == 0){
								that.disableBottom = true
								that.$refs.vueLoad.onBottomLoaded(false)
								if(that.flag == 'fresh'){
									that.allDatas = []
									that.isAll = true
		    						that.$refs.vueLoad.onTopLoaded()
								}else{
									that.isAll = true
								}
							}else{
								that.disableBottom = false
								that.$refs.vueLoad.onBottomLoaded(true)
								if(that.flag == 'fresh'){
									that.allDatas = []
		    						that.$refs.vueLoad.onTopLoaded()
								}
								res.data.data.forEach(function(item){
									item.c_time = that.timeFormer(item.c_time)
									item.thumb = eval(item.thumbs)[0].path
									that.allDatas.push(item)
								})
							}
							break;
						case "400":
							$toast.show('获取用户信息失败，请重新登录', 1000).then(() => {
								that.$router.push('/login')
							})
							break;
					}
	    			that.loadFinish = true
				}).catch(function(err){
					//$toast.show('网络错误', 2000).then(() => {})
				})
			}
		},
		created(){
			this.getOrders()
		}
	}
</script>

<style scoped lang="less">
.page-content {
  	padding-top: calc(44px + .3rem);
  	.mt30{
  		margin-top: .3rem;
  	}
}
</style>