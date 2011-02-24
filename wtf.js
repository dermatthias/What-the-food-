// what the food? javascript madness

$(document).ready(
    function() {

	// the meal model
	window.Meal = Backbone.Model.extend(
	    {

		localStorage: new Store("whatthefood"),
				
		initialize: function () {
		    this.set(
			{
			    meal_id: 'm_' + this.cid
			});
		},

		// gets called every time before set() and save() 
		validate: function (attrs) {
		    // not really working, backbone bug?
		    // get's called too often...
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
		    this.model.bind('add', this.render);
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
		    _.bindAll(this, 'add_meal', 'reload_data', 'render', 'error_handler');
		    Meals.bind('add', this.add_meal);
		    Meals.bind('refresh', this.reload_data);
		    Meals.bind('error', this.error_handler);

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
		    
		    var val = {
			meal_name: this.input_name.val(),
			meal_ingredient: this.input_ingredient.val(),
			meal_day: this.input_day.val()
		    };
		    
		    // custom validation
		    if (val.meal_name != "" && val.meal_day != "")			
			return val;	    
		    return false;
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
		    var values = this.meal_values();
		    if (!values) {
			Meals.trigger("error");
			return false;
		    }
		    Meals.create(values);
		    
		    // alternative model add method:
		    // var new_meal = new Meal();
		    // new_meal.save(this.meal_values(), 
		    // 		  {success: this.save_success_handler});

		    // clear input fields
		    this.input_name.val('');
		    this.input_ingredient.val('');
		    this.input_day.val('');
		    
		    return true;
		},
		
		save_success_handler: function (model, response) {
		    // add to collection
		    Meals.add(response);
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
		},

		error_handler: function () {
		    // TODO:
		    // view for error messages
		}

	    });


	window.Ctrl = Backbone.Controller.extend(
	    {

	    });


	// create app
	window.App = new AppView;
    });