//服务层 命令集合

class Api{
    //添加数据
    createData(modelName,o){
        //modelName:模型名称
        //o:创建的数据，object数据类型
        //model：全局属性，所有的模块集合
        return model[modelName].create(o)
    }

    //查询数据
    findData(modelName,condition,attrs){
        //modelName:模型名称 String类型
        //condition：查询条件  object类型
        //attrs：查询的字段  array类型
        return model[modelName].findAll({
            where:condition,
            attributes:attrs
        })
    }
    //修改数据
    updateData(modelName,values,condition){
        //modelName:模型名称 String类型
        //values:要修改的数据 obje类型
        //condition：查询条件  object类型
        return model[modelName].update(values,{
            where:condition
        })
    }
    //删除数据
    deleteData(modelName,condition){
        //modelName:模型名称 String类型
        //condition：查询条件  object类型
        return model[modelName].destroy({
            where:condition
        })
    }
}
//导出
module.exports=new Api();