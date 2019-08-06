/**
 * @package    jack
 * @subpackage strophe
 * @author     ing. Antonio Membrides Espinosa
 * @date       29/10/2011
 * @version    SVN: $Id: XMPP.class.js 23810 2009-11-12 11:07:44Z  $
 */
var XMPP = function(params)
{
	var _this = this;
	this.diver = false
	
	this.property = {
		user 	: params.user || "asterisk",
		pass	: params.pass || "asterisk2011",
		server  : params.server || "jabber.ucid.uci.cu",
		port 	: params.port || "5280",
		service	: params.service || '/http-bind',
	}

	this.send = function(msg, to, from)
	{
		from = from || _this.property.user+"@"+_this.property.server
		var i = to.indexOf('/');
		if(i != -1) to = to.substring(0, i);
		var data = {
			"to": to, 
			"from": from, 
			"type":'chat',
			"xml:lang":"es"
		};
		var body = $build("body");
		body.t(msg);
		var reply = $msg(data).cnode(body.tree());
		_this.diver.send(reply.tree());
	}
	
	this.disconnect = function(params, force)
	{
		_this.diver.disconnect();	
	}

	this.connect = function(params, force)
	{
		force = force || false;
		params = params || _this.property;
		if(!_this.diver || force)
			_this.diver = new Strophe.Connection("http://"+params.server+":"+params.port+params.service);
		
		_this.diver.connect(params.user+"@"+params.server, params.pass, onConnect);	
	}

	var onConnect = function (status)
	{
		switch(status){
			case Strophe.Status.CONNECTING:
				for(var i in _this.event.connecting) if(i) _this.event.connecting[i]();
			break;

			case Strophe.Status.CONNFAIL:
				for(var i in _this.event.failedConnect) if(i) _this.event.failedConnect[i]();
			break;

			case Strophe.Status.DISCONNECTING:
				for(var i in _this.event.disconnecting) if(i) _this.event.disconnecting[i]();
			break;

			case Strophe.Status.DISCONNECTED:
				for(var i in _this.event.disconnected) if(i) _this.event.disconnected[i]();
			break;

			case Strophe.Status.CONNECTED:
				_this.diver.addHandler(onMessage, null, 'message', null, null,  null);
				_this.diver.send($pres().tree());
				for(var i in _this.event.connected) if(i) _this.event.connected[i]();
			break;
		}
	}

	var onMessage = function(msg)
	{
		var ele = msg.getElementsByTagName('body');
		var mst = {
			"to" : msg.getAttribute('to'),
			"from" : msg.getAttribute('from'),
			"type" : msg.getAttribute('type'),
			"text" : Strophe.getText(ele[0])
		}
		switch(mst.type){
			case null:
				if(mst.text) for(var i in _this.event.messages) if(i) _this.event.messages[i](mst, msg);
			break;

			default:
				for(var i in _this.event[mst.type]) if(i) _this.event[mst.type][i](mst, msg);
			break;
			
		}
		if(mst.text) for(var i in _this.event.listen) if(i) _this.event.listen[i](mst, msg);
		return true;
	}

	this.event = {
		"connecting" : [],
		"failedConnect" : [],
		"disconnecting"  : [],
		"disconnected"  : [],
		"connected"  : [],

		"listen": [],
		"chat"  : [],
		"error"  : [],
		"messages" : []
	}

	this.trigger = function(eve, params, events){
		events = events || _this.event;
		for(var i in events[eve]) if(i) events[eve][i](params);
	}

	if(!params.connect || params.connect == "auto")
		this.connect();
}
