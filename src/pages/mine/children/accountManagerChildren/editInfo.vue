<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">修改资料</span>
			</von-header>
			<list class="list-ios item-icon-right">
				<div class="section">
					<item class="item">
						<div class="contentBox">
							<span>头像</span>
							<div :style="{backgroundImage:'url('+editInfo.photo+')'}" class="userImg"></div>
						</div>
       					<i class="icon ion-ios-arrow-right"></i>
       					<form ref="uploadForm" id="uploadForm" method="post" enctype="multipart/form-data" class="formInput">
							<input type="text" id="token" ref="token" v-model="token" name="token" style="visibility: hidden;"/>
							<input type="file" id="file" name="file" accept="image/*" @change="chooseImg($event)" v-if="isIphone"/>
							<input type="file" id="file" name="file" runat="server" accept="image/*" @change="chooseImg($event)" v-if="!isIphone"/>
							<!-- <input type="file" id="file" name="file" runat="server" capture="camera" accept="image/*" @change="chooseImg($event)" v-if="!isIphone"/> -->
						</form>
					</item>
   				</div>
			</list>
	  		<!--<list class="list list-ios item-icon-right">
				<div class="section">
					<item class="item1">
						<div class="contentBox">
							<span>头像</span>
							<div :style="{backgroundImage:'url('+editInfo.photo+')'}" class="userImg"></div>
						</div>
       					<i class="icon ion-ios-arrow-right"></i>
       					<form ref="uploadForm" id="uploadForm" method="post" enctype="multipart/form-data" class="formInput">
							<input type="text" id="token" ref="token" v-model="token" name="token" style="visibility: hidden;"/>
							<input type="file" id="file" name="file" accept="image/*" @change="chooseImg($event)" v-if="isIphone"/>
							<input type="file" id="file" name="file" runat="server" capture="camera" accept="image/*" @change="chooseImg($event)" v-if="!isIphone"/>
						</form>
					</item>
   				</div>
   			</list>-->
			<von-input type="text" v-model="newInfo.realname" placeholder="未设置" label="姓名" ref="input" align="right"> </von-input>
  			<von-input type="text" v-model="newInfo.nickname" placeholder="未设置" label="昵称" align="right"> </von-input>
   				<!--<router-link :to="{path:'/mine/accountManager/editInfo/setUserName',params:{'realname':editInfo.realname}}"  class="section">
					<item class="item1">
						<div class="contentBox">
							<span>姓名</span>
							<span v-if="newInfo.realname">{{newInfo.realname}}</span>
							<span v-else>
								<i v-show="editInfo.realname">{{editInfo.realname}}</i>
								<i v-show="!editInfo.realname">未设置</i>
							</span>
						</div>
	       				<i class="icon ion-ios-arrow-right"></i>
					</item>
   				</router-link>-->
   			
	  		<list class="list-ios item-icon-right">	
   				<!--<router-link :to="{path:'/mine/accountManager/editInfo/setNickName',params:{'nickname':editInfo.nickname}}" class="section">
					<item class="item1">
						<div class="contentBox">
							<span>昵称</span>
							<span v-if="newInfo.nickname">{{newInfo.nickname}}</span>
							<span v-else>
								<i v-show="editInfo.nickname">{{editInfo.nickname}}</i>
								<i v-show="!editInfo.nickname">未设置</i>
							</span>
						</div>
	       				<i class="icon ion-ios-arrow-right"></i>
					</item>
   				</router-link>-->
   				<router-link :to="{path:'/mine/accountManager/editInfo/resetPhone',params:{'mobile':editInfo.mobile}}" class="section">
					<item class="item1">
						<div class="contentBox">
							<span>手机</span>
							<span v-show="editInfo.mobile">{{editInfo.mobile}}</span>
							<span v-show="!editInfo.mobile">未设置</span>
						</div>
	       				<i class="icon ion-ios-arrow-right"></i>
					</item>
   				</router-link>
				<von-input type="text" v-model="newInfo.email" placeholder="未设置" label="邮箱" align="right"> </von-input>
   				<!-- <router-link :to="{name:'setEmail',params:{'email':editInfo.email}}" class="section">
					<item class="item">
						<div class="contentBox">
							<span>邮箱</span>
							<span v-if="newInfo.email">{{newInfo.email}}</span>
							<span v-else>
								<i v-show="editInfo.email">{{editInfo.email}}</i>
								<i v-show="!editInfo.email" style="color: #aeadac;">未设置</i>
							</span>
						</div>
	       				<i class="icon ion-ios-arrow-right"></i>
					</item>
   				</router-link> -->
			</list>
			
			<div class="btnBar">
				<md-button class="button button-positive button-block" @click.native="clickedSave()">
					保&nbsp;&nbsp;存
				</md-button>
			</div>
			<!-- <form ref="uploadForm" id="uploadForm" method="post" enctype="multipart/form-data" style="visibility: hidden;">
				<input type="text" id="token" ref="token" v-model="token" name="token" style="visibility: hidden;"/>
				<input type="file" id="file" name="file" accept="image/png,image/gif,image/jpeg" @change="chooseImg($event)" style="visibility: hidden;"/>
			</form> -->
		
		</div>
	</div>
