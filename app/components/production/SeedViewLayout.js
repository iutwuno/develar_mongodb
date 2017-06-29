import Marionette from "backbone.marionette";
import template from "../../templates/production/productionLayout.jst";


export default Marionette.View.extend({
	whoami:"SeedViewLayout:",

	template: template,

	events: {
		"click #newSeed": "newSeed"

	},

	triggers: {
		"click #newSeed": "add:new:seed"
	},

	regions: {
		seed: "#seedView",
		seedlist: "#seedList",
		seededit: "#seedEditPanel"
	},

	childViewEvents:{
		"seed:col:render": "childColRender",
		"seed:view:close": "seedViewClose",
		"seed:form:close": "seedFormClose",
	},

	newSeed: function(){

	},

	seedViewClose: function(){
		this.$("#seedlayout a[href=\"#seedList\"]").tab("show");
	},

	seedFormClose: function(){
		this.$("#seedlayout a[href=\"#seedList\"]").tab("show");
	},



	onSeedListShow: function(view, region, options){
		this.$("#seedlayout a[href=\"#seedList\"]").tab("show");
	},

	onSeedViewShow: function(view, region, options){
		this.$("#seedlayout a[href=\"#seedView\"]").tab("show");
	},

	onSeedFormShow: function(view, region, options){
		this.$("#seedlayout a[href=\"#seedEditPanel\"]").tab("show");
	},


	onChildSeedColRender: function(){
		console.log("[%s] seed:col:render bubbled on seed layout", this.whoami);
	},

	childColRender: function(){
		this.$("#seedlayout a[href=\"#seedList\"]").tab("show"); 
	},

});







