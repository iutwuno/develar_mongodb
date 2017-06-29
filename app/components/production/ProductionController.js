import $ from "jquery";

import Bb from "../../lib/backboneforms.js";

import {SeedCol, SeedManager} from "../entities/Seed";
import {MediaCol, MediaService} from "../entities/Media";


import SeedViewLayout from "./SeedViewLayout";

import SeedView from "./SeedView";
import MediaView from "./MediaView";

import SeedEdit from "./SeedEdit";
import seedEditForm from "../../templates/production/seedEditForm.jst";

import SeedViewCol from "./SeedViewCol";
import Message from "../commons/message.js";

var whoami = "SeedController:";

var Form = Bb.Form;

var seedCollection,
	mediaCollection,

	seedLayoutView,
	seedColView;



var fetchSeedsFromDB = function(cb){
	mediaCollection = MediaService.populate();
	var seeds = [
		{
			cnumber:'10101',
			slug: 'Las enfermedades tienen cura',
			description: 'loren ipsum adfkasd f ñfj aldfj añdjf ñaldf ñalsdj falsj fñlasj dfads falñsdf alsdfas flasf dalsl df',
			fecomp: '12/04/2017',
			media: 'clarin',
			campaign: '1101',
			tema: 'no_definido',
			subtema: 'pancreas',
			etiquetas: 'eti1; eti2; eti3; ',
			area: 'ingenieria de producto',
			producto: 'aspririna',
			dimension: 'dimension-1',
			indicacion: 'indicacion',
			campaign_data: {
				cnumber: '1101',
				slug: 'AbbVie sobre Humira',
				client: 'abbvie'
			},
			media_data: {
				cnumber: 'clarin',
				slug: 'Clarin',
				section: 'economía'
			},
			clasification: {
				tema: 'crecimiento mercado moléculas',
				subtema: 'crecimiento argentina',
				etiquetas: ['moleculas', 'mercado' ]
			}
		},
		{
			cnumber:'10111',
			slug: 'Las pharmas locales crecen',
			description: 'loren ipsum adfkasd f ñfj aldfj añdjf ñaldf ñalsdj falsj fñlasj dfads falñsdf alsdfas flasf dalsl df',
			fecomp: '12/05/2017',
			media: 'lanacion',
			campaign: '1102',
			tema: 'mision',
			subtema: 'un subtema',
			etiquetas: 'eti1; eti2; eti3; ',
			area: 'ingenieria de producto',
			producto: 'aspririna',
			dimension: 'dimension-1',
			indicacion: 'indicacion',
			campaign_data: {
				cnumber: '1102',
				slug: 'Glaxo campaña institucional',
				client: 'glaxo'
			},
			media_data: {
				cnumber: 'clarin',
				slug: 'Clarin',
				section: 'economía'
			},
			clasification: {
				tema: 'expansion del mercado pharmas',
				subtema: 'pharmas pymes',
				etiquetas: ['pharmas', 'mercado' ]
			}
		},
		{
			cnumber:'10123',
			slug: 'Expertos vaticinan mejoras en la calidad de vida',
			description: 'loren ipsum adfkasd f ñfj aldfj añdjf ñaldf ñalsdj falsj fñlasj dfads falñsdf alsdfas flasf dalsl df',
			fecomp: '13/05/2017',
			media: 'clarin',
			campaign: '1101',
			tema: 'cancer',
			subtema: 'prevencion',
			etiquetas: 'eti1; eti2; eti3; ',
			area: 'ingenieria de producto',
			producto: 'aspririna',
			dimension: 'dimension-1',
			indicacion: 'indicacion',
			campaign_data: {
				cnumber: '1101',
				slug: 'AbbVie sobre Humira',
				client: 'abbvie'
			},
			media_data: {
				cnumber: 'm101',
				slug: 'Clarin',
				section: 'sociedad'
			},
			clasification: {
				tema: 'referentes sociales',
				subtema: 'academicos',
				etiquetas: ['calidad de vida' ]
			}
		},
	];




	cb(new SeedCol(seeds)) ;
};

