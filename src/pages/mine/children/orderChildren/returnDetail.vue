<template>
	<div class="page">
	  	<div class="page-content">
	  		<svgs style="display: none;"></svgs>
	  		<svgs-two style="display: none;"></svgs-two>
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">退款详情</span>
			</von-header>
            <div class="wait" >
                <div class="img"><img src="" alt=""></div>
                <div class="info">
                    <p>请等待商家处理</p>
                    <p class="time">还剩4天23小时24分</p>
                </div>
            </div>
            <div class="text">
                <p>您已成功发起退款申请，请耐心等待商家处理</p>
                <label>  </label><span class="remo">商家同意或超时未处理，系统将退款给您</span>
                <div class="return"><span class="return-text" @click="showPopup">撤销申请</span></div>
            </div>
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
				
			}
		},
		methods:{
			back(){
				this.$router.go(-1)
            },
            showPopup() {
                let options = {
                    effect: 'scale',
                    buttons: [
                        {text: '取消'},
                        {text: '确定'},
                    ]
                }
                let text = '您仅能主动撤销一次，撤销后不能再主动撤销，且超出保障期后无法再次发起售后'
                let popup = $popup.fromTemplate('<p style="padding: 0.3rem;">'+text+'</p>', options)

                popup.show().then((buttonIndex) => {
                console.log(buttonIndex)
                })
            }
        }
	}
</script>

<style scoped lang="less">
.page-content {
      padding-top: 44px;
      color: #323232;
      .wait{
          width: 100%;
          height: 2rem;
          color: #fff;
          background-color: #f96b21;
          display: flex;
          display: -webkit-flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          .img{
              width: .6rem;
              height: .6rem;
              border: 1px solid #ddd;
              margin-right: .4rem;
          }
          .info{
              p{
                  font-size: .36rem;
              }
              .time{
                  font-size: .1rem;
                  padding-top: .1rem;
              }
          }
          
      }
      .text{
          padding: 0 .2rem;
          background-color: #fff;
          p{
              width: 100%;
              border-bottom: 1px solid #ddd;
              padding: .2rem;
          }
          i{
                display: inline-block;
                width: .17rem;
                height: .17rem;
                background-color: #d1d1d1;
                border-radius: 50%;
          }
          .remo{
              padding-left: .2rem;
              font-size: .1rem;
              color: #d1d1d1;
          }
          .return{
              height: 1rem;
              padding: .2rem 0;
              display: flex;
              display: -webkit-flex;
              justify-content: flex-end;
              span{ 
                width: 1.6rem;
                height: .5rem;
                text-align: center;
                line-height: .5rem;
                font-size: .1rem;
                border: 1px solid #d1d1d1;
              }
          }
      }
    .mt30{
        margin-top: .3rem;
    }
}
</style>
<style>
.popup-body p{
    font-size: 12px;
}
</style>
