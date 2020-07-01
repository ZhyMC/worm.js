let fs=require("fs");
let Path=require("path");


function isDir(path){
	return fs.statSync(path).isDirectory();
}
 function modelScanner(path){
 	let results=[];

	
 	let scan=(p,sp)=>{
 		let items = fs.readdirSync(p);
		for(let i in items){
			let file=Path.join(p,items[i]);
			if(isDir(file)){
				let dirname=Path.basename(file);
				scan(file,sp+dirname)
			}else
				results.push({file:Path.relative(path,file),space:sp});
			
		}
 	}
 	scan(path,"/");

 	return results;
}
module.exports = modelScanner;
