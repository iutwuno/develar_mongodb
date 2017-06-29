import $ from "jquery";

import Bb from "../../lib/backboneforms.js";

import {UserCol, UserManager} from "../entities/User";
import UserView from "./UserView";
import UserEdit from "./UserEdit";
import UserViewLayout from "./UserViewLayout";
import UserViewCol from "./UserViewCol";
import userEditForm from "../../templates/user/userEditForm.jst";

var whoami = "UserController:";

var Form = Bb.Form;

var userCollection,
	userLayoutView,
	userColView;


var fetchUsersFromDB = function(cb){
	var users = [
		{
			username: "jlorenzo",
			displayName:"Jorge Lorenzo",
			mail: "jlorenzo@hotmail.com",
		},
		{
			displayName:"alfredo",
			mail: "alfre.silva@hotmail.com",
			username: "alfredosilva",
			cellphone: "11 3344 3333"
		},
		{
			displayName:"Marta Lopez",
			mail: "mlopez@gmail.com",
			username: "mlopez",
			cellphone: "33 4444 5678"
		},
		{
			displayName:"Julian Buda",
			mail: "jbuda@gmail.com",
			username: "jbuda",
			cellphone: "33 888 555"
		}
	];

// console.log('FINDALL begins');
// var colTest = new  UserCol();
// colTest.fetch({
// 	success: function(){
// 		console.log('success')
// 	},
// 	error: function(){
// 		console.log('error')
// 	}
// });



	cb(new UserCol(users)) ;

};

/*********************
*  HELPER(S)
*********************/
var findUserByName = function(name){
	if(!userCollection) return null;

	return userCollection.findByName(name);
};


/*********************
*  USER LIST
*********************/
var renderUserList = function(layout, users){
	if(userColView) userColView.destroy();

	userColView = new UserViewCol({collection: users});
	// Eventos
	userColView.on("user:selected", function(view){

		renderUserView(view.model);

	});

	layout.getRegion("userlist").show(userColView.render());
	Bb.history.navigate("#usuarios/consulta");

};



/*********************
*  USER EDIT
*********************/
var initUserEdit = function(name){

	var user = findUserByName(name);
	if(user){

		editUserData(user);

	}else{
		console.log("User no encontrado");
	}
};

var editUserData = function(user){
	console.log("[%s] editUserData: BEGINS[%s]",whoami, user.get("username"));
	var form = editUserForm(user);
	renderUserForm(form);
	Bb.history.navigate("#usuarios/editar" + user.get("username"));

};

var editUserForm = function(user){
	var form = new Form({
		model: user,
		template: userEditForm
	});

	form.on("blur", function(form, editor){
		var error = form.commit();
		if(error){
			console.log("[%s] onRENDER blur: ERROR [%s]",whoami, form.model.get("username"));
		}else{
			console.log("[%s] onRENDER blur: OK [%s] Bb:[%s]",whoami, form.model.get("username"), Bb.VERSION);

			UserManager.updateUser(form.model, model => {
				
				console.log('editUser Success')
				updateLocalUserCol(model);
				renderUserList(userLayoutView, userCollection);
			});

		}
	});
	return form;
};

var updateLocalUserCol = function(model){
	userCollection.add(model);
};

var renderUserForm = function(form){
	var userForm = new UserEdit({form: form});

	userLayoutView.getRegion("useredit").show(userForm.render());
	userLayoutView.triggerMethod("user:form:show");
};


/*********************
*  USER NEW
*********************/
var createNewUser = function(){
	var user = UserManager.factoryNewUser();

	var form = factoryUserFormNew(user);
	renderUserFormModal(form);
	Bb.history.navigate("#usuarios/alta");

};

var factoryUserFormNew = function(user){
	var form = new Form({
		model: user,
	});

	form.on("blur", function(form, editor){
		var error = form.commit();
		if(error){
			console.log("[%s] onRENDER blur: ERROR [%s]",whoami, form.model.get("username"));
		}else{
			console.log("[%s] onRENDER blur: OK [%s] Bb:[%s]",whoami, form.model.get("username"), Bb.VERSION);
		}
	});
	return form;
};


