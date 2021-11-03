<?php
/*
 * Ejemplo de empleo
 */
	include "MotionConfigManager.php";
	$obj = new MotionConfigManager('cfg/', '/etc/motion/motion.conf');
	$obj->addThread(array(
		'url'=> 'http://localhost.ucid.cu:800/video.cgi', //... esta propiedad solapa [agent:''/channel:80/ip]

		'agent'=> 'video.cgi',
		'channel'=> '800',
		'ip'=> 'localhost.ucid.cu',

		'user' => 'admin',
		'passw' => '123456'  
		//'port'=> '5879',    //... si no se especifica se autogenera
	));/*
	$obj->dellThread(5880);
	$obj->dellThread(5882);*/
	$obj->dellThread(1);
?>
