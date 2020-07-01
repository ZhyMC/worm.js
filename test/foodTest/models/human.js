
module.exports=(db)=>db.createWorm({
	name:"Human",
	data:{
		name:"text",
		age:"int",
		apple:"Class(Apple)",
		cup:"Class(Cup)"
	},
	async constructor(name,age){
		this.name = name;
		this.age = age;
		this.apple = await db.$Apple.new();
		this.cup = await db.$Cup.new();
	},
	methods:{
		async eatAll(){
			await this.apple.eat();

			for(let i=0;i<5;i++)
				await this.cup.drink(20);
			
			let apple_ate=await this.apple.isAte();
			let cup_dry=await this.cup.isDry();

			console.log("苹果",apple_ate ? "已经被吃了" : "还没吃掉");
			console.log("水杯的水",cup_dry ? "已经喝完了" : "还没喝完");
		}
	}
})