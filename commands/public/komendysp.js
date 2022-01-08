const { getEmbed } = require('../../utils.js');

module.exports = {
    name: 'komendysp',
    desc: 'Lista komend Sponsorów+.',
    run: (msg, args, client) => {

        const embed = getEmbed(msg.member).setTitle('Komendy - Sponsorzy+').setColor('ffbb33')
            .setThumbnail(client.user.displayAvatarURL({ format: 'png', size: 64 }));

        client.commands.filter(cmd => cmd.type == 'sponsor').forEach(cmd => {
            embed.addField(client.prefix + cmd.name + (cmd.usage == undefined ? '' : ' ' + cmd.usage), cmd.desc);
        });

        if(embed.fields.length == 0) embed.addField('Trochę tu pusto...', 'Żaden Sponsor+ nie ma swojej komendy!');

        msg.channel.send({embeds:[embed]});

    }
}