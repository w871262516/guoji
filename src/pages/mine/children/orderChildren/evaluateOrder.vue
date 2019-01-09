<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">发布评论</span>
			  <button class="button button-icon headWord" slot="right" @click="sendComment">发布</button>
			</von-header>
	  		<div class="evaluateDiv">
				<div class="goodImg" :style="{backgroundImage:'url('+thumb+')'}"></div>
	  			<div class="evaluateBox">
	  				<p>
	  					<span>描述相符</span>
						<rate :length="5" v-model="value1" :ratedesc="texts"/>
	  				</p>
	  				<p>
	  					<span>物流服务</span>
						<rate :length="5" v-model="value2" :ratedesc="texts"/>
	  				</p>
	  				<p>
	  					<span>服务态度</span>
						<rate :length="5" v-model="value3" :ratedesc="texts"/>
	  				</p>
	  			</div>
	  		</div>
	  		<svgs style="display: none;"></svgs>
	  		<div class="bottomBox">
		  		<textarea placeholder="请写下你对这个拍品的有点和美中不足的地方吧~" rows="5" class="textArea" v-model="evaluation"></textarea>
		  		<template v-for="img in imgLists">
					<div class="imgBox">
						<div class="img" :style="{backgroundImage:'url('+img.img+')'}"></div>
						<span @click="deleteThis(img)">
							<img src="../../../../../static/common/deletePic.png" class="deletePic" />
						</span>
					</div>
				</template>
				<div class="addPic" v-if="imgLists.length < 9">
					<i>
						<section class="guide_item">
							<svg class="icon_style">
								<use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#addPics'"></use>
							</svg>
							<span>添加图片</span>
						</section>
					</i>
					<form ref="uploadForm" id="uploadForm" method="post" enctype="multipart/form-data" class="formInput">
						<input type="text" id="token" ref="token" v-model="token" name="token" style="visibility: hidden;"/>
						<input type="file" id="file" name="file" accept="image/*" multiple="multiple" @change="chooseImg($event)" v-if="isIphone"/>
						<!-- <input type="file" id="file" name="file" runat="server" capture="camera" accept="image/*" multiple="multiple" @change="chooseImg($event)" v-if="!isIphone"/> -->
						<input type="file" id="file" name="file" runat="server" accept="image/*" multiple="multiple" @change="chooseImg($event)" v-if="!isIphone"/>
					</form>
		  		</div>
	  		</div>
		</div>
	</div>
</template>