/*********************
*  HELPER(S)
*********************/
var findSeedByName = function(cnumber){
	if(!seedCollection) return null;

	return seedCollection.findByName(cnumber);
};

var findMediaByName = function(cnumber){
	if(!mediaCollection) return null;

	return mediaCollection.findByName(cnumber);
};


/*********************
*  EVENTOS LIST
*********************/
var renderSeedList = function(layout, seeds){
	if(seedColView) seedColView.destroy();

	seedColView = new SeedViewCol({collection: seeds});
	// Eventos
	seedColView.on("seed:selected", function(view){

		renderSeedView(view.model);

	});

	layout.getRegion("seedlist").show(seedColView.render());
	Bb.history.navigate("#eventos/consulta");

};



/*********************
*  EVENTOS EDIT
*********************/
var initSeedEdit = function(cnumber){

	var seed = findSeedByName(cnumber);
	if(seed){

		editSeedData(seed);

	}else{
		console.log("180 Seed no encontrado");
	}
};

var editSeedData = function(seed){

	var form = editSeedForm(seed);
	renderSeedForm(seed, form);

	seedLayoutView.triggerMethod("seed:form:show");
	Bb.history.navigate("#eventos/editar/" + seed.get("cnumber"));

};

var editSeedForm = function(seed){
	var form = new Form({
		model: seed,
		template: seedEditForm
	});

	return form;
};

var renderSeedForm = function(seed, form){
	var mediaView = fetchMedia(seed),
		seedForm = new SeedEdit({form: form, media: mediaView});

	seedForm.on('accept:continue', function(view, form, cb){
		var newModel,
			model = formAccepted(view, form);

		if(model){
			Message.success('Registro ['+ model.get('cnumber') +'] editado con éxito');

			editSeedData(cloneNewSeed(model));
			//cb(false, newModel);

		}else{
			Message.error('Error al intentar actualizar el registro!');
		}
	});

	seedForm.on('accept:end', function(view, form, cb){
		var model = formAccepted(view, form);
			console.log('accept:end [%s]', model|| 'error');

		if(model){
			Message.success('Registro ['+ model.get('cnumber') +'] editado con éxito');

			renderSeedList(seedLayoutView, seedCollection);
		}else{
			Message.error('Error al intentar actualizar el registro!');
			//cb(true, null);
		}
	});

	seedForm.on('edit:cancel', function(view, form, cb){
		renderSeedList(seedLayoutView, seedCollection);
	});

	seedForm.on('add:person:editor', function(role){
		console.log('add:person BUBBLEDDDDD [%s]', role);
		var pController = SeedManager.factoryPersonEditor({role: role});
		//seedForm.getRegion("extraeditor").show(pController.view.render());
		seedForm.$("#extraeditor-hook").append(pController.view.render().el);


	});



	seedLayoutView.getRegion("seededit").show(seedForm.render());

};

var cloneNewSeed = function(model){
	return SeedManager.cloneSeed(model);
};

var formAccepted = function (view, form){
	var error = form.commit();
	if(error){
		console.log("[%s] onRENDER blur: ERROR [%s]",whoami, form.model.get("cnumber"));
		return null;
	}else{

		var model = SeedManager.updateSeed(seedCollection, form.model, view.campaign.model, view.client, view.media.model);
		return model;
	}

};


var fetchMedia = function(seed){
	var media =  findMediaByName(seed.get('media'))
	return new MediaView({model: media});
}


/*********************
*  EVENTOS NEW
*********************/
var createNewSeed = function(){
	var seed = SeedManager.factoryNewSeed();

	var form = factorySeedFormNew(seed);
	renderSeedFormModal(form);
	Bb.history.navigate("#eventos/alta");

};

