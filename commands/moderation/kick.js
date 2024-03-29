const { kick } = require('../../permissions.js');
const { getPermLvl, sendModError } = require('../../utils.js');
const { modLogChannel } = require('../../config.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'kick',
    usage: '<@nick|id> <powód>',
    desc: 'Wyrzuca użytkownika z serwera.',
    run: async (msg, args, client, mysql) => {
        
        if(getPermLvl(msg.member.roles.cache) < kick) return msg.channel.send('Nie masz uprawnień.');

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

        if(!member.moderatable) return sendModError(msg, 'Nie można wyrzucić tego użytkownika.');

        const reason = args.slice(1).join(' ');

        await mysql.query(`INSERT INTO punishments VALUES (NULL, '${member.id}', '${msg.author.id}', 'kick', 0, ?, ${Math.floor(Date.now() / 1000)})`, [reason]);

        try {
            await member.send({embeds:[
                new MessageEmbed().setColor('dd9922').setTitle('Zostałeś wyrzucony!')
                    .setFooter({ text: 'Crafted.pl', iconURL: client.user.avatarURL() })
                    .addField('Moderator', msg.author.tag)
                    .addField('Powód', reason).setTimestamp()
            ]});
        }
        catch(e) {
            console.log(`Nie mozna wyslac wiadomosci do ${member.user.tag}.`);
        }

        try {
            member.kick(reason);
        }
        catch(e) {
            console.log(e);
        }

        (await client.channels.fetch(modLogChannel)).send({embeds:[
            new MessageEmbed().setColor('dd9922').setTitle('Wyrzucono użytkownika')
                .setThumbnail(member.displayAvatarURL({ format: 'png', size: 256, dynamic: true }))
                .addField('Moderator', msg.author.tag).addField('Użytkownik', member.user.tag)
                .addField('Powód', reason).setTimestamp()
        ]});

        msg.react('384327732005306368');

    }
}