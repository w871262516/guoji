<template>
	<div class="page">
	  	<div class="page-content">
	  		<div class="wrap">
	  			<svgs style="display: none;"></svgs>
	  			<img src="../../../static/common/logo.png" class="logo" />
	  			<section class="section">
	  				<div>
	  					<section class="guide_item">
				        	<svg class="icon_style">
				                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#username'" :fill="fill"></use>
				        	</svg>
				        </section>
				        <input type="text" v-model.trim="username" placeholder="请输入手机号"/>
	  				</div>
	  			</section>
	  			<section class="section">
	  				<div>
	  					<section class="guide_item">
				        	<svg class="icon_style">
				                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#psd'" :fill="fill"></use>
				        	</svg>
				        </section>
				        <input type="password" v-model.trim="password" placeholder="请输入密码"/>
	  				</div>
	  			</section>
	  			<p class="forgetP"  @click="goReset">忘记密码？</p>
	  			<div class="btnBar">
	  				<a class="btn loginBtn" @click="goIndex">登录</a>
	  				<a class="btn registerBtn" @click="goRegister">注册</a>
	  			</div>
	  			<div class="loginType">
	  				<span class="tips">使用第三方账号登录</span>
	  				<div>
	  					<section @click="wechatLogin">
		  					<img src="../../../static/common/wechatIcon.png" class="iconLogo" />
		  				</section>
		  				<section>
		  					<img src="../../../static/common/qqIcon.png" class="iconLogo" />
		  				</section>
		  				<section>
		  					<img src="../../../static/common/weboIcon.png" class="iconLogo" />
		  				</section>
	  				</div>
	  			</div>
	  		</div>
  		</div>
  	</div>
</template>

