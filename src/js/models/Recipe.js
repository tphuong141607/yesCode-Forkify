import axios from 'axios'; 

export default class Recipe {
	constructor(id) {
		this.id = id;
	}
	
	async getRecipe() {
		try {
			// Axios same as fetch but it is accepted by most browsers
			const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
			this.title = res.data.recipe.title;
			this.author = res.data.recipe.publisher;
			this.img = res.data.recipe.image_url;
			this.url = res.data.recipe.source_url;
			this.ingredients = res.data.recipe.ingredients;
		} catch (error) {
			console.log(error);
			alert('Something went wrong :(');
		}
	}
	
	calcTime() {
		// Assuming that it takes 15 mins to prep 3 ingredients
		const numIngredients = this.ingredients.length;
		const periods_15 = Math.ceil(numIngredients / 3);
		this.time = periods_15 * 15;
	}
	
	calcServings() {
		this.servings = 4;
	}
	
	parseIngredients() {
		const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
		const unitsShort = ['tbsp', 'tbsp','oz' ,'oz', 'tsp', 'tsp', 'cup', 'pound'];
		const units = [...unitsShort, 'kg', 'g']
		
		const newIngredients = this.ingredients.map(el => {
			
			let ingredient = el.toLowerCase();
			
			// 1 . Uniform units
			unitsLong.forEach((unit, i) => {
				ingredient = ingredient.replace(unit, unitsShort[i]);	
			}); 
			
			// 2. Remove parentheses
			ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');
			
			// 3. Parse ingredients into count, unit and ingredient
			
				// a) convert the ingredients into an array
			const arrIng = ingredient.split(' ');
			
				// b) find the index where the unit is located
			const unitIndex = arrIng.findIndex(el2 => units.includes(el2));
			let objIng;
			
			if (unitIndex >-1) { // There exists a unit
				const arrCount = arrIng.slice(0, unitIndex);
				objIng = {
					count: (arrCount.length === 1) ? eval(arrIng[0].replace('-', '+')) : eval(arrCount.join('+')),
					unit: arrIng[unitIndex],
					ingredient: arrIng.slice(unitIndex + 1).join(' ')
				};
				
			} else if (parseInt(arrIng[0], 10)) { // There is no Unit, but the 1st element is a number
				objIng = {
					count: parseInt(arrIng[0], 10),
					unit: '',
					ingredient: arrIng.slice(1).join(' ')
				};
				
			} else if (unitIndex === -1) { // There is No unit and No number in the 1st position
				objIng = {
					count: 1,
					unit: '',
					ingredient
				};
			}
			 
			return objIng; // the return Ingredient Object will be stored in the "newIngredients" - This is how the map method works
		});
		
		this.ingredients = newIngredients;
	}
	
	updateServings(type) { //type = + (inc) or - (dec)
		// Servings
		const newServings = (type === 'dec') ? this.servings - 1 : this.servings + 1;
		
		// Ingredients
		this.ingredients.forEach(ingredient => {
			ingredient.count *= (newServings / this.servings); 	
		});
		
		this.servings = newServings;
	}
}

