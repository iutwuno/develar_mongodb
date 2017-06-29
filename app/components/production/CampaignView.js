import Marionette from "backbone.marionette";
import template from "../../templates/production/campaignView.jst";
import {Client, ClientCol, ClientService} from "../entities/Client";
import ClientView from "./ClientView";

const clientCol = ClientService.populate();

const fetchClient = function(id){
	if(id){
		return fetchClientById(id);
	}else{
		return initNewClient();
	}
};

const fetchClientById = function(id){
	return new ClientView({model: clientCol.findByName(id)});
};

const initNewClient = function(){
	return new ClientView({model: new Client()});
};



export default Marionette.View.extend({
	whoami:"CampaignView: ",
	
	template: template,

	initialize: function(data){

		this.fetchClientView();
	},

	events:{
		"click #close-view": "closeView",
		"click #edit-entity": "editEntity"

	},

	regions: {
		client: "#client-hook",
	},
	
	fetchClientView: function(){
		this.client = fetchClient(this.model.get('client'));
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
		this.triggerMethod("campaign:view:close");

	},

	onRender: function(){
		this.showChildView("client",this.client);
	}
});
