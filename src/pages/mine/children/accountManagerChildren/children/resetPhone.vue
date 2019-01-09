<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">设置手机号</span>
			</von-header>
			<list>
				<item>
					<p class="phone">手机号&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{phone}}</p>
	  				<!-- <von-input type="tel" :value="phone" disabled="true" label="手机号"> </von-input> -->
				</item>
				<div class="checkInput">
					<von-input type="text" v-model="code" placeholder="请输入验证码" label="验证码"></von-input>
					<span class="checkCode"  v-show="timeOver" @click="getCode">获取验证码</span>
					<span class="checkCode"  v-show="!timeOver">{{time}} s</span>
				</div>
			</list>
			<span></span>
	  		
			<div class="btnBar">
				<md-button class="button button-positive button-block" @click.native="checkCode()">
					确&nbsp;&nbsp;定
				</md-button>
			</div>
	  	</div>
	</div>	
</template>

<script>
	export default{
		name:'setPhone',
		data(){
			return{
				avilabelPhone:false,
		  		phone:this.$store.state.userInfo.editInfo.mobile,
				code:'',
				time:60,
				timeOver:true,
				ti:'',

			}
		},
		methods:{
			back(){
				this.$router.go(-1)
			},
			countDown(){//倒计时
				console.log(this.timeOver)
				if(!this.timeOver){return} //倒计时没结束停止操作
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
			checkCode(){//验证验证码
				console.log(this.isCode(this.code));
				
				if(!this.isCode(this.code)){
					$toast.show('请输入正确验证码', 1000)
					return
				}else{
					this.clicked();
				}
			},
			getCode(){//获取验证码
				this.countDown()
				let that = this
				that.$axios({
					method:'post',
					url:that.GLOBAL.develop_url+'api/send_sms_by_token',
					data:{
						token:localStorage.getItem('token'),
						send_type:'1006'
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
						'Content-Type': 'application/x-www-form-urlencoded',
					}
				}).then(function(res){
					console.log(res.data)
					if(res.data.code==200){
						$toast.show(res.data.msg,1000)
					}else if(res.data.code==404){
						clearInterval(that.ti)
						$toast.show(res.data.msg, 1000).then(() => {
							that.$router.push('/login')
						})
					}else{
						clearInterval(that.ti)
						$toast.show(res.data.msg,1000)
					}
				}).catch(function(err){
					console.log(err)
					alert(err)
					$toast.show('网络错误', 1000)
				})
			},
			clicked(){
				let that = this
				that.$axios({
					method:'post',
					url:that.GLOBAL.develop_url+'api/check_sms_by_token',
					data:{
						token:localStorage.getItem('token'),
						send_type:1006,
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
						'Content-Type': 'application/x-www-form-urlencoded',
					}
				}).then(function(res){
					console.log(res.data)
					if(res.data.code == 200){
						that.$router.push('/mine/accountManager/editInfo/setPhone')
					}else if(res.data.code==404){
						$toast.show(res.data.msg, 1000)
						that.$router.push('/login')
					}else{
						$toast.show(res.data.msg, 1000)
					}
				})
			}
		}
	}
</script>

<style scoped lang="less">
.page-content {
  	padding-top: 44px;
  	padding-bottom: 1rem;
	color: #323232;
	font-size: .23rem;
	.phone{
		color: #484746;
		padding-left: .02rem;
	}
	.von-input-wrapper{
		border: none;
	}
  	.checkInput{
  		position: relative;
  		.checkCode{
  			color: #fff !important;
  			display: inline-block;
  			width: 2rem;
  			height: 100%;
  			display: flex;
  			display: -webkit-flex;
  			align-items: center;
  			justify-content: center;
  			font-size: .25rem;
  			text-align: center;
  			position: absolute;
  			top: 0;	
  			right: 0;
  			background-color: #E87439;
  			z-index: 999;
  		}
  	}
	.mt30{
		margin-top: .3rem;
	}
	.btnBar{
		width: 6rem;
		margin: 0 auto;
	}
}
</style>