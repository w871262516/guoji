<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">企业认证</span>
			</von-header>
	  		<svgs style="display: none;"></svgs>
	  		<div v-show="first">
		  		<list class="list-ios item-icon-right mt30">
					<div class="section" @click="chooseImg">
						<item class="item1">
							<div class="contentBox">
								<span>店铺头像</span>
								<img class="userImg" :src="storePic" />
							</div>
	       					<i class="icon ion-ios-arrow-right"></i>
	       					<form ref="uploadForm" id="uploadForm" method="post" enctype="multipart/form-data" class="formInput">
								<input type="text" id="token" ref="token" v-model="token" name="token" style="visibility: hidden;"/>
								<input type="file" id="file" name="file" accept="image/*" @change="chooseImg($event)" v-if="isIphone"/>
								<input type="file" id="file" name="file" runat="server" accept="image/*" @change="chooseImg($event,'storePic')" v-if="!isIphone"/>
								<!-- <input type="file" id="file" name="file" runat="server" capture="camera" accept="image/*" @change="chooseImg($event,'storePic')" v-if="!isIphone"/> -->
							</form>
						</item>
	   				</div>
				</list>
				<von-input type="text" v-model="storeName" placeholder="请输入店铺名称" label="店铺名称"> </von-input>
	  			<von-input type="text" v-model="storeIntro" placeholder="请输入店铺简介" label="店铺简介"> </von-input>
				<div class="btnBar">
					<md-button class="button button-positive button-block" @click.native="whitch('two')">
						下一步
					</md-button>
				</div>
	  		</div>
	  		<div v-show="second" class="second">
	  			<von-input type="text" v-model="trueName" placeholder="请输入真实姓名" label="真实姓名"> </von-input>
	  			<von-input type="text" v-model="idCard" placeholder="请输入身份证号" label="身份证号"> </von-input>
	  			<von-input type="text" v-model="phone" placeholder="请输入手机号码" label="联系方式"> </von-input>
		  		<p>身份证正面</p>
		  		<div class="uploadBox">
		  			<div class="box" :style="{backgroundImage:'url('+idPositiveSidePic+')'}">
			  			<i v-show="idPositiveSidePic == ''">
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
							<input type="file" id="file" name="file" runat="server" capture="camera" accept="image/*" @change="chooseImg($event,'idPositiveSidePic')" v-if="!isIphone"/>
						</form>
		  			</div>
		  		</div>
		  		<p>身份证反面</p>
		  		<div class="uploadBox">
		  			<div class="box" :style="{backgroundImage:'url('+idOtherSidePic+')'}">
			  			<i v-show="idOtherSidePic == ''">
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
							<input type="file" id="file" name="file" runat="server" capture="camera" accept="image/*" @change="chooseImg($event,'idOtherSidePic')" v-if="!isIphone"/>
						</form>
		  			</div>
		  		</div>
				<p class="line"></p>
		  		<div class="uploadBox">
		  			<p>手持证件照</p>
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
				
				<div class="btnBar">
					<div class="btnBar">
						<md-button class="button button-positive button-block" @click.native="whitch('one')">
							上一步
						</md-button>
						<md-button class="button button-positive button-block" @click.native="whitch('three')">
							下一步
						</md-button>
					</div>
				</div>
	  		</div>
	  		
	  		<div v-show="third" class="second">
	  			<von-input type="text" v-model="companyName" placeholder="请输入企业名称" label="企业名称"> </von-input>
	  			<von-input type="text" v-model="legalName" placeholder="请输入法人姓名" label="法人姓名"> </von-input>
	  			<von-input type="text" v-model="legalIdCard" placeholder="请输入身份证号" label="身份证号"> </von-input>
	  			<von-input type="text" v-model="legalPhone" placeholder="请输入法人手机号" label="联系电话"> </von-input>
		  		<p>营业执照副本照片</p>
		  		<div class="uploadBox">
		  			<div class="box" :style="{backgroundImage:'url('+licensePic+')'}">
			  			<i v-show="licensePic == ''">
			  				<section class="guide_item">
					        	<svg class="icon_style">
					                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#add'" fill="#cccccc"></use>
					          	</svg>
					          	<span>营业执照副本正面</span>
					      	 </section>
			  			</i>
       					<form ref="uploadForm" id="uploadForm" method="post" enctype="multipart/form-data" class="formInput1">
							<input type="text" id="token" ref="token" v-model="token" name="token" style="visibility: hidden;"/>
							<input type="file" id="file" name="file" accept="image/*" @change="chooseImg($event)" v-if="isIphone"/>
							<input type="file" id="file" name="file" runat="server" capture="camera" accept="image/*" @change="chooseImg($event,'licensePic')" v-if="!isIphone"/>
						</form>
		  			</div>
		  		</div>
		  		
		  		<div class="uploadBox">
		  			<p>法人身份证正面照</p>
		  			<div class="box" :style="{backgroundImage:'url('+legalPositiveSidePic+')'}">
			  			<i v-show="legalPositiveSidePic == ''">
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
							<input type="file" id="file" name="file" runat="server" capture="camera" accept="image/*" @change="chooseImg($event,'legalPositiveSidePic')" v-if="!isIphone"/>
						</form>
		  			</div>
		  		</div>
		  		<div class="uploadBox">
		  			<p>法人身份证反面照</p>
		  			<div class="box" :style="{backgroundImage:'url('+legalOtherSidePic+')'}">
			  			<i v-show="legalOtherSidePic == ''">
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
							<input type="file" id="file" name="file" runat="server" capture="camera" accept="image/*" @change="chooseImg($event,'legalOtherSidePic')" v-if="!isIphone"/>
						</form>
		  			</div>
		  		</div>
		  		
		  		<div class="uploadBox mt30">
		  			<p>税务许可证</p>
		  			<div class="box" :style="{backgroundImage:'url('+taxPic+')'}">
			  			<i v-show="taxPic == ''">
			  				<section class="guide_item">
					        	<svg class="icon_style">
					                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#add'" fill="#cccccc"></use>
					          	</svg>
					          	<span>证件正面</span>
					      	 </section>
			  			</i>
       					<form ref="uploadForm" id="uploadForm" method="post" enctype="multipart/form-data" class="formInput1">
							<input type="text" id="token" ref="token" v-model="token" name="token" style="visibility: hidden;"/>
							<input type="file" id="file" name="file" accept="image/*" @change="chooseImg($event)" v-if="isIphone"/>
							<input type="file" id="file" name="file" runat="server" capture="camera" accept="image/*" @change="chooseImg($event,'taxPic')" v-if="!isIphone"/>
						</form>
		  			</div>
		  		</div>
				<p class="line"></p>
				
				<!--<div class="btnBar">
					<div class="btnBar">
						<md-button class="button button-positive button-block" @click.native="whitch('two')">
							上一步
						</md-button>
						<md-button class="button button-positive button-block" @click.native="whitch('four')">
							下一步
						</md-button>
					</div>
				</div>-->
				<div class="tips">
					<p>就跑过去了胜利大街按实际的批评我却阿速达德里克哄小孩ICV领自己开心粗口红是配偶千万；剧烈的骄傲排水阀的；大家都在发阿萨德请问水电费她要水电费不成敬意看艺术团人员</p>
					<div class="btnBar">
						<md-button class="button button-positive button-block" @click.native="whitch('two')">
							上一步
						</md-button>
						<md-button class="button button-positive button-block" @click.native="commitForm">
							提交审核
						</md-button>
					</div>
				</div>
				
	  		</div>
	  		<div v-show="four">
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
				isIphone:'',
				token:'',
				uploadType:'',//上传类型
		  		storeDistrict:'未设置',
		      	first:true,
		      	second:false,
		      	third:false,
		      	four:false,
		      	trueName:'',//个人姓名
		      	phone:'',//个人联系方式
		  		idCard:'',//个人身份证
		  		storeName:'',//店名
		  		storeIntro:'',//店铺简介
		  		storePic:'http://www.paipaiwang.com.cn/img/paipai_man.jpg',//店铺头像
		  		idPositiveSidePic:'',//身份证正面
		  		idOtherSidePic:'',//身份证反面
		  		holdPic:'',//手持身份证
		  		companyName:'',//企业名
		  		legalName:'',//法人名字
		  		legalIdCard:'',//法人身份证
		  		legalPhone:'',//法人手机号
		  		licensePic:'',//营业执照
		  		legalPositiveSidePic:'',//法人身份证正面
		  		legalOtherSidePic:'',//法人身份证反面
		  		taxPic:'',//税务证明
		        file:''
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
			goSaler(){
				this.$router.push('/mine/salerCenter')
			},
			whitch(arg){
				switch (arg){
					case 'one':
						this.first = true
						this.second = false
						this.third = false
						this.four = false
						break;
					case 'two':
						this.first = false
						this.second = true
						this.third = false
						this.four = false
						break;
					case 'three':
						this.first = false
						this.second = false
						this.third = true
						this.four = false
						break;
					case 'four':
						this.first = false
						this.second = false
						this.third = false
						this.four = true
						break;
					default:
						break;
				}
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
	    					case 'idPositiveSidePic':
	    						that.idPositiveSidePic = res.data.data[0].src
	    						break;
	    					case 'idOtherSidePic':
	    						that.idOtherSidePic = res.data.data[0].src
	    						break;
	    					case 'holdPic':
	    						that.holdPic = res.data.data[0].src
	    						break;
	    					case 'licensePic':
	    						that.licensePic = res.data.data[0].src
	    						break;
	    					case 'legalPositiveSidePic':
	    						that.legalPositiveSidePic = res.data.data[0].src
	    						break;
	    					case 'legalOtherSidePic':
	    						that.legalOtherSidePic = res.data.data[0].src
	    						break;
	    					case 'taxPic':
	    						that.taxPic = res.data.data[0].src
	    						break;
	    				}
	    				$toast.show('上传成功！', 1000)
	    			}
	    		})
			},
			chooseImg(i,type){//选择照片
				this.file = i.target.files
				this.uploadType = type
			},
			commitForm(){//提交申请
				if(this.storeName==''){
    				$toast.show("请填写店铺名",1000)
    				return
				}else if(this.storeIntro==''){
    				$toast.show("请填写店铺简介",1000)
    				return
				}else if(this.trueName == ''){
    				$toast.show("请填写真实姓名",1000)
    				return
				}else if(this.idCard==''){
    				$toast.show("请填写身份证号",1000)
    				return
				}else if(this.phone==''){
    				$toast.show("请填写手机号码",1000)
    				return
				}else if(this.idPositiveSidePic==''){
    				$toast.show("请上传身份证正面照",1000)
    				return
				}else if(this.idOtherSidePic==''){
    				$toast.show("请上传身份证反面照",1000)
    				return
				}else if(this.holdPic==''){
    				$toast.show("请上传手持身份证照片",1000)
    				return
				}else if(this.companyName==''){
    				$toast.show("请填写企业名字",1000)
    				return
				}else if(this.legalName==''){
    				$toast.show("请填写法人姓名",1000)
    				return
				}else if(this.legalIdCard==''){
    				$toast.show("请填写法人身份证号",1000)
    				return
				}else if(this.legalPhone==''){
    				$toast.show("请填写法人手机号码",1000)
    				return
				}else if(this.licensePic==''){
    				$toast.show("请上传营业执照",1000)
    				return
				}else if(this.legalPositiveSidePic==''){
    				$toast.show("请上传法人身份证正面照",1000)
    				return
				}else if(this.legalOtherSidePic==''){
    				$toast.show("请上传法人身份证反面照",1000)
    				return
				}else if(this.taxPic==''){
    				$toast.show("请上传税务证件照",1000)
    				return
				}
				let that = this
				that.$axios({
	    			method:'post',
	    			url:that.GLOBAL.develop_url+'api/business_apply',
	    			data:{
	    				token:that.token,
	    				realname:that.trueName,//个人姓名
	    				idcard:that.idCard,//个人身份证号
	    				mobile:that.phone,//个人电话
	    				logo:that.storePic,//店铺头像
	    				shop_name:that.storeName,//店铺名
	    				introduce:that.storeIntro,//店铺简介
	    				face_photo:that.idPositiveSidePic,//身份证正面
	    				con_photo:that.idOtherSidePic,//身份证反面
	    				hold_photo:that.holdPic,//手持身份证
	    				company:that.companyName,//公司名
	    				company_username:that.legalName,//法人名字
	    				company_user_id:that.legalIdCard,//法人身份证号
	    				company_tel:that.legalPhone,//法人电话
	    				license_image:that.licensePic,//营业执照
	    				company_user_id_face:that.legalPositiveSidePic,//法人身份证正面
	    				company_user_id_back:that.legalOtherSidePic,//法人身份证反面
	    				tax_image:that.taxPic,//税务证件照
	    				type:2 //企业入驻
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
	    				that.whitch('four')
	    				//that.back()
	    			}else if(res.data.code == "400"){
	    				$toast.show(res.data.msg,1000)
	    			}
	    		})
			}
		},
		created(){
			this.isIphone = this.thisIsIphone
			this.token = localStorage.getItem('token')
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
		margin-bottom:0 !important;
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
				
				.userImg{
					display: block;
					width: .65rem;
					height: .65rem;
					border-radius: 50%;
				}
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