<template>
	<div class="page">
	  	<div class="page-content">
	  		<div class="wrap">
	  			<svgs style="display: none;"></svgs>
				<von-header style="background-color: rgba(0,0,0,0);background-size: 0 0 !important;">
			 		<button class="button button-icon ion-ios-arrow-back" slot="left" @click="back" style="color: #fff !important;"></button>
					<span slot="title" style="color: #fff !important;">注册</span>
				</von-header>
	  			<svgs style="display: none;"></svgs>
	  			
	  			<section class="section">
			        <input type="text" v-model.trim="phone" @blur="checkPhone" placeholder="请输入手机号"/>
	  			</section>
	  			<section class="section">
			        <input type="text" v-model.trim="code" placeholder="请输入验证码"/>
			        <span class="checkCode" @click="countDown" v-show="timeOver==true">
			        	<i>获取验证码</i>
			        </span>
			        <span class="checkCode" v-show="timeOver==false">
			        	<i>{{time}}s</i>
			        </span>
	  			</section>
	  			<section class="section">
			        <input :type="psdType" v-model.trim="psd" placeholder="请设置6-20位密码"/>
			        <section class="guide_item" @click="showOrHidePsd">
				        	<svg class="icon_style">
				                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#eyesWhite'" fill="#ffffff"></use>
				        	</svg>
				    </section>
	  			</section>
	  			<div class="nouse">
		  			<section class="guide_item">
			        	<svg class="icon_style" @click="goRegister">
			                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#rightWhiteFull'" fill="#ffffff"></use>
			        	</svg>
			        </section>
	  			</div>
	  		</div>
  		</div>
  	</div>
</template>

<script>
	import svgs from '../mine/children/components/svgs.vue'
	export default{
		name:'register',
		components:{
			svgs
		},
		data(){
			return{
				psdType:'password',
				avilabelPhone:false,
				phone:'',
				code:'',
				psd:'',
				time:10,
				timeOver:true,
				ti:null
			}
		},
		methods:{
			back(){
				this.$router.go(-1)
			},
			checkPhone(){//验证手机号
				if(!this.isPoneAvailable(this.phone)){
					$toast.show('请输入正确手机号', 1000)
					this.avilabelPhone = false
					return
				}else{
					this.avilabelPhone = true
				}
			},
			countDown(){//倒计时
				if(this.avilabelPhone==false){
					$toast.show('请输入正确手机号', 1000)
					return
				}
				if(this.timeOver == false){return} //倒计时没结束 停止操作
				this.getCode()
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
					}
				},1000)
			},
			getCode(){//获取验证码
				if(this.avilabelPhone==false){
					$toast.show('请输入正确手机号', 1000)
					return
				}
				let that = this
				that.$axios({
	    			method:'post',
	    			url:that.GLOBAL.develop_url+'api/send_sms',
	    			data:{
	    				phone:that.phone,
	    				send_type:'1001'
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
	    			if(res.data.code == "400"){
						$toast.show('该手机号已注册', 1000)
						clearInterval(that.ti)
	    			}
	    			if(res.data.code == '200'){
	    				$toast.show('验证码已发送！', 1000)
	    			}
	    		})
			},
			goRegister(){//注册方法
				if(!this.phone || this.phone==''||this.phone==undefined||this.phone.length != 11 || this.avilabelPhone == false){
					$toast.show('请输入正确手机号', 1000)
					return
				}
				if(!this.psd){
					$toast.show('密码不能为空', 1000)
					return
				}
				if(!this.code || this.code == ''){
					$toast.show('验证码不能为空', 1000)
					return
				}
				let that = this	
				that.$axios({
	    			method:'post',
	    			url:that.GLOBAL.develop_url+'api/register',
	    			data:{
	    				phone:that.phone,
	    				phone_code:that.code,
	    				password:that.psd
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
	    			if(res.data.code==200){
	    				$toast.show('注册成功',1000).then(() => {
	    					that.$router.go(-1)
	    				})
	    			}
	    			if(res.data.code == '400'){
	    				$toast.show('验证码错误',1000)
	    			}
	    		})
			},
			showOrHidePsd(){//切换显示密码
				if(this.psdType == "password") {
					this.psdType = "text";
				}else{
					this.psdType = "password"
				}
			}
		}
	}
</script>

<style scoped lang="less">
.page{
	.page-content{
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		height: 100%;
		width: 100%;
		background: url(/static/common/registerBg.png) no-repeat top left;
		background-size: cover;
		.wrap{
			padding-top: 44px;
			display: flex;
			display: -webkit-flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			.section{
				margin-top: .25rem;
				width: 6rem;
				height: 1rem;
				position: relative;
				input{
					color: #fff !important;
					width: 100%;
					height: 100%;
					font-size: .3rem;
					background-color: rgba(0,0,0,0,0);
					border-top: 0px none;
					border-right: 0px none;
					border-left: 0px none;
					border-bottom: 1px solid #7c7b7b;
					border-radius: 0;
				}
			}
		}
		.nouse{
			width: 100%;
			display: flex;
			display: -webkit-flex;
			align-items: center;
			justify-content: center;
			.guide_item{
				width: 100%;
				.icon_style{
					display: inline-block;
					margin: 0 auto;
					width: .75rem;
					height: .75rem;
					
				}
			}
		}
	}
}
.checkCode{
	color: #fff !important;
	display: inline-block;
	width: 1.8rem;
	height:.6rem;
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
	right: 0;
	background-color: #888888;
	z-index: 999;
	border-radius: 50px;
}
.guide_item{
	display: flex;
	display: -webkit-flex;
	align-items: center;
	position: absolute;
	right: .1rem;
	top: 50%;
	transform: translateY(-50%);
	-webkit-transform: translateY(-50%);
	.icon_style{
		display: inline-block;
		width: .55rem;
		height: .4rem;
		
	}
}
</style>
