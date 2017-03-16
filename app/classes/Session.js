class Session {
	constructor(chatId) {
		this.chatId = chatId;
		this.players = [];
		this.questionQueue = [];
		/* Phases
		-1: There is no game running
		0: Registration phase
		1: Answering phase
		2: Voting phase
		*/
		this.phase = -1;
	}

	// Send a message to the session
	sendMessage(message) {
		bot.sendMessage(this.chatId, message);
	}

/* METHODS FOR SESSION FLOW CONTROL */

	start() {
		this.startRegistrationPhase();
	}

	end() {
		;
	}

	getPhase() {
		return this.phase;
	}

	startRegistrationPhase() {
		var self = this;
		this.phase = 0;

		this.sendMessage("The game is starting in 60 seconds! Get all your friends!");
	
		setTimeout(function() {
			self.sendMessage("The game is startng in 30 seconds!")
		}, 3000);

		setTimeout(function() {
			if (self.getNumberOfPlayers() >=3 ) {
				self.startAnsweringPhase();
			} else {
				self.sendMessage("Insufficient players!");
				sessions.endSession(this.chatId);
			}
		}, 6000);
	}

	startAnsweringPhase() {
		this.phase = 1;
		this.assignQuestions();
		this.sendMessage("Alright I've sent out the questions! May the funniest man win.");
		console.log(this.players[0]);	
	}

	assignQuestions() {
		console.log("assigning questions");
	}

	endAnsweringPhase() {
		console.log("Ending answering phase");
	}

	startVotingPhase() {
		console.log("Starting voting phase");
	}

	endVotingPhase() {
		console.log("Starting voting phase");
	}

	printResults() {
		console.log("Printing results");
	}

/* METHODS FOR PLAYERS */

	// Returns true if player is already in the game
	hasPlayer(player) {
		console.log(this.players.includes(player));
		return this.players.includes(player);
	}

	// Add a new player to the game
	addPlayer(player) {
		player.addSession(this);
		this.players.push(player);
	}

	getNumberOfPlayers() {
		return this.players.length;
	}

}

module.exports = Session;