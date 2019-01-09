<template>
	<div class="page">
		<div class="page-content">
	  		<von-header theme="light" style="z-index: 11;">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">{{title}}</span>
			  <button class="button button-icon headWord" slot="right" @click="addThisGoods">
			  	完成
			  </button>
			</von-header>
			<von-input type="text" v-model.trim="goodName" placeholder="请输入拍品名称" label="名称："> </von-input>
			<div class="relative"  @click="showChooseTypeModel">
				<von-input type="text" v-model="goodType" placeholder="" label="分类："> </von-input>
				<p class="gray" v-show="!chooseType">请选择拍品类型</p>
				<p v-show="chooseType">{{goodType}}</p>
			</div>
			
			<von-input type="text" v-model.trim="startPrice" @input="watchStarPrice()" placeholder="请输入起拍价" label="起拍价：" style="margin-top: .2rem;"> </von-input>
			<von-input type="text" v-model.trim="marketPrice" @input="watchMarketPrice()" placeholder="请输入市场价" label="市场价："> </von-input>
			<von-input type="text" v-model.trim="bond" @input="watchBond()" placeholder="请输入保证金" label="保证金："> </von-input>
			<von-input type="text" v-model.trim="addRange" @input="watchAddRange()" placeholder="请输入加价幅度" label="加价幅度："> </von-input>
			<div class="relative"  @click="showChooseTimeModel">
				<von-input type="text" v-model="endTime" placeholder="" label="截止时间："> </von-input>
				<p class="gray" v-show="!chooseTime">请选择截止时间</p>
				<p v-show="chooseTime" >{{endTime}}</p>
			</div>
			
			<von-input type="text" v-model="goodContents" placeholder="请输入拍品描述" label="拍品描述："> </von-input>
			
			<div class="addPicBox">
				<p>上传拍品封面图：</p>
				<template v-for="img in imgLists">
					<div class="imgBox">
						<div class="img" :style="{backgroundImage:'url('+img.path+')'}"></div>
						<span @click="deleteThis(img,0)">
							<img src="../../../../static/common/deletePic.png" class="deletePic" />
						</span>
					</div>
				</template>
				<div class="addPic" v-if="imgLists.length < 9">
					<img src="../../../../static/common/addPics.png" />
					<form ref="uploadForm" id="uploadForm" method="post" enctype="multipart/form-data" class="formInput">
						<input type="text" id="token" ref="token" v-model="token" name="token" style="visibility: hidden;"/>
						<input type="file" id="file" name="file" accept="image/*" multiple="multiple" @change="chooseImg($event,0)" v-if="isIphone"/>
						<!-- <input type="file" id="file" name="file" runat="server" capture="camera" accept="image/*" multiple="multiple" @change="chooseImg($event,0)" v-if="!isIphone"/> -->
						<input type="file" id="file" name="file" runat="server" accept="image/*" multiple="multiple" @change="chooseImg($event,0)" v-if="!isIphone"/>
					</form>
				</div>
			</div>
			<div class="addPicBox">
				<p>上传拍品详情图：</p>
				<template v-for="img in detailImgLists">
					<div class="imgBox">
						<div class="img" :style="{backgroundImage:'url('+img.path+')'}"></div>
						<span @click="deleteThis(img,1)">
							<img src="../../../../static/common/deletePic.png" class="deletePic" />
						</span>
					</div>
				</template>
				<div class="addPic" v-if="detailImgLists.length < 9">
					<img src="../../../../static/common/addPics.png" />
					<form ref="uploadForm" id="uploadFormDt" method="post" enctype="multipart/form-data" class="formInput">
						<input type="text" id="token" ref="token" v-model="token" name="token" style="visibility: hidden;"/>
						<input type="file" id="fileDt" name="fileDt" accept="image/*" multiple="multiple" @change="chooseImg($event,1)" v-if="isIphone"/>
						<!-- <input type="file" id="fileDt" name="file" runat="server" capture="camera" accept="image/*" multiple="multiple" @change="chooseImg($event,1)" v-if="!isIphone"/> -->
						<input type="file" id="fileDt" name="fileDt" runat="server" accept="image/*" multiple="multiple" @change="chooseImg($event,1)" v-if="!isIphone"/>
					</form>
				</div>
			</div>
			<!--时间弹窗-->
			<transition name="fade" enter-active-class="animated fadeInUp faster">
				<div class="model" v-show="timeModelShow">
					<div class="wrap"></div>	
					<div class="content">
						<p class="dayP blue">{{today}}（今天）</p>
						<div class="flexTime">
							<p class="timeP" v-for="h in hours" v-if="nowHour < h.time" @click="chooseGoodsTime(today,h.time)">{{h.time}}:00</p>
						</div>
						<hr />
						<p class="dayP blue">{{tomor}}（明天）</p>
						<div class="flexTime">
							<p class="timeP" v-for="h in hours" @click="chooseGoodsTime(tomor,h.time)">{{h.time}}:00</p>
						</div>
					</div>
		  		</div>
			</transition>
			
			
			<!--分类弹窗-->
			<transition name="fade" enter-active-class="animated fadeInUp faster">
				<div class="model" v-show="typeModelShow">
					<div class="wrap"></div>	
					<div class="content">
						<p class="dayP blue">请选择拍品类型：</p>
						<div class="flexTime">
							<p class="timeP" v-for="type in typeArr" @click="chooseGoodsType(type.id,type.catname)">{{type.catname}}</p>
						</div>
					</div>
		  		</div>
			</transition>
		</div>
  	</div>
