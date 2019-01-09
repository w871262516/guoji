<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">我的优惠券</span>
			</von-header>
	  		<tabs :tab-items="tabs" :tab-index="tabIndex" :on-tab-click="onTabClick" top="44px" style="letter-spacing: 1px;"></tabs>
	  		<quick-loadmore :top-method="onRefresh" ref="vueLoad" 
                    :top-status-change="handleStatusChange" 
                    :bottom-method="onInfinite" 
                    :bottom-status-change="handleBottomStatusChange" 
                    :disable-top="disableTop" :disable-bottom="disableBottom" >
                   
                <!--未使用-->
                <div v-if="tabIndex==0 && coupons.no_use.length>0">
                	<list class="list-ios item-icon-right">
						<item v-for="coupon in coupons.no_use">
							<section>
			       				 <div class="couponDiv" :class="{used:tabIndex==1 || tabIndex==2 }">
			       				 	<p>{{ coupon.amount }}元</p>
			       				 	<span>{{ coupon.title }}</span>
			       				 </div>
			       				 <div class="couponTips">
			       				 	<p>{{ coupon.create_time }}</p>
			       				 	<span>{{ coupon.expire_time }}</span>
			       				 </div>
			       				 <span class="useBtn" @click="useThisCoupon" v-if="tabIndex==0">
			       				 	立即使用
			       				 </span>
			       				 <span class="useBtn" v-if="coupon.isUsed==true">
			       				 	已使用
			       				 </span>
			       			</section>
						</item>
					</list>
                </div>
		  		
				<!--已使用-->
				<div v-if="tabIndex==1 && coupons.used.length>0">
					<list class="list-ios item-icon-right" >
						<item v-for="coupon in coupons.used">
							<section>
			       				 <div class="couponDiv" :class="{used:tabIndex==1 || tabIndex==2 }">
			       				 	<p>{{ coupon.amount }}元</p>
			       				 	<span>{{ coupon.title }}</span>
			       				 </div>
			       				 <div class="couponTips">
			       				 	<p>{{ coupon.create_time }}</p>
			       				 	<span>{{ coupon.expire_time }}</span>
			       				 </div>
			       				 <span class="useBtn" @click="useThisCoupon" v-if="tabIndex==0">
			       				 	立即使用
			       				 </span>
			       				 <span class="useBtn" v-if="coupon.isUsed==true">
			       				 	已使用
			       				 </span>
			       			</section>
						</item>
					</list>
				</div>
				<!--已过期-->
				<div v-if="tabIndex==2 && coupons.pass.length>0">
					<list class="list-ios item-icon-right">
						<item v-for="coupon in coupons.pass">
							<section>
			       				 <div class="couponDiv" :class="{used:tabIndex==1 || tabIndex==2 }">
			       				 	<p>{{ coupon.amount }}元</p>
			       				 	<span>{{ coupon.title }}</span>
			       				 </div>
			       				 <div class="couponTips">
			       				 	<p>{{ coupon.create_time }}</p>
			       				 	<span>{{ coupon.expire_time }}</span>
			       				 </div>
			       				 <span class="useBtn" @click="useThisCoupon" v-if="tabIndex==0">
			       				 	立即使用
			       				 </span>
			       				 <span class="useBtn" v-if="coupon.isUsed==true">
			       				 	已使用
			       				 </span>
			       			</section>
						</item>
					</list>
				</div>
		  		<!--<h5 v-if="(coupons.no_use.length == 0 || coupons.used.length == 0 || coupons.pass.length == 0) && loadFinish == true">暂无优惠券</h5>-->
			</quick-loadmore>	
		</div>
	</div>
</template>

