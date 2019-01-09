<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">系统消息</span>
			</von-header>
	  		<svgs style="display: none;"></svgs>
			<div v-for="(data,index) in datas" class="dataBox" :key="index">
				<span class="time">{{ data.create_time }}</span>
				<div class="contentBox">
					<img :src="data.userImg" class="userImg"/>
					<p>
						{{data.content}}
					</p>
				</div>
			</div>
			<h5 v-show="datas==null">暂无消息</h5>
		</div>
	</div>
</template>

<script>
	import svgs from '.././components/svgs.vue'	
	export default{
		name:'systemMessage',
		components:{
	  		svgs
		},
		data(){
			return{
		  		datas:[]
			}
		},
		methods:{
			back(){
				this.$router.go(-1)
			},
			getSystemMsg(){
				let that = this
	    		that.$axios({
	    			method:'get',
	    			url:that.GLOBAL.develop_url+'api/hompage/systemmsg',
	    			params:{
	    				token:localStorage.getItem('token')
	    			},
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
						case 200:	
							that.datas = res.data.data
							that.datas.forEach(i=>{
								i.create_time = that.timeFormer(i.create_time)
							})
							console.log(that.datas)
							break;
						case "400":
							$toast.show('获取信息失败，请重新登录！', 1000).then(() => {
								that.$router.push('/login')
							})
						default:
							break;
					}
					if(res.data.code==404){
						$toast.show(res.data.msg, 1000).then(() => {
							that.$router.push('/login')
						})
					}
	    		})
			}
		},
		created(){
			this.getSystemMsg()
		}
	}
</script>

<style scoped lang="less">
.page-content {
  	padding-top:44px;
	.dataBox{
		padding: .2rem;
		display: flex;
  		display: -webkit-flex;
  		justify-content: flex-start;
  		flex-direction: column;
  		align-items: center;
		.time{
			width: auto;
			text-align: center;
			padding: .1rem .24rem;
			background-color: #d6d6d6;
			color: #fff;
			font-size: .24rem;
			border-radius: 20px;
			margin-bottom: .1rem;
		}
		.contentBox{
			width: 90%;
			display: flex;
	  		display: -webkit-flex;
	  		justify-content: space-between;
	  		.userImg{
	  			display: block;
	  			width: .7rem;
	  			height: .7rem;
	  			border-radius: 50%;
	  		}
	  		p{
	  			width: calc(100% - 1rem);
	  			background-color: #fff;
	  			padding: .25rem .25rem;
	  			margin-top: .25rem !important;
	  			position: relative;
	  			&:before{
	  				content: '';
	  				display: block;
	  				width: .35rem;
	  				height: .125rem;
	  				position: absolute;
	  				top: -0.02rem;
	  				left: -.3rem;
            	 	border-top: 2px solid transparent;
    	    	   	border-right: .2rem solid #fff;
            	 	border-bottom: .1rem solid transparent;
            	 	transform:rotate(10deg);
            	 	z-index: 1;
	  			}
	  		}
		}
	}
}
h5{
	height: 1rem;
	width: 100%;
	line-height: 1rem;
	text-align: center;
	color: #323232;
}

</style>