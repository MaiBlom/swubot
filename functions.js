const { sRoles, cRoles } = require('./roles.js');

module.exports = (bot) => {
  module.generateGameMessage = () => {
    sRoles.forEach((role) => {
      bot.channels.cache
        .get('749414294487302254')
        .send(`React below to get the \`\`${role}\`\` role!`)
        .then((s) => {
          s.react('✔');
        });
    });
  };
  module.generateColourMessage = () => {
    cRoles.forEach((role) => {
      bot.channels.cache
        .get('749419361109934182')
        .send(`React below to get the \`\`${role}\`\` role!`)
        .then((s) => {
          s.react('✔');
        });
    });
  };
  module.generateRoleMessage = (role) => {
    bot.channels.cache
      .get('749414294487302254')
      .send(`React below to get the \`\`${role}\`\` role!`)
      .then((s) => {
        s.react('✔');
      });
  };
};
