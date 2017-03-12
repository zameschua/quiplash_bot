class Question {
	constructor(questionText) {
		this.question = questionText;
		this.answers = [];
		this.players = [];
		this.numberOfAnswers = 0;
	}

	getQuestionText() {
		return this.questionText;
	}

	addAnswer(answer, player) {
		this.answers.push[answer];
		this.players.push[player]
	}

	hasBeenAnswered() {
		return (this.answers.length == 2);
	}

	getFirstAnswer() {
		return this.answers[0];
	}

	getSecondAnswer() {
		return this.answers[1];
	}
}

module.exports = Question;