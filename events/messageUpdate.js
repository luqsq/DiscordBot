const { MessageEmbed } = require('discord.js');
const { publicId, logChannel } = require('../config.js');

module.exports = {
    event: 'messageUpdate',
    run: async (client, mysql, msg1, msg2) => {
        if(msg1.guild.id != publicId) return;
        if(msg1.author.bot) return;
        if(msg1.content == msg2.content) return;
        (await client.channels.fetch(logChannel)).send({embeds:[
            new MessageEmbed().setAuthor({ name: msg2.author.tag, iconURL: msg2.member.displayAvatarURL() })
            .setTitle('Edytowano wiadomość').addField('Użytkownik', msg2.member.toString())
            .addField('Stara treść', msg1.content ? msg1.content : '*Pusta*')
            .addField('Nowa treść', msg2.content ? msg2.content : '*Pusta*')
            .addField('Kanał', `${msg2.channel.toString()} (#${msg2.channel.name})`).setColor('d3a13b').setTimestamp()
        ]});
    }
}