/**
 *
 * @package: control
 * @version: 0.1

 * @description: CameraView implementa un visor de cámaras, administrando 3 recursos fundamentales: video, ctrl, view
 * @authors: ing. Antonio Membrides Espinosa
 * @making-Date: 12/11/2011
 * @making-Date: 15/11/2011
 * @license: GPL v3
 *
 */
var CameraView = function(params)
{
	params = params || {};
	params.build = params.build || 'auto';
	if(params.build == 'auto') this.build(params, this);
}

CameraView.prototype.build = function(params, _this)
{
	params = _this.format(params);
	var driver = {};
	driver['video'] = _this.buildVIDEODriver(params.video);
	if(params.ctrl) driver['ctrl'] = _this.buildCTRLDriver(params.ctrl);
	driver['view'] = _this.buildGUIDriver(params, driver);
	_this.buildEvents(driver, params);
	driver.video.render(params.video.container);
	driver['view'].show();
}

CameraView.prototype.format = function(params){
	params = params || {};

	params.video = params.video || {};
	params.video.id = params.id || '_cm_' + params.video.url;
	params.video.container = params.video.container || 'cplayer_' + params.video.url + "_" +params.id;

	params.view = params.view || {};
	params.view.title = params.view.title || "Camera's Visor";
	params.view.width = params.view.width || '640';
	params.view.height = params.view.height || '480';
	params.view.show = params.view.show || true;
	params.view.container = params.view.container || params.video.container;

	if(params.ctrl){
		params.ctrl.user = params.ctrl.user || "asterisk";
		params.ctrl.pass = params.ctrl.pass || "asterisk2011";
		params.ctrl.server = params.ctrl.server || "jabber.ucid.uci.cu";
		params.ctrl.port = params.ctrl.port || "5280";
		params.ctrl.connect = params.ctrl.connect || "auto";
		params.receptor = params.receptor || "platel@jabber.ucid.uci.cu";
		params.view.buttons = true;
	}

	return params;
}

CameraView.prototype.buildEvents = function(driver, options){
	//--- windows
	driver.view.event.resize.push(function(driver){
		if(driver.video) driver.video.resize(driver.width, driver.height );
	});
	driver.view.event.beforeshow.push(function(driver){
		if(driver.video) driver.video.resize(driver.getInnerWidth(), driver.getInnerHeight() );
	});
	if(driver['ctrl']){
		//--- controles ------------------------------------
		driver.view.controls['up'].click.push(function(driver){ 		driver.ctrl.send("A", driver.receptor);  });
		driver.view.controls['up'].mouseout.push(function(driver){	 	driver.ctrl.send("S", driver.receptor);  });

		driver.view.controls['down'].click.push(function(driver){ 		driver.ctrl.send("B", driver.receptor);  });
		driver.view.controls['down'].mouseout.push(function(driver){ 		driver.ctrl.send("S", driver.receptor);  });

		driver.view.controls['left'].click.push(function(driver){ 		driver.ctrl.send("D", driver.receptor);  });
		driver.view.controls['left'].mouseout.push(function(driver){ 		driver.ctrl.send("S", driver.receptor);  });

		driver.view.controls['right'].click.push(function(driver){ 		driver.ctrl.send("E", driver.receptor);	});
		driver.view.controls['right'].mouseout.push(function(driver){		driver.ctrl.send("S", driver.receptor);	});

		driver.view.controls['zoomIn'].click.push(function(driver){ 		driver.ctrl.send("G", driver.receptor);	});
		driver.view.controls['zoomIn'].mouseout.push(function(driver){ 		driver.ctrl.send("S", driver.receptor);	});

		driver.view.controls['zoomOut'].click.push(function(driver){ 		driver.ctrl.send("F", driver.receptor);	});
		driver.view.controls['zoomOut'].mouseout.push(function(driver){		driver.ctrl.send("S", driver.receptor);	});

		driver.view.controls['focusOut'].click.push(function(driver){ 		driver.ctrl.send("H", driver.receptor);	});
		driver.view.controls['focusOut'].mouseout.push(function(driver){ 	driver.ctrl.send("S", driver.receptor);  });

		driver.view.controls['focusIn'].click.push(function(driver){ 		driver.ctrl.send("I", driver.receptor);	});
		driver.view.controls['focusIn'].mouseout.push(function(driver){ 	driver.ctrl.send("S", driver.receptor);  });
	}
	//--- video -------------------------------------------
	driver.video.event.ondblclick.push(function(obj){ Ext.getCmp("InfoCmWindow").maximize(); });
}

CameraView.prototype.buildVIDEODriver =  function(params){
	params.id = params.id || params.container + '_pl';
	return new EMBEDDriver(params);
}

CameraView.prototype.buildGUIDriver = function(params, lst){
	var obj = new CamViewWindow(params['view']);
	for(var i in lst) obj.objWindow[i] = lst[i];
	obj.objWindow['receptor'] = params.receptor;
	return obj;
}

CameraView.prototype.buildCTRLDriver =  function(params){
	
	return (params) ? new XMPP(params) : null;
	/*
		Leyenda de controles 
			A	Arriba	
			B	Abajo	
			E	derecha
			D	Izquierda
			G	Zoom +
			F	Zoom -
			H	Foco -
			I	Foco +
			S	Stop (todos los motores)

			T	Lectura del telemetro laser

	*/
}
