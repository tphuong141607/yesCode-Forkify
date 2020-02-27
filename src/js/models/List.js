import uniqid from 'uniqid';

export default class List {
	constructor() {
		// array of object
		this.items = [];
	}
	
	addItem(count, unit, ingredient) { // Item = recipe
		const item = {
			id: uniqid(),
			count,
			unit,
			ingredient
		}
		this.items.push(item);
		return item;
	} 
	
	deleteItem(id) {
		const index = this.items.findIndex(el => el.id === id); // for object, use findIndex instead of indexOf (used for primitive datatype only)
		this.items.splice(index, 1);
	}
	
	updateCount(id, newCount) {
		this.items.find(el => el.id === id).count = newCount;
	}
};