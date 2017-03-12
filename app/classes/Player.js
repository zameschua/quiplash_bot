class Player {
	constructor(name) {
		this.name = name;
		this.activeSession = null;
		this.activeQuestions = [];
	}

	getName() {
		return this.name;
	}

	addActiveSession(session) {
		this.activeSession = session;
	}

	getActiveSession() {
		return this.activeSession;
	}

	addQuestion(question) {
		this.activeQuestions.push(question);
	}
}

module.exports = Player;