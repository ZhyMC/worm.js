let whereBuild=require("sql-where-builder");

class wormarray{

	constructor(worm){
		this.$isArray=true;
		this.$worm=worm;
		this.$name=this.$worm.$name;
		this.$client=this.$worm.$client;
	}
	async find(condition){//在数组里寻找指定条件的实例

		let builtWhere=whereBuild(condition);

		let from=`FROM ` + this.$name;
		let where=(builtWhere.parameters.length > 0 ? `WHERE ` : ``) + builtWhere.statement;

		let sql=`SELECT * ${from} ${where}`;
//		console.log(sql);

		let resdata=await this.$client.query(sql,builtWhere.parameters);

		let insarr=[];
		for(let r of resdata)
		insarr.push(this.$worm.from(r._id,r));

		return insarr;
	}

}


module.exports=wormarray;
