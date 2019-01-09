<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">店铺简介</span>
			</von-header>
	  		<textarea v-model.trim="storeIntroduction" :maxlength="100" rows="5" placeholder="请输入您的店铺简介，最多100个字">

		  	</textarea>
			<div class="btnBar">
				<md-button class="button button-positive button-block" @click.native="setStoreIntroduction()">
					确&nbsp;&nbsp;定
				</md-button>
			</div>
	  	</div>
	</div>	
</template>

<script>
	export default{
		name:'setStoreIntroduction',
		data(){
			return{
				storeIntroduction:''
			}
		},
		methods:{
			back(){
				this.$router.go(-1)
			},
			setStoreIntroduction(){ //获取商家个人具体信息
				if(this.storeIntroduction==''){
					$toast.show('还没填写简介呢！', 1000)
					return
				}
				if(localStorage.getItem('token')==null || localStorage.getItem('mid')==null){this.$router.push('/login')}
				let that = this
				that.$axios({
					method:'post',
					url:that.GLOBAL.develop_url+'api/edit_introduce',
					data:{
						token:localStorage.getItem('token'),
						introduce:that.storeIntroduction
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
							$toast.show('修改成功！', 1000).then(() => {that.back()})
							break;
						case "400":
							$toast.show('获取信息失败，请重新登录！', 1000).then(() => {
								that.$router.push('/login')
							})
						default:
							break;
					}
				})
			}
		},
		created(){
			this.storeIntroduction = this.$route.params.intru
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
	textarea{
		width: 100%;
		line-height: 1.2;
		padding: .15rem;
	}
}
</style>