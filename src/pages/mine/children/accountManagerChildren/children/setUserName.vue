<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">设置姓名</span>
			</von-header>
	  		<von-input type="text" v-model="realname" placeholder="请输入您的姓名"> </von-input>
			<div class="btnBar">
				<md-button class="button button-positive button-block" @click.native="changeRealName()">
					确&nbsp;&nbsp;定
				</md-button>
			</div>
	  	</div>
	</div>	
</template>

<script>
	export default{
		name:'setUserName',
		data(){
			return{
		  		realname:this.$route.params.realname || ''
			}
		},
		methods:{
			back(){
				this.$router.go(-1)
			},
			changeRealName(){ //修改昵称
				console.log(this.nickName)
				let that = this
				that.$axios({
	    			method:'post',
	    			url:that.GLOBAL.develop_url+'api/hompage/personshowedit',
	    			data:{
	    				token:localStorage.getItem('token'),
	    				realname:that.realname
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
		},
		created(){
			
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