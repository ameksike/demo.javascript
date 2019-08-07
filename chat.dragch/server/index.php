<?php
/**
 *
 * @package: chat
 * @subpackage: server
 * @version: 0.1
 * @description: Dragch server for a chat service
 * @authors: ing. Antonio Membrides Espinosa
 * @making-Date: 01/03/2015
 * @update-Date: 03/03/2015
 * @license: GPL v3
 *
 */  
	include "WckServer.php";
	$config = include "cfg/config.php";
	$server = new WckServer($config);
	$server->start();
