import Vue from 'vue'
import vuex from 'vuex'

import Vonic from 'vonic'
import SDK from '../sdk/NIM_Web_SDK_v5.8.0'
Vue.use(vuex)

let storeInited = null;//定义一个全局变量，作为中间商代替store上下文
var data={}
//store执行逻辑  actions -> mutations -> state
//1.send到服务器后 onmessage回来的数据 存在storeInited.state.socketData,
//2.由于上下拉刷新 以及 websocket重用度很高，因此要对服务器返回的数据 进行type 分类 ：setAppData()
//3.涉及到上下拉刷新的页面data对象 都需要增加一个loadFinish、isAll属性 分别进行上下拉动画、是否加载完所有数据的提示

const state = {
	applyInfo:{//个人中心申请入驻信息
		status:'',//审核状态
		reason:''//拒绝原因
	},
	userInfo:{//个人信息
		token:'',//用户token
		allInfo:{//个人中心的数据
			nickName:'',
			photo:'',
			follow:'',
			like:'',
			fans:'',
			scope:'',
			money:'',
			coupon:'',
			message:''
		},
		editInfo:{//编辑修改个人信息的表单
			photo:'',
			realname:'',
			nickname:'',
			mobile:'',
			email:''
		},
		searchStoreHistoryLists:[],//店铺页搜索历史
		searchHistoryLists:[]//搜索页 搜索历史
	},
	viewData:{//预览我刚编辑的美物志
		title:'',
		content:'',
		imgLists:[]
	},
	classifly:[],//分类数组
	isReconnect:false,
	socket: null,//全局socket对象
	socketData: null,//全局socket返回的数据
	homeData: {data:[],loadFinish:false,isAll:false},//首页数据
	auctionData:{data:[],loadFinish:false,isAll:false},//拍卖页数据
	oneYuanData:{data:[],loadFinish:false,isAll:false},//一元捡漏页数据
	everyDayData:{data:[],loadFinish:false,isAll:false},//每日精品页数据
	tomorrowData:{data:[],loadFinish:false,isAll:false},//明日优选页数据
	niceStoresData:{data:[],loadFinish:false,isAll:false},//优铺页数据
	storesData:{indexData:[],oneList:[],needRoomData:[],remitRoomData:[],newsRoomData:[],lastEndData:[],loadFinish:false,isAll:false,count:{}},//店铺页数据
	goodInfoData: {auctionInfo:{},auctionLog:[],businessInfo:{},auctionRules:'',auctionHistory:[],auction_stat:0,fav_stat:0},//详情页数据
	joinActionData:{code:'',msg:'',list:{price:'',mid:'',coin:1}},//出价的socket返回
	classiflyData:{data:[],loadFinish:false,isAll:false},//分类页数据
	moreRecordsData: {data:[],loadFinish:false,isAll:false},//出价记录页数据
	autoBid:{code:0,msg:'',auctionLog:{price:''},ck_client:'',isEntrust:0,autoAction_stat:1},//委托出价返回数据
	joinRemitData:{code:'',msg:'',list:{price:'',mid:'',coin:1}},//汇拍出价返回数据
	chatData: [],//聊天内容
	nim: null,//SDK实例
	IMstatus:'',//发送状态
	historyData: {},//当前聊天会话的聊天记录
	sendOne: {},//用户发送的消息
	received: {},//接收到的消息
	sessionIdList: [],
	unRead: {},//所有未读消息
	unReadNum: 0,//所有未读消息数量
	teamInfo:0,//直播间群信息
	
}

