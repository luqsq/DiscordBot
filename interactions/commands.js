const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const { getEmbed } = require('../utils.js');

module.exports = {
    name: 'commands',
    run: (ia, args, client) => {
        
        const userId = ia.user.id;
        if(args[1] != userId) return ia.reply({
            content: `Tylko <@${userId}> może tego użyć.`,
            ephemeral: true
        });

        const cmds = client.commands.filter(cmd => cmd.type == args[0] && !cmd.hidden);
        
        let page = 1;
        if(!isNaN(args[2])) page = parseInt(args[2]);

        const pages = Math.ceil(cmds.size/7);

        if(page > pages) page = pages;
        if(page < pages) page = 1;
        
        let embed, style;
        switch(args[0]) {
            case 'moderation':
                embed = getEmbed(ia.member).setTitle('Komendy - Moderacja').setColor('990000');
                style = 4;
                break;
            case 'sponsor':
                embed = getEmbed(ia.member).setTitle('Komendy - Sponsorzy+').setColor('ffbb33')
                .setThumbnail(client.user.displayAvatarURL({ format: 'png', size: 64 }));
                style = 2;
                break;
            default:
                embed = getEmbed(ia.member).setTitle('Komendy')
                .setThumbnail(client.user.displayAvatarURL({ format: 'png', size: 64 }));
                style = 1;
        }

        embed.setDescription(`Strona **${page}** z **${pages}**.`);

        const page7 = page*7;

        for(let i = page7-7; i < (page7 > cmds.size ? cmds.size : page7); i++) {
            const cmd = cmds.at(i);
            let usage = '', aliases = '';
            if(cmd.usage != undefined) usage = ' ' + cmd.usage;
            if(cmd.aliases != undefined) aliases = '\nAliasy: ' + cmd.aliases.join(', ');
            embed.addField(client.prefix + cmd.name + usage, cmd.desc + aliases);
        }

        const previous = new MessageButton().setCustomId(`commands_${args[0]}_${args[1]}_${page-1}`).setStyle(style).setEmoji('⬅️').setLabel('Poprzednia');
        const next = new MessageButton().setCustomId(`commands_${args[0]}_${args[1]}_${page+1}`).setStyle(style).setEmoji('➡️').setLabel('Następna');

        if(page <= 1) previous.setDisabled();
        if(page == pages) next.setDisabled();

        ia.update({embeds:[embed],components:[new MessageActionRow().setComponents(previous, next)]});

    }
}