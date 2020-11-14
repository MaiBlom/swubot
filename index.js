const Discord = require('discord.js');
var functions = require('./functions');
require('dotenv').config();

const bot = new Discord.Client({ 
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
  ws: { intents: ['GUILDS', 'GUILD_PRESENCES', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS'] }
});
const { gRoles, mRoles, cRoles } = require('./roles.js');

bot.on('ready', () => {
  console.log(`Connected as ${bot.user.id}`);
 
  bot.user.setActivity('the seasons change', { type: 'WATCHING' });

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
  if (msg.member.user.bot) return;
  let input = msg.content.split(' ');
  const msgChannel = msg.channel.id;
  let msgMemberRole = msg.member.roles.cache.find((role) => role.name === 'Moderator');
  if(typeof msgMemberRole === 'undefined') msgMemberRole = msg.guild.roles.cache.find((role) => role.name === 'Dummy');

  try {
    if (msgMemberRole.name.valueOf() === 'Moderator' && input[0].charAt(0) === '&') {
      input[0] = input[0].substring(1);
      switch (input[0]) {
        case 'roleGen':
          if (input.length > 1) {
            msg.delete();
            input.shift();
            const role = input.join(' ');
            functions.generateRoleMessage(role, msgChannel);
          }
          break;
        case 'gameGen':
          if (input.length === 1) {
            msg.delete();
            functions.generateGameMessages(msgChannel);
          }
          break;
        case 'colourGen':
          if (input.length === 1) {
            msg.delete();
            functions.generateColourMessages(msgChannel);
          }
          break;
        case 'miscGen':
          if (input.length === 1) {
            msg.delete();
            functions.generateMiscMessages(msgChannel);
          }
          break;
        case 'allGen':
          if(input.length === 1) {
            msg.delete();
            functions.generateGameMessages(msgChannel);
            functions.generateColourMessages(msgChannel);
            functions.generateMiscMessages(msgChannel);
          }
        case 'delMsg':
          if (input.length === 2) {
            msg.delete();
            input.shift();
            let msgDelAmount = parseInt(input, 10);
            msg.channel.bulkDelete(msgDelAmount)
              .catch(console.error);
          }
          break;
        case 'amongus':
          if (input.length === 2) {
            msg.delete();
            if (input[1] === 'vote') {
              functions.generateAmongUsVoteMessage(msgChannel);
            } else if (input[1] === 'settings') {
              functions.generateAmongUsSettingsMessage(msgChannel);
            }
          }
          break;
        case 'invite':
          if (input.length === 1) {
            msg.delete();
            functions.generateInviteLinkMessage(msgChannel);
          }
          break;
        case 'help':
          if (input.length === 1) {
            msg.delete();
            functions.generateModHelpMessage(msgChannel);
          }
          break;
      }
    } else if (input[0].charAt(0) === '&') {
        input[0] = input[0].substring(1);
        switch (input[0]) {
          case 'amongus':
            if (input.length === 2) {
              msg.delete();
              if (input[1] === 'vote') {
                functions.generateAmongUsVoteMessage(msgChannel);
              } else if (input[1] === 'settings') {
                functions.generateAmongUsSettingsMessage(msgChannel);
              }
            }
            break;
          case 'help':
            if (input.length === 1) {
              msg.delete();
              functions.generateHelpMessage(msgChannel);
            }
            break;
        }
    }
  } catch (error) {
    console.log(error);
  }
});

bot.on('messageReactionAdd', async (reaction, user) => {
  if (user.bot) return;
  if (reaction.message.channel.id != 755502310355894432) return;
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
  const roleToBe = guild.roles.cache.find((role) => role.name === reactedMessage[1].trim());


  if (!roleToBe) {
    console.log('No role supplied');
  } else {
    console.log(
      `${reaction.message.author.tag}'s message "${reaction.message.content}" gained a reaction by ${user.tag}! Added ${reaction.emoji} & added the role ${roleToBe.name}  `
    );
    member.roles.add(roleToBe);
  }
});

bot.on('messageReactionRemove', async (reaction, user) => {
  if (user.bot) return;
  if (reaction.message.channel.id != 755502310355894432) return;
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
      `${reaction.message.author.tag}'s message "${reaction.message.content}" lost a reaction by ${user.tag}! Removed ${reaction.emoji} & removed the role ${roleToBeRemoved.name}`
    );
    member.roles.remove(roleToBeRemoved);
  }
});

bot.login(process.env.BOTTOKEN);