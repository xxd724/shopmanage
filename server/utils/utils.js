//工具库
//导入加密模块，node核心模块（不需要安装，node自带）
const crypto = require("crypto");
//导入发送邮件模块
const nodemailer = require("nodemailer");
//导入jsonwebtoken模块
const jsonwebtoken = require("jsonwebtoken");
//创建发邮件配置
let transporter = nodemailer.createTransport(config.emailOptions)
class Utils {
    //加密字符串
    encodeString(val) {
        //val:需要加密的字符串
        let md5 = crypto.createHash("md5");
        return md5.update(val).digest("hex");
    }

    //发送邮箱验证码
    sendMailCode(email, code, fn) {
        //email:收邮件的地址
        //code：六位数邮箱验证码
        //fn:发邮件完成后，执行的回调函数，该回调函数存在一个err参数，如果err存在,则说明邮件发送失效
        transporter.sendMail({
            //发邮件的地址
            from: config.emailOptions.auth.user,
            //收邮件的地址
            to: email,
            //邮件主题
            subject: "商家后台管理系统注册邮箱验证码",
            //邮箱内容
            text: `您的邮件验证码时：${code},5分钟后失效！！！`
        }, fn)
    }

    //签名字符串，生成token
    signString(o) {
        /**
         * {
         * value:被签名的字符串（建议唯一）
         * salt:加盐
         * expires:过期时间
         * }
         */

        //  过期时间写法
        //  60==>60s
        //  "120"==>120ms
        //  '2 days'==>2天
        //  '5d'==>5天
        //  '7h'==>7小时
        return jsonwebtoken.sign({
            data: o.value
        }, o.salt, {
            expiresIn: o.expires
        })
    }

    //将cookie转换成普通对象
    transformCookie(cookie) {
        let cookieArr = cookie.split("; ");
        console.log("cookieArr===>",cookieArr);
        let cookieObj = {};
        cookieArr.forEach(v => {
            let c = v.split("=");
            cookieObj[c[0]] = c[1];
        })
        console.log(cookieObj);
        return cookieObj;
    }

    //解析token
    verifyString(o) {
        /**
         * {
         * value:token 字符串
         * salt:加盐
         * fn:回调函数
         * }
         */
        return jsonwebtoken.verify(o.value,o.salt,o.fn);
    }


}
//导出
module.exports = new Utils();