const mutations = { //通过mutations的方法来改变state对象的属性值
	setApplyStatus(state,data){//设置申请入驻的状态
		state.applyInfo.status = data
	},
	setApplyReason(state,data){//设置申请入驻的拒绝原因
		state.applyInfo.reason = data
	},
	setViewTitle(state,data){//设置预览-我刚编辑美物志的标题
		state.viewData.title = data
	},
	setViewTitle(state,data){//设置预览-我刚编辑美物志的标题
		state.viewData.title = data
	},
	setViewContent(state,data){//设置预览-我刚编辑美物志的内容
		state.viewData.content = data
	},
	setViewImgLists(state,data){//设置预览-我刚编辑美物志的图片列表
		state.viewData.imgLists = data
	},
	setUserToken(state,data){//设置用户token
		console.log(data)
		state.userInfo.token = data
	},
	setEditInfo(state,data){//设置用户信息
		state.userInfo.editInfo = data
	},
	setSearchHistory(state,data){//设置搜索页搜索历史
		if(JSON.stringify(state.userInfo.searchHistoryLists).indexOf(JSON.stringify(data))== -1){
			state.userInfo.searchHistoryLists.push(data)
		}
	},
	setSearchStoreHistoryLists(state,data){//设置店铺搜索的搜索历史
		if(JSON.stringify(state.userInfo.searchStoreHistoryLists).indexOf(JSON.stringify(data))== -1){
			state.userInfo.searchStoreHistoryLists.push(data)
		}
	},
	setClassifly(state,data){//设置分类数组
		state.classifly = data
	},
	setAppData(state,data) { //处理socket返回的数据
		state.homeData.loadFinish = true
		switch (data.path){
			case "home"://首页数据
				let hd = state.homeData
				if(data.page==1){//默认首页打开时 、下拉刷新时 处理数据
					hd.data = data.list
					hd.isAll = false
					hd.disableBottom = false
				}
				if(data.page>1 && data.list.length > 0){//上拉加载时 并且返回数据不为空时
					hd.isAll = false
					hd.disableBottom = false
					data.list.forEach(item=>{
						hd.data.push(item)
					})
				}
				if(data.list.length < 1 || !data.list){//判断是否还返回数据  如果分页数据加载完
					hd.isAll = true
					hd.disableBottom = true
				}
				break;
			case "auction"://拍卖页数据
				let ad = state.auctionData
				if(data.page==1){//默认首页打开时 、下拉刷新时 处理数据
					ad.data = data.list
					ad.isAll = false
					ad.disableBottom = false
				}
				if(data.page>1 && data.list.length > 0){//上拉加载时 并且返回数据不为空时
					ad.isAll = false
					ad.disableBottom = false
					data.list.forEach(item=>{
						ad.data.push(item)
					})
				}
				if(data.list.length < 1 || !data.list){//判断是否还返回数据  如果分页数据加载完
					ad.isAll = true
					ad.disableBottom = true
				}
				break;
			case "oneYuan"://一元捡漏页数据
				let oy = state.oneYuanData
				if(data.page==1){//默认首页打开时 、下拉刷新时 处理数据
					oy.data = data.list
					oy.isAll = false
					oy.disableBottom = false
				}
				if(data.page>1 && data.list.length > 0){//上拉加载时 并且返回数据不为空时
					oy.isAll = false
					oy.disableBottom = false
					data.list.forEach(item=>{
						oy.data.push(item)
					})
				}
				if(data.list.length < 1 || !data.list){//判断是否还返回数据  如果分页数据加载完
					oy.isAll = true
					oy.disableBottom = true
				}
				break;
			case "everyDay"://每日精品页数据
				let ed = state.everyDayData
				if(data.page==1){//默认首页打开时 、下拉刷新时 处理数据
					ed.data = data.list
					ed.isAll = false
					ed.disableBottom = false
				}
				if(data.page>1 && data.list.length > 0){//上拉加载时 并且返回数据不为空时
					ed.isAll = false
					ed.disableBottom = false
					data.list.forEach(item=>{
						ed.data.push(item)
					})
				}
				if(data.list.length < 1 || !data.list){//判断是否还返回数据  如果分页数据加载完
					ed.isAll = true
					ed.disableBottom = true
				}
				break;
			case "tomorrow"://每日精品页数据
				console.log(state.tomorrowData)
				let td = state.tomorrowData
				if(data.page==1){//默认首页打开时 、下拉刷新时 处理数据
					td.data = data.list
					td.isAll = false
					td.disableBottom = false
				}
				if(data.page>1 && data.list.length > 0){//上拉加载时 并且返回数据不为空时
					td.isAll = false
					td.disableBottom = false
					data.list.forEach(item=>{
						td.data.push(item)
					})
				}
				if(data.list.length < 1 || !data.list){//判断是否还返回数据  如果分页数据加载完
					td.isAll = true
					td.disableBottom = true
				}
				break;
			case "niceStores"://优铺页数据
				let ns = state.niceStoresData
				if(data.page==1){//默认首页打开时 、下拉刷新时 处理数据
					ns.data = data.list
					ns.isAll = false
					ns.disableBottom = false
				}
				if(data.page>1 && data.list.length > 0){//上拉加载时 并且返回数据不为空时
					ns.isAll = false
					ns.disableBottom = false
					data.list.forEach(item=>{
						ns.data.push(item)
					})
				}
				if(data.list.length < 1 || !data.list){//判断是否还返回数据  如果分页数据加载完
					ns.isAll = true
					ns.disableBottom = true
				}
				console.log(state.niceStoresData)
				break;
			case "store":
				let sd = state.storesData
				if (data.page == 1) {//默认首页打开时 、下拉刷新时 处理数据
					sd.indexData = data.list.index
					sd.oneList = data.list.one_list
					sd.needRoomData = data.list.need_room
					sd.remitRoomData = data.list.remit_room
					sd.newsRoomData = data.list.news_room
					sd.lastEndData = data.list.last_end_room
					sd.count = data.list.count
					sd.isAll = false
					sd.disableBottom = false
				}else if (data.list.index.length > 0||data.list.remit_room.length > 0||data.list.last_end_room.length > 0) {//上拉加载时 并且返回数据不为空时
					
					sd.isAll = false
					sd.disableBottom = false
					data.list.index.forEach(item=>{
						sd.indexData.push(item)
					})
					data.list.need_room.forEach(item=>{
						sd.needRoomData.push(item)
					})
					data.list.last_end_room.forEach(item=>{
						sd.lastEndData.push(item)
					})
				}else if (data.list.index.length < 1 || data.list.remit_room.length < 1 || data.list.last_end_room.length < 1 || !data.list) {//判断是否还返回数据  如果分页数据加载完
					sd.isAll = true
					sd.disableBottom = true
				}
				break;
			case "goodInfo"://详情页数据
				let gd = state.goodInfoData
				let imgs = data.auction.content
				// imgs = imgs.match(/src=[\'\"]?([^\'\"]*)[\'\"]?/ig)//处理底部商品详情图字符串
	    		// for(let i = 0; i < imgs.length; i ++){ //处理底部商品详情图字符串
    			// 	imgs[i] = imgs[i].replace("src=",'').replace(/"/g,'')
				// }
				imgs = eval(imgs)
	    		data.auction.content = imgs
				gd.auctionInfo = data.auction
				gd.auctionLog = data.auction_log
				gd.businessInfo = data.business_info
				gd.auctionRules = data.auction_rule
				gd.auction_stat = data.auction_stat
				gd.fans_stat = data.fans_stat
				gd.fav_stat = data.fav_stat
				gd.auctionHistory = data.auction_history
				break;
			case "joinAction"://用户出价监听 返回数据
				let ja = state.joinActionData
				ja.code = data.code
				ja.msg = data.msg
				if(data.auction_log){
					ja.list = data.auction_log
				}
				if(data.ck_client == "group"){ //检测响应回来的出价 是否为group(通知全部人)
					if(data.time){ // 如果商品当前剩余倒计时为10秒
						state.goodInfoData.auctionInfo.time = data.time
					}
					state.homeData.data.forEach(i=>{//遍历首页数据 绑定对应商品的信息：mid、price/time
						if(parseInt(i.id) == parseInt(data.id)){
							if(data.time){
								i.time = data.time
							}
							i.price = data.auction_log.price
							i.mid = data.auction_log.mid
						}
					})
					state.auctionData.data.forEach(i=>{//遍历拍卖页数据 绑定对应商品的信息：mid、price/time
						if(parseInt(i.id) == parseInt(data.id)){
							if(data.time){
								i.time = data.time
							}
							i.price = data.auction_log.price
							i.mid = data.auction_log.mid
						}
					})
					state.oneYuanData.data.forEach(i=>{//遍历一元捡漏页数据 绑定对应商品的信息：mid、price/time
						if(parseInt(i.id) == parseInt(data.id)){
							if(data.time){
								i.time = data.time
							}
							i.price = data.auction_log.price
							i.mid = data.auction_log.mid
						}
					})
					state.storesData.needRoomData.forEach(i=>{//遍历商家中心必拍页数据 绑定对应商品的信息：mid、price/time
						if(parseInt(i.id) == parseInt(data.id)){
							if(data.time){
								i.time = data.time
							}
							i.price = data.auction_log.price
							i.mid = data.auction_log.mid
						}
					})
					state.classiflyData.data.forEach(i=>{ //遍历分类页数据 绑定对应商品的信息：mid、price/time
						if(parseInt(i.id) == parseInt(data.id)){
							if(data.time){
								i.time = data.time
							}
							i.price = data.auction_log.price
							i.mid = data.auction_log.mid
						}
					})
				}
				break;
			case "autoBid"://委托出价
				let ab = state.autoBid
				ab.code = data.code
				ab.msg = data.msg
				if(data.ck_client){
					ab.ck_client = data.ck_client					
				}
				if(data.ck_client == "client"){
					ab.isEntrust = data.isEntrust
					if(parseInt(data.isEntrust) == 1){
						state.goodInfoData.auctionInfo.isEntrust = 1
					}else{
						state.goodInfoData.auctionInfo.isEntrust = 0
					}
					if(parseInt(data.auction_stat) == 1){
						state.goodInfoData.auctionInfo.auction_stat = 1
					}else if(parseInt(data.auction_stat) == 0){
						state.goodInfoData.auctionInfo.auction_stat = 0
					}
				}
				if(data.auction_log){
					ab.auctionLog = data.auction_log
				}
				if(data.ck_client == "group"){ //检测响应回来的出价 是否为group(通知全部人)
					if(data.time){ // 如果商品当前剩余倒计时为10秒
						state.goodInfoData.auctionInfo.time = data.time
					}
					state.homeData.data.forEach(i=>{//遍历首页数据 绑定对应商品的信息：mid、price/time
						if(parseInt(i.id) == parseInt(data.id)){
							if(data.time){
								i.time = data.time
							}
							if(data.auction_log){
								i.price = data.auction_log.price
								i.mid = data.auction_log.mid
							}
						}
					})
					state.auctionData.data.forEach(i=>{//遍历拍卖页数据 绑定对应商品的信息：mid、price/time
						if(parseInt(i.id) == parseInt(data.id)){
							if(data.time){
								i.time = data.time
							}
							if(data.auction_log){
								i.price = data.auction_log.price
								i.mid = data.auction_log.mid
							}
						}
					})
					state.oneYuanData.data.forEach(i=>{//遍历一元捡漏页数据 绑定对应商品的信息：mid、price/time
						if(parseInt(i.id) == parseInt(data.id)){
							if(data.time){
								i.time = data.time
							}
							if(data.auction_log){
								i.price = data.auction_log.price
								i.mid = data.auction_log.mid
							}
						}
					})
					state.storesData.needRoomData.forEach(i=>{//遍历商家中心必拍页数据 绑定对应商品的信息：mid、price/time
						if(parseInt(i.id) == parseInt(data.id)){
							if(data.time){
								i.time = data.time
							}
							if(data.auction_log){
								i.price = data.auction_log.price
								i.mid = data.auction_log.mid
							}
						}
					})
					state.classiflyData.data.forEach(i=>{ //遍历分类页数据 绑定对应商品的信息：mid、price/time
						if(parseInt(i.id) == parseInt(data.id)){
							if(data.time){
								i.time = data.time
							}
							if(data.auction_log){
								i.price = data.auction_log.price
								i.mid = data.auction_log.mid
							}
						}
					})
				}
				break;
			case "joinRemit"://汇拍出价
				let jr = state.joinRemitData
				jr.code = data.code
				jr.msg = data.msg
				if(data.auction_log){
					jr.list = data.auction_log
				}
				if(data.ck_client == "group"){ //检测响应回来的出价 是否为group(通知全部人)
					if(data.time){ // 如果商品当前剩余倒计时为10秒
						state.goodInfoData.auctionInfo.time = data.time
					}
					state.homeData.data.forEach(i=>{//遍历首页数据 绑定对应商品的信息：mid、price/time
						if(parseInt(i.id) == parseInt(data.id)){
							if(data.time){
								i.time = data.time
							}
							i.price = data.auction_log.price
							i.mid = data.auction_log.mid
						}
					})
					state.auctionData.data.forEach(i=>{//遍历拍卖页数据 绑定对应商品的信息：mid、price/time
						if(parseInt(i.id) == parseInt(data.id)){
							if(data.time){
								i.time = data.time
							}
							i.price = data.auction_log.price
							i.mid = data.auction_log.mid
						}
					})
					state.everyDayData.data.forEach(i=>{//遍历每日精品页数据 绑定对应商品的信息：mid、price/time
						if(parseInt(i.id) == parseInt(data.id)){
							if(data.time){
								i.time = data.time
							}
							i.price = data.auction_log.price
							i.mid = data.auction_log.mid
						}
					})
					state.classiflyData.data.forEach(i=>{ //遍历分类页数据 绑定对应商品的信息：mid、price/time
						if(parseInt(i.id) == parseInt(data.id)){
							if(data.time){
								i.time = data.time
							}
							i.price = data.auction_log.price
							i.mid = data.auction_log.mid
						}
					})
				}
				break;
			case "chatting"://联系店家
				let ctd = state.chatData
				
				ctd.push(data)
				break;
			case "moreRecords"://出价记录页数据
				let mrd = state.moreRecordsData
				if(data.page == 1){
					mrd.data = data.auction_log
				}
				if(data.page >1 && data.auction_log.length>0){
					data.auction_log.forEach(i=>{
						mrd.data.push(i)
					})
				}
				if(data.auction_log.length < 1 || !data.auction_log){
					mrd.isAll = true
					mrd.disableBottom = true
				}
				break;
			case "classifly"://分类页数据
				let cd = state.classiflyData
				if(data.page==1){//默认首页打开时 、下拉刷新时 处理数据
					cd.data = data.list
					cd.isAll = false
					cd.disableBottom = false
				}
				if(data.page>1 && data.list.length > 0){//上拉加载时 并且返回数据不为空时
					cd.isAll = false
					cd.disableBottom = false
					data.list.forEach(item=>{
						cd.data.push(item)
					})
				}
				if(data.list.length < 1 || !data.list){//判断是否还返回数据  如果分页数据加载完
					cd.isAll = true
					cd.disableBottom = true
				}
		}
	},
	IMstatus(state, data) {
		//idClient : SDK生成的消息id, 在发送消息之后会返回给开发者, 开发者可以在发送消息的回调里面根据这个ID来判断相应消息的发送状态,
		// 到底是发送成功了还是发送失败了, 然后根据此状态来更新页面的UI。如果发送失败, 那么可以重发消息
		
		state.IMstatus = data
	},
	sessionId(state, data) {// 消息所属的会话对象的ID
		state.sessionId.push(data)
	},
	historyData(state, data) {
		state.historyData[data[0].sessionId] = data

	},
	sendOne(state, data) {//对话信息（发送的）
		state.sendOne = data
		var patt1 = new RegExp("team");
		if (patt1.test(data.sessionId)&&!state.historyData[data.sessionId]) {
			state.historyData[data.sessionId] = []
		}
		state.historyData[data.sessionId].push(state.sendOne)
		
		
	},
	received(state, data) {//对话信息（接收的）
		state.received = data
		
	},
	unRead(state, data) {
		if (data.hasRead) {//进入该聊天页面，标记已读
			delete state.unRead[data.to]
			state.unReadNum -= data.length
		} else {//记录所有未读
			state.unRead[data[0].from] = data
			state.unReadNum += data.length
		}
	},
	teamInfo(state, data) {
		state.teamInfo = data
	}
}

