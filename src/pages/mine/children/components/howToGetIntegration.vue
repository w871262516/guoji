<template>
	<div>
		<list class="list-ios item-icon-right">
			<item  v-for="(list,index) in lists">
				<section>
					<div class="flexBox">
   				 		<p>{{list.p}}</p>
   				 		<span class="default">{{list.span}}</span>
					</div>
					<span class="default">+{{list.add}}</span>
   				</section>
			</item>
		</list>
	</div>
</template>

<script>
	export default{
		name:'howToGetIntegration',
		data(){
			return{
				lists:[
					// {
					// 	p:'订单',
					// 	span:'如一元商品对应1积分',
					// 	add:'1'
					// },
					{
						p:'点赞',
						span:'上限20分，点赞一次1分',
						add:'1'
					},
					{
						p:'发帖',
						span:'上限5分，发帖一次1分',
						add:'1'
					},
					{
						p:'帖子被评论',
						span:'上限20分，被评论一次1分',
						add:'1'
					},
					{
						p:'帖子被赞',
						span:'上限20分，被赞一次1分',
						add:'1'
					},
					{
						p:'每日签到',
						span:'每日签到赚1积分',
						add:'1'
					},
					// {
					// 	p:'分享微信/微博',
					// 	span:'上限300分',
					// 	add:'1'
					// },
					// {
					// 	p:'邀请商家入驻',
					// 	span:'邀请商家入驻',
					// 	add:'1'
					// },
					// {
					// 	p:'邀请好友下载拍拍国际 app',
					// 	span:'邀请好友下载拍拍国际 app',
					// 	add:'1'
					// }
					
				]
			}
		}
	}
</script>

<style lang="less"scoped>
.list-ios{
	padding-right:0 !important;
	section{
		display: flex;
		display: -webkit-flex;
		justify-content: space-between;
		align-items: center;
		.flexBox{
			background-color:#fff;
			display: flex;
			display: -webkit-flex;
			flex-direction: column;
			p{
				height: .26rem;
				line-height: .26rem;
				font-size: .26rem;
				margin-bottom: .13rem !important;
			}
			span{
				font-size: .16rem !important;
			}
		}
	}
 }
 
.default{
	color: #E87439 !important;
}
</style>