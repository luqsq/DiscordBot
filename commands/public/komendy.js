const { getEmbed } = require('../../utils.js');
const { crewId } = require('../../config.js');

module.exports = {
    name: 'komendy',
    hidden: true,
    run: (msg, args, client) => {

        const embed = getEmbed(msg.member).setTitle('Komendy')
            .setThumbnail(client.user.displayAvatarURL({ format: 'png', size: 64 }));

        client.commands.filter(cmd => cmd.type == 'public' && !cmd.hidden).forEach(cmd => {
            embed.addField(client.prefix + cmd.name + (cmd.usage == undefined ? '' : ' ' + cmd.usage), cmd.desc);
        });

        if(msg.guildId != crewId) return msg.channel.send({embeds:[embed]});

        const embedCrew = getEmbed(msg.member).setTitle('Komendy - Discord Administracji').setColor('ff3333');

        client.commands.filter(cmd => cmd.type == 'crew' && !cmd.hidden).forEach(cmd => {
            embedCrew.addField(client.prefix + cmd.name + (cmd.usage == undefined ? '' : ' ' + cmd.usage), cmd.desc);
        });

        msg.channel.send({embeds:[embed, embedCrew]});

    }
}