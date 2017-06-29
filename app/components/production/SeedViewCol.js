import Mn from "backbone.marionette";
//import template from '../../templates/production/seedView.jst';
//import SeedView from "./SeedView";
//import Seed from "./Seed";
import _ from "underscore";

var table = `
<thead class="thead-inverse">
  <tr>
    <th>código</th>
    <th>fecha</th>
    <th>campaña</th>
    <th>medio</th>
    <th>título</th>
    <th>acciones</th>
  </tr>
</thead>
<tbody></tbody>
`;

var tablerow = `
<td><a href="#eventos/ver/<%- cnumber %>"><%- cnumber %></a></td>
<td><%- fecomp %></td>
<td><%- campaign_data.slug %></td>
<td><%- media %></td>
<td><%- slug %></td>
<td><a  alt="editar" title="editar" href="#eventos/editar/<%- cnumber %>"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a></td>




`;

var RowView = Mn.View.extend({
	whoami:"RowView:SeedViewCol:",
	tagName: "tr",
	template: _.template(tablerow),
  
	events:{
		"click a": "seedSelected"
	},
  
	seedSelected: function(e){
		this.triggerMethod("seed:row", this);
	}  
});

var TableBody = Mn.CollectionView.extend({
	whoami:"TableBody:SeedViewCol:",

	tagName: "tbody",

	childView: RowView,

	childViewEvents:{
		"seed:row": "seedSelected"
	},
  
	seedSelected: function(view){
		this.triggerMethod("seed:selected", view);
	},



});


var TableView = Mn.View.extend({
	whoami:"TableView:SeedViewCol:",

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
		"seed:selected": "seedSelected"
	},

	seedSelected: function(view){
		this.triggerMethod("seed:selected", view);
	},

	onChildviewSeedSelected: function(e){
	},

	onChildviewChildviewSeedRow: function(e){
	},

  
	onRender: function() {
		this.showChildView("body", new TableBody({
			collection: this.collection
		}));
		this.triggerMethod("seed:col:render");
	}

});



export default TableView;

