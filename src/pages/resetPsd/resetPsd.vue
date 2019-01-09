<template>
	<div class="page">
	  	<div class="page-content">
	  		<div class="wrap">
	  			<svgs style="display: none;"></svgs>
				<von-header style="background-color: rgba(0,0,0,0);background-size: 0 0 !important;">
			 		<button class="button button-icon ion-ios-arrow-back" slot="left" @click="back" style="color: #fff !important;"></button>
					<span slot="title" style="color: #fff !important;">{{title}}</span>
				</von-header>
	  			<div v-show="step1">
	  				<section class="section">
			      	  <input type="text" v-model.trim="phone" placeholder="请输入手机号"/>
	  				</section>
	  				<div class="nouse">
			  			<section class="guide_item mt90">
				        	<svg class="icon_style rorate"  @click="nextStep">
				                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#toRightFullWhite'" fill="#ffffff"></use>
				        	</svg>
				        </section>
		  			</div>
	  			</div>
	  			
	  			<div v-show="step1==false">
	  				<section class="section">
				        <input type="text" v-model.trim="code" placeholder="请输入验证码"/>
				        <span class="checkCode" @click="countDown" v-show="timeOver">
			        		<i>获取验证码</i>
				        </span>
				         <span class="checkCode" v-show="timeOver==false">
			        		<i>{{time}}</i>
				        </span>
		  			</section>
		  			<section class="section">
				        <input type="password" v-model.trim="psd" placeholder="请设置6-20位密码"/>
		  			</section>
		  			<!--<section class="section">
				        <input type="text" v-model.trim="surePsd" placeholder="请再次输入密码"/>
		  			</section>-->
		  			<div class="nouse">
			  			<section class="guide_item mt90" @click="resetPsd">
				        	<svg class="icon_style ">
				                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#rightWhiteFull'" fill="#ffffff"></use>
				        	</svg>
				        </section>
		  			</div>
	  			</div>
	  			
	  		</div>
  		</div>
  	</div>
</template>

<script>
	import svgs from '../mine/children/components/svgs.vue'
	export default{
		name:'resetPsd',
		components:{
			svgs
		},	
		data(){
			return{
				title:'验证手机号',
				phone:'',
				code:'',
				psd:'',
				surePsd:'',
				step1:true,
				time:10,
				timeOver:true,
				ti:null
			}
		},
		methods:{
			back(){
				this.$router.go(-1)
			},
			nextStep(){
				if(!this.phone || this.phone==''||this.phone==undefined||this.phone.length != 11){
					$toast.show('请输入正确手机号', 1000).then(() => {})
					return
				}
				let that = this
				that.$axios({
	    			method:'post',
	    			url:that.GLOBAL.develop_url+'api/check_phone',
	    			data:{
	    				phone:that.phone
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
	    			if(res.data.code == "400"){
						that.step1 = !that.step1
	    			}else{
	    				$toast.show('该手机号未注册！', 1000).then(() => {})
	    			}
	    		})
			},
			countDown(){//倒计时
				console.log(this.timeOver)
				if(!this.phone){
					$toast.show('请输入正确手机号', 1000).then(() => {})
					return
				}
				if(this.timeOver == false){return} //倒计时没结束停止操作
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
			getCode(){
				let that = this
				that.$axios({
	    			method:'post',
	    			url:that.GLOBAL.develop_url+'api/send_sms',
	    			data:{
	    				phone:that.phone,
	    				send_type:'1002'
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
	    				
	    			}else{
	    				clearInterval(that.ti)
	    			}
	    		})
			},
			resetPsd(){
				let that = this
				that.$axios({
	    			method:'post',
	    			url:that.GLOBAL.develop_url+'api/forget_password',
	    			data:{
	    				phone:that.phone,
	    				phone_code:that.code,
	    				new_password:that.psd
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
	    				$toast.show('修改成功！', 1000).then(() => {
	    					that.$router.go(-1)
	    				})
	    			}
	    			if(res.data.code == 400){
	    				if(res.data.msg == "您未修改新的密码"){
	    					$toast.show('新密码与旧密码不能一致！', 1000).then(() => {})
	    				}
	    				if(res.data.msg == "短信验证码不正确或已失效"){
	    					$toast.show('验证码已过期！', 1000).then(() => {})
	    				}
	    			}
	    		})
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
			.nouse{
				width: 100%;
				display: flex;
				display: -webkit-flex;
				align-items: center;
				justify-content: center;
				.guide_item{
					.icon_style{
						display: inline-block;
						margin: 0 auto;
						width: .75rem;
						height: .75rem;
					}
					.rorate{
						transform: rotate(90deg);
					}
				}
			}	
		}
		
	}
}
.mt90{
	margin-top: .9rem;
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
</style>