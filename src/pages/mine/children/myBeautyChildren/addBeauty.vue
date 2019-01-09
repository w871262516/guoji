<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon headWord" slot="left" @click="back">取消</button>
			  <span slot="title">美物志编辑</span>
			  <button class="button button-icon headWord" slot="right" @click="sendMyBeauty('1')">发布</button>
			</von-header>
			<svgs style="display: none;"></svgs>
			<!--<div class="coverDiv" @click="changeImg('fm')" :style="{backgroundImage:backgroundImg}">
				<a class="btn" v-if="headImg==''">编辑封面（必填）</a>
			</div>-->
			<div class="inputContent">
				<input type="text" placeholder="输入标题  （必填  最多20个字）" v-model="title" maxlength="20"/>
				<textarea placeholder="输入内容" rows="12" v-model="content" ></textarea>
				<template v-for="img in imgLists">
					<div class="imgBox">
						<div class="img" :style="{backgroundImage:'url('+img.img+')'}"></div>
						<span @click="deleteThis(img)">
							<img src="../../../../../static/common/deletePic.png" class="deletePic" />
						</span>
					</div>
				</template>
				<!-- @click="changeImg()"-->
				<div class="addPic" v-if="imgLists.length < 9">
					<img src="../../../../../static/common/addPics.png" />
					<form ref="uploadForm" id="uploadForm" method="post" enctype="multipart/form-data" class="formInput">
						<input type="text" id="token" ref="token" v-model="token" name="token" style="visibility: hidden;"/>
						<input type="file" id="file" name="file" accept="image/*" multiple="multiple" @change="chooseImg($event)" v-if="isIphone"/>
						<input type="file" id="file" name="file" runat="server" capture="camera" accept="image/*" multiple="multiple" @change="chooseImg($event)" v-if="!isIphone"/>
					</form>
				</div>
			</div>
			<div class="bottomBar">
				<!--<section class="guide_item">
		        	<svg class="icon_style">
		                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#photo'"></use>
		          	</svg>
		         	<span>相册</span>
		        </section>
		        <section class="guide_item">
		        	<svg class="icon_style">
		                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#camera'"></use>
		          	</svg>
		         	<span>拍照</span>
		        </section>-->
		        <section class="guide_item" @click="sendMyBeauty('2')">
		        	<svg class="icon_style">
		                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#draft'"></use>
		          	</svg>
		         	<span>草稿</span>
		        </section>
		        <section class="guide_item" @click="goView()">
		        	<svg class="icon_style">
		                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#eyes'"></use>
		          	</svg>
		         	<span>预览</span>
		        </section>
			</div>
		</div>
	</div>
</template>

<script>
	import svgs from '../components/svgs.vue'
	export default{
		name:'addBeauty',
		components:{
			svgs
		},
		data(){
			return{
				beautyID:'',
				isIphone:'',
				backgroundImg:'',
				token:'',
				title:'',
				content:'',
				imgLists:[],
				file:''
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
		methods:{
			back(){
				this.$router.go(-1)
			},
			goView(){
				if(!this.$route.params.data){
					this.$store.commit('setViewTitle',this.title)
					this.$store.commit('setViewContent',this.content)
					this.$store.commit('setViewImgLists',this.imgLists)
					this.$router.push('/mine/myBeauty/addBeauty/viewBeauty')
				}else{
					this.$store.commit('setViewTitle',this.$route.params.data.title)
					this.$store.commit('setViewContent',this.$route.params.data.content)
					this.$store.commit('setViewImgLists',this.$route.params.data.ptoto_data)
					this.$router.push('/mine/myBeauty/addBeauty/viewBeauty')
				}
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
			sendMyBeauty(status){//发表/存草稿
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
	    				status:status,//区分草稿还是发布 2草稿，1发布
	    				id:that.beautyID,//传当前要编辑的草稿id 如果是编辑进来id就是空
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
	    				if(status=='2'){
	    					$toast.show('已保存到草稿箱！', 1000)
	    					that.$router.push('/mine/myBeauty')
	    				}else{
	    					$toast.show('发表成功！', 1000)
	    					that.$router.push('/circle')
	    				}
	    			}
	    			else if(res.data.code == "400"){
	    				$toast.show(res.data.msg, 1000)
	    			}else{
	    				$toast.show('该手机号未注册！', 1000).then(() => {})
	    			}
	    		})
			}
		},
		created(){
			this.isIphone = this.thisIsIphone
			this.token = localStorage.getItem('token')
			if(!this.$route.params.data){//如果是直接点右上角的编辑
				this.title = this.$store.state.viewData.title || ''
				this.content = this.$store.state.viewData.content || ''
				this.imgLists = this.$store.state.viewData.imgLists || []
			}else{//如果是从草稿列表点击进来
				this.beautyID = this.$route.params.data.id //保存当前编辑的草稿id
				this.title = this.$route.params.data.title
				this.content = this.$route.params.data.content
				this.imgLists = this.$route.params.data.ptoto_data || []
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
	.coverDiv{
		height: 3rem;
		background-color: #fff;
		display: flex;
		display: -webkit-flex;
		justify-content: center;
		align-items: center;
		.btn{
			display: block;
			width: 2.7rem;
			height: .7rem;
			border-radius: 10px;
			color: #E87439 !important;
			border: 1px solid #E87439; 
			line-height: .7rem;
			text-align: center;
			font-size: .26rem;
		}
	}
	.inputContent{
		background-color: #fff;
		color: #7b7a7a !important;
		font-size: .24rem !important;
		padding-bottom: .4rem;
		input{
			width: 100%;
			border: none;
			border-bottom: 1px solid #eeeeee;
			padding: .3rem .2rem;
		}
		textarea{
			padding: .3rem .2rem;
			width: 100%;
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
			width: 2.2rem;
			height: 2.2rem;
			background-color: #f2f2f2;
			margin-left: .2rem;
			display: inline-block;
			position: relative;
			img{
				display: block;
				width: .75rem;
				height: .75rem;
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%,-50%);
			}
			.formInput{
				position: absolute;
				width: 100%;
				height: 100%;
				opacity: 0;
				input{
					padding: 0 !important;
					position: absolute;
					width: 100%;
					height: 100%;
					opacity: 0;
				}
			}
		}
	}
	.bottomBar{
		width: 100%;
		height: 1rem;
		position: fixed;
		left: 0;
		bottom: 0;
		background-color: #fff;
		display: flex;
		display: -webkit-flex;
		justify-content: space-around;
		align-items: center;
		.guide_item{
			display: flex;
			display: -webkit-flex;
			align-items: center;
			flex-direction: column;
			justify-content: center;
			font-size:.25rem;
			.icon_style{
				display: inline-block;
				width: .44rem;
				height: .4rem;
				margin: 0.05rem 0;
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