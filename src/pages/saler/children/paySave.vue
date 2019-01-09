<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">支付安全</span>
			</von-header>
			<list class="list-ios item-icon-right mt2">
				<item @click.native="to('/mine/salerCenter/resetPayPassword')">
			  		<span>重置支付密码</span>
       				<i class="icon ion-ios-arrow-right"></i>
				</item>
				<item @click.native="to('/mine/salerCenter/forgetPayPassword')">
			  		<span>忘记支付密码</span>
       				<i class="icon ion-ios-arrow-right"></i>
				</item>
			</list> 
			<!-- <list class="list-ios item-icon-right mt2">
				<item @click.native="to('/mine/salerCenter/showIdentity')">
			  		<span>查看身份信息</span>
       				<i class="icon ion-ios-arrow-right"></i>
				</item>
			</list> 
			<list class="list-ios item-icon-right mt2">
				<item @click.native="buyByMe">
			  		<span>微信支付</span>
       				<i class="icon ion-ios-arrow-right"></i>
				</item>
			</list>  -->
  		</div>
  	</div>
</template>

<script>
	export default{
		name:'paySave',
		data(){
			return{
				
			}
		},
		methods:{
			back(){
				this.$router.go(-1)
			},
			to(arg){
				this.$router.push(arg)
			},
			buyByMe(){
	            // window.location.href = window.location.href.replace('#','?a=a#')
	            //  alert( window.location.href)
	          	let that = this
					that.$axios({
						method:'post',
						url:that.GLOBAL.develop_url+'api/pay/',
						data:{
							token:localStorage.getItem('token')
						},
						crossDomain:true,
						header:{
							'Content-Type': 'application/x-www-form-urlencoded'
						}
					}).then(function(response){
						that.callpay(response.data);
					}).catch(function (error) {
	        			console.log(error);
	    		});
	          },
         	callpay(result){
                if (typeof WeixinJSBridge == "undefined"){
                if( document.addEventListener ){
                    document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady(result), false);
                }else if (document.attachEvent){
                    document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady(result));
                    document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady(result));
                }
             }else{
                this.onBridgeReady(result);
             }
            },
            onBridgeReady(result){
          	  alert(result.appId);
                window.WeixinJSBridge.invoke(
                'getBrandWCPayRequest',{
                    "appId":result.appId, //公众号名称，由商户传入
                    "timeStamp":result.timeStamp, //时间戳，自1970年以来的秒数
                    "nonceStr":result.nonceStr, //随机串
                    "package":result.package,
                    "signType":"MD5", //微信签名方式：
                    "paySign":result.paySign //微信签名
                } ,
                function(res){
                  //alert(res.err_msg)
                  //alert(JSON.stringify(res));
                    if(res.err_msg == "get_brand_wcpay_request:ok" ) {
						window.location.href="http://www.paipaiwang.com.cn:8001";
                    } // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回 ok，但并不保证它绝对可靠。
               	 }
            	);
            },
		},
		created(){
			
		}
	}
</script>

<style lang="less" scoped>
.page-content {
  	padding-top: 44px;
  	
  	.list-ios{
  		padding-right: 0 !important;
  	}
.ion-ios-arrow-right{
	color: #1c1c1c;position: absolute;right: .16rem;top: 50%;transform: translateY(-50%);-webkit-transform: translateY(-50%);height: auto;
}
.icon{
	font-size: .35rem !important;
}
.default{
	color: #E87439;
}
}
</style>