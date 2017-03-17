const TelegramBot = require('node-telegram-bot-api');
const Player = require("./classes/Player.js");
const Players = require('./classes/Players.js');
const Session = require("./classes/Session.js");
const Sessions = require("./classes/Sessions.js");
const Question = require("./classes/Question.js");
const questionBank = require("../data/questionBank.js");

const token = '355394768:AAGVadKJpIv1I3GsNmu08Em9pz_g1MG-GaU';
const bot = new TelegramBot(token, {polling: true});

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


function parseGroupMessage(message) {
    const chatId = message.chat.id;
    const userId = message.from.id;
    const userName = message.from.first_name;
    const messageText = message.text;

    // FOR TESTING ONLY
    console.log(messageText);

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


// --------------------- GROUP MESSAGE FUNCTiONS --------------------------
function startGame(chatId, userId) {
    var session;
    // If session already exists
    if (sessions.hasSession(chatId)) {
        session = sessions.getSessionById(chatId);
        // If session is inactive
        if (session.getPhase() === -1) {
            ;
        // If there is already an active session
        } else {
            bot.sendMessage(chatId, "Please wait for the current game to end!");
            return;
        }
    // Session does not exist
    } else {
        // Create new session
        session = sessions.createSession(chatId);
    }

    // Add the player to the session if he's not yet in
    const player = players.getPlayerById(userId);
    if (!session.hasPlayer(player)) {
        session.addPlayer(player);
        ////////////////////////////////////////////////////////////////// ADDED PLAYER 3 TIMES FOR TESTING
        session.addPlayer(player);
        session.addPlayer(player);
    }

    startRegistrationPhase(session);
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
    }, 3000);

    // Check if there is sufficient number of players (3) to start a game
    setTimeout(function() {
        if (session.getNumberOfPlayers() >=3 ) {
            startAnsweringPhase(session);
        } else {
            bot.sendMessage(session.getChatId(), "Insufficient players!");
            end(session);
        }
    }, 6000);
}

function startAnsweringPhase(session) {
    session.setPhase(1);
    session.assignQuestions();
    session.sendQuestions(bot);
    bot.sendMessage(session.getChatId(), "Alright I've sent out the questions! You have 90 seconds to answer 2 questions. May the funniest man win!");
    setTimeout(function() {
        startVotingPhase(session);
    }, 20000);
}

function startVotingPhase(session) {
    session.setPhase(2);
}

function endSession(session) {
    session.setPhase(-1);
    session.getPlayers().forEach(function(player) {
        player.removeFromSession();
    });
}
