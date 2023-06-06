//导入api（服务层命令行），操作数据库
let api = require(__basename + "/api/api.js");
//导入工具库
let utils=require(__basename+"/utils/utils.js");
//导入moment模块,处理时间格式
const moment=require("moment");
//导入系统文件模块
const fs=require("fs");
//导入sequelize模块
const Sequelize=require("sequelize");
//获取sequelize操作符对象
let Op=Sequelize.Op;
//路由控制层
class RouterController {
    //验证邮箱验证码，中间件
    vaildEmailCode(req,res,next){
        // console.log(req.url);
        //判断当前请求路径是否在验证邮箱验证码名单上，如果存在则要验证验证码是否正确，反之路由直接通过
        if(whiteList.emailList.indexOf(req.url)>-1){
            //获取当前时间 - 邮箱验证过期时间（多少分钟）1分钟=60秒=1000毫秒
            let currentTime=new Date().getTime() - 5 * 60 * 1000;
            //使用moment模块将时间转换所需格式
            let date =moment(currentTime).format("YYYY-MM-DD HH:mm:ss");
            // console.log("date====>",date);
            //验证邮箱验证码是否正确
            api.findData("Code",{
                email:req.body.email,
                codenum:req.body.codeNum,
                createdAt:{
                    [Op.gte]:date
                }               
            }).then(result=>{
                if(result.length == 0){
                    res.send({
                        msg:"验证码已失效或者不正确",
                        code:1015
                    })
                }else{
                    //验证成功
                    next();
                }
            })
        }else{
            //不需要验证邮箱验证码，路由直接通过
            next();
        }
        // next();
    }
    //验证token值是否合法
    vaildToken(req,res,next){
        // console.log(req.headers)
        let url=req.url.split("?")[0];
        if(whiteList.tokenList.indexOf(url)>-1){
            //验证token
            if(req.headers.cookie == undefined){
                return;
            }
            let cookie=utils.transformCookie(req.headers.cookie);
            //解析token
            utils.verifyString({
                value:cookie._ssa,
                salt:config.tokenOptions.tokenSalt,
                fn:(err,decoded)=>{
                    //如果err存在值，则说明验证失败，该token值已失效
                    if(err){
                        //解析失败
                        res.send({
                            msg:"请先登录",
                            code:1031
                        })
                    }else{
                        //解析成功，验证通过
                        console.log("decoded===>",decoded);
                        //将userId 传递给下一个中间件或路由
                        req.userId=decoded.data;
                        next();
                    }
                }
            })

        }else{
            next();
        }
    }
    //注册
    registerController(req, res) {
        //截取参数
        // let params=req.body;
        // console.log("params===>",params);
        // res.send("服务器")

        //注册前查询该邮箱是否被注册
        api.findData("Business", {
            email: req.body.email
        }).then(result => {
            // console.log("result==>", result)
            //当查询返回的结果为空数组的时候，说明该邮箱没有被注册
            if (result.length == 0) {
                //利用时间戳生成userId的唯一id
                //getTime()时间戳
                let userId = new Date().getTime();

                //对密码进行加密
                let password=utils.encodeString(config.saltOptions.passwordSale + req.body.password);
                //添加数据
                api.createData("Business", {
                    userId,
                    nickName: req.body.nickName,
                    // password:req.body.password,  //密码不加密的情况
                    password,
                    email: req.body.email
                }).then(result => {
                    res.send({
                        msg: "注册成功",
                        code: "1000"
                    })
                }).catch(err => {
                    res.send({
                        msg: "注册失败",
                        code: "1001"
                    })
                })
            }else{
                res.send({
                    msg: "该邮箱已被注册",
                    code: "1002"
                }) 
            }
        }).catch(err=>{
            res.send({
                msg: "注册失败",
                code: "1003"
            })
        })
    }
    //发送邮箱验证码
    sendEmailController(req,res){
        //随机生成六位数字验证码
        //Math.random() 随机函数范围0-1
        let code =Math.random().toString().slice(-6);
        // console.log("code===>",code)
        // res.send({
        //     code
        // })

        //发送邮箱之前，添加数据到code表上，记录当前邮箱对应的验证码
        api.createData("Code",{
            email:req.body.email,
            codenum:code
        }).then(result=>{
            //添加成功，发送邮箱验证码
            res.send({
                msg:"验证码已发送成功，请注意查收！",
                code:1013
            })
            // return;
            //开发阶段不发邮件
            utils.sendMailCode(req.body.email,code,(err,msg)=>{
                // console.log("err====>",err)
                //err不为null时则说明邮件发送失败，为Null时则发送成功
                if(err){
                    res.send({
                        msg:"邮箱验证码发送失败",
                        code:1011
                    })
                }else{
                    res.send({
                        msg:"验证码已发送至邮箱，请注意查收！",
                        code:1012
                    })
                }
            })
        }).catch(err=>{
            //添加数据失败
            res.send({
                msg:"邮箱验证码发送失败",
                code:1014
            })
        })
        
    }
    //登录
    loginController(req,res){
    //     let password=utils.encodeString(config.saltOptions.passwordSale + req.body.password);
    //     api.findData("Business", {
    //         email: req.body.email,
    //         password
    //     }).then(result=>{
    //         console.log("result==>", result)
    //         if (result.length == 0) {
    //            res.send({
    //                msg:"登录失败"
    //            })
    //         }else{
    //             res.send({
    //                 msg:"登录成功"
    //             })
    //         }
    //     }).catch(err=>{
    //         console.log("err==>", err)
    //     })
        
        api.findData("Business",{
            email: req.body.email,
            isDestroy:0
        },["password","userId"]).then(result=>{ 
            // console.log("result=====>",result);
            if(result.length==0){
                res.send({
                    msg:"用户不存在，请注册！",
                    code:1022
                })
            }else{
                let password=utils.encodeString(config.saltOptions.passwordSale + req.body.password);
                if(password==result[0].dataValues.password){
                    //登录成功，生成token，返回给前端
                    let token =utils.signString({
                        value:result[0].dataValues.userId,
                        salt:config.tokenOptions.tokenSalt,
                        expires:config.tokenOptions.expires
                    })
                    res.send({
                        msg:"登录成功",
                        code:1020,
                        token
                    })
                }else{
                    res.send({
                        msg:"用户或密码不正确",
                        code:1021
                    })
                }
            }
        }).catch(err=>{
            console.log("err===>",err)
        })
    }
    //添加类型
    addTypeController(req,res){
        // console.log("req.userId====>",req.userId);
        let TypeId="_tp"+new Date().getTime();
        api.createData("Type",{
            typeId:TypeId,
            typeName:req.body.type,
            userId:req.userId
        }).then(result=>{
            res.send({
                msg:"添加类型成功",
                code:1040,
                result
            })
        }).catch(err=>{
            console.log("err=====>",err)
            res.send({
                msg:"添加类型失败",
                code:1041
            })
        })
    }
    //获得类型
    getTypeController(req,res){
        api.findData("Type",{
            userId:req.userId
        }).then(result=>{
            // res.send(result)
            // console.log(result)
            res.send({
                msg:"查询商品类型成功",
                code:1043,
                result
            });
        }).catch(err=>{
            res.send({
                msg:"查询商品类型失败",
                code:1044
            })
        })
    }
    //搜索商品类型
    searchTypeController(req,res){
        // console.log("req.query.type==>",req.query.type);
        //post参数存放在req.body
        //get 参数存放在req.query
        api.findData("Type",{
            userId:req.userId,
            typeName:{
                [Op.like]:`%${req.query.type}%`
            }
        }).then(result=>{
            res.send({
                msg:"搜索数据成功",
                code:1045,
                result
            })
        }).catch(err=>{
            res.send({
                msg:"搜索数据失败",
                code:1046
            })
        })
    }
    //禁用 启用切换
    enableController(req,res){
        api.updateData("Type",{
            isEnable:req.body.status
        },{
            typeId:req.body.typeId
        }).then(result=>{
            res.send({
                msg:"操作成功",
                code:1047
            })
        }).catch(err=>{
            res.send({
                msg:"操作失败",
                code:1048
            })
        })
    }
    //修改商品类型名称
    updateTypeController(req,res){
        api.updateData("Type",{
            typeName:req.body.type,
        },{
            typeId:req.body.typeId
        }).then(result=>{
            res.send({
                msg:"修改成功",
                code:1050,
                result
            })
        }).catch(err=>{
            res.send({
                msg:"修改失败",
                code:1051
            })
        })
    }
    //删除商品类型名称
    deleteTypeController(req,res){
        api.deleteData("Type",{
            typeId:req.body.typeId
        }).then(result=>{
            res.send({
                msg:"删除成功",
                code:1055
            })
        }).catch(err=>{
            res.send({
                msg:"删除失败",
                code:1056
            })
        })
    }
    //获取用户信息
    getUserController(req,res){
        api.findData("Business",{
            userId:req.userId,
            isDestroy:0
        },["nickName","userImg"]).then(result=>{
            console.log(result);
            res.send({
                msg:"查询用户信息成功",
                code:1060,
                result
            })
        }).catch(err=>{
            res.send({
                msg:"查询用户信息失败",
                code:1061
                
            })
        })
    }
    //修改密码
    modifyPwdController(req,res){ 
        api.findData("Business",{
            userId:req.userId
        },["password"]).then(result=>{
            let oldPassword=utils.encodeString(config.saltOptions.passwordSale + req.body.oldPassword);
            if(oldPassword==result[0].dataValues.password){
                //原密码正确，修改密码
                //对新密码加密
                let newPassword=utils.encodeString(config.saltOptions.passwordSale + req.body.newPassword);
                api.updateData("Business",{
                    password:newPassword
                },{
                    userId:req.userId
                }).then(result=>{
                    res.send({
                        msg:"密码修改成功",
                        code:2010
                    })
                }).catch(err=>{
                    res.send({
                        msg:"密码修改失败",
                        code:2011
                    })
                })
            }else{
                //原密码不正确
                res.send({
                    msg:"原密码不正确，请重新输入",
                    code:2012
                })
            }
        }).catch(err=>{
            res.send({
                msg:"修改密码失败",
                code:2011
            })
        })
    }
    //修改头像
    modifyUserImgController(req,res){
        //获取图片base64
        let base64=req.body.base64.replace(/ /g,"+");
        //将base64转换成buffer,buffer--》类似二进制文件
        let buffer=new Buffer(base64,"base64");
        //生成文件名
        let fileName=Math.random().toString().slice(2)+"."+req.body.type;
        //使用文件系统将图片写入服务器
        fs.writeFile(__basename+"/upload/"+fileName,buffer,err=>{
            //如果err存在则写入失败
            if(err){
                res.send({
                    msg:"更换头像失败",
                    code:2013
                })
            }else{
                //写入成功，修改数据库的头像路径
                api.updateData("Business",{
                    userImg:fileName
                },{
                    userId:req.userId
                }).then(result=>{
                    res.send({
                        msg:"更换头像成功",
                        code:2014,
                        fileName
                    })
                }).catch(err=>{
                    res.send({
                        msg:"更换头像失败",
                        code:2013
                    })
                })
            }
        })
    }
    //修改昵称
    modifynickNameController(req,res){
        api.updateData("Business",{
            nickName:req.body.userName
        },{
            userId:req.userId
        }).then(result=>{
            res.send({
                msg:"昵称修改成功",
                code:2020
            })
        }).catch(err=>{
            res.send({
                msg:"昵称修改失败",
                code:2021
            })
        })
    }
    //验证邮箱是否存在
    checkEmailController(req,res){
        api.findData("Business",{
            email: req.body.email,
            isDestroy:0
        }).then(result=>{
            if(result.length==0){
                res.send({
                    msg:"用户不存在，请注册！",
                    code:1060
                })
            }else{
                res.send({
                    msg:"用户存在，请继续！",
                    code:1061
                })
            }
        }).catch(err=>{
            console.log("err===>",err)
        })
    }
    //忘记密码，修改密码
    reviseController(req,res){
        let newpassword=utils.encodeString(config.saltOptions.passwordSale + req.body.password);
        api.updateData("Business",{
            password:newpassword
        },{
            email:req.body.email
        }).then(result=>{
            res.send({
                msg:"密码修改成功!",
                code:1063
            })
        }).catch(err=>{
            res.send({
                msg:"密码修改失败！",
                code:1064
            })
        })
    }
}
//导出
module.exports = new RouterController();