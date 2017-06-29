import Backbone from "backbone";
import _ from "underscore";

/******************
	PRIVATE
******************/
var updateMediaData = function(model, col){
	var media = col.findByName(model.get("cnumber"));
	media.set(model.attributes);
};

var populate = [
	{
		cnumber:'clarin',
		slug: 'Clarin Diario',
		tirada: '300000',
		grupoEmp: 'Grupo Clarin',
		parentCo: '',
		scope: 'nacional',
		sections: [
			{val: 'economia', label: 'Economia'},
			{val: 'salud',    label: 'Salud'},
			{val: 'revista',  label: 'Clarín Revista'},
			{val: 'especial', label: 'Suplemento especial'},

		],
	},

	{
		cnumber:'lanacion',
		slug: 'La Nación',
		tirada: '150000',
		grupoEmp: 'Lanacion',
		parentCo: '',
		scope: 'nacional',
		sections: [
			{val: 'economia', label: 'Economia'},
			{val: 'hogar',    label: 'Hogar'},
			{val: 'revista',  label: 'La Nación revista'},
			{val: 'especial', label: 'Suplemento especial'},

		],

	},

];



/******************
	SERVICE
******************/
var MediaService = {
	whoami: "MediaService:",

	addMedia: function(model, col){
		col.add(new Media(model.attributes));
	},

	updateMedia: function(model, col){
		updateMediaData(model, col);
	},

	factoryNewMedia: function(){
		return new MediaNew();

	},
	factoryMedia: function(){
		return new Media();

	},
	populate: function(){
		return new MediaCol(populate);
	}
};

var Media = Backbone.Model.extend({

	whoami: "Media.js:Media ",
	urlRoot: "/medias",

	idAttribute: "_id",

	validate: function(attrs /*[, options ] */) {
		var errors = {};

		if (_.has(attrs,"cnumber") && ! attrs.cnumber) {
			errors.cnumber = "Media: No puede ser nulo";
		}

		if (_.has(attrs,"slug") && ! attrs.slug) {
			errors.slug = "Descripción: no puede ser nula";
		}

		if( ! _.isEmpty(errors)){
			return errors;
		}
	},

	schema: {
		cnumber: 		{type: "Text", title: "Código", editorAttrs:{placeholder : "código de media"},validators:["required"]},
		slug: 			{type: "Text", title: "Título", editorAttrs:{placeholder : "título nota/ descripción corta / asunto"}, validators:["required"]},

		description: 	{type: "TextArea", title: "Descripción", editorAttrs:{placeholder : "descripción/ bajada/ comentario"}},


	},

	defaults : {
		_id: null,
		cnumber: '',
		slug: '',
		tirada: "",
		grupoEmp: "",
		parentCo: "",
		sections:[{val:"no_definido", label: "no definido"}],
		description: "",
		scope: "",

	}
});


var MediaNew = Backbone.Model.extend({

	whoami: "MediaNew:Media.js ",
	urlRoot: "/medias",

	idAttribute: "_id",

	validate: function(attrs /*[, options ] */) {
		var errors = {};

		if (_.has(attrs,"cnumber") && ! attrs.cnumber) {
			errors.cnumber = "Media: No puede ser nulo";
		}

		if (_.has(attrs,"displayName") && ! attrs.displayName) {
			errors.displayName = "Saludo: No puede ser nulo";
		}

		if( ! _.isEmpty(errors)){
			return errors;
		}
	},

	schema: {
		cnumber: 		{type: "Text", title: "Código", editorAttrs:{placeholder : "código de media"},validators:["required"]},

		slug: 			{type: "Text", title: "Título", editorAttrs:{placeholder : "título nota/ descripción corta / asunto"}, validators:["required"]},


	},

	defaults : {
		_id: null,
		cnumber: '',
		slug: '',
		description: "",

	}
});

var MediaCol = Backbone.Collection.extend({

	model: Media,

	url: "/medias",
	
	findByName: function(cnumber){
		var entity = this.findWhere({cnumber: cnumber});
		if(entity) return entity;
		else return new Media();
	}

});



export  {Media, MediaCol, MediaService};

