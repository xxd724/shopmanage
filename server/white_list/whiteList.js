//白名单
//前端请求的路径，允许跨域名单
exports.hostList=[
    "http://127.0.0.1:8080"
    
]

//验证邮箱验证码的路径
exports.emailList=[
    '/register',
    '/revise'
]

//验证token是否合法的请求路由
exports.tokenList=[
    "/addType",
    "/getType",
    "/searchType",
    "/getUser",
    "/modifyPwd",
    "/modifyUserImg",
    "/modifynickName"
]

// exports.