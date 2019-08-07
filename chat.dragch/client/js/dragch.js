/**
 *
 * @package: chat
 * @subpackage: client
 * @version: 0.1
 * @description: Dragch client library websockets implementation  for a chat service
 * @authors: ing. Antonio Membrides Espinosa
 * @making-Date: 01/03/2015
 * @update-Date: 03/03/2015
 * @license: GPL v3
 *
 */   
$(document).ready(function(){
	
	var client = new WckClient(config);
	
	client.onMessage = function(ev){
		var msg = JSON.parse(ev.data); //... PHP sends Json data
		var type = msg.type; //... message type
		var umsg = msg.message; //... message text
		var uname = msg.name; //... user name 

		if(!uname){
			uname = 'system' ;
		}else{
			$('#message_box').append(createMessage (type, Base64.decode(umsg), uname)) ;
			$('#message').val(''); //... reset text
			$('#message_box').scroll(5);
		}
		$('div.panel-body').scrollTop($('div.panel-body').scrollTop() + 1000);
	}
	
	client.onConnect = function(ev){
		$('#message_box').append(createLi('System','conectado.png','Connected !!!')); 	
	}
	
	client.onDisconnect = function(ev){
		$('#message_box').append(createLi('System','desconectado.png','Connection Closed'));
	}
	
	client.onError = function(ev){
		$('#message_box').append(createLi('System','error.png','Error Occurred '+ev.data));
	}
	
	function createMessage (type,msg,username) {
		
		var img = 'chrome.png' ;
		var myname = $('#name').val(); //get user name
		
		if(username == myname){
			img = 'firefox.png' ;
		}

		if(username == 'system'){
			var img = 'conectado.png' ;
			if(type=='desconectado'){
				img = 'desconectado.png' ;
			}	
		}
		return createLi(username,img,msg) ;
	}
	
	function sendmess(){
		var mymessage = $('#btn-input').val();  //get message text
		var myname = $('#name').val(); //get user name
		
		if(myname == ""){ //empty name?
			alert("Enter your Name please!");
			return;
		}
		if(mymessage == ""){ //emtpy message?
			alert("Enter Some message Please!");
			return;
		}
		
		//prepare json data
		var msg = {
			message: Base64.encode(mymessage),
			name: myname,
		};
		//convert and send data to server
		client.send(msg);
		$('#btn-input').val("");
	}

	function clear(){
		$('#btn-input').val("");
		$('#message_box').html("");
	}
	function createLi(username,img,text){
		var li = $(' <li class="left clearfix"><span class="chat-img pull-left"><img src="icos/'+img+'" alt="User Avatar" class="img-circle" /></span><div class="chat-body clearfix"><div class="header"><strong class="primary-font">'+username+'</strong> </div><p>'+text+'</p></div></li>');
		var myname = $('#name').val(); //get user name
		if(username == myname){
			li = $(' <li class="right clearfix"><span class="chat-img pull-right"><img src="icos/'+img+'" alt="User Avatar" class="img-circle" /></span><div class="chat-body clearfix"><div class="header"><strong class="primary-font">'+username+'</strong> </div><p>'+text+'</p></div></li>');
		}
		return li;
	}

	$('#btn-chat').click(function(){  sendmess(); });
	$("#btn-input").keyup(function(hand) {
		switch(hand.keyCode){
			case 13: sendmess(); break; //... enter
			case 27: clear(); break;    //... escape
		}
    });
	$("#btn-clear").click(function(hand) {
		clear();
    });
	$("#test").click(function(hand) {  });

	client.connect();
});

