class Question {
	constructor(questionText) {
		this.question = questionText;
		this.answers = []; // Answer Object
	}

	getQuestionText() {
		return this.questionText;
	}

	addAnswer(newAnswer) {
		// Throw an error if taking in more than 2 answers
		console.assert(this.answers.length < 2, "Too many questions");
		this.answers.push(newAnswer);
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