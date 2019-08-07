/**
 *
 * @package: OpenLayers.Control
 * @version: 0.1
 * @requires: OpenLayers.Control.NavigationHistory
 * @description: Personaliza la gestion de historial para la navegacion en GeneSIG
 * @authors: ing. Antonio Membrides Espinosa
 * @making-Date: 25/10/2012
 * @making-Date: 25/10/2012
 * @license: GPL v3
 *
 */
OpenLayers.Control.BrowserHistory = OpenLayers.Class(OpenLayers.Control.NavigationHistory, {
    	initialize: function(options) {
		OpenLayers.Control.NavigationHistory.prototype.initialize.apply(this, [options]);
	},
	doNext: function(){
		var doit = (this.onDoNext) ? this.onDoNext(this.next) : true;
		if(doit) this.nextTrigger();
	},
	doPrevious: function(){
		var doit = (this.onDoPrevious) ? this.onDoPrevious(this.next) : true;
		if(doit) this.previousTrigger();
	},
	onPreviousChange: function(state, length) {
		if(state && !this.previous.active) {
			this.previous.activate();
			if(this.onPrevious)this.onPrevious(true, state, length);
		} else if(!state && this.previous.active) {
			this.previous.deactivate();
			if(this.onPrevious)this.onPrevious(false, state, length);
		}
	},
	onNextChange: function(state, length) {
		if(state && !this.next.active) {
		 	this.next.activate();
			if(this.onNext)this.onNext(true, state, length);
		} else if(!state && this.next.active) {
			this.next.deactivate();	
			if(this.onNext)this.onNext(false, state, length);
		}
	},
	CLASS_NAME: "OpenLayers.Control.BrowserHistory"
});
