<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">确认订单</span>
			</von-header>
            <receiving-address :myAddress="myAddress" :gid="gid" :total_left="total_left"></receiving-address>
            <router-link class="myItem" :to="'/mine/integrationExchange/integrationMall/mallGoodInfo'">
                <div :style="{backgroundImage:'url('+ goods.goods_img +')'}" class="img"></div>
                <div class="infoBox">
                    <p>{{goods.goods_name}}</p>
                    <p>数量： 1</p>
                    <p>积分：<span class="default">-{{goods.integral}}</span></p>
                </div>
            </router-link>
            <div class="info">
                <div class="inte-info">
                    <span class="name">配送方式</span>
                    <span class="money">免费</span>
                </div>
                <div class="inte-info">
                    <span class="name">积分扣除</span>
                    <span class="money">-{{goods.integral}}积分</span>
                </div>
            </div>
            <div class="info">
                <div class="info-title">订单信息</div>
                <div class="money-info">
                    <span class="name">库存</span>
                    <span class="money">{{goods.inventory}}件</span>
                </div>
                <div class="money-info">
                    <span class="name">市场价格</span>
                    <span class="money">￥{{goods.price}}</span>
                </div>
                <div class="money-info">
                    <span class="name">当前积分</span>
                    <span class="money">{{total_left}}分</span>
                </div>
                <div class="money-info">
                    <span class="name">所需积分</span>
                    <span class="money">{{goods.integral}}分</span>
                </div>
                <div class="money-info">
                    <span class="name">剩余积分</span>
                    <span class="money">{{total_left-goods.integral}}分</span>
                </div>
            </div>
            <div class="contentBottom">
                <div class="pay-btn" @click="exchangeNow">
                    确认兑换
                </div>
            </div>
        </div>
  	</div>
</template>

<script>
import svgs from "../components/svgs.vue";
import rechargeList from '../components/rechargeList.vue'
import bottom from '../../../../components/footer/bottom.vue'
import receivingAddress from '../orderChildren/components/address.vue'
export default {
  name: "integrationPay",
  components: {
    svgs,rechargeList,bottom,receivingAddress
  },
  data() {
    return {
        myAddress:{},
        goods:{},
        gid:'',
        pay_id:'1',
        total_left:this.$route.query.total_left,
    };
  },
  created(){
      //兑换页用（商品id）
      if(this.$route.query.gid){
        console.log("2222222222222",this.$route.query.gid);
        this.gid = this.$route.query.gid
        localStorage.setItem('gid',this.$route.query.gid)
      }else{
          this.gid = localStorage.getItem('gid')
      }
      if(this.$route.query.addressData && this.$route.query.addressData!={}){
          this.myAddress = this.$route.query.addressData;
      }else{
            this.getMyAllAddress();
      }
      this.getGoodsDetail();
  },
  methods: {
    back() {
      this.$router.go(-1);
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
    getGoodsDetail(){
        let that = this
        that.$axios({
            method:'post',
            url:that.GLOBAL.develop_url+'api/integral_goods_info',
            data:{
                goods_id:that.gid
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
                
                    that.goods = res.data.data
                    that.goods.goods_img = eval(that.goods.goods_img)[0].img
                    console.log(that.goods);
                    break;
                case "404":
                    $toast.show('登录信息已过期，请重新登录！', 1000).then(() => {
                        that.$router.push('/login')
                    })
                    break;
                default:
                    break;
            }
        })
    },
    exchangeNow(){
         let that = this
        that.$axios({
            method:'post',
            url:that.GLOBAL.develop_url+'api/integral_exchange_goods',
            data:{
                token:localStorage.getItem('token'),
                goods_id:localStorage.getItem('gid'),
                receiver_name:that.myAddress.name,
                receiver_address:that.myAddress.area+that.myAddress.address,
                receiver_phone:that.myAddress.mobile
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
            $toast.show(res.data.msg)
            switch (res.data.code){
                case "200":
                    console.log(that.goods);
                    break;
                case "400":
                    // $toast.show('获取信息失败，请重新登录！', 1000).then(() => {
                    //     that.$router.push('/login')
                    // })
                    break;
                default:
                    break;
            }
        })
    }
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
                &:last-child{
                    color: @color;
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
        .info-title{
            margin:.1rem .3rem;
            font-size: .28rem;
            border-left: 2px solid @color;
            padding-left: .16rem;
        }
        .money-info{
            display: flex;
            display: -webkit-flex;
            flex-direction: row;
            justify-content: space-between;  
            padding:.1rem .3rem;
            color: #adadad;
            .name{
                font-size: .22rem;
            } 
            .money{
                font-size: .23rem;
            }
            &:nth-child(3){
                .money{
                    font-size: .24rem;
                }
            }   
        }  
        .inte-info{
            width: 94%;
            margin: 0 3%;
            display: flex;
            display: -webkit-flex;
            flex-direction: row;
            justify-content: space-between;  
            padding:.2rem .08rem;
            border-top: 1px solid #e9e8e8;
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
			div{
                width: 60%;
                text-align: center;
                height: .8rem;
                line-height: .8rem;
                margin: 10% 20%;
            }
			.pay-btn{
				background-color: #E87439;
                color: #fff;
                border-radius: .1rem;
			}
		}
}
</style>