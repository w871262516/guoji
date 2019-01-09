<template>
	<div class="page">
	  	<div class="page-content" @click="this.isAreaPicker == false">
	 	 	<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">设置退货地址</span>
			  <button class="button button-icon headWord" slot="right" @click="check">保存</button>
			</von-header>
	 	 	<von-input type="text" v-model="username" placeholder="请输入收货人" label="收货人："></von-input>
	 	 	<von-input type="text" v-model="phone" placeholder="请输入联系方式" label="联系方式："></von-input>
	 	 	<div @click="toShow">
	 	 		<von-input type="text" :disable="disable" v-model="district" placeholder="请选择所在地区" label="所在地区："></von-input>
	 	 	</div>
 	 		
	 	 	<von-input type="text" v-model="address" placeholder="请输入详细地址" label="详细地址："></von-input>
	 	 	<!-- <list>
				<item>
					<section @click="setDefaultAddress">
						<label :class="{isDefault:isDefault}"></label>
						设为默认退货地址
	       			</section>
				</item>
				<item>
					<section class="default" @click="deleteAddressTips">
						删除退货地址
	       			</section>
				</item>
			</list> -->
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
				token:localStorage.getItem('token'),
				id:'',
				username:'',
				phone:'',
				district:'',
				address:'',
				isDefault:'',
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
			deleteAddressTips(){
				let options = {
		          effect: 'scale',
		          buttons: [
		            {text: '取消'},
		            {text: '确定'},
		          ]
		        }
		
		        let popup = $popup.fromTemplate('<p style="margin-bottom: 0; text-align: center;">确定要删除该地址吗?</p>', options)
				let that = this
		        popup.show().then((buttonIndex) => {
	        		if(buttonIndex == 1){
	        			that.deleteAddress()
	        		}
		        })
			},
			getAddress(){
				let that = this
	    		that.$axios({
	    			method:'post',
	    			url:that.GLOBAL.develop_url+'api/business_return_address',
	    			data:{
	    				token:that.token
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
	    			if(res.data.code==200){
						var datas = res.data.data
					 	that.id = datas.id
						that.username = datas.name
						that.phone = datas.mobile
						that.district = datas.address
						that.address = datas.address_info
					}else if(res.data.code==404){
						$toast.show(res.data.msg, 1000).then(() => {
							that.$router.push('/login')
						})
					}else{
						$toast.show(res.data.msg, 1000)
					}
	    		})
			},
			deleteAddress(){
				let that = this
	    		that.$axios({
	    			method:'get',
	    			url:that.GLOBAL.develop_url+'api/hompage/addressdel',
	    			params:{
	    				id:that.id
	    			},
	    			xhrFields:{
	    				widthCredentials:true
	    			},
	    			crossDomain:true,
	    			header:{
	    				'Content-Type': 'application/x-www-form-urlencoded'
	    			}
	    		}).then(function(res){
	    			console.log(res.data)
	    			if(res.data.code==200){
						$toast.show(res.data.msg, 1000).then(() => {
							that.back()
						})
					}else if(res.data.code==404){
						$toast.show(res.data.msg, 1000).then(() => {
							that.$router.push('/login')
						})
					}else{
						$toast.show(res.data.msg, 1000)
					}
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
			check(){
				if(this.username==''){
					$toast.show('请填写收货人！', 1000)
				}else if(this.phone==''){
					$toast.show('请填写联系方式！', 1000)
				}else if(!this.isPoneAvailable(this.phone)){
					$toast.show('请输入正确手机号！', 1000)
				}else if(this.district==''){
					$toast.show('请填写所在地区！', 1000)
				}else if(this.address==''){
					$toast.show('请填写详细地址！', 1000)
				}else{
					this.editThisAddress()
				}
			},
		    editThisAddress(){ //编辑地址后保存
				let that = this
				var data = {}
				data.token = that.token;
				if(that.id!=''){
					data.id = that.id
				}
				data.name = that.username
				data.mobile = that.phone
				data.address = that.district
				data.address_info = that.address
	    		that.$axios({
	    			method:'post',
	    			url:that.GLOBAL.develop_url+'api/add_business_return_address',
	    			data:data,
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
	    			}else if(res.data.code==404){
						$toast.show(res.data.msg, 1000).then(() => {
							that.$router.push('/login')
						})
					}else{
						$toast.show(res.data.msg, 1000)
					}
	    		})
		    }
		},
		created(){
			this.getAddress()
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