</template>

<script>
	export default{
		name:'editInfo',
		data(){
			return{
				isIphone:'',
				editInfo:{
					photo:'',
					realname:'',
					nickname:localStorage.getItem('nickName')||'',
					mobile:'',
					email:''
				},
				file:[],
				token:''
			}
		},
		watch:{
			file(val){
				this.upload()
			}
		},
		computed:{
			newInfo(){
				return this.$store.state.userInfo.editInfo //用户编辑的新信息
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
	    			console.log(res.data.data)
	    			if(res.data.code == "200"){
	    				that.editInfo.photo = res.data.data[0].src
	    				$toast.show('上传成功！', 1000)
	    			}
	    		})
			},
			chooseImg(i){
				this.file = i.target.files
			},
			clickedSave(){//点击保存
				let that = this
				if(that.editInfo.realname == '' || that.editInfo.realname ==null){
					$toast.show('请设置姓名', 1000)
					return
				}
				if(that.editInfo.nickname == '' || that.editInfo.nickname ==null){
					$toast.show('请设置昵称', 1000)
					return
				}
				if(!that.ismail(that.editInfo.email)){
					$toast.show('邮箱格式错误！', 1000)
					return
				}
				that.$axios({
	    			method:'post',
	    			url:that.GLOBAL.develop_url+'api/hompage/personshowedit',
	    			data:{
	    				token:that.token,
	    				photo:that.$store.state.userInfo.editInfo.photo,
	    				realname:that.editInfo.realname,
	    				nickname:that.editInfo.nickname,
	    				mobile:that.editInfo.mobile,
	    				email:that.editInfo.email
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
					$toast.show(res.data.msg, 1000)
	    			if(res.data.code == 200){
	    			}
	    		})
			},
			getEditInfo(){//获取用户信息
				let that = this
				that.$axios({
					method:'get',
					url:that.GLOBAL.develop_url+'api/hompage/personshow',
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
							res.data.data.photo = res.data.data.photo
							that.$store.commit('setEditInfo',res.data.data) //把个人信息保存本地
							that.editInfo = res.data.data
							break;
						case 400:
							$toast.show('获取个人信息失败，请重新登录！', 1000).then(() => {
								that.$router.push('/login')
							})
							break;
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
			this.isIphone = this.thisIsIphone
			this.token = localStorage.getItem('token')
				//this.$refs.token. = this.token
			this.getEditInfo() //页面进来获取个人信息
			console.log(this.$refs.input)
		}
	}
</script>

<style scoped lang="less">
.page-content {
  	padding-top: 44px;
  	padding-bottom: 1rem;
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
				.userImg{
					display: block;
					width: .65rem;
					height: .65rem;
					border-radius: 50%;
	  				background-size: cover;
	  				background-repeat: no-repeat;
	  				background-position: center center;
				}
			}
			.item1{
				position: relative;
				&:after{
					content: '';
					display: block;
					width: 100%;
					height: 1px;
					background-color: #e5e5e5;
					position: absolute;
					bottom: 1px;
					right: 0;
					z-index: 1000;
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