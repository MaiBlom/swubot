const { gRoles, mRoles, cRoles } = require('./roles.js');

module.exports = {
    generateGameMessages: function(bot, channel) {
        bot.channels.cache.get(channel).send(`**Game roles:**`);
        gRoles.forEach((role) => {
          bot.channels.cache
            .get(channel)
            .send(`React below to get the \`\`${role}\`\` role!`)
            .then((s) => {
              s.react('✔');
              //s.react('❌');
            });
        });
        bot.channels.cache.get(channel).send(`\u200B`);
    },

    generateColourMessages : function(bot, channel) {
        bot.channels.cache.get(channel).send(`**Colour roles:**`);
        cRoles.forEach((role) => {
          bot.channels.cache
            .get(channel)
            .send(`React below to get the \`\`${role}\`\` role!`)
            .then((s) => {
              s.react('✔');
              //s.react('❌');
            });
        });
        bot.channels.cache.get(channel).send(`\u200B`);
    },

    generateMiscMessages : function(bot, channel) {
        bot.channels.cache.get(channel).send(`**Misc. roles:**`);
        mRoles.forEach((role) => {
          bot.channels.cache
            .get(channel)
            .send(`React below to get the \`\`${role}\`\` role!`)
            .then((s) => {
              s.react('✔');
              //s.react('❌');
            });
        });
        bot.channels.cache.get(channel).send(`\u200B`);
    },

    generateRoleMessage : function(bot, role, channel) {
        bot.channels.cache
          .get(channel)
          .send(`React below to get the \`\`${role}\`\` role!`)
          .then((s) => {
            s.react('✔');
            //s.react('❌');
        });
    },

    generateAmongUsVoteMessage : function(bot, channel) {
        bot.channels.cache
          .get(channel)
          .send(`\`\`\`python\n    | I live| 2 Impostors| 1 Impostor   |
          +-------+-------------+-------------+
          | 3     | DØD         | ALTID Stem  |
          | 4     | DØD         | Ikk Stem    |
          | 5     | ALTID Stem  | Stem        |
          | 6     | ALTID Stem  | Stem        |
          | 7     | Ikk Stem    | Situational |
          | 8     | Situational | Situational |
          | 9     | Situational | Situational |
          | 10    | Situational | Situational |
          +-------+-------------+-------------+\`\`\``);
    },

    generateAmongUsSettingsMessage : function(bot, channel) {
        bot.channels.cache
          .get(channel)
          .send(`Impostors: 2
          Confirm ejects: OFF
          Emergency Meetings: 1
          Emergency Cooldown: 20s
          Discussion Time: 15s
          Vote: 120s
          Player Speed: 1.0x
          Crewmate Vision: 0.5x
          Impostor Vision: 1.5x
          Kill Cooldown: 30s
          Kill Distance: Short
          Task Bar Updates: Meetings
          Visual Tasks: Off
          Common Tasks: 2
          Long Tasks: 2
          Short Tasks: 5`);
    },

    generateHelpMessage : function(bot, channel) {
        bot.channels.cache
          .get(channel)
          .send(`\`\`\`
          &amongus vote --Vote rules diagram
          &amongus settings --Recommended Game Settings
          \`\`\``)
    },

    generateModHelpMessage : function(bot, channel) {
        bot.channels.cache
          .get(channel)
          .send(`\`\`\`
          &amongus <vote|settings> -- Print vote|settings recommendations for Among Us
      
          &delMsg <amount of messages to delete>  -- Bulk delete message (max 14 days old)
      
          &invite -- Prints invite link
      
          &roleGen <role> -- Print specific role 'react -> role apply' message
          &gameGen -- Print all game role 'react -> role apply' messages
          &colourGen -- Print all colour role 'react -> role apply' messages
          &miscGen -- Print all miscellaneous role 'react -> role apply' messages 
          &allGen  -- Print all role 'react -> role apply' messages
          \`\`\``)
    },

    generateInviteLinkMessage: function(bot, channel) {
        bot.channels.cache
          .get(channel)
          .send(`https://discord.gg/ap4c7CcJxa`);
    }
};