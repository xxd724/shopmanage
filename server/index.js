//入口层
//设置基本路径，global表示全局对象，所有页面可用
global.__basename=__dirname;
//导入配置文件
global.config=require(__basename + "/config/config.js");
//连接mysql数据库，使用全局属性保存连接实例，以便后续创建数据结构
global.sequelize=require(__basename + "/db/connection.js");
//导入所有模型
global.model=require(__basename + "/db/model/model.js");
//导入模板
const express =require("express");
//导入body-parser模块
const bodyparser=require("body-parser");
//导入白名单
global.whiteList=require(__dirname + "/white_list/whiteList.js");
//导入路由
let router=require(__dirname + "/router/router.js");
//创建express实例
let app=express();
//设置静态目录
app.use(express.static(__basename + "/upload"));
//设置解析post请求体
//将请求体解析为json格式
app.use(bodyparser.json({
    //限制请求体的大小 3072kb=3mb
    limit:"3072kb"
}));
//extended：false 可以接收任意数据类型
//extended：ture 可以接收字符串或数组
app.use(bodyparser.urlencoded({
    extended:false,
    limit:"3072kb"
}))
//CORS：跨域资源共享
//app.all(*):表示请求路径都需要经过
app.all("*",(req,res,next)=>{
    console.log("req.headers==>",req.headers);
    //允许跨域地址
    res.header("Access-Control-Allow-Origin",req.headers.origin);
    //res.header("Access-Control-Allow-Orign","http://127.0.0.1:8080");
    //*:表示允许所有域请求，但是在实际开发中，一般都是指定某个域可以请求，如上面个设置
    // res.header("Access-Control-Allow-Origin","*");

    //配置跨域请求头，可以实现服务器支持所有的头信息字段
    res.header("Access-Control-Allow-Headers","X-Ruquested-with");
    //配置请求方法，可以实现服务所有跨域的请求方法
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");

    //配置是否允许发送Cookie,该字段不是必需的
    //允许发送则为true,不允许则删除该字段
    res.header("Access-Control-Allow-Credentials",true);

    //允许通过
    next();
})
//验证跨域地址是否存在白名单
app.use((req,res,next)=>{
    if(whiteList.hostList.indexOf(req.headers.origin) == -1){
        return res.send({msg:"该请求路径不存在白名单中"})
    }
    //允许通过
    next();
})
router(app);
// app.listen(10000,()=>{
//     console.log("服务器已开启  http://127.0.0.1:10000")
// })
app.listen(config.serverOptions.port,()=>{
    console.log(`服务器已开启  ${config.serverOptions.host}:${config.serverOptions.port}`)
})