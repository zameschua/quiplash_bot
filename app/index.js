const TelegramBot = require('node-telegram-bot-api');
const Player = require("./classes/Player.js");
const Players = require('./classes/Players.js');
const Session = require("./classes/Session.js");
const Sessions = require("./classes/Sessions.js");
const Question = require("./classes/Question.js");
const questionBank = require("../data/questionBank.js");

const token = '355394768:AAGVadKJpIv1I3GsNmu08Em9pz_g1MG-GaU';
const bot = new TelegramBot(token, {polling: true});
const botUserObject = bot.getMe();
const sessions = new Sessions();
var players = new Players(); 

bot.on('message', function(message) {
    const messageType = message.chat.type;

    if (messageType === 'group') {
        parseGroupMessage(message);
    } else if (messageType === 'private') {
        parsePrivateMessage(message);
    }
});

bot.on('callback_query', function(callbackQuery) {
    parseCallbackQuery(callbackQuery);
});

function parseGroupMessage(message) {
    const chatId = message.chat.id;
    const userId = message.from.id;
    const userName = message.from.first_name;
    const messageText = message.text;

    // If the user used inline command to talk to Quiplash_Bot
    if (messageText.split('@')[1] === 'Quiplash_Bot') {
        // Tell user to start a chat first if he has not done so
        if (!players.hasPlayer(userId)) {
            bot.sendMessage(chatId, "Hi " + userName + "! Please start a chat with me first! @Quiplash_Bot");
        } else {
            switch(messageText) {
                case '/start@Quiplash_Bot':
                    startGame(chatId, userId);
                    break;
                case '/join@Quiplash_Bot':
                    joinGame(chatId, userId);
                    break;
                default: ;
            }
        }
    }
}

function parsePrivateMessage(message) {
    const userId = message.from.id;
    const userName = message.from.first_name;
    const messageText = message.text;

    switch(messageText) {
        case '/start':
            startChat(userId, userName);
            break;
        default: 
            var player = players.getPlayerById(userId);
            if (player.isAnsweringQuestions()) {
                player.receiveAnswer(messageText, bot);
            }
            break;
    }
}

function parseCallbackQuery(callbackQuery) {
    const chatId = callbackQuery.message.chat.id;
    const voteResult = parseInt(callbackQuery.data); // Either 1 or 0
    const voterName = callbackQuery.from.first_name;
    const session = sessions.getSessionById(chatId);
    const question = session.getQuestions()[0]

    if (voteResult === 0 && !question.playerHasVoted(voterName)) {
        question.addFirstVote(voterName);
    } else if (voteResult === 1 && !question.playerHasVoted(voterName)){
        question.addSecondVote(voterName);
    }
}
// --------------------- GROUP MESSAGE FUNCTiONS --------------------------
function startGame(chatId, userId) {
    var session;
    const player = players.getPlayerById(userId);
    // If session already exists
    if (sessions.hasSession(chatId)) {
        session = sessions.getSessionById(chatId);
        // If session is inactive
        if (session.getPhase() === -1) { // Games is not running, player not in game
            startRegistrationPhase(session);
            session.addPlayer(player);
        } else if (session.getPhase() === 0 && !session.hasPlayer(player)) { // Game is in registration phase, player not in game
            session.addPlayer(player);
            bot.sendMessage(session.getChatId(), player.getName() + " has joined the game!");
        } else if (session.getPhase() === 0 && session.hasPlayer(player)) { // Game is in registration phase, player is in game
            bot.sendMessage(session.getChatId(), player.getName() + " is already in the game!");
        // If there is already an active session
        } else {
            bot.sendMessage(chatId, "Please wait for the current game to end!");
            return;
        }
    // Session does not exist
    } else {
        // Create new session
        session = sessions.createSession(chatId);
        startRegistrationPhase(session);
    }
}

