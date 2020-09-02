const Discord = require('discord.js');
require('dotenv').config();

const bot = new Discord.Client({ partials: ['MESSAGE', 'REACTION'] });

const sRoles = [
  'DJ',
  'Total War',
  'Artist',
  'Rocket League',
  'TFT',
  'Mount & Blade',
  'For Honor',
  'Among Us',
  'SCP',
  'League of Legends',
  'Minecraft',
  'TF2',
  'Hearthstone',
  'Deceit',
  'Arma',
  'Stellaris',
  'Tarkov',
  'Switch',
  'Rimworld',
  'Valorant',
  'Brawlhalla',
  'Overwatch',
  'GTA',
  'CSGO',
  'Civilization',
  'World of Warcraft',
  'Rainbow Six Siege',
  'Anno',
  'Screeps',
  'Brætspil',
];
const cRoles = ['Green', 'Blue', 'Red', 'Orange', 'Purple', 'Yellow', 'Light Blue', 'Brown', 'Black', 'Grey', 'White', 'Pink'];

function generateGameMessage() {
  sRoles.forEach((role) => {
    bot.channels.cache
      .get('749414294487302254')
      .send(`React below to get the\`\` ${role} \`\`role!`)
      .then((s) => {
        s.react('✔');
      });
  });
}

function generateColourMessage() {
  cRoles.forEach((role) => {
    bot.channels.cache
      .get('749419361109934182')
      .send(`React below to get the\`\` ${role} \`\`role!`)
      .then((s) => {
        s.react('✔');
      });
  });
}

function generateRoleMessage(role) {
  bot.channels.cache
    .get('749414294487302254')
    .send(`React below to get the\`\` ${role} \`\`role!`)
    .then((s) => {
      s.react('✔');
    });
}

bot.on('ready', () => {
  console.log(`Connected as ${bot.user.id}`);

  bot.user.setActivity('5D Chess', { type: 'PLAYING' });

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
  if (msg.channel.id === '749414294487302254' && msg.author.id === '743270304880787488' && input[0] === 'gameGen' && input.length === 1) {
    generateGameMessage();
  }
  if (msg.channel.id === '749419361109934182' && msg.author.id === '743270304880787488' && input[0] === 'colourGen') {
    generateColourMessage();
  }
  if (msg.channel.id === '749414294487302254' && msg.author.id === '743270304880787488' && input[0] === 'roleGen' && input.length > 1) {
    generateRoleMessage(input[1]);
  }
});

bot.on('messageReactionAdd', async (reaction, user) => {
  if (user.bot) return;
  const member = reaction.message.guild.members.cache.get(user.id);
  const { guild } = reaction.message;
  let addedRole;
  let role;

  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      console.error(`Couldn't fetch the message: ${error}`);
      return;
    }
  }

  const reactedMessage = reaction.message.content.split(' ');

  if (reactedMessage.length === 7) {
    addedRole = reactedMessage[5];
  } else if (reactedMessage.length === 8) {
    addedRole = reactedMessage[5] + ' ' + reactedMessage[6];
  } else if (reactedMessage.length === 9) {
    addedRole = reactedMessage[5] + ' ' + reactedMessage[6] + ' ' + reactedMessage[7];
  }

  guild.roles.cache.forEach((roles) => {
    if (roles.name === addedRole) {
      role = roles;
    }
  });

  if (!role) {
    console.log('No role supplied');
  }

  console.log(
    `${reaction.message.author.tag}'s message "${reaction.message.content}" gained a reaction by ${user.tag}! Reacted with ${reaction._emoji}  & added the role ${addedRole}`
  );
  member.roles.add(role);
});

bot.on('messageReactionRemove', async (reaction, user) => {
  if (user.bot) return;
  const member = reaction.message.guild.members.cache.get(user.id);
  const { guild } = reaction.message;
  let addedRole;
  let role;

  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      console.log("Couldn't fetch the message: ", error);
      return;
    }
  }

  const reactedMessage = reaction.message.content.split(' ');

  if (reactedMessage.length === 7) {
    addedRole = reactedMessage[5];
  } else if (reactedMessage.length === 8) {
    addedRole = reactedMessage[5] + ' ' + reactedMessage[6];
  } else if (reactedMessage.length === 9) {
    addedRole = reactedMessage[5] + ' ' + reactedMessage[6] + ' ' + reactedMessage[7];
  }

  guild.roles.cache.forEach((roles) => {
    if (roles.name === addedRole) {
      role = roles;
    }
  });

  if (!role) {
    console.log('No role supplied');
  }

  console.log(`${reaction.message.author.tag}'s message "${reaction.message.content}" lost a reaction by ${user.tag}! Removed ${reaction._emoji} & removed the role ${addedRole}`);
  member.roles.remove(role);
});

bot.login(process.env.BOTTOKEN);
