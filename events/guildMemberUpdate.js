const { MessageEmbed } = require('discord.js');
const { publicId, logChannel } = require('../config.js');

module.exports = {
    event: 'guildMemberUpdate',
    run: async (client, mysql, member1, member2) => {
        if(member1.guild.id != publicId) return;
        if(member1.displayName != member2.displayName) {
            (await client.channels.fetch(logChannel)).send({embeds:[
                new MessageEmbed().setAuthor({ name: member2.user.tag, iconURL: member2.displayAvatarURL() })
                .setTitle('Zmiana pseudonimu').addField('Użytkownik', member2.toString())
                .addField('Stary pseudonim', member1.displayName).addField('Nowy pseudonim', member2.displayName)
                .setColor('ffff66').setTimestamp()
            ]});
        }
        if(member1.avatar != member2.avatar) {
            (await client.channels.fetch(logChannel)).send({embeds:[
                new MessageEmbed().setAuthor({ name: member2.user.tag, iconURL: member1.displayAvatarURL() })
                .setTitle('Zmiana avatara').addField('Użytkownik', member2.toString()).setColor('92d2e2')
                .setThumbnail(member2.displayAvatarURL({ format: 'png', size: 256, dynamic: true })).setTimestamp()
            ]});
        }
    }
}