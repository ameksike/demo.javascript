
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
        nav = new OpenLayers.Control.BrowserHistory({
		'onNext': function(status, obj, pos){
			msg = status ? "Ok" : "Niet";
			//alert("Next: "+msg);
		},
		'onPrevious': function(status, obj, pos){
			msg = status ? "Ok" : "Niet";
			//alert("Previous: "+msg);
		},
		'onDoPrevious': function(obj){
			return true;
		},
		'onDoNext': function(obj){
			return true;
		}
	});

	window['drawPoint'] = new OpenLayers.Control.DrawPriolusFeature({
		'onDrawFeature': function(geo){
			var ico = "ico/" + _ico() + '.png';
			//var ico = (geo.x < -80.05) ? 'ico/mark2.png' : 'ico/mark.png';
			return {
				'style': {
					externalGraphic: ico, 
					graphicHeight: 21, 
					graphicWidth: 16
				}
			};
		}/*,
		"layer": lay,
		'style': {
			externalGraphic: 'ico/mark2.png', 
			graphicHeight: 21, 
			graphicWidth: 16
		}*/
	});

	window.map.addControl(nav);
	window.map.addControl(window['drawPoint']);

	$("next").onclick = function() {
		nav.doNext();    
	};
	$("pre").onclick = function() {
		nav.doPrevious();	 
	};
}

function dibujar() {
	window['drawPoint'].activate();
}
function parar() {
	window['drawPoint'].deactivate();
} 

var _ico = function()
{
	var lst = document.getElementsByName('etr');
	for(var i in lst){
		if(lst[i].checked) return lst[i].value;
	}
}
