class Player {
	constructor(name, id) {
		this.name = name;
		this.id = id;
		this.points = 0;
	}

	getName() {
		return this.name;
	}

	getId() {
		return this.id;
	}

	getPoints() {
		return this.points;
	}

	// Increments the points by amount
	addPoints(amount) {
		this.points += amount;
	}
}

module.exports = Player;