</template>

<script>
	export default{
		name:'addNewGoods',
		components:{
		},
		data(){
			return{
				title:'发布拍品',
				chooseTime:false,
				chooseType:false,
				timeModelShow:false,//时间弹窗
				typeModelShow:false,//分类弹窗
				isIphone:'',
				token:'',
				goodName:'',
				goodType:'',
				goodTypeId:null,
				goodContents:'',
				startPrice:'',
				marketPrice:'',
				bond:'',//保证金
				addRange:'',
				endTime:'',
				finalTime:'',
				imgLists:[],//拍品封面图集
				detailImgLists:[],//拍品详情图集
				file:'',
				fileDt:'',
				typeArr:[],
				today:'',
				tomor:'',
				nowHour:'',
				hours:[
					{time:10},
					{time:12},
					{time:16},
					{time:17},
					{time:18},
					{time:19},
					{time:20},
					{time:21},
					{time:22}
				]
			}
		},
		watch:{
			file(val){//监控图片变化 一但用户选好图片 马上自动上传
				console.log(val.length)
				let vl = val.length
				if(vl>9){
					$toast.show('最多可上传9张图片',1000)				
					return
				}else if((vl+this.imgLists.length)>9){
					$toast.show('最多可上传9张图片',1000)				
					return
				}else{
					this.upload(0)
				}
			},
			fileDt(val){//监控图片变化 一但用户选好图片 马上自动上传
				console.log(val.length)
				let vl = val.length
				if(vl>9){
					$toast.show('最多可上传9张图片',1000)				
					return
				}else if((vl+this.detailImgLists.length)>9){
					$toast.show('最多可上传9张图片',1000)				
					return
				}else{
					this.upload(1)
				}
			},
			goodType(val){
				console.log(">>>>>>>>>>>>goodType",this.goodTypeId);
				
				if(val.length<1){
					this.showChooseTypeModel()
				}
			},
			endTime(val){
				if(val.length<1){
					this.showChooseTimeModel()
				}
			},
			timeModelShow(val){
				console.log(val)
				if(val){
					this.setModelTimes()
				}
			}
		},
		methods:{
			back(){
				this.$router.go(-1)
			},	
			watchStarPrice(){//不准乱输入内容
				this.startPrice = this.startPrice.replace(/[^\d]/g,'')
			},
			watchMarketPrice(){//不准乱输入内容
				this.marketPrice = this.marketPrice.replace(/[^\d]/g,'')
			},
			watchBond(){//不准乱输入内容
				this.bond = this.bond.replace(/[^\d]/g,'')
			},
			watchAddRange(){//不准乱输入内容
				this.addRange = this.addRange.replace(/[^\d]/g,'')
			},
			showChooseTimeModel(){

				this.timeModelShow = !this.timeModelShow
				console.log("（我是时间弹窗）改变了model显示状态！！this.timeModelShow=",this.timeModelShow);
			},
			showChooseTypeModel(){
				
				this.typeModelShow = !this.typeModelShow
				console.log("（我是分类弹窗）改变了model显示状态！！this.typeModelShow=",this.typeModelShow);
			},
			chooseGoodsTime(d,t){ //选好时间，处理字符，转时间戳
				this.endTime = d + '  ' + t + ':00'
				let date1 = new Date()
				let day = d.replace('月','-').replace('日','')
				day = date1.getFullYear() + '-' + day + ' ' + t +':00'
				this.finalTime = new Date(day).getTime()/1000
				this.chooseTime = true
				this.showChooseTimeModel()
			},
			chooseGoodsType(d,t){
				this.goodTypeId = d
				this.goodType = t
				this.chooseType = true
				console.log("已选择",this.goodType);
				
				this.showChooseTypeModel()
			},
			setModelTimes(){//筛选弹窗
				let da = new Date()
				let m = da.getMonth()+1
				if(m<10){
					m = '0'+m
				}
				let d  = da.getDate()
				this.today = m + '月' + d + '日'
				this.tomor = m + '月' + (d+1) +'日'
				this.nowHour = da.getHours()
			},
			upload(isDetail){//上传
				let form = new FormData()
				form.append('token',this.token)
				if(isDetail){//详情图上传
					for(let i=0;i<this.fileDt.length;i++){
						form.append('file['+i+']',this.fileDt[i])
					}
				}else{//封面图上传
					for(let i=0;i<this.file.length;i++){
						form.append('file['+i+']',this.file[i])
					}
				}
				
				let that = this
				that.$axios({
	    			method:'post',
	    			url:that.GLOBAL.develop_url+'upload/upload_to_upyun',
	    			data:form,
	    			xhrFields:{
	    				widthCredentials:true
	    			},
					headers:{
						'Content-Type': 'multipart/form-data'
					}
	    		}).then(function(res){
	    			if(res.data.code == "200"){
						console.log("上传-----------",res.data.data)
						if(isDetail){//详情图上传
							for(let j=0;j<res.data.data.length;j++){
								let a = {'path':res.data.data[j].src}
								console.log(a)
								that.detailImgLists.push(a)
							}
						}else{//封面图上传
							for(let j=0;j<res.data.data.length;j++){
								let a = {'path':res.data.data[j].src}
								console.log(a)
								that.imgLists.push(a)
							}
						}
							
	    			}
	    		})
			},
			chooseImg(i,isDetail){//选择图片
			if(isDetail){
				this.fileDt = i.target.files
			}else{
				this.file = i.target.files
			}
				
			},
			deleteThis(img,isDetail){//删除图片
				if(isDetail){
					this.detailImgLists = this.detailImgLists.filter(i=>{return i!=img})
				}else{
					this.imgLists = this.imgLists.filter(i=>{return i!=img})
				}
				
			},
			getType(){//获取分类数据
				let that = this
				this.$axios({
					url:that.GLOBAL.develop_url+'api/recommend_cate',
	    			method:'get',
	    			xhrFields:{
	    				widthCredentials:true
	    			},
					headers:{
						'Content-Type': 'multipart/form-data'
					}
				}).then(function(res){
					
	    			res.data.data.filter(item=>{ //过滤【全部】类型
	    				if(item.id > 0){
	    					that.typeArr.push(item)
	    				}
	    			})
	    		})
					console.log("..............",that.typeArr);
			},
			check(){
				if(this.goodName == "" ){
					$toast.show('请填写拍品名称', 2000)
					return false;
				}else if(this.goodTypeId==''){
					$toast.show('请选择拍品类型', 2000)
					return false;
				}else if(this.startPrice==''){
					$toast.show('请填写起拍价', 2000)
					return false;
				}else if(this.marketPrice==''){
					$toast.show('请填写市场价', 2000)
					return false;
				}else if(this.bond==''){
					$toast.show('请填写保证金', 2000)
					return false;
				}else if(this.addRange==''){
					$toast.show('请填写加价幅度', 2000)
					return false;
				}else if(this.finalTime==''){
					$toast.show('请选择截止时间', 2000)
					return false;
				}else if(this.goodContents==''){
					$toast.show('请填写拍品描述', 2000)
					return false;
				}else if(this.imgLists.length < 1){
					$toast.show('请选择封面图', 2000)
					return false;
				}else if(this.detailImgLists.length < 1){
					$toast.show('请选择详情图', 2000)
					return false;
				}else{
					return true;
				}
			},
			addThisGoods(){//发布拍品
				let that = this
				if(!this.check()){
					return
				}
				that.$axios({
					method:'POST',
					url:that.GLOBAL.develop_url+'api/add_goods',
					data:{
						token:that.token,
						cid:that.goodTypeId,
						name:that.goodName,
						description:that.goodContents,
						contents:JSON.stringify(that.detailImgLists),
						thumbs:JSON.stringify(that.imgLists),
						auction_end_time:that.finalTime,
						per_price:that.addRange,
						start_price:that.startPrice,
						market_price:that.marketPrice,
						deposit:that.bond,
						is_virtual:that.goodTypeId==5?1:0
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
					if(res.data.code == "200"){
						$toast.show("发布成功!",1000).then(()=>{
							that.back()
						})
					}else{
						$toast.show(res.data.msg,1000)
					}
				})
			},
			getGoodsInfo(){//修改前获取之前拍品信息
				let that = this
				that.$axios({
					method:'POST',
					url:that.GLOBAL.develop_url+'api/auction_info',
					data:{
						token:localStorage.getItem('token'),
						auction_id:that.auction_id
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
					if(res.data.code == "200"){
						that.goodName = res.data.data.title
						that.goodTypeId = res.data.data.cid
						if(that.goodTypeId == 16){
							that.goodType = res.data.goods_cat[14].catname
						}else{
							that.goodType = res.data.goods_cat[that.goodTypeId-1].catname
						}
						that.finalTime = res.data.data.auction_end_time
						that.endTime = that.timeFormer(res.data.data.auction_end_time)
						that.goodContents = res.data.data.description
						that.startPrice = res.data.data.start_price
						that.marketPrice = res.data.data.market_price
						that.bond = res.data.data.deposit_money
						that.addRange = res.data.data.per_price
						that.imgLists = eval(res.data.data.thumbs)
						that.detailImgLists = eval(res.data.data.content)
						
					}else{
						$toast.show(res.data.msg,1000)
					}
				})
			},
		},
		created(){
			this.getType()
			this.isIphone = this.thisIsIphone
			this.token = localStorage.getItem('token')
			if(this.$route.query.auction_id){
				this.title = "修改拍品";
				this.auction_id = this.$route.query.auction_id;
				this.getGoodsInfo()
				this.chooseType = true;
				this.chooseTime = true;
			}
		}
	}
</script>

<style scoped lang="less">
.page-content {
  	padding-top: 44px;
	.headWord{
		font-size: .26rem !important;color: #E87439 !important;
	}
	.addPicBox{
		background-color: #fff;
		margin-top: .3rem;
		padding: .2rem 0;
		p{
			padding-left: .2rem;
			padding-bottom: .2rem;
			color: #444;
		}
		.imgBox{
			position: relative;
			display: inline-block;
			.img{
				display: inline-block;
				width: 2.2rem;
				height: 2.2rem;
				margin-left: .2rem;
				margin-top: .1rem;
  				background-size: cover;
  				background-repeat: no-repeat;
  				background-position: center center;
			}
			span{
				position: absolute;
				right: -0.15rem;
				top: 0;
				padding:  0  0 .25rem .25rem;
				z-index: 1;
				.deletePic{
					display: block;
					width: .35rem;
					height: .35rem;
					background-color: #fff;
					border-radius: 50%;
				}
			}
		}
		.addPic{
			width: 2.2rem;
			height: 2.2rem;
			background-color: #f2f2f2;
			margin-left: .2rem;
			display: inline-block;
			position: relative;
			img{
				display: block;
				width: .75rem;
				height: .75rem;
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%,-50%);
			}
			.formInput{
				position: absolute;
				width: 100%;
				height: 100%;
				opacity: 0;
				input{
					padding: 0 !important;
					position: absolute;
					width: 100%;
					height: 100%;
					opacity: 0;
				}
			}
		}
	}
	
	.model{
		width: 100%;
		height: calc(100% - 44px);
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 1000;
		.wrap{
			width: 100%;
			height: 100%;
			background-color: rgba(0,0,0,0.5);
			position: absolute;
			top: 0;
			left: 0;
			z-index: 1001;
		}
		.content{
			width: 100%;
			min-height: 50%;
			background-color: #fff;
			position: absolute;
			bottom: 0;
			right: 0;
			z-index: 1002;
			padding: .2rem;
			.dayP{
				font-size: .26rem;
				margin: .3rem 0 !important;
			}
			.flexTime{
				display: flex;
				display: -webkit-flex;
				flex-direction: row;
				flex-wrap: wrap;
				justify-content: flex-start;
				.timeP{
					width: 30%;
					display: flex;
					display: -webkit-flex;
					justify-content: center;
					align-items: center;
					padding: .2rem 0;
					border: 1px solid #aeadac;
					margin-right: 5% !important;
					margin-bottom: .2rem !important;
					&:nth-child(3n+0){	
						margin-right: 0 !important;
					}
				}
			}
		}
	}
}
.relative{
	position: relative;
	p{
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		-webkit-transform: translateY(-50%);
		left: calc(25% + 7px);
		width: 55%;
		height: calc(100% - 2px);
		display: flex;
		display: -webkit-flex;
		align-items: center;
		z-index: 10;
		background-color: #fff;
	}
	.gray{
		color: #aeadac !important;
	}
}
.blue{
	color: #7EAED4;
}
</style>