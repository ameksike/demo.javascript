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
var CenterConfigTree = function(option)
{
	var _this = this;
	this.onselectnode = false;
        this.option = option;
	this.construct = function()
	{
		_this.obj = new Ext.tree.TreePanel({
		    	id: 'tree-panel',
			split: true,
			height: 300,
			minSize: 110,
			autoScroll: true,
			rootVisible: false,
			useArrows: true,
			tbar:[{
					iconCls: 'btn_appl',
					id: 'btnSave',
					tooltip  : 'Salvar los cambios en el servidor',
					disabled: true,
					handler: function(){
						Ext.Ajax.request({
							url: 'write',
							success: function(){alert("success");},
							failure: function(){alert("failure");},
							headers: {
								'my-header': 'foo'
							},
							params: { data: Ext.util.JSON.encode(_this.option) }
						});
						Ext.getCmp('btnSave').disable();
					}
				},{
					iconCls: 'btn_add',
					id: 'btnAdd',
					tooltip  : 'Adicionar nuevas camaras',
					handler: function(){
						_this.win.show();
					}
				},{
					iconCls: 'btn_dell',
					id: 'btnDelete',
					tooltip  : 'Eliminar la camara seleccionada',
					handler: function(){
						var sel = _this.obj.getSelectionModel().selNode;
						if(sel.attributes.id!="treecams"&&sel.attributes.id!="general"){
							delete _this.option.cams[sel.attributes.id];
							sel.parentNode.removeChild(sel, true);
						}
						Ext.getCmp('btnSave').enable();
					}
				}
			],
			root: {
				expanded: true,
				children: [{
						text: 'General',
						id: 'general',
						leaf: true,
						listeners : {
            						'click' : function(node) {
								Ext.getCmp('btnDelete').disable();
								if(_this.onselectnode) _this.onselectnode(node);
							}
						}
					},{
						text: 'Camaras',
						id: 'treecams',
						leaf: false,
						children: [],listeners : {
            						'click' : function(node) {
								Ext.getCmp('btnDelete').disable();
							}
						}
				}]
			},
			listeners : {			
				'afterrender': function(elm){
					elm.getRootNode().childNodes[0].fireEvent('click', elm.getRootNode().childNodes[0]);
					elm.getRootNode().childNodes[1].expand();
				}
			}
		});
		var root = _this.obj.getRootNode();
		for(var i in option.cams){
			root.attributes.children[1].children.push({
				text: i,
				id: i,
				leaf: true,
				listeners : {
					'click' : function(node, checked) {
						Ext.getCmp('btnDelete').enable();
						if(_this.onselectnode) _this.onselectnode(node);
					}
				}
			});
		}

	}();

	this.win = new Ext.Window({
			title: 'Nueva camara',
			closable:true,
			width:250,
			height:120,
			plain:true,
			closeAction : 'hide',	//close
			layout: 'fit',
			border: false,
			items: [new Ext.FormPanel({
				labelWidth: 50, 
				frame:true,
				bodyStyle:'padding:5px 5px 0',
				defaultType: 'textfield',

				items: [{
					fieldLabel: 'id',
					id: 'nodeid',
					allowBlank:false,
					tooltip  : 'Insertar el identificador de la nueva camara'
				    }
				]
			})],
			buttons: [{
				    	text: 'Apply',
					tooltip : 'Adicionar una nueva camara',
					handler: function(){
						Ext.getCmp('btnSave').enable();
						var ids = Ext.getCmp('nodeid').getValue() || 'ds';
						var parenn = _this.obj.getRootNode().childNodes[1]
						parenn.appendChild({
							text: ids,
							id: ids,
							leaf: true,
							listeners : {
								'click' : function(node, checked) {
									if(_this.onselectnode) _this.onselectnode(node);
								}
							}
						});
						_this.option.cams[ids] = {
							'view': {
								'title'		: "View's Camera",
								'width'  	: 640,
								'height' 	: 480
							},
							'video': {
								'ip'   		: '10.12.162.118',
								'port'  	: '8554',
								'volume'  	: 100,
								'arv'  		: '/video',
								'protocol'  	: 'rtsp',
								'url'    	: ''
							}
						};
					}
				}]
	});
}

