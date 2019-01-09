<template>
    <div class="page">
        <div class="live-room">
            <!-- <video id="my-video" class="video-js my-video"  :poster="liveInfo.live_cover" x-webkit-airplay="true" x5-video-player-fullscreen="true"
                preload="auto" playsinline="true" webkit-playsinline x5-video-player-type="h5" autoplay="autoplay"> -->
            <svgs style="display: none;"></svgs>
            <div class="top">
                <div class="singer">
                    <div class="photo"  @click="to({path:'/stores/'+productInfo.mid,query:{id:productInfo.mid,fromLive:'live'}})">
                        <img :src="liveInfo.logo" alt="">
                    </div>
                    <div class="info"  @click="to({path:'/stores/'+productInfo.mid,query:{id:productInfo.mid,fromLive:'live'}})">
                        <p>{{liveInfo.shop_name}}</p>
                        <p>{{randomOnline}}在线</p>
                    </div>
                    <div :class="isFollow?'focus':'unfocus'" @click="followHim">{{isFollow?'已关注':'关注'}}</div>
                </div>
                <div class="fans">
                    <div class="no">
                        <img class="fans-photo" :src="randomPhoto1"   @error="imgError('randomPhoto1')"  alt="">
                        <img class="crown" src="../../../../static/live/level1.png" alt="">
                    </div>
                    <div class="no">
                        <img class="fans-photo" :src="randomPhoto2"  @error="imgError('randomPhoto2')"  alt="">
                        <img class="crown" src="../../../../static/live/level2.png" alt="">
                    </div>
                    <div class="no">
                        <img class="fans-photo" :src="randomPhoto3"  @error="imgError('randomPhoto3')"  alt="">
                        <img class="crown" src="../../../../static/live/level3.png" alt="">
                    </div>
                </div>
                <div class="close">
                    <!-- <img src="../../../../static/live/close.png" alt="" @click="back"> -->
                    <section class="guide_item"  @click="back">
                        <svg class="icon_style">
                            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#closeO" fill="#E87439"></use>
                        </svg>
                    </section>
                </div>
            </div>
            <video id="my-video" class="video-js my-video" poster="../../../../static/live/img.png" x-webkit-airplay="true" x5-video-player-fullscreen="true"
                preload="auto" playsinline="true" webkit-playsinline x5-video-player-type="h5" autoplay="autoplay">
                <source :src="liveInfo.hlsPullUrl" type="application/x-mpegURL"/>
                <p>您的浏览器版本过低</p>
            </video> 
            <div class="talk-box">
                <div class="coming" v-for="item in enterMsg">
                    <p>{{item}}</p>
                </div>
                <div class="product" @click="toGoodInfo">
                    <div class="good">
                        <img :src="productInfo.thumb" alt="">
                        <div class="good-detail">
                            <div :class="{'too-long':titleLength>10}">{{productInfo.title}}</div>
                            <p class="default">当前价:￥{{productInfo.auction_price}}</p>
                        </div>
                    </div>
                </div>
                <img class="enter-shop" src="/static/live/enter.png" alt="" @click="to({path:'/stores/'+productInfo.mid,query:{id:productInfo.mid,fromLive:'live'}})">
                <div class="chat-text">
                    <!-- <p v-for="(data,index) in myChatData" v-if="myChatData.length"><span>{{data.fromNick}}：</span>{{data.text}}</p> -->

                    <div v-for="(data,index) in myChatData" v-if="myChatData.length">
                        <span class="bubble">
                            <span :style='{color:data.color}'>{{data.nickname}}：</span>
                            {{data.msg_text}}
                        </span>
                    </div>
                </div>
                <div class="com-input">
                    <!-- <div class="goods">
                        <md-button class="button button-light button-block" @click.native="getProduct()">
                            商品
                        </md-button>
                    </div> -->
                    <div class="talk">
                        <von-input id='oInp' type="text" v-model="myWords" placeholder="我来聊一聊"> </von-input>
                    </div>
                    <div class="send-btn">
                        <md-button class="button button-positive button-block" @click.native="send()">
                            发送
                        </md-button> 
                    </div>
                    <div class="report" v-if="report"  @click="report = false">举报</div>
                    <section class="guide_item" @click="reportShop">
                        <svg class="icon_style">
                            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#more"></use>
                        </svg>
                    </section>
                    <section class="guide_item" @click="showShareModel=true">
                        <svg class="icon_style">
                            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#share"  fill="#b5b5b5"></use>
                        </svg>
                    </section>
                    <section class="guide_item" @click="addBubbles">
                        <svg class="icon_style">
                            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#likeIt" fill='#d81e07'></use>
                        </svg>
                        <svg class="icon_style_fly "  v-for="(item,index) in bubbles" :class="item.ani">
                            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#likeIt" :fill='item.color'></use>
                        </svg>
                    </section>
                </div>
            </div>
        </div>
        <share-model v-show="showShareModel" @hideShareModel="hideShareModel"></share-model>
    </div>
