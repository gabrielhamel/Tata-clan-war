const dotenv = require('dotenv');
const Discord = require('discord.js');
const getenv = require('getenv');

dotenv.config();

const bot = new Discord.Client();

const targets = JSON.parse(getenv('TARGET_ROLE'));
const message = getenv('MESSAGE');
const command = getenv('COMMAND');
const authorizedRoles = JSON.parse(getenv('AUTHORIZED_ROLE'));

bot.on('message', async obj => {
    if (!obj.guild) {
        return;
    }

    if (obj.content !== command) {
        return;
    }

    if (!obj.member._roles.find(role => authorizedRoles.includes(role))) {
        obj.reply('Vous n\'avez pas les droits nécessaires');
        return;
    }

    obj.react('✅');

    targets.forEach(target =>
        obj.guild.roles.fetch(target)
        .then(role =>
            role.members.forEach(member => member.send(message)
        )
    ));
});

bot.login(getenv('CLIENT_ID'));
