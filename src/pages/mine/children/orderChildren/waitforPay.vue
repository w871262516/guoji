<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">确认订单</span>
			</von-header>
            <receiving-address :myAddress="myAddress"></receiving-address>
            <div class="myItem">
                <div :style="{backgroundImage:'url('+ goods.thumb +')'}" class="img"></div>
                <div class="infoBox">
                    <p>{{goods.title}}</p>
                    <p>成交价：<span class="icon">￥</span><span class="default">{{goods.amount}}</span></p>
                </div>
            </div>
            <div class="info">
                <div class="money-info">
                    <span class="name">商品金额</span>
                    <span class="money">￥{{goods.market_price}}</span>
                </div>
                <div class="money-info">
                    <span class="name">平台服务费</span>
                    <span class="money">￥{{goods.service_charge}}</span>
                </div>
                <div class="money-info">
                    <span class="name">应付款</span>
                    <span class="money">￥{{goods.amount}}</span>
                </div>
            </div>
            <recharge-list  @payType="choosePayType"></recharge-list>
            <div class="contentBottom">
                <div class="realPay-info">
                    应付款：<span class="realPay"><span class="icon">￥</span>{{goods.amount}}</span> 
                </div>
                <div class="pay-btn" @click="payNow">
                    立即付款
                </div>
            </div>
			<div id='applyForm' style="display:none"></div>
        </div>
        
  	</div>
</template>

<script>
import svgs from "../components/svgs.vue";
import rechargeList from '../components/rechargeList.vue'
import bottom from '../../../../components/footer/bottom.vue'
import receivingAddress from './components/address.vue'
export default {
  name: "waitforPay",
  components: {
    svgs,rechargeList,bottom,receivingAddress
  },
  data() {
    return {
        myAddress:{},
        goods:{},
        order_sn:'',
        gid:'',
        pay_id:'1'
    };
  },
  created(){
      //支付用（订单号）
      if(this.$route.params.order_sn){

        localStorage.setItem('order_sn',this.$route.params.order_sn)
        this.order_sn = this.$route.params.order_sn;

      }else if(this.getQueryString('order_sn')){

        localStorage.setItem('order_sn',this.getQueryString('order_sn'))
        this.order_sn = this.getQueryString('order_sn')
        
      } else{
          this.order_sn = localStorage.getItem('order_sn')
      }
      this.getThisOrderInfo();

      if(this.$route.query.addressData && this.$route.query.addressData!={}){
          this.myAddress = this.$route.query.addressData;
      }else{
            this.getMyAllAddress();
      }
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    choosePayType(data){
        this.pay_id = data
        console.log('>>>>>>>>>',data);
        
    },
    getMyAllAddress(){
        let that = this
        that.$axios({
            method:'get',
            url:that.GLOBAL.develop_url+'api/hompage/addressshow',
            params:{
                token:localStorage.getItem('token')
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
                    var myAddressList = res.data.data
                    for(let item of myAddressList){
                        if(item.is_default){
                            that.myAddress = item;
                            break;
                        }
                    }
                    break;
                case "400":
                    $toast.show('获取信息失败，请重新登录！', 1000).then(() => {
                        that.$router.push('/login')
                    })
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
    getThisOrderInfo(){//获取订单详情
        let that = this
        that.$axios({
            method:'get',
            url:that.GLOBAL.develop_url+'api/hompage/orderdetail',
            params:{
                token:localStorage.getItem('token'),
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
                    that.goods = res.data.data.order_info
                    // that.myAddress = res.data.data.receiving_address
                    // that.goods.c_time =  that.timeFormer(that.orderInfo.c_time)
                    //that.orderInfo.pay_time = that.timeFormer(that.orderInfo.pay_time)
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
    payNow(){
        if(this.myAddress == {}){
            $toast.show("请填写收货地址",1000)
        }else{
            var data = {
                token:localStorage.getItem('token'),
                pay_id:this.pay_id,	//支付方式（1-微信 2-支付宝 3-连连）
                trade_type:'0',   //支付类型(H5值为0)   
                order_id:this.order_sn,  //订单id、活动id(像充值类的值为0)
                amount:'0.1',
                order_type:'pay_order'  
            }
            console.log("****************",data);
            this.payMoney(data,'/mine/myOrders/orderStatus',this.payCall)
        }
    },
    
    payCall(res){
        alert(res)
        document.getElementById('applyForm').innerHTML = res;
        this.$nextTick(()=>{
            document.forms[0].submit()
        })
        console.log(">>>>>>>>>>>>>>>",res);
        
    },
  }
};
</script>

<style scoped lang="less">
@color: #E87439;
.page-content {
  	padding-top: 44px;
  	padding-bottom: 1rem;
	color: #323232;
    font-size: .26rem;
    .address{
        display: flex;
        display: -webkit-flex;
        flex-direction: row;
        justify-content: space-between;    
        padding: .3rem .1rem .1rem;
        background: #fff;
        .address-detail{
            display: flex;
            flex-direction: row;
            .location{
                width: .33rem;
                height: .41rem;
                margin: .2rem .3rem;
            }
            div{
                span{
                    font-weight: bold;
                }
                p{
                    padding: .2rem 0;
                }
            }
        }
        .to{
            width: .18rem;
            height: .36rem;  
            margin: .3rem .2rem;
        }
    }
    .sp{
        height: .1rem;
        .split{
            width: 100%;
            height: .12rem;
            margin-bottom: 0.16rem;

        }
        
    }
    .myItem{
        display: flex;
        display: -webkit-flex;
        justify-content: flex-start;
        align-items: center;
        position:relative;
        background: #fff;
        border-bottom: 1px solid #ddd;
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
                    color: @color;
                    .icon{
                        font-size: .1rem;
                    }
                    .default{
                        font-size: .28rem;
                    }

                }
            }
        }
    }
    .info{
        background: #fff;  
        padding:.1rem 0;    
        margin-bottom: .2rem;
        .money-info{
            display: flex;
            display: -webkit-flex;
            flex-direction: row;
            justify-content: space-between;  
            padding:.1rem .3rem;
            .name{
                color: #adadad;
                font-size: .22rem;
            } 
            .money{
                font-size: .23rem;
            }
            &:nth-child(3){
                .money{
                    color: @color;
                    font-size: .24rem;
                }
            }   
        }  
    }
    .contentBottom{
			width: 100%;
			position: absolute;
			right: 0;
			bottom: 0;
			display: flex;
			display: -webkit-flex;
			justify-content: space-between;
			border-top: 1px solid #eeeeee;
			div{
				width: 40%;
				text-align: center;
				height: .85rem;
				line-height: .85rem;
            }
            .realPay-info{
                .realPay{
                    color: #E87439;
                    font-size: .3rem;
                    .icon{
                        font-size: .1rem;
                    }
                }
            }
			.pay-btn{
				background-color: #E87439;
                color: #fff;
			}
		}
}
</style>