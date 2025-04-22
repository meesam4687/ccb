const { Client } = require('discord.js-selfbot-v13');
const client = new Client();
const { QuickDB } = require("quick.db");
const db = new QuickDB();
require("dotenv").config()



client.on('ready', async () => {
  console.log("logged in");
})

setInterval(async () => {
    const currentHour = new Date().getHours();
    if (currentHour === 0) {
        await db.deleteAll();
    }
}, 1000);

let exceptions = [
  '852430542284914708',
  '731529079387324570',
  '585092161545175040',
  '809702164724449290'
]

let exceptionsChannel = [
  '1314261165165248542'
  ]

client.on('messageCreate', async (message) => {
  if (message.author.id === client.user.id) return;
  if (exceptions.includes(`${message.author.id}`)) return;
  if (exceptionsChannel.includes(`${message.channel.id}`)) return;
  (async () => {
    if(db.get(`messageCount_${message.author.id}`) === null) {
        await db.set(`messageCount_${message.author.id}`, 0);
    }
    let currentCount = await db.get(`messageCount_${message.author.id}`);
    await db.set(`messageCount_${message.author.id}`, currentCount+1);
    let cCountNew = await db.get(`messageCount_${message.author.id}`);
    let timeout = await db.get(`timeout_${message.author.id}`) || 0;
    if (cCountNew >= 5 && (Date.now() - timeout) < 10 * 60 * 1000) {
        message.reply(`I said padhle, go and study`);
        await db.set(`messageCount_${message.author.id}`, 0);
        await db.set(`timeout_${message.author.id}`, Date.now());
    } else if (cCountNew >= 15) {
        message.reply(`Padhle ${message.author}`);
        await db.set(`messageCount_${message.author.id}`, 0);
        await db.set(`timeout_${message.author.id}`, Date.now());
    }
  })();
});

client.login(process.env.TOKEN);

const express = require("express")()
express.all('/', function (req, res) {
  res.send("Server Running")
})
express.listen(process.env.PORT, console.log("Server Started"))
