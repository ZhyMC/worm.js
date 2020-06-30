let Transaction=require(__dirname+"/../transaction/transaction.js");
let Session=require(__dirname+"/mysqlsession.js");
let createWorm=require(__dirname+"/../createworm.js");

class wormclient{
	constructor(option){
		this.session=new Session(option);
		this.model={};

		this.connected=false;
	}
	query(){
		return this.session.query(...arguments);
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

		return res[0].insertId;
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
	async getTransaction(wormname,insId,datadef){
		let trans=new Transaction(this.session,wormname,insId,datadef);
		await trans._init();

		return trans;
	}
	async commitTransaction(trans){
		return await trans._close();

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