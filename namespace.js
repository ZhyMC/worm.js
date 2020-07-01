class namespace{
	constructor(path){
		this.splits=path.split("/");
		if(this.splits[0] == "" )this.splits.shift();
	}
	getSpace(){
		return this.splits.slice(0,this.splits.length-1).join("/");
	}
	getEntity(){
		return this.splits[this.splits.length-1];
	}

}
namespace.parse=(str)=>{

	let nm=new namespace(str);

	return {space:nm.getSpace(),entity:nm.getEntity()}
}
namespace.stringify=(obj)=>{
	return obj.space+"/"+obj.entity;
}


module.exports=namespace;