module.exports={
	"text":{sqltype:"text",default:""},
	"int":{sqltype:"int",default:"0"},
	parseTypeLang(str){
		let reg=/(.*)\((.*)\)/;
		if(reg.test(str)){
			let match=reg.exec(str);
			return {type:match[1],subtype:match[2]};
		}else
			return {type:"",subtype:str};
	},
	getTypeDef(typename){
		let parsed=this.parseTypeLang(typename);

			if(parsed.type=="Class")
				return {sqltype:"int",default:undefined}
			else if(parsed.type=="Array")
				return {sqltype:"text",default:undefined};
			else if(parsed.type==""){

				if(parsed.subtype=="text")
					return {sqltype:"text",default:""};
				else if(parsed.subtype=="int")
					return {sqltype:"int",default:"0"};
			}
	},
	data2sqldata(raw,datadef){
		let data={};

		for(let i in datadef)
		{

			let parsed=this.parseTypeLang(datadef[i]);

			if(parsed.type=="Class"){
				data[i]=raw[i] ? raw[i].getId() : "0";
			}
			else if(parsed.type=="Array")
				data[i]=parsed.subtype;
			else data[i]=raw[i];
	
		}	

		

		//console.log(raw,datadef,data);

		return data;

	},
	sqldata2data(raw,datadef,db){

		let data={};
		for(let i in datadef)
		{

			let parsed=this.parseTypeLang(datadef[i]);
	

			if(parsed.type=="Class")
				data[i]=db.model[parsed.subtype].get(raw[i]);
			else if(parsed.type=="Array")
				data[i]=db.model[parsed.subtype].Array();
			else data[i]=raw[i];
		}		


		return data;
	}
}