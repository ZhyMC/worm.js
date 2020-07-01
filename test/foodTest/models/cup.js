module.exports=(db)=>db.createWorm({
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