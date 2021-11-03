/**
 *
 * @package: control
 * @version: 0.1

 * @description: CenterCameraView es una clase que permite administrar desde un fichero de configuración un listado de cámaras determinado empleando vista en miniatura, sobre el evento doble clic lanza una ventana maximizada mostrando el contenido de la misma 
 * @authors: ing. Antonio Membrides Espinosa
 * @making-Date: 12/11/2011
 * @making-Date: 14/02/2012
 * @license: GPL v3
 *
 */
var CenterCameraView = function(option)
{
	var _this = this;
	this.option = option;
	this.driver = {};
	this.resizeAll = function(elm, width, height )
	{
		for(var i in _this.option.cams){
			var obj = document.getElementById(i);
			if(obj){
				var e = _this.option.cams.length / _this.option.view.column;
				var w = width ?  width / _this.option.view.column -30 : obj.parentNode.clientWidth;
				var h = height ?  (height / e) -30 : obj.parentNode.clientHeight;
				if(arguments.length >= 3){
					obj.setAttribute('width', w);
					//obj.setAttribute('height', h);
					obj.parentNode.setAttribute('style', "width:"+w+"px; height:"+h+"px;");
					obj.parentNode.parentNode.parentNode.setAttribute('style', "width:"+w+"px; height:"+h+"px;");
				}
			}
		}
	}
	this.build = function()
	{
		_this.objWindow = new Ext.Window({
			renderTo    : document.body,
			title	    : _this.option.view.title,
			width       : parseInt(_this.option.view.width),
			height      : parseInt(_this.option.view.height),
			closeAction : 'hide',	
			maximizable : 'true',
			border      : false,
			layout	    : 'fit',
			shadow      : true,
			animCollapse: true,
			collapsible : true,
			resizable   : true,
			id	    : 'mediacenter',
			items       : [{
				layout:'column',
				bodyStyle   : 'overflow-x: hidden; overflow-y: auto',
				items:[],
				defaults:{
					border:false,
					bodyBorder:false
				}
			}],
			listeners   : {
				'resize' : _this.resizeAll,
				'show': function(elm){ _this.resizeAll(elm, false, false); },
				'restore': _this.resizeAll
			}
		});
		var column = 1 / _this.option.view.column;
		for(var i in _this.option.cams)
		{
			var option = _this.option.cams[i];
			option.id = i;
			option.even = {
				'ondblclick':function(id){
				      	var obj = window['options'].cams[id];
					obj.id = id + '_w2';;
					obj.video.container += '_win2';
					obj.view.container = obj.video.container;
					var w = Ext.getCmp("InfoCmWindow");
					if(w) w.close();
					var visor = new CameraView(obj);
				}
			}
			_this.driver[i] = {
				'panel': new CameraViewPanel(option),
				'win2': false
			}
			_this.objWindow.get(0).add({
				bodyStyle   : 'padding:5px 5px 0; border-style: none;',
				columnWidth : column,
				items: [_this.driver[i]['panel'].ui.obj]
			});
		}
		
		_this.objWindow.doLayout(true, true);	
		_this.option.objWindow = _this.objWindow;	
		_this.objWindow.cams = _this.option.cams;
	}();
	this.show = function(){
		_this.objWindow.show();
	}
	this.hide = function(){
		_this.objWindow.hide();
	}
}

