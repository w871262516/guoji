<template>
	<div>
		<div class="page">
		  	<div class="page-content">
				<div class="wrap">
					<svgsm style="display: none;"></svgsm>
					<svgs style="display: none;"></svgs>
					<!--第一步-->
					<p style="font-size: .4rem;tab-size:center;">完善个人信息</p>
					<div>
			  			<section class="section">
					        <input type="text" v-model.trim="phone" @blur="checkPhone" placeholder="请输入手机号"/>
			  			</section>
			  			<section class="section">
					        <input type="text" v-model.trim="code" placeholder="请输入验证码"/>
					        <span class="checkCode" @click="countDown" v-show="timeOver==true">
					        	<i>获取验证码</i>
					        </span>
					        <span class="checkCode" v-show="timeOver==false">
					        	<i>{{time}}s</i>
					        </span>
			  			</section>
			  			<section class="section">
					        <input :type="psdType" v-model.trim="psd" placeholder="请设置6-20位密码"/>
					        <section class="guide_item" @click="showOrHidePsd">
						        	<svg class="icon_style">
						                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#eyesWhite'" fill="#ffffff"></use>
						        	</svg>
						    </section>
			  			</section>
			  			<div class="nouse">
				  			<section class="guide_item mt90">
					        	<svg class="icon_style rorate"  @click="nextStep">
					                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#toRightFullWhite'" fill="#ffffff"></use>
					        	</svg>
					        </section>
			  			</div>
					</div>
				</div>
				<!--输入密码弹窗-->
				<div class="model" v-show="boardShow">
					<div class="modelBg"></div>
					<div class="wrap1">
						<p>请输入支付密码</p>
						<div class="inputBox" ref='inputBox'>
							<div v-for="i in inputBox">
								<span>{{i}}</span>
							</div>
						</div>
						<div class="inputBoard">
							<div class="board"  v-for="i in board" @click="inputPsd(i)">{{i}}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>	
</template>

