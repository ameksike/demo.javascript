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
var CenterConfigPanel = function(option)
{
	var _this = this;
	this.option = option;
	this.construct = function(){}();
	
	this.update = function(node)
	{
		var view = Ext.getCmp("container");
		if(node.attributes.id == "general") var obj = _this.guiGeneral();
		else var obj = _this.guiNode(node.attributes.id);
		view.removeAll();
		view.add(obj);
		view.doLayout();
	}

	this.guiGeneral =  function()
	{
		var obj = new Ext.FormPanel({
			labelWidth: 75, 
			border: false,
			frame: false,
			bodyStyle:'padding:5px 5px 0',
			width: 350,
			defaults: {width: 230},
			defaultType: 'textfield',
			
			items: [{
				fieldLabel: 'Title',
				id: 'title',
				allowBlank:false,
				value: (_this.option.view) ? _this.option.view.title : 'Visor de Camaras'
			    },{
				fieldLabel: 'Width',
				id: 'width',
				value:(_this.option.view) ? _this.option.view.width : 640
			    },{
				fieldLabel: 'Height',
				id: 'height',
				value: (_this.option.view) ?_this.option.view.height : 480
			    }, {
				fieldLabel: 'Columns',
				id: 'column',
				value: (_this.option.view) ?_this.option.view.column : 3
			    }
			],
			buttons: [{
			    	text: 'Apply',
				tooltip  : 'Guardar los cambios de forma temporal',
				handler: function(){ Ext.getCmp('btnSave').enable(); _this.applyChanche(_this.option.view);}
			}]
		});
		return obj;
	}


	this.guiNode =  function(id)
	{
		var elems = [];
		elems.push({
				title: 'Video',
				items: [_this.guivideo(_this.option.cams[id].video, id)]
		});
		elems.push({
				title: 'View',
				items: [_this.guiview(_this.option.cams[id].view, id)]
		});
		/*if(_this.option.cams[id].ctrl) elems.push({
				title: 'Control',
				items: [_this.guictrl(_this.option.cams[id].ctrl, id)]
		});*/
		var obj = new Ext.TabPanel({
			    margins:'3 3 3 0', 
			    activeTab: 0, id: 'mstabpan',
			    bodyStyle:'padding:5px 5px 0; background-color: #DFE8F6;',
			    defaults:{autoScroll:true},
			    items: elems,
			    buttons: [{
			    	text: 'Apply',
				handler: function(){
					Ext.getCmp('btnSave').enable();
					_this.applyChanche(_this.option.cams[id].view, id);
					_this.applyChanche(_this.option.cams[id].video, id);
					_this.applyChanche(_this.option.cams[id].ctrl, "c"+id);				
				}
			   }]
		});
		return obj;
	}

	this.guiview =  function(view, id)
	{
		view = view || {
			title: "View's Camera",
			width:	640,
			height: 480
		};
		var obj = new Ext.FormPanel({
			labelWidth: 75, 
			frame:true,
			id: 'guiview',
			bodyStyle:'padding:5px 5px 0',
			defaultType: 'textfield',

			items: [{
				fieldLabel: 'Title',
				id: 'title_'+id,
				allowBlank:false,
				value: view.title
			    },{
				fieldLabel: 'Width',
				id: 'width_'+id,
				value: view.width
			    },{
				fieldLabel: 'Height',
				id: 'height_'+id,
				value: view.height
			    }
			]
		});
		return obj;
	}

	this.guivideo =  function(view, id)
	{
		view = view || {
			title: "View's Camera",
			width:	640,
			height: 480
		};
		var obj = new Ext.FormPanel({
			labelWidth: 75, 
			frame:true,
			id: 'guivideo',
			bodyStyle:'padding:5px 5px 0',
			defaultType: 'textfield',

			items: [{
				fieldLabel: 'Protocol',
				id: 'protocol_'+id,
				value: view.protocol
			    },{
				fieldLabel: 'IP',
				id: 'ip_'+id,
				value: view.ip
			    },{
				fieldLabel: 'Port',
				id: 'port_'+id,
				value: view.port
			    },{
				fieldLabel: 'Arguments',
				id: 'arv_'+id,
				value: view.arv
			    },{
				fieldLabel: 'Volume',
				id: 'volume_'+id,
				value: view.volume
			    },{
				fieldLabel: 'Addres',
				id: 'url_'+id,
				value: view.url,
				ttip: 'Addres'
			    }
			]
		});
		return obj;
	}

	this.guictrl =  function(view, id)
	{
		view = view || {
			title: "View's Camera",
			width:	640,
			height: 480
		};
		var obj = new Ext.FormPanel({
			labelWidth: 75, 
			id: 'guictrl',
			frame:true,border: false,
			bodyStyle:'padding:5px 5px 0',
			defaultType: 'textfield',

			items: [{
				fieldLabel: 'Server',
				id: 'server_c'+id,
				allowBlank:false,
				value: view.server
			    },{
				fieldLabel: 'Port',
				id: 'port_c'+id,
				value: view.port
			    },{
				fieldLabel: 'Control',
				id: 'control_c'+id,
				value: view.control
			    },{
				fieldLabel: 'User',
				id: 'user_c'+id,
				value: view.user
			    },{
				fieldLabel: 'Password',
				id: 'pass_c'+id,
				value: view.pass
			    },{
				fieldLabel: 'Connect',
				id: 'connect_c'+id,
				value: view.connect
			    }
			]
		});
		return obj;
	}

	this.applyChanche = function(lst, id){
		if(lst) for(var i in lst){
			var key = id ? i+"_"+id : i;
			lst[i] = Ext.getCmp(key) ?  Ext.getCmp(key).getValue() : lst[i];
		}
	}
	
	
}

