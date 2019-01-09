<template>
	<div id="rules">
		<p>
			必拍场拍卖规则：<br />
			(1)拍币来源：购买商家券，到商城兑换拍币。<br />
			(2) 商品竞拍初始价以起始价为准，每出一次出价会消耗一定数量的拍币（网络服务费），同时商品价格以加价幅度值递增。<br />
			(3) 在初始倒计时内即可出价，初始倒计时后进入竞拍倒计时，当您出价后，该件商品的计时器将被自动重置到趣买倒计时，以便其他用户进行出价竞拍。当达到保底价之后，如果没有其他用户对该件商品出价，计时器归零时，您便成功获得得了该商品购买权。<br />
			(4) 若竞拍成功，请在3天内以成交价购买商品，超过3天未下单，视为放弃，不返积分。<br />
			(5) 若竞拍失败，可返还所消耗竞拍倍率的积分（赠币除外），积分可以在商城换购商品。<br />
			<br />
			汇拍场拍卖规则：<br />
			(1)拍币来源：购买商家券，到商城兑换拍币。<br />
			(2) 活动开始30秒之前参与报名（报名需支付一定数量的商家券），当报名人数达到设定人数时，等待活动开始；若人数未到达指定人数，则活动不成立，返还所有已经报名者的报名费。<br />
			(3) 商品竞拍初始价以起始价为准，每出一次出价会消耗一定数量的拍币（网络服务费），同时商品价格以加价幅度值递增。<br />
			(4) 在初始倒计时内即可出价，初始倒计时后进入竞拍倒计时，当您出价后，该件商品的计时器将被自动重置到趣买倒计时，以便其他用户进行出价竞拍。趣买倒计时结束后，如果没有其他用户对该件商品出价，计时器归零时，您便成功获得得了该商品购买权。<br />
			(5) 若竞拍成功，返还所消耗的拍币或赠币，且请在3天内以成交价购买商品，并支付一定金额的平台服务费；未支付者，将被列入平台黑名单，限制参与本平台一切活动！<br />
			(6) 若竞拍失败，返还本场所消耗的所有拍币或赠币，报名费不退。<br />
			<br />
			申明：平台严禁违规操作，如若发现，将追究法律责任，最终解释权归拍拍国际所有。<br />
			<br />
		</p>
	</div>
</template>

<script>
	export default{
		name:'integrationRules',
		created(){
			this.getAgreement();
		},
		methods:{
			getAgreement(){
				let that = this
				that.$axios({
					method:'get',
					url:that.GLOBAL.develop_url+'api/agreement',
					params:{
						type:'score'
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
					if(res.data.code == "200"){
						document.getElementById('rules').innerHTML = res.data.data
					}else{
						$toast.show(res.data.msg, 1000)
					}
				})
			}
		}
	}
</script>

<style scoped lang="less">
#rules{
	background-color: #fff;
	padding: .25rem;
}
</style>