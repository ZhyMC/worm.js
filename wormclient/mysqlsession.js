let mysql=require("mysql2/promise");

class mysqlsession{
	constructor(option){
		this.option=option;
	}
	async init(){
		this.pool=await mysql.createPool(this.option);

	}

	query(){
		return this.pool.execute(...arguments);
	}
	async getConnection(){
//		console.log("getConnection",await this.pool.getConnection())
		return this.pool.getConnection();
	}
	releaseConnection(conn){
		conn.release();
	}
	
}

module.exports=mysqlsession;