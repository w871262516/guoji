<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">积分记录</span>
			  <button class="button button-icon " slot="right" @click="goIntegralHistory" style="font-size: .28rem;color: #E87439;">兑换记录</button>
			</von-header>
			
	  		<tabs :tab-items="tabs" :tab-index="tabIndex" :on-tab-click="onTabClick" top="44px"></tabs>
	  		
			<svgs style="display: none;"></svgs>
			<quick-loadmore :top-method="onRefresh" ref="vueLoad" 
                    :top-status-change="handleStatusChange" 
                    :bottom-method="onInfinite" 
                    :bottom-status-change="handleBottomStatusChange" 
                    :disable-top="disableTop" :disable-bottom="disableBottom" >
	  		<div class="timeBar" >
	  			<p @click="toShow">
	  				<!-- <span>{{defaultData[0].text}}年{{defaultData[1].text}}月</span> -->
	  				<span>筛选日期</span>
	  				<i>
	  					<section class="guide_item">
				        	<svg class="icon_style">
				                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#toDown'"></use>
				          	</svg>
				        </section>
	  				</i>
	  			</p>
	  			<p>
	  				<span v-show="tabIndex==0 || tabIndex ==1"><i>赚取：</i>{{myAllInte}}</span>
	  				<span v-show="tabIndex==0 || tabIndex ==2" class="ml20"><i>使用：</i>{{myAllUse}}</span>
	  			</p>
	  		</div>
	  		
	  		<list class="list-ios item-icon-right">
					<item class="myItem"  v-for="item in inteList">
						<div>
							<p class="default">{{item.remark}}</p>
							<p class="time">{{item.c_time}}</p>
						</div>
						<span class="default">
							{{item.addOrSub}}{{item.amount}}
						</span>
					</item>
				</list>
			</quick-loadmore>
			<template>
			  <div>
			    <vue-pickers
			      :show="showPicker"
			      :columns="pickerColumns"
			      :defaultData="defaultData"
			      :selectData="pickData"
			      @cancel="close"
			      @confirm="confirmFn"></vue-pickers>
			  </div>
			</template>
  		</div>
  	</div>
</template>

