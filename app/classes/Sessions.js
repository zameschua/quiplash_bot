class Sessions {
	constructor() {
		this.sessions = {};
	}

	// Return true if the chat has an active session
	hasActiveSession(chatId) {
		if (this.sessions[chatId] === undefined) {
			return false;
		} else {
			return true;
		}
	}

	getSession(chatId) {
		return this.sessions[chatId];
	}

	startSession(chatId, session) {
		this.sessions[chatId] = session;
	}

	endSession(chatId) {
		delete this.sessions[chatId];
	}

}

module.exports = Sessions;