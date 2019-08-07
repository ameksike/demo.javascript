/**
 *
 * @package: resource
 * @version: 0.1

 * @description: StyleManager, permite la incorporacion dinamica de stilos a traves del DOM
 * @authors: ing. Antonio Membrides Espinosa
 * @making-Date: 12/11/2011
 * @making-Date: 15/11/2011
 * @license: GPL v3
 *
 */
var StyleManager = function()
{
	this.css = document.createElement("style");
	this.css.type = "text/css";
	document.getElementsByTagName("head")[0].appendChild(this.css);
	var _this = this;
	
	this.addStyle = function(strcss, nl){
		if(nl) strcss +="\n";
		if (_this.css.styleSheet){
			_this.css.styleSheet.cssText += strcss;
		} else {
			_this.css.appendChild(document.createTextNode(strcss));
		}
	}
}
