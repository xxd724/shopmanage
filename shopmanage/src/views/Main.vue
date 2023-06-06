<template>
  <div class="main">
    <!-- 头部 -->
    <div class="header clearFix">
      <!-- 左边logo -->
      <div class="logoText fl">商家后台管理</div>
      <!-- 右边信息 -->
      <div class="infoBox fr clearFix">
        <!-- 头像 -->
        <div class="userImg fl">
          <!-- <img src="../assets/images/default.png" alt /> -->
          <img :src="staticUrl + '/' + userInfo.userImg" alt="">
        </div>
        <!-- 用户名 -->
        <!-- <div class="userName fl">你好，请登录</div> -->
        <div class="userName fl">{{userInfo.nickName}}</div>
        <!-- 设置 -->
        <div class="setting fl" @click="showSet()">
          设置
          <ul :class="['settingList',isShowSet?'showSetting':'']">
            <li @click="showModal('pwdShow')">修改密码</li>
            <li @click="showModal('userImgShow')">更换头像</li>
            <li @click="showModal('nameShow')">修改昵称</li>
          </ul>
        </div>
        <!-- 退出 -->
        <div class="loginOut fl" @click="logout()">退出</div>
      </div>
    </div>
    <!-- 内容区 -->
    <div class="content">
      <!-- 左边侧边栏 -->
      <div class="aside">
        <div class="asideBox">
          <div class="asideItem" v-for="(item,index) in asideData" :key="index">
            <!-- 一级 -->
            <div :class="['itemHeader',item.show?'act':'']" @click="showItemList(index)">
              <i :class="['iconfont',item.icon]"></i>
              {{item.title}}
            </div>
            <!-- 二级 -->
            <ul :class="['itemList',item.show?'':'hide']">
              <li v-for="(v,i) in item.subTitle" :key="i" :class="[v.isAct? 'active' :'']" @click="itemListTap(index,i)">{{v.name}} </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- 右边表格 -->
      <div class="formInfo">
        <router-view></router-view>
      </div>
    </div>
    <!-- 模态框 修改密码 -->
    <div :class="['modal',modalMsg.pwdShow?'showModal':'']">
      <div class="modalBox">
        <!-- 头部 -->
        <div class="modalHeader clearFix">
          <h4 class="modalTitle fl">修改密码</h4>
          <button class="closeModal fr" @click="closeModal('pwdShow')">X</button>
        </div>
        <!-- 内容 -->
        <div class="modalBody">
          <div class="formGroup clearFix">
            <div class="typeName fl">原密码</div>
            <div class="typeInp fl">
              <input type="password" placeholder="输入原密码" v-model="pwd.oldPassword"/>
            </div>
          </div>
          <div class="formGroup clearFix">
            <div class="typeName fl">新密码</div>
            <div class="typeInp fl">
              <input type="password" placeholder="输入原密码" v-model="pwd.newPassword"/>
            </div>
          </div>
        </div>
        <!-- 底部 -->
        <div class="modalFooter clearFix">
          <button class="btn Updatabtn fr" @click="modifyPwd()">确认</button>
        </div>
      </div>
    </div>
    <!-- <MsgBox></MsgBox> -->
    <!-- 模态框 更改头像模态框 -->
    <div :class="['modal',modalMsg.userImgShow?'showModal':'']">
      <div class="modalBox">
        <!-- 头部 -->
        <div class="modalHeader clearFix">
          <h4 class="modalTitle fl">请上传你的头像</h4>
          <button class="closeModal fr" @click="closeModal('userImgShow')">X</button>
        </div>
        <!-- 内容 -->
        <div class="modalBody">
          <Upload @file-upload = "UploadUserImg"></Upload>
        </div>
        <!-- 底部 -->
        <div class="modalFooter clearFix">
          <button class="btn Updatabtn fr" @click="modifyUserImg()">确认</button>
        </div>
      </div>
    </div>
    <!-- 模态框 修改昵称 -->
    <div :class="['modal',modalMsg.nameShow?'showModal':'']">
      <div class="modalBox">
        <!-- 头部 -->
        <div class="modalHeader clearFix">
          <h4 class="modalTitle fl">修改昵称</h4>
          <button class="closeModal fr" @click="closeModal('nameShow')">X</button>
        </div>
        <!-- 内容 -->
        <div class="modalBody">
          <div class="formGroup clearFix">
            <div class="typeName fl">新昵称</div>
            <div class="typeInp fl">
              <input type="text" placeholder="输入新昵称" v-model="userName"/>
            </div>
          </div>
        </div>
        <!-- 底部 -->
        <div class="modalFooter clearFix">
          <button class="btn Updatabtn fr" @click="modifyNickName()">确认</button>
        </div>
      </div>
    </div>
    <MsgBox></MsgBox>
  </div>
