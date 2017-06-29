import $ from "jquery";

import Bb from "../../lib/backboneforms.js";

import Marionette from "backbone.marionette";
import template from "../../templates/production/seedPersonEdit.jst";
import seedPersonEditForm from "../../templates/production/seedPersonEditForm.jst";

import "../../styles/backboneforms.css";

var whoami = "SeedPersonEdit";

var Form = Bb.Form;


var editSeedPersonForm = function(model){
	console.log('[%s]:editSeedPerson: [%s] [%s] [%s] ', model.whoami, model.get('role'), model.get('name'), model.get('slug'))
	var form = new Form({
		model: model,
		template: seedPersonEditForm
	});
	console.log('form created')

	form.on("blur", function(form, editor){
		var error = form.commit();
		if(error){
			console.log("[%s] onRENDER blur: ERROR",whoami);
		}else{
			console.log("[%s] onRENDER blur: OK ",whoami);
		}
	});




	return form;
};



export default Marionette.View.extend({
	whoami:"SeedPersonEdit:",
	
	initialize: function(data){
		this.model = data.model;
		this.form = editSeedPersonForm(this.model);
	},

	registerFormEvents: function(){
		var that = this;
		this.form.on('campaign:blur', function(form, editor){

		});

		this.form.on('render',function(form){
		});

	},

	template: template,

	regions: {
		form: "#form-hook",
		buttons: "#buttons-hook",
	},
	
	events:{
		"click #cancel": "editCancel"
	},

	childViewEvents:{
	},
	

	editCancel: function(e){
		this.triggerMethod('edit:cancel', this, this.form);
	},

	closeView: function(e){
		e.preventDefault();
		e.stopPropagation();
		this.triggerMethod("seed:view:close");

	},

	onRender: function(){
		this.showChildView("form",this.form);
		//Message.warning('Inline Message',btn_view.$(".notify-alert") );
	}
});

