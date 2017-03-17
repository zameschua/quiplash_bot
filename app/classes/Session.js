const Question = require("./Question.js");

class Session {
	constructor(chatId) {
		this.chatId = chatId;
		this.players = [];
		this.questionQueue = []; // To help ensure that questions asked are more random
		this.questions = []; // Keep a record of the questions being answered
		/* Phases
		-1: There is no game running
		0: Registration phase
		1: Answering phase
		2: Voting phase
		*/
		this.phase = -1;
	}

	getChatId() {
		return this.chatId;
	}

/* METHODS FOR SESSION FLOW CONTROL */

	getPhase() {
		return this.phase;
	}

	setPhase(newPhase) {
		this.phase = newPhase;
	}

	assignQuestions() {
	    // Shuffle the players
	    this.players = shuffleArray(this.players);
	    
	    for (var i = 0; i < this.players.length; i++) {
	   	    if (this.questionQueue.length <= 1) {
	   		    this.populateAndShuffleQuestionQueue();
	    	}
	        var player = this.players[i];
	        var question1 = new Question(this.questionQueue[0]);
	        var question2 = new Question(this.questionQueue[1]);
	        player.addQuestion(question1);
	        player.addQuestion(question2);
	        // For the odd players
	        if (i % 2 === 1) {
	        	// Remove questions that have been answered from the queue
	            this.questionQueue.shift();
	            this.questionQueue.shift();
	            // Keep a record of the questions that are being answered
	            this.questions.push(question1);
	            this.questions.push(question2);
	        }
	    }
	    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!FOR TESTING ONLY
	    console.log(this);
	    console.log(this.players);
	    console.log(this.questions);
	}

	populateAndShuffleQuestionQueue() {
		this.questionQueue = this.questionQueue.concat(questionBank);
		shuffleArray(this.questionQueue);
		console.log(this.questionQueue);
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

	sendQuestions(bot) {
		for (var i in this.players) {
			this.players[i];
			this.players[i].sendQuestions(bot);
		}
	}
}

function shuffleArray(array) {
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


module.exports = Session;


