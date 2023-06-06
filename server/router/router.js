//路由层

//导入控制层
const routerController=require(__basename+"/router_controller/routerController.js");
module.exports=app=>{
    //中间件验证邮箱验证码
    app.use(routerController.vaildEmailCode);
    //中间件token值
    app.use(routerController.vaildToken);
    //注册页面路由
    app.post("/register",routerController.registerController);

    //发送邮箱验证码
    app.post("/sendemail",routerController.sendEmailController);

    //登录页面路由
    app.post("/login",routerController.loginController);

    //添加类型路由
    app.post("/addType",routerController.addTypeController);

    //获取商品类型路由
    app.get("/getType",routerController.getTypeController);

    //搜索商品类型
    app.get("/searchType",routerController.searchTypeController);
    //禁用 启用状态切换
    app.post("/toggleTypeEnable",routerController.enableController);
    //修改商品类型名称
    app.post("/updateType",routerController.updateTypeController);
    //删除商品
    app.post("/deleteType",routerController.deleteTypeController);
    //获取用户信息
    app.get("/getUser",routerController.getUserController);
    //修改密码
    app.post("/modifyPwd",routerController.modifyPwdController);
    //修改头像
    app.post("/modifyUserImg",routerController.modifyUserImgController);
    //修改昵称
    app.post("/modifynickName",routerController.modifynickNameController);


    app.post("/checkEmail",routerController.checkEmailController);

    app.post("/revise",routerController.reviseController);
}