// Global app controller

import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Like from './models/Like';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likeView from './views/likeView';
import { elements, renderLoader, clearLoader } from './views/base';

/** Global state of the app:
* - Search object
* - Current recipe object
* - Shopping list object
* - Linked recipes
*/

const state = {}
window.state = state;


/*********************/
/* SEARCH CONTROLLER */
/*********************/

const controlSearch = async () => {
	// 1. Get the query from the searchView
	const query = searchView.getInput();
	
	if (query) {
		// 2. Create a new Search Object and add to state	
		state.search = new Search(query);
		
		// 3. Prepare UI for results (View)
		searchView.clearInput();
		searchView.clearResults();
		renderLoader(elements.searchRes);
		
		try {
			// 4. Search for recipes (Model)
			await state.search.getResults(); // async function that will return a promise

			// 5. Render results on UI (View)
			searchView.renderResults(state.search.result);
			clearLoader();
		} catch {
			alert('Something wrong with the search...');
			clearLoader();
		}
		
	}
}

elements.searchForm.addEventListener('submit', e => {
	e.preventDefault();
	controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
	// Event delegation: Event delegation allows us to attach a single event listener, to a parent element, that will fire for all descendants matching a selector, whether those descendants exist now or are added in the future
	
	const btn = e.target.closest('.btn-inline'); // closest help us get the button only, not the text or span, etc.
	if (btn) {
		const goToPage = parseInt(btn.dataset.goto, 10);
		searchView.clearResults(); 
		searchView.renderResults(state.search.result, goToPage);
	}
});


/*********************/
/* RECIPE CONTROLLER */
/*********************/

const controlRecipe = async () => {
	
	// Get ID from url
	// window.location = the entire url
	const id = window.location.hash.replace('#', '');
	
	if (id) {
		// Create new recipe object
		state.recipe = new Recipe(id);
		
		// Prepare UI for views (clear previous data, renderloader)
		recipeView.clearRecipe(); 
		renderLoader(elements.recipe);
			// Highlight selected search item
		if (state.search) {searchView.highlightSelected(id)};
		
		try {
			// Get recipe data and parse ingredients
			await state.recipe.getRecipe(); // async function that will return a promise
			state.recipe.parseIngredients();
			
			// Calculate serevings and time
			state.recipe.calcServings();
			state.recipe.calcTime();

			// Render the recipe
			clearLoader();
			recipeView.renderRecipe(
				state.recipe, 
				state.likes.isLiked(id)
			);
			
		} catch (err) {
			alert('Error processing recipe!');
		}
	}	
};

['hashchange', 'load'].forEach(e => window.addEventListener(e, controlRecipe));

/**************************/
/* RECIPE LIST CONTROLLER */
/**************************/

// add a recipe's ingredients to the shopping list
const controlList = () => {
	// Create a new list IF there is none 
	if (!state.list) state.list = new List();
	
	// Add each ingredient to the list and display all added ingredients to UI
	state.recipe.ingredients.forEach(el => {
		const item = state.list.addItem(el.count, el.unit, el.ingredient);
		listView.renderItem(item);
	});
}

// handle delete and update list events
elements.shopping.addEventListener('click', e => {
	const id = e.target.closest('.shopping__item').dataset.itemid; 
	
	// Handle the delete button
	if (e.target.matches('.shopping__delete, .shopping__delete *')) {
		// Delete from state
		state.list.deleteItem(id);
		
		// Delete from UI
		listView.deleteItem(id);
	
	// Handle the updated count of ingredients	
	} else if (e.target.matches('.shopping_count-value')) {
		const updateVal = parseFloat(e.target.value, 10);
		
		// Update and store the new "updated" count value 
		state.list.updateCount(id, updateVal);		
	}
});


/********************/
/* LIKES CONTROLLER */
/********************/

const controlLike = () => {
	if (!state.likes) state.likes = new Like();
	
	const currentID = state.recipe.id;
	
	// User hasn't liked the current recipe
	if (!state.likes.isLiked(currentID)) {
		// Add like to the state
		const newLike = state.likes.addLike(
			currentID,
			state.recipe.title,
			state.recipe.author,
			state.recipe.img,
		);
		
		// Toggle the like button
		likeView.toggleLikeBtn(true);
		
		// Add like to UI list
		likeView.renderLike(newLike);
		
		
	// User has liked the current recipe		
	} else {
		// Remove like from the state
		state.likes.deleteLike(currentID);
		
		// Toggle the like button
		likeView.toggleLikeBtn(false);
		
		// Remove like from UI list
		likeView.deleteLike(currentID);
	}
	
	likeView.toggleLikeMenu(state.likes.getNumLikes());
};


// Restore liked recipes on page load
window.addEventListener('load', () => {
	state.likes = new Like();
	state.likes.readStorage(); // restore likes
	likeView.toggleLikeMenu(state.likes.getNumLikes());
	// render existing likes
	state.likes.likes.forEach(like => likeView.renderLike(like));
});


/********************/
// Handling recipe button clicks (event delegation)
/********************/

elements.recipe.addEventListener('click', e => {
	// btn-decrease * means including all children of btn-decrease
	if (e.target.matches('.btn-decrease, .btn-decrease *')) {
		// Decrease button is clicked
		if (state.recipe.servings > 1) {
			state.recipe.updateServings('dec');
			recipeView.updateServingsIngredients(state.recipe);
		}
		
	} else if (e.target.matches('.btn-increase, .btn-increase *')) {
		// Increase button is clicked
		state.recipe.updateServings('inc');
		recipeView.updateServingsIngredients(state.recipe);
		
	} else if (e.target.matches('.recipe__btn-add, .recipe__btn-add *')) {
		// Add a recipe to the shopping list
		controlList();
		
	} else if (e.target.matches('.recipe__love, .recipe__love *')) {
		// Likes
		controlLike();
	}
	
});


 