<script>
	import svgs from '../../components/common/svgs.vue'
	export default{
		name:'login',
		components:{
			svgs
		},
		data(){
			return{
				username:'',
				password:'',
				fill:"#ffffff",
				token:''
			}
		},
		methods:{
			wechatLogin(){//微信登录
				// if(this.isWeixin()){
						// 微信登录，接口由后台定义
					let that = this
					that.$axios({
						method:'post',
						url:that.GLOBAL.develop_url+'api/hompage/weichatlogin',
						xhrFields:{
							widthCredentials:true
						},
						crossDomain:true,
						header:{
							'Content-Type': 'application/x-www-form-urlencoded',
						}
					}).then(function(res){
						console.log(res.data)
						alert(JSON.stringify(res.data))
						if(res.data.code==200){
							localStorage.setItem("token",res.data.data.token)
							that.$store.state.userInfo.token = res.data.data.token
							that.token = res.data.data.token
	    					that.getMid()
							// $toast.show('登录成功!', 1000).then(() => {that.$router.push('/index')})

						}else if(res.data.code==302){
							$toast.show('请先完善个人信息！', 1000).then(() => {that.$router.push('/perfectInfo')})
							
						}else{
							$toast.show(res.data.msg, 1000)
						}
					}).catch(function(err){
						console.log(err)
						alert(err)
						$toast.show('网络错误', 1000)
					})
			},
			goIndex(){//账号密码登录
				let that = this
				if(!that.username || that.username==''||that.username==undefined||that.username.length != 11){
					$toast.show('请输入正确手机号', 1000)
					return
				}
				if(!that.password){
					$toast.show('密码不能为空', 1000)
					return
				}
				that.$axios({
	    			method:'post',
	    			url:that.GLOBAL.develop_url+'api/login',
	    			data:{
	    				mobile:that.username,
	    				password:that.password
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
	    			switch (res.data.code){
	    				case "200":
	    					that.$store.commit('setUserToken',res.data.data) //设置token
	    					localStorage.setItem('token',res.data.data)
	    					localStorage.setItem('yx_token',res.data.yx_token)
	    					that.token = res.data.data
	    					that.getMid()
	    					break;
	    				case "400":
	    					$toast.show('密码错误！', 1000)
	    					break;
	    				case "401":
	    					$toast.show('手机号未注册！', 1000)
	    					break;
	    				default:
							$toast.show(res.data.msg, 1000)
	    					break;
	    			}
	    		}).catch(function(err){
	    			$toast.show('网络错误', 1000)
	    		})
			},
			getMid(){//登录成功 获取用户mid
				let that = this
				that.$axios({
	    			method:'post',
	    			url:that.GLOBAL.develop_url+'api/info',
	    			data:{
	    				token:that.token
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
	    			if(res.data.code=="200"){
						localStorage.setItem("mid",res.data.data.mid)
						localStorage.setItem("myRole",'member_'+res.data.data.mid)
						// that.$store.dispatch('initNimSDK','member_'+res.data.data.mid)
						that.$store.state.historyData = {}
						$toast.show('登录成功！', 1000).then(() => {
							that.$router.push('/index')
						})
	    			}else{
						$toast.show(res.data.msg, 1000)
					}
	    		}).catch(function(err){
					console.log(err);
					
	    			$toast.show('网络错误', 1000)
	    		})
			},
			goRegister(){
				this.$router.push('/register')
			},
			goReset(){
				this.$router.push('/resetPsd')
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
		background: url(/static/common/login.png) no-repeat top left;
		background-size: cover;
		color: #fff !important;
		overflow: hidden;
		.wrap{
			height: 100%;
			width: 100%;
			background-color: rgba(0,0,0,0.8);
			display: flex;
			display: -webkit-flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			overflow: hidden;
			.logo{
				display: block;
				width: 1.53rem;
				height: 1.53rem;
				margin-bottom: 1rem;
			}
			.section{
				width: 5rem;
				height: .6rem;
				margin-bottom: .45rem;
				div{
					display: flex;
					display: -webkit-flex;
					justify-content: space-between;
					align-items: center;
					input{
						height: .6rem;
						font-size: .3rem;
						width: 4.1rem;
						background-color: rgba(0,0,0,0,0);
						border-top: 0px none;
						border-right: 0px none;
						border-left: 0px none;
						border-bottom: 1px solid #fff;
						padding: 0rem .1rem;
						border-radius: 0;
						color: #fff !important;
					}
				}
			}
			.forgetP{
				margin: 0 auto;
				color: #fff;
				text-align: right;
			}
			.btnBar{
				width: 5rem;
				margin-top: .25rem;
				display: flex;
				display: -webkit-flex;
				justify-content: space-around;
				align-items: center;
				.btn{
					display: block;
					border-radius: 33px;
					width: 2rem;
					height: .66rem;
					line-height: .66rem;
					font-size: .28rem;
					color: #fff !important;
					text-align: center;
					border:1px solid #E87439;
				}
				.registerBtn{
					background-color: #9c9a9a;
				}
			}
			.loginType{
				margin-top: 2rem;
				width: 5.2rem;
				display: flex;
				display: -webkit-flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
				.tips{
					width: 2.4rem;
					font-size: .24rem;
					display: inline-block;
					text-align: center;
					position: relative;
					&:before{
						content: '';
						height: 2px;
						width: 1.6rem;
						background-color: #fff;
						position: absolute;
						left: -1.8rem;
						top: 50%;
						transform: translateY(-50%);
						-webkit-transform: translateY(-50%);
					}
					&:after{
						content: '';
						height: 2px;
						width: 1.6rem;
						background-color: #fff;
						position: absolute;
						left: 2.6rem;
						top: 50%;
						transform: translateY(-50%);
						-webkit-transform: translateY(-50%);
					}
				}
				div{
					margin-top: .4rem;
					width: 4rem;
					display: flex;
					display: -webkit-flex;
					justify-content: space-around;
					align-items: center;
					flex-direction: row;
					section{
						img{
							display: block;
							width: .63rem;
							height: .63rem;
						}
					}
				}
			}
		}
	}
}
.guide_item{
	display: flex;
	display: -webkit-flex;
	align-items: center;
	.icon_style{
		display: inline-block;
		width: .6rem;
		height: .6rem;
	}
}
</style>
