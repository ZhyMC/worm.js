let typedef=require(__dirname+"/typedef.js");
let wormarray=require(__dirname+"/wormarray.js");
let namespace=require(__dirname+"/namespace.js");

async function createWorm(options){

	class worm{
		constructor(opt){
			if(!opt)opt={};

			this.$options=opt;
			this.$id=opt.id;
			this.$isWorm=true;

			this.$worm=worm;

			this.$wormname=this.$worm.$name

			this._init();

		}
		get(){
			return this.$worm.$client.getRow(this.$worm.$name,this.$id,this.$worm.$data);
		}
		getId(){
			return this.$id;
		}
		_getTransaction(){
			return this.$worm.$client.getTransaction(this.$worm.$name,this.$id,this.$worm.$data);
		}
		_commitTransaction(trans){
			return this.$worm.$client.commitTransaction(trans);
		}
		_init(){
			this.$data=this.$worm.$option.data;

			this._loadMethods(this.$worm.$option.methods);
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


	worm._handlePack=async function(pack){

			try{
				let result=await this.$client.query(pack);

				if(result.length!=pack.reqs.length)throw new Error("pack query error");

				for(let i in result){
					pack.reqs[i].defer.resolve(result[i]);
				}
			}catch(e){
				for(let i in pack.reqs){

					pack.reqs[i].defer.reject(e);
				}
				
			}
			
	}

	worm._constr=function(options){
		this.$option = options;
		this.$isWormCls = true;


		this._init();
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
	worm.Array=function(){
		return new wormarray(this);
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





	worm._constr(options);

	await worm._init();

	return worm;
}


module.exports=createWorm;

//module.exports=worm;


