const Discord = require('discord.js');
require('dotenv').config();

const bot = new Discord.Client({ partials: ['MESSAGE', 'REACTION'] });
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
  const input = msg.content.split(' ');
  const msgChannel = msg.channel.id;
  const msgMemberRole = msg.member.roles.cache.find((role) => role.name === 'Moderator');

  console.log(msgMemberRole);

  try {
    if (msgMemberRole.name.valueOf() === 'Moderator' && input[0] === '!roleGen' && input.length > 1) {
      msg.delete();
      input.shift();
      const role = input.join(' ');
      generateRoleMessage(role, msgChannel);
      return;
    }
    if (msgMemberRole.name.valueOf() === 'Moderator' && input[0] === '!gameGen' && input.length === 1) {
      msg.delete();
      generateGameMessages(msgChannel);
      return;
    }
    if (msgMemberRole.name.valueOf() === 'Moderator' && input[0] === '!colourGen' && input.length === 1) {
      msg.delete();
      generateColourMessages(msgChannel);
      return;
    }
    if (msgMemberRole.name.valueOf() === 'Moderator' && input[0] === '!miscGen' && input.length === 1) {
      msg.delete();
      generateMiscMessages(msgChannel);
    }
    /*if (msgMemberRole.name.valueOf() === 'Moderator' && input[0] === '!msgDel' && input.length === 2) {
      msg.delete();
      input.shift();
      let msgDelAmount = parseInt(input, 10);
      for(msgDelAmount; msgDelAmount > 0; msgDelAmount--) {
        let lm = msg.channel.lastMessage;
        bot.channels.cache.get(msgChannel).send(msgDelAmount);
        lm.delete();
      }
    }*/
  } catch (error) {
    console.log(error);
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
      `${reaction.message.author.tag}'s message "${reaction.message.content}" gained a reaction by ${user.tag}! Added ${reaction.emoji} & added the role ${roleToBeAdded.name}  `
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
      `${reaction.message.author.tag}'s message "${reaction.message.content}" lost a reaction by ${user.tag}! Removed ${reaction.emoji} & removed the role ${roleToBeRemoved.name}`
    );
    member.roles.remove(roleToBeRemoved);
  }
});

bot.login(process.env.BOTTOKEN);