</template>

<script src="../../../sdk/video.min.js"></script>
<script>
    
	import svgs from '../../../components/common/svgs.vue'
	import shareModel from '../../../components/common/shareModel.vue'
		
	export default {
		name:'liveRoom',
	  	components:{svgs,shareModel},
	  	data(){
            return{
                showShareModel:false,
                myWords:'' ,
                myChatData:[],
                liveInfo:{
                        id:2,
                        mid:663401,
                        live_name:'直播间测试',
                        live_cover:'../../../../static/live/img.png',
                        live_status:1,
                        cid:'fcf86725f09e4d4abdb80ed545e9a3af',
                        pushUrl:'',
                        group_id:''
                },
                token:localStorage.getItem('token'),
                isFollow:false,
                container:'',
                bubbles:[],
                bubblesColor:['#d17cde','#003bea','#ffc107','#00bcd4','#d40000','#68f155','#E87439'],//爱心随机颜色
                flyList:['fly1','fly2','fly3','fly4','fly5','fly6','fly7'],//爱心随机动画
                productInfo:{},//商品信息
                travelerUid:Math.floor(Math.random()*10000000),//游客随机uid
                myColor:Math.floor(Math.random()*7),
                randomPhoto1:'https://picsum.photos/200/200/?image='+Math.ceil(Math.random()*800),//随机头像
                randomPhoto2:'https://picsum.photos/200/200/?image='+Math.ceil(Math.random()*800),//随机头像
                randomPhoto3:'https://picsum.photos/200/200/?image='+Math.ceil(Math.random()*800),//随机头像
                enterMsg:[],
                ti:'',
                report:false,//举报气泡
                titleLength:0,//商品标题超过该长度开始滚动
                randomOnline:100,
            }
        },
        watch:{
			// myChatData(val){
            //     console.log(val);
            //     this.groupData = val
            // },
			groupReceived(val){
                console.log(val);
                this.groupReceived = val
                if(this.groupReceived.uid == this.travelerUid){
                    this.groupReceived.color = this.bubblesColor[this.myColor]
                }else{
                   this.groupReceived.color = this.bubblesColor[Math.floor(Math.random()*7)] 
                }
                this.myChatData.push(this.groupReceived)
            },
            group_messsage(val){
                console.log("变化一次----------",this.enterMsg);
                this.group_messsage = val
                this.enterMsg.push(this.group_messsage.msg)
                this.randomOnline++
                // if(this.enterMsg.length>1){
                //     this.ti = setTimeout(()=>{
                //         this.enterMsg.push(this.group_messsage.msg)
                //         this.enterMsg.shift()
                //         console.log('计时器',this.enterMsg);
                //         clearTimeout(this.ti)
                //     },3600)

                // }else{
                   
                // }
            }
		},
		computed:{
			// myChatData(){
			// 	return this.$store.state.groupData
            // },
			groupReceived:{
				get: function () {
					return this.$store.state.groupReceived
				},
				set: function () {

				}
            },
            group_messsage:{
                get: function () {
                    console.log("加入成功回调",this.$store.state.group_messsage);
                    if(!this.$store.state.group_messsage.data){
                        var data = {
                            data:{online_nums:0}
                        }
                        return data
                    }
					return this.$store.state.group_messsage
				},
				set: function () {
                    
				}
            }
		},
        created(){
            this.randomOnline += parseInt(this.group_messsage.data.online_nums)*Math.ceil(Math.random()*10)
            if(this.$route.params.data){//如果从分享进来，就没有这些参数
                this.liveInfo = this.$route.params.data
                this.getProduct()
            }
            console.log('>>>>>>>直播间信息',this.liveInfo,this.group_messsage);
            var joinData = {
                type: 'join_live_group',
                nickname:this.$store.state.userInfo.allInfo.nickname||'游客'+this.travelerUid,
                group_id:this.liveInfo.group_id
            }
            this.$store.dispatch('chatOnSend',joinData)//加入聊天室
            if(this.token){
                var data = {
                    token:this.token,
                    business_id:this.liveInfo.mid
                }
                this.getShopInfo(data,(res)=>{
                    this.isFollow = res.data.data.is_concern
                })
            }else{  //是游客
                
            }
            
            this.wxConfig(this.defaultShare)
        },
        mounted () {
            this.oInp = this.$el.querySelector("#oInp");
            this.container = this.$el.querySelector(".chat-text");
            this.scrollToBottom();
			if(this.thisIsIphone){
				// document.body.addEventListener('focusin', () => {
				// 	//软键盘弹出的事件处理
				// })
				document.body.addEventListener('focusout', () => {
					//软键盘收起的事件处理
					this.oInp.scrollIntoView(true);
				})

            }
		},
		//每次页面渲染完之后滚动条在最底部
		updated(){
			this.scrollToBottom();
        },
        destroyed(){
            clearTimeout(this.ti)
            var leaveData = {
                type: 'leave_group',
                group_id:this.liveInfo.group_id
            }
            this.$store.dispatch('chatOnSend',leaveData)//离开聊天室
        },
        methods:{
			hideShareModel(){
				this.showShareModel = false
			},
            imgError(item) {
                this[item] ='https://picsum.photos/200/200/?image='+ Math.ceil(Math.random()*800);
                
            },
            reportShop(){
                this.bubbles = []
                this.report = !this.report;
            },
            scrollToBottom () {
				this.$nextTick(() => {
                    try {
                        this.container.scrollTop = this.container.scrollHeight;
                    } catch (error) {
                        
                    }
					
				})
			},
			back(){
				this.$router.go(-1)
            },
			to(arg){
				this.$router.push(arg)
            },
            toGoodInfo(){
                var id = this.productInfo.mid
				if(this.productInfo.room == 1){
					this.$router.push({
						path:'/goodInfo/'+id,
						query:{
                            auctionId:id,
                            fromLive:'live'
						}
					})
				}else{
                    this.$router.push({
                        path:'/goodInfoRemit/'+id,
                        query:{
                            auctionId:id,
                            fromLive:'live'
                        }
                    })
				}
			},
            send(){
                this.bubbles = []
                if(this.myWords == ''){
                    $toast.show("请输入字符",1000);
                    return
                }
				if(this.oInp.autofocus != true){
					this.oInp.focus();
				}
				var data = {
					type:'group_messsage',
					group_id:this.liveInfo.group_id,
					uid:this.myRole||this.travelerUid,
					nickname:this.$store.state.userInfo.allInfo.nickname||'游客'+this.travelerUid,
					head_img:this.$store.state.userInfo.allInfo.photo,
					msg_text:this.myWords
				}
				this.$store.dispatch('chatOnSend',data)
				// this.$store.dispatch('p2pSendMsg',data)
				this.myWords = ''
				
            },
            getProduct(){//获取商品信息
                let that = this
                that.$axios({
                    method:'post',
                    url:that.GLOBAL.develop_url+'live/get_room_info',
                    data:{
                        cid:that.liveInfo.cid,
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
                        that.productInfo = res.data.data
                        that.productInfo.thumb = eval(res.data.data.thumbs)[0].path;
                        that.titleLength = that.productInfo.title.length
                        
                    }
                })
            },
            followHim(){ //是否关注店家
                this.bubbles = []
				let that = this
                that.$axios({
                    method:'post',
                    url:that.GLOBAL.develop_url+'api/concern_shop',
                    data:{
                        token:that.token,
                        business_id:that.liveInfo.mid
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
                        that.isFollow = !that.isFollow
                        $toast.show(res.data.msg, 1000)
                    }else if(res.data.code == "404"){
                        $toast.show(res.data.msg, 1000).then(() => {
                            that.$router.push('/login')
                        })
                    }else{
                        $toast.show(res.data.msg, 1000)
                    }
                })
            },
            addBubbles(){//点击爱心泡泡
                var num  = Math.floor(Math.random()*7);
                var data = {
                    ani:this.flyList[num],
                    color:this.bubblesColor[num]
                }
                this.bubbles.push(data)
                // this.clearDom()
            },
            clearDom(){
                var ti = setInterval(()=>{
                    this.bubbles = []
                    clearInterval(ti)
                },5000)
            }
        }
     }

