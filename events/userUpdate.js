const { MessageEmbed } = require('discord.js');
const { logChannel } = require('../config.js');

module.exports = {
    event: 'userUpdate',
    run: async (client, mysql, user1, user2) => {
        if(user1.username != user2.username) {
            (await client.channels.fetch(logChannel)).send({embeds:[
                new MessageEmbed().setAuthor({ name: user2.tag, iconURL: user2.displayAvatarURL() })
                .setTitle('Zmiana nicku').addField('Użytkownik', user2.toString())
                .addField('Stary nick', user1.username).addField('Nowy nick', user2.username)
                .setColor('ff77bb').setTimestamp()
            ]});
        }
        if(user1.avatar != user2.avatar) {
            (await client.channels.fetch(logChannel)).send({embeds:[
                new MessageEmbed().setAuthor({ name: user2.tag, iconURL: user1.displayAvatarURL() })
                .setTitle('Zmiana avatara').addField('Użytkownik', user2.toString()).setColor('92d2e2')
                .setThumbnail(user2.displayAvatarURL({ format: 'png', size: 256, dynamic: true })).setTimestamp()
            ]});
        }
    }
}