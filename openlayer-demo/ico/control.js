	var init = function()
	{
		var map = new OpenLayers.Map('map',{
			allOverlays: true,
			maxResolution: 'auto',
			numZoomLevels: 9,
			controls: [new OpenLayers.Control.LayerSwitcher(), new OpenLayers.Control.MousePosition()]
		});

		//... build and add layer
		var markers = new OpenLayers.Layer.Markers( "Markers" );
		map.addLayer(markers);


		markers.addMarker(
			new OpenLayers.Marker(new OpenLayers.LonLat(-75, 41),  
			new OpenLayers.Icon('ico/mark2.png'))
		);

		markers.addMarker(
			new OpenLayers.Marker(new OpenLayers.LonLat(-122, 37),  
			new OpenLayers.Icon('ico/mark.png'))
		);

		markers.addMarker(
			new OpenLayers.Marker(new OpenLayers.LonLat(10, 10),  
			new OpenLayers.Icon('ico/mark2.png', 
			new OpenLayers.Size(30,30)))
		);

		map.zoomToMaxExtent();
	}
