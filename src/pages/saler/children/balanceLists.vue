<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">余额历史清单</span>
			</von-header>
			<svgs style="display: none;"></svgs>
			<div class="flexBar">
				<span class="flexSpan" @click="showModel">
					款项筛选
					<section class="guide_item" :class="{toUp:toUp}">
			        	<svg class="icon_style">
			                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#toDown'"></use>
			          </svg>
			       </section>
				   &nbsp;&nbsp;{{tabText}}
				</span>
				<p>余额(元)：<span class="default">{{user_money}}</span></p>
			</div>
			<ul class="chooseTypeBox" v-show="typeBar">
				<li v-for="(item,index) in tabList" @click="chooseItem(index)">{{item}}</li>
			</ul>
			<div class="wrap" v-show="typeBar"></div>
			<quick-loadmore :top-method="onRefresh" ref="vueLoad" 
                    :top-status-change="handleStatusChange" 
                    :bottom-method="onInfinite" 
                    :bottom-status-change="handleBottomStatusChange" 
                    :disable-top="disableTop" :disable-bottom="disableBottom" >
					<list class="list-ios item-icon-right">
						<item v-for="item in typeDatas">
							<section class="flexBox">
								<span>{{item.marks}}</span>
								<span>{{item.c_time}}</span>
							</section>
							<i class="icon default">{{item.addOrSub}}{{item.amounts}}</i>
						</item>
					</list> 
			</quick-loadmore>
  		</div>
  	</div>
</template>

<script>
	
	import svgs from '../../../components/common/svgs.vue'
	export default{
		name:'forgetPayPassword',
		data(){
			return{
				token:'',
				flag:'fresh',
		        disableTop:false,//是否禁止下拉，默认允许
		        disableBottom:false,
				loadFinish:true,
				type:1,
				page:1,
				typeBar:false,
				typeDatas:[],
				toUp:false,//综合排序的小图标旋转样式
				tabList:['全部款项','提现','充值','回款','余额相关','保证金相关'],
				tabText:'全部款项',
				user_money:this.$route.query.user_money
			}
		},
		components:{
			svgs
		},
		methods:{
			back(){
				this.$router.go(-1)
			},
			chooseItem(idx){
				this.typeDatas = []
				this.tabText = this.tabList[idx]
				this.type = idx+1;
				this.getBalanceList()
				this.showModel()
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
				this.getBalanceList()
	    	},
	    	onInfinite(){//上拉加载
	    		this.disableTop = true
				this.flag = 'infinite'
				this.page++ //下一页
				this.getBalanceList()
	    	},
			to(arg){
				this.$router.push(arg)
			},
			showModel(){
				this.toUp = !this.toUp
				this.typeBar = !this.typeBar	
			},
			getBalanceList(){
	    		let that = this
	    		this.$axios({
					method:'post',
	    			url:that.GLOBAL.develop_url+'api/business_money_info',
	    			data:{
	    				token:that.token,
						type:that.type,//查询条件 1全部 2提现 3 充值 4回款 5余额相关 6保证金相关
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
					if(res.data.code == "200"){
						that.amountData = res.data.data
						if(that.flag == 'fresh'){
							that.typeDatas = []
							that.$refs.vueLoad.onTopLoaded()
						}
						if(res.data.data.length == 0){
							that.disableBottom = true
							that.$refs.vueLoad.onBottomLoaded(false)
						}else{	
							that.disableBottom = false
							that.$refs.vueLoad.onBottomLoaded(true)
							res.data.data.forEach((item) => {
								item.c_time = that.timeFormer(item.c_time);
								if(item.type == 1||item.type == 2||item.type == 9){	
									item.addOrSub = "+"
								}else{
									item.addOrSub = "-"
								}
								that.typeDatas.push(item)
							});
						}
					}else{
						$toast.show(res.data.msg)
					}
				})
				that.loadFinish = true
	    	},
		},
		created(){
			this.page = 1
			this.token = localStorage.getItem('token')
			this.getBalanceList();
		}
	}
</script>

<style lang="less" scoped>
.page-content {
  	padding-top: 44px;
  	.flexBar{
  		display: flex;
  		display: -webkit-flex;
  		flex-direction: row;
  		align-items: center;
  		justify-content: space-between;
		height: 1rem;
		z-index: 9999;
  		background-color: #FFFFFF;
  		width: 100%;
  		padding: .15rem .2rem;
  		border-bottom: 1px solid #ddd;
  		// position: fixed;
  		// left: 0;
  		// top: 44px;
  		.flexSpan{
  			display: flex;
  			display: -webkit-flex;
  			justify-content: center;
  			align-items: center;
  		}
  	}
  	.wrap{
  		height: calc(100% - 1rem - 44px);
  		width: 100%;
  		position: fixed;
  		top: calc(1rem + 44px);
  		left: 0;
  		z-index: 8;
  		background-color: #282827;
  		opacity: 0.5;
  	}
  	.chooseTypeBox{
  		width: 100%;
  		position: fixed;
  		z-index: 9999;
  		top:calc(1rem + 44px);
  		background-color: #FFFFFF;
  		display: flex;
  		display: -webkit-flex;
  		flex-direction: row;
  		flex-wrap: wrap;
  		flex-direction: row;
  		padding: 0 0 0.2rem 0;
  		li{
  			color: #282827;
  			margin-left: .2rem;
  			margin-top: .2rem;
  			padding: .15rem .2rem;
  			border-radius: 10px;
  			background-color: #eeeded;
  		}
  	}
  	.list-ios{
  		// margin-top: 1rem;
  		padding-right:0 !important;
	  	.flexBox{
	  		display: flex;
	  		display: -webkit-flex;
	  		flex-direction: column;
	  		align-items: flex-start;
	  		justify-content:space-between;
			width: 100%;
			span{
				&:first-child{
					margin-bottom: .16rem;	
				}
			}
	  	}
	  	.icon{
	  		font-size: .26rem;
	  		position: absolute;
	  		right: .3rem;
	  		top: 50%;
	  		transform: translateY(-50%);
	  	}
  	}
}
.default{
	color: #E87439;
}
.toUp{
	transform: rotate(180deg);
	-webkit-transform: rotate(180deg);
}
.guide_item{
	height: 100%;
	display: flex;
	display: -webkit-flex;
	justify-content: center;
	align-items: center;
	.icon_style{
		display: inline-block;
		width: .38rem;
		height: .35rem;
	}
}
</style>