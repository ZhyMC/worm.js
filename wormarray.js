class wormarray{

	constructor(worm){
		this.$isArray=true;
		this.$worm=worm;
		this.$name=this.$worm.$name;
		this.$client=this.$worm.$client;
	}
	async find(condition){//在数组里寻找指定条件的实例

		let keys=[];
		let values=[];
		for(let i in condition){
			keys.push(`${i} = ?`);
			values.push(condition[i]);
		}

		let from=`FROM ` + this.$name;
		let where=(keys.length > 0 ? `WHERE ` : ``) + keys.join(' AND ');

		let sql=`SELECT * ${from} ${where}`;
//		console.log(sql);

		let res=await this.$client.query(sql,values);
		console.log(res);
	}

}


module.exports=wormarray;
