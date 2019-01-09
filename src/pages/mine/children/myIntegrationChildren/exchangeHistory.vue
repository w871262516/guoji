<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">兑换记录</span>
			</von-header>
			
			<svgs style="display: none;"></svgs>
			
			<!--有兑换记录-->
			<quick-loadmore :top-method="onRefresh" ref="vueLoad" 
                    :top-status-change="handleStatusChange" 
                    :bottom-method="onInfinite" 
                    :bottom-status-change="handleBottomStatusChange" 
                    :disable-top="disableTop" :disable-bottom="disableBottom" >
				<exchange :historyList="historyList" :hasHistory="hasHistory"></exchange>
			</quick-loadmore>
		</div>
	</div>
</template>

<script>
	import svgs from '../../components/svgs.vue'
	import exchange from './components/exchange.vue'
	export default{
		name:'exchangeHistory',
		components:{
			svgs,exchange
		},
		data(){
			return{
				hasHistory:true,
				token:localStorage.getItem('token'),
				historyList:[],
				flag:'fresh',
		        disableTop:false,//是否禁止下拉，默认允许
		        disableBottom:false,
				loadFinish:true,
				page:1,

			}
		},
		created(){
			this.getHistory()
		},
		methods:{
			back(){
				this.$router.go(-1)
			},
			logout(){
				this.$router.push('/login')
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
				this.getHistory();
	    	},
	    	onInfinite(){//上拉加载
	    		this.disableTop = true
				this.flag = 'infinite'
				this.page++ //下一页
	    	},
			getHistory(){//获取兑换历史记录
				if(!this.loadFinish){
					return 
				}
	    		let that = this
	    		that.$axios({
	    			method:'post',
	    			url:that.GLOBAL.develop_url+'api/integral_exchange_goods_log',
	    			data:{
	    				token:that.token,
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
					if(res.data.code == "200"){
						if(that.flag == 'fresh'){
							that.historyList = []
							that.$refs.vueLoad.onTopLoaded()
						}
						if(res.data.data.length == 0){
							that.disableBottom = true
							that.$refs.vueLoad.onBottomLoaded(false)
						}else{	
							// that.disableBottom = false
							// that.$refs.vueLoad.onBottomLoaded(true)
							res.data.data.forEach((item) => {
								item.create_time = that.timeFormer(item.create_time);
								item.goods_img = eval(item.goods_img)[0].img
								that.historyList.push(item);
								
							});
							that.disableBottom = true
							that.$refs.vueLoad.onBottomLoaded(false)
						}
					}else{
						$toast.show(res.data.msg)
					}
				})
				that.loadFinish = true
			},
		}
	}
</script>

<style scoped lang="less">
.page-content {
  	padding-top: 44px;
	color: #323232;
  	font-size: .23rem;
  	.none{
  		position: absolute;
  		height: calc(100% - 44px);
  		width: 100%;
  		display: flex;
  		display: -webkit-flex;
  		justify-content: center;
  		align-items: center;
  		background-color: #fff;
  	}
  	.exchangeDiv{
  		width: 100%;
  		display: flex;
  		display: -webkit-flex;
  		flex-direction: column;
  		background-color: #fff;
  		padding: .2rem;
  		margin-top: .2rem;
		font-size: .2rem;
  		.stateBar{
	  		display: flex;
	  		display: -webkit-flex;
	  		width: 100%;
	  		justify-content: space-between;
  			.time{
  				color: #323232;
  			}
  			.state{
  				color: #E87439;
  			}
  		}
  		.exchangeInfo{
  			padding: .2rem 0 .2rem .2rem;
  			border-top: 1px solid #dcdcdc;
  			border-bottom: 1px solid #dcdcdc;
		  	margin: .2rem 0;
	  		display: flex;
	  		display: -webkit-flex;
	  		justify-content: space-between;
	  		align-items: center;
	  		.exchangeGoodInfo{
		  		display: flex;
		  		display: -webkit-flex;
		  		justify-content: flex-start;
		  		align-items: center;
		  		.exchangeImg{
		  			display: block;
		  			width: 1.25rem;
		  			height: 1.25rem;
					  margin-right: .25rem;
					  background-position: center center;
					  background-repeat: no-repeat;
					  background-size: cover;
		  		}
		  		.exchangeName{
		  			font-size: .24rem;
		  		}
	  		}
  		}
  		.exchangeBox{
	  		display: flex;
	  		display: -webkit-flex;
	  		flex-direction: column;
	  		.up{
		  		display: flex;
		  		display: -webkit-flex;
		  		justify-content: flex-end;
		  		margin-bottom: .2rem;
	  		}
	  		.down{
		  		display: flex;
		  		display: -webkit-flex;
		  		justify-content: flex-end;
		  		.btn{
		  			display: inline-block;
		  			padding: .1rem .25rem;
		  			border: 1px solid #E87439;
		  			border-radius: 20px;
		  			color: #E87439 !important;
		  		}
	  		}
  		}
  	}
}
.guide_item{
	display: flex;
	display: -webkit-flex;
	align-items: center;
	.icon_style{
		display: inline-block;
		width: .2rem;
		height: .2rem;
		margin-right: .075rem;
	}
}
</style>