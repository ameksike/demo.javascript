	//.......................................................... DEFINE MAIN register observers ................................
	var hooks = new Observed();
	hooks.register( "dysplay_Home_Body_Header", 	new ObserverLocal('Ctrl_1')  		);
	hooks.register( "dysplay_Home_Body_Content" , 	new ObserverExternal('Ctrl_2')  	);
	hooks.register( "dysplay_Home_Header", 			new ObserverInter('Ctrl_3')  		);
	hooks.register( "dysplay_Home_Footer", 			new ObserverInter('Ctrl_3')  		);
	
	//.......................................................... DEFINE MAIN define event  ................................
	function doClicTheme1()
	{
		var view = new Viewmin("content");
		view.clean();
		
		hooks.emit( "dysplay_Home_Body_Header", view );
		hooks.emit( "dysplay_Home_Header", view	  );
		hooks.emit( "dysplay_Home_Footer", view  );
		hooks.emit( "dysplay_Home_Body_Content", view  );
	}

	
	function doClicTheme2()
	{
		var view = new Viewmin("content");
		view.clean();
		
		hooks.emit( "dysplay_Home_Header", view  );
		hooks.emit( "dysplay_Home_Body_Header", view  );
		hooks.emit( "dysplay_Home_Body_Content", view  );
		hooks.emit( "dysplay_Home_Footer", view  );
	}
	
		

