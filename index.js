const Discord = require('discord.js');
require('dotenv').config();

const bot = new Discord.Client({ 
  partials: ['MESSAGE', 'REACTION'],
  ws: { intents: ["GUILDS", "GUILD_MESSAGES"] } 
});
const { gRoles, mRoles, cRoles } = require('./roles.js');

function generateGameMessages(channel) {
  bot.channels.cache.get(channel).send(`**Game roles:**`);
  gRoles.forEach((role) => {
    bot.channels.cache
      .get(channel)
      .send(`React below to get the \`\`${role}\`\` role!`)
      .then((s) => {
        s.react('✔');
      });
  });
  bot.channels.cache.get(channel).send(`\u200B`);
}

function generateColourMessages(channel) {
  bot.channels.cache.get(channel).send(`**Colour roles:**`);
  cRoles.forEach((role) => {
    bot.channels.cache
      .get(channel)
      .send(`React below to get the \`\`${role}\`\` role!`)
      .then((s) => {
        s.react('✔');
      });
  });
  bot.channels.cache.get(channel).send(`\u200B`);
}

function generateMiscMessages(channel) {
  bot.channels.cache.get(channel).send(`**Misc. roles:**`);
  mRoles.forEach((role) => {
    bot.channels.cache
      .get(channel)
      .send(`React below to get the \`\`${role}\`\` role!`)
      .then((s) => {
        s.react('✔');
      });
  });
  bot.channels.cache.get(channel).send(`\u200B`);
}

function generateRoleMessage(role, channel) {
  bot.channels.cache
    .get(channel)
    .send(`React below to get the \`\`${role}\`\` role!`)
    .then((s) => {
      s.react('✔');
    });
}

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
            generateRoleMessage(role, msgChannel);
          }
          break;
        case 'gameGen':
          if (input.length === 1) {
            msg.delete();
            generateGameMessages(msgChannel);
          }
          break;
        case 'colourGen':
          if (input.length === 1) {
            msg.delete();
            generateColourMessages(msgChannel);
          }
          break;
        case 'miscGen':
          if (input.length === 1) {
            msg.delete();
            generateMiscMessages(msgChannel);
          }
          break;
        case 'msgDel':
          if (input.length === 2) {
            msg.delete();
            input.shift();
            let msgDelAmount = parseInt(input, 10);
            msg.channel.bulkDelete(msgDelAmount)
              .catch(console.error);
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
  const roleToBeAdded = guild.roles.cache.find((role) => role.name === reactedMessage[1].trim());

  if (!roleToBeAdded) {
    console.log('No role supplied');
  } else {
    console.log(
      `${reaction.message.author.tag}'s message "${reaction.message.content}" gained a reaction by ${user.tag}! Added ${reaction.emoji} & added the role ${roleToBeAdded.name}  `
    );
    member.roles.add(roleToBeAdded);
  }
});

bot.on('messageReactionRemove', async (reaction, user) => {
  if (user.bot) return;
  if (reaction.message.channel.id !== 755502310355894432) return;
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

bot.on('raw', packet => {
  console.log(packet);
  // Code taken from: https://github.com/AnIdiotsGuide/discordjs-bot-guide/blob/master/coding-guides/raw-events.md
  // We don't want this to run on unrelated packets
  if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
  // Grab the channel to check the message from
  const channel = client.channels.get(packet.d.channel_id);
  // There's no need to emit if the message is cached, because the event will fire anyway for that
  if (channel.messages.has(packet.d.message_id)) return;
  // Since we have confirmed the message is not cached, let's fetch it
  channel.fetchMessage(packet.d.message_id).then(message => {
      // Emojis can have identifiers of name:id format, so we have to account for that case as well
      const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
      // This gives us the reaction we need to emit the event properly, in top of the message object
      const reaction = message.reactions.get(emoji);
      // Adds the currently reacting user to the reaction's users collection.
      if (reaction) reaction.users.set(packet.d.user_id, client.users.get(packet.d.user_id));
      // Check which type of event it is before emitting
      if (packet.t === 'MESSAGE_REACTION_ADD') {
          client.emit('messageReactionAdd', reaction, client.users.get(packet.d.user_id));
      }
      if (packet.t === 'MESSAGE_REACTION_REMOVE') {
          client.emit('messageReactionRemove', reaction, client.users.get(packet.d.user_id));
      }
  });
})

bot.login(process.env.BOTTOKEN);
