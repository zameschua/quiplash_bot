class Question {
	constructor(questionText) {
		this.questionText = questionText;
		this.answers = [];
		this.players = [];
		this.numberOfAnswers = 0;
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
		return (this.answers.length == 2);
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
}

module.exports = Question;