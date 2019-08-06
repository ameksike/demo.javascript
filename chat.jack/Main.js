/**
 * @package    jack
 * @subpackage app
 * @author     ing. Antonio Membrides Espinosa
 * @date       29/10/2011
 * @version    SVN: $Id: XMPP.class.js 23810 2009-11-12 11:07:44Z  $
 */
var write = function(txt, com)
{	//... funcion super basica para escribir texto en el DOM
	com = com || "box";
	document.getElementById(com).innerHTML += txt + " <br>";
}
//... Ejemplo de como usar XMPP ..................
var xmpp = new XMPP({
	'user' 		: "asterisk",
	'pass'		: "asterisk2011",
	'server'  	: "jabber.ucid.uci.cu",
	'port' 		: "5280",
	'connect'	: "auto"
});

xmpp.event.connecting.push(function(){ 		write('connecting...'); });
xmpp.event.failedConnect.push(function(){ 	write('failedConnect...'); });
xmpp.event.disconnecting.push(function(){ 	write('disconnecting...'); });
xmpp.event.disconnected.push(function(){	write('am offline'); });/**/

xmpp.event.connected.push(function(){
	write('Im online');
	xmpp.send("oeeee", "platel@jabber.ucid.uci.cu");
	xmpp.send("pssss", "feleon@jabber.uci.cu");
});


var obj = {
	name: "tusa",
	onCall : function(msg){
		if(msg.text == "dime"){
			xmpp.send("que vola: "+obj.name, msg.from);
		}
	},
	onJson : function(msg){
		switch(msg.text.substring(0, 4))
		{
			case "json":
				msg.text = msg.text.substring(4, msg.text.length);
				eval("var obj = "+msg.text);
				if(obj) alert(obj.name);
			break;
			
			case "out":
				xmpp.disconnect();
			break;
		}
	}
}
xmpp.event.chat.push(obj.onCall);
xmpp.event.chat.push(obj.onJson);

xmpp.event.messages.push(function(msg){
	write("messages: "+" from: "+msg.from+" data: "+msg.text);
});

xmpp.event.listen.push(function(msg){
	write("listen: "+" from: "+msg.from+" data: "+msg.text);
});/**/

xmpp.event.error.push(function(msg){
	write("error: "+" from: "+msg.from+" data: "+msg.text);
});/**/