<script>
	import svgs from './components/svgs.vue'
	import vuePickers from 'vue-pickers'
	export default{
		name:'myIntegrations',
		components:{
			svgs,
			vuePickers
		},
		data(){
			return{
				tabs:[
					'全部',
					'赚取',
					'使用'
				],
				flag:'fresh',
				disableTop:false,//是否禁止下拉，默认允许
				disableBottom:false,
				loadFinish:true,
				tabIndex:0,
				page:1,
				birthday:'',
				myAllInte:0,
				myAllUse:0,
				showPicker:false,
				pickerColumns:2,
				defaultData:[],
				search_time:'',
				inteList:[],
				allList:[],
				getList:[],
				useList:[],
				pickData:{
			        // 第一列的数据结构
			        data1: [
			          {
			            text: "2018",
			            value: 3
			          },
			          {
			            text: "2017",
			            value: 2
			          },
			          {
			            text: "2016",
			            value: 1
			          },
			          {
			            text: "2015",
			            value: 0
			          }
			        ],
			        data2: [
			          {
			            text: "12",
			            value: 11
			          },
			          {
			            text: "11",
			            value: 10
			          },
			          {
			            text: "10",
			            value: 9
			          },
			          {
			            text: "09",
			            value: 8
			          },
			          {
			            text: "08",
			            value: 7
			          },
			          {
			            text: "07",
			            value: 6
			          },
			          {
			            text: "06",
			            value: 5
			          },
			          {
			            text: "05",
			            value: 4
			          },
			          {
			            text: "04",
			            value: 3
			          },
			          {
			            text: "03",
			            value: 2
			          },
			          {
			            text: "02",
			            value: 1
			          },
			          {
			            text: "01",
			            value: 0
			          }
			        ]
			    }
			}
		},
		created(){
			// let d = new Date(),
			//  	y = d.getFullYear(),
			//  	m = d.getMonth()+1
			//  	m < 10 ? m = '0'+ m : m
			// let oy = {text:y,value:y}
			// let om = {text:m,value:m}
			// console.log(om)
			// this.defaultData.push(oy,om)
			this.getAllIntegral();
		},
		methods:{
			// 暂时还没有分页
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
	    		// this.page = 1 //第一页
					this.getAllIntegral();
	    	},
	    	onInfinite(){//上拉加载
	    		this.disableTop = true
					this.flag = 'infinite'
					this.page++ //下一页
					this.getAllIntegral();
					this.myIntegral()
	    	},
			goIntegralHistory(){
				this.$router.push('/mine/myIntegrations/exchangeHistory')
			},
			back(){
				this.$router.go(-1)
			},
			onTabClick(index){
				this.inteList = []
				this.tabIndex = index
				this.close()
				this.getAllIntegral();
			},
			close() {
				this.showPicker = false
			},
			confirmFn(val) {
				this.search_time = val.select1.text+'-'+val.select2.text
				console.log("++++++++++++++",this.search_time)
				this.showPicker = false
				this.getAllIntegral();
			},
			toShow() {
				this.showPicker = true
			},
			getAllIntegral(){
				let that = this
				that.inteList = []
				that.$axios({
					method:'post',
					url:that.GLOBAL.develop_url+'api/hompage/integralshow',
					data:{
						token:localStorage.getItem('token'),
						page:1,
						search_time:that.search_time,
						type:that.tabIndex+1	
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
						case "200":	
						if(res.data.data.list.length == 0){
									that.disableBottom = true
									that.isAll = true
									that.$refs.vueLoad.onBottomLoaded(false)
									if(that.flag == 'fresh'){
											that.$refs.vueLoad.onTopLoaded()
									}
						}else{
								if(that.flag == 'fresh'){
									that.inteList = []
									that.$refs.vueLoad.onTopLoaded()
								}
								that.disableBottom = true
								that.$refs.vueLoad.onBottomLoaded(false)
								that.myAllInte = res.data.data.get_count
								that.myAllUse = res.data.data.use_count
								res.data.data.list.forEach((item)=>{
									item.c_time = that.timeFormer(item.c_time)
									if(item.type <8){	
										item.addOrSub = "+"
									}else{
										item.addOrSub = "-"
									}
									that.inteList.push(item)
								})
						}
							break;
						case "400":
							$toast.show('获取信息失败，请重新登录！', 1000).then(() => {
								that.$router.push('/login')
							})
						default:
							break;
					}
				})
			}
		}
	}
</script>

<style lang="less"	scoped>
.page-content {
  	padding-top: 93px;
  	// padding-bottom: 1rem;
	color: #323232;
  	font-size: .23rem;
  	.timeBar{
		display: flex;
		display: -webkit-flex;
		align-items: center;
		justify-content: space-between;
  		p{
  			display: flex;
  			display: -webkit-flex;
			align-items: center;
			justify-content: space-between;
			font-size: .2rem;
			padding: .15rem;
  			span{
  				i{
  					color: #b8b8b8;
  				}
  			}
  			&:first-child{
  				width: 1.85rem;
  			}
  			
  		}
  		.guide_item{
			display: flex;
			display: -webkit-flex;
			align-items: center;
			.icon_style{
				display: inline-block;
				width: .25rem;
				height: .25rem;
			}
		}
  	}
  	.list-ios{
  		padding-right: 0 !important;
  		.myItem{
  			// padding: .2rem 0 !important;
  			display: flex;
	  		display: -webkit-flex;
	  		justify-content: flex-start;
	  		align-items: center;
	  		position:relative;
	  		div{
	  			p{
	  				line-height: .35rem;
  					font-size: .2rem;
					color: #0e0e0e;
	  				&:first-child{
	  					font-size: .26rem !important;
  					}
	  			}
	  		}
  			span{
	  			position: absolute;
	  			right: .25rem;
	  			top: 50%;
	  			transform: translateY(-50%);
	  			-webkit-transform: translateY(-50%);
  			}
  		}
  	}
}
.default{
	color: #E87439 !important;
}
.ml20{
	margin-left: .2rem;
}
</style>