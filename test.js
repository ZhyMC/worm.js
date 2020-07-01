let wormclient=require(__dirname+"/wormclient/wormclient.js");

wormclient.create({
	host:"localhost",
	user:"root",
	password:"123456",
	database:"mysql",
}).then(async(db)=>{


	await db.createWorm({
		name:"test",
		data:{
			name:"text",
			banana:"Class(Banana)"
		},
		async constructor(){
			this.banana=await db.$Banana.new("233");
		},
		methods:{
			async getAllBananas(){
				return this.banana;
			}
		}
	})

	await db.createWorm({
		name:"Banana",
		data:{
			name:"text",
			eated:"int"
		},
		constructor(name){
			this.name=name;
		},
		methods:{
			getName(){
				return this.name;
			},
			eat(){
				this.eated=1;
			},
			getEat(){
				return this.eated;
			}
		}
	});



	let test=await db.model.test.new();

	let arr=await test.getAllBananas();
	console.log(await arr.getName());


})


