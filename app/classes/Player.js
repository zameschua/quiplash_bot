const bot = require("../index.js");

class Player {
	constructor(userId, name) {
		this.name = name;
		this.userId = userId; // UserId = private chat Id
		this.session = null;
		this.questions = [];
	}

	sendMessage(message) {
		bot.send(this.privateChatId, message);
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

/* MANAGE QUESTIONS */
	addQuestion(question) {
		this.activeQuestions.push(question);
	}
}

module.exports = Player;