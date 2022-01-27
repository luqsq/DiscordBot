const { tempban } = require('../../permissions.js');
const { getTime, sendModError } = require('../../utils.js');
const { modLogChannel, maxBanTime } = require('../../config.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'tempban',
    aliases: ['tban'],
    usage: '<@nick|id> <czas> <powód>',
    desc: 'Banuje użytkownika na podany czas.',
    run: async (msg, args, client, mysql) => {
        
        if(!tempban.includes(msg.member.roles.highest.id)) return msg.channel.send('Nie masz uprawnień.');

        if(args.length < 2) return sendModError(msg, 'Niepoprawne użycie komendy.');

        let user;
        try {
            user = await client.users.fetch(args[0]);
        }
        catch(e) {
            user = msg.mentions.users.first();
        }

        if(user == undefined) return sendModError(msg, 'Nie znaleziono użytkownika.');
        if(!args[0].includes(user.id)) return sendModError(msg, 'Nie znaleziono użytkownika.');

        try {
            const ban = await msg.guild.bans.fetch({ user: user.id, force: true, cache: false });
            if(ban) return sendModError(msg, 'Ten użytkownik jest już zbanowany.');
        }
        catch(e) {}

        const time = getTime(args[1]);
        if(!time) return sendModError(msg, 'Niepoprawny format czasu.');

        if(time.time > maxBanTime * 86400) return sendModError(msg, `Maksymalny czas bana to **${maxBanTime} dni**.`);

        const reason = args.slice(2).join(' ');

        const now = Math.floor(Date.now() / 1000);
        const duration = now+time.time;

        await mysql.execute(`INSERT INTO punishments VALUES (NULL, '${user.id}', '${msg.author.id}', 'tempban_active', ${duration}, ?, ${now})`, [reason]);
        client.tempbans.set(user.id, duration * 1000);

        try {
            await user.send({embeds:[
                new MessageEmbed().setColor('dd3333').setTitle('Zostałeś zbanowany!')
                    .setFooter({ text: 'Crafted.pl', iconURL: client.user.avatarURL() }).setTimestamp()
                    .addField('Moderator', msg.author.tag).addField('Czas', time.text).addField('Powód', reason)
            ]});
        }
        catch(e) {
            console.log(`Nie mozna wyslac wiadomosci do ${user.tag}.`);
        }

        try {
            msg.guild.bans.create(user, {reason:reason});
        }
        catch(e) {
            console.log(e);
        }

        (await client.channels.fetch(modLogChannel)).send({embeds:[
            new MessageEmbed().setColor('dd3333').setTitle('Zbanowano użytkownika')
                .setThumbnail(user.displayAvatarURL({ format: 'png', size: 256, dynamic: true }))
                .addField('Moderator', msg.author.tag).addField('Użytkownik', user.tag)
                .addField('Czas', time.text).addField('Powód', reason).setTimestamp()
        ]});

        //msg.react('384327732005306368');

    }
}