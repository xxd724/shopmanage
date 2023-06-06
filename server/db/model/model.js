//模型集合
//导入商家模型，商家用户表
const Business=require(__basename + "/db/model/business.js");

//导入邮箱验证码模型
const Code =require(__basename + "/db/model/code.js");

//导入商品类型模型
const Type=require(__basename + "/db/model/type.js")

module.exports={
    Business,
    Code,
    Type
}