var factorySeedFormNew = function(seed){
	var form = new Form({
		model: seed,
	});

	form.on("blur", function(form, editor){
		var error = form.commit();
		if(error){
			console.log("[%s] onRENDER blur: ERROR [%s]",whoami, form.model.get("cnumber"));
		}else{
			console.log("[%s] onRENDER blur: OK [%s] Bb:[%s]",whoami, form.model.get("cnumber"), Bb.VERSION);
		}
	});
	return form;
};


var renderSeedFormModal = function(form){
	var modal = new Bb.BootstrapModal({
		content: form,
		title: "Alta nuevo seed" ,
		okText: "aceptar",
		cancelText: "cancelar",
		enterTriggersOk: false,
	});

	modal.on("ok",function(){
		var errors = form.commit({validate: true});
		if(!errors){			
			SeedManager.addSeed(form.model, seedCollection);

			renderSeedList(seedLayoutView, seedCollection);

		}else{
			console.log("Se produjo un error en la actualización de sus datos. Inténtelo nuevamente");
		}
	});

	modal.open();
};



/*********************
*  EVENTOS VIEW
*********************/
var initSeedView = function(name){
	var seed = findSeedByName(name);
	if(seed){

		renderSeedView(seed);

	}else{
		console.log("Seed no encontrado");
	}
};


var listenSeedViewEvents = function(model, view){

	view.on("seed:edit", function(view){
		editSeedData(model, view);
	});
};

var renderSeedView = function(model){

	var seedView = new SeedView({model: model});

	listenSeedViewEvents(model, seedView);

	seedLayoutView.getRegion("seed").show(seedView.render());
	Bb.history.navigate("#eventos/ver/" + model.get("cnumber"));

};


/*********************
*  EVENTOS MODULE
*********************/
var seedModuleFactory = function(cb){

	fetchSeedsFromDB(function(seeds){

		seedCollection = seeds;

		var layout = initModuleLayout();

		renderSeedList(layout, seeds);

		cb(layout);
	});
};

var initModuleLayout = function(){

	seedLayoutView = new SeedViewLayout();

	seedLayoutView.getRegion("seed").on("show", function(region, view, options){
		seedLayoutView.triggerMethod("seed:view:show", view, region, options);
	});

	seedLayoutView.getRegion("seedlist").on("show", function(region, view, options){
		seedLayoutView.triggerMethod("seed:list:show", view, region, options);
	});

	seedLayoutView.on("add:new:seed", function(){
		SeedController.seedCreate();
	});

	seedLayoutView.render();

	return seedLayoutView;
};


/**********************************************
           EVENTOS CONTROLLER API
***********************************************/
var SeedController = {
	loadModule: function(cb){
		// Message.success('Todo bien');
		// Message.warning('warning');
		// Message.info('info');
		// Message.error('error');

		// Message.confirm('Confirma el alta?',function(response){
		// 	console.log('Message response: [%s]', response);
		// });

		seedModuleFactory(cb);



 
	},

	showSeedList: function(){
		console.log("[%s] showSeedList", whoami);
		Bb.history.navigate("#eventos/consulta");
		if(!seedLayoutView){
			this.loadModule(function(view){
				$("#appcontent").html(view.$el);
			});
		}else{
			seedLayoutView.getRegion("seedlist").show(seedColView.render());


		}
	},

	showSeedDetails: function(name){
		console.log("[%s] showSeedDetails [%s]", whoami, name);
		if(!seedLayoutView){
			this.loadModule(function(view){
				$("#appcontent").html(view.$el);
				initSeedView(name);
			});
		}else{
			initSeedView(name);
		}
	},

	seedCreate: function(){
		console.log("[%s] seedCreate ", whoami);
		if(!seedLayoutView){
			this.loadModule(function(view){
				$("#appcontent").html(view.$el);
				createNewSeed();
			});

		}else{
			createNewSeed();
		}

	},

	seedEdit: function(name){
		console.log("[%s] seedEdit: [%s] ", whoami, name);
		if(!seedLayoutView){
			this.loadModule(function(view){
				$("#appcontent").html(view.$el);
				initSeedEdit(name);
			});

		}else{
			initSeedEdit(name);
		}

	}
};

export default SeedController;