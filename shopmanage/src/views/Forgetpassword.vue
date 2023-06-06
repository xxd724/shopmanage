<template>
  <div class="forget">
    <h1 class="reg_title">商家后台管理系统</h1>
    <div class="form_box">
      <!-- 邮箱 -->
      <div class="form_group clearFix">
        <div class="form_title fl">邮箱</div>
        <div class="form_input fl">
          <input
            type="text"
            placeholder="请输入邮箱"
            v-model="userInfo.email"
          />
        </div>
      </div>
      <!-- 密码 -->
      <div class="form_group clearFix">
        <div class="form_title fl">新密码</div>
        <div class="form_input fl">
          <input
            type="password"
            placeholder="请输入密码"
            v-model="userInfo.password"
          />
        </div>
      </div>
      <div class="form_group clearFix">
        <div class="form_title fl">确认密码</div>
        <div class="form_input fl">
          <input
            type="password"
            placeholder="请输入密码"
            v-model="userInfo.reqpassword"
          />
        </div>
      </div>
      <!-- 验证码 -->
      <div class="form_group clearFix">
        <div class="form_title fl">验证码</div>
        <div class="form_input fl valid-input">
          <input
            type="text"
            placeholder="请输入六位验证码"
            v-model="userInfo.codeNum"
          />
        </div>
        <div class="fl vaild_code">
          <button class="btn_send" :disabled="isSend" @click="getcode()">{{codeText}}</button>
        </div>
      </div>
      <!-- 修改按钮 -->
      <div class="form_group">
        <div class="btn-box">
          <button class="btn-rev" @click="revise()">修改</button>
        </div>
      </div>
      <!-- 跳转到登录页面 -->
      <div class="toggleBox clearFix">
        <span class="fl" @click="goLogin()">返回登录</span>
        <!-- <span class="fl">返回登录</span> -->
      </div>
    </div>
    <MsgBox></MsgBox>
  </div>
</template>

<script>
//导入表单验证文件
import { validForm } from "../assets/js/validForm";
//导入消息提示组件
import MsgBox from "../components/MsgBox";
export default {
  name: "Forgetpassword",
  data() {
    return {
      codeText: "发送验证码",
      isSend: false, //是否禁用验证码发送按钮
      userInfo: {
        email: "",
        password: "",
        codeNum: "",
        reqpassword:""
      }
    };
  },
  methods: {
    //获取邮箱验证码函数
    getcode() {
      let data = { email: this.userInfo.email };
      //验证邮箱格式是否正确
      let res = validForm.valid(data);
    //   console.log("data===>", data);
      if (res.pass === false) {
        this.$children[0].showToast({
          msg: res.msg,
          duration: 3000,
        });
        return; //中止代码，以下代码不执行
      }

      //验证邮箱是否在Business表中
      this.axios({
        method: "POST",
        url: "/checkEmail",
        data,
      })
        .then((res) => {
          if (res.data.code == 1060) {
            this.$children[0].showToast({
              msg: res.data.msg,
              duration: 3000,
            });
            this.userInfo = {};
          } else {
            //禁用按钮
            this.isSend = true;
            //倒计时的时间
            let time = 5;
            let timer = setInterval(() => {
              if (time == 0) {
                //清除定时器
                clearInterval(timer);
                this.codeText = "发送验证码";
                timer = null;
                this.isSend = false;
              } else {
                time--;
                this.codeText = `${time}s后重新发送`;
              }
            }, 1000);
          }
          //   发送请求
          this.axios({
            method: "POST",
            url: "/sendemail",
            data,
          })
            .then((res) => {
            //   console.log("res====>", res);
            })
            .catch((err) => {
            //   console.log("err====>", err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    revise(){
        let res=validForm.valid(this.userInfo);
        if(res.pass === false){
            this.$children[0].showToast({
                msg:res.msg,
                duration:3000
            })
            return;
        }
        if(this.userInfo.password !== this.userInfo.reqpassword){
             this.$children[0].showToast({
                msg:"两次密码不一致",
                duration:3000
            })
            return;
        }
        this.axios({
            method:"POST",
            url:"/revise",
            data:this.userInfo
        }).then(res=>{
            console.log("r------",res)
            if(res.data.code==1063){
                let time=2;
                let timer=setInterval(()=>{
                    if(time == 0){
                        this.goLogin();
                        clearInterval(timer);
                        timer = null;
                    }else{
                        time--;
                        this.$children[0].showToast({
                            msg:res.data.msg,
                            duration:2000
                        })
                    }  
                },1000)
            }else{
                this.$children[0].showToast({
                    msg:res.data.msg
                })
            }
        }).catch(err=>{
            console.log(err)
        })
    },
    goLogin() {
      this.$router.push({ name: "Login" });
    },
  },
  //组件
  components: {
    MsgBox
  },
};
</script>

<style lang="less" scoped>
.forget {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-image: url(../assets/images/bg.jpg);
  background-size: cover;
  .reg_title {
    font-size: 46px;
    color: #fff;
    text-align: center;
    margin: 50px 0 25px;
  }
  .form_box {
    width: 400px;
    background-color: #fff;
    border-radius: 8px;
    margin: 0 auto;
    padding: 20px;
    box-sizing: border-box;
    .form_group {
      margin-bottom: 20px;
    }
    .form_title {
      width: 65px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      margin-right: 15px;
    }
    .form_input {
      width: 280px;
      input {
        display: block;
        width: 100%;
        height: 30px;
        padding-left: 10px;
        box-sizing: border-box;
        outline: none;
        border: 1px solid #d1d2d1;
        border-radius: 5px;
        &:focus {
          border-color: #02b6fd;
        }
      }
    }
    .valid-input {
      width: 160px;
      margin-right: 20px;
    }
    .vaild_code {
      width: 100px;
      .btn_send {
        width: 100%;
        height: 30px;
        line-height: 30px;
        background-color: #69757e;
        color: #fff;
        border: none;
      }
    }
    .btn-rev {
      width: 100%;
      height: 38px;
      line-height: 38px;
      background-color: #0077ff;
      color: #fff;
      letter-spacing: 20px;
      border: none;
      outline: none;
      font-size: 20px;
    }
    .toggleBox {
      .fl {
        color: #bbb;
        cursor: pointer;
        &:hover {
          color: #4ea7f7;
        }
      }
    }
  }
}
</style>