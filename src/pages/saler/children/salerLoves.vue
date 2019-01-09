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
					<list class="list-ios item-icon-right">
						<item v-for="(loves,index) in lovesLists"  class="loveList">
							<div class="listBox">
								<div class="userBox">
									<img :src="loves.userImg" class="userImg"/>
									<div class="userInfo">
										<p>{{ loves.userName }}</p>	
										<section class="guide_item">
								        	<svg class="icon_style">
								                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#love'"></use>
								          	</svg>
								        </section>
										<p>{{ loves.time }}</p>	
									</div>
								</div>
								<img :src="loves.goodImg" class="goodImg"/>
							</div>
						</item>
					</list> 
			</quick-loadmore>
		</div>
	</div>
</template>

<script>
	import svgs from '../../mine/children/components/svgs.vue'	
	export default{
		name:'salerLoves',
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
		  		lovesLists:[
		  			{
						userImg:'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=503039487,787829105&fm=27&gp=0.jpg',
		  				userName:'柳州螺蛳粉',
		  				time:'1分钟前',
						goodImg:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1531736465235&di=edcf811b3974a4fdcc3ad6a476316156&imgtype=0&src=http%3A%2F%2Fimg3.duitang.com%2Fuploads%2Fitem%2F201506%2F08%2F20150608101941_e8jMQ.jpeg'
		  			},
		  			{
						userImg:'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=830741073,4144081039&fm=27&gp=0.jpg',
		  				userName:'霸王叉烧饼',
		  				time:'1分钟前',
						goodImg:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1531736493760&di=5fcef5af456ec76e8b99ff24fd6213a4&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20171210%2F7fd4a3aeb3d247639d4bc00e7a1022c3.jpeg'
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
			del(){
				alert('!!')
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
	    	},
	    	onInfinite(){//上拉加载
	    		this.disableTop = true
				this.flag = 'infinite'
				this.page++ //下一页
			},
			getLoves(){
				let that = this
	    		if(!that.loadFinish){
	    			return
	    		}
				that.$axios({
					method:'POST',
					url:that.GLOBAL.develop_url+'api/business_auction_comment_message',
					data:{
						token:that.token,
						page:that.page
					},
					xhrFields:{
						widthCredentials:true
					},
	    			transformRequest:[function(data){
	    				let ret = ''
	    				for(let it in data){
	    					ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
	    				}
	    				return ret
	    			}],
					crossDomain:true,
					header:{
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				}).then(function(res){
					console.log(res.data)
					
					if(res.data.code == 404){
						$toast.show(res.data.msg, 1000).then(() => {
							that.$router.push('/login')
						})
					}
					switch (res.data.code){
						case "200":
							if(res.data.data==null){
			    				that.isAll = true
							}
							res.data.data.forEach(item => {
								item.c_time =  that.timeFormer(item.c_time)
								item.thumbs = eval(item.thumbs)[0].path
							});
			    			if(that.flag == 'fresh'){
			    				that.$refs.vueLoad.onTopLoaded();
			    				that.disableBottom = false
			    				that.isAll = false
			    				that.lovesLists = res.data.data
			    			}else{
			    				if(that.isAll){
			    					that.disableBottom = true
			    					that.$refs.vueLoad.onBottomLoaded(false)
			    				}else{
									that.lovesLists.push(res.data.data)
			    					that.disableBottom = false
			    					that.$refs.vueLoad.onBottomLoaded(true)
			    				}
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
	    			that.loadFinish = true
				})
			}
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
					}
					.userInfo{
						height:100%;
						display:flex;
						display: -webkit-flex;
						flex-direction: column;
						justify-content: space-between;
						.guide_item{
							.icon_style{
								display: inline-block;
								width: .34rem;
								height: .33rem;
								margin-right: .075rem;
								margin: 0.05rem 0;
							}
						}
					}
				}
				.goodImg{
					display: block;
					width: 1.28rem;
					height: 1.28rem;
					
				}
			}
		}
	}
}

</style>