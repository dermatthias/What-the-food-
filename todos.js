// what the food? javascript madness

$(document).ready(
    function() {
	
	// the meal model
	window.Meal = Backbone.Model.extend(
	    {
		// constructor
		initialize: function() {		
		    this.set({
				 mealid: 'm_' + this.cid		 
			     });
		},

		// gets called every time when set() is called
		validate: function(attrs) {
		    console.log(attrs);
		}
	    });


	// the collection of meals
	window.MealCollection = Backbone.Collection.extend(
	    {
		model: Meal,
		
		initialize: function() {
		    // to stuff here   
		}
		
	    });
	
	window.Meals = new MealCollection();

	// DEMO: create a meal and add it to the meals
	var burger = new Meal(
	    {
		name: 'Burger',
		day: 'Wednesday',
		ingredients: ['meat', 'bread', 'salad']
	    });
	Meals.add(burger);

	
	// the View
	window.View = Backbone.View.extend(
	    {
		
		
	    });
    });



// jQuery functions
$(document).ready(
    function(){
	
	// enter listener on input fields
	$("input[name=meal_ingredient]").keydown(
	    function(event){
		if (event.keyCode == '13') {
		    console.log("enter keydown on element " + event.srcElement.name);
		}	
	    });

    });