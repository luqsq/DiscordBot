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

        const embed = getEmbed(msg.member).setTitle('Komendy - Moderacja').setColor('990000');

        client.commands.filter(cmd => cmd.type == 'moderation' && !cmd.hidden).forEach(cmd => {
            let usage = '', aliases = '';
            if(cmd.usage != undefined) usage = ' ' + cmd.usage;
            if(cmd.aliases != undefined) aliases = '\nAliasy: ' + cmd.aliases.join(', ');
            embed.addField(client.prefix + cmd.name + usage, cmd.desc + aliases);
        });

        msg.channel.send({embeds:[embed]});

    }
}