class Session {
	constructor(chatId, player) {
		this.chatId = chatId;
		this.players = [player];
		this.questionQueue = [];
		this.standardGameMode = true; // True for standard mode, false for wild mode
		this.gamePhase = 0; // 0 for registration phase, 1 for answer phase and 2 for voting phase
	}

	// Send a message to the session
	sendMessage(bot, message) {
		bot.sendMessage(this.chatId, message);
	}

	// Returns true if player is already in the game
	hasPlayer(player) {
		return this.players.includes(player);
	}

	// Add a new player to the game
	addPlayer(player) {
		this.players.push[player];
	}

	getNumberOfPlayers() {
		return this.players.length;
	}

	questionPhase(bot) {
		this.generateQuestions();
		this.assignQuestions();
	}

	generateQuestions() {
		for (var i = 0; i < this.getNumberOfPlayers(); i++) {
			var question = new Question("sup");
			questionQueue.push(question);
		}
	}

	assignQuestions() {
		// Each question needs 2 players,
		// Each player neerds 2 questions
	}

	votingPhase(bot) {
		;
	}
}

module.exports = Session;