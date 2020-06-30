## Worm.js 文档

### 1.1 简介

Worm.js 是一个 ORM 框架，即一种将面向对象编程的思想引入到数据库模型的设计中的方法。

面向对象中编程的 

```
"类" 对应数据库的 "表"   
"类的实例" 对应 "表的行"    
"类的属性" 对应 "表的字段"   
"属性的类型" 对应 "字段的类型"
```

这种数据库设计方式可以把面向对象良好的性质一起带来，规范化了一个大型系统中数据模型的设计模式，    
   
> 因此十分建议使用 ORM 框架对网站的数据模型进行设计。   

    
特别注意的是，本框架把"表"也看作是一个"数组"，并且可以作为类的属性，之后会提到。   


### 1.2 安装

```项目处于建设中,未发布至NPM,请 git clone 本项目并手动 npm install <项目路径> 进行安装。```

### 1.3 简单实例

----------------
models/apple.js
```
module.exports=(db)=>db.createWorn({
	name:"Apple", //声明类名
	data:{  //声明属性
		color:"text",
		ate:"int"
	},
	constructor(){ //构造器,在创建实例的时候会调用,可以不写
		this.color="red";
	},
	methods:{   //声明类的所有方法
		getColor(){
			return this.color;
		}
		isAte(){
			return this.ate == 1;
		}
		eat(){
			this.ate = 1;
		}
	}

});
```

----------------
models/cup.js
```
module.exports=(db)=>db.createWorn({
	name:"Cup",
	data:{
		water:"int",
		isdry:"int"
	},
	constructor(){
		this.water=100;
	},
	methods:{
		async drink(much){
			this.water -= much;
			if(this.water <= 0){
				this.isdry = true;
			}
		},
		isDry(){
			return this.isdry;	
		}

	}
});
```


----------------

models/human.js
```
let Cup=require("./cup.js");
let Apple=require("./Apple.js");

module.exports=(db)=>db.createWorm({
	name:"Human",
	data:{
		name:"text",
		age:"int",
		apple:"Class(Apple)",
		cup:"Class(Cup)"
	},
	constructor(name,age){
		this.name = name;
		this.age = age;
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

```

------------------
app.js
```
let wormclient=require("worm.js");

async function start(){
	let db = await wormclient.create({
		host:"localhost",
		user:"root",
		password:"123456",
		database:"mysql"
	});

	db.loadModels("./models/");

	let human = db.$Human.new();


	await human.eatAll();
}

start();

```

-------------------