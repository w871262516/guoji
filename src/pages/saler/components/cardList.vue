<template>
	<div class="cardLists">
        <list class="list-ios item-icon-right mt30">
            <item @click.native="goTo(item.id,index)" v-for="(item,index) in bankCardsLists">
                <div class="cardBox">
                    <img src="../../../../static/common/alipayIcon.png"/>
                    <div class="columBox">
                        <p>{{item.bankname}}({{item.cardLast4}})</p>
                        <span>单笔最高限额50000元</span>
                    </div>
                    <img class="checked" src="../../../../static/common/checked.png" v-show="item.id == checkId"/>
                </div>
            </item>
        </list>
    </div>
</template>

<script>
	import svgs from '../../mine/components/svgs.vue'
	export default{
		name:'cardList',
		props:['bankCardsLists','url'],
		components:{
			svgs
		},
		data(){  
			return{
                checkId:''
			}
        },
        created(){  
            
        },
        methods:{
			goTo(id,index){
                if(this.url==''){
                    this.$emit('getCardId',id)
                    this.checkId = id
                    
                }else{
                    // this.$router.push(this.url)
                }
				
			},
        },
	}
</script>

<style scoped lang="less">
.cardLists{
    .list-ios{
        padding-right: 0 !important;
        .item{
            padding-top: .15rem !important;
            padding-bottom: .15rem !important;
            .cardBox{
                display: flex;
                display: -webkit-flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: center;
                height: .8rem;
                img{
                    display: block;
                    width: .6rem;
                    height: .6rem;
                    margin-right: .25rem;
                }
                .columBox{
                    display: flex;
                    display: -webkit-flex;
                    justify-content: flex-start;
                    flex-direction: column;
                    span{
                        color: #9C9A9A;
                        margin-top: .1rem;
                    }
                }
                .checked{
                    position: absolute;
                    right: 0;
                    width: .5rem;
                    height: .5rem;
                }
            }
        }
    }
}
</style>