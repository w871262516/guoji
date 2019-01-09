<template>
	<div class="page">
	  	<div class="page-content">
	  		<svgs style="display: none;"></svgs>
	  		<svgs-two style="display: none;"></svgs-two>
	  		<von-header theme="light">
			  <button class="button button-icon ion-ios-arrow-back" slot="left" @click="back"></button>
			  <span slot="title">申请退款</span>
			</von-header>
             <div class="myItem" >
                <div :style="{backgroundImage:'url('+orderInfo.thumb+')'}" class="img"></div>
                <div class="infoBox">
                    <p>{{orderInfo.title}}</p>
                    <!-- <p>颜色分类：经典小黑瓶</p> -->
                    <div>退款金额 <span> {{orderInfo.pay_amount}}</span></div>
                </div>
            </div>
	  		<list class="list-ios item-icon-right mt20">
				<div @click="show" class="section ">
					<item class="item1">
                        货物状态
                        <span>{{isGet}}</span>
       					<i class="icon ion-ios-arrow-right"></i>
					</item>
   				</div>
				<router-link :to="{path:'/mine/myOrders/applyReturn',query:{return:1}}" class="section">
					<item>
						退款原因：
                        <textarea v-model="content" :maxlength="120" rows="5" ></textarea>
					</item>
   				</router-link>
			</list>
            <div class="uploadImg">
                <p>上传凭证</p>
                <template v-for="img in imgLists">
                        <div class="imgBox">
                            <div class="img" :style="{backgroundImage:'url('+img.img+')'}"></div>
                            <span @click="deleteThis(img)">
                                <img src="../../../../../static/common/deletePic.png" class="deletePic" />
                            </span>
                        </div>
                </template>
                <div class="addPic"  v-if="imgLists.length < 9">
                    <img src="../../../../../static/common/addPics.png" />
                    <form ref="uploadForm" id="uploadForm" method="post" enctype="multipart/form-data" class="formInput">
                        <input type="text" id="token" ref="token" v-model="token" name="token" style="visibility: hidden;"/>
                        <input type="file" id="file" name="file" accept="image/*" multiple="multiple" @change="chooseImg($event)" v-if="isIphone"/>
                        <input type="file" id="file" name="file" runat="server" capture="camera" accept="image/*" multiple="multiple" @change="chooseImg($event)" v-if="!isIphone"/>
                    </form>
                </div> 
            </div>
            <div class="buttonBar">
				<div class="room2Btn" @click="submit">
					提交
				</div>
			</div>
            <transition name="fade" enter-active-class="animated fadeInUp faster" v-if="flag">
                <div class="model" ref="model" style="height:calc(100% - 44px);top:44px;">
			        <div class="modelBg" @click="hide"></div>
                    <list class="list-ios1 item-icon-right1">
                    <p>货物状态</p>
                        <item class="item2">
                            <div class="typeBox" @click="alreadyGet">
                                <span>
                                    已收到货
                                </span>
                                <section>
                                    <label :class="{isDefault:yes==1}"></label>
                                </section>
                            </div>
                        </item>
                        <item class="item2">
                            <div class="typeBox" @click="notyetGet">
                                <span>
                                    未收到货
                                </span>
                                <section>
                                    <label :class="{isDefault:yes==0}"></label>
                                </section>
                            </div>
                        </item>
                    </list>
                </div> 
            </transition>
	  	</div>
	</div>
</template>

