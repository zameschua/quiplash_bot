const Session = require("./Session.js");

class Sessions {
	constructor() {
		this.sessions = {};
	}

	startSession(chatId) {
		var session = new Session(chatId);
		this.sessions[chatId] = session;
		return session;
	}

	endSession(chatId) {
		this.sessions[chatId].end();
	}

	// Return true if the chat has a session
	hasSession(chatId) {
		if (this.sessions[chatId] === undefined) {
			return false;
		} else {
			return true;
		}
	}

	getSessionById(chatId) {
		return this.sessions[chatId];
	}
}

module.exports = Sessions;