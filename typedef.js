module.exports={
	"text":{sqltype:"text",default:""},
	"int":{sqltype:"int",default:"0"},
	isSpecType(o){
		return typeof(o)=="function" || typeof(o)=="object";
	},
	getTypeDef(typename){
		if(this.isSpecType(typename)){
			if(typename.$isWormCls)
				return {sqltype:"int",default:"0"}
			else if(typename.$isArray) return {sqltype:"text",default:typename};
			else throw new Error("Error TypeDef");
		}

		return this[typename];
	},
	data2sqldata(raw,datadef){
		let data={};
		for(let i in datadef)
		{
			if(!this.isSpecType(datadef[i])){
				data[i]=raw[i]
				continue;
			}

			if(datadef[i].$isWormCls)
				data[i]=raw[i].getId();
			else if(datadef[i].$isArray){
				data[i]=raw[i].$name;
			}
		}	

		//console.log(raw,datadef,data);

		return data;

	},
	sqldata2data(raw,datadef){

		let data={};
		for(let i in datadef)
		{
			if(!this.isSpecType(datadef[i])){
				data[i]=raw[i];
			}else{

				if(datadef[i].$isWormCls)
					data[i]=datadef[i].get(raw[i]);
				else if(datadef[i].$isArray){
					data[i]=datadef[i];
				}

			}

		}		


		return data;
	}
}