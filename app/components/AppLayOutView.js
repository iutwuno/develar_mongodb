import Marionette from "backbone.marionette";
import template from "../templates/layout.jst";

export default Marionette.View.extend({
	template: template,
	regions: {
		appcontent:  "#appcontent",
	}
});
