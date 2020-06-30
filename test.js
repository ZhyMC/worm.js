

let wormclient=require(__dirname+"/wormclient/wormclient.js");
wormclient.create({
	host:"localhost",
	user:"root",
	password:"123456",
	database:"mysql"
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
		async constructor(){
			
		},
		methods:{
			getAllBananas(){
				return this.banana.find({});
			}
		}
	})

	let people=await db.model.people.new();


	people.getAllBananas().then(console.log);

})


