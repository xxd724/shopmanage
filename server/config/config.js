//配置文件

//数据库配置
exports.databaseOptions={
    //数据库名称
    database:"shopmanage",
    //数据库用户名
    user:"",
    //数据库密码
    password:"",
    //数据地址
    host:"",
    //连接数据库的类型
    dialect:"mysql",
    //时区 东八区 默认是伦敦时区
    timezone:"+08:00",
    //设置连接池
    pool:{
        //最大连接数
        max:10,
        //最小连接数
        min:0,
        //连接超时30s，自动释放数据库的连接
        acquire:30000,
        //闲置时间10s，自动释放数据库的连接
        idle:10000
    }
}
//服务器的配置
exports.serverOptions={
    host:"http://127.0.0.1",
    port:10000
}
//加盐配置(另密码安全性更高)
exports.saltOptions={
    passwordSale:"_pw"
}
//发送邮件配置
exports.emailOptions={
    //主机 发送邮箱类型为qq邮箱 其他类型的邮箱 smtp.163.com smtp.126.com......
    host:"",

    //端口 建议统一使用465，25端口在阿里云服务器禁用
    port:465,

    //当端口为465时，需要设置为true,其余为false
    secure:true,

    //身份验证
    auth:{
        //发送邮件的地址，就是开通POP3服务STMP服务授权的邮箱地址
        user:"",
        pass:""
    }
}
//token配置
exports.tokenOptions={
    //加盐
    tokenSalt:"_tk",
    //过期时间
    expires:"5d"
}