</template>

<script>
import { validForm } from '../assets/js/validForm';
import MsgBox from "../components/MsgBox";
import Upload from "../components/Upload";
export default {
  name: "Main",
  data() {
    return {
      //设置列表是否显示
      isShowSet: false,
      //侧边栏数据
      asideData: [
        {
          title: "商品管理", //一级菜单
          show: true, //二级菜单是否显示
          icon: "icon-guanli", //图标类名
          subTitle: [
            {
              name: "商品类型", //二级
              isAct:true, //是否选择状态
            },
            {
              name: "商品列表",
              isAct: false,
            },
          ],
        },
        {
          title: "订单管理",
          show: false,
          icon: "icon-dingdan",
          subTitle: [
            {
              name: "订单列表",
              isAct: false,
            },
          ],
        },
        {
          title: "数据统计",
          show: false,
          icon: "icon-shujutongji",
          subTitle: [
            {
              name: "商品统计",
              isAct: false,
            },
            {
              name: "数据统计",
              isAct: false,
            },
          ],
        },
      ],
      //用户信息
      userInfo:{ 
        userImg:"",
        nickName:""
      },
      //模态框的显示隐藏状态
      modalMsg:{
        pwdShow:false,
        userImgShow:false,
        nameShow:false
      },
      //新旧密码
      pwd:{
        oldPassword:'',
        newPassword:''
      },
      userImgData:{
        userImg:"",
        base64:""
      },
      userName:""
    };
  },
  created(){
    //渲染前获取用户信息
    if(this.$cookies.get("_ssa")==null){
      this.$router.push({name:"Login"})
    }else{
      this.getUserInfo();
    }
    
  },
  methods: {
    //退出登录
    logout(){
      this.$cookies.remove("_ssa");
      this.$router.push({name:"Login"})
    },
    //设置列表显示隐藏切换函数
    showSet() {
      this.isShowSet = !this.isShowSet;
    },
    //一级菜单点击设置二级菜单的显示隐藏切换
    showItemList(index){
      //index：当前点击的列表对应的下标
      //将其他的列表隐藏
      for(let i =0;i<this.asideData.length;i++){
        if(i!=index){
          this.asideData[i].show=false;
        }
      }
      this.asideData[index].show=!this.asideData[index].show;
    },
    //二级菜单的点击事件
    itemListTap(index,id){
      this.asideData.forEach((v) => {
        v.subTitle.forEach((item)=>{
          if(item.isAct){
            item.isAct=false;
          }
        })
      });
      this.asideData[index].subTitle[id].isAct=true;
    },
    //获取用户信息
    getUserInfo(){
      this.axios({
        method:"GET",
        url:"/getUser"
      }).then(res=>{
        if(res.data.code==1060){
          for(let key in res.data.result[0]){
            // console.log(key);
            this.userInfo[key]=res.data.result[0][key];
          }
          console.log(this.userInfo);
        }
      }).catch(err=>{
        console.log(err);
      })
    },
    //确认修改密码事件
    modifyPwd(){
      //验证新密码格式是否正确
      let res =validForm.valid({password:this.pwd.newPassword});
      if(res.pass===false){
        this.$children[2].showToast({
          msg:res.msg
        })
        return;
      }
      //发送请求
      this.axios({
        method:"POST",
        url:"/modifyPwd",
        data:this.pwd
      }).then(res=>{
        this.$children[2].showToast({
          msg:res.data.msg
        })
        if(res.data.code==2010){
          //密码修改成功，重新登录
          this.closeModal("pwdShow");
          setTimeout(()=>{
            this.$router.push({name:"Login"}) 
          },3000)
        }else if(res.data.code == 2012){
          //原密码不正确清空输入框
          this.pwd.newPassword="";
          this.pwd.oldPassword=""
        }
        // console.log(res)

      }).catch(err=>{
        this.$children[2].showToast({
          msg:err.data.msg
        })
        // console.log(err)
      })
    },
    //显示模态框
    showModal(modalName){
      this.modalMsg[modalName]=true;
    },
    //关闭模态框
    closeModal(modalName){
      if(modalName=='userImgShow'){
        this.$children[1].setUrl();
      }else if(modalName=='nameShow'){
        this.userName='';
      }
      this.modalMsg[modalName]=false;
    },
    //上传头像文件
    UploadUserImg(e){
      // console.log("e====>",e)
      e.base64=e.base64.replace(/data:image\/[A-z]+;base64,/,'');
      this.userImgData=e;
    },
    //确认更换头像
    modifyUserImg(){
      //判断是否有头像上传，没有则不发送请求
      if(this.userImgData.base64==""){
        return;
      }
      //发送请求
      this.axios({
        method:"POST",
        url:"/modifyUserImg",
        data:this.userImgData
      }).then(res=>{
        // console.log(res)
        this.$children[2].showToast({
          msg:res.data.msg
        })
         if(res.data.code==2014){
           //更换成功
           this.userInfo.userImg=res.data.fileName;
           this.closeModal("userImgShow");
           this.$children[1].setUrl();
         }
      }).catch(err=>{
        console.log(err)
      })
    },
    //修改昵称
    modifyNickName(){
       //验证新昵称格式是否正确
      let res =validForm.valid({nickName:this.userName});
      if(res.pass===false){
        this.$children[2].showToast({
          msg:res.msg
        });
        this.userName=""; 
        return;
      }
      //发送请求
      this.axios({
        method:"POST",
        url:"/modifynickName",
        data:{
          userName:this.userName
        }
      }).then(res=>{
        // console.log(res)
        if(res.data.code==2020){
          this.userInfo.nickName=this.userName;
          this.closeModal("nameShow");
        }
        this.$children[2].showToast({
          msg:res.data.msg
        })
        this.userName='';
      }).catch(err=>{
        console.log(err)
      })
    }
  },
  //组件
  components:{
      MsgBox,
      Upload
  }
};
</script>

