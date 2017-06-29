import Backbone from "backbone";
import _ from "underscore";

/******************
	PRIVATE
******************/
var updateClientData = function(model, col){
	col.findByName(model.get("cnumber")).set(model.attributes);
};

var populate = [
	{
		cnumber:'glaxo',
		slug: 'Glaxo',
		description: 'Liden en la industria por sus fármacos',
		products: [
			{val: 'gp1', label: 'Glaxo-P1'},
			{val: 'gp2', label: 'Glaxo-P2'},
			{val: 'gp3', label: 'Glaxo-P3'},
			{val: 'gp4', label: 'Glaxo-P4'},
			{val: 'gp5', label: 'Glaxo-P5'},
		],
		areas: [
			{val: 'area1', label: 'Glaxo-Area-1'},
			{val: 'area2', label: 'Glaxo-Area-2'},
			{val: 'area3', label: 'Glaxo-Area-3'},
			{val: 'area4', label: 'Glaxo-Area-4'},
			{val: 'area5', label: 'Glaxo-Area-5'},
		]
	},

	{
		cnumber:'merz',
		slug: 'Merz',
		description: 'Liden en la industria por sus fármacos',
		products: [
			{val: 'gp1', label: 'Merz-P1'},
			{val: 'gp2', label: 'Merz-P2'},
			{val: 'gp3', label: 'Merz-P3'},
			{val: 'gp4', label: 'Merz-P4'},
			{val: 'gp5', label: 'Merz-P5'},
		],
		areas: [
			{val: 'area1', label: 'Merz-Area-1'},
			{val: 'area2', label: 'Merz-Area-2'},
			{val: 'area3', label: 'Merz-Area-3'},
			{val: 'area4', label: 'Merz-Area-4'},
			{val: 'area5', label: 'Merz-Area-5'},
		]	},
	{
		cnumber:'boeringher',
		slug: 'Boeringher',
		description: 'Liden en la industria por sus fármacos',
		products: [
			{val: 'gp1', label: 'Boheringer-P1'},
			{val: 'gp2', label: 'Boheringer-P2'},
			{val: 'gp3', label: 'Boheringer-P3'},
			{val: 'gp4', label: 'Boheringer-P4'},
			{val: 'gp5', label: 'Boheringer-P5'},
		],
		areas: [
			{val: 'area1', label: 'Boheringer-Area-1'},
			{val: 'area2', label: 'Boheringer-Area-2'},
			{val: 'area3', label: 'Boheringer-Area-3'},
			{val: 'area4', label: 'Boheringer-Area-4'},
			{val: 'area5', label: 'Boheringer-Area-5'},
		]	},

	{
		cnumber:'abbvie',
		slug: 'AbbVie',
		description: 'Liden en la industria por sus fármacos',
		products: [
			{val: 'gp1', label: 'abbvie-P1'},
			{val: 'gp2', label: 'abbvie-P2'},
			{val: 'gp3', label: 'abbvie-P3'},
			{val: 'gp4', label: 'abbvie-P4'},
			{val: 'gp5', label: 'abbvie-P5'},
		],
		areas: [
			{val: 'area1', label: 'abbvie-Area-1'},
			{val: 'area2', label: 'abbvie-Area-2'},
			{val: 'area3', label: 'abbvie-Area-3'},
			{val: 'area4', label: 'abbvie-Area-4'},
			{val: 'area5', label: 'abbvie-Area-5'},
		]	
	},

];



/******************
	SERVICE
******************/
var ClientService = {
	whoami: "ClientService:",

	addClient: function(model, col){
		col.add(new Client(model.attributes));
	},

	updateClient: function(model, col){
		updateClientData(model, col);
	},

	factoryNewClient: function(){
		return new ClientNew();

	},
	factoryClient: function(){
		return new Client();

	},
	populate: function(){
		return new ClientCol(populate);
	}
};

var Client = Backbone.Model.extend({
	whoami: "Client.js:Client ",
	
	urlRoot: "/clients",

	idAttribute: "_id",

	validate: function(attrs /*[, options ] */) {
		var errors = {};

		if (_.has(attrs,"cnumber") && ! attrs.cnumber) {
			errors.cnumber = "Client: No puede ser nulo";
		}

		if (_.has(attrs,"slug") && ! attrs.slug) {
			errors.slug = "Descripción: no puede ser nula";
		}

		if( ! _.isEmpty(errors)){
			return errors;
		}
	},

	schema: {
		cnumber: 		{type: "Text", title: "Código", editorAttrs:{placeholder : "código de cliente"},validators:["required"]},
		slug: 			{type: "Text", title: "Razón Social", editorAttrs:{placeholder : "Nombre / Razón social"}, validators:["required"]},

		description: 	{type: "TextArea", title: "Descripción", editorAttrs:{placeholder : "descripción / comentario"}},

	},

	defaults : {
		_id: null,
		cnumber: '',
		slug: '',
		description: "",

	}
});


var ClientNew = Backbone.Model.extend({

	whoami: "ClientNew:Client.js ",
	urlRoot: "/clients",

	idAttribute: "_id",

	validate: function(attrs /*[, options ] */) {
		var errors = {};

		if (_.has(attrs,"cnumber") && ! attrs.cnumber) {
			errors.cnumber = "Client: No puede ser nulo";
		}

		if (_.has(attrs,"displayName") && ! attrs.displayName) {
			errors.displayName = "Saludo: No puede ser nulo";
		}

		if( ! _.isEmpty(errors)){
			return errors;
		}
	},

	schema: {
		cnumber: 		{type: "Text", title: "Código", editorAttrs:{placeholder : "código de client"},validators:["required"]},

		slug: 			{type: "Text", title: "Razón Social", editorAttrs:{placeholder : "Nombre o razón social"}, validators:["required"]},


	},

	defaults : {
		_id: null,
		cnumber: '',
		slug: '',
		description: "",

	}
});

var ClientCol = Backbone.Collection.extend({

	model: Client,

	url: "/clients",
	
	findByName: function(cnumber){
		var entity = this.findWhere({cnumber: cnumber});

		if(entity) return entity;
		else return new Client();
	}

});



export  {Client, ClientCol, ClientService};

