import {elements} from './base';

export const getInput = () => elements.searchInput.value;


/***************************/
/**** Rendering results ****/
/***************************/

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
	// render results of current page
	const start = (page - 1) * resPerPage;
	const end = (page) * resPerPage;
	
	recipes.slice(start, end).forEach(el => renderRecipe(el));
	
	// render pagination buttons
	renderButton(page, recipes.length, resPerPage);
}; 

const renderRecipe = (recipe) => {
	const markup = `
	<li>
		<a class="results__link" href="#${recipe.recipe_id}">
			<figure class="results__fig">
				<img src="${recipe.image_url}" ${recipe.title}">
            </figure>
        	<div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
				<p class="results__author">${recipe.publisher}</p>
            </div>
         </a>
     </li>
	`;
	
	elements.searchResultList.insertAdjacentHTML('beforeend', markup);
};

export const limitRecipeTitle = (title, limit = 17) => {
	const newTitle = [];
	
	if (title.length > limit) {
		title.split(' ').reduce((acc, cur) => {
			if (acc + cur.length <= limit) {
				newTitle.push(cur);
			}
			return acc + cur.length;
		}, 0); // acc starts with 0
		
		return `${newTitle.join(' ')} ...`;
	} 
	
	return title;
};

const renderButton = (currentPage, numResults, resPerPage) => {
	const pages = Math.ceil(numResults / resPerPage);
	
	let button;
	if (currentPage === 1 && pages > 1) {
		// Only "Next" button
		button = createButton(currentPage, 'next');
		
	} else if (currentPage === pages && pages > 1) {
		// Only "Back" button
		button = createButton(currentPage, 'prev');
		
	} else if (currentPage < pages) {
		// Both "Next" and "Back" buttons
		button = `
			${createButton(currentPage, 'prev')}
			${createButton(currentPage, 'next')}
		`;
	}
	elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

// type: 'prev' or 'next'
const createButton = (page, type) => `
	<button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
		<span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
		<svg class="search__icon">
			<use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' :'right'}"></use>
		</svg>
		
	</button>
`;

/**************************/
/**** Clearing results ****/
/**************************/

export const clearInput = () => {
	elements.searchInput.value = '';
};

export const clearResults = () => {
	elements.searchResultList.innerHTML = '';
	elements.searchResPages.innerHTML = '';
};


/***************************************/
/**** Highlight the selected recipe ****/
/***************************************/

export const highlightSelected = id => {
	const resultsArr = Array.from(document.querySelectorAll('.results__link'));
	
	resultsArr.forEach(el => {
		el.classList.remove('results__link--active');
	});
	
	document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active');
}




