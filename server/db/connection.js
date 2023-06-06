//连接mysql数据库
const Sequelize=require("sequelize");

// //创建连接
// module.exports=new Sequelize("shopmanage","root","123456",{
//     //数据库地址
//     host:'localhost',
//     //连接数据库的类型
//     dialect:'mysql',
//     //时区 东八区，没有配置则默认伦敦时间
//     timezone:'+08:00',
//     pool:{
//         //最大连接数
//         max:10,
//         //最小连接数
//         min:0,
//         //连接超时30s，自动释放
//         acquire:30000,
//         //闲置10s后，自动释放
//         idle:10000
//     }
// })
//创建连接
module.exports=new Sequelize(config.databaseOptions.database,config.databaseOptions.user,config.databaseOptions.password,{
    //数据库地址
    host:config.databaseOptions.host,
    //连接数据库的类型
    dialect:config.databaseOptions.dialect,
    //时区 东八区，没有配置则默认伦敦时间
    timezone:config.databaseOptions.timezone,
    //连接池
    pool:config.databaseOptions.pool
})