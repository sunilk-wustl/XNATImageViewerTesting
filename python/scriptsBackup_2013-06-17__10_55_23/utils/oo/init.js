//******************************************************
//  
//******************************************************

utils.oo.init = function (obj, defaultArgs, args, initRoutine) {
	obj.defaultArgs = defaultArgs;
	obj.args = (args) ? utils.dom.mergeArgs(obj.defaultArgs, args) : obj.defaultArgs;
	
	obj.CSS = (obj.args.CSS) ? obj.args.CSS : obj.args.widgetCSS;
	
	obj.widget = utils.dom.makeElement("div", obj.args.parent, obj.args.id, obj.CSS);
	$(window).resize(function () {
	  obj.updateCSS();
	});
	
	if (initRoutine)
		initRoutine();
}