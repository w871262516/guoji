<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">设置手机号</span>
			</von-header>
	  		<von-input type="tel" v-model="phone" placeholder="请输入新手机号" label="手机号"> </von-input>
	  		<div class="checkInput">
	  			<von-input type="text" v-model="code" placeholder="请输入验证码" label="验证码"></von-input>
	  			<span class="checkCode"  v-show="timeOver" @click="checkPhone">获取验证码</span>
	  			<span class="checkCode"  v-show="!timeOver">{{time}} s</span>
	  		</div>
	  		
			<div class="btnBar">
				<md-button class="button button-positive button-block" @click.native="clicked()">
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
		  		phone:'',
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
			checkPhone(){//验证手机号
			
				if(!this.isPoneAvailable(this.phone)){
					$toast.show('请输入正确手机号', 1000)
					this.avilabelPhone = false
					return
				}else{
					this.avilabelPhone = true;
					this.getCode();
				}
			},
			getCode(){//获取验证码
				if(!this.avilabelPhone){
					$toast.show('请输入正确手机号', 1000)
					return
				}else{
					this.countDown()
					let that = this
					that.$axios({
						method:'post',
						url:that.GLOBAL.develop_url+'api/send_sms',
						data:{
							token:localStorage.getItem('token'),
							phone:that.phone,
							send_type:1006
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
						$toast.show('网络错误', 1000)
					})
				}
			},
			clicked(){
				if(!this.isCode(this.code)){
					$toast.show('请输入正确验证码', 1000)
					return
				}else{
					let that = this
					that.$axios({
						method:'post',
						url:that.GLOBAL.develop_url+'api/hompage/edit_bind_phone',
						data:{
							token:localStorage.getItem('token'),
							phone_code:that.code,
							new_phone:that.phone
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
							$toast.show("修改手机号成功")
							that.$router.push('/login')
						}else if(res.data.code==404){
							$toast.show(res.data.msg, 1000)
							that.$router.push('/login')
						}else{
							$toast.show(res.data.msg, 1000)
						}
					})
					// .catch(function(err){
					// 	console.log(err)
					// 	$toast.show('网络错误', 1000)
					// })
				}
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