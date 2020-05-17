//.......................................................... SUPER CLASS Observed ................................
class Observed{
	list;
	
	constructor(){
		this.list = {};
	}
	
	register(key, observer){
		key = key || 'default';
		if(!this.list[key]) this.list[key] = [];
		this.list[key].push(observer);
	}
	
	emit(key, param){
		key = key || 'default';
		for(var i=0; i<this.list[key].length; i++)
				this.list[key][i].onEmit(param, key);
	}
}

//.......................................................... SUPER CLASS Observers ................................
class Observer{
	id;
	constructor(id){
		this.id = id || "observer" ;
	}
	
	onEmit(param, key){	
		console.log(key);
	}
}	