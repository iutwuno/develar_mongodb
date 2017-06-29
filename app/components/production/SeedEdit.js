import Marionette from "backbone.marionette";
import template from "../../templates/production/seedEdit.jst";
import "../../styles/backboneforms.css";

import MediaView from "./MediaView";

import CampaignView from "./CampaignView";
import {Campaign, CampaignCol, CampaignService} from "../entities/Campaign";
import {Media, MediaCol, MediaService} from "../entities/Media";
import {Client, ClientCol, ClientService} from "../entities/Client";
//import Message from "../commons/message.js";


const campaignCol = CampaignService.populate();
const mediaCol = MediaService.populate();
const clientCol = ClientService.populate();

const buttons = `
	<div>
	<button id="accept"    type="button" class="btn btn-outline-primary"   >Aceptar</button>
	<button id="save"      type="button" class="btn btn-outline-info" >Aceptar y continuar</button>
	<button                type="button" class="btn btn-outline-secondary"      >Info</button>
	<button id="cancel"    type="button" class="btn btn-outline-warning"   >Cancelar</button>
	</div>
	<div class="row">
		<div class="col notify-alert"></div>
	</div>
`;

const ButtonView = Marionette.View.extend({
	template: _.template(buttons),
	triggers:{
		"click #save": "accept:continue",
		"click #accept": "accept:end",
		"click #cancel": "edit:cancel"
	}

});


/*****************
*  Campaña
**/
const fetchCampaignFromDB = function(id){
	return (id ? fetchCampaignById(id) : initNewCampaign());
};
const fetchCampaignById = function(id){
	var campaign = new CampaignView({model: campaignCol.findByName(id)})
	return campaign;
};
const initNewCampaign = function(){
	return new CampaignView({model: new Campaign()});
};

const initClientDataFromCampaign = function(campaign){
	return fetchClientById(campaign.get('client'))
};


/*****************
*  CLiente
**/
const fetchClientById = function(id){
	return clientCol.findByName(id);
};

/*****************
*  Media
**/
const fetchMedia = function(id){
	if(id){
		return fetchMediaById(id);
	}else{
		return initNewMedia();
	}
};

const fetchMediaById = function(id){
	var media = new MediaView({model: mediaCol.findByName(id)});
	return media;
};

const initNewMedia = function(){
	return new MediaView({model: new Media()});
};


/*****************
*  Person Editors
**/
const showPersonEditors = function(view, model){
	console.log('[%s]showPersonEditors [%s]', view.whoami, model.whoami);
	model.renderPersons(view, "#extraeditor-hook");

	//var persons = model.getPersonCol();

};


/*****************
*  Fechas
**/
const formatDate = function(form, editor){
	var inputdata = parseDateStr(editor.getValue());
	if(inputdata){
		form.setValue({
			fecomp: inputdata.getDate() + "/" + (inputdata.getMonth()+1) + "/" + inputdata.getFullYear(),
			anio: inputdata.getFullYear(),
			quarter: (Math.floor(inputdata.getMonth() / 3) + 1)
		})
	}else{
		form.setValue({
			fecomp: 'fecha inválida'
		})		
	}
};
const parseDateStr =  function(str) {
	var mx = str.match(/(\d+)/g);
	var ty = new Date();
	if(mx.length === 0) return ty;
	if(mx.length === 1){
		if(mx[0]<0 || mx[0]>31) return null;
		else return new Date(ty.getFullYear(),ty.getMonth(),mx[0]);
	}
	if(mx.length === 2){
		if(mx[0]<0 || mx[0]>31) return null;
		if(mx[1]<0 || mx[1]>12) return null;
		else return new Date(ty.getFullYear(),mx[1]-1,mx[0]);
	}
	if(mx.length === 3){
		if(mx[0]<0 || mx[0]>31) return null;
		if(mx[1]<0 || mx[1]>12) return null;
		if(mx[2]<1000 || mx[2]>2040) return null;
		else return new Date(mx[2],mx[1]-1,mx[0]);
	}
	if(mx.length === 4){
		if(mx[0]<0 || mx[0]>31) return null;
		if(mx[1]<0 || mx[1]>12) return null;
		if(mx[2]<1000 || mx[2]>2020) return null;
		if(mx[3]<0 || mx[3]>24) return null;
		else return new Date(mx[2],mx[1]-1,mx[0],mx[3],0);
	}
	if(mx.length === 5){
		if(mx[0]<0 || mx[0]>31) return null;
		if(mx[1]<0 || mx[1]>12) return null;
		if(mx[2]<1000 || mx[2]>2020) return null;
		if(mx[3]<0 || mx[3]>24) return null;
		if(mx[4]<0 || mx[4]>60) return null;
		else return new Date(mx[2],mx[1]-1,mx[0],mx[3],mx[4]);
	}
};


