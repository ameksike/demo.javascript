/**
 *
 * @package: video
 * @version: 0.1

 * @description: AXisDrivers, permite administrar el flujo de video transmitido desde una cámara IP de fabricación AXis
 * @authors: ing. Antonio Membrides Espinosa
 * @making-Date: 04/02/2010
 * @making-Date: 11/04/2011
 * @license: GPL v3
 *
 */
var Camera = function()
{
	if(!arguments[0]) arguments[0] = {};
	//--- Properties --------------------------------------------------------------	
  	this.url     = arguments[0].url; 
	this.width   = arguments[0].width;
	this.height  = arguments[0].height;
	this.user    = arguments[0].user;
	this.passw   = arguments[0].passw;
	this.app     = 'application/vlc';
	this.fzoom   = 2500;
	this.firis   = 250;
	this.ffocus  = 2500;
        this.control = arguments[0].control;
        this.id      = arguments[0].id;
	this.cgiControlers = arguments[0].cgiControlers;
	this.cgiVideo = arguments[0].cgiVideo; 
	This = this; 
	//--- Funtionalities --------------------------------------------------------------
	var exec = function(action) 
	{
		var url = "http://"+ this.url + this.cgiControlers;
		if(action) url += "&" + action;
		location.href= url;
	};
	this.getHtmlCode = function()
	{
                var object = document.createElement("OBJECT");
		var object = "<OBJECT id='mplayer' >";
		var embed  = "<EMBED id='"+this.id+"' ";
		embed += " width='" + this.width + "' height='" + this.height + "'";  
		embed += " type='" + this.app + "'";
		embed += " src='http://"+ this.user + ":" + this.passw + "@" + this.url + "/axis-cgi/mjpg/video.cgi'";
		embed += " displaysize='4' autosize='-1'bgcolor='darkgblue' showcontrols='true'";
		embed += " showtracker='-1'showdisplay='0' showstatusbar='1' videoborder3d='-1'";
		embed += " autostart='true' designtimesp='5311' loop='true'> </EMBED>";
		var html = object + embed + "</OBJECT>";
		return html;
	};
}
//------------------------------------------------------------------------------------------
var AXisDrivers = function(params)
{
	//--- Properties --------------------------------------------------------------	
	This = this;
	//--- Funtionalities --------------------------------------------------------------
	var exec = function(action, camera) 
	{
		if(camera) cam = camera; else cam = 1;
		var url = "http://"+ this.url +"/axis-cgi/com/ptz.cgi?camera="+cam;
		if(action) url += "&" + action;
		location.href= url;
	};
	this.getHtmlCode = function()
	{
		var object = "<OBJECT id='mplayer' >";
		var embed  = "<EMBED id='"+this.id+"' ";
		embed += " width='" + this.width + "' height='" + this.height + "'";  
		embed += " type='" + this.app + "'";
		embed += " src='http://"+ this.user + ":" + this.passw + "@" + this.url + "/axis-cgi/mjpg/video.cgi'";
		embed += " displaysize='4' autosize='-1'bgcolor='darkgblue' showcontrols='true'";
		embed += " showtracker='-1'showdisplay='0' showstatusbar='1' videoborder3d='-1'";
		embed += " autostart='true' designtimesp='5311' loop='true'> </EMBED>";
		var html = object + embed + "</OBJECT>";
		return html;
	};
	//--- Navegate Control Panel --------------------------------------------
	this.doLeft = function(){this.exec("move=left");};
	this.doRight = function(){this.exec("move=right");}; 
	this.doZoomIn = function(){this.exec("rzoom="+This.fzoom);};
	this.doZoomOut = function(){this.exec("rzoom=-"+This.fzoom);};
	this.doFocusIn = function(){this.exec("rfocus="+This.ffocus);};
	this.doFocusOut = function(){this.exec("rfocus=-"+This.ffocus);};
	this.doIrisIn = function(){this.exec("riris="+This.firis);};
	this.doIrisOut = function(){this.exec("riris=-"+This.firis);};
}




