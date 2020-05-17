class Viewmin
{
	constructor(component, action, type){
		this.component = component;
		this.type = type || 'html';
	}
	
	render(value){
		if(this.type == 'html'){
			let tmp = document.getElementById(this.component).innerHTML;
			document.getElementById(this.component).innerHTML = tmp  + value;
		}else{	
			console.log(value);
		}
	}	
	
	clean(){
		document.getElementById(this.component).innerHTML = '';
	}
}