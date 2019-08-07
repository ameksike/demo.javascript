/**
 *
 * @package: OpenLayers.Control
 * @version: 0.1
 * @requires: OpenLayers.Layer.Vector, OpenLayers.Control.DrawFeature 
 * @description: Permite mapear geometrias sobre el mapa, en funcion de plugin Priolus
 * @authors: ing. Antonio Membrides Espinosa
 * @making-Date: 25/10/2012
 * @making-Date: 25/10/2012
 * @license: GPL v3
 *
 */
OpenLayers.Control.DrawPriolusFeature = OpenLayers.Class(OpenLayers.Control.DrawFeature, {
    	initialize: function(options) {
		this.cfg = options || {};
		this.cfg.attributes = this.cfg.attributes || {};
		this.cfg.style = this.cfg.style || {	
			externalGraphic: 'ico/mark.png', 
			graphicHeight: 21, 
			graphicWidth: 16
		};
		var layer = this.cfg.layer || new OpenLayers.Layer.Vector("Feature");
       		OpenLayers.Control.DrawFeature.prototype.initialize.apply(this, [layer, OpenLayers.Handler.Point, this.cfg]);
	},
	drawFeature: function(geometry) {
		if(!this.cfg.layer){
			this.map.addLayer(this.layer);
			this.cfg.layer = 1;
		}
		var cfg = (this.onDrawFeature) ? this.onDrawFeature(geometry, this) : this.cfg;
		cfg.attributes = cfg.attributes  || this.cfg.attributes;
		cfg.style = cfg.style  || this.cfg.style;
		var feature = new OpenLayers.Feature.Vector(geometry, cfg.attributes, cfg.style);
		var proceed = this.layer.events.triggerEvent(
		    "sketchcomplete", {feature: feature}
		);
		if(proceed !== false) {
		    feature.state = OpenLayers.State.INSERT;
		    this.layer.addFeatures([feature]);
		    this.featureAdded(feature);
		    this.events.triggerEvent("featureadded",{feature : feature});
		}
    	},
	CLASS_NAME: "OpenLayers.Control.DrawPriolusFeature"
});
