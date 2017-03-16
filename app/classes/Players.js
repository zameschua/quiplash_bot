const Player = require("./Player.js");

class Players {
	constructor() {
		this.players = {};
	}

	addPlayer(userId, userName) {
		var player = new Player(userId, userName);
		this.players[userId] = player;

		return player;
	}

	hasPlayer(userId) {
		if (this.players[userId] === undefined) {
			return false;
		} else {
			return true;
		}
	}

	getPlayerById(userId) {
		return this.players[userId];
	}
}



module.exports = Players;