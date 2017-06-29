import Marionette from "backbone.marionette";
import Backbone from "backbone";
import LayOutView from "./AppLayOutView";
import AppRouter from "./AppRouter";

export default Marionette.Application.extend({
	region: "#app",

	onStart() {
		console.log("App:start onStart");

		var appRouter = new AppRouter();
		
		var layout = new LayOutView();

		console.log("App:start onStart showView");
		this.showView(layout);

		// Default route: /#inicio
		console.log("App:start onStart BacboneHistory");
		if(!Backbone.history.start()){

			Backbone.history.navigate("#inicio");
			appRouter.controller.showLanding();
		}
		

	}
});
