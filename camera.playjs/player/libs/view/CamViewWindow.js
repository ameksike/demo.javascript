/**
 *
 * @package: view
 * @version: 0.1

 * @description: CamViewWindow, crea una clase para administrar un componente de ExtJs de tipo Window
 * @authors: ing. Antonio Membrides Espinosa
 * @making-Date: 12/11/2011
 * @making-Date: 15/11/2011
 * @license: GPL v3
 *
 */
var CamViewWindow = function(params)
{
	params = params || {};
	params.title = params.title || "Visor de Camaras";
	params.title = params.title || "Visor de Camaras";
	params.width = params.width || 640;
	params.height = params.height || 480;
	params.container = params.container || 'cplayer';
	

	var coordx = params.coordx || 100;
	var coordy = params.coordy || 20;

	this.objWindow = false;
	var _this = this;

	this.getwidthlabel = function(str){
		return 4*str.length + 3;
	}
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

	//------------------------------------------------------------ Variables
	var up = new Ext.Button({
		text:'up', 
		width: _this.getwidthlabel('up'),
		listeners: {
			'mouseout' : function(b, e){
				var _this = b.ownerCt.ownerCt;
				_this._trigger('mouseout', _this, _this._controls['up']);
			},
			'click' : function(b, e){
				var _this = b.ownerCt.ownerCt;
				_this._trigger('click', _this, _this._controls['up']);
			}
		}
	});

	var down = new Ext.Button({
		text:'down',  
		width: _this.getwidthlabel('down'),
		listeners: {
			'mouseout' : function(b, e){
				var _this = b.ownerCt.ownerCt;
				_this._trigger('mouseout', _this, _this._controls['down']);
			},
			'click' : function(b, e){
				var _this = b.ownerCt.ownerCt;
				_this._trigger('click', _this, _this._controls['down']);
			}
		}
	});

	var left = new Ext.Button({
		text:'left',  
		width: _this.getwidthlabel('left'),
		listeners: {
			'mouseout' : function(b, e){
				var _this = b.ownerCt.ownerCt;
				_this._trigger('mouseout', _this, _this._controls['left']);
			},
			'click' : function(b, e){
				var _this = b.ownerCt.ownerCt;
				_this._trigger('click', _this, _this._controls['left']);
			}
		}
	});
	var right = new Ext.Button({
		text:'right',  
		width: _this.getwidthlabel('right'),
		listeners: {
			'mouseout' : function(b, e){
				var _this = b.ownerCt.ownerCt;
				_this._trigger('mouseout', _this, _this._controls['right']);
			},
			'click' : function(b, e){
				var _this = b.ownerCt.ownerCt;
				_this._trigger('click', _this, _this._controls['right']);
			}
		}
	});
	var zoomIn = new Ext.Button({
		text:'Zoom +',  
		width: _this.getwidthlabel('Zoom +'),
		listeners: {
			'mouseout' : function(b, e){
				var _this = b.ownerCt.ownerCt;
				_this._trigger('mouseout', _this, _this._controls['zoomIn']);
			},
			'click' : function(b, e){
				var _this = b.ownerCt.ownerCt;
				_this._trigger('click', _this, _this._controls['zoomIn']);
			}
		}
	});
	var zoomOut = new Ext.Button({
		text:'Zoom -',  
		width: _this.getwidthlabel('Zoom -'),
		listeners: {
			'mouseout' : function(b, e){
				var _this = b.ownerCt.ownerCt;
				_this._trigger('mouseout', _this, _this._controls['zoomOut']);
			},
			'click' : function(b, e){
				var _this = b.ownerCt.ownerCt;
				_this._trigger('click', _this, _this._controls['zoomOut']);
			}
		}
	});

	var focusOut = new Ext.Button({
		text:'Focus -',  
		width: _this.getwidthlabel('Focus -'),
		listeners: {
			'mouseout' : function(b, e){
				var _this = b.ownerCt.ownerCt;
				_this._trigger('mouseout', _this, _this._controls['focusOut']);
			},
			'click' : function(b, e){
				var _this = b.ownerCt.ownerCt;
				_this._trigger('click', _this, _this._controls['focusOut']);
			}
		}
	});

	var focusIn = new Ext.Button({
		text:'Focus +',  
		width: _this.getwidthlabel('Focus +'),
		listeners: {
			'mouseout' : function(b, e){
				var _this = b.ownerCt.ownerCt;
				_this._trigger('mouseout', _this, _this._controls['focusIn']);
			},
			'click' : function(b, e){
				var _this = b.ownerCt.ownerCt;
				_this._trigger('click', _this, _this._controls['focusIn']);
			}
		}
	});
	//------------------------------------------------------------ Componentes
	if(_this.objWindow)
	{
		if(_this.objWindow.isVisible())
		{
		      posicion = _this.objWindow.getPosition();
		      coordx = posicion[0];
		      coordy = posicion[1];
		}
		_this.objWindow.destroy();
	}
	//--------------------------------------------------------
	_this.objWindow = new Ext.Window({
		title	    : params.title,
		renderTo    : document.body,
		id          : 'InfoCmWindow',
		width       : params.width,
		height      : params.height,
		closeAction : 'close',	//hide
		maximizable : 'true',
		resizable   : false,
		shadow      : true,
		animCollapse: true,
		collapsible : true,
		resizable   : true,
		frame       : true,
		x           : coordx,
		y           : coordy,
		_event	    : this.event,
		_trigger    : this.trigger,
		_controls   : this.controls,
		items       : [{
			id : params.container,
			frame : true
		}],
		listeners : {
			'resize' : function(params, width, height){
				params._trigger('resize', {'width':width, 'height':height, 'video':params.video, 'ctrl':params.ctrl, 'receptor':params.receptor }, params._event);
			},
			'beforeshow' : function(params){
				params._trigger('beforeshow', params, params._event);
			},
		},
		buttons: params.buttons ? [up, down, left, right, zoomIn, zoomOut, focusIn, focusOut] : [],
	});

	this.show = function(){ _this.objWindow.show(); };
	//if(params.show) _this.show();
	
};
//------------------------------------------------------------------------
