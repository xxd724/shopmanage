<template>
  <div id="app">
    <!-- 一级路由显示 -->
    <router-view></router-view>
  </div>
</template>

<style lang="less">
body {
  margin: 0;
}
ul {
  margin: 0;
  padding: 0;
}
li {
  list-style: none;
}
.fl{
  float: left;
  }
.fr {
  float: right;
}
.clearFix::after{
  content: "";
  display: block;
  clear: both;
}
.btn{
    padding: 6px 16px;
    border: 0;
    outline: none;
    color: #fff;
    margin: 0 10px;
    border-radius: 10px;
    cursor: pointer;
}
.Updatabtn{
  background-color: #508dff;
}
.Deletebtn{
  background-color: #e4393c;
}
.secondarybtn{
  background-color: #6c757d;
}
.successbtn{
  background-color: #28a745;
}
</style>
