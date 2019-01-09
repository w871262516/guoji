<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">个人认证</span>
			</von-header>
	  		<svgs style="display: none;"></svgs>
	  		<div v-show="first">
		  		<list class="list-ios item-icon-right mt30">
					<div class="section">
						<item class="item1">
							<div class="contentBox">
								<span>店铺头像</span>
								<img class="userImg" :src="storePic" />
							</div>
	       					<i class="icon ion-ios-arrow-right"></i>
	       					<form ref="uploadForm" id="uploadForm" method="post" enctype="multipart/form-data" class="formInput">
								<input type="text" id="token" ref="token" v-model="token" name="token" style="visibility: hidden;"/>
								<input type="file" id="file" name="file" accept="image/*" @change="chooseImg($event)" v-if="isIphone"/>
								<input type="file" id="file" name="file" runat="server" capture="camera" accept="image/*" @change="chooseImg($event,'storePic')" v-if="!isIphone"/>
							</form>
						</item>
	   				</div>
	   				<!--<router-link :to="'/mine/personAuthen/setStoreName'" class="section">
						<item class="item1">
							<div class="contentBox">
								<span>店铺名称</span>
								<span>未设置</span>
							</div>
		       				<i class="icon ion-ios-arrow-right"></i>
						</item>
	   				</router-link>
	   				<router-link :to="'/mine/personAuthen/setStoreIntroduction'" class="section">
						<item class="item">
							<div class="contentBox">
								<span>店铺简介</span>
								<span>未设置</span>
							</div>
		       				<i class="icon ion-ios-arrow-right"></i>
						</item>
	   				</router-link>-->
				</list>
				<von-input type="text" v-model="storeName" placeholder="请输入店铺名称" label="店铺名称"> </von-input>
	  			<von-input type="text" v-model="storeIntro" placeholder="请输入店铺简介" label="店铺简介" v-if="!isEdit"> </von-input>
				<div class="btnBar"  v-if="!isEdit">
					<md-button class="button button-positive button-block" @click.native="nextOrBack()">
						下一步
					</md-button>
				</div>
				<div class="btnBar"  v-if="isEdit">
					<md-button class="button button-positive button-block" @click.native="changeInfo()">
						保存
					</md-button>
				</div>
	  		</div>
	  		<div v-show="second" class="second">
	  			<von-input type="text" v-model="trueName" placeholder="请输入真实姓名" label="真实姓名"> </von-input>
	  			<von-input type="text" v-model="idCard" placeholder="请输入身份证号" label="身份证号"> </von-input>
	  			<von-input type="tel" v-model="phone"  placeholder="请输入手机号码" label="联系方式"> </von-input>
		  		<p>证件照片</p>
		  		<div class="uploadBox">
		  			<div class="box" :style="{backgroundImage:'url('+positivePic+')'}">
			  			<i v-show="positivePic == ''">
			  				<section class="guide_item">
					        	<svg class="icon_style">
					                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#add'" fill="#cccccc"></use>
					          	</svg>
					          	<span>身份证正面</span>
					      	 </section>
			  			</i>
       					<form ref="uploadForm" id="uploadForm" method="post" enctype="multipart/form-data" class="formInput1">
							<input type="text" id="token" ref="token" v-model="token" name="token" style="visibility: hidden;"/>
							<input type="file" id="file" name="file" accept="image/*" @change="chooseImg($event)" v-if="isIphone"/>
							<input type="file" id="file" name="file" runat="server" capture="camera" accept="image/*" @change="chooseImg($event,'idPositiveSide')" v-if="!isIphone"/>
						</form>
		  			</div>
		  		</div>
		  		<div class="uploadBox">
		  			<div class="box" :style="{backgroundImage:'url('+otherSidePic+')'}">
			  			<i v-show="otherSidePic == ''">
			  				<section class="guide_item">
					        	<svg class="icon_style">
					                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#add'" fill="#cccccc"></use>
					          	</svg>
					          	<span>身份证反面</span>
					      	 </section>
			  			</i>
       					<form ref="uploadForm" id="uploadForm" method="post" enctype="multipart/form-data" class="formInput1">
							<input type="text" id="token" ref="token" v-model="token" name="token" style="visibility: hidden;"/>
							<input type="file" id="file" name="file" accept="image/*" @change="chooseImg($event)" v-if="isIphone"/>
							<input type="file" id="file" name="file" runat="server" capture="camera" accept="image/*" @change="chooseImg($event,'idOtherSide')" v-if="!isIphone"/>
						</form>
		  			</div>
		  		</div>
				<p class="line"></p>
		  		<div class="uploadBox">
		  			<div class="box" :style="{backgroundImage:'url('+holdPic+')'}">
			  			<i v-show="holdPic == ''">
			  				<section class="guide_item">
					        	<svg class="icon_style">
					                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#add'" fill="#cccccc"></use>
					          	</svg>
					          	<span>手持证件照</span>
					      	 </section>
			  			</i>
       					<form ref="uploadForm" id="uploadForm" method="post" enctype="multipart/form-data" class="formInput1">
							<input type="text" id="token" ref="token" v-model="token" name="token" style="visibility: hidden;"/>
							<input type="file" id="file" name="file" accept="image/*" @change="chooseImg($event)" v-if="isIphone"/>
							<input type="file" id="file" name="file" runat="server" capture="camera" accept="image/*" @change="chooseImg($event,'holdPic')" v-if="!isIphone"/>
						</form>
		  			</div>
		  		</div>
				<p class="line"></p>
				<div class="tips">
					<p>就跑过去了胜利大街按实际的批评我却阿速达德里克哄小孩ICV领自己开心粗口红是配偶千万；剧烈的骄傲排水阀的；大家都在发阿萨德请问水电费她要水电费不成敬意看艺术团人员</p>
					<div class="btnBar">
						<md-button class="button button-positive button-block" @click.native="nextOrBack()">
							上一步
						</md-button>
						<md-button class="button button-positive button-block" @click.native="commitForm()">
							提交审核
						</md-button>
					</div>
				</div>
	  		</div>
	  		<div v-show="third">
	  			<img src="../../../../static/common/checkBg.png" class="stateImg"/>
	  			<p class="stateWord">审核状态</p>
	  			<div class="stateTip">
	  				<h4>提交成功，请等待管理员审核</h4>
	  			</div>
	  		</div>
		</div>
	</div>
