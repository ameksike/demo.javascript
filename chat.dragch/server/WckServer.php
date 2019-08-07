<?php
/**
 * @package DragCh
 * @author ing Antonio Membrides Espinosa
 * @license GPL
 * @version 1.0.0
 * @descrption Connection server library for communication based on Websocket.
 * @update: 02/03/2015
 */
	class WckServer
	{
			protected $flag;
			protected $clients;
			protected $socket;
			protected $cfg;
			
			public function __construct($cfg=false){
				$this->flag = true;
				$this->clients = false;
				$this->cfg = array(
					"port"=>8080,
					"host"=>"localhost"
				);
				$this->setting($cfg);
			}
			
			public function setting($cfg=false){
				if(is_array($cfg)){
					foreach($cfg as $k=>$i) $this->cfg[$k] = $i;
				}
			}
			
			public function start(){
				//... Create TCP/IP sream socket
				$this->socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
				//... Reuseable port
				socket_set_option($this->socket, SOL_SOCKET, SO_REUSEADDR, 1);
				//... Bind socket to specified host
				socket_bind($this->socket, 0, $this->cfg["port"]);
				//... Listen to port
				socket_listen($this->socket);
				//... Create & add listning socket to the list
				$this->clients = array("sys"=>$this->socket);
				//... Start endless loop, so that our script doesn't stop
				while($this->flag){
					//... Manage multipal connections
					$changed = $this->clients;
					//... Returns the socket resources in $changed array
					socket_select($changed, $null, $null, 0, 10);
					$changed = $this->onConnect($changed);
					$changed = $this->onMessage($changed);
				}
			}	
			
			public function stop(){
				$this->flag = false;
				socket_close($this->socket);
			}
			
			public function onMessage($changed){
				//... loop through all connected sockets
				foreach ($changed as $changed_socket) {
					//... check for any incomming data
					while(socket_recv($changed_socket, $buf, 1024, 0) >= 1)
					{
						$received_text = $this->unmask($buf); //unmask data
						$tst_msg = json_decode($received_text); //json decode 
						$user_name = $tst_msg->name; //sender name
						$user_message = $tst_msg->message; //message text

						//... prepare data to be sent to client
						$response_text = $this->mask(json_encode(array('type'=>'usermsg', 'name'=>$user_name, 'message'=>$user_message)));
						$this->send($response_text); //send data
						break 2; //exist this loop
					}
					$this->onDisconnect($changed_socket);
				}
				return $changed;
			}
			
			public function onConnect($changed){
				//... Check for new socket
				if (in_array($this->socket, $changed)) {
					$socket_new = socket_accept($this->socket); //... accpet new socket
					$this->clients[] = $socket_new; //... add socket to client array
					
					$header = socket_read($socket_new, 1024); //... read data sent by the socket
					$this->performHandshaking($header, $socket_new, $this->cfg["host"], $this->cfg["port"]); //... perform websocket handshake
					
					socket_getpeername($socket_new, $ip); //get ip address of connected socket
					$response = $this->mask(json_encode(array('type'=>'system', 'message'=>$ip.' connected'))); //prepare json data
					$this->send($response); //... notify all users about new connection
					
					//make room for new socket
					$found_socket = array_search($this->socket, $changed);
					unset($changed[$found_socket]);
				}
				return $changed;
			}
			
			public function onDisconnect($socket){
					$buf = @socket_read($socket, 1024, PHP_NORMAL_READ);
					if ($buf === false) { //... check disconnected client
						//... remove client for $clients array
						$found_socket = array_search($socket, $this->clients);
						socket_getpeername($socket, $ip);
						unset($this->clients[$found_socket]);
						//... notify all users about disconnected connection
						$response = $this->mask(json_encode(array('type'=>'system', 'message'=>$ip.' disconnected')));
						$this->send($response);
					}
			}
			
			protected function send($msg, $target=false){
				$clients = $target ? array($target) : $this->clients;
				foreach($clients as $changedSocket){
					@socket_write($changedSocket, $msg, strlen($msg));
				}
				return true;
			}
			protected function unmask($text) {
				//... Unmask incoming framed message
				$length = ord($text[1]) & 127;
				if($length == 126) {
					$masks = substr($text, 4, 4);
					$data = substr($text, 8);
				}
				elseif($length == 127) {
					$masks = substr($text, 10, 4);
					$data = substr($text, 14);
				}
				else {
					$masks = substr($text, 2, 4);
					$data = substr($text, 6);
				}
				$text = "";
				for ($i = 0; $i < strlen($data); ++$i) {
					$text .= $data[$i] ^ $masks[$i%4];
				}
				return $text;
			}
			protected function mask($text){
				//... Encode message for transfer to client.
				$b1 = 0x80 | (0x1 & 0x0f);
				$length = strlen($text);
				
				if($length <= 125)
					$header = pack('CC', $b1, $length);
				elseif($length > 125 && $length < 65536)
					$header = pack('CCn', $b1, 126, $length);
				elseif($length >= 65536)
					$header = pack('CCNN', $b1, 127, $length);
				return $header.$text;
			}
			protected function performHandshaking($recevedheader, $clientconn, $host, $port){
				$headers = array();
				$lines = preg_split("/\r\n/", $recevedheader);
				foreach($lines as $line){
					$line = chop($line);
					if(preg_match('/\A(\S+): (.*)\z/', $line, $matches)){
						$headers[$matches[1]] = $matches[2];
					}
				}

				$secKey = $headers['Sec-WebSocket-Key'];
				$secAccept = base64_encode(pack('H*', sha1($secKey . '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')));
				//... hand shaking header
				$upgrade  = "HTTP/1.1 101 Web Socket Protocol Handshake\r\n" .
				"Upgrade: websocket\r\n" .
				"Connection: Upgrade\r\n" .
				"WebSocket-Origin: $host\r\n" .
				"WebSocket-Location: ws://$host:$port\r\n".
				"Sec-WebSocket-Accept:$secAccept\r\n\r\n";
				socket_write($clientconn, $upgrade, strlen($upgrade));
			}
	}
