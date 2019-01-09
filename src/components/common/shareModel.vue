<template>
   	<transition name="fade" enter-active-class="animated fadeInUp faster">
		<div class="model" ref="model" :style="{height:Height,top:Top}">
			<div class="modelBg" @click="hide"></div>
			<div class="shareModel">
				<div v-for="(s,index) in share" :key="index" @click="">
					<img :src="s.src"/>
					<span>{{s.text}}</span>
				</div>
			</div>
		</div> 
	</transition>
</template>

<script>
	export default{
		name:"shareModel",
		props:{
			Height:{
				type:String,
				default:"calc(100% - 44px)"
			},
			Top:{
				type:String,
				default:"44px"
			}
		},
		data(){
			return{
				share:[
					{
						src:'static/common/qqIcon.png',
						text:'QQ'
					},
					{
						src:'static/common/wechatIcon.png',
						text:'微信'
					},
					{
						src:'static/common/weboIcon.png',
						text:'微博'
					},
					{
						src:'static/common/wechatCollectIcon.png',
						text:'微信收藏'
					},
					{
						src:'static/common/copyIcon.png',
						text:'复制链接'
					}
				]
			}
		},
		methods:{
			hide(){
				this.$emit('hideShareModel')
			}
		}
	}
</script>

<style scoped lang="less">
.model{
	position: fixed;
	left: 0;
	width: 100%;
	
	z-index: 998;
	.modelBg{
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 999;
		background-color: rgba(0,0,0,0.5);
	}
	.shareModel{
		z-index: 1000;
		width: 100%;
		background-color: #fff;
		position: fixed;
		bottom: 0;
		left: 0;	
		padding: .25rem;
		display: flex;
		display: -webkit-flex;
		flex-wrap: wrap;
		div{
			margin-top: .15rem;
			display: flex;
			display: -webkit-flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			width: 25%;
			font-size: .24rem;
			img{
				display: block;
				width: .56rem;
				margin-bottom: .1rem;
			}
		}
	}
}
</style>