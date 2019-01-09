<template>
	<div class="page">
	  	<div class="page-content">
            <!-- <von-header theme="light">
                
                <span slot="title">查看物流</span>
			</von-header> -->
            <div class="order-status">
                <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
                <div :style="{backgroundImage:'url('+orderInfo.thumb+')'}" class="goodImg"></div>
                <span>{{status}}</span>
            </div>
            <!-- 收货地址 -->
             <div class="status-box">
                <div class="status">
                    <div class="time">
                    </div>
                    <section class="alicenter-recev">
                        <svgs id="#receiveAddress" class="icon_style" iconWidth=".52rem" iconHeight=".52rem" fill="#E87439"></svgs>
                    </section>
                    <div class="text-box">
                        <div class="text">
                            <p>[收货地址]{{orderInfo.area}}{{orderInfo.address}}</p>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 物流信息 -->
             <div class="status-box " v-for="item in logisticsInfo">
                <div class="status">
                    <div class="time">
                        <p>{{item.day}}</p>
                        <p>{{item.hour}}</p>
                    </div>
                    <section class="alicenter">
                        <svgs  class="icon_style" iconWidth=".5rem" iconHeight=".5rem"></svgs>
                    </section>
                    <div class="text-box sendBox">
                        <div class="text">
                            <p>{{item.remark}}</p>
                        </div>
                        
                    </div>
                </div>
            </div>
	  	</div>
	</div>
</template>

<script>
	import svgs from '../components/svgs.vue'
	export default{
		name:'checkLogistics',
		components:{
			svgs
		},
		data(){
			return{
                token:localStorage.getItem('token'),
                order_sn:this.$route.params.orderId,
                orderInfo:{},
                logisticsInfo:[],
                status:'运输中',
			}
		},
		created(){
			this.getOrderInfo();
		},
		methods:{
			back(){
				this.$router.go(-1)
            },
            getOrderInfo(){//获取订单详情
				let that = this
				that.$axios({
					method:'post',
					url:that.GLOBAL.develop_url+'api/order_info',
					data:{
						token:localStorage.getItem('token'),
						order_sn:that.order_sn,					
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
					if(res.data.code==200){
                            that.orderInfo = res.data.data.order_info
                            that.getGoodsInfo();
					}else if(res.data.data == 404){
						$toast.show(res.data.msg, 1000).then(() => {
							that.$router.push('/login')
						})
					}else{
                        $toast.show(res.data.msg, 1000)
                    }
				})
			},
            getGoodsInfo(){
                let that = this
				that.$axios({
					method:'post',
					url:that.GLOBAL.develop_url+'api/goods_express_info',
					data:{
						token:that.token,
						express_num:that.orderInfo.express_num,
						express_name:that.orderInfo.express_pinyin
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
                        if(res.data.data.resultcode == '201'){

                            $toast.show(res.data.data.reason, 1000)
                        }else{
                            var list = res.data.data.result.list
                            console.log(list);
                            var i = list.length-1;
                            var year = new Date().getFullYear()+'-';
                            list.forEach((item) => {
                                
                                item.day = item.datetime.split(' ')[0].split(year)[1];
                                item.hour = item.datetime.split(' ')[1];
                                that.logisticsInfo.push(list[i]);
                                i--;
                            });
                            
                        }
                        
					}else{
						$toast.show(res.data.msg, 1000)
					}
				})
            }

		}
	}
</script>

<style scoped lang="less">
.page-content {
      padding-bottom: .14rem;
      .unget{
        padding: .2rem;
        text-align: center;
        font-size: .26rem;
        color: #868686;

      }
      .order-status{
        width: 96%;
        // height: 1rem;
        margin: 2%;
        background-color: #fff;
        border-radius: .3rem;
		display: flex;
		display: -webkit-flex;
        align-items:center;
        .ion-ios-arrow-back{
            width: 0.8rem;
            height: .2rem !important;
            left: .2rem;
            transform: scale(0.56);
        }
        .goodImg{
            display: block;
			width: .7rem;
			height: .7rem;
			background-position: center center;
			background-size: cover;
			background-repeat: no-repeat;
            margin: .1rem .2rem;
        }
        span{
            font-size: .3rem;
        }
      }
      .status-box{
        width: 96%;
        margin: 0 2%;
        background-color: #fff;
        color: #868686;
        .status{
            width: 100%;
            // height: 1.6rem;
            display: flex;
            display: -webkit-flex;
            flex-direction: row;
            align-items:center;
            justify-content: space-between;
            .time{
                // width: 1rem;
                margin-left: .3rem;
                p{  
                    font-size: .1rem;
                    text-align: end;
                    &:first-child{
                        font-size: .24rem;
                    }
                }
            }
            .alicenter-recev{
                position: absolute;
                left: 1.28rem;
                z-index: 1;
            }
            .alicenter{
                position: absolute;
                left: 1.28rem;
                &:before{
                    content: '';
                    display: inline-block;
                    width: 1px;
                    height: 1.5rem;
                    border-left:1px solid #cfcece;
                    margin-left: -7px;
                    margin-right: 10px;
                    position: absolute;
                    left: .36rem;
                    bottom: .39rem;
                }
                
            }
            .first-box{
                position: absolute;
                left: 1.28rem;
                &:before{
                    content: '';
                    display: inline-block;
                    width: 1px;
                    height: .56rem;
                    border-left:1px solid #cfcece;
                    margin-left: -7px;
                    margin-right: 10px;
                    position: absolute;
                    left: .38rem;
                    top: -0.5rem;
                }
            }
            .text-box{
                width: 5.6rem; 
                height: 1.6rem;
                // border-left:1px solid #cfcece;
                padding: 0 .2rem;
                position: relative;
                .text{
                    display: flex;
                    display: -webkit-flex;
                    flex-direction: column;
                    justify-content: center;
                    height: 1.6rem;
                   p{
                        font-size: .26rem;
                        line-height: .3rem;
                    } 
                }
                
            }
            .sending-time{
                width: 1rem;
                p{  
                    font-size: .1rem;
                    text-align: end;
                    &:first-child{
                        font-size: .26rem;
                        line-height: .3rem;
                    }
                }
            }
            .sendBox{
                width: 5.6rem; 
                height: 1.6rem;
                // border-left:1px solid #cfcece;
                padding: 0 .2rem;
                position: relative;
                &:before{
                    content: '';
                    border: 3px solid #cfcece;
                    background-color: #cfcece;
                    display: inline-block;
                    width: 6px;
                    height: 6px;
                    border-radius: 10px;
                    margin-left: -7px;
                    margin-right: 10px;
                    position: absolute;
                    left: -0.147rem;
                    top: .7rem;
                }
                .text{
                    display: flex;
                    display: -webkit-flex;
                    flex-direction: row;
                    align-items:center;
                    justify-content: space-between;
                    height: 1.6rem;
                   p{
                        font-size: .24rem;
                    } 
                }
                
            }
            
        }
      }
  	.mt30{
  		margin-top: .3rem;
  	}
}
</style>