</script>
<style lang="less" scoped>
.page{
	.live-room{
        width: 100vw;
        // height: 96vh;
        // background: url(../../../../static/live/img.png) no-repeat center center;
        background-size: cover;
        #my-video{
            // position: fixed;
            width: 100vw;
            height: 40vh;
            // margin-top: 12vh;
            background-color: #000;
            z-index: 3;
        }
        .top{
            height: 14vh;
            padding: .5rem .2rem;
            display: flex;
            display: -webkit-flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            z-index: 4;
            .singer{
                height: fit-content;
                display: flex;
                display: -webkit-flex;
                align-items: center;
                flex-direction: row;
                justify-content: space-between;
                background-color: rgba(0,0,0,0.4);
                border-radius: 2rem;
                z-index: 4;
                .photo{
                    display: flex;
                    display: -webkit-flex;
                    align-items: center;
                    padding: .06rem;
                    img{ 
                        width: .68rem;
                        height: .68rem;
                        border-radius: .4rem;
                    }
                }
                .info{
                    color:#fff;
                    font-size: .2rem;
                    text-align: center;
                    transform: scale(0.92,0.92);
                    p{
                        &:first-child{
                            white-space:nowrap;
                            overflow: hidden;
                            width: 1.7rem;
                            text-overflow: ellipsis;
                        }
                    }
                }
                .unfocus{
                    text-align: center;
                    width: .9rem;
                    border-radius: .5rem;
                    background-color: #fff;
                    color: #f18955;
                    font-size: .2rem;
                    line-height: .4rem;
                    padding: .04rem;
                    margin: 0 .1rem;
                }
                .focus{
                    text-align: center;
                    width: .9rem;
                    border-radius: .5rem;
                    background-color: #f18955;
                    color: #fff;
                    font-size: .2rem;
                    line-height: .4rem;
                    padding: .04rem;
                    margin: 0 .1rem;
                }
            }
            .fans{
                display: flex;
                display: -webkit-flex;
                flex-direction: row;
                .no{
                    position: relative;
                    height: .64rem;
                    margin-right: .2rem;
                    .fans-photo{
                        width: .64rem;
                        height: .64rem;
                        border-radius: .4rem;
                    }
                    .crown{
                            position: absolute;
                            bottom: 0%;
                            left: 74%;
                            width: 38%;
                        } 
                    &:nth-child(1){
                        .fans-photo{
                           border:1px solid #f6d01f; 
                        }
                        .crown{
                            top: -16%;
                        } 
                    }  
                    &:nth-child(2){
                        .fans-photo{
                            border:1px solid #fa763a;
                        }
                    }
                    &:nth-child(3){
                        .fans-photo{
                            border:1px solid #3e93f6;
                        }
                    }
                }
            }
            .close{
                z-index: 4;
               .guide_item{
                    height: 100%;
                    .icon_style{
                        display: inline-block;
                        width: .6rem;
                        height: .6rem;
                    }
                }  
                img{
                    width: .6rem;
                    height: .6rem;
                }
            }
        }
        .hot{
            display: flex;
            display: -webkit-flex;
            flex-direction: row; 
            z-index: 4;
            .hot-num{
                display: flex;
                display: -webkit-flex;
                align-items: center;
                width: 2.4rem;
                height: .7rem;
                background-color: rgba(0,0,0,0.4);
                border-top-right-radius: 1.2rem;
                border-bottom-right-radius: 1.2rem;
                padding: .2rem;
                margin-right: .4rem;
                z-index: 4;
                img{
                    width: .32rem;
                    margin-right: .1rem;
                }
                span{
                    font-size: .24rem;
                    color: #fff;
                }
            }
        }
        .talk-box{
            width: 100%;
            height: 46vh;
            position: relative;
            bottom: 0;
            color: #929292;
            .coming{ //欢迎XXX进房间动画
                position: absolute;
                z-index: 3;
                right: -58%;
                top: 2%;
                opacity: 0;
                background-color: #e87439;
                padding: .08rem;
                border-radius: 16px;
                animation: enter 3s ease-in-out 1s;
                @keyframes enter {
                    0%{
                       right: -58%;
                       opacity: 0; 
                    }
                    35%{
                        right: 4%;
                        opacity: 1;
                    }
                    65%{
                        right: 4%;
                        opacity: 1;
                    }
                    100%{
                        right: -58%;
                        opacity: 0; 
                    }
                }
                p{
                    color: #fff;
                    padding: 0 .2rem;
                }
            }
            .product{
                position: absolute;
                z-index: 3;
                bottom: 66%;
                right: 4%;
                .good{
                    display: flex;
                    display: -webkit-flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    background-color: #fff;
                    border-radius: 10px;
                    padding: .1rem;
                    img{
                        width: 1rem;
                        height: 1rem;
                        padding: .1rem;
                    }
                    .good-detail{
                        font-size: .24rem;
                        div{  
                            white-space:nowrap;
                            overflow: hidden;
                            width: 2.2rem;
                        }
                        .too-long{
                            animation: title 10s linear infinite 1s;
                            @keyframes title {
                                from{
                                    text-indent: 0rem;
                                }
                                20%{
                                    text-indent: 0rem;
                                }
                                80%{
                                    text-indent: -5.3rem;
                                }
                                to{
                                    text-indent: -5.3rem;
                                }
                            }
                        }
                    }
                }
            }
            .enter-shop{
                position: absolute;
                z-index: 3;
                bottom: 22%;
                right: 0%;
                width: 2.8rem;
                height: 2.8rem;  
            }
            .talk{
                margin-left: .2rem;
            }
            .chat-text{
                padding: .1rem .3rem;
                font-size: .26rem;
                line-height: .4rem;
                height: 38vh;
                overflow: scroll;
                div{
                    margin-top: .14rem;
                    .bubble{
                        background-color: #fff;
                        padding: .12rem .2rem;
                        border-radius: 18px;
                        display: inline-block;
                        span{
                            color:#e47373;
                        }
                    }  
                }
            }
            .com-input{
                width: 100%;
                display: flex;
                display:-webkit-flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                background-color: #fff; 
                position: absolute;
                bottom: 0;
                left: 0;
                .goods{
                    margin: 0 auto;
                    .button-light{
                        width: 1.21rem;
                        color: #E87439;
                        border: 1px solid #E87439;
                        max-height: .7rem;
                        line-height: .7rem;
                        min-height: 0!important;
                    }
                }
                .send-btn{
                    margin: 0 auto;
                    .button-positive{
                        width: 1.06rem;
                        max-height: .64rem;
                        line-height: .66rem;
                        min-height: 0!important;
                        font-size: .25rem;
                    }
                }
                .report{
                    position: absolute;
                    top: 4.2rem;
                    right: 1.8rem;
                    background-color: #fff;
                    padding: .18rem;
                    color: #929292;
                    z-index: 4;
                    border-radius: 5px;
                    text-align: center;
                    &:before{
                        content: '';
                        display: block;
                        width: .35rem;
                        height: .125rem;
                        position: absolute;
                        top: .56rem;
                        left: 0.14rem;
                        border-bottom: 5px solid transparent;
                        border-right: .2rem solid #fff;
                        border-top: 13px solid transparent;
                        transform: rotate(-216deg);
                        z-index: 4;
                    }
                }
                .guide_item{
                    height: 100%;
                    margin-right: .34rem;
                    // position: relative;
                    .icon_style{
                        display: inline-block;
                        width: .5rem;
                        height: .5rem;
                    }
                    .icon_style_fly{
                        display: inline-block;
                        position: absolute;
                        width: .5rem;
                        height: .5rem;
                        bottom: 85%;
                        right: 5%;
                        z-index: 4;
                        opacity: 0;
                    }
                    .fly1{
                        animation: fly1 1.5s linear forwards;
                        @keyframes fly1 {
                            from{
                                bottom: 4.6%;
                                right: 5%;
                                opacity: 1;
                            }
                            50%{
                               bottom: 50%;
                                right: 17%; 
                                transform: scale(1.4)
                            }
                            to{
                                bottom: 100%;
                                right: 8%;
                                opacity: 0;
                                transform: scale(1.7)
                            }
                        }
                    }
                    .fly2{
                        animation: fly2 1.5s linear forwards;
                        @keyframes fly2 {
                            from{
                                bottom: 4.6%;
                                right: 5%;
                                opacity: 1;
                            }
                            50%{
                               bottom: 40%;
                                right: 25%; 
                                transform: scale(1.5)
                            }
                            to{
                                bottom: 85%;
                                right: 2%;
                                opacity: 0;
                                transform: scale(1.77)
                            }
                        }
                    }
                    .fly3{
                        animation: fly3 1.5s linear forwards;
                        @keyframes fly3 {
                            from{
                                bottom: 4.6%;
                                right: 5%;
                                opacity: 1;
                            }
                            50%{
                               bottom: 77%;
                                right: 17%; 
                                transform: scale(1.34)
                            }
                            to{
                                bottom: 100%;
                                right: 30%;
                                opacity: 0;
                                transform: scale(1.7)
                            }
                        }
                    }
                    .fly4{
                        animation: fly4 1.5s linear forwards;
                        @keyframes fly4 {
                            from{
                                bottom: 4.6%;
                                right: 5%;
                                opacity: 1;
                            }
                            50%{
                               bottom: 60%;
                                right: 0%; 
                                transform: scale(1.2)
                            }
                            to{
                                bottom: 100%;
                                right: 25%;
                                opacity: 0;
                                transform: scale(1.7)
                            }
                        }
                    }
                    .fly5{
                        animation: fly5 1.5s linear forwards;
                        @keyframes fly5 {
                            from{
                                bottom: 4.6%;
                                right: 5%;
                                opacity: 1;
                            }
                            50%{
                               bottom: 30%;
                                right: 2%; 
                                transform: scale(1.5)
                            }
                            to{
                                bottom: 70%;
                                right: 24%;
                                opacity: 0;
                                transform: scale(1.8)
                            }
                        }
                    }
                    .fly6{
                        animation: fly6 1.5s linear forwards;
                        @keyframes fly6 {
                            from{
                                bottom: 4.6%;
                                right: 5%;
                                opacity: 1;
                            }
                            50%{
                               bottom: 34%;
                                right: 23%; 
                                transform: scale(1.2)
                            }
                            to{
                                bottom: 89%;
                                right: 31%;
                                opacity: 0;
                                transform: scale(1.4)
                            }
                        }
                    }
                    .fly7{
                        animation: fly7 1.5s linear forwards;
                        @keyframes fly7 {
                            from{
                                bottom: 4.6%;
                                right: 5%;
                                opacity: 1;
                            }
                            50%{
                               bottom: 34%;
                                right: 3%; 
                                transform: scale(1.2)
                            }
                            to{
                                bottom: 89%;
                                right: 31%;
                                opacity: 0;
                                transform: scale(1.4)
                            }
                        }
                    }
                } 

            }
        }
        .default{
            color: #E87439;
        }
    }
}
    
</style>
<style>
 .talk .von-input-wrapper .von-input{
    width: 3rem;
    border: 1px solid #E87439;
    border-radius: 5px;
    max-height: .8rem;
    min-height: 0!important;
    font-size: .28rem!important;
}
.com-input .von-input-wrapper .input-clear{
    top:10px!important;
}
.model .modelBg{
    position: fixed!important;
}
</style>



// WEBPACK FOOTER //
// liveRoom.vue?12ced0de