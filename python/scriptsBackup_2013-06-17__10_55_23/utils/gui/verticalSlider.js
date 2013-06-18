


//******************************************************
//  Init
//
//******************************************************
utils.gui.verticalSlider = function (args) {

	this.setArgs(args); 
	var that = this;
	

	// WIDGET	
	var widget = utils.dom.makeElement("div", this.currArgs().parent, this.currArgs().id, this.currArgs().widgetCSS);
	// TRACK
	var track =  utils.dom.makeElement("div", widget, this.currArgs().id + "_track", this.currArgs().trackCSS);
	// HANDLE	
	var handle =  utils.dom.makeElement("div", widget, this.currArgs().id + "_handle", this.currArgs().handleCSS);
	
	// Defining the update css version
	this.updateCSS = function (args) {
		// If there are inputted args, we need to set + validate them
		if (args) { this.setArgs(args) };
		
		utils.css.setCSS(widget, this.currArgs().widgetCSS);
		utils.css.setCSS(track, this.currArgs().trackCSS);
		utils.css.setCSS(handle, this.currArgs().handleCSS);	
		
		this.value = this.currArgs().value;
		
		if (this.currArgs().value !== 0) {
			this.moveHandle("byValue", {
				handle: handle,
				track: track,
				value: this.currArgs().value
			});
		}
	}
	
	
	this.updateProperties = function (args) {
		this.updateCSS(args);
	}

	

	//----------------------------------
	// Set Mouse Methods
	//----------------------------------
	this.initMouseListener(widget, handle, track);	
	
	
	// GLOBALS - Positioning
	this.handleStart = function () { 
		return { 
			left: utils.css.absolutePosition(handle).left, 
			top: utils.css.absolutePosition(handle).top 		  
		} 
	}


	//----------------------------------
	// Mousewheel Methods - Listener
	//----------------------------------
	var lastMouseWheelEvent = 0;
	this.setMouseWheelEventTime = function () {
		var d = new Date();
		lastMouseWheelEvent = d.getTime();	
	}
	this.getLastMouseWheelEventTime = function () {
		return lastMouseWheelEvent;	
	}
	
	this.bindToMouseWheel = function (element) {
		
		//----------------------------------
		// Mousewheel Methods - Handler
		//----------------------------------	
		function MouseWheelHandler(e) { // cross-browser wheel delta
			var e = window.event || e; // old IE support
			var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
			that.moveHandle("byMouseWheel", {
				"event": e, 
				handle: handle,
				wheelDelta: delta
			});
			return false;
		}	
		
		if (element.addEventListener) {
			element.addEventListener("mousewheel", MouseWheelHandler, false); // IE9, Chrome, Safari, Opera	
			element.addEventListener("DOMMouseScroll", MouseWheelHandler, false); // Firefox	
		}
		else {element.attachEvent("onmousewheel", MouseWheelHandler);}  	// IE 6/7/8
	}
	// And mousewheel scrolling over the widget will trigger a mousewheel event.
	this.bindToMouseWheel(widget);

	
	
	
	

	//----------------------------------
	// Slide Callbacks - Handler
	//----------------------------------
	var slideCallbacks = [];
	this.addSlideCallback = function (callback) {
		slideCallbacks.push(callback);
	}
	this.runSlideCallbacks = function () {
		for (var i=0; i<slideCallbacks.length; i++) {
			slideCallbacks[i](this);
		};
		
		
		// linked Callbacks
		if (that.linkedSliders && that.linkedSliders.length > 0 
			&& that.linkedCallbacks && that.linkedCallbacks.length > 0) {
			for (var i=0;i<that.linkedCallbacks.length; i++) {
				that.linkedCallbacks[i](that);
			}
		}
	}
	


	//----------------------------------
	// linkedCallbacks - Handler
	//----------------------------------	
	this.addLinkedCallback = function (func) {
  		if (!that.linkedCallbacks)
			that.linkedCallbacks = [];
  		//addLinkedCallback(that, func);
  		that.linkedCallbacks.push(func);
  	}
} 




