<template>
	<div class="page">
	  	<div class="page-content">
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">拒绝退款</span>
			</von-header>
	  		<div class="mt30">
		  		<textarea    v-model="content" :maxlength="maxLen" rows="10"
                  placeholder="请输入退款理由..."></textarea>
	  		</div>
                <section class="section">
                    <md-button class="button button-positive button-block" @click.native="refunse">
                        完成
                    </md-button>
                </section>
		</div>
	</div>
</template>

<script>
	export default{
		name:'refund',
		data(){
			return{
				content:'',
				maxLen:'120',   
			}
		},
		watch:{

        },
        created(){
            console.log(">>>>>>>>>>>>",this.$route.query.orderId);
            
        },
		methods:{
			back(){
				this.$router.go(-1)
			},
			refunse(){ //拒绝退款理由提交
				let that = this
				that.$axios({
					method:'POST',
					url:that.GLOBAL.develop_url+'/api/refuse_after_sale',
					params:{
						token:localStorage.getItem('token'),
                        order_id:this.$route.query.orderId,
                        refuse_reason:this.content,
					},
					xhrFields:{
		    			withCredentials:true
	    			},
		    		crossDomain:true,
		    		headers: { //解决跨域
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				}).then(function(res){
                    console.log(res.data)
                    $toast.show(res.data.msg, 2000).then(() => {
					  
					})
				}).catch(function(err){
					//$toast.show('网络错误', 2000).then(() => {})
				})
			},
		}
	}
</script>

<style scoped lang="less">
.page-content {
	padding-top: 44px;
  	padding-bottom: 1rem;
	color: #323232;
	position: relative;
	.mt30{
		position: relative;
        margin-top: .3rem;
        textarea{
            width: 94%;
            margin: 3%;
            padding: 5px;;
            border-radius: 5%;
        }
    }
    .button-positive{
        width: 90%;
        margin-left: 5%;
    }
	
}
</style>