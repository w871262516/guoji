<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">设置支付密码</span>
			</von-header>
			<section class="section">
				<label>
					验证码：
				</label>
				<input type="number" v-model="code" placeholder="请输入验证码"/>
		        <button class="checkCode" @click="countDown" v-show="timeOver==true">
		        	<i>获取验证码</i>
		        </button>
		        <span class="checkCode" v-show="timeOver==false">
		        	<i>{{time}}s</i>
		        </span>
  			</section>
  			<von-input 
			  type="password" 
			  v-model.trim="newpsd" 
			  placeholder="请输入新支付密码"
			  label="支付密码：">
			</von-input>
			<von-input 
			  type="password" 
			  v-model.trim="surepsd" 
			  placeholder="请确定支付密码" 
			  label="确定密码：">
			</von-input>
			<div class="btnBar">
				<md-button class="button button-positive button-block" @click.native="checkMyPayPsd">
					确定
				</md-button>
			</div>
  		</div>
  	</div>
</template>

<script>
	export default{
		name:'forgetPayPassword',
		data(){
			return{
				token:localStorage.getItem('token'),
				newpsd:'',
				surepsd:'',
				disabled:true,
				phone:'5200',
				time:60,
				timeOver:true,
				ti:null,
				code:''
			}
		},
		methods:{
			back(){
				this.$router.go(-1)
			},
			to(arg){
				this.$router.push(arg)
			},
			countDown(){//倒计时
				if(this.disable==false){return}		
				this.disable = false
				console.log(this.timeOver)
				if(this.timeOver == false){return} //倒计时没结束停止操作
				this.getUserInfo()
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
			getUserInfo(){//获取用户信息
				let that = this
				that.$axios({
					method:'get',
					url:that.GLOBAL.develop_url+'api/hompage/personshow',
					params:{
						token:that.token
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
					if(res.data.code == 200){
						that.phone = res.data.data.mobile
						that.getCode()
					}else if(res.data.code==404||res.data.code == 400){
						$toast.show(res.data.msg, 1000).then(() => {
							that.$router.push('/login')
						})
					}else{
						$toast.show(res.data.msg, 1000)
					}
				})
			},
			getCode(){
				let that = this
				that.$axios({
	    			method:'post',
	    			url:that.GLOBAL.develop_url+'api/send_sms_by_token',
	    			data:{
						token:that.token,
						send_type:1005
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
					$toast.show(res.data.msg, 1000)
	    			if(res.data.code == 200){

	    			}else{
	    				clearInterval(that.ti)
	    			}
	    		})
			},
			checkMyPayPsd(){
				if(this.newpsd != this.surepsd){
					$toast.show('两次密码不一致!')
				}else if(this.code.length<4){
					$toast.show('请输入正确验证码!')
				}else if(this.newpsd.length != 6){
					$toast.show('请输入正确密码!')
				}else{
					this.changeMyPayPsd()
				}
			},
			changeMyPayPsd(){
				let that = this
				that.$axios({
	    			method:'post',
	    			url:that.GLOBAL.develop_url+'api/hompage/set_pay_password',
	    			data:{
						token:that.token,
	    				password:that.newpsd,
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
	    			if(res.data.code == 200){
						$toast.show(res.data.msg, 1000).then(() => {
							that.$router.push('/mine/accountManager')
						})
					}else if(res.data.code==404){
						$toast.show(res.data.msg, 1000).then(() => {
							that.$router.push('/login')
						})
					}else{
						$toast.show(res.data.msg, 1000)
					}
	    		})
			}

		},
		created(){
			
		}
	}
</script>

<style lang="less" scoped>
.page-content {
  	padding-top: 44px;
  	.tips{
  		padding: .2rem .2rem 0 .2rem;
  		color: #9D9C9C;
  	}
  	.section{
		margin-top: .25rem;
		width: 100%;
		height: 1rem;
		position: relative;
		background-color: #fff;
		display: flex;
		display: -webkit-flex;
		flex-direction: row;
		justify-content: flex-start;
		label{
			width: 2.1rem;
			height: 1rem;
			line-height: 1rem;
			padding: 0 .3rem;
			font-size: .3rem;
			color: #444;
		}
		input{
			width: calc(100% - 1.6rem);
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
	.btnBar{
		width: 6rem;
		margin: .2rem auto;
	}
}
</style>