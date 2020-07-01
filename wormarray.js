let whereBuild=require("sql-where-builder");

class wormarray{

	constructor(worm,insId){
		this.$isArray=true;
		this.$worm=worm;
		this.$name=this.$worm.$name;
		this.$client=this.$worm.$client;
		this.$insId=insId;
	}
	async find(condition){//在数组里寻找指定条件的实例

		let builtWhere=whereBuild(condition);

		let from=`FROM ` + this.$name;

		let where = `WHERE _array_insid = ${this.$insId}`;
		if(builtWhere.parameters.length > 0 )
			where += ` AND ( ${builtWhere.statement} ) `;

		let sql=`SELECT * ${from} ${where}`;
	

		let resdata=await this.$client.query(sql,builtWhere.parameters);

		let insarr=[];
		for(let r of resdata)
		insarr.push(this.$worm.from(r._id,r));

		return insarr;
	}
	async push(ins){
		if(ins.$worm != this.$worm)throw "Type of instance to push is unmatch!";
		await ins._set(['_array_insid'],[this.$insId]);
	}
}


module.exports=wormarray;
