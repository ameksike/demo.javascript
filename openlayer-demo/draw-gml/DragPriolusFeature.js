/**
 *
 * @package: OpenLayers.Control
 * @version: 0.1
 * @requires: OpenLayers.Layer.Vector, OpenLayers.Control.DragFeature 
 * @description: Permite gestionar eventos asociados a las geometrias sobre el mapa, en funcion de plugin Priolus
 * @authors: ing. Antonio Membrides Espinosa
 * @making-Date: 25/10/2012
 * @making-Date: 25/10/2012
 * @license: GPL v3
 *
 */
OpenLayers.Control.DragPriolusFeature = OpenLayers.Class(OpenLayers.Control.DragFeature, {
    	initialize: function(options) {
		this.cfg = options || {};
		this.cfg.action = this.cfg.action || 'drag';
		var layer = this.cfg.layer || new OpenLayers.Layer.Vector("Feature");
       		OpenLayers.Control.DragFeature.prototype.initialize.apply(this, [layer, this.cfg]);
	},
	moveFeature: function(pixel) {
		if(this.cfg.action == 'drag'){
			OpenLayers.Control.DragFeature.prototype.moveFeature.apply(this, [pixel]);
		}
	},
	downFeature: function(pixel) {
		var even = this.getEventName(this.cfg.action);
		if(typeof (this[even]) == 'function') 
			this[even](this.feature, pixel, this);
		this.lastPixel = pixel;
		this.onStart(this.feature, pixel, this);
	},
	activate: function(action){
		this.cfg.action = action || this.cfg.action;
		OpenLayers.Control.DragFeature.prototype.activate.apply(this, []);
	},
	getEventName : function(key){
		return "on" + key.charAt(0).toUpperCase() + key.substring(1);
	},	
	CLASS_NAME: "OpenLayers.Control.DragPriolusFeature"
});
