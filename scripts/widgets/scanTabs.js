defaultArgs_scanTabs = {
	parent: document.body,
	id: "_scanTabs",
	scanContents: 0,
	tabTitles: ["<b>Info.</b>", "<b>Adjust</b>"],
	contentFontSize: 10,
	activeLineColor: Globals.activeLineColor,
	activeFontColor: Globals.activeFontColor,
	inactiveLineColor: Globals.inactiveLineColor,
	inactiveFontColor: Globals.inactiveFontColor,
	tabHeight: 30,
	tabWidth: 60,
	CSS: {
		top: 400,
		left: 20,
		height: 300,
		width: 300,
		borderWidth: 1
	}
}




//******************************************************
//  The tab "titles" themselves are elements.  
//  Treated this as a separate method b/c jQuery UI
//  has some quirks as to how it treats tab titles.
//******************************************************
var makeTabTitles = function(parent, titles){

	var titleElt = __makeElement__("ul", parent);	
	var titlesA = [];
	var titlesLi = [];
	
	var iconList = [
		{
			src: "./icons/Axes.png",
			h: 25,
			w:25
		},
		{	
			src: "./icons/InfoIcon.png",
			w: 20,
			h: 21,
		},
		{
			src: "./icons/Adjust.png",
			w: 25,
			h: 20
		}
	];
	
	for (var i=0;i<titles.length;i++){
		var li = __makeElement__("li", titleElt);	
		var a = __makeElement__("a", li);

		$(a).attr('href', "#" + parent.id + "-" + (i+1).toString());
		a.setAttribute("id", "tabA_" + i.toString());
		li.setAttribute("id", "tabLi_" + i.toString());
		a.innerHTML = titles[i];	
		a.style.color = "rgba(0,0,0,0)";
		
		var img = __makeElement__("img", a, a.id + " _img", {
			position: "absolute",
			left: 18,
			top: 4,
		});
		img.src = iconList[i].src;
		img.height = iconList[i].h;
		img.width = iconList[i].w;
		
		titlesA.push(a);
		titlesLi.push(li);
		
	}	
	//titleElt.className = "menu"
	return {
		titleElt: titleElt,
		titlesA: titlesA,
		titlesLi: titlesLi,
	}
}




//******************************************************
//  Init
//
//******************************************************
var scanTabs = function(args){
	this.args = (args) ? __mergeArgs__(defaultArgs_scanTabs, args) : defaultArgs_scanTabs;
	this.CSS = this.args.CSS;
	var that = this;
	this.activeTab = 0;
	

	
	this.widget = __makeElement__("div", this.args.parent, this.args.id, this.args.CSS);
	this.tabTitleObj = makeTabTitles(this.widget, this.args.tabTitles);
	this.tabs = []
	
	

	//------------------------------
	// Tab Titles
	//------------------------------	
	for (var i=0;i<this.args.tabTitles.length;i++){
		var e = __makeElement__("div", this.widget, this.args.id + "-" + (i+1).toString());
		e.label = this.tabTitleObj.titlesA[i].innerHTML;
		this.tabs.push(e)
	}

	$(this.widget).tabs();
	
	
	
	//------------------------------
	// ACTIVE TAB TRACKING
	//------------------------------
	for (var i=0;i<this.tabTitleObj.titlesA.length;i++){		
		$(this.tabTitleObj.titlesA[i]).click(function(e){
			that.setActiveTab(e);
		})
	}
	// Set Active Tab to 0
	$(this.tabTitleObj.titlesA[this.activeTab]).click();  
	

	
	//------------------------------
	// CSS
	//------------------------------	
	this.updateCSS();
}




//******************************************************
//  getTab
//
//******************************************************
scanTabs.prototype.getTab = function(value){
	if (typeof value == "string"){
		for (var i=0;i<this.tabs.length;i++){
			var v = (this.tabs[i].label).toLowerCase();
			if (v.search(value.toLowerCase()) > -1){
				return this.tabs[i];
			}
		}		
	}
}




//******************************************************
//  setActiveTab
//
//******************************************************
scanTabs.prototype.setActiveTab = function(e){
	var elt = document.getElementById(e.currentTarget.id);
	var elt = e.currentTarget;
	for (var i=0; i<this.tabTitleObj.titlesA.length; i++){
		if (this.tabTitleObj.titlesA[i] == elt){
			this.activeTab = i;
			this.updateCSS();
		}
	}
}

scanTabs.prototype.updateCSS = function(){



	//------------------------------
	// WIDGET
	//------------------------------
	$(this.widget).css({
		"font-size": this.args.contentFontSize,
		"padding": 0,
		"borderRadius": 0,
		"borderWidth": this.CSS.borderWidth,
		 background: "none",
		"borderColor": Globals.inactiveLineColor,
		"backgroundColor": "rgba(25,25,25,1)",
		"font-family": 'Helvetica, Helvetica neue, Arial, sans-serif',

	})

	//------------------------------
	// TAB CONTENTS
	//------------------------------
	var contentsHeight;
	for (var i=0;i<this.tabs.length;i++){
		$(this.tabs[i]).css({
			"font-size": this.args.contentFontSize,
			"font-family": 'Helvetica, Helvetica neue, Arial, sans-serif',
			width: $(this.widget).width() - 20,
			"padding": 10,
			borderWidth: 1,
			borderColor: Globals.activeLineColor,
			"border-bottom-right-radius": "0px",
			"border-bottom-left-radius": "0px",
			"color": "rgba(255,255,255,1)",
			background: "none",
			"backgroundColor": "rgba(0,0,0,1)",
			height: ($(this.widget).height() - this.args.tabHeight)- 22,// compensating for the padding,
			marginLeft:-1

		})
	}


	
	//------------------------------
	// PARENT TITLE ELEMENT
	//------------------------------
	$(this.tabTitleObj.titleElt).css({
		"font-size": this.args.contentFontSize,
		"font-family": 'Helvetica, Helvetica neue, Arial, sans-serif',
		borderRadius: 0,
		background: "none",
		borderWidth: 0,
		"color": Globals.activeFontColor,
		padding: 0,
		
	})


	
	//------------------------------
	// TAB TITLES
	//------------------------------
	for (var i=0;i<this.tabTitleObj.titlesA.length;i++){
		
		var bColor = (i == this.activeTab) ? Globals.activeLineColor : Globals.semiactiveLineColor;
		var fColor = (i == this.activeTab) ? Globals.activeFontColor : Globals.semiactiveFontColor;
		var op = (i == this.activeTab) ? .75 : .4;
		 
		//------------------------------
		// The Text
		//------------------------------
		$(this.tabTitleObj.titlesA[i]).css({
			"font-size": this.args.contentFontSize,
			"font-family": 'Helvetica, Helvetica neue, Arial, sans-serif',
			//"color": fColor,
			borderRadius: 0,
			opacity: op
		})
		
		
		//------------------------------
		// The Frame
		//------------------------------
		$(this.tabTitleObj.titlesLi[i]).css({
			background: "none",
			backgroundColor:"rgb(0,0,0)",
			borderColor: bColor,
			borderRadius: 0,
			height: this.args.tabHeight,
			width: this.args.tabWidth,
			marginTop: -1* this.CSS.borderWidth,
			marginLeft:-1* this.CSS.borderWidth,
		})
	}	

}