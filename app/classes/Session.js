class Session {
	constructor(chatId) {
		this.chatId = chatId;
		this.users = [];
		this.questionStack = [];
	}

	getUsers() {
		return this.users;
	}

	getChatId() {
		return this.chatId;
	}

	startNewGame() {
		;
	}
}

module.exports = Session;