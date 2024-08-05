const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
const { MessageEmbed } = require('discord.js');

const config = require('./config.json');
let autoLineChannels = require('./channels.json');

client.login(process.env.token);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  console.log(`Code by TGR Studio`);
  console.log(`https://discord.gg/nYdQy3qz`);
});

var http = require('http');
http.createServer(function(req, res) {
  res.write("I'm alive");
  res.end();
}).listen(8080);

client.on('message', message => {
  if (message.author.bot) return;

  if (message.content === '!line' && message.member.hasPermission('ADMINISTRATOR')) {
    const channelId = message.channel.id;
    let embed;

    if (autoLineChannels.includes(channelId)) {
      autoLineChannels = autoLineChannels.filter(id => id !== channelId);
      embed = new MessageEmbed()
        .setColor('#FF0000')
        .setTitle('❌ Channel Update')
        .setDescription('This channel has been removed from the auto line channels.');
    } else {
      autoLineChannels.push(channelId);
      embed = new MessageEmbed()
        .setColor('#00FF00')
        .setTitle('✅ Channel Update')
        .setDescription('This channel has been added to the auto line channels.');
    }

    message.channel.send(embed)
      .catch(console.error);

    fs.writeFile('./channels.json', JSON.stringify(autoLineChannels, null, 4), err => {
      if (err) console.error(err);
    });
  }

  if (autoLineChannels.includes(message.channel.id)) {
    message.channel.send({ content: config.imageUrl })
      .catch(console.error);
  }
});

// code by wick studio