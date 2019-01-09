<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">意见反馈</span>
			  <button class="button button-icon headWord" slot="right" @click="writeFeedback()">提交</button>
			</von-header>
	  		<div class="mt30">
		  		<textarea @blur="checkLen" @keydown="hidTips" @focus="hidTips" @input="checkLen" v-model="content" :maxlength="maxLen" rows="10">

		  		</textarea>
		  		<span v-show="iShow==true">
		  			<i class="i">拍拍君会认真看完的喔！</i>
		  		</span>
	  		</div>
		</div>
	</div>
</template>

<script>
	export default{
		name:'feedback',
		data(){
			return{
				content:'',
				maxLen:'12',
		  		iShow:true
			}
		},
		watch:{
			content(val){
				val.length < 1 ? this.showTips() : this.hidTips()
			}
		},
		methods:{
			back(){
				this.$router.go(-1)
			},
			showTips(){
				this.iShow = true
			},
			hidTips(){
				this.iShow = false
			},
			checkLen(){
				this.content.length < 1 ? this.showTips() : this.hidTips()
			},
			writeFeedback(){ //获取我喜欢的圈子
				let that = this
				that.$axios({
					method:'get',
					url:that.GLOBAL.develop_url+'api/hompage/opinion',
					params:{
						token:localStorage.getItem('token'),
						content:that.content
					},
					xhrFields:{
		    			withCredentials:true
	    			},
		    		crossDomain:true,
		    		headers: { //解决跨域
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				}).then(function(res){
					console.log(res.data)
					that.content = ''
					that.showTips()
					switch(res.data.code){
						case 200:
							$toast.show('感谢您的反馈，拍拍君会认真看完的喔！', 1000).then(() => {
								that.back()
							})
							break;
					}
					if(res.data.code==404){
						$toast.show(res.data.msg, 1000).then(() => {
							that.$router.push('/login')
						})
					}
	    			that.loadFinish = true
				}).catch(function(err){
					//$toast.show('网络错误', 2000).then(() => {})
				})
			},
		}
	}
</script>

<style scoped lang="less">
.page-content {
	padding-top: 44px;
  	padding-bottom: 1rem;
	color: #323232;
	position: relative;
	.mt30{
		position: relative;
		textarea{
			width: 100%;
		}
		span{
			.i{
				padding-left: .6rem;
				position: absolute;
				top: .025rem;
			}
			&:before{
				content:'';
				display: block;
				width: .3rem;
				height: .32rem;
				background: url(../../../../../static/common/flagIcon.png) no-repeat center left;
				background-size: cover;
				position: absolute;
				left: .2rem;
				top: .025rem;
			}
		}
	}
	
}
.mt30{
	margin-top: .3rem;
}
.headWord{
	font-size: .26rem !important;color: #757373 !important;
}
</style>