</template>

<script>
	import svgs from './components/svgs.vue'
	export default{
		name:'storeCenter',
		components:{
			svgs
		},
		data(){
			return{
				token:'',
				isIphone:'',//判断是否为iPhone手机 区别显示input
		      	first:true,
		      	second:false,
		      	third:false,
		  		storeIntro:'',//店铺简介
		      	storeName:'',//店铺名
		      	trueName:'',//真实名字
		      	idCard:'',//身份证
		      	phone:'',//手机号
		      	storePic:'http://www.paipaiwang.com.cn/img/paipai_man.jpg',//店铺头像
		      	positivePic:'',//身份证正面
		      	otherSidePic:'',//身份证反面
		      	holdPic:'',//手持身份证
		  		file:'',
				uploadType:'',//区分上传图片表单类型
				isEdit:this.$route.query.edit
			}
		},
		watch:{
			file(val){//监听图片选择 选择完成提交上传
				this.upload()
			}
		},
		methods:{
			back(){
				this.$router.go(-1)
			},
			upload(){//上传图片
				let form = new FormData()
				form.append('token',this.token)
				form.append('file[0]',this.file[0])
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
	    			console.log(res.data)
	    			if(res.data.code == "200"){
	    				switch (that.uploadType){
	    					case 'storePic':
	    						that.storePic = res.data.data[0].src
	    						break;
	    					case 'idPositiveSide':
	    						that.positivePic = res.data.data[0].src
	    						break;
	    					case 'idOtherSide':
	    						that.otherSidePic = res.data.data[0].src
	    						break;
	    					case 'holdPic':
	    						that.holdPic = res.data.data[0].src
	    						break;
	    					default:
	    						break;
	    				}
	    				$toast.show('上传成功！', 1000)
	    			}
	    		})
			},
			chooseImg(i,type){
				this.file = i.target.files
				this.uploadType = type
			},
			nextOrBack(){
				this.first = !this.first
				this.second = !this.second
			},
			commitForm(){//提交申请
				if(this.storeName==''){
					$toast.show('请填写店铺名字！', 1000)
					return
				}else if(this.storeIntro==''){
					$toast.show('请填写店铺简介！', 1000)
					return
				}else if(this.trueName==''){
					$toast.show('请填写真实姓名！', 1000)
					return
				}else if(this.idCard==''){
					$toast.show('请填写身份证号！', 1000)
					return
				}else if(!this.isPoneAvailable(this.phone) || this.phone==''){
					$toast.show('请输入正确手机号码！', 1000)
					return
				}else if(this.positivePic==''){
					$toast.show('请上传身份证正面照！', 1000)
					return
				}else if(this.otherSidePic==''){
					$toast.show('请上传身份证反面照！', 1000)
					return
				}else if(this.holdPic==''){
					$toast.show('请上传手持身份证照！', 1000)
					return
				}
				let that = this
				that.$axios({
	    			method:'post',
	    			url:that.GLOBAL.develop_url+'api/business_apply',
	    			data:{
	    				token:that.token,
	    				logo:that.storePic,//店铺logo
	    				shop_name:that.storeName,//店铺名
	    				introduce:that.storeIntro,//店铺简介
	    				realname:that.trueName,//真实姓名
	    				idcard:that.idCard,//身份证号
	    				mobile:that.phone,//手机号
	    				face_photo:that.positivePic,//身份证正面
	    				con_photo:that.otherSidePic,//身份证反面
	    				hold_photo:that.holdPic,//手持身份证
	    				type:1//个人
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
	    			if(res.data.code == "200"){
	    				$toast.show("申请成功！",1000)
	    				that.back()
	    			}else if(res.data.code == "400"){
	    				$toast.show(res.data.msg,1000)
	    			}
	    		})
			},
			changeInfo(){
				let that = this
				that.$axios({
	    			method:'post',
	    			url:that.GLOBAL.develop_url+'api/edit_business_info',
	    			data:{
	    				token:that.token,
	    				logo:that.storePic,//店铺logo
	    				name:that.storeName,//店铺名
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
	    			if(res.data.code == "200"){
	    				$toast.show("修改成功！",1000)
	    				that.back()
	    			}else if(res.data.code == "404"){
	    				$toast.show(res.data.msg,1000).then(()=>{
							that.$router.push('/login')
						})
	    			}else{
						$toast.show(res.data.msg,1000)
					}
	    		})
			}
		},
		created(){
			this.isIphone = this.thisIsIphone
			this.token = localStorage.getItem('token')
			if(this.$route.query.edit){
				this.storePic = this.$route.query.storePic
				this.storeName = this.$route.query.storeName
			}
		}
	}
