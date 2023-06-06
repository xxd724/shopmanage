<template>
  <div class="register">
    <!-- 标题 -->
    <h1 class="reg_title">商家后台管理系统</h1>
    <!-- 表单盒子 -->
    <div class="form_box">
      <!-- 邮箱 -->
      <div class="form_group clearFix">
        <div class="form_title fl">邮箱</div>
        <div class="form_input fl">
          <input type="text" placeholder="请输入邮箱" v-model="userInfo.email">
        </div>
      </div>
      <!-- 昵称 -->
      <div class="form_group clearFix">
        <div class="form_title fl">昵称</div>
        <div class="form_input fl">
          <input type="text" placeholder="请输入昵称" v-model="userInfo.nickName">
        </div>
      </div>
      <!-- 密码 -->
      <div class="form_group clearFix">
        <div class="form_title fl">密码</div>
        <div class="form_input fl">
          <input type="password" placeholder="请输入密码" v-model="userInfo.password">
        </div>
      </div>
      <!-- 验证码 -->
      <div class="form_group clearFix">
        <div class="form_title fl">验证码</div>
        <div class="form_input fl valid-input">
          <input type="text" placeholder="请输入六位验证码" v-model="userInfo.codeNum">
        </div>
        <div class="fl vaild_code">
          <button class="btn_send" :disabled="isSend" @click="getcode()">{{codeText}}</button>；
        </div>
      </div>
      <!-- 注册按钮 -->
      <div class="form_group">
        <div class="btn-box">
          <button class="btn-reg" @click="register()">注册</button>
        </div>
      </div>
      <!-- 跳转到登录页面 -->
      <div class="toggleBox clearFix">
        <span class="fr" @click="goLogin()">已有账号，立即登录</span>
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
  name:"Register",
  data(){
    return{
      codeText:"发送验证码",
      isSend:false, //是否禁用验证码发送按钮
      userInfo:{
        email:"",
        nickName:"",
        password:"",
        codeNum:""
      },
      // msg:""
    }
  },
  methods:{
    //获取邮箱验证码函数
    getcode(){
      let data ={email:this.userInfo.email};
      //验证邮箱格式是否正确
      let res=validForm.valid(data);
      if(res.pass===false){
        this.$children[0].showToast({
          msg:res.msg,
          duration:3000
        })
        return;//中止代码，以下代码不执行
      }
      //禁用按钮
      this.isSend=true;
      //倒计时的时间
      let time=5;
      let timer=setInterval(()=>{
        if(time == 0){
          //清除定时器
          clearInterval(timer);
          this.codeText="发送验证码";
          timer=null;
          this.isSend=false;
        }else{
          time--;
          this.codeText=`${time}s后重新发送`;
        }
      },1000)

      //发送请求
      this.axios({
        method:"POST",
        url:"/sendemail",
        data
      }).then(res=>{
        // console.log("res====>",res)
        this.$children[0].showToast({
          msg:res.data.msg,
          duration:3000
        })
      }).catch(err=>{
        // console.log("err====>",err)
      })
    },
    //注册，验证用户输入信的息
    register(){
      //接收返回的结果
      let res=validForm.valid(this.userInfo);
      //验证失败
      if(res.pass === false){
        // console.log(res.msg)
        // this.msg=res.msg;
        // this.$children[0].$el.style.top="0px";
        // setTimeout(()=>{
        //   this.$children[0].$el.style.top="-52px";
        // },2000)
        this.$children[0].showToast({
          msg:res.msg,
          duration:3000
        })
        return;
      }
      console.log("发送请求");
      //post请求：参数需要写在data
      //get请求：参数需要写在params
      this.axios({
        url:"/register",
        method:"POST",
        data:this.userInfo
      }).then(res=>{
        //请求成功
        console.log("res==>",res)
        if(res.data.code==1000){
          //注册成功跳转到登录页面
          this.goLogin();
        }else{
          //注册失败，显示失败信息
          this.$children[0].showToast({
            msg:res.data.msg
          })
        }
      }).catch(err=>{
        //请求失败
        console.log("err==>",err)
      })
    },
    goLogin(){
      this.$router.push({name:"Login"})
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
.register{
  position:fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-image: url(../assets/images/bg.jpg);
  background-size: cover;
  //标题
  .reg_title{
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
    .valid-input{
      width: 160px;
      margin-right: 20px;
    }
    .vaild_code{
      width: 100px;
      .btn_send{
        width: 100%;
        height: 30px;
        line-height: 30px;
        background-color: #69757e;
        color: #fff;
        border: none;
      }
    }
    .btn-reg{
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
    .fr{
      color:#bbb;
      cursor: pointer;
      &:hover{
        color:#4ea7f7;
      }
    }
  }
}
</style>
