const { MessageActionRow, MessageButton } = require('discord.js');
const { getEmbed } = require('../../utils.js');

module.exports = {
    name: 'komendysp',
    desc: 'Lista komend Sponsorów+.',
    run: (msg, args, client) => {

        const cmds = client.commands.filter(cmd => cmd.type == 'sponsor' && !cmd.hidden);
        
        let page = 1;
        if(!isNaN(args[0])) page = parseInt(args[0]);

        const pages = Math.ceil(cmds.size/7);

        if(page > pages) page = pages;
        if(page < pages) page = 1;
        
        const embed = getEmbed(msg.member).setTitle('Komendy - Sponsorzy+').setColor('ffbb33')
            .setThumbnail(client.user.displayAvatarURL({ format: 'png', size: 64 }));

        let page7 = page*7;
        if(page7 == 0) page7 = 7;

        for(let i = page7-7; i < (page7 > cmds.size ? cmds.size : page7); i++) {
            const cmd = cmds.at(i);
            let usage = '', aliases = '';
            if(cmd.usage != undefined) usage = ' ' + cmd.usage;
            if(cmd.aliases != undefined) aliases = '\nAliasy: ' + cmd.aliases.join(', ');
            embed.addField(client.prefix + cmd.name + usage, cmd.desc + aliases);
        }

        if(embed.fields.length == 0) {
            embed.addField('Trochę tu pusto...', 'Żaden Sponsor+ nie ma swojej komendy!');
            msg.channel.send({embeds:[embed]});
            return;
        }
        
        embed.setDescription(`Strona **${page}** z **${pages}**.`);

        const previous = new MessageButton().setCustomId(`commands_sponsor_${msg.author.id}_${page-1}`).setStyle(2).setEmoji('⬅️').setLabel('Poprzednia');
        const next = new MessageButton().setCustomId(`commands_sponsor_${msg.author.id}_${page+1}`).setStyle(2).setEmoji('➡️').setLabel('Następna');

        if(page <= 1) previous.setDisabled();
        if(page >= pages) next.setDisabled();

        msg.channel.send({embeds:[embed],components:[new MessageActionRow().setComponents(previous, next)]});

    }
}