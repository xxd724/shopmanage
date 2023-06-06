<template>
  <div class="type">
      <!-- 搜索商品 -->
      <div class="searchBox clearFix">
        <!-- 左边输入框 -->
        <div class="searchInp fl">
          <input type="text" placeholder="请输入商品类型" v-model="searchTitle">
        </div>
        <!--右边按钮  -->
        <div class="fl">
          <button class="searchbtn" @click="searchTypeData()">搜索</button>
        </div>
      </div>
      <!-- 添加商品类型按钮 -->
      <div class="addType">
        <button class="Addbtn" @click="showModal(1)">添加商品类型</button>
        <button class="freshen" @click="freshen()" v-show="fre_shen">刷新</button>
      </div>
      <!--商品类型数据列表  -->
      <div class="typeList">
        <table class="typeTable">
          <thead>
            <tr>
              <th>序号</th>
              <th>类型名称</th>
              <th>状态</th>
              <th>创建时间</th>
              <th>更新时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in typeDataArr" :key="index">
              <td>{{index + 1}}</td>
              <td>{{item.typeName}}</td>
              <td>{{item.isEnable?"正常":"禁用"}}</td>
              <td>{{item.createdAt}}</td>
              <td>{{item.updatedAt}}</td>
              <!-- <td>{{item.createdAt | dataTime}}</td>
              <td>{{item.updatedAt | dataTime}}</td> -->
              <td>
                <button class="btn Updatabtn" @click="showModal(2,index)">编辑</button>
                <button class="btn secondarybtn" v-if="item.isEnable" @click="toggleTypeEnable(0,item.typeId,index)">禁用</button>
                <button class="btn successbtn" v-else @click="toggleTypeEnable(1,item.typeId,index)">启用</button>
                <button class="btn Deletebtn" @click="deleteType(item.typeId,index)">删除</button>
              </td>
            </tr> 
            <!-- <tr>
              <td>2</td>
              <td>电子产品</td>
              <td>正常</td>
              <td>2020-09-22 15:23:30</td>
              <td>2020-09-22 15:23:30</td>
              <td>
                <button class="btn Updatabtn">编辑</button>
                <button class="btn Deletebtn">删除</button>
              </td>
            </tr> -->
          </tbody>
        </table>
      </div>
      <!-- 模态框 添加商品类型 -->
      <div :class="['modal',isShowModal?'showModal':'']">
        <div class="modalBox">
          <!-- 头部 -->
          <div class="modalHeader clearFix">
            <h4 class="modalTitle fl">{{modalTitle}}</h4>
            <button class="closeModal fr" @click="closeModal()">X</button>
          </div>
          <!-- 内容 -->
          <div class="modalBody">
            <div class="formGroup clearFix">
              <div class="typeName fl">类型名称</div>
              <div class="typeInp fl">
                <input type="text" placeholder="输入类型名称" v-model="type">
              </div>
            </div>
          </div>
          <!-- 底部 -->
          <div class="modalFooter clearFix">
            <button class="btn Updatabtn fr" @click="addType()">保存</button>
          </div>
        </div>
      </div>
      <!-- 消息提示框 -->
      <MsgBox></MsgBox>
  </div>
</template>
<script>
import MsgBox from "../components/MsgBox";
import {tool} from "../assets/js/tool";
// import Vue from 'vue'
// Vue.filter("dataTime",function(time){
//   let date = new Date(time);
//   let year = date.getFullYear();
//   let month = date.getMonth()+1;
//   let d = date.getDate();
//   let h = date.getHours();
//   let m = date.getMinutes();
//   let s = date.getMinutes();

