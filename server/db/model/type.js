//商品类型
const Sequelize=require("sequelize");
let Model=Sequelize.Model;
//继承表结构
class Type extends Model{};
//创建type数据表结构
Type.init({
    //表id
    id:{
        type:Sequelize.INTEGER.UNSIGNED,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true,
        comment:"表id"
    },
    //类型id
    typeId:{
        type:Sequelize.STRING(30),
        allowNull:false,
        defaultValue:"",
        comment:"商品类型id"
    },
    //类型
    typeName:{
        type:Sequelize.STRING(50),
        allowNull:false,
        defaultValue:"",
        comment:"商品类型"
    },
    //状态是否正常
    isEnable:{
        type:Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue:1,
        comment:"1:正常;0：禁用"
    },
    //商家id
    userId:{
        type:Sequelize.STRING(30),
        allowNull:false,
        defaultValue:"",
        comment:"商品id"
    }
},
{
    //配置
    //默认为类的名称，即在这种情况下为`business`。这将控制自动生成的`foreignKey`(外键)的名称和关联命名
    modelName:`type`,
    //是否添加时间戳属性（updatedAt,createdAt）
    timestamps:true,
    //是否开启假删除
    //不实际删除数据库记录，而是设置一个新deleteAt属性，其值为当前日期
    //`paranoid`仅在`timestamps`启用时可用
    paranoid:false,
    //自动设置字段为蛇型（以_方式命名）命名规则
    underscored:true,
    //禁止修改表名
    //默认情况下，sequelize会自动将所有传递的模型名称转换为复数形式， 如果不想这样做，请设置以下内容
    freezeTableName:true,
    //定义表名
    tableName:`type`,
    //连接实例
    // sequelize:sequelize （缩写）
    sequelize
})
//数据库同步
//force:true 如果数据库存在该表，则先删除该表，再创建一个新表，如果不存在，则直接创建新表
//force:false  如果数据库存在该表，则不创建新表，如果不存在，则直接创建新表
Type.sync({force:false})

//导出模型
module.exports=Type;