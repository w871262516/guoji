<template>
	<div class="page">
	  	<div class="page-content">
		  	<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">地址管理</span>
			  <button class="button button-icon headWord" slot="right" @click="goAddAddress">新增</button>
			</von-header>
		  	<list class="list-ios item-icon-right" v-if="myAllAddressList.length>0">
				<item v-for="(data,index) in myAllAddressList" :key="index">
					<router-link :to="{path:'/mine/addressManager/editAddress',query:{address:data}}" class="section">
						<div>
							<span>{{data.name}}</span>
							<span>{{data.mobile}}</span>
						</div>
						<p>
							<span class="default"  v-if="data.is_default==1">[默认]</span>
							{{data.area}}{{data.address}}
						</p>
       				</router-link>
       				<i class="icon ion-ios-arrow-right"></i>
				</item>
			</list>
			<div v-else class="blackList">
				<img src="../../../../static/saler/noAddress.png"/>
			</div>
			<h5 v-else>暂无数据</h5>
  		</div>
  	</div>
</template>

<script>
	export default{
		name:'addressManager',
		data(){
			return{
				myAllAddressList:[]
			}
		},
		methods:{
			back(){
				this.$router.go(-1)
			},
			goAddAddress(){
				this.$router.push('/mine/addressManager/addAddress')
			},
			getMyAllAddress(){
				let that = this
	    		that.$axios({
	    			method:'get',
	    			url:that.GLOBAL.develop_url+'api/hompage/addressshow',
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
							that.myAllAddressList = res.data.data
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
			this.getMyAllAddress()
		}
	}
</script>

<style lang="less" scoped>
.page-content {
  	padding-top: 44px;
  	padding-bottom: 1rem;
	color: #323232;
  	font-size: .23rem;
	.list-ios{
		font-size: .24rem;
		padding-right: 0 !important;
		.section{
			div{
				span{
					font-size: .28rem;
					margin-right: .15rem;
				}
			}
			p{
				font-size: .26rem;
				line-height: .26rem;
				margin-top: .15rem !important;
			}
		}
		.default{
			color: #E87439;
			letter-spacing: 1.5px;
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
.headWord{
	font-size: .26rem !important;color: #757373 !important;
}
.blackList{
	width: 100%;
	display: flex;
	display: -webkit-flex;
	justify-content: center;
	align-content: center;
	margin-top: .4rem;
	img{
		display: block;
		width: 2.64rem;
		height: 2.64rem;
		margin: 0 auto;
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