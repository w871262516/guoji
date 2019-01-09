<template>
	<div>
		<list class="list-ios item-icon-right">
			<item class="myItem">
				<div :style="{backgroundImage:'url('+rankingList.per_info.photo+')'}" class="img"></div>
				<div class="itemInfo">
					<p>{{ rankingList.per_info.nickname }}</p>
					<p>总积分：<span class="default">{{ rankingList.per_info.total_score }}</span></p>
				</div>
				<p class="default myRanking">
					我的排名<br />
					{{ rankingList.per_info.key }}
				</p>
			</item>
		</list>
		<list class="list-ios item-icon-right mt30" v-if="rankingList.all_info.length>0">
			<item class="myItem" v-for="(other,index) in rankingList.all_info">
				<i>
					<span v-if="other.key==1" class="ranking ranking1"></span>
					<span v-if="other.key==2" class="ranking ranking2"></span>
					<span v-if="other.key==3" class="ranking ranking3"></span>
					<span v-if="other.key>3" class="ranking">{{other.key}}</span>
				</i>
				<div :style="{backgroundImage:'url('+other.photo+')'}" class="img"></div>
				<div>
					<p>{{ other.nickname }}</p>
					<p>总积分：<span class="default">{{ other.total_score }}</span></p>
				</div>
			</item>
		</list>
		<h5 v-else>暂无数据</h5>
	</div>
</template>

<script>
	export default{
		name:'ranking',
		props:['rankingList']
	}
</script>

<style lang="less"	scoped>
.list-ios{
  		padding-right:0 !important;
	  	.myItem{
	  		display: flex;
	  		display: -webkit-flex;
	  		justify-content: flex-start;
	  		align-items: center;
	  		position:relative;
	  		.img{
	  			display: block;
	  			width: .95rem;
	  			height: .95rem;
	  			border-radius: 50%;
	  			margin-right: .25rem;
  				background-size: cover;
  				background-repeat: no-repeat;
  				background-position: center center;
	  		}
	  		.itemInfo{
	  			p{
	  				height:.26rem;
	  				line-height:.26rem;
	  				&:first-child{
	  					font-size: .26rem;
	  					margin-bottom: .1rem !important;
	  				}
	  				&:last-child{
	  					font-size: .18rem ;
	  					span{
	  						font-size: .22rem !important;
	  					}
	  				}
	  			}
	  		}
	  		.myRanking{
	  			text-align: center;
	  			line-height: 1.5;
	  			font-size: .2rem;
	  			position: absolute;
	  			right: .2rem;
	  			top: 50%;
	  			transform: translateY(-50%);
	  			-webkit-transform: translateY(-50%);
	  		}
	  		i{
	  			display: inline-block;
	  			width: .31rem;
	  			height: .38rem;
	  			line-height: .38rem;
	  			margin-right: .15rem;
	  			.ranking{
		  			display: inline-block;
		  			width: .31rem;
		  			height: .38rem;
		  			text-align: center;
	  			}
	  			.ranking1{
	  				background: url(../../../../../static/common/ranking1.png) no-repeat center left;
	  				background-size: cover;
	  			}
	  			.ranking2{
	  				background: url(../../../../../static/common/ranking2.png) no-repeat center left;
	  				background-size: cover;
	  			}
	  			.ranking3{
	  				background: url(../../../../../static/common/ranking3.png) no-repeat center left;
	  				background-size: cover;
	  			}
	  		}
	  	}
  	}
.mt30{
	margin-top: .3rem;
}

h5{
	height: 1rem;
	width: 100%;
	line-height: 1rem;
	text-align: center;
	color: #323232;
}
.default{
	color: #E87439;
}
</style>