<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">添加银行卡</span>
			</von-header>
			<von-input type="text" v-model="user" placeholder="请输入持卡人" label="持卡人："></von-input>
			<von-input type="text" v-model="cardNum" placeholder="请输入银行卡号" label="银行卡号："></von-input>
			<von-input type="text" v-model="phone" placeholder="请输入预留手机号" label="预留手机："></von-input>
			<von-input type="text" v-model="idnum" placeholder="请输入身份证号" label="身份证："></von-input>
			<section class="section">
				<label>
					验证码：
				</label>
				<input type="text" v-model.trim="code" placeholder="请输入验证码"/>
		        <button class="checkCode" @click="countDown" v-show="timeOver==true">
		        	<i>获取验证码</i>
		        </button>
		        <span class="checkCode" v-show="timeOver==false">
		        	<i>{{time}}s</i>
		        </span>
  			</section>
			<div class="btnBar">
				<md-button class="button button-positive button-block" @click.native="check()">
					立即添加
				</md-button>
			</div>
		</div>
	</div>
</template>

<script>
	export default{
		name:'setStoreName',
		data(){
			return{
				token:localStorage.getItem('token'),
		  		user:'',
		  		cardNum:'',
		  		cardType:'',
				phone:'',
				idnum:'',
				disabled:true,
				code:'',
				time:60,
				timeOver:true,
				ti:null
			}
		},
		methods:{
			back(){
				this.$router.go(-1)
			},
			countDown(){//倒计时
				if(this.disable==false){return}		
				this.disable = false
				console.log(this.timeOver)
				if(this.timeOver == false){return} //倒计时没结束停止操作
				this.checkPhone()
				let that = this
				that.ti = setInterval(function(){
					if(that.time <= 60 ){
						that.timeOver = false
						that.time-- 
					}
					if(that.time <= 0 ){
						clearInterval(that.ti)
						that.timeOver = true
						that.time=60
						that.disable=true
					}
				},1000)
			},
			getCode(){
				let that = this
				that.$axios({
	    			method:'post',
	    			url:that.GLOBAL.develop_url+'api/send_sms',
	    			data:{
						token:that.token,
	    				phone:that.phone,
	    				send_type:'1004'//绑卡验证
	    			},
	    			transformRequest:[function(data){
	    				let ret = ''
	    				for(let it in data){
	    					ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
	    				}
	    				return ret
	    			}],
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
	    			if(res.data.code == 200){
	    				
	    			}else{
	    				clearInterval(that.ti)
	    			}
	    		})
			},
			checkPhone(){
				console.log("验证手机格式",this.isPoneAvailable(this.phone));
				
				if(!this.isPoneAvailable(this.phone)){
					$toast.show('请输入正确手机号', 1000)
					return
				}else{
					this.getCode();
				}
			},
			checkIdnum(){
				// 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X 
				var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; 
				if(reg.test(this.idnum) === false) { 
					$toast.show('身份证输入不合法', 1000);
					return false; 
				}else{
					return true;
				}
			},
			check(){
				console.log("验证身份证格式",this.checkIdnum());
				if(this.checkIdnum()){
					this.addNow()
				}
			},
			addNow(){
				let that = this
				that.$axios({
	    			method:'post',
	    			url:that.GLOBAL.develop_url+'api/hompage/add_bank_card',
	    			data:{
						token:that.token,
	    				username:that.user,
	    				bankcard:that.cardNum,
	    				reserve_phone:that.phone,
	    				idnum:that.idnum,
	    				phone_code:that.code
	    			},
	    			transformRequest:[function(data){
	    				let ret = ''
	    				for(let it in data){
	    					ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
	    				}
	    				return ret
	    			}],
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
	    			if(res.data.code == 200){
						that.$router.push('/mine/salerCenter/managerBankCards')
	    			}else if(res.data.code == 404){
						that.$router.push('/login')
	    			}
	    		})
			},
		}
	}
</script>

<style scoped lang="less">
.page-content {
  	padding-top: 44px;
	.btnBar{
		width: 6rem;
		margin: .5rem auto;
	}
	.section{
		width: 100%;
		height: .9rem;
		position: relative;
		background-color: #fff;
		display: flex;
		display: -webkit-flex;
		flex-direction: row;
		justify-content: flex-start;
		label{
			width: 2.1rem;
			height: .9rem;
			line-height: .9rem;
			padding: 0 .3rem;
			font-size: .3rem;
			color: #444;
		}
		input{
			width: calc(100% - 1.8rem);
			height: 100%;
			font-size: .3rem;
			background-color: rgba(0,0,0,0,0);
		}
		.checkCode{
			color: #E87439;
			border: 1px solid #E87439;
			display: inline-block;
			width: 2rem;
			height:.7rem;
			display: flex;
			display: -webkit-flex;
			align-items: center;
			justify-content: center;
			font-size: .25rem;
			text-align: center;
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			-webkit-transform: translateY(-50%);	
			right: .2rem;
			background-color: #fff;
			z-index: 999;
		}
	}
}
</style>