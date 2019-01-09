<template>
	<div class="saveMoney" v-if="data" :style="{right:right}">
		<span class="default">节省了{{data*100}}%</span>
	</div>
</template>

<script>
	export default{
		name:'saveMoney',
		props:['data','right']
	}
</script>

<style scoped lang="less">
.saveMoney{
	position: absolute;
	right: 1rem;
	top: -.135rem;
	height: 1.2rem;
	width: 1.2rem;
	background: url(../../../static/common/save.png) no-repeat top left;
	background-size: cover;
	transform: rotate(-35deg);
	-webkit-transform: rotate(-35deg);
	span{
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		-webkit-transform: translateY(-50%);
		display: inline-block;
		font-size: .15rem;
		width: 1.21rem;
		text-align: center;
		background-color: #fff;
		
	}
	.default{
		color: #E87439 !important;
	}
}
</style>