class Answer {
	constructor(user, text) {
		this.user = user;
		this.text = text;
	}

	getUser() {
		return this.user;
	}

	getText() {
		return this.text;
	}
}

module.exports = Answer;