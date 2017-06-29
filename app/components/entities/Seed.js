import Backbone from "backbone";
import _ from "underscore";
import {Campaign, CampaignCol, CampaignService} from "../entities/Campaign";
import {Media, MediaCol, MediaService} from "../entities/Media";
import {Client, ClientCol, ClientService} from "../entities/Client";
import SeedPersonEdit from "../production/SeedPersonEdit";

var seedPersonCol;
var seedNextNum = 12000;

var getPersonCol = function(attrs){
	if(!attrs) attrs = [];
	if(!seedPersonCol) seedPersonCol = new SeedPersonCol(attrs);
	return seedPersonCol;
};

var initPersonCol = function(model){
	var persons = model.get('persons');
	console.log('initPersonCol [%s]', persons.length);
	seedPersonCol = new SeedPersonCol(persons);
	return seedPersonCol;
};

var updateSeedData = function(col, model, campaign, client, media){

	if(model.get("cnumber") && !(model.get('cnumber') === "ALTA") ){
		return updateSeed(col, model, campaign, client, media);
	}else{
		return addNewSeed(col, model, campaign, client, media);
	}
};

var updateSeed = function(col, model, campaign, client, media){
	
	var seed = col.findByName(model.get("cnumber"));
	seed.set(model.attributes);
	seed.set('persons', )

	return updateData(seed, campaign, client, media);

};

var updateData = function(model, campaign, client, media){
	var campaign_data = {
		cnumber: campaign.get('cnumber'),
		slug: campaign.get ('slug'),
		client: campaign.get('client')
	};
	var media_data = {
		cnumber: media.get('cnumber'),
		slug: media.get ('slug'),
		section: model.get('section')
	};
	var clasification = {
		tema: model.get('tema'),
		subtema: model.get ('subtema'),
		etiquetas: model.get('etiquetas')
	};
	model.set({
		campaign_data: campaign_data,
		media_data: media_data,
		clasification: clasification
	});
	console.log('persons Col: [%s]', seedPersonCol.length);
	model.set('persons',getPersonCol().toJSON());
	return model;
};

var getNextSeedNumber = function(){
	seedNextNum += 1;
	return seedNextNum.toString();
};

var addNewSeed = function(col, model, campaign, client, media){
	var seed;

	model.set("cnumber", getNextSeedNumber());
	seed = updateData(new Seed(model.attributes), campaign, client, media);
	col.add(seed);
	return seed;
};

var SeedManager = {
	whoami: "SeedManager:",

	addSeed: function(model, col){
		addNewSeed(col, model, CampaignService.factorCampaign(),ClientService.factoryClient(), MediaService.factoryMedia() );
	},

	updateSeed: function(col, model, campaign, client, media){
		return updateSeedData(col, model, campaign, client, media);
	},

	factoryNewSeed: function(){
		return new SeedNew();

	},
	cloneSeed: function(model){
		var newseed = new Seed(model.attributes);
		newseed._id = null;
		newseed.id = null;
		newseed.set('cnumber', 'ALTA');
		return newseed;
	},

	getPersonCol: function(attrs){
		return getPersonCol(attrs);
	},

	factoryPersonEditor: function(modelAttrs){
		return personEditor4Seed(modelAttrs);
	}
};

