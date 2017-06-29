import Marionette from "backbone.marionette";
import template from "../../templates/user/userEdit.jst";
import "../../styles/backboneforms.css";



export default Marionette.View.extend({
	whoami:"UserEdit:",
	
	initialize: function(data){
		console.log("[%s] Initialize", this.whoami);
		this.form = data.form;
	},

	template: template,

	regions: {
		form: "#form-hook",
	},
	
	events:{
	},

	closeView: function(e){
		e.preventDefault();
		e.stopPropagation();
		console.log("[%s] CLOSE", this.whoami);
		this.triggerMethod("user:view:close");

	},

	onRender: function(){
		this.form.on("username:change", function(form, titleEditor, extra) {
			console.log("Username change to \"" + titleEditor.getValue() + "\".");
		});
		this.showChildView("form",this.form);
	}

});

