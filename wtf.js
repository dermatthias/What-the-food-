// what the food? javascript madness
// hallo jonas!

$(document).ready(
    function() {

	// the meal model
	window.Meal = Backbone.Model.extend(
	    {
		initialize: function () {
		    this.set(
			{
			    meal_id: 'm_' + this.cid
			});
		},

		// gets called every time before set() and save() 
		validate: function (attrs) {
		    // if (!attrs.meal_name) {
		    // 	return "validation error";
		    // }
		    return "errooooorrrr";
		},

		delete: function () {
		  this.destroy();
		}
	    });


	// the collection of meals
	window.MealCollection = Backbone.Collection.extend(
	    {
		model: Meal,
		localStorage: new Store("whatthefood"),

		initialize: function() {

		},

		gen_id: function () {
		  if (!this.length)
		      return 1;
		  return this.last().get('order') + 1;
		}
	    });

	window.Meals = new MealCollection();


	// the FixView
	window.FixView = Backbone.View.extend(
	    {

		tagName: "div",
		className: "meal_fix",

		template: $("#fix_template").html(),

		initialize: function(args) {
		    _.bindAll(this, 'render');
		    this.model.bind('change', this.render);
		    this.model.bind('remove', function () {this.remove();});
		},

		events: {
		    "click span.meal_delete": "delete"
		},

		render: function() {
		    // set content of view with Mustache Templates
		    $(this.el).html(Mustache.to_html(this.template, this.model.toJSON()));

		    // important for chaining!
		    return this;
		},

		// removes the model and removes this view associated with it
		delete: function () {		    
		    this.model.delete();
		}

	    });

	// the main app view
	window.AppView = Backbone.View.extend(
	    {

		el: $("#main"),

		initialize: function () {
		    // get the input fields from the html page
		    this.input_name = this.$("input[name=meal_name]");
		    // can be more than one
		    this.input_ingredient = this.$("input[name=meal_ingredient]");
		    this.input_day = this.$("input[name=meal_day]");

		    // binding managing functions for adding, deleting...
		    _.bindAll(this, 'add_meal', 'reload_data', 'render');
		    Meals.bind('add', this.add_meal);
		    Meals.bind('refresh', this.reload_data);

		    // re-render app on all changes
		    //Meals.bind('all', this.render);

		    // load all previous data with backbone.sync
		    Meals.fetch();

		},

		events: {
		    "keypress input[name=meal_name]": "keypress_create_meal",
		    "keypress input[name=meal_day]": "keypress_create_meal",
		    "keypress button#input_enter": "keypress_create_meal",
		    "click button#input_enter": "click_create_meal"
		},

		render: function () {
		  // TODO: add new ingredient input on enter event in this field

		},


		meal_values: function () {
		    return {
			meal_name: this.input_name.val(),
			meal_ingredient: this.input_ingredient.val(),
			meal_day: this.input_day.val()
		    };
		},

		click_create_meal: function (e) {
		    this.create_meal();
		},

		keypress_create_meal: function (e) {
		    if (e.keyCode != 13) return;
		    this.create_meal();
		},
		
		create_meal: function () {
		    // create new Meal model, get values from inputs
		    var foo = Meals.create(this.meal_values());
		    console.log(foo);
		    
		    // clear input fields
		    this.input_name.val('');
		    this.input_ingredient.val('');
		    this.input_day.val('');
		},

		add_meal: function(meal) {
		    // create FixView, call render function of it
		    // and append result to the page
		    var view = new FixView({model: meal})
		    // add new meal to #all_meals
		    this.$("#all_meals").append(view.render().el);

		},

		reload_data: function() {
		    Meals.each(this.add_meal);
		}

	    });


	window.Ctrl = Backbone.Controller.extend(
	    {

	    });


	// create app
	window.App = new AppView;
    });