import Backbone from "backbone";
import _ from "underscore";

var updateUserData = function(model, cb){
	console.log("UPDATE User [%s]", model.whoami);
	//var user = col.findByName(model.get("username"));
	//user.set(model.attributes);
	model.save(model.attributes, {
		success: function(model){
			console.log('update success [%s]', model.get('username'))
			cb(model);
		},

		error: function(err){
			console.log('[%s] update error [%s]', that.whoami, err);

		}
	});
};


var initNewUser = function(user){
	if(!user.get('displayName')) user.set('displayName', user.get('username'));
	if(!user.get('name'))        user.set('name', user.get('username'));
	if(!user.get('estado_alta')) user.set('estado_alta','pendaprobacion');
	delete user._id;
	
	return user;
}

var UserManager = {
	whoami: "UserManager:",

	addUser: function(model, cb){
		var that = this;
		var user = initNewUser(new User(model.attributes));

		console.log("[%s] addUser  [%s] [%s]",this.whoami, user.url, user.urlRoot);
		user.save(null, {
			success: function(user){
				console.log('callback invocado!!!!!!!!')
				cb(user);
			},

			error: function(err){
				console.log('[%s] addUser error [%s]', that.whoami, err);

			}
		});

		// user.save( {error: function(model){
		// 	 	console.log('error');
		// 	 }},
		// 	 {success: function(model){
		// 	 	console.log('success');
		// 	 }}
		// );

	},

	updateUser: function(model, cb){
		updateUserData(model, cb);
	},

	factoryNewUser: function(){
		return new UserNew();

	},
	fetchAllUsers: function(cb){
		var col = new UserCol();
		col.fetch({
			success: function(){
				cb(col);
			},
			error: function(){
				cb();
			}
		});
	}
};

var User = Backbone.Model.extend({

	whoami: "User:User.js: ",
	urlRoot: "/api/usuarios/signup",

	idAttribute: "_id",

	validate: function(attrs /*[, options ] */) {
		var errors = {};

		if (_.has(attrs,"username") && ! attrs.username) {
			errors.username = "Usuario: No puede ser nulo";
		}

		if (_.has(attrs,"displayName") && ! attrs.displayName) {
			errors.displayName = "Saludo: No puede ser nulo";
		}

		// if( ! _.isEmpty(errors)){
		// 	return errors;
		// }
	},

	schema: {
		username:       {type: "Text", title: "Nombre de usuario", editorAttrs:{placeholder : "sera su identificación como usuario"},validators:["required"]},
		name:           {type: "Text", title: "Nombre completo", editorAttrs:{placeholder : "nombre y apellido"}, validators:["required"]},

		mail:           {type: "Text", title: "Correo electrónico", editorAttrs:{placeholder : "sera su correo de contacto"}, validators:[
                            {type:"required", message:"Favor ingrese el dato"},{type:"email", message:"no es una dirección válida"}]},


		displayName:    {type: "Text", title: "Nombre saludo", editorAttrs:{placeholder : "sera utilizado como saludo"}, validators:["required"]},
		description:    {type: "Text", title: "Ocupación e Intereses", editorAttrs:{placeholder : "cuéntenos brevemente sobre Usted"}},
		password:       {type: "Password", title: "Clave de acceso", validators:["required"] },
		passwordcopia:  {type: "Password", title: "Reingrese clave", validators:[
                            {type:"match", message:"Las claves no coinciden", field:"password"}]},


/**                            
		mail:           {type: "Text", title: "Reingrese correo", editorAttrs:{placeholder : "sera su correo de contacto"}, validators:[
                            {type:"required", message:"Favor ingrese el dato"},{type:"email", message:"no es una dirección válida"},{type:"match",field:"username",message:"Los correos no coinciden"}]},

        //termsofuse:      {type: 'Radio',title: '¿Acepta condicones de uso?',options: [{label:'Acepto',val:'Aceptoval'},{label:'NoAcepto',val:'NoAceptoval'}] },

		termsofuse:      {type: "Checkbox",options: [{val:"Aceptado", label:"Aceptado"}] , title:"Acepto términos y condiciones de uso del sitio", validators:["required"] },
**/
	},

	defaults : {
		_id: null,
		username: "",
		name: "",
		mail: "",
		password: "",

		displayName: "",
		description: "",
		cellphone: "",

		grupo: "default",
		roles:['user'],

		fealta: "",
		termsofuse: "",
		estado_alta:"pendaprobacion",
		verificado: {
			mail:false,
			feaprobado: null,
			adminuser: "",
		},
	}
});


var UserNew = Backbone.Model.extend({

	whoami: "UserNew:User.js ",
	//urlRoot: "/api/usuario/signup",
	//urlRoot: "/usuarios",

	idAttribute: "_id",

	validate: function(attrs /*[, options ] */) {
		var errors = {};

		if (_.has(attrs,"username") && ! attrs.username) {
			errors.username = "Usuario: No puede ser nulo";
		}

		if (_.has(attrs,"displayName") && ! attrs.displayName) {
			errors.displayName = "Saludo: No puede ser nulo";
		}

		// if( ! _.isEmpty(errors)){
		// 	return errors;
		// }
	},

	schema: {
		username:       {type: "Text", title: "Nombre de usuario", editorAttrs:{placeholder : "sera su identificación como usuario"},validators:["required"]},

		mail:           {type: "Text", title: "Correo electrónico", editorAttrs:{placeholder : "sera su correo de contacto"}, validators:[
                            {type:"required", message:"Favor ingrese el dato"},{type:"email", message:"no es una dirección válida"}]},

		password:       {type: "Password", title: "Clave de acceso", validators:["required"] },

	},

	defaults : {
		_id: null,
		username: "",
		name: "",
		password: "",

	}
});

var UserCol = Backbone.Collection.extend({

	model: User,

	url: "/api/usuarios",
	
	findByName: function(name){

		return this.findWhere({username: name});
	}

});



export  {User, UserCol, UserManager};