/*****************
*  Form OPTIONS
**/
const setOptionsList = function(form, form_fld, opts){
	if(!opts) return;
	form.fields[form_fld].editor.setOptions(opts);
};
const setOptionsToForm = function(form, entity, entity_fld, form_fld){
	var opts = entity.get(entity_fld);
	form.fields[form_fld].editor.setOptions(opts);

};
const setOptionsSublistToForm = function(form, entity, keylookup, entity_fld, form_fld){
	var opts = entity.get(entity_fld)[keylookup];
	if(opts){
		form.fields[form_fld].editor.setOptions(opts);
	}
};





export default Marionette.View.extend({
	whoami:"SeedEdit:",
	
	initialize: function(data){
		this.form = data.form;

		this.fetchCampaignView(this.form);
		this.fetchMediaView(data.form);
		this.registerFormEvents();
	},

	registerFormEvents: function(){
		var that = this;
		this.form.on('campaign:blur', function(form, editor){
            that.campaign = fetchCampaignFromDB(editor.getValue());
			that.client = initClientDataFromCampaign(that.campaign.model);

			setOptionsToForm(form, that.campaign.model, 'temasOptionList', 'tema');
			setOptionsSublistToForm(form, that.campaign.model, form.model.get('tema'), 'subtemasOptionList', 'subtema');
			setOptionsList(form, 'section', that.media.model.get('sections') );
			setOptionsList(form, 'producto', that.client.get('products') );
			setOptionsList(form, 'area', that.client.get('areas') );

            that.showChildView("campaign",that.campaign);

		});

		this.form.on('render',function(form){
			setOptionsToForm(form, that.campaign.model, 'temasOptionList', 'tema');
			setOptionsSublistToForm(form, that.campaign.model, form.model.get('tema'), 'subtemasOptionList', 'subtema');
			setOptionsList(form, 'section', that.media.model.get('sections') );
			setOptionsList(form, 'producto', that.client.get('products') );
			setOptionsList(form, 'area', that.client.get('areas') );
		});

		this.form.on('tema:blur', function(form, editor){
			setOptionsSublistToForm(form, that.campaign.model, editor.getValue(), 'subtemasOptionList', 'subtema');
		});


		this.form.on('fecomp:blur', function(form, editor){
			formatDate(form, editor);
		});

		this.form.on('media:blur', function(form, editor){
            that.media = fetchMedia(editor.getValue());
            setOptionsList(form, 'section', that.media.model.get('sections') );

            that.showChildView("media",that.media);
		});

	},

	fetchMediaView: function(form){
		this.media = fetchMedia(form.model.get('media'));

	},

	fetchCampaignView: function(form){
		this.campaign = fetchCampaignFromDB(form.model.get('campaign'));
		this.client = initClientDataFromCampaign(this.campaign.model);
	},

	template: template,

	regions: {
		form: "#form-hook",
		media: "#media-hook",
		buttons: "#buttons-hook",
		campaign: "#campaign-hook",
		extraeditor: "#extraeditor-hook",
	},
	
	events:{
		"click #vocero": "addVocero",
		"click #autor": "addAutor",

	},

	childViewEvents:{
		"accept:continue" : "acceptContinue",
		"accept:end" : "acceptEnd",
		"edit:cancel": "editCancel"
	},

	addVocero: function(e){
		console.log('Person button click'),
		this.triggerMethod('add:person:editor', 'vocero');
	},
	
	addAutor: function(e){
		console.log('Person button click'),
		this.triggerMethod('add:person:editor', 'autor');
	},

	editCancel: function(e){
		this.triggerMethod('edit:cancel', this, this.form);
	},

	acceptContinue: function(e){
		this.triggerMethod('accept:continue', this, this.form);
	},

	acceptEnd: function(e){
		this.triggerMethod('accept:end', this, this.form);
	},



	closeView: function(e){
		e.preventDefault();
		e.stopPropagation();
		this.triggerMethod("seed:view:close");

	},

	onRender: function(){
		//var btn_view = new ButtonView();

		this.showChildView("media",this.media);
		this.showChildView("campaign",this.campaign);
		this.showChildView("buttons", new ButtonView());
		this.showChildView("form",this.form);
		showPersonEditors(this, this.form.model);
		//Message.warning('Inline Message',btn_view.$(".notify-alert") );
	}

});

