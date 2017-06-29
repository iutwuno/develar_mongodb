import Backbone from "backbone";
import _ from "underscore";

/******************
	PRIVATE
******************/
var updateCampaignData = function(model, col){
	col.findByName(model.get("cnumber")).set(model.attributes);
};

var populate = [
	{
		cnumber:'1101',
		slug: 'AbbVie sobre Humira',
		client: 'abbvie',
		sponsor: 'abbvie',
		temasOptionList: [
	            {val:'no_definido' , label:'Seleccione....'},
	            {val:'cancer'  ,     label:'tratamiento del cancer'},
	            {val:'chicungunya' , label:'tratamiento de la chicungunya'},
		],

    	subtemasOptionList:{
	        cancer: [
	            {val:'no_definido' , label:'Seleccione....'},
	            {val:'prevencion'  , label:'acciones de prevencion'},
	            {val:'pancreas'   , label:'tratamiento del pancreas'},
	        ],
	        chicungunya: [
	            {val:'no_definido' , label:'Seleccione....'},
	            {val:'mayores',      label:'personas mayores'},
	            {val:'embarazadas' , label:'personas embarazadas'},
	        ],
	        nodefinido: [
	            {val:'nodefinido'  , label:'Estado/provincia'},
	        ],

    	},   

	},

	{
		cnumber:'1102',
		slug: 'Glaxo campaña institucional',
		client: 'glaxo',
		sponsor: 'glaxo',

		temasOptionList: [
	            {val:'no_definido' , label:'Seleccione....'},
	            {val:'mision'  ,     label:'percepcion de la mision'},
	            {val:'vision' ,      label:'percepción de la visión'},
		],


    	subtemasOptionList:{
	        mision: [
	            {val:'no_definido' , label:'Seleccione....'},
	            {val:'percepcion',   label: 'percepcion'},
	            {val:'logros' ,      label: 'fidelidad'},
	        ],

	        vision: [
	            {val:'no_definido' , label:'Seleccione....'},
	            {val:'percepcion',   label: 'percepcion'},
	            {val:'logros' ,      label: 'fidelidad'},
	        ],
	        nodefinido: [
	            {val:'nodefinido'  , label:'Estado/provincia'},
	        ],
    	},   



	},

];



/******************
	SERVICE
******************/
var CampaignService = {
	whoami: "CampaignService:",

	addCampaign: function(model, col){

		col.add(new Campaign(model.attributes));
	},

	updateCampaign: function(model, col){
		updateCampaignData(model, col);
	},

	factoryNewCampaign: function(){
		return new CampaignNew();

	},

	factorCampaign: function(){
		return new Campaign();

	},
	
	populate: function(){
		return new CampaignCol(populate);
	}
};

var Campaign = Backbone.Model.extend({
	whoami: "Campaign.js:Campaign ",
	
	urlRoot: "/campaigns",

	idAttribute: "_id",

	validate: function(attrs /*[, options ] */) {
		var errors = {};

		if (_.has(attrs,"cnumber") && ! attrs.cnumber) {
			errors.cnumber = "Campaign: No puede ser nulo";
		}

		if (_.has(attrs,"slug") && ! attrs.slug) {
			errors.slug = "Descripción: no puede ser nula";
		}

		if( ! _.isEmpty(errors)){
			return errors;
		}
	},

	schema: {
		cnumber: 		{type: "Text", title: "Código", editorAttrs:{placeholder : "código de campaign"},validators:["required"]},
		slug: 			{type: "Text", title: "Título", editorAttrs:{placeholder : "Denominación"}, validators:["required"]},

		description: 	{type: "TextArea", title: "Descripción", editorAttrs:{placeholder : "descripción/ alcanceso"}},
		client: 		{type: "Text", title: "Cliente", editorAttrs:{placeholder : "cliente"}, validators:["required"]},
		sponsor: 		{type: "Text", title: "Sponsor", editorAttrs:{placeholder : "sponsor"}, validators:["required"]},

	},

	defaults : {
		_id: null,
		cnumber: '',
		slug: '',
		description: "",

		client: '',
		sponsor: '',
		temasList: [],
		subtemasList: [],
		clientData: {
			billing: '',
			areas: [],
			products: []
		}
	}
});


var CampaignNew = Backbone.Model.extend({

	whoami: "CampaignNew:Campaign.js ",
	urlRoot: "/campaigns",

	idAttribute: "_id",

	validate: function(attrs /*[, options ] */) {
		var errors = {};

		if (_.has(attrs,"cnumber") && ! attrs.cnumber) {
			errors.cnumber = "Campaign: No puede ser nulo";
		}

		if (_.has(attrs,"displayName") && ! attrs.displayName) {
			errors.displayName = "Saludo: No puede ser nulo";
		}

		if( ! _.isEmpty(errors)){
			return errors;
		}
	},

	schema: {
		cnumber: 		{type: "Text", title: "Código", editorAttrs:{placeholder : "código de campaign"},validators:["required"]},

		slug: 			{type: "Text", title: "Título", editorAttrs:{placeholder : "denominación"}, validators:["required"]},


	},

	defaults : {
		_id: null,
		cnumber: '',
		slug: '',
		description: "",

	}
});

var CampaignCol = Backbone.Collection.extend({

	model: Campaign,

	url: "/campaigns",
	
	findByName: function(cnumber){
		var entity = this.findWhere({cnumber: cnumber});

		if(entity) return entity;
		else return new Campaign();
	}

});



export  {Campaign, CampaignCol, CampaignService};

