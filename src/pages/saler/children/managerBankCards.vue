<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">管理银行卡</span>
			</von-header>
			<card-list :bankCardsLists="bankCardsLists" url='/mine/salerCenter/managerBankCards'></card-list>
			<list class="list-ios item-icon-right mt2">
				<item @click.native="to('/mine/salerCenter/addBankCard')">
				    <section class="alicenter"  >
				  		添加银行卡
       				</section>
       				<i class="icon ion-ios-arrow-right"></i>
				</item>
			</list>
  		</div>
  	</div>
</template>

<script>
	import cardList from '../components/cardList.vue'
	export default{
		name:'salerBalance',
		components:{
			cardList
		},
		data(){
			return{
				bankCardsLists:[]
			}
		},
		methods:{
			back(){
				this.$router.go(-1)
			},
			to(arg){
				this.$router.push(arg)
			},
			getBankCards(){ //获取银行卡列表
				if(localStorage.getItem('token')==null || localStorage.getItem('mid')==null){this.$router.push('/login')}
				let that = this
				that.$axios({
					method:'post',
					url:that.GLOBAL.develop_url+'api/business_bank_list',
					data:{
						token:localStorage.getItem('token')
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
					switch (res.data.code){
						case "200":	
							that.bankCardsLists = res.data.data
							that.bankCardsLists.forEach((item)=>{
								console.log('>>>>>>>>>>>>>>',item.bankcard.substring(item.bankcard.length-4))
								item.cardLast4 = item.bankcard.substring(item.bankcard.length-4)
							})
							break;
						case "400":
							$toast.show('获取信息失败，请重新登录！', 1000).then(() => {
								that.$router.push('/login')
							})
						default:
							break;
					}
				})
			}
		},
		created(){
			this.getBankCards()	
		}
	}
</script>

<style lang="less" scoped>
.page-content {
  	padding-top: 44px;
}
.item-icon-right{
	padding-right: 0 !important;
}
.mt2{
	margin-top: .2rem;
}
.ion-ios-arrow-right{
	color: #1c1c1c;position: absolute;right: .16rem;top: 50%;transform: translateY(-50%);-webkit-transform: translateY(-50%);height: auto;
}
.icon{
	font-size: .35rem !important;
}
.default{
	color: #E87439;
}
</style>