//******************************************************
//  The general idea here is that there's an overlaying
//  div on top of the slider that, when clicked
//  expands to 100% of the page size.
//******************************************************
utils.gui.verticalSlider.prototype.initMouseListener = function (parentElement, handle, track) {

	var that = this;
	
	var mouseListenerElement =  utils.dom.makeElement("div", parentElement, this.currArgs().id + "_mouseListenerElement", utils.dom.mergeArgs(this.currArgs().handleCSS,{
		position: "absolute",
		top: 0,
		left: 0,
		width: "100%",
		height: "100%",
		zIndex: 1999999999,
		backgroundColor: "rgba(0,0,0,0)"
	}));
	
	
	mouseListenerElement.onmousedown = function (event) { 
		this.style.position = "fixed";
		//this.style.backgroundColor = "rgba(255, 0, 0, .5)";
		that.mouseDown = true;
		that.moveHandle("byMouse", {
			"event": event, 
			handle: handle,
			track: track
		});
		
	}
	
	
	mouseListenerElement.onmousemove = function (event) { 
		if (that.mouseDown) {
			that.moveHandle("byMouse", {
				"event": event, 
				handle: handle,
				track: track
			});		
		}		
	}
	
	mouseListenerElement.onmouseup = function (event) { 
		this.style.position = "absolute";
		//this.style.backgroundColor = "rgba(255, 0, 0, 0)";
		that.mouseDown = false;
	}
		
}


utils.gui.verticalSlider.prototype.defaultArgs = function () {
	
	return {
		
	  	id: "__Slider__",			//def "sliderScroller"
	  	parent: document.body,
	  	start: 0,
	  	min:   0,
	  	max: 100,
	  	step: 1,
	  	value: 0,
	  	round: true,
	  	handleOffsetLeft: 0,
	  	handleOffsetTop: 0,
	  	widgetCSS: {
	  		position: "absolute",
	  		top: 50,
	  		left: 50
	  	},
	  	
	  	trackCSS: {
	  		height: 300,
	  		width: 10,
	  		position: "absolute",
	  		border: "solid",
	  		borderWidth: 1,
	  		borderColor: "rgba(0,0,0,1)",
	  		backgroundColor: "rgba(125,125,125,1)",
	  		borderRadius: 0
	  	},
	  	
	  	handleCSS: {
	  		height: 10,
	  		width: 30,
	  		position: "absolute",
	  		border: "solid",
	  		borderWidth: 1,
	  		borderColor: "rgba(85,85,85,1)",
	  		backgroundColor: "rgba(125,225,125,1)",
	  		borderRadius: 0
	  	}
  	
  }
}





//******************************************************
//  
//******************************************************
utils.gui.verticalSlider.prototype.setArgs = function (newArgs) {


	// Argument check
	//if (!newArgs.widgetCSS) { throw ("utils.gui.verticalSlider: Invalid arguments - no 'widgetCSS' subObject in arguments.");}
	if (newArgs.widgetCSS && newArgs.widgetCSS["height"]) { throw ("utils.gui.verticalSlider: Please set the slider height by adjusting either handleCSS['height'] or trackCSS['height']");}
	if (newArgs.widgetCSS && newArgs.widgetCSS["width"]) { throw ("utils.gui.verticalSlider: Please set the slider width by adjusting either trackCSS['width']"); }


	// See if newArgs are valid for entry based on the default keys
	utils.dom.validateArgs("utils.gui.verticalSlider", this.defaultArgs(), newArgs, function () {});

	
	// Define currArgs either as default or previously entered args;
	var currArgs = (this.currArgs)? this.currArgs() : this.defaultArgs();	

	
	// merge currArgs with newArgs
	var mergedArgs = (newArgs) ? utils.dom.mergeArgs(currArgs, newArgs) : currArgs;
	
		
	// calculate dims
	hHandle = mergedArgs.handleCSS.height +  mergedArgs.handleCSS.borderWidth * 2; 
	wHandle = mergedArgs.handleCSS.width +  mergedArgs.handleCSS.borderWidth * 2; 
	hTrack = mergedArgs.trackCSS.height +  mergedArgs.trackCSS.borderWidth * 2; 
	wTrack = mergedArgs.trackCSS.width +  mergedArgs.trackCSS.borderWidth * 2; 

	mergedArgs.widgetCSS.height  = (hHandle > hTrack) ? hHandle : hTrack; 
	//utils.dom.debug(mergedArgs.widgetCSS.height )
	mergedArgs.widgetCSS.width  = (wHandle > wTrack) ? wHandle : wTrack; 
		
	// set the top of the track to the "middle of the widget"
	mergedArgs.trackCSS.top = mergedArgs.widgetCSS.height/2 - 
						      mergedArgs.trackCSS.height/2 - 
						      mergedArgs.trackCSS.borderWidth;
	
	mergedArgs.handleCSS.left = mergedArgs.handleOffsetLeft + wTrack/2 - Math.round(wHandle/2);
	mergedArgs.handleCSS.top = mergedArgs.handleOffsetTop;
	

	// GLOBALS - Positional Domain



	// Define the currArgsfunction
	this.currArgs = function () {return mergedArgs};
	
	
	this.handleDomain = function () {
		return 	{
			start: this.currArgs().handleOffsetTop,
			end:   this.currArgs().trackCSS.height  - this.currArgs().handleCSS.height - this.currArgs().handleOffsetTop
		}	
	}
	
	
	
}





