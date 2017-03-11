const TelegramBot = require('node-telegram-bot-api');
const Player = require("./classes/Player.js");
const Question = require("./classes/Question.js");
const Answer = require("./classes/Answer.js");
const questionBank = require("../data/questionBank.js");


const token = '355394768:AAGVadKJpIv1I3GsNmu08Em9pz_g1MG-GaU';
const bot = new TelegramBot(token, {polling: true});


// Executes when a new user types /start to the bot
bot.onText(/start/, (msg, match) => {

  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "started");
});

bot.onText(/help/, (msg, match) => {

  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "help");
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  console.log(msg);
  bot.sendMessage(chatId, questionBank[5]);
});