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
var EMBEDDriver = function()
{
	var _this = this; 
	if(!arguments[0]) arguments[0] = {};
	//--- Properties --------------------------------------------------------------	
	this.protocol= arguments[0].protocol || "rtsp"; 
	this.app     = arguments[0].app || 'application/x-vlc-plugin';
  	this.ip      = arguments[0].ip  || 'localhost'; 
	this.port    = arguments[0].port  || 8554; 
	this.width   = arguments[0].width  || 640;
	this.height  = arguments[0].height || 480;
	this.arv     = arguments[0].arv || '';
	this.url     = arguments[0].url || false;
	this.volume  = arguments[0].volume || 100;
	this.id      = arguments[0].id || "view_"+_this.ip;
	//--- Funtionalities --------------------------------------------------------------
	this.getURL = function()
	{       //'rtsp://10.12.162.118:8554/video'
		return (_this.url) ? _this.url :
		       _this.protocol + "://" +
		       _this.ip + ":" +	_this.port + 
		       _this.arv;
	}

	
	this.buildView = function(callback)
	{
                _this.video = document.createElement("embed");
		_this.video.setAttribute('type', _this.app);
		_this.video.setAttribute('autoplay', 'yes');
		_this.video.setAttribute('loop', 'no');	
		_this.video.setAttribute('volume', _this.volume);
		_this.video.setAttribute('width', _this.width);
		_this.video.setAttribute('height', _this.height);
		_this.video.setAttribute('target', _this.getURL());
		_this.video.setAttribute('id', _this.id );

		_this.video.ondblclick = function(){ _this.trigger('ondblclick', _this.video); };
		_this.video.onclick = function(){  _this.trigger('onclick', _this.video); };
		if(callback) callback();
	};

	this.asobj = function()
	{
		return _this.video;
	};

	this.ashtml = function()
	{
		_this.buildView();
		var container = document.createElement("div");
		container.appendChild(_this.video);
		return container.innerHTML;
	};

	this.render = function(id, callback)
	{
		_this.buildView(function(){
			if(id){
				var con = document.getElementById(id);
				if(con){
					con.innerHTML = "";
					con.appendChild(_this.video);
				}
			}
			if(callback) callback();
		});
	};

	this.resize = function(width, height){
		var video = document.getElementById(_this.id);
		if(video){
			video.setAttribute('width', width);
			video.setAttribute('height', height);
		}
	};

	this.event = {
		"ondblclick" : [],
		"click" : []
	}

	this.trigger = function(eve, params, events){
		events = events || _this.event;
		for(var i in events[eve]) if(i!='remove') events[eve][i](params);
	}

}