<script>
	import svgsTwo from '../components/svgs.vue'
	import svgs from '../../../goodInfor/components/svgs.vue'
	export default{
		name:'orderStatus',
		components:{
	  		svgs,
	  		svgsTwo
		},
		data(){
			return{
                content:'',
                token:localStorage.getItem('token'),
                order_sn:this.$route.query.order_sn,
                isIphone:'',
                file:[],
                imgLists:[],
				yes:3,
                flag:false,
                isGet:'',
                orderInfo:{},
                ifReturn:1

			}
        },
        created(){
            if(this.$route.query.return){
                this.ifReturn = 2;
            }else{
                this.ifReturn = 1;
            }
            this.getThisOrderInfo()
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
					this.upload()
				}
			}
		},
		methods:{
			back(){
				this.$router.go(-1)
            },
            getThisOrderInfo(){//获取订单详情
				let that = this
				that.$axios({
					method:'get',
					url:that.GLOBAL.develop_url+'api/hompage/orderdetail',
					params:{
						token:that.token,
						order_sn:that.order_sn,
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
					switch (res.data.code){
						case 200:   
							that.orderInfo = res.data.data.order_info
							break;
						default:
							break;
					}
				})
			},
            show(){
                this.flag = true;
            },
            hide(){
                this.flag = false;
            },
            alreadyGet(){
				this.yes = 1;
                this.flag = false;
                this.isGet = "已收到货"
			},
			notyetGet(){
				this.yes = 0;
                this.flag = false;
                this.isGet = "未收到货"
			},
            submit(){
                let options = {
                    effect: 'scale',
                    buttons: [
                        {text: '确定'}
                    ]
                }
                if(this.yes == 3){
                    let text = '请选择货物状态';
                    let popup = $popup.fromTemplate('<p style="padding: 0.3rem;">'+text+'</p>', options)

                    popup.show().then((buttonIndex) => {
                        console.log(buttonIndex)
                        this.flag = true;
                    })
                }else if(this.content == ""){
                    let text = '请填写退货理由';
                    let popup = $popup.fromTemplate('<p style="padding: 0.3rem;">'+text+'</p>', options)

                    popup.show().then((buttonIndex) => {
                        console.log(buttonIndex)
                    })
                }else{
                  this.submitAjax()  
                }
            },
            submitAjax(){
                let that = this
                var data = {
                    token:this.token,
                    order_sn:that.order_sn,
                    status_shipping:this.yes,      
                    type:this.ifReturn,  
                    pic:JSON.stringify(this.imgLists),
                    note:this.content         
                }
                console.log(data)
				that.$axios({
					method:'post',
					url:that.GLOBAL.develop_url+'api/hompage/submitapplyrefund',
					params:data,
					xhrFields:{
						widthCredentials:true
					},
					crossDomain:true,
					header:{
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				}).then(function(res){
					console.log(res.data)
					switch (res.data.code){
						case 200:   
                            that.orderInfo = res.data.data.order_info
                            let options = {
                                effect: 'scale',
                                buttons: [
                                    {text: '确定'}
                                ]
                            }
                            let text = '提交成功！'
                            let popup = $popup.fromTemplate('<p style="padding: 0.3rem;">'+text+'</p>', options)

                            popup.show().then((buttonIndex) => {
                                console.log(buttonIndex)
                                that.$router.push('/mine/myOrders/returnDetail')
                            })
                            break;
                        case "400":
                            let options2 = {
                                effect: 'scale',
                                buttons: [
                                    {text: '确定'}
                                ]
                            }
                            let popup2 = $popup.fromTemplate('<p style="padding: 0.3rem;">'+res.data.msg+'</p>', options2)

                            popup2.show().then((buttonIndex) => {
                                console.log(buttonIndex)
                                that.$router.go(-3)
                            })
							break;
						default:
							break;
					}
					if(res.data.code==404){
						$toast.show(res.data.msg, 1000).then(() => {
							that.$router.push('/login')
						})
					}
				})
            },
			upload(){//上传
				let form = new FormData()
				form.append('token',this.token)
				for(let i=0;i<this.file.length;i++){
					form.append('file['+i+']',this.file[i])
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
	    			console.log('wwwwwwwwwwwwwwww',res)
	    			if(res.data.code == "200"){
	    				for(let j=0;j<res.data.data.length;j++){
		    				let a = {'img':res.data.data[j].src}
		    				console.log(a)
	    					that.imgLists.push(a)
	    				}
	    			}
	    		})
			},
			chooseImg(i){//选择图片
				console.log(i.target.files)
				this.file = i.target.files
			},
			deleteThis(img){//删除图片
				this.imgLists = this.imgLists.filter(i=>{return i!=img})
			},
        }
	}
</script>

