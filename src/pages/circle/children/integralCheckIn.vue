<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">积分签到</span>
			</von-header>
			
			<svgs style="display: none;"></svgs>
			
			<!--签到模块-->
			<div class="checkInHead">
				<div class="checkBox">
					<span class="thisWeek">本周已签到</span>
					<span class="thisDay"><i>{{thisWeek}}</i>天</span>
				</div>
				<p>我的积分:{{integral_count}}</p>  <!--后台尚未返回-->
				<div class="checkInBar">
					<section class="guide_item" v-for="(list,index) in bar">
			        	<svg class="icon_style">
			                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#forgotCheck'" v-show="list.status==0" fill="#7a7a7a"></use>
			                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#rightEmpty'" v-show="list.status==1 && index != today" fill="#E87439"></use>
			                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#rightFull'" v-show="list.status==1 && index==today" fill="#E87439"></use>
			            </svg>
			            <span>{{list.week}}</span>
			        </section>
				</div>
				<a class="btn" @click="checkInToday" v-if="status_today==0">签到</a>
			</div>
			
			<div class="rulesDiv">
				<p>
				1)活动期间，若发现用户参与活动过程中存在可疑异常行为或通过非正常方式参与活动（包括但不限于恶意套现，机器作弊等），和彩云将有权取消该用户活动获奖资格。<br />
			    2)活动期间，每个获奖手机号码仅对应一个身份证号及配送地址，若不同中奖号码使用同一身份证号或同一配送地址，则视为同一中奖客户，按“价值就高”匹配获得一份奖品。<br />
			    3)活动期间，手机号出现停机、换号、注销等情况，导致无法成功领取话费或流量礼包，则视为客户主动放弃，不再进行补赠。<br />
			    4)以下情况不能获赠活动流量：限定客户、无限量套餐客户、GPRS无限量套餐客户、4G随心王套餐客户、多号通的副号、一卡双号副号、家庭服务计划副号、万能副卡等虚拟号码客户、内部员工号码、集团代付/对公托收（如政企动力100行业卡）客户、集团全额统付号码、万花筒客户、手机状态异常（停机、销户、欠费、转品牌未生效等状态）号码；另有部分省份可能存在非实名制客户、M-Free卡客户、无线通、随E行、移动总机、固话、商话、公话、快捷通和金卡快捷通及CMWAP20元封顶套餐用户无法享受流量赠送。
				</p>
			</div>
			
			<div class="checkInTips" v-show="showCheckBox">
				<img src="../../../../static/common/integral.png" class="tipsImg" />
				<p>积分+1</p>
			</div>
		</div>
	</div>
</template>

