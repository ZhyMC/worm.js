let typedef=require(__dirname+"/typedef.js");
let wormarray=require(__dirname+"/wormarray.js");
let namespace=require(__dirname+"/utils/namespace.js");

async function createWorm(options){

	class worm{
		constructor(opt){
			if(!opt)opt={};

			this.$options=opt;
			this.$id=opt.id;

			this.$isWorm=true;

			this.$worm=worm;

			this.$client=this.$worm.$client;
			this.$data=this.$worm.$option.data;
			this.$wormname=this.$worm.$name

			this._loadMethods(this.$worm.$option.methods);

		}
		async get(){
			let _data=await this._get();
	
			return typedef.sqldata2data(_data,this.$data,this.$client,this.$id);
		}
		getId(){
			return this.$id;
		}
		_get(){
			return this.$client.getRawRow(this.$wormname,this.$id);
		}
		_set(keys,values){
			return this.$client.updateRawRow(this.$wormname,this.$id,keys,values);
		}
		_getTransaction(){
			return this.$client.getTransaction(this.$worm.$name,this.$id,this.$worm.$data);
		}
		_commitTransaction(trans){
			return this.$client.commitTransaction(trans);
		}

		_loadMethods(methods){
			for(let i in methods){

				this[i]=async function(){

						let trans=await this._getTransaction();
						
						let nf=methods[i].bind(trans);
						let ret=await nf(...arguments);

						await this._commitTransaction(trans);

						return ret;

					};

			}
		}
		
	}


	worm._constr=async function(options){
		this.$option = options;
		this.$isWormCls = true;


		await this._init();
	}
	worm._init=async function(){
		this.$name = this.$option.name;
		this.$client = this.$option.client;
		this.$data = this.$option.data;

		if(!this.$option.namespace)
			this.$namespace = namespace.parse("/")
		else
			this.$namespace = namespace.parse(this.$option.namespace);


		let data={};
		for(let i in this.$data){
			data[i]=typedef.getTypeDef(this.$data[i]).sqltype;
		}


		await this.$client.createSheet(this.$name,data);
	}
	worm.Array=function(insId){
		return new wormarray(this,insId);
	}
	worm.getNamespace=function(){
		return namespace.stringify(this.$namespace);
	}
	worm.setNamespace=function(path){
		this.$namespace=namespace.parse(path);
	}
	worm.new=async function(...params){

		let datadef=this.$option.data;
		let data={};

		for(let i in datadef){
			data[i]=typedef.getTypeDef(datadef[i]).default;
		}

		let cof=this.$option.constructor || (()=>{});

		let constr=cof.bind(data);
		await constr(...params);


		data=typedef.data2sqldata(data,datadef);
		

		let ins = await this.get(await this.$client.createRow(this.$name,data));

		return ins;
	}
	worm.get=function(insId){
		return new worm({
			id:insId
		});

	}
	worm.from=function(insId,data){
		let ins=this.get(insId);
		for(let i in data)
			ins[i]=data[i];

		return ins;
	}





	await worm._constr(options);

	return worm;
}


module.exports=createWorm;

//module.exports=worm;


