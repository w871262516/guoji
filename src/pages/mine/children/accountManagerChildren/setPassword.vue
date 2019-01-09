<template>
	<div class="page">
		  	<div class="page-content">
		  	<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">设置密码</span>
			</von-header>
		  	<von-input type="password" v-model="oldPsd" placeholder="请输入旧密码（6-20位）" label="旧密码："></von-input>
		  	<von-input type="password" v-model="newPsd" placeholder="请输入新密码（6-20位）" label="新密码："></von-input>
		  	<von-input type="password" v-model="checkPsd" placeholder="请输入再次输入密码" label="确认密码："></von-input>
		  	<div class="btnBar">
				<md-button class="button button-positive button-block" @click.native="savePsd()">
					保&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;存
				</md-button>
			</div>
  		</div>
  	</div>
</template>

<script>
	export default{
		name:'setPassword',
		data(){
			return{
				oldPsd:'',
				newPsd:'',
				checkPsd:''
			}
		},
		methods:{
			back(){
				this.$router.go(-1)
			},
			savePsd(){
				let that = this
				if(that.oldPsd.length<6){
					$toast.show('请输入正确密码！', 1000).then(() => {})
					return
				}
				if(that.newPsd.length<6){
					$toast.show('请输入正确密码！', 1000).then(() => {})
					return
				}
				if(that.newPsd != that.checkPsd){
					$toast.show('两次输入的密码不一致！', 1000).then(() => {})
					return
				}
				that.$axios({
	    			method:'post',
	    			url:that.GLOBAL.develop_url+'api/hompage/personalpwd',
	    			data:{
	    				token:localStorage.getItem('token'),
	    				password_new:that.newPsd,
	    				password_old:that.oldPsd
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
						$toast.show('修改成功！', 1000).then(() => {})
	    			}else{
						$toast.show(res.data.msg, 1000)
						that.oldPsd = '';
						that.newPsd = '';
						that.checkPsd = '';
					}
	    		})
			}
		}
	}
</script>

<style lang="less" scoped>
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
.ion-ios-arrow-right{
	color: #1c1c1c;position: absolute;right: .16rem;top: 50%;transform: translateY(-50%);-webkit-transform: translateY(-50%);height: auto;
}
.ion-ios-arrow-left{
	color: #1c1c1c;position: absolute;right: .16rem;top: .18rem;height: auto;
}
.icon{
	font-size: .35rem !important;
}
</style>