<style scoped lang="less">
.page{
    .page-content{
        padding-top: 44px;
        padding-bottom: 1rem;
        color: #323232;
        font-size: .26rem;
        .myItem{
            display: flex;
            display: -webkit-flex;
            justify-content: flex-start;
            align-items: center;
            position:relative;
            background: #fff;
            .img{   
                display: block;
                width: 1.8rem;
                height: 1.8rem;
                margin: .25rem;
                background-size: cover;
                background-repeat: no-repeat;
                background-position: center center;
            }
            .infoBox{
                width: calc(100% - 2.5rem);
                height: 1.8rem;
                font-size: .23rem;
                display: flex;
                display: -webkit-flex;
                justify-content: space-around;
                flex-direction: column;
                p{
                    height:.28rem;
                    line-height: .28rem;
                    &:nth-child(2){
                        color: #a0a0a0;
                      font-size: .2rem;  
                    }
                    
                }
                div{
                    position: absolute;
                    right: .2rem;
                    bottom: .2rem; 
                    span{
                        font-size: .3rem;
                        color: #E87439;
                    } 
                }
            }
        }
        .list-ios{
            font-size: .24rem;
            padding-left: 0 !important;
            padding-right: 0 !important;
            .section{
                .item1{
                    position: relative;
                    span{
                        position: absolute;
                        right: 1rem;
                    }
                    &:after{
                        content: '';
                        display: block;
                        width: calc(100% - 16px);
                        height: 1px;
                        background-color: #e5e5e5;
                        position: absolute;
                        bottom: 1px;
                        right: 0;
                        z-index: 1000;
                    }	
                }
                .item{
                    p{
                        font-size: .2rem;
                        padding: .1rem 0;
                        color: #a0a0a0;
                    }
                }
                        
            }
        }
        .uploadImg{
            background-color: #fff;
            padding: .2rem 0;
            p{
                padding: .2rem;
            }
            .addPic{
                width: 1.6rem;
                height: 1.6rem;
                margin-left: .2rem;
                display: inline-block;
                position: relative;
                border: 1px dashed #ddd;
                img{
                    display: block;
                    width: .6rem;
                    height: .6rem;
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
        
		.imgBox{
			position: relative;
			display: inline-block;
			.img{
				display: inline-block;
				width: 1.6rem;
				height: 1.6rem;
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
        .buttonBar{
			position: fixed;
			bottom: 0;
			left: 0;
			z-index: 999;
			width: 100%;
			height: .98rem;
			line-height: .98rem;
			font-size: .28rem;
			text-align: center;
			display: flex;
			display: -webkit-flex;
			justify-content: space-around;
			.room2Btn{
				width: 100%;
				background-color: #E87439;
				color: #fff;
			}
        }
        .model{
            position: fixed;
            left: 0;
            width: 100%;
            
            z-index: 998;
            .modelBg{
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
                z-index: 999;
                background-color: rgba(0,0,0,0.5);
            }
            p{
                text-align: center;
                padding: .2rem;
                font-size: .3rem;
            }
            .list-ios1{
                z-index: 999;
                width: 100%;
                background-color: #fff;
                position: fixed;
                bottom: 1rem;
                left: 0;
                padding-bottom: 2.2rem;
                .item2{
                    padding-right: .65rem;
                    font-size: .27rem;
                    line-height: .4rem;
                    .typeBox{
                        display: flex;
                        display: -webkit-flex;
                        justify-content: flex-start;
                        align-items: center;
                        span{
                            margin-left: .2rem;
                        }
                        section{
                            display: flex;
                            display: -webkit-flex;
                            align-items:center;
                            position: absolute;
                            right: .2rem;
                            top: 50%;
                            transform: translateY(-50%);
                            -webkit-transform:translateY(-50%);
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
                    }
                }
            }
		}
        .mt20{
            margin-top: .2rem;
        }
            .ion-ios-arrow-right{
            color: #1c1c1c;position: absolute;right: .16rem;top: 50%;transform: translateY(-50%);-webkit-transform: translateY(-50%);height: auto;
        }
        .ion-ios-arrow-left{
            color: #1c1c1c;position: absolute;right: .16rem;top: .18rem;height: auto;
        }
        .icon{
            font-size: .35rem !important;
        }
    }
}
</style>