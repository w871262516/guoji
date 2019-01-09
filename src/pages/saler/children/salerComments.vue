<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">我的评论</span>
			</von-header>
	  		<quick-loadmore :top-method="onRefresh" ref="vueLoad" 
                    :top-status-change="handleStatusChange" 
                    :bottom-method="onInfinite" 
                    :bottom-status-change="handleBottomStatusChange" 
                    :disable-top="disableTop" :disable-bottom="disableBottom">
					<list class="list-ios item-icon-right">
						<item v-for="data in listDatas" class="tab1">
							<section>
								<div class="userBox">
			   				 		<div class="contentBox">
			   				 		    <img :src="data.photo" class="userImg"/>
			   				 			<p>{{ data.nickname}}</p>
			   				 		</div>
                                    <div class="dateBox">
                                        <span>{{ data.c_time}}</span>
                                        <!-- <span>{{ data.scan }}人浏览</span> -->
										<div class="start">商品评价:<rate :length="5" :value="data.star" :disabled="true"/></div>
										<div>物流服务:<rate :length="5" :value="data.lgs_star" :disabled="true"/></div>
										<div>服务态度:<rate :length="5" :value="data.ser_star" :disabled="true"/></div>
										
                                        
                                    </div>
								</div>
                                <div class="content-text">
                                    <p>{{ data.content }}</p>
                                </div>
                                <div class="flexImgBox">
                                    <template v-for="photo in data.comment_thumbs">	
										<img :src="photo.path" class="bgImg"/>
                                        <!-- <div :style="{backgroundImage:'url('+photo.img+')'}" class="bgImg" ></div> -->
                                    </template>
                                </div>
                                 <div class="goods">
                                    <!-- <img :src="data.thumbs" class="commentImg"/> -->
									<div :style="{backgroundImage:'url('+data.thumbs+')'}" class="commentImg" ></div>
                                    <div class="desc">
                                        <p>{{ data.title }}</p>
                                        <p>￥{{ data.pay_amount }}</p>
                                    </div>
                                </div>
			       			</section>
						</item>
					</list>
			</quick-loadmore>
	  	</div>
	</div>
