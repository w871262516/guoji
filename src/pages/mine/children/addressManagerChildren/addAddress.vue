<template>
	<div class="page">
	  	<div class="page-content" @click="this.isAreaPicker == false">
	 	 	<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">新增地址</span>
			  <button class="button button-icon headWord" slot="right" @click="addThisAddress">保存</button>
			</von-header>
	 	 	<von-input type="text" v-model.trim="username" placeholder="请输入收货人" label="收货人："></von-input>
	 	 	<von-input type="text" v-model.trim="phone" placeholder="请输入联系方式" label="联系方式："></von-input>
	 	 	<div @click="toShow">
	 	 		<von-input type="text" :disable="disable" v-model="district" placeholder="请选择所在地区" label="所在地区："></von-input>
	 	 	</div>
 	 		
	 	 	<von-input type="text" v-model.trim="address" placeholder="请输入详细地址" label="详细地址："></von-input>
	 	 	<list>
				<item>
					<section @click="setDefaultAddress">
						<label :class="{isDefault:isDefault==1}"></label>
						设为默认地址
	       			</section>
				</item>
			</list>
			 <vue-pickers
		      :show="showArea"
		      :link="link"
		      :columns="columns"
		      :selectData="pickData"
		      @cancel="close"
		      @confirm="confirmFn"></vue-pickers>
  		</div>
  	</div>
</template>

<script>
	import vuePickers from 'vue-pickers'
	import {provs_data, citys_data, dists_data} from 'vue-pickers/lib/areaData'
	export default{
		name:'editAddress',
		components:{
			vuePickers
		},
		data(){
			return{
				username:'',
				phone:'',
				district:'',
				address:'',
				isDefault:1,
				disable:true,
		  		pickData: {
			        data1: provs_data,
			        data2: citys_data,
			        data3: dists_data
			    },
		        showArea: false,
		        columns: 3,
		        link: true
			}
		},
		methods:{
			back(){
				this.$router.go(-1)
			},
			setDefaultAddress(){
				if(this.isDefault == 1){
					this.isDefault = 0
				}else{
					this.isDefault = 1
				}
			},
			deleteAddress(){
				let options = {
		          effect: 'scale',
		          buttons: [
		            {text: '取消'},
		            {text: '确定'},
		          ]
		        }
		
		        let popup = $popup.fromTemplate('<p style="margin-bottom: 0; text-align: center;">确定要删除该地址吗?</p>', options)
		
		        popup.show().then((buttonIndex) => {
	        		console.log(buttonIndex)
		        })
			},
			close() {
		    	this.showArea = false
		    },
		    confirmFn(val) {
			    this.showArea = false
			    console.log(val)
			    this.district  = val.select1.text + ' ' + val.select2.text +  ' ' + val.select3.text
			    this.pickData.default = [val.select1, val.select2, val.select3]
		    },
		    toShow() {
		    	this.showArea = true
		    },
		    addThisAddress(){
		    	let that = this
		    	console.log(that.isDefault)
	    		that.$axios({
	    			method:'post',
	    			url:that.GLOBAL.develop_url+'api/hompage/addressadd',
	    			data:{
	    				token:localStorage.getItem('token'),
	    				name:that.username,
	    				mobile:that.phone,
	    				area:that.district,
	    				address:that.address,
	    				is_default:that.isDefault
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
						$toast.show('保存成功！', 1000).then(() => {
							that.back()
						})
	    			}else{
	    				$toast.show(res.data.msg, 1000)
	    			}
	    		})
		    }
		}
	}
	
</script>

<style lang="less" scoped>
.page-content {
  	padding-top: 44px;
  	padding-bottom: 1rem;
	color: #323232;
	font-size: .23rem;
	section{
		display: flex;
		display: -webkit-flex;
		align-items:center;
		label{
			margin-right: .15rem;
			display: inline-block;
			width: .3rem;
			height: .3rem;
			box-sizing: content-box;
			border: 1px solid #E87439;
			border-radius: 50%;
			position: relative;
		}
		.isDefault:before{
			content: '';
			position: absolute;
			display: block;
			width: .17rem;
			height: .17rem;
			background-color: #E87439;
			border-radius: 50%;
			left: 50%;
			top: 50%;
			transform: translate(-50%,-50%);
			-webkit-transform: translate(-50%,-50%);
		}
	}
	.default{
		color: #E87439;
		letter-spacing: 1.5px;
		font-size: .26rem;
	}
}
.ion-ios-arrow-right{
	color: #DDD;position: absolute;right: .16rem;top: 50%;transform: translateY(-50%);-webkit-transform: translateY(-50%);height: auto;
}
.headWord{
	font-size: .26rem !important;color: #E87439 !important;
}
</style>