let Transaction=require(__dirname+"/../transaction/transaction.js");
let Session=require(__dirname+"/mysqlsession.js");
let createWorm=require(__dirname+"/../createworm.js");
let typedef=require(__dirname+"/../typedef.js");
let modelScanner=require(__dirname+"/../utils/modelScanner.js");
let Path=require("path");

class wormclient{
	constructor(option){
		this.session=new Session(option);
		this.model={};

		this.connected=false;
	}
	async queryRow(){
		let ret=await this.query(...arguments);
		if(!ret[0])throw new Error("queryRow failed");

		return ret[0];
	}
	async query(){
		let ret=await this.session.query(...arguments);
		if(!ret[0])throw new Error("query failed");

		return ret[0];
	}
	async init(){
		await this.session.init();
		this.connected=true;
		return this;
	}
	async createRow(sheet,params){
		let keys=[];
		let values=[]
		let tips=[]

		for(let k in params)
		{	
			keys.push(k);
			tips.push("?");
			values.push(params[k]);
		}
		let sql=`INSERT INTO ${sheet}(_id,${keys.join(",")}) VALUES (NULL,${tips.join(",")})`

//console.log(sql,await this.session.query(sql,values))

		let res=await this.query(sql,values);

		return res.insertId;
	}
	async createSheet(sheet,data){
		let struct=["_id int PRIMARY KEY AUTO_INCREMENT"];

		for(let i in data){
			struct.push(`${i} ${data[i]}`);
		}

		let sql=`CREATE TABLE IF NOT EXISTS ${sheet}(${struct.join(',')})`;


		//console.log(sql)

		return this.query(sql);
	}
	async getRow(wormname,insId,datadef){
		let _data=await this.queryRow(`select * from ${wormname} where _id= ?`,[insId]);
		let data=typedef.sqldata2data(_data,datadef);

		for(let i in data){
			this[i]=data[i];
		}

		return data;
	}
	async getTransaction(wormname,insId,datadef){

		let trans=new Transaction(this,wormname,insId,datadef);
		await trans._init();

		return trans;
	}
	async commitTransaction(trans){
		return await trans._close();

	}
	async loadModels(path,namespace_notforce){	
		let models=modelScanner(path);
		for(let i in models){
			//console.log(Path.join(path,models[i].file))
			let builder=require(Path.resolve(Path.join(path,models[i].file)));
			let model=await builder(this);
			if(namespace_notforce)continue;

			model.setNamespace(models[i].space);
		}
	}
	_addModel(model){
		this["$"+model.$name]=model;
		this.model[model.$name]=model;
	}
	_removeModel(model){
		delete this["$"+model.$name];
		delete this.model[model.$name];
	}

	async createWorm(options){
		let model=await createWorm({
			...options,
			client:this
		});

		this._addModel(model);
	
		return model;
	}

}

wormclient.create=async (options)=>{
	let cli=new wormclient(options);
	return await cli.init();
}




module.exports=wormclient;