//   return `${year}-${month}-${d}  ${h}:${m}:${s}`
// })
export default {
  name:"Type",
  data(){
    return{
      //是否显示模态框 添加商品类型
      isShowModal:false,
      fre_shen:false,
      //商品类型
      type:"",
      //当前用户商品类型数据
      typeDataArr:[],
      //搜索字段
      searchTitle:"",
      //模态框的标题
      modalTitle:"",
      //商品id
      typeId:'',
      //编辑商品下标
      typeIndex:''
    }
  },
  created(){
    this.getType();
  },
  methods:{
    //点击刷新
    freshen(){
      this.fre_shen = false;
      this.getType();
    },
    //显示模态框事件
    showModal(flag,index){
      if(flag !=1 && !this.typeDataArr[index].isEnable){
        this.$children[0].showToast({
          msg:"禁用状态不可编辑！"
        })
        return;
      }
      //flag:标识参数 1：添加数据  2：编辑数据
      if(flag==1){
        //添加商品类型
        this.modalTitle="添加商品类型";
        this.typeId="";
        this.type="";
      }else if(flag==2){
        //编辑商品类型
        this.modalTitle="编辑商品类型";
        this.type=this.typeDataArr[index].typeName;
        this.typeId=this.typeDataArr[index].typeId;
        this.typeIndex=index
      }
      this.isShowModal=true;
    },
    //隐藏模态框
    closeModal(){
      this.isShowModal=false;
      //清空输入框的值
      this.type="";
    },
    //保存 添加商品类型
    addType(){
      //输入框为空 不发送请求
      if(this.type==""){
        console.log(this.$children[0])
        this.$children[0].showToast({
          msg:"请输入要添加的商品类型"
        })
        return;
      }
      if(!this.typeId){
        //发送请求
        this.axios({
          method:"POST",
          url:"/addType",
          data:{
            type:this.type
          }
        }).then(res=>{
          console.log("res==>",res);
          if(res.data.code==1040){
            res.data.result.createdAt=tool.formatDate(new Date(res.data.result.createdAt),"yyyy-MM-dd hh:mm:ss");
            res.data.result.updatedAt=tool.formatDate(new Date(res.data.result.updatedAt),"yyyy-MM-dd hh:mm:ss");
            //添加新增数据
            this.typeDataArr.push(res.data.result);
            this.$children[0].showToast({
              msg:res.data.msg
            })
            this.closeModal();
          }
        }).catch(err=>{
          console.log("err==>",err);
        })
      }else{
        //判断用户是否又更改数据，没有更改直接终止
        if(this.type==this.typeDataArr[this.typeIndex].typeName){
          this.closeModal();
          return;
        }else{
          this.axios({
            method:"POST",
            url:"/updateType",
            data:{
              type:this.type,
              typeId:this.typeId
            }
          }).then(res=>{
            if(res.data.code==1050){
              this.typeDataArr[this.typeIndex].typeName=this.type;
              this.typeDataArr[this.typeIndex].updatedAt=tool.formatDate(new Date(),"yyyy-MM-dd hh:mm:ss");  
              this.$children[0].showToast({
              msg:res.data.msg
            })
            }
            this.closeModal();
          }).catch(err=>{
            console.log(err);
          })
        }
      }
    },
    //获取商品类型数据
    getType(){
      this.axios({
        method:"GET",
        url:"/getType"
      }).then(res=>{
        console.log("res===>",res.data);
        res.data.result.forEach(v => {
          v.createdAt=tool.formatDate(new Date(v.createdAt),"yyyy-MM-dd hh:mm:ss");
          v.updatedAt=tool.formatDate(new Date(v.updatedAt),"yyyy-MM-dd hh:mm:ss");
        });
        this.typeDataArr=res.data.result;
      }).catch(err=>{
        console.log("err==>",err);
      })
    },
    //搜索商品类型
    searchTypeData(){
      if(this.searchTitle==""){
        this.$children[0].showToast({
          msg:"请输入商品类型"
        });
        return;
      }
      this.fre_shen = true;
      //发送请求
      //post:参数在data
      //get 参数在params
      this.axios({
        method:"GET",
        url:"/searchType",
        params:{
          type:this.searchTitle
        }
      }).then(res=>{
        console.log(res);
        res.data.result.forEach(v=>{
          v.createdAt=tool.formatDate(new Date(v.createdAt),"yyyy-MM-dd hh:mm:ss");
          v.updatedAt=tool.formatDate(new Date(v.updatedAt),"yyyy-MM-dd hh:mm:ss");
        });
        this.typeDataArr=res.data.result;
        this.searchTitle=""
      }).catch(err=>{
        console.log(err);
      })
    },
    //禁用 启用状态切换事件
    toggleTypeEnable(status,typeId,index){
      //status：当前要修改的状态值 0：禁用 1：正常
      //typeId：当前点击的数据对应的数据id
      //index：当前点击数据的下标
      this.axios({
        method:"POST",
        url:"/toggleTypeEnable",
        data:{
          status,
          typeId
        }
      }).then(res=>{
        if(res.data.code==1047){
          this.typeDataArr[index].isEnable=status;
        }
      }).catch(err=>{
        console.log(err);
      })
    },
    //删除商品类型
    deleteType(typeId,index){
      this.axios({
        method:"POST",
        url:"/deleteType",
        data:{
          typeId
        }
      }).then(res=>{
        if(res.data.code==1055){
          //splice(删除的下标，删除的数量)
          this.typeDataArr.splice(index,1);
          this.$children[0].showToast({
          msg:res.data.msg
        })
        }
      }).catch(err=>{
        this.$children[0].showToast({
          msg:err.data.msg
        })
      })
    }
  },
  //组件
  components:{
      MsgBox
  }
}
</script>

<style lang="less" scoped>
.searchBox{
  .searchInp{
    width: 400px;
    height: 40px;
    input{
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      outline-color: #508dff;
      padding: 0 0 0 10px;
      border-radius: 3px;  
      border: 1px solid #e4e4e5;
    }
  }
  .searchbtn{
    width: 80px;
    height: 40px;
    border: none;
    outline: none;
    background-color: #508dff;
    margin-left: 20px;
    border-radius: 8px;
    color: #fff;
    font-size: 18px;
    cursor: pointer;
  }
}
.addType{
  margin-top: 30px;
  .Addbtn{
    padding: 10px 10px;
    border: 0;
    outline: none;
    background-color:orange;
    border-radius: 8px;
    cursor: pointer;
  }
  .freshen{
    outline: none;
    background-color:orange;
    border: 0;
    border-radius: 20px;
    cursor: pointer;
    padding: 10px 10px;
    margin-left: 20px;
  }
}
.typeList{
  margin-top: 30px;
  .typeTable{
    width: 100%;
    border-top: 1px solid #cbcbcb;
    border-right: 1px solid #cbcbcb;
    border-collapse: collapse;
    border-spacing: 0;
    thead{
      background-color: #e4e4e5;
    }
    th,td{
      border-left:1px solid #cbcbcb;
      border-bottom: 1px solid #cbcbcb;
      text-align: center;
      padding: 10px 0;
    }
    tr:hover{
      background-color: #E4E4E5;
    }
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








