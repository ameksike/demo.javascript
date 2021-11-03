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
var CamViewDiv = function(params)
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

	var tag  = document.createElement('div');
	tag.setAttribute('id', params.container);
	document.body.appendChild(_this.object);
	
	var css = new StyleManager();
	css.addStyle("#"+params.container+" { cursor: move; }",1);
	css.addStyle("#"+params.container+"-rzwrap{ z-index: 100; }",1);
	css.addStyle("#"+params.container+"-rzwrap .x-resizable-handle{ width:11px; height:11px; background:transparent url(rs.gif) no-repeat; margin:0px;}",1);
	css.addStyle("#"+params.container+"-rzwrap .x-resizable-handle-east, #custom-rzwrap .x-resizable-handle-west{ top:45%;}",1);
	css.addStyle("#"+params.container+"-rzwrap .x-resizable-handle-north, #custom-rzwrap .x-resizable-handle-south{left:45%;}",1);

	//------------------------------------------------------------ Variables
	this.custom = new Ext.Resizable(params.container, {
		    wrap:true,
		    pinned:true,
		    minWidth:50,
		    minHeight: 50,
		    preserveRatio: false,
		    handles: 'all',
		    draggable:true,
		    dynamic:true
	});

	//... evens ...
	this.customEl = this.custom.getEl();
	this.customEl.on('dblclick', function(){
	    _this.customEl.hide(true);
	}); //this.customEl.hide();

	this.show = function()
	{
 		_this.customEl.center();
		_this.customEl.show(true);
	};
	//if(params.show) _this.show();
	
};
//------------------------------------------------------------------------
