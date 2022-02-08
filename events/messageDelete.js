const { MessageEmbed } = require('discord.js');
const { publicId, logChannel } = require('../config.js');

module.exports = {
    event: 'messageDelete',
    run: async (client, mysql, msg) => {
        if(msg.guild.id != publicId) return;
        (await client.channels.fetch(logChannel)).send({embeds:[
            new MessageEmbed().setAuthor({ name: msg.author.tag, iconURL: msg.member.displayAvatarURL() })
            .setTitle('Usunięto wiadomość').addField('Użytkownik', msg.member.toString())
            .addField('Treść', msg.content ? msg.content : '*Pusta*')
            .addField('Kanał', msg.channel.name).setColor('ca3333').setTimestamp()
        ]});
    }
}