</script>

<style scoped lang="less">
.page-content {
  	padding-top: 44px;
	color: #323232;
  	font-size: .23rem;
	.list-ios{
		font-size: .24rem;
		padding-left: 0 !important;
		padding-right: 0 !important;
		margin-bottom: 0 !important;
		.section{
			.item{
				.contentBox{
					width: calc(100% - 30px);
					display: flex;
					display: -webkit-flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
				}
			}
			.item1{
				position: relative;
				.formInput{
					width: 100%;
					height: 100%;
					position: absolute;
					top: 0;
					left: 0;
					opacity: 0;
					input{
						padding: 0 !important;
						position: absolute;
						width: 100%;
						height: 100%;
						opacity: 0;
					}
				}
				/*&:after{
					content: '';
					display: block;
					width: calc(100% - 16px);
					height: 1px;
					background-color: #e5e5e5;
					position: absolute;
					bottom: 1px;
					right: 0;
					z-index: 1000;
				}*/
				.userImg{
					display: block;
					width: .65rem;
					height: .65rem;
					border-radius: 50%;
				}
			}
		}
	}
	.mt30{
		margin-top: .3rem;
	}
	
	.btnBar{
		width: 6rem;
		margin: 0 auto;
	}
	.second{
		background-color: #fff;
		padding-bottom: .2rem;
		p{
			text-align: center;
			margin: .5rem 0 .25rem !important;
			color: #323232;
			font-size: .28rem;
		}
		.uploadBox{
			width: 100%;
			margin-bottom: .45rem;
			.box{
				width: 4.2rem;
				height: 2.5rem;
				margin: 0 auto;
				display: flex;
				display: -webkit-flex;
				align-items: center;
				justify-content: center;
				border: 1px solid #cccccc;
				border-radius: 10px;
				position: relative;
				background-size: cover;
				background-position: top left;
				background-repeat: no-repeat;
				.formInput1{
					width: 100%;
					height: 100%;
					position: absolute;
					top: 0;
					left: 0;
					opacity: 0;
					input{
						padding: 0 !important;
						position: absolute;
						width: 100%;
						height: 100%;
						opacity: 0;
					}
				}
				i{
					.guide_item{
						display: flex;
						display: -webkit-flex;
						align-items: center;
						justify-content: center;
						flex-direction: column;
						color: #b5b5b5;
						.icon_style{
							display: inline-block;
							width: .8rem;
							height: .8rem;
						}
					}
				}
			}
		}
		.line{
			height: .15rem;
			background-color: #F2F2F2;
		}
		.tips{
			p{
				margin: 0 0 !important;
				font-size: .28rem;
				color: #b5b5b5;
				padding: 0 .2rem;
				text-align: left !important;
			}
		}
	}
	.stateImg{
		display: block;
		width: 100%;
	}
	.stateWord{
		position: absolute;
		left: 0;
		top: 1.4rem;
		z-index: 1;
		text-align: center;
		color: #fff;
		font-size: .4rem;
		width: 100%;
	}
	.stateTip{
		background-color: #fff;
		height: 4rem;
		padding-top: .3rem;
		h4{
			color: #666666;
			font-size: .36rem;
			width: 100%;
			text-align: center;
			margin: 0 auto;
		}
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