class ValidForm{
    constructor(){
        // this.email=/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
        this.data={
            //邮箱
            email:{
                reg:/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/,
                msg:"邮箱格式不正确"
            },
            //昵称
            nickName:{
                reg:/^[\w\u4e00-\u9fa5]{1,10}$/,
                msg:"昵称只支持数字、字母、汉字、_"
            },
            //密码
            password:{
                reg:/^[A-z]\w{5,15}$/,
                msg:"密码首字母必须是字母，只支持字母数字_,长度为6-16"
            },
            //验证码
            codeNum:{
                reg:/^\d{6}$/,
                msg:"验证码必须是6位数字"
            }
        }
    }
    valid(o){
        for(let key in o){
            if(this.data.hasOwnProperty(key)){
                if(!this.data[key].reg.test(o[key])){
                    return{
                        pass:false,
                        msg:this.data[key].msg
                    }
                }
            }
        }
        return true
    }
}
//导出
export const validForm=new ValidForm();