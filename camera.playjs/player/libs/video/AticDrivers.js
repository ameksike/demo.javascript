/**
 *
 * @package: video
 * @version: 0.1

 * @description: AticDrivers, permite administrar el flujo de video transmitido desde una cámara IP de fabricación Atic 
 * @authors: ing. Antonio Membrides Espinosa
 * @making-Date: 11/03/2011
 * @making-Date: 05/05/2011
 * @license: GPL v3
 *
 */
AticDrivers = function(params)
{
	//--- Properties --------------------------------------------------------------	
	this.url    = params.url;
	this.width  = params.width;
	this.height = params.height;
	this.user   = params.user;
	this.passw  = params.passw;
	this.id     = params.id || "view_"+_this.url;
	this.fzoom  = 2500;
	this.firis  = 250;
	this.ffocus = 2500;

	this.cgiVideo   = ":800/cgi-bin/cmd/encoder?GET_STREAM";
	this.cgiVideo   = "/cam/kk/"+this.id+".jpg";
	this.cgiLogin   = "/cgi-bin/videoconfiguration.cgi";
	this.cgiControl = "";

	var _this = this;

	this.buildDriver = function(){
		//_this.object.setAttribute('style', "display:none");
		//_this.object.setAttribute('id', 'DvObj_'+params.url);
		//document.body.appendChild(_this.object);
	}

	this.buildView = function(callback)
	{
		_this.video  = document.createElement('img');
		_this.video.setAttribute('src', "http://"+_this.url+_this.cgiVideo);
		_this.video.setAttribute('width', _this.width);
		_this.video.setAttribute('height', _this.height);
		_this.video.setAttribute('id', _this.id );
		
		/*for(var i in _this.event) if(i!='remove')
			_this.video[i] = function(){
				_this.trigger(i, _this.video);
			}*/

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





	//--- Funtionalities -------------------------------------------------------------
	this.exec = function(action, cgi, callback) 
	{
		cgi = cgi || _this.cgiControl;
		var url = "http://"+ _this.url+cgi;
		if(action) url += action;
		if(!_this.iframe)_this.login(callback);
		_this.iframe.src = url;
		if(_this.iframe.window)
		_this.iframe.window.location.reload();
		_this.iframe.onload = callback;
	};
	//--- Navegate Control Panel --------------------------------------------
	this.login = function(callback)
	{
		if(!_this.iframe){
			_this.iframe = document.createElement("IFRAME");
			_this.iframe.setAttribute('name', "DvIframe"+_this.url);
			//_this.iframe.setAttribute('style', "display:none");

			_this.form = document.createElement('form');  
			_this.form.action = "http://"+_this.url+_this.cgiLogin;
			_this.form.method = 'post';
			_this.form.target = _this.iframe.name;

			document.body.appendChild(_this.iframe);
			document.body.appendChild(_this.form);

		}
		_this.form.innerHTML = '';
		addData({
			"LOGIN_ACCOUNT": _this.user,
			"LOGIN_PASSWORD": _this.passw,
			"LANGUAGE": "0",
			"btnSubmit":"Login"
		});
		
		_this.iframe.onload = function(){
			_this.config(callback);
		}
		_this.form.submit();/**/
		//_this.iframe.onload = callback;
	};
	this.config = function(callback)
	{
		_this.form.action = "http://"+_this.url+"/cgi-bin/confsel.cgi";
		_this.form.innerHTML = '';
		addData({
			"ChSel": 1,
			"btnSubmit": "Apply",
			"HIDDEN_HIX": 184009,
			"HIDDEN_MSG": "SWITCH_CH",
			"HIDDEN_LANG": 0
		});

		_this.iframe.onload = function(){
			
			_this.form.action = "http://"+_this.url + ":800/cgi-bin/videoconfiguration.cgi";
			_this.form.innerHTML = '';
			addData({
				"LOGIN_ACCOUNT": _this.user,
				"LOGIN_PASSWORD": _this.passw,
				"LANGUAGE": "0",
			});
			_this.iframe.onload = callback;
			_this.form.submit();
		}
		_this.form.submit();
	}
	var addData = function (lst)
	{
		_this.form.innerHTML = '';
		for(var i in lst)
		{
			var tmp = document.createElement('input');  
			tmp.name = i;
			tmp.type = "hidden";
			tmp.value = this.json ? this.json.encode(lst[i]) : lst[i];
			_this.form.appendChild(tmp);	
		}
	};

	this.setEvent = function(event, handler){
		var video = document.getElementById("view_"+_this.url);
		if(video)video[event] = handler;
	};
}
