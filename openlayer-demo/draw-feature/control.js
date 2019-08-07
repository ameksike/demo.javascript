
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
	/*map.addControl(new OpenLayers.Control.TyE);	

        nav = new OpenLayers.Control.NavigationHistory();
        map.addControl(nav);
        panel = new OpenLayers.Control.Panel(
            {div: document.getElementById("panel")}
        );
        panel.addControls([nav.next, nav.previous]);
        map.addControl(panel);	*/

	window['drawPoint'] = new OpenLayers.Control.DrawPriolusFeature({
		'onDrawFeature': function(geo){
			var ico = (geo.x < -80.05) ? 'ico/mark2.png' : 'ico/mark.png';
			return {
				'style': {
					externalGraphic: ico, 
					graphicHeight: 21, 
					graphicWidth: 16
				}
			};
		}/*,
		'style': {
			externalGraphic: 'ico/mark2.png', 
			graphicHeight: 21, 
			graphicWidth: 16
		}*/
	});
	window.map.addControl(window['drawPoint']);
	window.map.addLayer(window['drawPoint'].layer);

}

function dibujar() {
	window['drawPoint'].activate();
}
function parar() {
	window['drawPoint'].deactivate();
} 
