import Marionette from "backbone.marionette";
import template from "../../templates/user/userView.jst";



export default Marionette.View.extend({
	whoami:"UserView (detail):",
	
	template: template,

	events:{
		"click #closeview": "closeView",
		"click #useredit": "editUser"

	},

	triggers:{
		"click #useredit": "user:edit"
	},

	editUser: function(){
		console.log("[%s] editUser Event", this.whoami);
	},

	closeView: function(e){
		e.preventDefault();
		e.stopPropagation();
		console.log("[%s] CLOSE", this.whoami);
		this.triggerMethod("user:view:close");

	},

	onRender: function(){
		console.log("[%s] RENDER", this.whoami);
		//this.triggerMethod('user:view:render');
	}

});







