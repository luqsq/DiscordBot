const { MessageActionRow, MessageButton } = require('discord.js');
const { getEmbed } = require('../../utils.js');
const { modChannel } = require('../../config.js');

module.exports = {
    name: 'komendymod',
    hidden: true,
    run: (msg, args, client) => {

        if(msg.channelId != modChannel) {
            msg.delete();
            return;
        }

        const cmds = client.commands.filter(cmd => cmd.type == 'moderation' && !cmd.hidden);
        
        let page = 1;
        if(!isNaN(args[0])) page = parseInt(args[0]);

        const pages = Math.ceil(cmds.size/7);

        if(page > pages) page = pages;
        if(page < pages) page = 1;
        
        const embed = getEmbed(msg.member).setTitle('Komendy - Moderacja').setDescription(`Strona **${page}** z **${pages}**.`).setColor('990000');

        const page7 = page*7;

        for(let i = page7-7; i < (page7 > cmds.size ? cmds.size : page7); i++) {
            const cmd = cmds.at(i);
            let usage = '', aliases = '';
            if(cmd.usage != undefined) usage = ' ' + cmd.usage;
            if(cmd.aliases != undefined) aliases = '\nAliasy: ' + cmd.aliases.join(', ');
            embed.addField(client.prefix + cmd.name + usage, cmd.desc + aliases);
        }

        const previous = new MessageButton().setCustomId(`commands_moderation_${msg.author.id}_${page-1}`).setStyle(4).setEmoji('⬅️').setLabel('Poprzednia');
        const next = new MessageButton().setCustomId(`commands_moderation_${msg.author.id}_${page+1}`).setStyle(4).setEmoji('➡️').setLabel('Następna');

        if(page <= 1) previous.setDisabled();
        if(page >= pages) next.setDisabled();

        msg.channel.send({embeds:[embed],components:[new MessageActionRow().setComponents(previous, next)]});

    }
}