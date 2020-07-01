let wormclient=require(__dirname+"/../../index.js");

async function start(){
	let db = await wormclient.create({
		host:"localhost",
		user:"root",
		password:"123456",
		database:"mysql"
	});

	await db.loadModels(__dirname+"/models/");


	let human = await db.$Human.new("zhy",20);


	await human.eatAll();
}

start();
