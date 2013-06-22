goog.require('goog.array'); 

XNATViewer.prototype.addViewerManager = function () {
	
	var viewers = [[]];
	var insertRemoveCallbacks = [];
	
	this.Viewers = function (args1, args2, args3, args4, args5) {
		
		//utils.dom.debug(typeof args1)
		//var viewers = [[]];
		
		
		var isUndefined = (typeof args1 === 'undefined');
		var isString = (typeof args1 === 'string');
		var isObject = (typeof args1 === 'object');	
		var isFunction = (typeof args1 === 'function');	
		
		
	
		function widget(args1, args2) {
			return viewers[args1][args2]
		}
		
			
		var loop = function (callback) {
			
				var returnVals = [];
				
				for (var i=0, len = viewers.length; i < len; i++) {
					for (var j=0, len2 = viewers[i].length; j < len2; j++) {
						
						var r = callback(viewers[i][j], i, j);
						if (r) {
							returnVals.push(r);
						}
						
					}
				}
				
				if (returnVals.length > 0) {
					if (returnVals.length === 1) {
						return returnVals[0]
					}
					else{
						return returnVals;
					}
				}		
		}

		
		
		function widgets() {
			var ws = loop (function (ScanViewer) { 
				return ScanViewer.widget;	
			})

			return ws;				
		}		
		
		
		function makeViewer() {
			//	
			// Create ScanViewer
			//	
			var v = new ScanViewer({
				parent: XV.modal,
				id: "ScanViewer_" + utils.dom.uniqueId()
			});	
			return v;
			
		}
		


		function swap(v1, v2) {

			var arrLoc = loop ( function (v, i, j) { 
				
				var byObj = (v === v1) || (v === v2);
				var byElement = (v.widget === v1) || (v.widget === v2);
				var byId = (v.widget.id === v1) || (v.widget.id === v2);
				
				if (byObj || byElement || byId) {
					return {
						"i" : i,
						"j" : j
					}				
				}
				
			})
			
			if (arrLoc.length === 2) {

				var tempViewer = viewers[arrLoc[0].i][arrLoc[0].j];
				viewers[arrLoc[0].i][arrLoc[0].j] = viewers[arrLoc[1].i][arrLoc[1].j];
				viewers[arrLoc[1].i][arrLoc[1].j] = tempViewer;
	
			}
			else{
				throw "SWAP ERROR: "
			}
		}	
		
		//---------------------
		// UNDEFINED
		//---------------------
		if (isUndefined) {
			return viewers;
		}
		

		//---------------------
		// STRING
		//---------------------		
		else if (isString) {
			
			var isWidget = (args1.toLowerCase().indexOf("widgets")  === 0 );
			var isId = (args1.indexOf(GLOBALS.ScanViewerPreId)  === 0 );

			
			if (isWidget) {
				return widgets();
			}		
			
			if (isId) {
				
				var a = loop( function (ScanViewer) {
					
					if (ScanViewer.widget.id === args1) {

						return ScanViewer;
						
					}
				})
				
				return a;

			}		
		}	
		
		
		//---------------------
		// OBJECT
		//---------------------		
		else if (isObject) {
			
			var animOff = (args1['animate'] && args1['animate'] === 'off');	
			var isElement = args1["element"];
		
			var isLoop = args1["loop"];
			var isSwap = args1["swap"];
			var isInsert = args1['insert'];
			var isRemove = args1['remove'];
			var isViewerAfter = args1['viewerAfter'];
			var isAddInsertRemoveCallback = args1['addInsertRemoveCallback'];

			var isDOMElement = args1.tagName;
			
			if (isDOMElement) {
				var e = loop (function (ScanViewer) { 
					if (ScanViewer.widget == args1) {
						return ScanViewer;
					};	
				})
				return e;		
			}


			if (isAddInsertRemoveCallback) {
				insertRemoveCallbacks.push(args1['addInsertRemoveCallback']);
			}
			
			
			
			
			if (isElement) {
				//
				// return Widgets
				//
				var isWidget = (args1["element"].toLowerCase().indexOf("widgets")  === 0 );
				if (isWidget) {
					return widgets();
				}				
			}


			//
			// Loop
			//
			
			if (isLoop) {
				return loop(args1["loop"]);			
			}
			
			
			//
			// Swap
			//			
			if (isSwap) {
				return swap(args1["swap"][0], args1["swap"][1]);			
			}
			

			//
			// Viewre AFter
			//			
			if (isViewerAfter) {
				//utils.dom.debug("viewer after")
				var currV = args1['viewerAfter'];
				
				for (var i=0, len = viewers.length; i < len; i++) {
					for (var j=0, len2 = viewers[i].length; j < len2; j++) {
						
						if (viewers[i][j] === currV) {
							
							
							var maxRow = ((i+1) === viewers.length);
							var maxCol = ((j+1) === viewers[i].length);
							
							if (maxRow && maxCol) {
								//utils.dom.debug("0,0")
								return viewers[0][0];
							}
							else if (maxRow && !maxCol) {
								//utils.dom.debug("0,j+1")
								return viewers[0][j+1];
							}
							else if (!maxRow && maxCol) {
								//utils.dom.debug("i+1,0")
								return viewers[i+1][0];
							}
							else {
								//utils.dom.debug("i+1,j+1")
								return viewers[i+1][j+1];
							}
							
						}
						
					}
				}		
			}
			
						
		
			//
			// insert Row/Column
			//			
			if (isInsert) {
				
				var isRow = (args1['insert'] === 'row');
				var isColumn = (args1['insert'] === 'column');
				
				if (isRow) { 

					var newRow = [];
					var rowLen = (viewers[0] && viewers[0].length) ? viewers[0].length : 1;

					for (var i=0, len = rowLen; i < len; i++) { 						
						var v = makeViewer();
						newRow.push(v);
						
					}
					

					viewers.push(newRow);
			
									
					if (!animOff) {
						
						for (var i = 0, len = newRow.length; i < len; i++) {
							
							$(newRow[i].widget).fadeTo(0,0);
						
						}
						this.animateModal(function () {
							for (var i = 0, len = newRow.length; i < len; i++) {
								
								$(newRow[i].widget).fadeTo(GLOBALS.animFast, 1);
								newRow[i].updateCSS();
								
								
							}						
						});						
					}
					else {
						this.updateCSS();
					}


				}	
				if (isColumn) { 
					
					var newColumn = [];
					var columnLen = (viewers.length) ? viewers.length : 1;

					for (var i = 0, len = columnLen; i < len; i++) {						var v = makeViewer();
						newColumn.push(v);
						
					}
					
					if (viewers.length === 0) {
						viewers.push([newColumn[0]])
					}
					else{
						for (var i = 0, len = viewers.length; i < len; i++) {
							viewers[i].push(newColumn[i]);
						} 						
					}


					if (!animOff) {
						for (var i = 0, len = newColumn.length; i < len; i++) {
							$(newColumn[i].widget).fadeTo(0,0);
						}
						this.animateModal(function () {
							for (var i = 0, len = newColumn.length; i < len; i++) {
								
								$(newColumn[i].widget).fadeTo(GLOBALS.animFast, 1);
								newColumn[i].updateCSS();
							}						
						});					
					}
					else {
						this.updateCSS();
					}

				}		
			}
			
			
			//
			// remove Row/Column
			//			
			
			if (isRemove) {
				
				var isRow = (args1['remove'] === 'row'),
					isColumn = (args1['remove'] === 'column');
				
				if (isRow) { 
					
					if (viewers.length > 1) {
						var delRow = viewers[viewers.length - 1];
						
						for (var i = 0, len = delRow.length; i < len; i++) {					
							$(delRow[i].widget).fadeTo(GLOBALS.animFast, 0).remove();
						}
						
						viewers.splice(viewers.length -1, 1);
					}

					if (!animOff) {
						this.animateModal(function () {});					
					}
					else {
						this.updateCSS();
					}					
					
				}	
				if (isColumn) { 
					
					if (viewers[0] && viewers[0].length > 1) {
						
						for (var i = 0, len = viewers.length; i < len; i++) {
							var rowLen = viewers[i].length - 1;
							$(viewers[i][rowLen].widget).fadeTo(GLOBALS.animFast, 0).remove();
							viewers[i].splice(rowLen, 1);
						}
					}

					if (!animOff) {
						this.animateModal(function () {});					
					}
					else {
						this.updateCSS();
					}						
				}		
			}
			
		}
		
		if (isInsert || isRemove) {
			if (insertRemoveCallbacks.length > 0) {
				goog.array.forEach(insertRemoveCallbacks, function(item) {
					item();					
				});
			}			
		}

					
		//---------------------
		// FUNCION
		//---------------------	
		if (isFunction) {
			loop(args1)
		}
		
	}

}