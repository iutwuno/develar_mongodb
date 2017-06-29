import Mn from "backbone.marionette";
import UserController from "./UserController";

var UserRouter = Mn.AppRouter.extend({
	controller: UserController,

	appRoutes: {
		"usuarios/alta": "userCreate",
		"usuarios/editar/:id": "userEdit",
		"usuarios/consulta": "showUserList",
		"usuarios/ver/:id": "showUserDetails"
	}
});

export default UserRouter;