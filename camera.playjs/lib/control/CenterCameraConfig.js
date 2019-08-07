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
var CenterCameraConfig = function(option)
{
	var _this = this;
        
        option = (option &&  option!= "null" && option!= "") ? option : {};
        option.cams = option.cams || {};
        option.view = option.view || {
            title : 'Visor de Camaras',
            width : 640,
	    height : 480,
	    column : 3
        };
        
        
	this.construct = function()
	{
		var ctrTree  = new CenterConfigTree(option);
		var ctrPanel = new CenterConfigPanel(option);
		ctrTree.onselectnode = function(node){
			ctrPanel.update(node);
		}

		var center = new Ext.Panel({
			region: 'center',
			id: "container",
			margins:'3 3 3 0', frame: true,
			layout: 'fit', border: false,
			defaults:{autoScroll:true},
			items: []
		});

		var west = new Ext.Panel({
			title: 'Options',
			region: 'west',
			layout: 'fit',
			split: true,
			width: 150, border: false,
			collapsible: true,
			margins:'3 0 3 3',
			cmargins:'3 3 3 3',
			items: ctrTree.obj
		});

		_this.win = new Ext.Window({
			title: 'Center Camera Config',
			closable:true,
			width:600,
			height:350,
			plain:true,
			layout: 'border',
			items: [west, center]
		});

	}();
	this.show = function(){
		_this.win.show();
	}
	this.hide = function(){
		_this.win.hide();
	}
}

