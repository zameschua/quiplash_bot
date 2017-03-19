class Player {
	constructor(userId, name) {
		this.name = name;
		this.userId = userId; // UserId = private chat Id
		this.session = null;
		this.questions = [];
		this.questionPhase = -1;
	}

	getName() {
		return this.name;
	}

	addSession(session) {
		this.session = session;
	}

	getSession() {
		return this.session;
	}

	removeFromSession() {
		this.questions = [];
		this.session = null;
	}

/* MANAGE QUESTIONS */
	isAnsweringQuestions() {
		return this.questionPhase >= 0;
	}

	addQuestion(question) {
		this.questions.push(question);
	}

	sendQuestions(bot) {
		this.sendFirstQuestion(bot);
	}

	sendFirstQuestion(bot) {
		bot.sendMessage(this.userId, this.questions[0].getQuestionText());
		this.questionPhase = 0;
	}

	sendSecondQuestion(bot) {
		bot.sendMessage(this.userId, this.questions[1].getQuestionText());
		this.questionPhase = 1;
	}

	receiveAnswer(answer, bot) {
		this.questions[this.questionPhase].addAnswer(answer, this);
		console.log(this.questions[this.questionPhase]);
		console.log(this.questionPhase);
		if (this.questionPhase === 0) {
			this.sendSecondQuestion(bot);
		} else if (this.questionPhase === 1) {
			this.questionPhase = -1;
		}
	}
}

module.exports = Player;