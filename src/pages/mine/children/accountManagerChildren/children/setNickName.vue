<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">设置昵称</span>
			</von-header>
	  		<von-input type="text" v-model="nickName" placeholder="请输入您的昵称"> </von-input>
			<div class="btnBar">
				<md-button class="button button-positive button-block" @click.native="changeNickName()">
					确&nbsp;&nbsp;定
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
		  		nickName:this.$route.params.nickname || ''
			}
		},
		methods:{
			back(){
				this.$router.go(-1)
			},
			changeNickName(){ //修改昵称
				localStorage.setItem('nickName',this.nickName)
				this.$router.go(-1)
//				let that = this
//				that.$axios({
//	    			method:'post',
//	    			url:that.GLOBAL.develop_url+'api/hompage/personshowedit',
//	    			data:{
//	    				token:localStorage.getItem('token'),
//	    				nickname:that.nickName
//	    			},
//	    			transformRequest:[function(data){
//	    				let ret = ''
//	    				for(let it in data){
//	    					ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
//	    				}
//	    				return ret
//	    			}],
//	    			xhrFields:{
//	    				widthCredentials:true
//	    			},
//	    			crossDomain:true,
//	    			header:{
//	    				'Content-Type': 'application/x-www-form-urlencoded'
//	    			}
//	    		}).then(function(res){
//	    			if(res.data.code == "200"){
//	    				$toast.show('修改成功！', 1000).then(() => {
//							that.$router.go(-1)
//	    				})
//	    			}
//	    			else{
//	    				$toast.show('获取用户信息失败，请重新登录！', 1000).then(() => {
//							that.$router.push('/login')
//	    				})
//	    			}
//	    		})
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