const Discord = require('discord.js');
require('dotenv').config();

const bot = new Discord.Client({ partials: ['MESSAGE', 'REACTION'] });
const { gRoles, mRoles, cRoles } = require('./roles.js');

function generateGameMessages(channel) {
  gRoles.forEach((role) => {
    bot.channels.cache
      .get(channel)
      .send(`React below to get the \`\`${role}\`\` role!`)
      .then((s) => {
        s.react('✔');
      });
  });
}

function generateColourMessages(channel) {
  cRoles.forEach((role) => {
    bot.channels.cache
      .get(channel)
      .send(`React below to get the \`\`${role}\`\` role!`)
      .then((s) => {
        s.react('✔');
      });
  });
}

function generateMiscMessages(channel) {
  mRoles.forEach((role) => {
    bot.channels.cache
      .get(channel)
      .send(`React below to get the \`\`${role}\`\` role!`)
      .then((s) => {
        s.react('✔');
      });
  });
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

  bot.user.setActivity('5.5D Chess', { type: 'PLAYING' });

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
  const msgMemberRole = msg.member.roles.cache.find((role) => role.name === 'Moderator').name;

  if (msgMemberRole.valueOf() === 'Moderator' && input[0] === 'roleGen' && input.length > 1) {
    input.shift();
    const role = input.join(' ');
    generateRoleMessage(role, msgChannel);
    return;
  }
  if (msgMemberRole.valueOf() === 'Moderator' && input[0] === 'gameGen' && input.length === 1) {
    generateGameMessages(msgChannel);
    return;
  }
  if (msgMemberRole.valueOf() === 'Moderator' && input[0] === 'colourGen' && input.length === 1) {
    generateColourMessages(msgChannel);
    return;
  }
  if (msgMemberRole.valueOf() === 'Moderator' && input[0] === 'miscGen' && input.length === 1) {
    generateMiscMessages(msgChannel);
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
