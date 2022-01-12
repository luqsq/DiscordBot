const { ban } = require('../../permissions.js');
const { sendModError } = require('../../utils.js');
const { modLogChannel } = require('../../config.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'ban',
    usage: '[-s] <@nick|id> <powód>',
    desc: 'Permanentnie banuje użytkownika.',
    run: async (msg, args, client, mysql) => {
        
        if(!ban.includes(msg.member.roles.highest.id)) return msg.channel.send('Nie masz uprawnień.');

        const silent = args.indexOf('-s');
        if(silent != -1) args.splice(silent, 1);

        if(args.length < 2) return sendModError(msg, 'Niepoprawne użycie komendy.');

        let member;
        try {
            member = await msg.guild.members.fetch(args[0]);
        }
        catch(e) {
            member = msg.mentions.members.first();
        }

        if(member == undefined) return sendModError(msg, 'Nie znaleziono użytkownika.');
        if(!args[0].includes(member.id)) return sendModError(msg, 'Nie znaleziono użytkownika.');

        if(!member.moderatable) return sendModError(msg, 'Nie można zbanować tego użytkownika.');

        const reason = args.slice(1).join(' ');

        await mysql.execute(`INSERT INTO punishments VALUES (NULL, '${member.id}', '${msg.author.id}', 'ban', 0, ?, ${Math.floor(Date.now() / 1000)})`, [reason]);

        try {
            await member.send({embeds:[
                new MessageEmbed().setColor('dd3333').setTitle('Zostałeś zbanowany!')
                    .setFooter({ text: 'Crafted.pl', iconURL: client.user.avatarURL() }).setTimestamp()
                    .addField('Moderator', msg.author.tag).addField('Czas', 'Na zawsze').addField('Powód', reason)
                    .addField('Jak dostać UnBana?', 'Możesz złożyć prośbę [na forum](https://crafted.pl/forum/60-prosby-o-unban/).')
            ]});
        }
        catch(e) {
            console.log(`Nie mozna wyslac wiadomosci do ${member.user.tag}.`);
        }

        try {
            member.ban({reason:reason});
        }
        catch(e) {
            console.log(e);
        }

        if(silent == -1) (await client.channels.fetch(modLogChannel)).send({embeds:[
            new MessageEmbed().setColor('dd3333').setTitle('Zbanowano użytkownika')
                .setThumbnail(member.displayAvatarURL({ format: 'png', size: 256, dynamic: true }))
                .addField('Moderator', msg.author.tag).addField('Użytkownik', member.user.tag)
                .addField('Czas', 'Na zawsze').addField('Powód', reason).setTimestamp()
        ]});

        msg.react('930194912635400192');

    }
}