<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">重置支付密码</span>
			</von-header>
  			<von-input 
			  type="password" 
			  v-model.trim="psd" 
			  placeholder="请输入支付密码"
			  label="支付密码">
			</von-input>
  			<von-input 
			  type="password" 
			  v-model.trim="newpsd" 
			  placeholder="请输入新支付密码"
			  label="新密码">
			</von-input>
			<von-input 
			  type="password" 
			  v-model.trim="surepsd" 
			  placeholder="请确定支付密码" 
			  label="确定密码">
			</von-input>
			<div class="btnBar">
				<md-button class="button button-positive button-block" @click.native="checkPsd">
					确定
				</md-button>
			</div>
  		</div>
  	</div>
</template>

<script>
	export default{
		name:'resetPayPassword',
		data(){
			return{
				psd:'',
				newpsd:'',
				surepsd:''
			}
		},
		methods:{
			back(){
				this.$router.go(-1)
			},
			to(arg){
				this.$router.push(arg)
			},
			checkPsd(){
				if(this.psd.length<6){
					$toast.show('请填写正确支付密码', 1000)
				}else if(this.newpsd <6){
					$toast.show('请填写正确新密码', 1000)
				}else if(this.surepsd != this.newpsd){
					$toast.show('密码不一致', 1000)
				}else{
					this.resetPsd()
				}
			},
			resetPsd(){ //重置支付密码
				if(localStorage.getItem('token')==null || localStorage.getItem('mid')==null){this.$router.push('/login')}
				let that = this
				that.$axios({
					method:'post',
					url:that.GLOBAL.develop_url+'api/change_pay_password',
					data:{
						token:localStorage.getItem('token')
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
							$toast.show('修改成功！', 1000).then(() => {
								that.back()
							})
							break;
						case "404":
							$toast.show(res.data.msg, 1000).then(() => {
								that.$router.push('/login')
							})
						default:
							$toast.show(res.data.msg, 1000)
							break;
					}
				})
			}
		},
		created(){
			
		}
	}
</script>

<style lang="less" scoped>
.page-content {
  	padding-top: 44px;
  	.tips{
  		padding: .2rem .2rem 0 .2rem;
  		color: #9D9C9C;
  	}
  	.section{
		margin-top: .25rem;
		width: 100%;
		height: 1rem;
		position: relative;
		background-color: #fff;
		display: flex;
		display: -webkit-flex;
		flex-direction: row;
		justify-content: flex-start;
		label{
			width: 1.6rem;
			height: 1rem;
			line-height: 1rem;
			padding: 0 .3rem;
			font-size: .3rem;
		}
		input{
			width: calc(100% - 1.6rem);
			height: 100%;
			font-size: .3rem;
			background-color: rgba(0,0,0,0,0);
		}
		.checkCode{
			color: #E87439;
			border: 1px solid #E87439;
			display: inline-block;
			width: 1.8rem;
			height:.7rem;
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
			right: .2rem;
			background-color: #fff;
			z-index: 999;
		}
	}
	.btnBar{
		width: 6rem;
		margin: .2rem auto;
	}
}
</style>