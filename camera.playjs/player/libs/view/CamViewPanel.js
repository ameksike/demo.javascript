/**
 *
 * @package: view
 * @version: 0.1

 * @description: CamViewPanel, crea una clase para administrar un componente de ExtJs de tipo Panel
 * @authors: ing. Antonio Membrides Espinosa
 * @making-Date: 12/11/2011
 * @making-Date: 15/11/2011
 * @license: GPL v3
 *
 */
var CamViewPanel = function(params)
{
	params = params || {};
	params.title = params.title || "Visor de Camaras";
	params.title = params.title || "Visor de Camaras";
	params.width = params.width || 640;
	params.height = params.height || 480;
	params.container = params.container || 'cplayer';

	var coordx = params.coordx || 100;
	var coordy = params.coordy || 20;

	this.obj = false;
	var _this = this;

	//...................................................................
	this.event = {
		"resize" : [],
		"beforeshow" : []
	}

	this.controls = {

		'left': {
			'mouseout':[],
			'click':[]
		},'right': {
			'mouseout':[],
			'click':[]
		},'zoomIn': {
			'mouseout':[],
			'click':[]
		},'zoomOut': {
			'mouseout':[],
			'click':[]
		},'focusIn': {
			'mouseout':[],
			'click':[]
		},'focusOut': {
			'mouseout':[],
			'click':[]
		},'up': {
			'mouseout':[],
			'click':[]
		},'down': {
			'mouseout':[],
			'click':[]
		}
	}

	this.trigger = function(eve, params, events){
		events = events || _this.event;
		for(var i in events[eve]) if(i) events[eve][i](params);
	}
	//------------------------------------------------------------ Componentes
	if(_this.obj)
	{
		if(_this.obj.isVisible())
		{
		      posicion = _this.obj.getPosition();
		      coordx = posicion[0];
		      coordy = posicion[1];
		}
		_this.obj.destroy();
	}
	//--------------------------------------------------------
	_this.obj = new Ext.Panel({
		labelWidth  : 125,
		title       : params.title,
		height      : 150,
		layout	    : 'fit', 
		frame       : true,  
		_event	    : this.event,
		_trigger    : this.trigger,
		_controls   : this.controls,
		items: [{ id : params.container}],
		listeners : {
			'resize' : function(params, width, height){
				params._trigger('resize', {'width':width, 'height':height, 'video':params.video, 'ctrl':params.ctrl, 'receptor':params.receptor }, params._event);
			},
			'afterlayout' : function(params){
				params._trigger('beforeshow', params, params._event);
			},
		},
	});

	this.show = function(){_this.obj.show();};

	//if(params.show) _this.show();
};
//------------------------------------------------------------------------