<script>
	import vmRate from 'vue-multiple-rate'
	import svgs from '../components/svgs.vue'
	import 'vue-multiple-rate/lib/rate.css'
	export default{
		name:'evaluateOrder',
		components:{
			vmRate,
			svgs
		},
		data(){
			return{
				token:localStorage.getItem('token'),
				order_sn:this.$route.query.order_sn,
				thumb:this.$route.query.thumb,
				size:'.3rem',
				text:'',
		  		value1:5,
		  		value2:5,
		  		value3:5,
		  		texts:['极差', '失望', '一般', '满意', '非常好'],
				evaluation:'',
				imgLists:[],
				file:'',
				isIphone:true,
			}
		},
		watch:{
			file(val){//监控图片变化 一但用户选好图片 马上自动上传
				console.log(val.length)
				let vl = val.length
				if(vl>9){
					$toast.show('最多可上传9张图片',1000)				
					return
				}else if((vl+this.imgLists.length)>9){
					$toast.show('最多可上传9张图片',1000)				
					return
				}else{
					this.upload()
				}
			}
		},
		created(){
			this.isIphone = this.thisIsIphone
		},
		methods:{
			back(){
				this.$router.go(-1)
			},
			upload(){//上传
				let form = new FormData()
				form.append('token',this.token)
				for(var i=0;i<this.file.length;i++){
					form.append('file['+i+']',this.file[i])
				}
				console.log("表单——————————",form)
				let that = this
				that.$axios({
	    			method:'post',
	    			url:that.GLOBAL.develop_url+'upload/upload_to_upyun',
	    			data:form,
	    			xhrFields:{
	    				widthCredentials:true
	    			},
					headers:{
						'Content-Type': 'multipart/form-data'
					}
	    		}).then(function(res){
	    			console.log(res)
	    			if(res.data.code == "200"){
	    				for(let j=0;j<res.data.data.length;j++){
		    				let a = {'img':res.data.data[j].src}
		    				console.log(a)
	    					that.imgLists.push(a)
	    				}
	    			}
	    		})
			},
			chooseImg(i){//选择图片
				this.file = i.target.files
				console.log("选择图片",this.file)
			},
			deleteThis(img){//删除图片
				this.imgLists = this.imgLists.filter(i=>{return i!=img})
			},
			sendComment(){//发布
				if(this.title == '' ){
					$toast.show('标题未填写！',1000)
					return
				}
				if(this.content == ''){
					$toast.show('内容未填写！',1000)
					return
				}
				let that = this
				var data = {
					token:that.token,
					order_sn:that.order_sn,
					star:that.value1,
					lgs_star:that.value2,
					ser_star:that.value3,
					cont:that.evaluation,
					thumbs:JSON.stringify(that.imgLists)

				}
				console.log(data);
				
				that.$axios({
	    			method:'post',
	    			url:that.GLOBAL.develop_url+'api/hompage/commentadd',
	    			data:data,
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
						$toast.show('评论成功！', 1000)
						that.$router.push('/mine/myOrders')
	    			}else{
	    				$toast.show(res.data.msg, 1000)
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
	.evaluateDiv{
		display: flex;
		display: -webkit-flex;
		justify-content: flex-start;
		align-items: center;
		background-color: #fff;
		padding: .3rem .2rem;
		border-bottom:1px solid #d2d2d2;
		.goodImg{
			display: block;
			width: 1.4rem;
			height: 1.4rem;
			margin-right:.5rem;
			background-size: cover;
			background-repeat: no-repeat;
			background-position: center center;
		}
		.evaluateBox{
			p{
				height: .45rem;
				line-height: .45rem;
				font-size: .24rem;
				display: flex;
				display: -webkit-flex;
				justify-content: flex-start;
				align-items: center;
				span{
					margin-right: .3rem;
				}
			}
		}
	}
	.bottomBox{
		background-color: #fff;
		
		.imgBox{
			position: relative;
			display: inline-block;
			.img{
				display: inline-block;
				width: 2rem;
				height: 2rem;
				margin-left: .2rem;
				margin-top: .1rem;
  				background-size: cover;
  				background-repeat: no-repeat;
  				background-position: center center;
			}
			span{
				position: absolute;
				right: -0.15rem;
				top: 0;
				padding:  0  0 .25rem .25rem;
				z-index: 1;
				.deletePic{
					display: block;
					width: .35rem;
					height: .35rem;
					background-color: #fff;
					border-radius: 50%;
				}
			}
		}
		.addPic{
			width: 2rem;
			height: 2rem;
			// background-color: #f2f2f2;
			margin-left: .2rem;
			display: inline-block;
			position: relative;
			
			i{
				display: inline-block;
				border: 1px dotted #b3b2b2;
				width: 2rem;
				height: 2rem;
				display: flex;
				display: -webkit-flex;
				justify-content: center;
				align-items: center;
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				.guide_item{
					display: inline;
					display: flex;
					display: -webkit-flex;
					align-items: center;
					flex-direction: column;
					.icon_style{
						display: inline-block;
						width: .58rem;
						height: .47rem;
					}
					span{
						font-size: .2rem;
						color: #b3b2b2;
					}
				}
			}
			.formInput{
				position: absolute;
				width: 100%;
				height: 100%;
				opacity: 0;
				bottom: .1rem;
				left: -.1rem;
				input{
					padding: 0 !important;
					position: absolute;
					width: 100%;
					height: 100%;
					opacity: 0;
				}
			}
		}
		.textArea{
			padding: .3rem .2rem;
			width: 100%;
		}
		
	}
}

.headWord{
	font-size: .26rem !important;color: #E87439 !important;
}
</style>
<style>
.Rate__star{
	padding: 0!important;
}
.Rate__view{
	display: inline;
}
</style>
