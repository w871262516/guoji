<template>
	<div class="content">
        <!--有兑换记录-->
        <div v-for="item in historyList">
            <div class="exchangeDiv" v-if="hasHistory">
                <div class="stateBar">
                    <span class="time">{{item.create_time}}</span>
                    <span class="state">兑换成功</span>
                </div>
                <div class="exchangeInfo">
                    <div class="exchangeGoodInfo">
                        <div :style="{backgroundImage:'url('+ item.goods_img+')'}" class="exchangeImg"></div>
                        <p class="exchangeName">{{item.goods_name}}</p>
                    </div>
                    <section class="guide_item">
                        <svg class="icon_style">
                            <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#integration'" fill="#E87439"></use>
                        </svg>
                        <span>{{item.integral}}</span>
                    </section>
                </div>
                <div class="exchangeBox">
                    <div class="up">
                        <span>共 1 件 总计：</span>
                        <section class="guide_item">
                            <svg class="icon_style">
                                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#integration'" fill="#E87439"></use>
                            </svg>
                            <span>{{item.integral}}</span>
                        </section>
                    </div>
                    <div class="down">
                        <router-link :to="{path:'/mine/myIntegrations/exchangeDetail',query:{exchangeId:item.id}}" class="btn">查看详情</router-link>
                    </div>

                </div>
            </div>
            <div class="none" v-else>
                暂无兑换记录
            </div>
        </div>
	</div>
</template>

<script>
	import svgs from '../../../components/svgs.vue'
	export default{
		name:'exchange',
		components:{
			svgs
        },
        props:['historyList','hasHistory'],
	}
</script>

<style scoped lang="less">
.content {
  	.none{
  		position: absolute;
  		height: calc(100% - 44px);
  		width: 100%;
  		display: flex;
  		display: -webkit-flex;
  		justify-content: center;
  		align-items: center;
  		background-color: #fff;
  	}
  	.exchangeDiv{
  		width: 100%;
  		display: flex;
  		display: -webkit-flex;
  		flex-direction: column;
  		background-color: #fff;
  		padding: .2rem;
  		margin-top: .2rem;
		font-size: .2rem;
  		.stateBar{
	  		display: flex;
	  		display: -webkit-flex;
	  		width: 100%;
	  		justify-content: space-between;
  			.time{
  				color: #323232;
  			}
  			.state{
  				color: #E87439;
  			}
  		}
  		.exchangeInfo{
  			padding: .2rem 0 .2rem .2rem;
  			border-top: 1px solid #dcdcdc;
  			border-bottom: 1px solid #dcdcdc;
		  	margin: .2rem 0;
	  		display: flex;
	  		display: -webkit-flex;
	  		justify-content: space-between;
	  		align-items: center;
	  		.exchangeGoodInfo{
		  		display: flex;
		  		display: -webkit-flex;
		  		justify-content: flex-start;
		  		align-items: center;
		  		.exchangeImg{
		  			display: block;
		  			width: 1.25rem;
		  			height: 1.25rem;
					  margin-right: .25rem;
					  background-position: center center;
					  background-repeat: no-repeat;
					  background-size: cover;
		  		}
		  		.exchangeName{
		  			font-size: .24rem;
		  		}
	  		}
  		}
  		.exchangeBox{
	  		display: flex;
	  		display: -webkit-flex;
	  		flex-direction: column;
	  		.up{
		  		display: flex;
		  		display: -webkit-flex;
		  		justify-content: flex-end;
		  		margin-bottom: .2rem;
	  		}
	  		.down{
		  		display: flex;
		  		display: -webkit-flex;
		  		justify-content: flex-end;
		  		.btn{
		  			display: inline-block;
		  			padding: .1rem .25rem;
		  			border: 1px solid #E87439;
		  			border-radius: 20px;
		  			color: #E87439 !important;
		  		}
	  		}
  		}
  	}
}
.guide_item{
	display: flex;
	display: -webkit-flex;
	align-items: center;
	.icon_style{
		display: inline-block;
		width: .2rem;
		height: .2rem;
		margin-right: .075rem;
	}
}
</style>