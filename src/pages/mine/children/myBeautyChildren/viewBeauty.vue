<template>
	<div class="page">
	  <div class="page-content">
 			<von-header theme="light">
		    <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">预览</span>
			  <button class="button button-icon headWord" slot="right" @click="sendMyBeauty('1')">立即发布</button>
			</von-header>
			<div class="inputContent">
				<p v-html="title"></p>
				<section v-html="content"></section>
				<div class="flexImgBox">
					<template v-for="photo in imgLists">	
						<div :style="{backgroundImage:'url('+photo.img+')'}" :class="{bgImg:imgLists.length==1,bgImg2:imgLists.length==2 || imgLists.length==4,bgImg3:imgLists.length==3||imgLists.length==5||imgLists.length==6||imgLists.length==7||imgLists.length==8||imgLists.length==9}" ></div>
					</template>
				</div>
			</div>
	  </div>
  </div>
</template>
<script>
  export default {
  	name:'viewBeauty',
    data() {
      return {
      		token:'',
      		title:'',
      		content:'',
        	imgLists:''
      }
    },

    methods: {
      back() {
        this.$router.go(-1)
      },
      sendMyBeauty(status){//发表
			if(this.title == '' ){
				$toast.show('标题未填写！',1000)
				return
			}
			if(this.content == ''){
				$toast.show('内容未填写！',1000)
				return
			}
			let that = this
			that.$axios({
    			method:'post',
    			url:that.GLOBAL.develop_url+'api/hompage/magazineadd',
    			data:{
    				token:that.token,
    				status:status,
    				title:that.toUnicode(that.title),
    				contents:that.toUnicode(that.content),
    				photo:JSON.stringify(that.imgLists)
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
					$toast.show('发表成功！', 1000)
					that.$router.push('/circle')
    			}else if(res.data.code == "400"){
    				$toast.show(res.data.msg, 1000)
    			}else{
    				$toast.show('该手机号未注册！', 1000).then(() => {})
    			}
    		})
		}
    },
    created(){
    	this.token = localStorage.getItem('token')
    	this.title = this.$store.state.viewData.title
    	this.content = this.$store.state.viewData.content
    	this.imgLists = this.$store.state.viewData.imgLists
    }
  }
</script>

<style scoped lang="less">
.page-content {
  	padding-top: 44px;
  	padding-bottom: 1rem;
	color: #323232;
	  .coverDiv{
			height: 3rem;
			background-color: #fff;
			display: flex;
			display: -webkit-flex;
			justify-content: center;
			align-items: center;
		}
		.inputContent{
			background-color: #fff;
			color: #7b7a7a !important;
			font-size: .26rem !important;
			padding-bottom: .4rem;
			p{
				background-color: #fff;
				padding: .2rem .2rem;
				border-bottom: 1px solid #eeeeee;
		 		 font-size: .26rem;
			}
			section{
				background-color: #fff;
				padding: .2rem .2rem;
			  	font-size: .26rem;
			  	min-height: 3rem;
			}
			.imgBox{
				position: relative;
				display: inline-block;
				.img{
					display: inline-block;
					width: 2.2rem;
					height: 2.2rem;
					margin-left: .2rem;
					margin-top: .1rem;
	  				background-size: cover;
	  				background-repeat: no-repeat;
	  				background-position: center center;
				}
			}
		}
		.flexImgBox{
  			display: flex;
  			display: -webkit-flex;
  			flex-direction: row;
  			width:  calc(100% - .4rem);
  			margin: 0 auto;
  			flex-wrap: wrap;
  			justify-content: flex-start;
  			align-items: center;
	  			.bgImg{
	  				width: 80%;
	  				height: 3rem;
	  				background-size: cover;
	  				background-repeat: no-repeat;
	  				background-position: center center;
	  			}
	  			.bgImg2{
	  				width: 45%;
	  				height: 2rem;
	  				background-size: cover;
	  				background-repeat: no-repeat;
	  				background-position: center center;
	  				&:nth-child(2){
	  					margin-left: 5%;
	  				}
	  				&:nth-child(3){
	  					margin-top: .2rem;
	  				}
	  				&:nth-child(4){
	  					margin-left: 5%;
	  					margin-top: .2rem;
	  				}
	  			}
	  			.bgImg3{
	  				width: 30%;
	  				padding-top: 30%;
	  				margin-top: .2rem;
	  				background-size: cover;
	  				background-repeat: no-repeat;
	  				background-position: center center;
	  				&:first-child{
	  					margin-left: 0%;
	  				}
	  				&:nth-child(1){
	  					margin-top: 0;
	  				}
	  				&:nth-child(2){
	  					margin-top: 0;
	  				}
	  				&:nth-child(3){
	  					margin-top: 0;
	  				}
	  				&:nth-child(4){
	  					margin-left: 0%;
	  				}
	  				&:nth-child(7){
	  					margin-left: 0%;
	  				}
	  			}
	  		}
		
}
.headWord{
	font-size: .26rem !important;color: #757373 !important;
}
</style>