var action = 'select';
var init = function()
{
	window['map'] = new OpenLayers.Map('map',{
		allOverlays: true,
		maxResolution: 'auto',
		numZoomLevels: 9,
		controls: [
			new OpenLayers.Control.LayerSwitcher(), 
			new OpenLayers.Control.Attribution(),
			new OpenLayers.Control.Navigation(),
			new OpenLayers.Control.PanPanel(),
			new OpenLayers.Control.ZoomPanel(),
			new OpenLayers.Control.MousePosition()
		]
	});
	window['map'].addLayer(new OpenLayers.Layer.Vector("GML", {
		protocol: new OpenLayers.Protocol.HTTP({
	            url: "data/cuba.gml",
	            format: new OpenLayers.Format.GML()
	        }), 
		strategies: [new OpenLayers.Strategy.Fixed()]
    	}));
	window['map'].setCenter(new OpenLayers.LonLat(-79.50, 22.05), 5);

	//... controls works
	var lay =  new OpenLayers.Layer.Vector("Feature");

	window['drawPoint'] = new OpenLayers.Control.DrawPriolusFeature({
		'onDrawFeature': function(geo){
			var ico = "ico/" + _ico() + '.png';
			return {
				'style': {
					externalGraphic: ico, 
					graphicHeight: 21, 
					graphicWidth: 16
				}
			};
		},
		"layer": lay
	});

	window['dragPoint'] = new OpenLayers.Control.DragPriolusFeature({
		"layer": lay,
		box : true,
		clickout : false,
		onSelect : function(f, p, obj){
			alert ("select: " + f.id);
		},
		onDelete : function(f, p, obj){
			obj.layer.removeFeatures(f);
		},
		toggle : false
	});


	window.map.addLayer(lay);
	window.map.addControl(window['drawPoint']);
	window.map.addControl(window['dragPoint']);
}

function dibujar() {
	window['drawPoint'].activate();
}
function parar() {
	window['drawPoint'].deactivate();
	window['dragPoint'].deactivate();
} 
function selecionar() {
	window['dragPoint'].activate('select');
}
function mover() {
	window['dragPoint'].activate('drag');
}
function eliminar() {
	window['dragPoint'].activate('delete');
}
var _ico = function()
{
	var lst = document.getElementsByName('etr');
	for(var i in lst){
		if(lst[i].checked) return lst[i].value;
	}
}
