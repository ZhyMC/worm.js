module.exports=(db)=>db.createWorm({
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
		},
		isAte(){
			return this.ate == 1;
		},
		eat(){
			this.ate = 1;
		}
	}

});