//******************************************************
//  
//******************************************************


goog.require('goog.ui.Slider'); 
goog.require('goog.dom'); 
goog.provide('utils.gui.GenericSlider');
	
/**
 * @constructor
 * @extends {goog.ui.Slider}
 */
utils.gui.GenericSlider = function (arguments) {	 
	
	goog.base(this);

 
	var args = {};
	var that = this;
	 
	if (typeof arguments === 'object') {
		args = arguments;
	}
	
	this.id = (args['id']) ? args['id'] : "GenericSlider";
	
	
	//----------------------------
	// Set CSS - VERTICAL ORIENTATION
	//----------------------------
	if (args['orientation'] && args['orientation'].toLowerCase() == 'vertical') {
		
		this.setOrientation(goog.ui.Slider.Orientation.VERTICAL);
		this.setValue(this.getMaximum());
		this.setStep(-1);

		args['widgetCSS'] = utils.dom.mergeArgs({
			'position' : 'absolute',
			'width' : 10,
			'height' : '100%',
			'left' : 0,
			'top' : 0,	
			'backgroundColor' : 'rgb(255,255,255)',		
		}, args['widgetCSS']);

		args['thumbCSS'] = utils.dom.mergeArgs({
			'position' : 'absolute',
			'top' : 0,
			'height' : 10,
			'width': args['widgetCSS']['width'],
			'backgroundColor': "rgb(225, 225, 225)",				
		}, args['thumbCSS']);
		
		args['trackCSS'] = utils.dom.mergeArgs({
			'position': 'absolute',
			'width' : '40%',
			'height' : '100%',
			'left': '30%',
			'borderRadius' : 3,
			'backgroundColor' : 'rgba(100,100,100,0)',				
		}, args['trackCSS']);
		
	}
	//----------------------------
	// Set CSS - HORIZONTAL ORIENTATION
	//----------------------------
	else {
		
		args['widgetCSS'] = utils.dom.mergeArgs({
			'position' : 'absolute',
			'width' : '100%',
			'height' : 10,
			'left' : 0,
			'top' : 0,	
			'borderColor' : 'rgba(200,200,200,1)'			
		}, args['widgetCSS']);
	

		args['thumbCSS'] = utils.dom.mergeArgs({
			'position': 'absolute',
			'height': args['widgetCSS']['height'],
			'width': args['widgetCSS']['height'],
			'backgroundColor': "rgb(225, 225, 225)",
			'borderRadius': 0	
		}, args['thumbCSS']);
			
		args['trackCSS'] = utils.dom.mergeArgs({
			'position': 'absolute',
			'width' : '100%',
			'height' : '40%',
			'top': '30%',
			'borderRadius' : 3,
			'backgroundColor' : 'rgba(100,100,100,0)',			
		}, args['trackCSS']);
	}
	
	

	//----------------------------
	// HOLDER
	//----------------------------	
	var widget = utils.dom.makeElement('div', args['parent'], "widget", args['widgetCSS']);
	this.getWidget = function () {
		return widget;
	}

	//----------------------------
	// TRACK
	//----------------------------		
	var track = utils.dom.makeElement("div", widget, "SliderTrack", args['trackCSS']);
	this.getTrack = function () {
		return track;
	}		
	
	that.decorate(widget);		


	
	//----------------------------
	// TRACK
	//----------------------------	
	//var sliderThumb = goog.dom.getElementsByClass( 'goog-slider-thumb', widget)[0];
	var childNodes = goog.dom.getChildren(widget);
	for (var i=0; i < childNodes.length; i++) {
		if (childNodes[i].className === 'goog-slider-thumb') {
			var sliderThumb  = childNodes[i]; 
			utils.css.setCSS( sliderThumb, args['thumbCSS']);
			this.getThumb = function () {
				return sliderThumb;
			}	
			break;
		}
	}
	


	this.bindToMouseWheel = function (element) {
		
		function handleMouseWheel(e) {
			
		  var addVal = Math.round(that.getValue() + e.deltaY / 3);
		  that.setValue(addVal);
		  e.preventDefault();	
		  
		}
		//
		// Bind mousewheel scrolling to slider	
		//
		var MouseWheelHandler = goog.events.MouseWheelHandler;
		var MOUSEWHEEL = MouseWheelHandler.EventType.MOUSEWHEEL;
		var mwh = new MouseWheelHandler(element);
		goog.events.listen(mwh, MOUSEWHEEL, handleMouseWheel);		
	}
	
	
	
	
	this.addSlideCallback = function (callback, args) {
		//console.log("callback: ", callback.toString())
		if (callback) {
//			console.log(callback.toString())
			that.addEventListener(goog.ui.Component.EventType.CHANGE, function () {
				callback(that, args);
			});		
		}	
	}
	

}

goog.inherits(utils.gui.GenericSlider, goog.ui.Slider);