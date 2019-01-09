<template>
	<div>
		<template  v-for="(li,index) in list">
		<list class="list">
			<item>
				<div @click="goInfo(li.id)">
				   	<div class="headBox">
						<div :style="{backgroundImage:'url('+li.head+')'}" class="img"></div>
				   		<div class="headInfo">
				   			<p>{{ li.nickname }}</p>
				   			<span>{{ li.c_time }}</span>
				   		</div>
				   	</div>
				   	<div class="contentBox">
			   			<h5 style="text-align: left;height: .5rem;line-height: .5rem;font-size: .26rem;" v-html="li.title">
			   			</h5>
				   	</div>
				   	<div class="flexImgBox">
  						<template v-for="photo in li.photo">	
  							<div :style="{backgroundImage:'url('+photo.img+')'}" :class="{bgImg:li.photo.length==1,bgImg2:li.photo.length==2 || li.photo.length==4,bgImg3:li.photo.length==3||li.photo.length>4}" ></div>
  						</template>
  					</div>
				</div>
			  
			   	<svgs style="display: none;"></svgs>
			   	
			   	<div class="bottomBox" :style="{width:bottomBarWidth}">
			   		<section class="guide_item">
			        	<svg class="icon_style" @click="collectThis(li.id,li.heart_status)">
			                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#collect'" v-if="li.heart_status==0"></use>
			                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#collected'" fill="#E87439" v-if="li.heart_status==1"></use>
			            </svg>
			            <span>{{ li.fabulous }}</span>
			        </section>
			   		<section class="guide_item">
			        	<svg class="icon_style" @click="goInfo(li.id)">
			                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#comment'"></use>
			            </svg>
			            <span>{{ li.comment_count}}</span>
			        </section>
			   		<section class="guide_item" @click="goInfo(li.id)">
			        	<svg class="icon_style">
			                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#share'"></use>
			            </svg>
			        </section>
			   	</div>
			</item>
		</list>
		</template>
		<share-model v-show="showShareModel" @hideShareModel="hideShareModel"></share-model>
	</div>
</template>

<script>
	import shareModel from '../../../components/common/shareModel.vue'
	import svgs from '../../../components/common/svgs.vue'
	export default {
		name:'circleList',
		props:['list','bottomBarWidth'],
		components:{
			svgs,
			shareModel
		},
		data(){
			return{
				token:'',
				showShareModel:false
			}
		},
		methods:{
			goInfo(id){
				this.$router.push({path:'/circle/circleInfo',query:{'id':id}})
			},
			share(){
				this.showShareModel = !this.showShareModel
			},
			collectThis(id,status){
				if(parseInt(status) == 1){
					$toast.show('您已经点过赞啦！(*^▽^*)', 1000) 
					return
				}
				let that = this
				that.$axios({
	    			method:'post',
	    			url:that.GLOBAL.develop_url+'api/mark_heart',
	    			data:{
	    				id:id,
	    				token:that.token,
	    				action:1
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
						$toast.show('点赞成功', 1000)
						that.list.forEach(i=>{
							if(i.id == id){
								i.heart_status = 1
								i.fabulous += 1
							}
						})
	    			}
	    		})
			},
			hideShareModel(){//隐藏分享弹窗
				this.showShareModel = false
			},
		},
		created(){
			this.token = localStorage.getItem('token')
		}
	}
</script>

<style scoped lang="less">
	.list{
		margin-bottom: .15rem !important;
		.item{
			padding: .4rem .2rem;
			.headBox{
				display: flex;
				display: -webkit-flex;
				flex: 1;
				align-items: center;
				
					height: .76rem;
				.img{
					display: block;
					width: .6rem;
					height: .6rem;
					border-radius: 50%;
	  				background-size: cover;
	  				background-repeat: no-repeat;
	  				background-position: center center;
				}
				.headInfo{
					height: 100%;
					margin-left: .2rem;
					display: flex;
					display: -webkit-flex;
					flex: 1;
					flex-direction: column;
					justify-content: center;
					p{
						font-size: .28rem;
						line-height: .28rem;
						margin-bottom: 0 !important;
						color: #000;
					}
					span{
						font-size: .22rem;
						margin-top: .09rem;
						color: #a7a7a7;
					}
				}
			}
			.contentBox{
	  			width:  calc(100% - 1.4rem);
	  			margin: 0 auto;
	  			margin-left: .8rem;
			}
			.flexImgBox{
	  			display: flex;
	  			display: -webkit-flex;
	  			flex-direction: row;
	  			width:  calc(100% - 1.4rem);
	  			margin: 0 auto;
	  			margin-left: .8rem;
	  			flex-wrap: wrap;
	  			justify-content: flex-start;
	  			align-items: center;
	  			.bgImg{
	  				width: 80%;
	  				height: 3rem;
	  				background-size: cover;
	  				background-repeat: no-repeat;
	  				background-position: center center;
	  			}
	  			.bgImg2{
	  				width: 45%;
	  				height: 2rem;
	  				background-size: cover;
	  				background-repeat: no-repeat;
	  				background-position: center center;
	  				&:nth-child(2){
	  					margin-left: 5%;
	  				}
	  				&:nth-child(3){
	  					margin-top: .2rem;
	  				}
	  				&:nth-child(4){
	  					margin-left: 5%;
	  					margin-top: .2rem;
	  				}
	  			}
	  			.bgImg3{
	  				width: 30%;
	  				margin-left: 3%;
	  				padding-top: 30%;
	  				margin-top: .2rem;
	  				background-size: cover;
	  				background-repeat: no-repeat;
	  				background-position: center center;
	  				&:first-child{
	  					margin-left: 0%;
	  				}
	  				&:nth-child(1){
	  					margin-top: 0;
	  				}
	  				&:nth-child(2){
	  					margin-top: 0;
	  				}
	  				&:nth-child(3){
	  					margin-top: 0;
	  				}
	  				&:nth-child(4){
	  					margin-left: 0%;
	  				}
	  				&:nth-child(7){
	  					margin-left: 0%;
	  				}
	  			}
	  		}
			.bottomBox{
				height: .5rem;
				margin: .2rem auto 0;
				display: flex;
				display: -webkit-flex;
				flex: 1;
				justify-content: flex-end;
				.guide_item{
					display: flex;
					display: -webkit-flex;
					padding-right: 0.53rem;
					align-items: center;
					font-size:.24rem;
					&:last-child{
						padding-right: 0;
					}
					.icon_style{
						display: inline-block;
						width: .34rem;
						height: .31rem;
						margin-right: .075rem;
					}
				}
			}
		}
	}
</style>