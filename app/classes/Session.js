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

	getQuestions() {
		return this.questions;
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

    	// Populate the questionQueue if there is not enough questions
   	    if (this.questionQueue.length <= this.getNumberOfPlayers()) {
   		    this.populateAndShuffleQuestionQueue();
    	}
	    
	    for (var i = 0; i < this.getNumberOfPlayers(); i++) {
	        var player = this.players[i];
	        var question1 = new Question(this.questionQueue[i]);
	        var question2 = new Question(this.questionQueue[(i+1) % this.getNumberOfPlayers()]);
	        player.addQuestion(question1);
	        player.addQuestion(question2);
	        this.questions.push(question1); // Keep a record of the questions being answered
	    }

	    // Remove the used questions from this.questionQueue and put into this.questions
	    for (var i = 0; i < this.getNumberOfPlayers(); i++) {
	    	this.questionQueue.shift();
	    }
	}

	populateAndShuffleQuestionQueue() {
		this.questionQueue = this.questionQueue.concat(questionBank);
		shuffleArray(this.questionQueue);
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
		this.players.forEach(function(player) {
			player.sendQuestions(bot);
		});
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


