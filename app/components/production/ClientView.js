import Marionette from "backbone.marionette";
import template from "../../templates/production/clientView.jst";

export default Marionette.View.extend({
	whoami:"ClientView: ",
	
	template: template,

	events:{
		"click #close-view": "closeView",
		"click #edit-entity": "editEntity"
	},

	triggers:{
		"click #edit-entity": "entity:edit"
	},

	editEntity: function(){
		//console.log("[%s] editEntity Event [%s]", this.whoami, this.model.get('slug'));
	},

	closeView: function(e){
		e.preventDefault();
		e.stopPropagation();
		this.triggerMethod("client:view:close");

	},

	onRender: function(){
	}
});
