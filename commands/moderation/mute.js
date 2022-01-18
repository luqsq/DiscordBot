const { mute } = require('../../permissions.js');
const { getTime, sendModError } = require('../../utils.js');
const { modLogChannel, maxMuteTime } = require('../../config.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'mute',
    usage: '<@nick|id> <czas> <powód>',
    desc: 'Wycisza użytkownika na podany czas.',
    run: async (msg, args, client, mysql) => {
        
        if(!mute.includes(msg.member.roles.highest.id)) return msg.channel.send('Nie masz uprawnień.');

        if(args.length < 3) return sendModError(msg, 'Niepoprawne użycie komendy.');

        let member;
        try {
            member = await msg.guild.members.fetch(args[0]);
        }
        catch(e) {
            member = msg.mentions.members.first();
        }

        if(member == undefined) return sendModError(msg, 'Nie znaleziono użytkownika.');
        if(!args[0].includes(member.id)) return sendModError(msg, 'Nie znaleziono użytkownika.');

        if(!member.moderatable) return sendModError(msg, 'Nie można wyciszyć tego użytkownika.');

        let now = Date.now();
        if(now < member.communicationDisabledUntilTimestamp) return sendModError(msg, 'Ten użytkownik jest już wyciszony.');
        
        const time = getTime(args[1]);
        if(!time) return sendModError(msg, 'Niepoprawny format czasu.');

        if(time.time > maxMuteTime * 86400) return sendModError(msg, `Maksymalny czas wyciszenia to **${maxMuteTime} dni**.`);

        const reason = args.slice(2).join(' ');

        try {
            await member.send({embeds:[
                new MessageEmbed().setColor('0088ff').setTitle('Zostałeś wyciszony!')
                    .setFooter({ text: 'Crafted.pl', iconURL: client.user.avatarURL() })
                    .addField('Moderator', msg.author.tag).addField('Czas', time.text)
                    .addField('Powód', reason).setTimestamp()
            ]});
        }
        catch(e) {
            console.log(`Nie mozna wyslac wiadomosci do ${member.user.tag}.`);
        }

        try {
            await member.timeout(time.time * 1000, reason);
        }
        catch(e) {
            console.log(e);
        }

        now = Math.floor(now / 1000);
        await mysql.execute(`INSERT INTO punishments VALUES (NULL, '${member.id}', '${msg.author.id}', 'mute', ${now+time.time}, ?, ${now})`, [reason]);

        (await client.channels.fetch(modLogChannel)).send({embeds:[
            new MessageEmbed().setColor('0088ff').setTitle('Wyciszono użytkownika')
                .setThumbnail(member.displayAvatarURL({ format: 'png', size: 256, dynamic: true }))
                .addField('Moderator', msg.author.tag).addField('Użytkownik', member.user.tag)
                .addField('Czas', time.text).addField('Powód', reason).setTimestamp()
        ]});

        msg.react('384327732005306368');

    }
}