var Seed = Backbone.Model.extend({

	whoami: "Seed.js:Seed ",
	urlRoot: "/seeds",

	idAttribute: "_id",

	initialize: function(opts){
		initPersonCol(this)
	},

	validate: function(attrs /*[, options ] */) {
		var errors = {};

		if (_.has(attrs,"cnumber") && ! attrs.cnumber) {
			//console.log('validate: error on cnumber')
			errors.cnumber = "Seed: No puede ser nulo";
		}

		if (_.has(attrs,"slug") && ! attrs.slug) {
			errors.slug = "Descripción: no puede ser nula";
		}

		if( ! _.isEmpty(errors)){
			return errors;
		}
	},

	schema: {
		cnumber: 		{type: "Text", title: "Número de evento", editorAttrs:{placeholder : "código de seed"}, editorAttrs:{disabled: true}},
		campaign: 		{type: "Text", title: "CAMPAÑA", editorAttrs:{placeholder : "código de campaña"},validators:["required"]},


        //tema:           {type: 'Select',options: utils.hourOptionList ,title:'Horario emisión'},
        tema:           {type: 'Select',options: ["uno", "dos"] ,title:'tema'},
		//tema: 			{type: "Text", title: "Tema", editorAttrs:{placeholder : "tema principal"}, validators:["required"]},
        subtema:        {type: 'Select',options: ["no_definido"] ,title:'sub tema'},
		etiquetas: 		{type: "Text", title: "Etiquetas", editorAttrs:{placeholder : "etiquetas separadas por ;"}},

        producto: 		{type: 'Select', title: 'Producto',   options: ["no_definido"] },
        area: 			{type: 'Select', title: 'Area',       editorAttrs:{placeholder : "área de la empresa"}, options: ["no_definido"] },
		dimension: 		{type: "Text",   title: "Dimensión",  editorAttrs:{placeholder : "dimensión"}},
		indicacion: 	{type: "Text",   title: "Indicación", editorAttrs:{placeholder : "indicación"}},


		fecomp: 		{type: "Text", title: "Fecha publicación", validators:["required"]  },
		anio: 			{type: "Text", title: "Año", validators:["required"]  },
		quarter: 		{type: "Text", title: "Trimestre", validators:["required"]  },
		
		media: 			{type: "Text", title: "Media", editorAttrs:{placeholder : "medio/ red social/ "}, validators:["required"]},
        section: 		{type: 'Select', title: 'Seccion',   options: ["no_definido"] },

		slug: 			{type: "Text", title: "Título", editorAttrs:{placeholder : "título nota/ descripción corta / asunto"}, validators:["required"]},

		description: 	{type: "TextArea", title: "Descripción", editorAttrs:{placeholder : "descripción/ bajada/ comentario"}},

	},

	getPersonCol: function(){
		return seedPersonCol;
	},
	renderPersons: function(view, hook){
		renderPersonEditor(this, view, hook);
	},


	defaults : {
		_id: null,
		cnumber: '',
		slug: '',
		description: "",

		fecomp: '',
		anio: '',
		quarter: '',

		campaign: '',
		tema: 'no_definido',
		subtema: 'no_definido',
		etiquetas: '',
	

		area: '',
		producto: '',
		dimension: '',
		indicacion: '',

		media: "",
		section: "",

		campaign_data: {
			cnumber: '',
			slug: '',
			client: '',
		},

		media_data: {
			cnumber: '',
			section: '',
		},

		clasification: {
			tema: '',
			subtema:'',
			etiquetas:[],
		},
		persons: [],

	}
});


var SeedNew = Backbone.Model.extend({

	whoami: "SeedNew:Seed.js ",
	urlRoot: "/seeds",

	idAttribute: "_id",

	validate: function(attrs /*[, options ] */) {
		var errors = {};

		if (_.has(attrs,"cnumber") && ! attrs.cnumber) {
			errors.cnumber = "Seed: No puede ser nulo";
		}

		if (_.has(attrs,"displayName") && ! attrs.displayName) {
			errors.displayName = "Saludo: No puede ser nulo";
		}

		if( ! _.isEmpty(errors)){
			return errors;
		}
	},

	schema: {
		cnumber: 		{type: "Text", title: "Código", editorAttrs:{placeholder : "código de seed"},validators:["required"]},
		fecomp: 		{type: "Text", title: "Fecha publicación", validators:["required"]  },
		campaign: 		{type: "Text", title: "Campaña", editorAttrs:{placeholder : "campaña"}, validators:["required"]},
		media: 			{type: "Text", title: "Media", editorAttrs:{placeholder : "medio/ red social/ "}, validators:["required"]},

		slug: 			{type: "Text", title: "Título", editorAttrs:{placeholder : "título nota/ descripción corta / asunto"}, validators:["required"]},


	},

	defaults : {
		_id: null,
		cnumber: 'ALTA',
		slug: '',
		campaign: '',
		media: '',
		description: "",

	}
});

var SeedCol = Backbone.Collection.extend({
	whoami: 'Seed.js:SeedCol: ',

	model: Seed,

	url: "/seeds",
	
	findByName: function(cnumber){
		var model = this.findWhere({cnumber: cnumber});

		return model;
	}

});

var personEditor4Seed = function(attrs){
	var data = attrs || {},
		model =  new SeedPerson(data);


	getPersonCol().add(model);

	var controller = {
		model: model,
		view: new SeedPersonEdit({model: model})
	}
	return controller;
};

var renderPersonEditor = function(model, view, hook){
	initPersonCol(model).each(function(model){
		console.log('model:each');
		view.$(hook).append(personEditor4Seed(model.attributes).view.render().el);

	});

};


var SeedPerson = Backbone.Model.extend({

	whoami: "seed.js:SeedPerson:",

	schema: {
    	role: 		{type: 'Select',options: ["autor", "vocero"] ,title:'Rol'},
		name: 		{type: "Text",  title: "Nombre", editorAttrs:{placeholder : "nombre y apellido"}, validators:["required"]},
		slug: 		{type: "Text", title: "Comentario", editorAttrs:{placeholder : "comentario"}, validators:["required"]},
	},

	defaults:{
		role: 'vocero',
		name: '',
		slug: '',
	}

});

var SeedPersonCol = Backbone.Collection.extend({
	whoami: 'Seed.js:SeedPersonCol: ',
	model: SeedPerson,
});



export  {Seed, SeedCol, SeedManager};

