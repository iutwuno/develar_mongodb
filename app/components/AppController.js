import $ from "jquery";
import LandingView from "./landing/LandingView";
import UserRouter from "./user/UserRouter";
import ProductionRouter from "./production/ProductionRouter";

const userRouter = new UserRouter();
const productionRouter = new ProductionRouter();
	
//console.log('constructor [%s] len: [%s]', user2.get('displayName'), userCol.length);

var AppController = {
	showLanding: function(){
		console.log("AppController:showLanding");
		var landing = new LandingView();
		landing.render();
		$("#appcontent").html(landing.$el);
	},

	loadUserModule: function(){
		console.log("AppController:loadUserModule");
		userRouter.controller.loadModule(function(view){
			$("#appcontent").html(view.$el);
		});
	},

	loadProductionModule: function(){
		console.log("AppController:loadProductionrModule");
		productionRouter.controller.loadModule(function(view){
			$("#appcontent").html(view.$el);
		});
	},

};

export default AppController;