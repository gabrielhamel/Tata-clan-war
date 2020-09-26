const dotenv = require('dotenv');
const Discord = require('discord.js');
const getenv = require('getenv');

dotenv.config();

const bot = new Discord.Client();

const targets = JSON.parse(getenv('TARGET_ROLE'));
const message = getenv('MESSAGE');
const command = getenv('COMMAND');
const authorizedRoles = JSON.parse(getenv('AUTHORIZED_ROLE'));
const timeout = getenv('TIMEOUT_MILLIS');

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

    let targetMembers = {};
    for (let target of targets) {
        try {
            const role = await obj.guild.roles.fetch(target);
            const members = role.members;
            members.forEach((obj, key) => {
                if (obj.user.bot !== true) {
                    targetMembers[key] = obj;
                }
            });
        } catch (err) {
            console.log(err);
        }
    }

    Object.keys(targetMembers).forEach((key, i) => {
        setTimeout(() => {
            targetMembers[key].send(message)
            .catch(err => console.log(err));
        }, i * timeout);
    });
});

bot.login(getenv('CLIENT_ID'));