<script>
	import svgsm from '../../components/common/svgs.vue'
	import svgs from '../mine/children/components/svgs.vue'
	export default{
		name:'perfectInfo',
		components:{
			svgs,svgsm
		},
		data(){
			return{
				psdType:'password',//密码输入框类型
				avilabelPhone:false,//手机是否可用
				phone:'',//手机号
				code:'',//验证码
				psd:'',//密码
				time:10,//倒计时
				ti:null,//定时器
				timeOver:true,//倒计时结束
				fill:"#ffffff",//icon颜色
				boardShow:false,
				inputBox:['','','','','',''],
				board:[1,2,3,4,5,6,7,8,9,'取消',0,'delete'],
				myPsd:[],
				payPsd:'',
				token:''
			}
		},
		watch:{
			myPsd(val){ //支付密码检测
				let len = val.length-1
				for(let j=0;j<6;j++){
					if(j<=len){
						this.inputBox[j] = '*'
						this.$refs.inputBox.childNodes[j].childNodes[0].innerHTML = '*'
					}else{
						this.inputBox[j] = ''
						this.$refs.inputBox.childNodes[j].childNodes[0].innerHTML = ''
					}
				}
				if(this.myPsd.length == 6){
					this.payPsd = this.myPsd.join("")
					this.boardShow = !this.boardShow
					this.perfectMyInfo()
				}
			}
		},
		methods:{
			to(arg){
				this.$router.push(arg)
			},
			perfectMyInfo(){
				let that = this
				that.$axios({
	    			method:'post',
	    			url:that.GLOBAL.develop_url+'api/hompage/supply',
	    			data:{
	    				mobile:that.phone,
						password:that.psd,
						pay_password:that.payPsd
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
	    			$loading.hide()
	    			if(res.data.code == 200){
						localStorage.setItem("token",res.data.data.token)
						that.$store.state.userInfo.token = res.data.data.token
						that.token = res.data.data.token
						that.getMid();
						// this.$router.push('/')
	    			}else{
						$toast.show(res.data.msg, 1000)
	    			}
	    		}).catch(function(err){
	    			$toast.show('网络错误', 1000)
	    		})
			},
			getMid(){//登录成功 获取用户mid
				let that = this
				that.$axios({
	    			method:'post',
	    			url:that.GLOBAL.develop_url+'api/info',
	    			data:{
	    				token:that.token
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
	    			if(res.data.code == 200){
						localStorage.setItem("mid",res.data.data.mid)
						$toast.show('登录成功！', 1000).then(() => {
							that.$router.push('/index')
	    					})
	    			}else{
						$toast.show(res.data.msg, 1000)
					}
	    		}).catch(function(err){
	    			$toast.show('网络错误', 1000)
	    		})
			},
			toggleBoard(){
				
				this.boardShow = !this.boardShow
				console.log("this.boardShow",this.boardShow);
			},
			inputPsd(i){//弹窗密码面板
			
				// if(this.myPsd.length == 6){
				// 	return
				// }
				if(i !="取消" && i != "delete"){
					this.myPsd.push(i)
				}else if(i == "delete"){
					this.myPsd.pop()
					this.inputBox.pop()
				}else if(i=="取消"){
					this.myPsd =[]
					this.toggleBoard()	
				}
			},
			nextStep(){
				if(!this.avilabelPhone){
					$toast.show('请输入正确手机号', 1000).then(() => {})
					return
				}
				
				if(this.avilabelPhone && (this.psd != '' || this.psd.length > 6)){
					this.toggleBoard()
				}
			},
			showOrHidePsd(){//切换显示密码
				if(this.psdType == "password") {
					this.psdType = "text";
				}else{
					this.psdType = "password"
				}
			},
			checkPhone(){//验证手机号
				if(!this.isPoneAvailable(this.phone)){
					$toast.show('请输入正确手机号', 1000)
					this.avilabelPhone = false
					return
				}else{
					this.avilabelPhone = true
				}
			},
			countDown(){//倒计时
				if(this.avilabelPhone==false){
					$toast.show('请输入正确手机号', 1000)
					return
				}
				if(this.timeOver == false){return} //倒计时没结束 停止操作
				this.getCode()
				let that = this
				that.ti = setInterval(function(){
					if(that.time <= 60 ){
						that.timeOver = false
						that.time-- 
					}
					if(that.time <= 0 ){
						clearInterval(that.ti)
						that.timeOver = true
						that.time=60
					}
				},1000)
			},
			getCode(){//获取验证码
				if(this.avilabelPhone==false){
					$toast.show('请输入正确手机号', 1000)
					return
				}
				let that = this
				that.$axios({
	    			method:'post',
	    			url:that.GLOBAL.develop_url+'api/send_sms',
	    			data:{
	    				phone:that.phone,
	    				send_type:'1001'
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
	    			if(res.data.code == "400"){
						$toast.show('该手机号已注册', 1000)
						clearInterval(that.ti)
	    			}
	    			if(res.data.code == '200'){
	    				$toast.show('验证码已发送！', 1000)
	    			}
	    		})
			},
		},
		created(){
			
		}
	}
</script>

<style lang="less" scoped>
.page-content {
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	height: 100%;
	width: 100%;
	background: url(/static/common/wechatlogin.png) no-repeat top left;
	background-size: cover;
	color: #fff !important;
	overflow: hidden;
	.wrap{
		height: 100%;
		width: 100%;
		background-color: rgba(0,0,0,0.74);
		display: flex;
		display: -webkit-flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		overflow: hidden;
		.section{
				margin-top: .25rem;
				width: 6rem;
				height: 1rem;
				position: relative;
				input{
					color: #fff !important;
					width: 100%;
					height: 100%;
					font-size: .3rem;
					background-color: rgba(0,0,0,0,0);
					border-top: 0px none;
					border-right: 0px none;
					border-left: 0px none;
					border-bottom: 1px solid #7c7b7b;
					border-radius: 0;
				}
				.guide_item{
					display: flex;
					display: -webkit-flex;
					align-items: center;
					position: absolute;
					right: .1rem;
					top: 50%;
					transform: translateY(-50%);
					-webkit-transform: translateY(-50%);
					.icon_style{
						display: inline-block;
						width: .55rem;
						height: .4rem;
						
					}
				}
			}
		.nouse{
			width: 100%;
			display: flex;
			display: -webkit-flex;
			align-items: center;
			justify-content: center;
			.guide_item{
				.icon_style{
					display: inline-block;
					margin: 0 auto;
					width: .75rem;
					height: .75rem;
				}
				.rorate{
					transform: rotate(90deg);
				}
			}
		}	
	}
	.model{
		position: fixed;
		height:68%;
		width: 100%;
		bottom: 0;
		left: 0;
		z-index: 10;
		.modelBg{
			width: 100%;
			height:100%;
			position: absolute;
			bottom: 0;
			left: 0;
			background-color: #F2F2F2;
			border-top: 1px solid #D9D9D9;;
		}
		.wrap1{
			height:100%;
			width: 100%;
			position: absolute;
			bottom: 0;
			left: 0;;
			z-index: 10;
				color: #000;
			p{
				font-size: .26rem;
				text-align: center;
				margin-top: .25rem !important;
			}
			.inputBox{
				width: calc(4.8rem + 1px);
				margin: .25rem auto;
				display: flex;
				display: -webkit-flex;
				justify-content: center;
				align-items: center;
				flex-direction: row;
				border-right: 1px solid #D9D9D9;
				span{
					display: flex;
					display: -webkit-flex;
					justify-content: center;
					align-items: center;
					width: 0.8rem;
					height: 0.8rem;
					font-size: .26rem;
					line-height: .8rem;
					background-color: #fff;
					border-top: 1px solid #D9D9D9;
					border-left: 1px solid #D9D9D9;
					border-bottom: 1px solid #D9D9D9;
				}
			}
			.inputBoard{
				display: flex;
				display: -webkit-flex;
				flex-direction: row;
				flex-wrap: wrap;
				width: 100%;
				height: calc(100% - 2rem);
				position: absolute;
				bottom: 0;
				left: 0;
				.board{
					height: 25%;
					width: 33.333%;
					display: flex;
					display: -webkit-flex;
					justify-content: center;
					align-items: center;
					background-color: #fff;
					border: 1px solid #D9D9D9;
					border-right-color: transparent;
					border-bottom-color: transparent;
					&:nth-child(10){
						background-color: #F2F2F2;
					}
					&:nth-child(12){
						background-color: #F2F2F2;
					}
				}
			}
		}
	}
}

.checkCode{
	color: #fff !important;
	display: inline-block;
	width: 1.8rem;
	height:.6rem;
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
	right: 0;
	background-color: #888888;
	z-index: 9;
	border-radius: 50px;
}
.mt90{
	margin-top: .9rem;
}
</style>