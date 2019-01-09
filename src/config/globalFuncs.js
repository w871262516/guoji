import Vue from 'vue'

import axios from 'axios'
Vue.prototype.$axios = axios

Vue.prototype.getQueryString = getQueryString
function getQueryString(name) { //取值
    var params = window.location.href.split("?")[1]
    if (params && params.match(name + "=")) {
        var str = params.split(name + '=')[1]
        try {
            var result = str.split("&")[0]
        } catch (e) {
            var result = str
        }
    } else {
        var result = null
    }
    return result
}

Vue.prototype.timeFormer = timeFormer
function timeFormer(t){
	let date = new Date(t * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = date.getFullYear() + '-'; 
    let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    let D = date.getDate() + ' ';
   // let h = date.getHours() + ':';
    let h
    if(date.getHours()>9){
    	h = date.getHours() + ':'
    }else{
    	h ='0'+date.getHours() + ':'
    }
    let m
    if(date.getMinutes()>9){
    	m = date.getMinutes() + ':'
    }else{
    	m ='0'+date.getMinutes() + ':'
    }
    let s
    if(date.getSeconds()>9){
    	s = date.getSeconds()
    }else{
    	s ='0'+date.getSeconds()
    }
    return Y+M+D+h+m+s;
}

Vue.prototype.utf16toEntities = function(str){//表情保存时转码
    let patt=/[\ud800-\udbff][\udc00-\udfff]/g    // 检测utf16字符正则
    str = str.replace(patt, (stuff)=>{
        let H, L, code;
        if (stuff.length===2) {
            H = stuff.charCodeAt(0);
            // 取出高位
            L = stuff.charCodeAt(1);
            // 取出低位
            code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00;
            // 转换算法
            return "&#" + code;
        } else {
            return stuff;
        }
    });
    return str;
}

Vue.prototype.toChina = function(str){
	let pa = /\\/g
	if(pa.test(str)){
		str = str.replace(/\\/g, "%");
	}
    return unescape(str);
}

Vue.prototype.toUnicode = function(str){
	let temp,r = ''
	for (let i = 0; i < str.length; i++) {
		temp = str.charCodeAt(i).toString(16);
		while ( temp.length < 4 ){
			temp = '0' + temp;
		}
		r += "\\u" + temp;
	}
	return r
}

Vue.prototype.checkPhone = function(){//判断设备类型
	if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) { //判断iPhone|iPad|iPod|iOS
		Vue.prototype.thisIsIphone = true		
	} else if (/(Android)/i.test(navigator.userAgent)) {  //判断Android
		Vue.prototype.thisIsIphone = false		
	}else{
		$toast.show('请用手机打开！', 2000)
	}
}

Vue.prototype.isPoneAvailable = function (pone) {//验证手机号码
	let myreg = /^[1][3,4,5,6,7,8][0-9]{9}$/;
	if (!myreg.test(pone)) {
	  return false;
	} else {
	  return true;
	}
}
Vue.prototype.isCode = function (code) {//验证码
	let myreg = /^[0-9]{4}$/;
	if (!myreg.test(code)) {
	  return false;
	} else {
	  return true;
	}
}
Vue.prototype.ismail = function (str) {
    var rg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
    return rg.test(str);
}
Vue.prototype.isWeixin = function () {
    let ua = window.navigator.userAgent.toLowerCase();
    console.log(ua);//mozilla/5.0 (iphone; cpu iphone os 9_1 like mac os x) applewebkit/601.1.46 (khtml, like gecko)version/9.0 mobile/13b143 safari/601.1
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
    } else {
        return false;
    }
}


//支付方法

// var data = {
//     token:localStorage.getItem('token'),
//     pay_id:this.pay_id || '1',	//支付方式（1-微信 2-支付宝 3-连连）
//     trade_type:'0',   //支付类型(H5值为0)   
//     order_id:'0',  //订单id、活动id(像充值类的值为0)
//     amount:this.finalMoney, //金额
//     order_type:this.order_type   //amount-充值余额, business_deposit-商家充值保证金, member_deposit-个人充值保证金,pay_order-支付订单
// }

//支付后跳转页路由
var afterPayPath = ''
Vue.prototype.payMoney = function (data, url, callback2) {
    if (Vue.prototype.isWeixin()&&data.pay_id == 2) {
        $toast.show('支付宝请在右上角用浏览器打开支付', 2000)
        return
    } else if (!Vue.prototype.isWeixin() && data.pay_id == 1) {
        $toast.show('微信支付请在微信打开！', 2000)
        return
    }
    afterPayPath = url
    let that = this
    console.log('我是支付参数',data)
    that.$axios({
        method:'post',
        url:that.GLOBAL.develop_url+'api/pay',
        params:data,
        xhrFields:{
            widthCredentials:true
        },
        crossDomain:true,
        header:{
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(function(res){
        console.log(res.data)
        if (res.data.code) {
            if(res.data.code==200){
                callpay(res.data);
            }else{
                $toast.show(res.data.msg,1000)
            }
        } else {
            if (callback2) {
                callback2(res.data);
            }
        }
    }).catch((error)=>{
        console.log(error);
    })

}
function callpay(result){
    if (typeof WeixinJSBridge == "undefined"){
    if( document.addEventListener ){
        document.addEventListener('WeixinJSBridgeReady', onBridgeReady(result), false);
    }else if (document.attachEvent){
        document.attachEvent('WeixinJSBridgeReady', onBridgeReady(result));
        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady(result));
    }
    }else{
        onBridgeReady(result);
    }
}
    
function onBridgeReady(result){
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
            if (res.err_msg == "get_brand_wcpay_request:ok") {
                window.location.href = "http://www.paipaiwang.com.cn/#" + afterPayPath;
                // window.location.href=url;
                // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回 ok，但并不保证它绝对可靠。
            } else if (res.err_msg == "get_brand_wcpay_request:cancel"||res.err_msg == "get_brand_wcpay_request:fail"){
                $toast.show('支付失败')
            }
        }
    );
}