var renderUserFormModal = function(form){
	var modal = new Bb.BootstrapModal({
		content: form,
		title: "Alta nuevo usuario" ,
		okText: "aceptar",
		cancelText: "cancelar",
		enterTriggersOk: false,
	});

	modal.on("ok",function(){
		var errors = form.commit({validate: true});
		if(!errors){
			//----------------------------------------------------: facet       user asking for meeting    user's mica profile  other's profile
			console.log("[%s] OK Modal [%s] Bb:[%s]",whoami, form.model.get("username"), Bb.VERSION);
			UserManager.addUser(form.model, user => {
				console.log('alta ok***************+');
				userCollection.add(user);
				renderUserList(userLayoutView, userCollection);
			});

		}else{
			console.log("Se produjo un error en la actualización de sus datos. Inténtelo nuevamente");
		}
	});

	modal.open();
};



/*********************
*  USER VIEW
*********************/
var initUserView = function(name){
	var user = findUserByName(name);
	if(user){

		renderUserView(user);

	}else{
		console.log("User no encontrado");
	}
};


var listenUserViewEvents = function(model, view){

	view.on("user:edit", function(view){
		console.log("[%s] USER VIEW listen user:edit %s] [%s]", whoami, arguments.length, model.get("username"));
		editUserData(model, view);
	});
};

var renderUserView = function(model){
	var userView = new UserView({model: model});

	listenUserViewEvents(model, userView);

	userLayoutView.getRegion("user").show(userView.render());
};


/*********************
*  USER MODULE
*********************/
var userModuleFactory = function(cb){

	UserManager.fetchAllUsers(function(usrCol){

		userCollection = usrCol;

		var layout = initModuleLayout();

		renderUserList(layout, userCollection);

		cb(layout);
	});
};

var initModuleLayout = function(){

	userLayoutView = new UserViewLayout();

	userLayoutView.getRegion("user").on("show", function(region, view, options){
		console.log("[%s] user region triggers user:view:show [%s] [%s]", whoami, arguments.length, view.whoami);
		userLayoutView.triggerMethod("user:view:show", view, region, options);
	});

	userLayoutView.getRegion("userlist").on("show", function(region, view, options){
		console.log("[%s] userlist region triggers user:list:show [%s] [%s]", whoami, arguments.length, region.whoami);
		userLayoutView.triggerMethod("user:list:show", view, region, options);
	});

	userLayoutView.on("add:new:user", function(){
		console.log("add:new:user bubbled");
		UserController.userCreate();
	});

	userLayoutView.render();

	return userLayoutView;
};

/**********************************************
           USER CONTROLLER API
***********************************************/
var UserController = {
	loadModule: function(cb){

		userModuleFactory(cb);

	},

	showUserList: function(){
		console.log("[%s] showUserList", whoami);
		Bb.history.navigate("#usuarios/consulta");
		if(!userLayoutView){
			this.loadModule(function(view){
				$("#appcontent").html(view.$el);
			});
		}else{
			userLayoutView.getRegion("userlist").show(userColView.render());
		}
	},

	showUserDetails: function(name){
		console.log("[%s] showUserDetails [%s]", whoami, name);
		if(!userLayoutView){
			this.loadModule(function(view){
				$("#appcontent").html(view.$el);
				initUserView(name);
			});
		}else{
			initUserView(name);
		}
	},

	userCreate: function(){
		console.log("[%s] userCreate ", whoami);
		if(!userLayoutView){
			this.loadModule(function(view){
				$("#appcontent").html(view.$el);
				createNewUser();
			});

		}else{
			createNewUser();
		}

	},

	userEdit: function(name){
		console.log("[%s] userEdit ", whoami);
		if(!userLayoutView){
			this.loadModule(function(view){
				$("#appcontent").html(view.$el);
				initUserEdit(name);
			});

		}else{
			initUserEdit(name);
		}

	}
};

export default UserController;