<script>
	import svgs from '../../goodInfor/components/svgs.vue'
	export default{
		name:'integralCheckIn',
		components:{
			svgs
		},
		data(){
			return{
				thisWeek:0,
				today:'',
				status_today:0,
				integral_count:0,
				checkResult:'',
				showCheckBox:false,//签到成功弹窗
				bar:[]//签到bar
			}
		},
		methods:{
			back(){
				this.$router.go(-1)
			},
			checkInToday(){//点击签到
				if(localStorage.getItem('token')==null || localStorage.getItem('mid')==null){this.$router.push('/login')}
				let that = this
				$loading.show('努力签到中...')
				that.$axios({
	    			method:'post',
	    			url:that.GLOBAL.develop_url+'api/hompage/signscore',
	    			data:{
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
					$loading.hide()
	    			switch (res.data.code){
	    				case "200":
							that.showCheckBox = true
			    			setTimeout(()=>{
								that.showCheckBox = false	
							},2000)
			    			that.checkIn()
	    					break;
	    				default:
	    					break;
	    			}
					if(res.data.code=="404"){
						$toast.show(res.data.msg, 1000).then(() => {
							that.$router.push('/login')
						})
					}
	    		})
			},
			checkIn(){//获取签到记录
				if(localStorage.getItem('token')==null || localStorage.getItem('mid')==null){this.$router.push('/login')}
				let that = this
				that.$axios({
	    			method:'post',
	    			url:that.GLOBAL.develop_url+'api/hompage/signshow',
	    			data:{
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
	    				case "200":
							that.bar = []
							that.integral_count = res.data.data.integral_count
	    					that.thisWeek = res.data.data.week_count
							that.checkResult = res.data.data.status_week
							that.status_today = res.data.data.status_today
							console.log(that.checkResult);
							
			    			for(let i=0;i<that.checkResult.length;i++){
			    				let a
			    				switch (i){
			    					case 0:
			    						a = {'status':that.checkResult[i],'week':'周一'}
			    						break;
			    					case 1:
			    						a = {'status':that.checkResult[i],'week':'周二'}
			    						break;
			    					case 2:
			    						a = {'status':that.checkResult[i],'week':'周三'}
			    						break;
			    					case 3:
			    						a = {'status':that.checkResult[i],'week':'周四'}
			    						break;
			    					case 4:
			    						a = {'status':that.checkResult[i],'week':'周五'}
			    						break;
			    					case 5:
			    						a = {'status':that.checkResult[i],'week':'周六'}
			    						break;
			    					case 6:
			    						a = {'status':that.checkResult[i],'week':'周日'}
			    						break;
			    				}
			    				
			    				that.bar.push(a)
							}
							console.log(that.bar);
							
	    					break;
	    				default:
	    					break;
	    			}
	    			that.loadFinish = true
	    		})
			}
		},
		created(){
			this.checkIn()
			this.today =  new Date().getDay()-1
		}
	}
</script>

<style scoped lang="less">
.page{
	.page-content{
		padding-top: 44px;
		.checkInHead{
			height: 6rem;
			width: 100%;
			background: url(../../../../static/common/checkInbg.png) no-repeat top left;
			background-size: 100% 3.85rem;
			background-color: #fff;
			display: flex;
			display: -webkit-flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-evenly;
			.checkBox{
				height: 2rem;
				width: 2rem;
				box-shadow: 0px 3px 7px 0px 
		rgba(249, 163, 119, 0.18);
				border-radius: 10px;
				span{
					display: inline-block;
					width: 100%;
					text-align: center;
					border-top-right-radius: 8px;
					border-top-left-radius: 8px;
				}
				.thisWeek{
					height: .85rem;
					line-height: .85rem;
					background-color: #E87439;
					color: #fff;
				}
				.thisDay{
					height: .99rem;
					line-height: .99rem;
					background-color: #fff;
					color: #E87439;
					i{
						font-size: .6rem;
					}
				}
			}
			p{
			}
			.checkInBar{
				width: 7rem;
				display: flex;
				display: -webkit-flex;
				flex-direction: row;
				align-items: center;
				justify-content: flex-start;
				.guide_item{
					width: 14.286%;
					display: flex;
					display: -webkit-flex;
					align-items: center;
					flex-direction: column;
					font-size:.24rem;
					position:relative;
					color:#7a7a7a; 
					&:after{
						content: '';
						display: block;
						height: 5px;
						width:calc(50% + .16rem);
						position: absolute;
						left: calc(50% + .17rem);
						top: .2rem;
						transform: translateY(-50%);
						background-color: #e7e7e7;
						z-index: 0;
					}
					&last-child:after{
						display: none !important;
					}
					.icon_style{
						display: inline-block;
						width: .4rem;
						height: .4rem;	
						z-index: 2;
						margin: 0 0 .2rem 0;
					}
					&:nth-last-child(1){
						&:after{
							display: none;
						}
					}
				}
			}
			.btn{
				display: inline-block;
				width: 1.66rem;
				height: .62rem;
				line-height: .62rem;
				border: 1px solid #E87439;
				color: #E87439 !important;
				background-color: #fff;
				border-radius: 25px; 
				text-align: center;
				font-size: .32rem;
			}
		}
		.rulesDiv{
			width: 100%;
			padding: .25rem;
			background-color: #fff;
			margin-top: .2rem;
			color: #7a7a7a;
			font-size: .24rem;
			line-height: .45rem;
			letter-spacing: .75px;
		}
		.checkInTips{
			width: 2.3rem;
			height: 1.95rem;
			display: flex;
			display: -webkit-flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			background-color: #1b1b1b;
			position: fixed;
			top: 50%;
			left: 50%;
			transform: translate(-50,-50%);
			-webkit-transform: translate(-50%,-50%);
			opacity: 0.825;
			border-radius: 5px;
			z-index: 1000;
			.tipsImg{
				display: block;
				width: .92rem;
				margin-bottom: .2rem;
			}
			p{
				color: #fff;
				font-size: .26rem;
			}
		}
	}
}
</style>