<script>
	export default{
		name:'myCoupons',
		data(){
			return{
				left:'1',
				used:'1',
				expire:'1',
				tabs:['未使用','已使用','已过期'],
				tabIndex:0,
				flag:'fresh',
		        disableTop:false,//是否禁止下拉，默认允许
		        disableBottom:false,
		        loadFinish:true,
		        isAll:false,
		        per:8,//前端自定义每页请求多少条数据
				page:1,
				coupons:{
					no_use:[],
					used:[],
					pass:[]
				},
				filterCoupons:[]
			}
		},
		watch:{
			tabIndex(val){
				switch (val){
					case 0:
						this.filterCoupons = this.coupons.no_use
						break;
					case 1:
						this.filterCoupons = this.coupons.used
						break;
					case 2:
						this.filterCoupons = this.coupons.pass
						break;
					default:
						break;
				}
			},
			coupons(val){
				if(this.tabIndex==0){
					this.filterCoupons = this.coupons.no_use
				}else if(this.tabIndex==1){
					this.filterCoupons = this.coupons.used
				}else{
					this.filterCoupons = this.coupons.pass
				}
			}
		},
		methods:{
			back(){
				this.$router.go(-1)
			},
			onTabClick(index){
				this.tabIndex = index
				this.getMyAllCoupon()
			},
			useThisCoupon(){
				alert('正在使用中...')
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
				this.getMyAllCoupon()
	    	},
	    	onInfinite(){//上拉加载
	    		this.disableTop = true
				this.flag = 'infinite'
				this.page++ //下一页
				this.getMyAllCoupon()
	    	},
			getMyAllCoupon(){
				let that = this
	    		if(!that.loadFinish){
	    			return
	    		}
				that.$axios({
					method:'get',
					url:that.GLOBAL.develop_url+'api/hompage/coupon',
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
									that.coupons.no_use = []
									that.coupons.pass = []
									that.coupons.used = []
									that.isAll = true
		    						that.$refs.vueLoad.onTopLoaded()
								}else{
									that.isAll = true
								}
							}else{
								that.disableBottom = false
								that.$refs.vueLoad.onBottomLoaded(true)
								if(that.flag == 'fresh'){
									that.coupons.no_use = []
									that.coupons.pass = []
									that.coupons.used = []
									res.data.data.no_use.forEach(item=>{
										that.coupons.no_use.push(item)
									})
									res.data.data.used.forEach(item=>{
										that.coupons.used.push(item)
									})
									res.data.data.pass.forEach(item=>{
										that.coupons.pass.push(item)
									})
		    						that.$refs.vueLoad.onTopLoaded()
								}else{
									res.data.data.no_use.forEach(item=>{
										that.coupons.no_use.push(item)
									})
									res.data.data.used.forEach(item=>{
										that.coupons.used.push(item)
									})
									res.data.data.pass.forEach(item=>{
										that.coupons.pass.push(item)
									})
								}
							}
//							that.tabs[0] = '未使用'+'('+that.coupons.no_use.length+')'
//							that.tabs[1] = '已使用'+'('+that.coupons.used.length+')'
//							that.tabs[2] = '已过期'+'('+that.coupons.pass.length+')'
							break;
						case 400:
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
			}
		},
		created(){
			this.flag = 'fresh'
			this.page = 1
			this.getMyAllCoupon()
		}
	}
</script>

<style scoped lang="less">
.page-content {
  	padding-top: 100px;
	color: #323232;
	.list{margin-bottom: 0 !important;}
	.list-ios{
		padding-right: 0 !important;
		section{
			display: flex;
	  		display: -webkit-flex;
	  		justify-content: flex-start;
	  		align-items: center;
	  		.couponDiv{
	  			width: 2.16rem;
	  			padding: .25rem .15rem;
	  			display: flex;
	  			display: -webkit-flex;
	  			flex-direction: column;
	  			align-items: center;
  				background-color: #E87439;
	  			color: #fff;
	  			text-align: center;
	  			margin-right:.15rem;
	  			p{
	  				color: #fff !important;
	  				height: .4rem;
	  				line-height: .4rem;
  					font-size: .4rem;
  					margin-bottom: .1rem !important;
	  			}
	  			span{
	  				font-size: .24rem;
	  			}
	  		}
	  		.couponTips{
	  			display: flex;
	  			display: -webkit-flex;
	  			flex-direction: column;
	  			p{
	  				height: .24rem;
	  				line-height: .24rem;
  					font-size: .24rem;
  					margin-bottom: .12rem !important;
	  			}
	  			span{
	  				font-size: .2rem;
	  			}
	  		}
	  		.useBtn{
	  			display: inline-block;
	  			width: 1.3rem;
	  			padding: .15rem 0;
	  			position: absolute;
	  			top: 50%;
	  			right: .35rem;
	  			transform: translateY(-50%);
	  			-webkit-transform: translateY(-50%);
	  			background-color: #E87439;
	  			color: #fff;
	  			font-size: .24rem;
	  			text-align: center;
	  			border-radius: 15px;
	  		}
	  		.used{
	  			background-color: #b5b5b5;
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