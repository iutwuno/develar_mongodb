import Marionette from "backbone.marionette";
import template from "../../templates/production/seedView.jst";



export default Marionette.View.extend({
	whoami:"SeedView (detail):",
	
	template: template,

	events:{
		"click #closeview": "closeView",
		"click #seededit": "editSeed"

	},

	triggers:{
		"click #seededit": "seed:edit"
	},

	editSeed: function(){
	},

	closeView: function(e){
		e.preventDefault();
		e.stopPropagation();
		this.triggerMethod("seed:view:close");

	},

	onRender: function(){
		//console.log("[%s] RENDER", this.whoami);
		//this.triggerMethod('seed:view:render');
	}

});