function joinGame(chatId, userId) {
    const player = players.getPlayerById(userId);
    var session = sessions.getSessionById(chatId);

    // If the user has not initiated a chat with the bot
    if (session === undefined) {
        bot.sendMessage(chatId, "Please start a game first!");
    // If the game has not started
    } else if (session.getPhase() === -1) {
        bot.sendMessage(chatId, "Please start a new game!");
    // If a game is running / not yet started (not in registration phase);
    } else if (session.getPhase() > 0) {
        bot.sendMessage(chatId, "Please wait till the current round is over!");
    // If player is already in the game
    } else if (session.hasPlayer(player)) {
        bot.sendMessage(chatId, player.getName() + " is already in the game!");
    } else {
        session.addPlayer(player);
        bot.sendMessage(session.getChatId(), player.getName() + " has joined the game!");
    }
}

// -------------------- PRIVATE MESSAGE FUNCTIONS -------------------------
function startChat(userId, userName) {
    // Create new player if player does not exist
    if (!players.hasPlayer(userId)) {
        players.addPlayer(userId, userName);

        bot.sendMessage(userId, "Hi " + userName + "! Add me to a group chat and have fun!");
    }
}

//---------------------------------FLOW CONTROL FUNCTIONS
function startRegistrationPhase(session) {
    session.setPhase(0);

    bot.sendMessage(session.getChatId(), "The game is starting in 60 seconds! Get all your friends!");

    setTimeout(function() {
        bot.sendMessage(session.getChatId(), "The game is starting in 30 seconds!");
    }, 30000);

    // Check if there is sufficient number of players (3) to start a game
    setTimeout(function() {
        if (session.getNumberOfPlayers() >=3 ) {
            startAnsweringPhase(session);
        } else {
            bot.sendMessage(session.getChatId(), "Insufficient players!");
            endSession(session);
        }
    }, 60000);
}

function startAnsweringPhase(session) {
    session.setPhase(1);
    session.assignQuestions();
    session.sendQuestions(bot);
    bot.sendMessage(session.getChatId(), "Alright I've sent out the questions! You have 90 seconds to answer 2 questions. May the funniest man win!");
    setTimeout(function() {
        bot.sendMessage(session.getChatId(), "Final 30 seconds!");
    }, 50000);
    setTimeout(function() {
        bot.sendMessage(session.getChatId(), "10 seconds to submit your answers!");
    }, 80000);
    setTimeout(function() {
        startVotingPhase(session);
    }, 90000);
}

function startVotingPhase(session) {
    session.setPhase(2);
    bot.sendMessage(session.getChatId(), "Voting time!");
    voteNextQuestion(session);
}

function voteNextQuestion(session) {
    if (session.hasQuestions()) {
        const question = session.getQuestions()[0];
        const answer1 = question.getFirstAnswer();
        const answer2 = question.getSecondAnswer();
        const replyMarkup = {reply_markup:
                                {inline_keyboard: 
                                    [
                                        [{text: answer1, callback_data: "0"}], 
                                        [{text: answer2, callback_data: "1"}]
                                    ], 
                                }
                            };

        bot.sendMessage(session.getChatId(), "Question: " + question.getQuestionText(), replyMarkup);

        setTimeout(function() {
            revealVotes(session);
            session.shiftQuestion();
        }, 10000);
        setTimeout(function() {
            voteNextQuestion(session);
        }, 15000);

    } else {
        endSession(session);
    }
}

function revealVotes(session) {
    const question = session.getQuestions()[0];
    const firstAnswer = question.getFirstAnswer();
    const firstPlayer = question.getFirstPlayer();
    const firstVoters = question.getFirstVotersAsString();
    const secondAnswer = question.getSecondAnswer();
    const secondPlayer = question.getSecondPlayer();
    const secondVoters = question.getSecondVotersAsString();

    bot.sendMessage(session.getChatId(), "Question: " + question.getQuestionText() + "\n\n" + firstPlayer + ": " + firstAnswer + "\nVotes: " + firstVoters + "\n\n" + secondPlayer + ": " + secondAnswer + "\nVotes:" + secondVoters); 
}

function endSession(session) {
    bot.sendMessage(session.getChatId(), "Thanks for playing!");
    session.setPhase(-1);
    session.clearPlayers();
    session.getPlayers().forEach(function(player) {
        player.removeFromSession();
    });
}
