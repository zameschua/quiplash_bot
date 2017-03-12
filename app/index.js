const TelegramBot = require('node-telegram-bot-api');
const Player = require("./classes/Player.js");
const Players = require('./classes/Players.js');
const Session = require("./classes/Session.js");
const Sessions = require("./classes/Sessions.js");
const Question = require("./classes/Question.js");
const questionBank = require("../data/questionBank.js");

const token = '355394768:AAGVadKJpIv1I3GsNmu08Em9pz_g1MG-GaU';
const bot = new TelegramBot(token, {polling: true});

var sessions = new Sessions();
var players = new Players(); 

bot.on('message', function(message) {
    const messageType = message.chat.type;
    
    // FOR TESTING ONLY
    console.log(message);
    console.log(players);
    console.log(sessions);

    if (messageType === 'group') {
        parseGroupMessage(message)
    } else if (messageType === 'private') {
        parsePrivateMessage(message)
    }
});


function parseGroupMessage(message) {
    const chatId = message.chat.id;
    const userId = message.from.id;
    const userName = message.from.first_name;
    const messageText = message.text;
    console.log(messageText);
    switch(messageText) {
        case '/start':
            startGame(chatId, userId, userName);
            break;
        case '/start@Quiplash_Bot':
            startGame(chatId, userId, userName);
            break;
        case '/join':
            joinGame(chatId, userId, userName);
            break;
        default: ;
    }

}

// TO DO
function parsePrivateMessage(message) {
    const chatId = message.chat.id;
    const userId = message.from.id;

}


// -------------------- GROUP MESSAGE FUNCTiONALITIES --------------------

function startGame(chatId, userId, userName) {
    // If chat is already in a game
    if (sessions.hasActiveSession(chatId)) {
        bot.sendMessage(chatId, "Eh bro you all already started a game la, don't blur leh");
    } else {
        // Initialise a new session
        var player = players.addPlayerIfPlayerDoesNotExist(userId, userName);
        var session = new Session(chatId, player);
        sessions.startSession(chatId, session);

        session.sendMessage(bot, "Eh bros unite! 60 seconds faster join game!");
        
        setTimeout(function() {
            session.sendMessage(bot, "Eh bro, you all got 30 more seconds to join, don't say we bojio.");
        }, 30000);

        setTimeout(function() {
            // if not enough players , cancel game
            if (session.getNumberOfPlayers() < 3) {
                session.sendMessage(bot, "Get more people leh");
            } else {
                session.questionPhase(bot);
            }
        }, 60000);
    }
}

function joinGame(chatId, userId, userName) {
    // If the session for this chat is running
    if (sessions.hasActiveSession(chatId)) {
        var session = sessions.getSession(chatId);

        // Check if user is already in the game
        if (session.hasPlayer(userId)) {
            session.sendMessage(bot, "You already join the game la nabei");
        } else {
            // Add player to database if he's not in yet
            var player = players.addPlayerIfPlayerDoesNotExist(userId, userName);

            // Link up player and session
            player.addActiveSession(chatId);
            sessions.getSession(chatId).addPlayer(player);
        }
    } else {
        bot.sendMessage(chatId, "/start a game first leh! Don't blur la bro");
    }
}
