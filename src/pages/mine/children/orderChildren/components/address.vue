<template>
<div>
    <router-link class="address" :to="{path:'/mine/addressManager/chooseAddress',query:{gid:gid,total_left:total_left}}" >
        <div class="address-detail">
            <img class="location" src="../../../../../../static/pay/location.png"/>
            <div>
                <span>收货人：{{myAddress.name}}</span>
                <span>{{myAddress.mobile}}</span>
                <p>
                    {{myAddress.area}}{{myAddress.address}}
                </p>
            </div>
        </div>
        <img class="to" src="../../../../../../static/pay/to.png"/>
    </router-link>
    <div class="sp">
        <img class="split" src="../../../../../../static/pay/bar.png"/>
    </div>

</div>
</template>

<script>
import svgs from "../../components/svgs.vue";
import rechargeList from '../../components/rechargeList.vue'
import bottom from '../../../../../components/footer/bottom.vue'
export default {
  name: "receivingAddress",
  components: {
    svgs,rechargeList,bottom
  },
  props:['myAddress','gid','total_left']
};
</script>

<style scoped lang="less">
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
</style>