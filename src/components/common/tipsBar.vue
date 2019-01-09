<template>
	<div :style="{marginTop:tipMarginTop}">
		<h3 class="tips">{{title}}</h3>
		<p>{{tips}}</p>
	</div>
</template>

<script>
	export default{
		name:'tipsBar',
		props:['title','tips','tipMarginTop']
	}
</script>

<style lang="less" scoped>
	div{
		font-size: .26rem;
		color: #323232;
		text-align: center;
		h3{
			display: inline-block;
			width: auto;
			font-size: .26rem;
			margin:0 0 !important; 
			position:relative ;
			&:before{
				content: '';
				height: 1px;
				width: .29rem;
				color: #323232;
				background-color: #323232;
				position: absolute;
				top: 50%;
				left: -50%;
				transform: translateY(-50%);
				-webkit-transform: translateY(-50%);
			}
			&:after{
				content: '';
				height: 1px;
				width: .29rem;
				color: #323232;
				background-color: #323232;
				position: absolute;
				top: 50%;
				right: -50%;
				transform: translateY(-50%);
				-webkit-transform: translateY(-50%);
			}
		}
	}
</style>