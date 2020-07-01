let wormclient=require(__dirname+"/../../index.js");

async function start(){
	let db = await wormclient.create({
		host:"localhost",
		user:"root",
		password:"123456",
		database:"mysql"
	});
	await db.createWorm({
		name:"Apple",
		data:{
			name:"text"
		},
		constructor(){
			this.name=Math.random()+"";
		},
		methods:{
			getName(){
				return this.name;
			}
		}
	})

	await db.createWorm({
		name:"MyArray",
		data:{
			arr:"Array(Apple)"
		},
		async constructor(){

		},
		methods:{
			async getAll(){

				for(let i=0;i<100;i++){
					let apple=await db.$Apple.new();
					await this.arr.push(apple);
				}

				return await this.arr.find({});
			}
		}
	})

	let arr = await db.$MyArray.new();

console.log("当前数组里有",(await arr.getAll()).length,"个苹果");

}

start();