</template>
<script>
    import svgs from '../../mine/components/svgs.vue'
	export default{
		name:'myComments',
		data(){
			return{
				token:localStorage.getItem('token'),
				flag:'fresh',
		        disableTop:false,//是否禁止下拉，默认允许
		        disableBottom:false,
		        loadFinish:true,
		        isAll:false,
		        per:10,//前端自定义每页请求多少条数据
				page:1,
				listDatas:[
                    {
						photo:'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=503039487,787829105&fm=27&gp=0.jpg',
		  				nickname:'左岸苏荷',
                        c_time:'1分钟前',
                        star:5,
                        scan:32,
                        content:'没有填写评价！！！！！！！',
                        comment_thumbs:[
                            {img:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1531736465235&di=edcf811b3974a4fdcc3ad6a476316156&imgtype=0&src=http%3A%2F%2Fimg3.duitang.com%2Fuploads%2Fitem%2F201506%2F08%2F20150608101941_e8jMQ.jpeg'},
                            {img:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1531736465235&di=edcf811b3974a4fdcc3ad6a476316156&imgtype=0&src=http%3A%2F%2Fimg3.duitang.com%2Fuploads%2Fitem%2F201506%2F08%2F20150608101941_e8jMQ.jpeg'},
                            // {img:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1531736465235&di=edcf811b3974a4fdcc3ad6a476316156&imgtype=0&src=http%3A%2F%2Fimg3.duitang.com%2Fuploads%2Fitem%2F201506%2F08%2F20150608101941_e8jMQ.jpeg'},
                            // {img:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1531736465235&di=edcf811b3974a4fdcc3ad6a476316156&imgtype=0&src=http%3A%2F%2Fimg3.duitang.com%2Fuploads%2Fitem%2F201506%2F08%2F20150608101941_e8jMQ.jpeg'},
                            // {img:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1531736465235&di=edcf811b3974a4fdcc3ad6a476316156&imgtype=0&src=http%3A%2F%2Fimg3.duitang.com%2Fuploads%2Fitem%2F201506%2F08%2F20150608101941_e8jMQ.jpeg'},
                        
                        ],
                        thumbs:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1531736465235&di=edcf811b3974a4fdcc3ad6a476316156&imgtype=0&src=http%3A%2F%2Fimg3.duitang.com%2Fuploads%2Fitem%2F201506%2F08%2F20150608101941_e8jMQ.jpeg',
                        title:'广西鲜甜新鲜特技百香果',
                        pay_amount:'48.00'
		  			}
                ]
			}
		},
		watch:{
			loadFinish(val){
				this.loadFinish = val
			}
		},
		created(){
			this.getMyComments();
		},
		methods:{
			back(){
				this.$router.go(-1)
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
				this.getMyComments();
	    	},
	    	onInfinite(){//上拉加载
	    		this.disableTop = true
				this.flag = 'infinite'
				this.page++ //下一页
				this.getMyComments();
			},
			getMyComments(){
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
							if(res.data.data.length<1){
                                that.isAll = true
                                that.disableBottom = true
                                that.$refs.vueLoad.onBottomLoaded(false)
                            }
                            
							res.data.data.forEach(item => {
								item.c_time =  that.timeFormer(item.c_time)
								item.comment_thumbs = eval(item.comment_thumbs)
                                item.thumbs = eval(item.thumbs)[0].path
                                item.content = that.toChina(item.content)
							});
			    			if(that.flag == 'fresh'){
			    				that.$refs.vueLoad.onTopLoaded();
			    				that.disableBottom = false
			    				that.isAll = false
			    				that.listDatas = res.data.data
			    			}else{
			    				if(that.isAll){
			    					that.disableBottom = true
			    					that.$refs.vueLoad.onBottomLoaded(false)
			    				}else{
									that.listDatas.push(res.data.data)
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








	// function hoverChange(i){
		
	// }


</script>
<style scoped lang="less">
.page-content {
  	padding-top: 44px;
  	.list-ios{
  		padding-right: 0 !important;
      }
  	.tab1{
  		section{
  			width: 100%;
  			.userBox{
                .contentBox{
                    display: flex;
                    display: -webkit-flex;
                    flex-direction: row;
                    justify-items: start;
                    align-items: center;
                    .userImg{
                        display: block;
                        width: .8rem;
                        height: .8rem;
                        border-radius: 50%;
                        margin-right: .1rem;
                    }
                    p{  
                        padding-left: .2rem;
                    }
                }
                .dateBox{
                    padding-top:.2rem;
                    span{
                        color: #9e9e9e;
                        font-size: .2rem;
						padding-right: .3rem;
						
					}
					.start{
						padding-top:.2rem;	
						
					}
                }
            }
            .content-text{
                p{
                    padding: .3rem 0;
                    white-space: pre-wrap;
                    line-height: .34rem;
                }  
            }
            .flexImgBox{
	  			display: flex;
	  			display: -webkit-flex;
	  			flex-direction: row;
	  			margin: 0 auto;
	  			// margin: .1rem 0;
	  			flex-wrap: wrap;
	  			justify-content: flex-start;
	  			align-items: center;
	  			.bgImg{
					  width: 100%;
					  margin: .1rem 0;
	  				// width: 2.14rem;
                    // height: 2.14rem;
                    // margin-right: .1rem; 
	  				background-size: cover;
	  				background-repeat: no-repeat;
	  				background-position: center center;
	  			}
	  		}
            .goods{
                display: flex;
                display: -webkit-flex;
                flex-direction: row;
                align-items: center;
                background-color: #f3f3f3;
                height: 1.6rem;
                margin-top: .2rem;
                .commentImg{
                    display: block;
                    width: 1.4rem;
					height: 1.4rem;
					margin: .1rem;
	  				background-size: cover;
	  				background-repeat: no-repeat;
	  				background-position: center center;
                }
                .desc{
                    p{
                        font-size: .28rem;
                        letter-spacing: .02rem;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        color: #181818;  
                        padding: .2rem;
                    }
                }
            }
  		}
  		
  	}
}
</style>