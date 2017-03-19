class Question {
	constructor(questionText) {
		this.questionText = questionText;
		this.answers = [];
		this.players = [];
		this.numberOfAnswers = 0;
		this.firstVotes = [];
		this.secondVotes = [];
	}

	getQuestionText() {
		return this.questionText;
	}

	addAnswer(answer, player) {
		this.answers.push(answer);
		this.players.push(player);
		this.numberOfAnswers += 1;
	}

	hasBeenAnswered() {
		return (this.answers.length === 2);
	}

	getFirstAnswer() {
		if (this.answers[0] === undefined) {
			return "This faggot did not leave an answer"
		} else {
			return this.answers[0];
		}
	}

	getSecondAnswer() {
		if (this.answers[1] === undefined) {
			return "This faggot did not leave an answer"
		} else {
			return this.answers[1];
		}
	}

	getFirstPlayer() {
		if (this.answers[0] === undefined) {
			return "unknown faggot";
		} else {
			return this.players[0].getName();
		}
	}

	getSecondPlayer() {
		if (this.answers[1] === undefined) {
			return "unknown faggot";
		} else {
			return this.players[1].getName();
		}
	}

	addFirstVote(voterName) {
		this.firstVotes.push(voterName);
	}

	getFirstVotersAsString(voterName) {
		var result = "";
		this.firstVotes.forEach(function(name) {
			result = result.concat(name + " ");
		});
		return result;
	}

	addSecondVote(voterName) {
		this.secondVotes.push(voterName);
	}

	getSecondVotersAsString(voterName) {
		var result = "";
		this.secondVotes.forEach(function(name) {
			result = result.concat(name + " ");
		});
		return result;
	}

	playerHasVoted(playerName) {
		return (this.firstVotes.includes(playerName) || this.secondVotes.includes(playerName));
	}
}

module.exports = Question;