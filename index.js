const Discord = require('discord.js');
require('dotenv').config();
const { sRoles, cRoles } = require('./roles.js');

const bot = new Discord.Client({ partials: ['MESSAGE', 'REACTION'] });
const { generateGameMessage, generateColourMessage, generateRoleMessage } = require('./functions.js');

bot.on('ready', () => {
  console.log(`Connected as ${bot.user.id}`);

  bot.user.setActivity('4D Chess', { type: 'PLAYING' });

  bot.guilds.cache.forEach((guild) => {
    console.log(guild.name);

    bot.channels.cache.forEach((channel) => {
      console.log(` - ${channel.name} ${channel.type} ${channel.id}`);
    });

    console.log('\nRoles:');
    guild.roles.cache.forEach((roles) => {
      console.log(` - ${roles.name} ${roles.id}`);
    });
  });
});

bot.on('message', (msg) => {
  const input = msg.content.split(' ');
  console.log(msg.member.roles.cache.get());
  const isAuthorMod = msg.member.roles.cache.forEach((role) => {
    if (role.name === 'Moderator') {
      return true;
    }
    return false;
  });

  console.log(isAuthorMod);

  if (isAuthorMod && input[0] === 'gameGen' && input.length === 1) {
    generateGameMessage();
  }
  if (isAuthorMod && input[0] === 'colourGen') {
    generateColourMessage();
  }
  if (isAuthorMod && input[0] === 'roleGen' && input.length > 1) {
    const roleInput = input.shift;
    console.log(roleInput);
    generateRoleMessage(roleInput);
  }
});

bot.on('messageReactionAdd', async (reaction, user) => {
  if (user.bot) return;
  const member = reaction.message.guild.members.cache.get(user.id);
  const { guild } = reaction.message;

  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      console.error(`Couldn't fetch the message: ${error}`);
      return;
    }
  }

  const reactedMessage = reaction.message.content.split('``');
  const roleToBeAdded = guild.roles.cache.find((role) => role.name === reactedMessage[1].trim());

  if (!roleToBeAdded) {
    console.log('No role supplied');
  } else {
    console.log(
      `${reaction.message.author.tag}'s message "${reaction.message.content}" lost a reaction by ${user.tag}! Removed ${
        reaction.emoji
      } & removed the role ${reactedMessage[1].trim()}`
    );
    member.roles.add(roleToBeAdded);
  }
});

bot.on('messageReactionRemove', async (reaction, user) => {
  if (user.bot) return;
  const member = reaction.message.guild.members.cache.get(user.id);
  const { guild } = reaction.message;

  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      console.log("Couldn't fetch the message: ", error);
      return;
    }
  }

  const reactedMessage = reaction.message.content.split('``');
  const roleToBeRemoved = guild.roles.cache.find((role) => role.name === reactedMessage[1].trim());

  if (!roleToBeRemoved) {
    console.log('No role supplied');
  } else {
    console.log(
      `${reaction.message.author.tag}'s message "${reaction.message.content}" lost a reaction by ${user.tag}! Removed ${
        reaction.emoji
      } & removed the role ${reactedMessage[1].trim()}`
    );
    member.roles.remove(roleToBeRemoved);
  }
});

bot.login(process.env.BOTTOKEN);
