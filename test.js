let wormclient=require(__dirname+"/wormclient/wormclient.js");

wormclient.create({
	host:"localhost",
	user:"root",
	password:"123456",
	database:"mysql",
}).then(async(db)=>{

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
//				console.log("a")
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


	await db.createWorm({
		name:"people",
		data:{
			name:"text",
			banana:db.$Banana.Array()
		},
		methods:{
			async getAllBananas(){
				await this.banana.$worm.new("test");
				return this.banana.find({
					name:"tes"
				});
			}
		}
	})


	let people=await db.model.people.new();

	let arr=await people.getAllBananas();
	console.log(arr);
	arr.forEach(async(x)=>{

		console.log(x.$id,await x.getName());

	});

})


