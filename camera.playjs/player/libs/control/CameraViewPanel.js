/**
 *
 * @package: control
 * @version: 0.1

 * @description: CameraViewPanel, extiende las funcionalidades de CameraView, modificando la representación grafica del contenido audiovisual, en vez de ventana genera un panel.
 * @authors: ing. Antonio Membrides Espinosa
 * @making-Date: 12/11/2011
 * @making-Date: 15/11/2011
 * @license: GPL v3
 *
 */
var CameraViewPanel = function(params)
{
	var _this = this;
	var _that = CameraViewPanel.prototype;
	params = params || params;
	params.build = params.build || 'auto';
	params.even = params.even || {};
	
	this.buildGUIDriver = function(params, lst){
		_this.ui = new CamViewPanel(params);
		for(var i in lst) _this.ui.obj[i] = lst[i];
		return _this.ui;
	}
	
	this.buildEvents = function(driver, options){
		driver.video.event.ondblclick.push(function(options){
			if(driver.video.even.ondblclick) 	
				driver.video.even.ondblclick(options.id);
		});

		driver.view.event.resize.push(function(driver){
			var w = driver.width ? driver.width : 150;
			var h = driver.height;
			if(driver.video) driver.video.resize(w, h );
		});

		driver.view.event.beforeshow.push(function(driver){
			var w = driver.width ? driver.width : 150;
			var h = driver.height;
			if(driver.video) driver.video.resize(w, h);
		});
	}

	this.build = function(params, _this)
	{
		params = _this.format(params);
		var driver = {
			'video': _this.buildVIDEODriver(params.video),
			'ctrl': _this.buildCTRLDriver(params.ctrl)
		};
		driver['view'] = _this.buildGUIDriver(params.view, driver);

		_this.buildEvents(driver, params);
		driver.video.even = params.even;
		driver.view.obj.items.items[0].innerHTML = driver.video.ashtml();
		driver.view.obj.items.items[0].add(driver.video.asobj());
		//driver.video.render(params.video.container);
		driver['view'].show();
	}
	
	if(params.build == 'auto') this.build(params, this);
}
CameraViewPanel.prototype = new CameraView({ 'build': 'manual' });