//******************************************************
//  Clears linked callbacks and sliders
//******************************************************
utils.gui.verticalSlider.prototype.clearLinked= function () {
	this.linkedCallbacks = [];
	this.linkedSliders = [];
}




//******************************************************
//  
//******************************************************
utils.gui.verticalSlider.prototype.moveHandle = function (moveType, args) {

		var that = this;
		
		// vars
		var domainOfHandle = this.handleDomain();

				
				
		// Do not want to propagate to the DOM
		// For either mouse or mouseWheel events
		if (args.event) { utils.dom.stopPropagation(args.event); } 




		//------------------------
		// BY MOUSEWHEEL
		//------------------------
		if (moveType === "byMouseWheel" && args.wheelDelta) {

			
			// get the current date and the delta from the last mousewheel move
			var step = (this.currArgs().step === null) ? 1 : this.currArgs().step;
			var d = new Date();
			var dTime = (d.getTime() - this.getLastMouseWheelEventTime());


			// respond to faster mousewheel -- rather linear and crude
			if (dTime < 250) {  
				step *= 3;
			}
			
			
			// generate a tempLeft.  with verticalScrolling, we need to invert
			// the direction of the step
			var tempTop = utils.convert.toInt(args.handle.style.top) + (args.wheelDelta * -1 * step);
			
			
			
			// log the mousewheel event time
			// for velocity calculations
			this.setMouseWheelEventTime();		
		}

		

		
		
		//------------------------
		// BY MOUSE
		//------------------------
		else if (moveType === "byMouse") {

			var newPt = getMouseXY(args.event);	
					   
			var tempTop = newPt.y - // mouseclick x
						   args.track.getBoundingClientRect().top - // current abs position of the handle
						   utils.convert.toInt(args.handle.style.height)/2; // centers the handle on the mouse pointer		

		}
		


		
		//------------------------
		// BY VALUE
		//------------------------
		else if (moveType === "byValue") {
			tempTop = domainOfHandle.start + (domainOfHandle.end - domainOfHandle.start) * (args.value / (that.currArgs().max - that.currArgs().min));
		}




		//------------------------
		// ELSE ERROR
		//------------------------
		else{
			throw "utils.gui.verticalSlider: invalid moveHandle arguments."
		}
		

		// Reposition handle if outside of its CSS domain
		if (tempTop < domainOfHandle.start) {
			tempTop = domainOfHandle.start;
		}
		if (tempTop > domainOfHandle.end) {
			tempTop = domainOfHandle.end;
		}

		
		
		// get the Slider value
		var pct = tempTop / (domainOfHandle.end - domainOfHandle.start);
		that.value = pct * (that.currArgs().max - that.currArgs().min);


		// round the slider value if desired
		if (that.currArgs.round) {that.value = Math.round(that.value);}
		
		// move the handle
		args.handle.style.top = utils.convert.px(tempTop);
		
		// run callbackls
		that.runSlideCallbacks();	
}





//******************************************************
//  Links the inputted slider (b)
//******************************************************
utils.gui.verticalSlider.prototype.linkSlider = function (b) {
	
	var that = this;
	
	if (this.linkedSliders) {
		for (var i=0;i<this.linkedSliders.length; i++) {
			if(b === this.linkedSliders[i]) {
				return;
			}				
		}
		this.linkedSliders.push(b);		
	}
	else{
		this.linkedSliders = [];
		this.linkedSliders.push(b);	
	}

	this.addLinkedCallback(function (a) {  
			
		var aDiff = a.currArgs().max - a.currArgs().min;
		
		var bDiff = b.currArgs().max - b.currArgs().min;
		// percentage-based linking
		var bVal = Math.round(bDiff * (a.value / aDiff));
		
		b.updateProperties({value: bVal});
		b.runSlideCallbacks();
		
  	});
}



//******************************************************
//  
//******************************************************
function getMouseXY(e) {
    if (navigator.appName === 'Microsoft Internet Explorer') {
      tempX = event.clientX + document.body.scrollLeft;
      tempY = event.clientY + document.body.scrollTop;
    }
    else {  // grab the x-y pos.s if browser is NS
      tempX = e.pageX;
      tempY = e.pageY;
    }  

    if (tempX < 0) {tempX = 0;}
    if (tempY < 0) {tempY = 0;}  

    return {x:tempX, y:tempY};
}








