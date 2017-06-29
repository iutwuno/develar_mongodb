import Marionette from "backbone.marionette";
import template from "../../templates/user/userLayout.jst";


export default Marionette.View.extend({
	whoami:"UserViewLayout:",

	template: template,

	events: {
		"click #newUser": "newUser"

	},

	triggers: {
		"click #newUser": "add:new:user"
	},

	regions: {
		user: "#userView",
		userlist: "#userList",
		useredit: "#userEditPanel"
	},

	childViewEvents:{
		"user:col:render": "childColRender",
		"user:view:close": "userViewClose",
		"user:form:close": "userFormClose",
	},

	newUser: function(){

	},

	userViewClose: function(){
		console.log("[%s] user:view:close bubbled on user layout", this.whoami);
		this.$("#usrlayout a[href=\"#userList\"]").tab("show");
	},

	userFormClose: function(){
		console.log("[%s] user:form:close bubbled on user layout", this.whoami);
		this.$("#usrlayout a[href=\"#userList\"]").tab("show");
	},



	onUserListShow: function(view, region, options){
		console.log("[%s] user:list:show bubbled on user layout", this.whoami);
		this.$("#usrlayout a[href=\"#userList\"]").tab("show");
	},

	onUserViewShow: function(view, region, options){
		console.log("[%s] user:view:show bubbled on user layout", this.whoami);
		this.$("#usrlayout a[href=\"#userView\"]").tab("show");
	},

	onUserFormShow: function(view, region, options){
		console.log("[%s] user:form:show bubbled on user layout", this.whoami);
		this.$("#usrlayout a[href=\"#userEditPanel\"]").tab("show");
	},


	onChildUserColRender: function(){
		console.log("[%s] user:col:render bubbled on user layout", this.whoami);
	},

	childColRender: function(){
		console.log("[%s] child:col:render EVENT on user layout", this.whoami);
		this.$("#usrlayout a[href=\"#userList\"]").tab("show"); 
	},

});







