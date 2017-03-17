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
		this.phase = -1;
	}

	getPhase() {
		return this.phase;
	}

	startRegistrationPhase() {
		var self = this;
		this.phase = 0;

		this.sendMessage("The game is starting in 60 seconds! Get all your friends!");
	
		setTimeout(function() {
			self.sendMessage("The game is starting in 30 seconds!")
		}, 3000);

		// Check if there is sufficient number of players (3) to start a game
		setTimeout(function() {
			if (self.getNumberOfPlayers() >=3 ) {
				self.startAnsweringPhase();
			} else {
				self.sendMessage("Insufficient players!");
				self.end();
				console.log(self);
			}
		}, 6000);
	}

	startAnsweringPhase() {
		this.phase = 1;
		this.assignQuestions();
		this.sendMessage("Alright I've sent out the questions! May the funniest man win.");
	}

	assignQuestions() {
		// Shuffle the players
		this.players = this.shuffleArray(this.players);
		
		if (this.questionQueue.length === 0) {
			this.questionQueue.concat(questionBank);
		}
		
		for (var i = 0; i < this.players.length; i++) {
			var player = this.players[i];
			var question1 = new Question(this.questionQueue[0]);
			var question2 = new Question(this.questionQueue[1]);
			player.addQuestion(question1);
			player.addQuestion(question2);
			// For the odd players
			if (i % 2 === 1) {
				this.questionQueue.shift();
				this.questionQueue.shift();
			}
		}


		// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!FOR TESTING ONLY
	    console.log(this);
	    console.log(this.players);
	}

	shuffleArray(array) {
		  var currentIndex = array.length;
		  var temporaryValue;
		  var randomIndex;

		  // While there remain elements to shuffle...
		  while (0 !== currentIndex) {

		    // Pick a remaining element...
		    randomIndex = Math.floor(Math.random() * currentIndex);
		    currentIndex -= 1;

		    // And swap it with the current element.
		    temporaryValue = array[currentIndex];
		    array[currentIndex] = array[randomIndex];
		    array[randomIndex] = temporaryValue;
		  }

		  return array;
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