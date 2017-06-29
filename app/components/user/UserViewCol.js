import Mn from "backbone.marionette";
//import template from '../templates/userView.jst';
//import UserView from "./UserView";
//import User from "./User";
import _ from "underscore";

var table = `
<thead class="thead-inverse">
  <tr>
    <th>Usuario</th>
    <th>Nombre</th>
    <th>Avatar</th>
    <th>mail</th>
  </tr>
</thead>
<tbody></tbody>
`;
var tablerow = `
<td><a href="#usuarios/ver/<%- username %>"><%- username %></a></td>
<td><%- name %></td>
<td><%- displayName %></td>
<td><%- mail %></td>

`;

var RowView = Mn.View.extend({
	whoami:"RowView:UserViewCol:",
	tagName: "tr",
	template: _.template(tablerow),
  
	events:{
		"click a": "userSelected"
	},
  
	userSelected: function(e){
		//console.log("RowViewShowUser: [%s]", this.model.get("username"));
		this.triggerMethod("user:row", this);
	}  
});

var TableBody = Mn.CollectionView.extend({
	whoami:"TableBody:UserViewCol:",

	tagName: "tbody",

	childView: RowView,

	childViewEvents:{
		"user:row": "userSelected"
	},
  
	userSelected: function(view){
		this.triggerMethod("user:selected", view);
	},



});


var TableView = Mn.View.extend({
	whoami:"TableView:UserViewCol:",

	tagName: "table",

	className: "table table-striped",
	
	template: _.template(table),

	regions: {
		body: {
			el: "tbody",
			replaceElement: true
		}
	},

	childViewEvents:{
		"user:selected": "userSelected"
	},

	userSelected: function(view){
		console.log("[%s] user:selected [%s]", this.whoami, view.model.get("username"));
		this.triggerMethod("user:selected", view);
	},

	onChildviewUserSelected: function(e){
		console.log("[%s] onChildviewUserSelected [%s]", this.whoami, arguments.length);
	},

  
	onRender: function() {
		this.showChildView("body", new TableBody({
			collection: this.collection
		}));
		this.triggerMethod("user:col:render");
	}

});



export default TableView;

