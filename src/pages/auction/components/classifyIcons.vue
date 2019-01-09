<template>
	<div>
		<div class="iconBox">
			<router-link :to="{name:'classify',params:{type:id.id}}" class="container" v-for="(id,index) in ids" :key="index">
				<div :style="{backgroundImage:'url('+id.thumb+')'}" class="wrapper"></div>
	            <p>
	            	{{id.catname}}
	            </p>
			</router-link>
		</div>
	</div>
</template>

<script>
	export default{
		name:'classifyIcons',
		data(){
			return{
//				ids:[
//					{id:'#sports',type:'户外运动',index:1},
//					{id:'#lipstick',type:'美妆个护',index:2},
//					{id:'#phone',type:'手机专区',index:3},
//					{id:'#computer',type:'电脑数码',index:4},
//					{id:'#currency',type:'虚拟币值',index:5},
//					{id:'#extravagant',type:'奢侈专区',index:6},
//					{id:'#snacks',type:'零食小吃',index:8},
//					{id:'#others',type:'其他特色',index:0}
//				]
				ids:[]
			}
		},
		methods:{
			getCategory(){//获取所有类型 分类页的图标是有icon的 图片存后台服务器 只有8个是配套图的 供后期活动用 可动态更改图片
				let that = this
	    		this.$axios({
		    		method:'get',
		    		url:that.GLOBAL.develop_url+'api/cate',
		    		xhrFields:{
		    			withCredentials:true
	    			},
		    		crossDomain:true,
		    		headers: { //解决跨域
						'Content-Type': 'application/x-www-form-urlencoded'
					}
		    	}).then(function(res){
		    		console.log(res.data)
		    		that.ids = []
		    		res.data.data.filter(item=>{
		    			if(item.thumb!=''){
		    				that.ids.push(item)
		    			}
		    		})
		    	})
			}
		},
		created(){
			this.getCategory()	
		}
	}
</script>

<style lang="less" scoped>
.iconBox{
	display: flex;
	display: -webkit-flex;
	flex-wrap: wrap;
	flex-direction: row;
	.container{
		width: 25%;
		display: flex;
		display: -webkit-flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		margin-top: .2rem;
		.wrapper{
			width: .76rem;
			height: .87rem;
			margin-bottom: .2rem;
			background-size: cover;
			background-repeat: no-repeat;
			background-position: center center;
		}
	}
}
</style>