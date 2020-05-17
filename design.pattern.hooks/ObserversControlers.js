//...........................................................................................
class ObserverLocal extends Observer{
	
	onEmit(param, hookName){
		
		let value = '<div style="background-color: lightblue;">';
		value += "<h1> TITLE: " + this.id + "</h1> ";
		value += "<h2> ACTION: " + hookName + "</h2> ";
		value += "<h3> COMPONENT: " + param.component + "</h3> ";
		value += "</div>"
		
		param.render( value );
	}
}	
//...........................................................................................
class ObserverExternal extends Observer{
	
	onEmit(param, hookName){
		
		let data =  this.id + "&#13;&#10; AAAAAAAAA &#13;&#10; BBBBBBBBB &#13;&#10; CCCCCCCCC " ;
		let value = '<div style="background-color: red;">';
		value +=  "<textarea > "+ data +" </textarea>";
		value += "</div>"
		
		param.render( value );
	}
}	

//...........................................................................................
class ObserverInter extends Observer{
	
	onEmit(param, hookName){
		let value = '<div style="background-color: yellow;">';
		
		switch(hookName){
			case "dysplay_Home_Header":
				value += "<h1> INTER HEADER " + this.id + " </h1>";
			break;
			
			case "dysplay_Home_Footer":
				value += "<span> INTER FOOTER " + this.id + " </span>";
			break;
		}
		
		value += "</div>"
		param.render( value );
	}
}	