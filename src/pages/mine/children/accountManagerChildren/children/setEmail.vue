<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">设置邮箱</span>
			</von-header>
	  		<von-input type="text" v-model="email" placeholder="请输入您的邮箱地址"> </von-input>
			<div class="btnBar">
				<md-button class="button button-positive button-block" @click.native="changeEmail()">
					确定
				</md-button>
			</div>
	  	</div>
	</div>	
</template>

<script>
	export default{
		name:'setNickName',
		data(){
			return{
		  		email:this.$route.params.email
			}
		},
		methods:{
			back(){
				this.$router.go(-1)
			},
			changeEmail(){ //修改昵称
				console.log(this.nickName)
				let reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
				if(!this.email){
					$toast.show('验证码不能为空!', 1000).then(() => {})
					return
				}
				if(!reg.test(this.email)){
					$toast.show('邮箱格式不正确，请重新输入！', 1000).then(() => {})
					return
				}
				let that = this
				that.$axios({
	    			method:'post',
	    			url:that.GLOBAL.develop_url+'api/hompage/personshowedit',
	    			data:{
	    				token:localStorage.getItem('token'),
	    				email:that.email
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
	    			console.log(res)
	    			if(res.data.code == "200"){
	    				$toast.show('修改成功！', 1000).then(() => {
							that.$router.go(-1)
	    				})
	    			}
	    			else{
	    				$toast.show('获取用户信息失败，请重新登录！', 1000).then(() => {
							that.$router.push('/login')
	    				})
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
	.mt30{
		margin-top: .3rem;
	}
	.btnBar{
		width: 6rem;
		margin: 0 auto;
	}
}
</style>