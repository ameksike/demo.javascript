	var box_extents = [
		[-10, 50, -1, 26],
		[-75, 41, -67, 26],
		[-122.6, 37.6, -117, 28],
		[10, 10, 18, -2]
	];

	var init = function()
	{
		var map = new OpenLayers.Map('map',{
			allOverlays: true,
			maxResolution: 'auto',
			numZoomLevels: 9,
			controls: [new OpenLayers.Control.LayerSwitcher(), new OpenLayers.Control.MousePosition()]
		});
		//... build and add layer
		var boxes  = new OpenLayers.Layer.Vector( "Boxes" );
		for (var i = 0; i < box_extents.length; i++) {
		    var ext = box_extents[i];
		    var bounds = new OpenLayers.Bounds(ext[0], ext[1], ext[2], ext[3]);
		    boxes.addFeatures(new OpenLayers.Feature.Vector(bounds.toGeometry()));
		}
		map.addLayer(boxes);
		//... build and add control
		var sf = new OpenLayers.Control.SelectFeature(boxes);
		map.addControl(sf);
		sf.activate();

		map.zoomToMaxExtent();
	}
