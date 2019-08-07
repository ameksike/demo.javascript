<?php
	$value = $_REQUEST['data'];
	$value = "var options = ".$value;
	file_put_contents ("../../../visor/config.js", $value);
?>
