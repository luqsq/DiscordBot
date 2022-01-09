const { publicId } = require('../config.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
    event: 'messageCreate',
    run: async (client, mysql, msg) => {
        if(msg.guildId != publicId) return;
        if(!msg.content.includes('discord.gg/')) return;
        await msg.delete();
        msg.channel.send({embeds:[
            new MessageEmbed().setColor('ee3333').setTimestamp()
            .setAuthor({name: msg.author.username, iconURL: msg.member.displayAvatarURL()})
            .setDescription('Wysyłanie zaproszeń jest niedozwolone!')
        ]});
    }
}