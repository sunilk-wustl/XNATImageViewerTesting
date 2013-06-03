XNATModalImageViewer.prototype.manageScanViewers = function() {
	
	var viewers = this.ScanViewers;

	this.SCANViewers = function(args1, args2, args3, args4, args5) {
		
		//console.log(typeof args1)
		//var viewers = [[]];
		
		
		var isUndefined = (typeof args1 === 'undefined');
		var isString = (typeof args1 === 'string');
		var isObject = (typeof args1 === 'object');	
		var isFunction = (typeof args1 === 'function');	
	
		function widget(args1, args2) {
			return viewers[args1],[args2]
		}
		
			
		var loop = function(callback) {
			
				var returnVals = [];
				var ScanViewers = viewers;
				
				for (var i=0; i<viewers.length; i++) {
					for (var j=0; j<viewers[i].length; j++) {
						
						var r = callback(viewers[i][j], i, j);
						if (r){
							returnVals.push(r);
						}
						
					}
				}
				
				if (returnVals.length > 0){
					if (returnVals.length === 1){
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
		
		
		function makeViewer(){
			//	
			// Create ScanViewer
			//	
			var v = new ScanViewer({
				parent: XMIV.modal,
				id: "ScanViewer_" + __uniqueID__(),
			});	
			return v;
			
		}
		


		function swap(v1, v2){

			var arrLoc = loop ( function (v, i, j) { 
				
				var byObj = (v === v1) || (v === v2);
				var byElement = (v.widget === v1) || (v.widget === v2);
				var byId = (v.widget.id === v1) || (v.widget.id === v2);
				
				if (byObj || byElement || byId) {
					return {
						"i" : i,
						"j" : j,
					}				
				}
				
			})
			
			if (arrLoc.length == 2){
	
				console.log("NEED TO CORRECT HERE")
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
			if (isWidget){
				return widgets();
			}		
			
			
			var isId = (args1.indexOf(GLOBALS.ScanViewerPreId)  == 0 );
			if (isId){
				
				var a = loop( function (ScanViewer) {
					
					if (ScanViewer.widget.id == args1){

						return ScanViewer;
						
					}
				})
				
				return a;

			}		
		}	
		
		
		//---------------------
		// OBJECT
		//---------------------		
		else if (isObject){
			
			var animOff = (args1['animate'] && args1['animate'] === 'off');	
			
			var isElement = args1["element"];
			if (isElement){
				
				
				//
				// return Widgets
				//
				var isWidget = (args1["element"].toLowerCase().indexOf("widgets")  === 0 );
				if (isWidget){
					return widgets();
				}				
			}


			//
			// Loop
			//
			var isLoop = args1["loop"];
			if (isLoop){
				return loop(args1["loop"]);			
			}
			
			
			//
			// Swap
			//
			var isSwap = args1["swap"];
			if (isSwap){
				return swap(args1["swap"][0], args1["swap"][1]);			
			}
			
			
		
			//
			// insert Row/Column
			//			
			var isInsert = args1['insert'];
			if (isInsert){
				
				var isRow = (args1['insert'] === 'row');
				var isColumn = (args1['insert'] === 'column');
				
				if (isRow) { 

					var newRow = [];
					var rowLen = (viewers[0] && viewers[0].length) ? viewers[0].length : 1;

					for (var i=0; i<rowLen; i++){ 						
						var v = makeViewer();
						newRow.push(v);
						
					}
					

					viewers.push(newRow);
			
									
					if (!animOff) {
						for (var i = 0; i<newRow.length; i++) {
							$(newRow[i].widget).hide(0);
						}
						this.animateModal(function () {
							for (var i = 0; i<newRow.length; i++) {
								$(newRow[i].widget).fadeTo(GLOBALS.animFast, 1);
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

					for (var i=0; i<columnLen; i++) { 						
						var v = makeViewer();
						newColumn.push(v);
						
					}
					
					if (viewers.length == 0){
						viewers.push([newColumn[0]])
					}
					else{
						for (var i=0; i<viewers.length; i++) { 
							viewers[i].push(newColumn[i]);
						} 						
					}


					if (!animOff) {
						for (var i = 0; i<newColumn.length; i++) {
							$(newColumn[i].widget).hide(0);
						}
						this.animateModal(function () {
							for (var i = 0; i<newColumn.length; i++) {
								$(newColumn[i].widget).fadeTo(GLOBALS.animFast, 1);
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
			var isRemove = args1['remove'];
			if (isRemove){
				
				var isRow = (args1['remove'] === 'row');
				var isColumn = (args1['remove'] === 'column');
				
				if (isRow) { 
					
					if (viewers.length > 1){
						var delRow = viewers[viewers.length - 1];					
						for (var i=0; i<delRow.length; i++){
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
					
					if (viewers[0] && viewers[0].length > 1){
						
						for (var i=0; i<viewers.length; i++){
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
		
		
		//---------------------
		// FUNCION
		//---------------------	
		if (isFunction) {
			loop(args1)
		}
		
	}

}