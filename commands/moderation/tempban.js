const { tempban } = require('../../permissions.js');
const { getTime, sendModError } = require('../../utils.js');
const { modLogChannel, maxBanTime } = require('../../config.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'tempban',
    aliases: ['tban'],
    usage: '[-s] <@nick|id> <czas> <powód>',
    desc: 'Banuje użytkownika na podany czas.',
    run: async (msg, args, client, mysql) => {
        
        if(!tempban.includes(msg.member.roles.highest.id)) return msg.channel.send('Nie masz uprawnień.');

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

        const time = getTime(args[1]);
        if(!time) return sendModError(msg, 'Niepoprawny format czasu.');

        if(time.time > maxBanTime * 86400) return sendModError(msg, `Maksymalny czas bana to **${maxBanTime} dni**.`);

        const reason = args.slice(2).join(' ');

        const now = Math.floor(Date.now() / 1000);
        const duration = now+time.time;

        await mysql.execute(`INSERT INTO punishments VALUES (NULL, '${member.id}', '${msg.author.id}', 'tempban_active', ${duration}, ?, ${now})`, [reason]);
        client.tempbans.set(member.id, duration * 1000);

        try {
            await member.send({embeds:[
                new MessageEmbed().setColor('dd3333').setTitle('Zostałeś zbanowany!')
                    .setFooter({ text: 'Crafted.pl', iconURL: client.user.avatarURL() }).setTimestamp()
                    .addField('Moderator', msg.author.tag).addField('Czas', time.text).addField('Powód', reason)
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
                .addField('Czas', time.text).addField('Powód', reason).setTimestamp()
        ]});

        msg.react('384327732005306368');

    }
}