// Apply the query and export the search result

import axios from 'axios'; 

export default class Search {
	constructor(query) {
		this.query = query;
	}
	
	async getResults() {
		try {
			// Axios same as fetch but it is accepted by most browsers
			const res = await axios(`https://forkify-api.herokuapp.com/api/search?q=${this.query}`);
			this.result = res.data.recipes;

		} catch (error) {
			alert(error);
		}

	}
}

