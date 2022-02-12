const { unmute } = require('../../permissions.js');
const { getPermLvl, sendModError } = require('../../utils.js');
const { modLogChannel } = require('../../config.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'unmute',
    usage: '<@nick|id> <powód>',
    desc: 'Odcisza danego użytkownika.',
    run: async (msg, args, client, mysql) => {

        if(getPermLvl(msg.member.roles.cache) < unmute) return msg.channel.send('Nie masz uprawnień.');

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

        if(!member.moderatable) return sendModError(msg, 'Nie można odciszyć tego użytkownika.');

        let now = Date.now();
        if(now > member.communicationDisabledUntilTimestamp) return sendModError(msg, 'Ten użytkownik nie jest wyciszony.');

        const reason = args.slice(1).join(' ');

        try {
            await member.send({embeds:[
                new MessageEmbed().setColor('33dd33').setTitle('Zostałeś odciszony!')
                    .setFooter({ text: 'Crafted.pl', iconURL: client.user.avatarURL() })
                    .addField('Moderator', msg.author.tag)
                    .addField('Powód', reason).setTimestamp()
            ]});
        }
        catch(e) {
            console.log(`Nie mozna wyslac wiadomosci do ${member.user.tag}.`);
        }

        try {
            await member.timeout(null, reason);
        }
        catch(e) {
            console.log(e);
        }

        now = Math.floor(now / 1000);
        await mysql.execute(`INSERT INTO punishments VALUES (NULL, '${member.id}', '${msg.author.id}', 'unmute', 0, ?, ${now})`, [reason]);

        (await client.channels.fetch(modLogChannel)).send({embeds:[
            new MessageEmbed().setColor('33dd33').setTitle('Odciszono użytkownika')
                .setThumbnail(member.displayAvatarURL({ format: 'png', size: 256, dynamic: true }))
                .addField('Moderator', msg.author.tag).addField('Użytkownik', member.user.tag)
                .addField('Powód', reason).setTimestamp()
        ]});

        msg.react('384327732005306368');

    }
}