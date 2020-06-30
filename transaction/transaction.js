let typedef=require(__dirname+"/../typedef.js");

class Transaction{
	constructor(session,wormname,insId,datadef){
		this.session=session;
		this.wormname=wormname;
		this.insId=insId;
		this.datadef=datadef;
		this.children=[];
		this._data={};


	}
	async _init(){
		this.conn=await this.session.getConnection();

		await this.conn.execute("set autocommit=0");
		//console.log(`select * from ? where _id= ?`,[this.wormname,this.insId]);



		this._data=await this._queryRow(`select * from ${this.wormname} where _id= ?`,[this.insId]);
		await this._loadData();
	}
	async _queryRow(){
		let ret=await this._query(...arguments);

		if(ret[0])return ret[0];
		else throw new Error("query row failed");
	}
	async _query(){

		let ret=await this.conn.execute(...arguments);
		if(ret[0])return ret[0];
		else throw new Error("_execute failed"+JSON.stringify(ret));
	}
	async _loadData(){

		let data=typedef.sqldata2data(this._data,this.datadef);



		for(let i in data){
			this[i]=data[i];
		}
	}
	_getUserData(){
		let data={};
		for(let i in this.datadef){
			data[i]=this[i];
		}
		return data;
	}
	async saveData(){

		let keys=[];
		let values=[];
		//	console.log(this.datadef)


		let sqldata=typedef.data2sqldata(this._getUserData(),this.datadef);

		
		for(let i in sqldata){
			keys.push(i);
			values.push(sqldata[i]);
		}

		keys=keys.map((x)=>(x+" = ?"))

		let sql=`UPDATE ${this.wormname} SET ${keys.join(",")} WHERE _id = ${this.insId}`;


		return await this._query(sql,values);

	}
	async _close(){

		await this.saveData();
		await this.conn.execute("commit");

		this.session.releaseConnection(this.conn);
	}

}

module.exports=Transaction;