<style lang="less" scoped>
@import url("../assets/iconfont/iconfont.css");
.header {
  height: 80px;
  line-height: 80px;
  background-color: #508dff;
  color: #fff;
  padding: 0 60px 0 30px;
  position: sticky;
  top: 0;
  z-index: 1000;
  .logoText {
    font-size: 32px;
    font-weight: bold;
  }
  .infoBox {
    background-color: #508dff;
    .userImg {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      overflow: hidden;
      margin-top: 10px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        display: block;
      }
    }
    .userName {
      margin-left: 20px;
    }
    .setting {
      position: relative;
      margin: 0 20px;
      cursor: pointer;
      .settingList {
        position: absolute;
        top: -120px;
        left: 50%;
        margin-left: -50px;
        background-color: #508dff;
        transition: top 0.3s linear;
        z-index: -1;
        li {
          text-align: center;
          width: 100px;
          line-height: 40px;
          &:hover {
            background-color: #fff;
            color: #508dff;
          }
        }
        &.showSetting {
          top: 80px;
        }
      }
    }
    .loginOut {
      cursor: pointer;
    }
  }
}
.content {
  .aside {
    position: fixed;
    left: 0;
    bottom: 0;
    top: 80px;
    width: 200px;
    background-color: #202329;
    .asideBox {
      margin-top: 20px;
      .asideItem {
        overflow: hidden;
        .hide{
          height: 0;
        }
        .itemHeader {
          padding-left: 15px;
          line-height: 40px;
          color: #e4e4e5;
          cursor: pointer;
          &:hover{
            background-color: #202346;
            color: #508dff;
          }
          &.act {
            background-color: #202346;
            color: #508dff;
          }
        }
      }
      .itemList {
        text-align: center;
        cursor: pointer;
        li {
          line-height: 32px;
          color: #e4e4e5;
          cursor: pointer;
          &.active{
            color: #508dff;
          }
          &:hover {
            color: #508dff;
          }
        }
      }
    }
  }
  .formInfo {
    width: calc(100% - 200px);
    margin-left: 200px;
    padding: 15px;
    box-sizing: border-box;
  }
}
.modal{
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0,0, 0, 0.5);
  z-index: 1001;
  .modalBox{
    background-color: #fff;
    width: 400px;
    position: absolute;
    top: 100px;
    left: 50%;
    margin-left: -200px;
    padding-bottom: 20px;
    .modalHeader{
      padding: 0 20px;
      height: 60px;
      line-height: 60px;
      .modalTitle{
        margin: 0;
        font-weight: normal;
        font-size: 18px;
      }
      .closeModal{
        width: 20px;
        height: 20px;
        text-align: center;
        line-height: 20px;
        padding: 0;
        border: none;
        outline: none;
        margin-top: 20px;
        background-color: #fff;
        font-size: 20px;
        cursor: pointer;
      }
    }
    .modalBody{
      padding: 20px;
      border-top: 1px solid #e4e4e5;
      border-bottom: 1px solid #e4e4e5;
      .formGroup{
        margin-top: 10px;
        margin-bottom: 10px;
      }
      .typeName{
        width: 80px;
        height: 40px;
        line-height: 40px;
      }
      .typeInp{
        width: calc(100%-80px);
        input{
          width: 100%;
          height: 40px;
          box-sizing: border-box;
          padding-left: 10px;
          outline-color: #508dff;
        }
      }
    }
    .modalFooter{
      margin-top: 20px;
      .Updatabtn{
        margin-right: 20px;
      }
    }
  }
}
.showModal{
  display: block;
}
</style>