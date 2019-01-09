<template>
	<div>
		<input type="search" :placeholder="placeholder" value="" class="searchInput" :width="searchWidth" :style="{backgroundColor:backgroundColor,padding:searchPadding}"/>
	</div>
</template>

<script>
	export default{
		name:'searchBar',
		props:['placeholder','searchWidth','backgroundColor','searchPadding'],
		data(){
			return{
				searching:true,
				keywords:'1'
			}
		},
		methods:{
			onSearch(keywords){
				this.searching = true
			},
			onCancel(){
				this.searching = false;
        		this.keywords = ''
			}
		}
	}
</script>

<style scoped lang="less">
.searchInput{
	box-sizing: border-box;
	border-radius: 50px;
	width: 81.333%;
	margin: 0 auto;
	height: .67rem;
	font-size: .26rem;
	background:  url(/static/common/searchIcon.png) no-repeat .32rem center;
	background-size: .36rem .36rem;
}
</style>