const { getEmbed } = require('../../utils.js');
const { crewId } = require('../../config.js');

module.exports = {
    name: 'komendy',
    hidden: true,
    run: (msg, args, client) => {

        const embed = getEmbed(msg.member).setTitle('Komendy')
            .setThumbnail(client.user.displayAvatarURL({ format: 'png', size: 64 }));

        client.commands.filter(cmd => cmd.type == 'public' && !cmd.hidden).forEach(cmd => {
            let usage = '', aliases = '';
            if(cmd.usage != undefined) usage = ' ' + cmd.usage;
            if(cmd.aliases != undefined) aliases = '\nAliasy: ' + cmd.aliases.join(', ');
            embed.addField(client.prefix + cmd.name + usage, cmd.desc + aliases);
        });

        if(msg.guildId != crewId) return msg.channel.send({embeds:[embed]});

        const embedCrew = getEmbed(msg.member).setTitle('Komendy - Discord Administracji').setColor('ff3333');

        client.commands.filter(cmd => cmd.type == 'crew' && !cmd.hidden).forEach(cmd => {
            let usage = '', aliases = '';
            if(cmd.usage != undefined) usage = ' ' + cmd.usage;
            if(cmd.aliases != undefined) aliases = '\nAliasy: ' + cmd.aliases.join(', ');
            embedCrew.addField(client.prefix + cmd.name + usage, cmd.desc + aliases);
        });

        msg.channel.send({embeds:[embed, embedCrew]});

    }
}