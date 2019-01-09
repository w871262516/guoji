<template>
	<div class="page">
	  	<div class="page-content">
	  		<svgs style="display: none;"></svgs>
	  		<svgs-two style="display: none;"></svgs-two>
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">请选择服务类型</span>
			</von-header>
             <div class="myItem">
                <div :style="{backgroundImage:'url('+orderInfo.thumb+')'}" class="img"></div>
                <div class="infoBox">
                    <p>{{orderInfo.title}}</p>
                    <!-- <p>颜色分类：经典小黑瓶</p> -->
                </div>
            </div>
	  		<list class="list-ios item-icon-right mt20">
				<router-link :to="{path:'/mine/myOrders/applyReturn',query:{return:0,order_sn:order_sn}}" class="section " replace>
					<item class="item1">仅退款
                        <p>未收到货（包含未签收），或卖家协商同意前提下</p>
       					<i class="icon ion-ios-arrow-right"></i>
					</item>
   				</router-link>
				<router-link :to="{path:'/mine/myOrders/applyReturn',query:{return:1,order_sn:order_sn}}" class="section" replace>
					<item>
						退货退款
                        <p>已收到货，需要退换已收到的货物</p>
       					<i class="icon ion-ios-arrow-right"></i>
					</item>
   				</router-link>
			</list>
	  	</div>
	</div>
</template>

<script>
	import svgsTwo from '../components/svgs.vue'
	import svgs from '../../../goodInfor/components/svgs.vue'
	export default{
		name:'orderStatus',
		components:{
	  		svgs,
	  		svgsTwo
		},
		data(){
			return{
                token:localStorage.getItem('token'),
                order_sn:this.$route.query.order_sn,
				orderInfo:{}
			}
        },
        created(){
            console.log(this.$route)
			this.getThisOrderInfo()
		},
		methods:{
			back(){
				this.$router.go(-1)
            },
            getThisOrderInfo(){//获取订单详情
				let that = this
				that.$axios({
					method:'get',
					url:that.GLOBAL.develop_url+'api/hompage/orderdetail',
					params:{
						token:that.token,
						order_sn:that.order_sn
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
						case 200:   
							that.orderInfo = res.data.data.order_info
							break;
						default:
							break;
					}
					if(res.data.code==404){
						$toast.show(res.data.msg, 1000).then(() => {
							that.$router.push('/login')
						})
					}
				})
			},
        }
	}
</script>

<style scoped lang="less">
.page{
    .page-content{
        padding-top: 44px;
        padding-bottom: 1rem;
        color: #323232;
        font-size: .26rem;
        .myItem{
            display: flex;
            display: -webkit-flex;
            justify-content: flex-start;
            align-items: center;
            position:relative;
            background: #fff;
            .img{   
                display: block;
                width: 1.8rem;
                height: 1.8rem;
                margin: .25rem;
                background-size: cover;
                background-repeat: no-repeat;
                background-position: center center;
            }
            .infoBox{
                width: calc(100% - 2.5rem);
                height: 1.8rem;
                font-size: .23rem;
                display: flex;
                display: -webkit-flex;
                justify-content: space-around;
                flex-direction: column;
                p{
                    height:.28rem;
                    line-height: .28rem;
                    &:nth-child(2){
                        color: #a0a0a0;
                      font-size: .2rem;  
                    }
                    
                }
            }
        }
        .list-ios{
            font-size: .24rem;
            padding-left: 0 !important;
            padding-right: 0 !important;
            .section{
                .item1{
                    position: relative;
                    &:after{
                        content: '';
                        display: block;
                        width: calc(100% - 16px);
                        height: 1px;
                        background-color: #e5e5e5;
                        position: absolute;
                        bottom: 1px;
                        right: 0;
                        z-index: 1000;
                    }	
                }
                .item{
                    p{
                        font-size: .2rem;
                        padding: .1rem 0;
                        color: #a0a0a0;
                    }
                }
                        
            }
        }
        .mt20{
            margin-top: .2rem;
        }
            .ion-ios-arrow-right{
            color: #1c1c1c;position: absolute;right: .16rem;top: 50%;transform: translateY(-50%);-webkit-transform: translateY(-50%);height: auto;
        }
        .ion-ios-arrow-left{
            color: #1c1c1c;position: absolute;right: .16rem;top: .18rem;height: auto;
        }
        .icon{
            font-size: .35rem !important;
        }
    }
}
</style>