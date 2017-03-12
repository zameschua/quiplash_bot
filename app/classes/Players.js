const Player = require("./Player.js");

class Players {
	constructor() {
		this.players = {};
	}

	addPlayer(userId, userName) {
		var newPlayer = new Player(userName);
		this.players[userId] = Player;

		return newPlayer;
	}

	hasPlayer(userId) {
		if (this.players.userId === undefined) {
			return false;
		} else {
			return true;
		}
	}

	getPlayer(userId) {
		return this.players.userId;
	}

	addPlayerIfPlayerDoesNotExist(userId, userName) {
		if (this.hasPlayer(userId)) {
			return this.players.userId;
		} else {
			return this.addPlayer(userId, userName);
		}
	}
}



module.exports = Players;