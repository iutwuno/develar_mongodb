import Mn from "backbone.marionette";
import ProductionController from "./ProductionController";

var ProductionRouter = Mn.AppRouter.extend({
	controller: ProductionController,

	appRoutes: {
		"eventos/alta": "seedCreate",
		"eventos/editar/:id": "seedEdit",
		"eventos/consulta": "showSeedList",
		"eventos/ver/:id": "showSeedDetails"
	}
});

export default ProductionRouter;