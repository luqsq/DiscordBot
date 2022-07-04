const { ban } = require('../../permissions.js');
const { getPermLvl, sendModError } = require('../../utils.js');
const { modLogChannel } = require('../../config.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'ban',
    usage: '<@nick|id> <powód>',
    desc: 'Permanentnie banuje użytkownika.',
    run: async (msg, args, client, mysql) => {
        
        if(getPermLvl(msg.member.roles.cache) < ban) return msg.channel.send('Nie masz uprawnień.');

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

        const reason = args.slice(1).join(' ');

        await mysql.query(`INSERT INTO punishments VALUES (NULL, '${user.id}', '${msg.author.id}', 'ban', 0, ?, ${Math.floor(Date.now() / 1000)})`, [reason]);

        try {
            await user.send({embeds:[
                new MessageEmbed().setColor('dd3333').setTitle('Zostałeś zbanowany!')
                    .setFooter({ text: 'Crafted.pl', iconURL: client.user.avatarURL() }).setTimestamp()
                    .addField('Moderator', msg.author.tag).addField('Czas', 'Na zawsze').addField('Powód', reason)
                    .addField('Jak dostać UnBana?', 'Możesz złożyć prośbę [na forum](https://crafted.pl/forum/60-prosby-o-unban/).')
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
                .addField('Czas', 'Na zawsze').addField('Powód', reason).setTimestamp()
        ]});

        msg.react('384327732005306368');

    }
}