<template>
  <div class="upload">
      <div class="uploadBox">
          <label class="uploadlabel">
              <input type="file" @change="fileData">
          </label>
          <div class="imgbox" v-if="url !=''">
              <img :src="url" alt="">
          </div>
          <div class="iconbox" v-else>
              <img src="../assets/images/add.jpg" alt="">
          </div>
      </div>
      <!-- 消息提示框 -->
      <MsgBox></MsgBox>
  </div>
</template>

<script>
import MsgBox from "../components/MsgBox.vue"
export default {
    name:"Upload",
    props:{
        size:{
            //属性为数值型
            type:Number,
            //默认值为1mb
            default:1
        }
    },
    data(){
        return{
            url:""
        }
    },
    methods:{
        setUrl(){
            this.url="";
        },
        fileData(e){
            //记录this
            let _this=this;
            if(e.target.files.length==0){
                return;
            }
            //获取上传的图片信息
            //size:图片的大小 以字节（b）为单位  1024=1kb 1024kb=1m
            let file=e.target.files[0];
            console.log(file);
            //将文件信息转换成base64，再将base64传给后台，后台再转二进制，再利用模块写入服务器
            //创建文件读取对象

            //控制上传的文件大小
            //file:size 文件的大小
            let fileSize=file.size / 1024 / 1024;
            if(fileSize > this.size){
                this.$children[0].showToast({
                    msg:`上传的图片不能超过${this.size}MB`
                })
                return;
            }
            let fileReader=new FileReader();
            //监听文件读取对象读取文件是否完毕
            fileReader.onload=function(evt){
                console.log(evt.target.result);
                _this.url=evt.target.result;
                //触发父组件自定义事件
                _this.$emit("file-upload",{base64:evt.target.result,type:file.type.split("/")[1]});
            }
            //读取对象
            fileReader.readAsDataURL(file);
        }
    },
    components:{
        MsgBox
    }
}
</script>

<style lang="less" scoped>
.upload{
    width: 200px;
    height: 200px;
    background-color: #f2f2f2;
    border: 2px dashed #ddd;
    margin:20px auto;
    .uploadBox{
        width: 100%;
        height: 100%;
        position: relative;
        .uploadlabel{
            position: relative;
            width: 100%;
            height: 100%;
            display: block;
            z-index: 2;
            input{
                display: none;
            }
        }
        .imgbox{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            img{
                width: 100%;
                height: 100%;
                display: block;
            }
        }
        .iconbox{
            width: 100%;
            height: 100%;
            position: absolute;
            top:0;
            left: 0;
            bottom: 0;
            right: 0;
            margin: auto;
            img{
                width: 100%;
                height: 100%;
                display: block;
            }
        }
    }
}
</style>
