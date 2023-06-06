<template>
  <div class="login">
    <!-- 标题 -->
    <h1 class="log_title">商家后台管理系统</h1>
    <!-- 表单盒子 -->
    <div class="form_box">
      <!-- 邮箱 -->
      <div class="form_group clearFix">
        <div class="form_title fl">邮箱</div>
        <div class="form_input fl">
          <input type="text" placeholder="请输入邮箱" v-model="userInfo.email">
        </div>
      </div>
      <!-- 密码 -->
      <div class="form_group clearFix">
        <div class="form_title fl">密码</div>
        <div class="form_input fl">
          <input type="password" placeholder="请输入密码" v-model="userInfo.password">
        </div>
      </div>
      <!-- 登录按钮 -->
      <div class="form_group">
        <div class="btn-box">
          <button class="btn-log" @click="login()">登录</button>
        </div>
      </div>
      <!-- 跳转到注册页面  -->
      <div class="toggleBox clearFix">
        <span class="fl" @click="goRegister()">没有账号，立即注册</span>
        <span class="fr" @click="goForgetpassword()">忘记密码</span>
      </div>
    </div> 
    <!-- 消息提示框 -->
    <!-- <MsgBox :msg=msg></MsgBox> -->
    <MsgBox></MsgBox>
  </div>
</template>
<script>
//导入表单验证文件
import {validForm} from "../assets/js/validForm";
//导入消息提示组件
import MsgBox from "../components/MsgBox";
export default {
  name:"Login",
  data(){
    return{
      userInfo:{
        email:"",
        password:""
      },
      // msg:""
    }
  },
  methods:{
    login(){
       //接收返回的结果
      let res=validForm.valid(this.userInfo);
      //验证失败
      if(res.pass === false){
        this.$children[0].showToast({
          msg:res.msg,
          duration:3000
        })
        return;
      }
      console.log("发送请求");
      this.axios({
        url:"/login",
        method:"POST",
        data:this.userInfo
      }).then(res=>{
        // this.$cookies.set("_efsf","dsgsa","5d")
        //请求成功
        console.log("res==>",res)
        if(res.data.code==1020){
          //登录成功  保存token值 跳转到main页面
          this.$cookies.set("_ssa",res.data.token,"5d")
          this.$router.push({name:"Type"})
        }else{
          this.$children[0].showToast({
            msg:res.data.msg,
            duration:3000
          })
        }
      }).catch(err=>{
        //请求失败
        console.log("err==>",err)
      })
    },
    goRegister(){
        this.$router.push({name:"Register"})
    },
    goForgetpassword(){
      this.$router.push({name:"Forgetpassword"})
    }
  },
  //组件
  components:{
      MsgBox
  }
}
</script>

<style lang="less" scoped>
//scoped 将当前样式设置为私有，可以防止与其他组件发生样式冲突
.login{
  position:fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-image: url(../assets/images/bg.jpg);
  background-size: cover;
  //标题
  .log_title{
    font-size: 46px;
    color: #fff;
    text-align: center;
    margin: 50px 0 25px;
  }
  //表单盒子
  .form_box{
    width: 400px;
    background-color: #fff;
    border-radius: 8px;
    margin: 0 auto;
    padding: 20px;
    box-sizing: border-box;
    .form_group{
      margin-bottom: 20px;
    }
    .form_title{
      width: 50px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      margin-right: 20px;
    }
    .form_input{
      width: 280px;
      input{
        display: block;
        width:100%;
        height: 30px;
        padding-left: 10px;
        box-sizing: border-box;
        outline: none;
        border: 1px solid #d1d2d1;
        border-radius: 5px;
        &:focus{
          border-color: #02b6fd;
        }
      }
    }
    .btn-log{
      width: 100%;
      height: 38px;
      line-height:38px;
      background-color: #0077ff;
      color: #fff;
      letter-spacing: 20px;
      border: none;
      outline: none;
      font-size: 20px;
    }
  }
  .toggleBox{
    .fr,.fl{
      color:#bbb;
      cursor: pointer;
      &:hover{
        color:#4ea7f7;
      }
    }
  }
}
</style>
