<template>
    <div class="msgBox">{{msg}}</div>
</template>
<script>
export default {
    name:"MsgBox",
    // props:{
    //     msg:{
    //         type:String,
    //         default:"错误信息"
    //     }
    // }
    data(){
        return{
            msg:""
        }
    },
    methods:{
        showToast(o){
            this.msg=o.msg;
            this.$el.style.top="0px";
            setTimeout(()=>{
                this.$el.style.top="-52px";
            },o.duration || 2000)
        }
    }
}
</script>
<style lang="less" scoped>
.msgBox{
    width: 400px;
    height: 52px;
    background-color: #f2dede;
    color: #a94442;
    position: fixed;
    top: -52px;
    left: 50%;
    line-height: 52px;
    text-align: center;
    margin-left: -200px;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    transition: top 0.3s linear;
    z-index: 9999;
}
</style>