const getters = { //通过getters的方法来处理state对象的属性值
}

const actions = { //通过actions的方法来进行一些异步操作
	initSocket(store) {//socket初始化
		console.log('////////////////////')
		// if(store.state.socket!=null){
		// 	console.log('虽然initSocket，但是并没有往下执行重连代码')
		// 	return
		// }
		try{
			if('WebSocket' in window){
				store.state.socket = new WebSocket("ws://www.paipaiwang.com.cn:7272/")
			}else if('MozWebSocket' in window){
				store.state.socket = new MozWebSocket("ws://www.paipaiwang.com.cn:7272/")
			}
			store.state.socket.onmessage = actions.socketOnMessage
			store.state.socket.onclose = actions.socketOnClose
			storeInited = store;
		}catch(e){
			console.log('有异常！')
			actions.reconnect(store,"ws://www.paipaiwang.com.cn:7272/")
		}
	},
	socketOnSend(store, data) {//socket客户端发送数据
		console.log('本次要发送的数据：'+data)
		store.state.homeData.loadFinish = false //设置首页加载状态：加载中
		store.state.auctionData.loadFinish = false //设置拍卖页加载状态：加载中
		store.state.oneYuanData.loadFinish = false //设置一元捡漏页加载状态：加载中
		store.state.tomorrowData.loadFinish = false //设置明日精品页加载状态：加载中
		store.state.everyDayData.loadFinish = false //设置每日精品页加载状态：加载中
		store.state.niceStoresData.loadFinish = false //设置优铺页加载状态：加载中
		store.state.storesData.loadFinish = false //设置店铺页加载状态：加载中
		store.state.moreRecordsData.loadFinish = false //设置出价记录页加载状态：加载中
		store.state.classiflyData.loadFinish = false //设置分类记录页加载状态：加载中
		let socket = store.state.socket
		if (storeInited == null) {actions.initSocket(store)};
		if (socket.readyState === socket.OPEN) { //当网络不稳定时
			storeInited.state.socket.send(data)
		}else if (socket.readyState === socket.CONNECTING) {
            setTimeout(function () {
       			storeInited.state.socket.send(data)
            }, 700);
		}
	},
	socketOnMessage(evt) { //socket服务器响应数据
		console.log("服务器返回数据：")
		storeInited.state.homeData.loadFinish = true //设置首页加载状态：加载完
		storeInited.state.auctionData.loadFinish = true //设置拍卖页加载状态：加载完
		storeInited.state.oneYuanData.loadFinish = true //设置一元捡漏页加载状态：加载完
		storeInited.state.tomorrowData.loadFinish = true //设置明日精品页加载状态：加载完
		storeInited.state.everyDayData.loadFinish = true //设置每日精品页加载状态：加载完
		storeInited.state.niceStoresData.loadFinish = true //设置优铺页加载状态：加载完
		storeInited.state.storesData.loadFinish = true //设置优铺页加载状态：加载完
		storeInited.state.moreRecordsData.loadFinish = true //设置出价记录页加载状态：加载完
		storeInited.state.classiflyData.loadFinish = true //设置分类页加载状态：加载完
		storeInited.state.socketData = JSON.parse(evt.data)
		if(storeInited.state.socketData.type != "ping"){
			console.log(JSON.parse(evt.data))
			storeInited.commit("setAppData", storeInited.state.socketData)
			//全局监听用户是否中拍，中拍则弹框提醒
			if (storeInited.state.socketData.type == 'auction_result'&&storeInited.state.socketData.mid == localStorage.getItem('mid')) {
				let options = {
					effect: 'scale',
					buttons: [
						{text: '取消'},
						{text: '确定'},
					]
				}
				let text = storeInited.state.socketData.msg
				let order_sn = storeInited.state.socketData.order_sn
				let popup = $popup.fromTemplate('<p style="padding: 0.3rem;text-align:center;">'+text+'</p>', options)
				console.log("中拍后返回的order_sn",order_sn);
				
				popup.show().then((buttonIndex) => {
					if (buttonIndex == 1) {
						console.log("点击确认后的order_sn",order_sn);
						location.href = 'http://www.paipaiwang.com.cn/#'+'/mine/myOrders/waitforPay?order_sn='+order_sn
					}
				})
			}
		}
	},
	socketOnClose(store) {//socket关闭
		console.log('socket on closing', store)
		actions.initSocket(store)
		// store.dispatch('initSocket')
	},
	reconnect(store,url){//重连socket
		if(state.isReconnect) return;
		state.isReconnect = true
			console.log('重连')
		setTimeout(function(){
			console.log('重连中')
			state.socket=null
			storeInited = null
			actions.initSocket(store)
			state.isReconnect = false
		},2000)
	},
	initNimSDK(store, msg) {
		console.log("********************",msg);
		
		  // 初始化SDK
		  store.state.nim = SDK.NIM.getInstance({
			// debug: true,
			appKey: '8e043665d65b4dd9d86961b7aedac98a',
			account: msg,
			token: localStorage.getItem('yx_token'),
			// transports: ['websocket'],
			db: false,
			// logFunc: new SDK.NIM.LoggerPlugin({
			//   url: '/webdemo/h5/getlogger',
			//   level: 'info'
			// }),
			syncSessionUnread: true,
			syncRobots: true,
			autoMarkRead: false, // 是否自动标记消息为已收到,默认情况下(为true)SDK在收到服务器推送过来的消息后, 会在将消息推给开发者时将消息标记为已读状态
			onconnect: function onConnect(event){
				console.log('连接成功',event)
			},
			onerror: function onError (event) {
				console.log('网络连接状态异常',event)
			},
			onwillreconnect: function onWillReconnect (obj) {
				console.log('即将重连');
				console.log(obj.retryCount);
				console.log(obj.duration);
			},
			ondisconnect: function onDisconnect (error) {
			  switch (error.code) {
				// 账号或者密码错误, 请跳转到登录页面并提示错误
				case 302:
					$toast.show('账号或者密码错误，请重新登录', 1500).then(() => {
						location.href = 'http://www.paipaiwang.com.cn/#/login'
					})
					break;
				//重复登录, 已经在其它端登录了, 请跳转到登录页面
				  case 417:
					  $toast.show('已在其它端登录，请重新登录', 1500).then(() => {
						  location.href = 'http://www.paipaiwang.com.cn/#/login'
					  })
					break;
				// 被踢, 请提示错误后跳转到登录页面
				case 'kicked':
					break;
				default:
				  break
			  }
			  },
			onusers: function onUsers(users) {
				console.log('收到用户名片列表', users);
    			data.users = state.nim.mergeUsers(data.users, users);
			},
			onroamingmsgs: function onRoamingMsgs(obj) {
				console.log('收到漫游消息', obj);
				actions.pushMsg(obj.msgs);
				var msgs = obj.msgs  
				store.commit("unRead",obj.msgs)
					
			},
			onofflinemsgs:  function onOfflineMsgs(obj) {
				console.log('收到离线消息', obj);
				actions.pushMsg(obj.msgs);
				var msgs = obj.msgs  
				store.commit("unRead",obj.msgs)
					
			},
			onmsg: function onMsg(msg) {
				store.commit("received", { IMstatus:msg.status, fromNick:msg.fromNick, sessionId:msg.sessionId, text: msg.text, time: timeFormer(Number(msg.time) / 1000), to: msg.to, from: msg.from } )
				console.log('收到消息', msg.scene, msg.type, msg);
				actions.pushMsg(msg);
				switch (msg.type) {
				case 'custom':
					// onCustomMsg(msg);
					break;
				case 'notification':
					// 处理群通知消息
					// onTeamNotificationMsg(msg);
					break;
				// 其它case
				default:
					break;
				}
			  },
			onsessions: function onsessions(sessions) {
			console.log('收到会话列表', sessions);
			actions.onSessions(sessions);
			},
			onupdatesession: function onUpdateSession(session) {
				console.log('会话更新了', session);
				actions.onUpdateSession(session);
			},
			onupdateteammember: function onUpdateTeamMember(teamMember) {
				console.log('群成员信息更新了', teamMember);
				onTeamMembers({
					teamId: teamMember.teamId,
					members: teamMember
				});
			},
			onteammembers:actions.onTeamMembers
		  })
	},
	pushMsg(msgs) {		
        if (!Array.isArray(msgs)) { msgs = [msgs]; }
        var sessionId = msgs[0].scene + '-' + msgs[0].account;
        data.msgs = data.msgs || {};
        data.msgs[sessionId] = state.nim.mergeMsgs(data.msgs[sessionId], msgs);
    },
    onCustomMsg(msg) { 
        // 处理自定义消息
	},
	p2pSendMsg(store, msg) {//发送文本消息
		store.state.nim.sendText({
			scene: msg.scene,
			to: msg.to,
			text: msg.text,
			done: ((error, msg) =>{
				console.log(error);
				console.log(msg);
				console.log('发送' + msg.scene + ' ' + msg.type + '消息------' +msg.text+ (!error ? '-------成功' : '-----失败') + ', id=' + msg.idClient);
				actions.pushMsg(msg);
				if (error) {
					alert("发送失败")
				} else if(msg.scene == 'p2p'){
					store.commit("sendOne", { IMstatus:msg.status, sessionId:msg.sessionId, text: msg.text, time: timeFormer(Number(msg.time) / 1000), to: msg.to, from: msg.from } )
				} else if (msg.scene == 'team') {
					store.commit("sendOne", { IMstatus:msg.status, fromNick:msg.fromNick,  sessionId:msg.sessionId, text: msg.text, time: timeFormer(Number(msg.time) / 1000), to: msg.to, from: msg.from } )
				
				}
			})
		})
	},
	p2pSendFiel(store, msg) {//发送文件消息
		store.state.nim.sendFile({
			scene: 'p2p',
			to: msg.to,
			type: 'image',
			fileInput: msg.fileInput,
			uploadprogress: function(obj) {
				console.log('文件总大小: ' + obj.total + 'bytes');
				console.log('已经上传的大小: ' + obj.loaded + 'bytes');
				console.log('上传进度: ' + obj.percentage);
				console.log('上传进度文本: ' + obj.percentageText);
			},
			uploaddone: function(error, file) {
				console.log('上传' + (!error?'成功':'失败'), error, file);
			},
			beforesend: function(msg) {
				console.log('正在发送p2p image消息, id=' + msg.idClient);
				actions.pushMsg(msg);
			},
			done: ((error,msg) => {
				console.log('发送' + msg.scene + ' ' + msg.type + '消息' + (!error ? '成功' : '失败') + ', id=' + msg.idClient, error, msg);
				if (error) {
					$toast.show("发送失败",1000)
				} else {
					store.commit("sendOne", { IMstatus:msg.status, sessionId:msg.sessionId, file: msg.file, time: timeFormer(Number(msg.time) / 1000), to: msg.to, from: msg.from } )
				}
			})
		});
	},
	previewFile(store, msg){//图片预览
		store.state.nim.previewFile({
			type: 'image',
			fileInput: msg.fileInput,
			uploadprogress: function(obj) {
				console.log('文件总大小: ' + obj.total + 'bytes');
				console.log('已经上传的大小: ' + obj.loaded + 'bytes');
				console.log('上传进度: ' + obj.percentage);
				console.log('上传进度文本: ' + obj.percentageText);
			},
			done: function(error, file) {
				console.log('上传image' + (!error?'成功':'失败'));
				// show file to the user
				// if (!error) {
				// 	var msg = store.state.nim.sendFile({
				// 		scene: 'p2p',
				// 		to: 'account',
				// 		file: file,
				// 		done: sendMsgDone
				// 	});
				// 	console.log('正在发送p2p image消息, id=' + msg.idClient);
				// 	pushMsg(msg);
				// }
			}
		});
	},
	getHistoryMsgs(store,account) {//获取云端历史记录
		store.state.nim.getHistoryMsgs({
			scene: 'p2p',
			to: account,
			asc:true,
			done: ((error,obj) => {
				console.log('获取云端历史记录' + (!error?'成功':'失败'), error, obj);
				if (!error) {
					console.log(obj.msgs);
					if (obj.msgs.length>0) {
						store.commit("historyData",obj.msgs)
					}
					
				}
			})
		})
		
	},
	onSessions(sessions) {
		data.sessions = state.nim.mergeSessions(data.sessions, sessions);
		actions.updateSessionsUI();
		
	},
	onUpdateSession(session) {
		data.sessions = state.nim.mergeSessions(data.sessions, session);
		actions.updateSessionsUI();
	},
	updateSessionsUI() {
		// 刷新界面
	},
	markMsgRead(store,someMsg) {//标记消息为已收到
		console.log('---------待标记的消息或者消息数组----------',someMsg);
		state.nim.markMsgRead(someMsg);
		var data = {
			hasRead: true,
			to: someMsg[0].from,
			length: someMsg.length
		}
		store.commit("unRead",data)
	},
	deleteSession(store,account) {//deleteSessions error: 非法操作或没有权限,好像不能删除
		state.nim.deleteSession({
			scene: 'p2p',
			to: account,
			done: deleteSessionDone
		});
		function deleteSessionDone(error, obj) {
			console.log('删除会话' + (!error ? '成功' : '失败'), error, obj);
			var data = {
				delete: true,
				to:''
			}
			// store.commit("unRead",data)
		}
	},
	applyTeam(store,teamId) {
		state.nim.applyTeam({
			teamId: teamId,
			ps: '',
			done: applyTeamDone
		});
		function applyTeamDone(error, obj) {
			console.log('申请入群' + (!error ? '成功' : '失败'), error, obj);
		}
	},
	leaveTeam(store,teamId) {
		state.nim.leaveTeam({
			teamId: teamId,
			done: leaveTeamDone
		});
		function leaveTeamDone(error, obj) {
			console.log('主动退群' + (!error?'成功':'失败'), error, obj);
		}
	},
	onTeamMembers(obj) {
		console.log('收到群成员', obj);
		var teamId = obj.teamId;
		var members = obj.members;
		data.teamMembers = data.teamMembers || {};
		data.teamMembers[teamId] = state.nim.mergeTeamMembers(data.teamMembers[teamId], members);
		data.teamMembers[teamId] = state.nim.cutTeamMembers(data.teamMembers[teamId], members.invalid);
		
	},
	getTeamMembers(store,teamId) {
		state.nim.getTeamMembers({
			teamId: teamId,
			done: getTeamMembersDone
		});
		function getTeamMembersDone(error, obj) {
			console.log(error);
			console.log(obj);
			console.log('获取群成员' + (!error?'成功':'失败'));
		}
	},
	getTeam(store, teamId) {
		state.nim.getTeam({
			teamId: teamId,
			done: getTeamDone
		});
		function getTeamDone(error, obj) {
			console.log(error);
			console.log(obj);
			console.log('获取群' + (!error?'成功':'失败'));
			if (!error) {
				store.commit('teamInfo',obj)
			}
		}
	},
	// getChatroomAddress(store,chatroomId) {
	// 	state.nim.getChatroomAddress({
	// 		chatroomId: chatroomId,
	// 		done: getChatroomAddressDone
	// 	});
	// 	function getChatroomAddressDone(error, obj) {
	// 		console.log('获取聊天室地址' + (!error?'成功':'失败'), error, obj);
	// 	}
	// },
	//初始化聊天室
	// initChatroomSDK(store, obj) {
	// 	store.state.chatroom = SDK.Chatroom.getInstance({
	// 		appKey: '8e043665d65b4dd9d86961b7aedac98a',
	// 		account: obj.account||'',
	// 		token: localStorage.getItem('yx_token')||'',
	// 		chatroomId: obj.chatroomId,
	// 		chatroomAddresses: [
	// 		  'address1',
	// 		  'address2'
	// 		],
	// 		chatroomNick: obj.chatroomNick,
	// 		chatroomAvatar: obj.chatroomAvatar,
	// 		onconnect: onChatroomConnect,
	// 		onerror: onChatroomError,
	// 		onwillreconnect: onChatroomWillReconnect,
	// 		ondisconnect: onChatroomDisconnect,
	// 		// 消息
	// 		onmsgs: onChatroomMsgs
	// 	  });
	// },
	// initAnonymousChatroomSDK(store, obj) {//游客匿名
	// 	store.state.chatroom = SDK.Chatroom.getInstance({
	// 		appKey: '8e043665d65b4dd9d86961b7aedac98a',
	// 		chatroomId: obj.chatroomId,
	// 		chatroomAddresses: [
	// 		  'address1',
	// 		  'address2'
	// 		],
	// 		chatroomNick: obj.chatroomNick,
	// 		chatroomAvatar: obj.chatroomAvatar,
	// 		isAnonymous: true,
	// 		onconnect: onAnonymousChatroomConnect,
	// 		onerror: onChatroomError,
	// 		onwillreconnect: onChatroomWillReconnect,
	// 		ondisconnect: onChatroomDisconnect,
	// 		// 消息
	// 		onmsgs: onChatroomMsgs
	// 	  });
	// },
	// chatroomSendText(text) {
	// 	var msg = store.state.chatroom.sendText({
	// 		text: text,
	// 		done: sendChatroomMsgDone
	// 	})
	// 	console.log('正在发送聊天室text消息, id=' + msg.idClient);
	// 	function sendChatroomMsgDone(error, msg) {
	// 		console.log('发送聊天室' + msg.type + '消息' + (!error?'成功':'失败') + ', id=' + msg.idClient, error, msg);
	// 	}
	// }
}
// function onAnonymousChatroomConnect (obj) {//匿名进入
// 	// 该处chatroom为全局生成的实例
// 	window.account = store.state.chatroom.account
//   }
// function onChatroomConnect(obj) {
// 	console.log('进入聊天室', obj);
// 	// 连接成功后才可以发消息
//   }
//   function onChatroomWillReconnect(obj) {
// 	// 此时说明 `SDK` 已经断开连接, 请开发者在界面上提示用户连接已断开, 而且正在重新建立连接
// 	console.log('即将重连', obj);
//   }
//   function onChatroomDisconnect(error) {
// 	// 此时说明 `SDK` 处于断开状态, 开发者此时应该根据错误码提示相应的错误信息, 并且跳转到登录页面
// 	console.log('连接断开', error);
// 	if (error) {
// 	  switch (error.code) {
// 	  // 账号或者密码错误, 请跳转到登录页面并提示错误
// 	  case 302:
// 		break;
// 	  // 被踢, 请提示错误后跳转到登录页面
// 	  case 'kicked':
// 		break;
// 	  default:
// 		break;
// 	  }
// 	}
//   }
//   function onChatroomError(error, obj) {
// 	console.log('发生错误', error, obj);
//   }
// function onChatroomMsgs(msgs) {
// 	console.log('收到聊天室消息', msgs);
// }
function timeFormer(t){
	let date = new Date(t * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = date.getFullYear() + '-'; 
    let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    let D = date.getDate() + ' ';
   // let h = date.getHours() + ':';
    let h
    if(date.getHours()>9){
    	h = date.getHours() + ':'
    }else{
    	h ='0'+date.getHours() + ':'
    }
    let m
    if(date.getMinutes()>9){
    	m = date.getMinutes() + ':'
    }else{
    	m ='0'+date.getMinutes() + ':'
    }
    let s
    if(date.getSeconds()>9){
    	s = date.getSeconds()
    }else{
    	s ='0'+date.getSeconds()
    }
    return Y+M+D+h+m+s;
}
export default new vuex.Store({
	state,
	mutations,
	actions,
	getters
});