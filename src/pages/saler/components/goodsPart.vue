<template>
	<router-link class="box" :to="{path:'/mine/salerCenter/addNewGoods',query:{auction_id:data.id}}">
		<svgs style="display: none;"></svgs>
		<div class="headerBox">
			<section class="guide_item" v-if="data.status==0 || data.status==1">
	        	<svg class="icon_style">
	                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#delete'"></use>
	          </svg>
	        </section>
			<span class="default" v-else="data.status==0 || data.status==1">{{data.status}}</span>
		</div>
		<div class="contentBox">
			<!-- <img :src="data.thumbs[0].path" class="goodImg"/> -->
			<div :style="{backgroundImage:'url('+data.thumbs[0].path+')'}" class="goodImg" v-if="data.thumbs"></div>
			<div class="goodBox">
				<p class="goodName">{{data.title}}</p>
				<p>起拍价：￥{{data.start_price}}</p>
				<p>加价幅度：￥{{data.per_price}}</p>
			</div>
		</div>
		<div class="bottomBox" >
			<!--待付款-->
			<md-button class="button button-light btn" v-if="tabIndex == 0" @click.native="offlineGoods">下架</md-button>
			<md-button class="button button-light btn" v-if="tabIndex == 1||tabIndex == 2"  @click.native="reStart">上架</md-button>
		</div>
	</router-link>
</template>

<script>
	import svgs from '../../mine/components/svgs.vue'
	export default{
		name:'orderPart',
		props:['data','tabIndex'],
		components:{
			svgs
		},
		data(){
			return{
				isDone:false,
				token:localStorage.getItem('token'),
				goodsInfo:{}
			}
		},
		created(){
			console.log(this.data);
		},
		methods:{
			toEvaluate(){
				console.log(this.$router.push('/mine/myOrders/evaluateOrder'))
			},
			reStart(){
				this.$router.push({
					path:'/mine/salerCenter/addNewGoods',
					query:{auction_id:this.data.id}
				})
			},
			offlineGoods(){
				let that = this
				that.$axios({
					method:'POST',
					url:that.GLOBAL.develop_url+'api/offline_goods',
					data:{
						token:that.token,
						auction_id:that.auction_id,
					},
	    			transformRequest:[function(data){
	    				let ret = ''
	    				for(let it in data){
	    					ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
	    				}
	    				return ret
	    			}],
					xhrFields:{
		    			withCredentials:true
	    			},
		    		crossDomain:true,
		    		headers: { //解决跨域
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				}).then(function(res){
					console.log(res.data)
					if(res.data.code==200){
							$toast.show(res.data.msg, 1000)
					}else if(res.data.code == 404){
						$toast.show(res.data.code, 1000).then(() => {
							that.$router.push('/login')
						})
					}else{
						$toast.show(res.data.msg, 1000)
					}
							
				}).catch(function(err){
					//$toast.show('网络错误', 2000).then(() => {})
				})
			}
		}
	}
</script>

<style scoped lang="less">
.box{
	display: block;
	background-color: #fff;
	font-size: .22rem;
	position: relative;
	overflow: hidden;
	.headerBox{
		padding: .2rem .2rem 0;
		display: flex;
		display: -webkit-flex;
		align-items:center;
		justify-content: space-between;
		.orderStatus{
			font-size: .24rem;
		}
		.userBox{
			display: flex;
			display: -webkit-flex;
			align-items:center;
			.userImg{
				display: block;
				width: .51rem;
				height: .51rem;
				border-radius: 50%;
				margin-right: .15rem;
			}
		}
		.guide_item{
			display: flex;
			display: -webkit-flex;
			align-items: center;
			font-size:.24rem;
			margin-right: .2rem;
			.icon_style{
				display: inline-block;
				width: .34rem;
				height: .33rem;
				margin: 0.05rem 0;
				margin-right: .0275rem;
			}
		}
	}
	.contentBox{
		padding: .2rem;
		display: flex;
		display: -webkit-flex;
		align-items:center;
		border-bottom: 1px solid #e5e5e5;
		.goodImg{
			display: block;
			width: 1.33rem;
			height: 1.33rem;
			margin-right: .15rem !important;
			background-size: cover;
			background-repeat: no-repeat;
			background-position: center center;
		}
		.goodBox{
			display: flex;
			display: -webkit-flex;
			flex-direction: column;
			justify-content: space-around;
			.goodName{
				width:4rem;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}
	}
	.bottomBox{
		padding: .15rem;
		display: flex;
		display: -webkit-flex;
		justify-content: flex-end;
		align-items: center;
		.btn{
			display: inline-block;
			padding: 0rem .2rem !important;
			border-radius: 5px;
			border:1px solid #E87439;
			height: .55rem !important;
			line-height: .55rem !important;
			font-size: .24rem;
			min-height: 0 !important;
			color: #E87439 !important;
			margin-right: .15rem;
		}
		.done{
			color: #848483 !important;
			border-color: #848483 !important;
		}
	}
}
.default{
	color: #E87439;
}
</style>