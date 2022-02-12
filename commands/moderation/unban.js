const { unban } = require('../../permissions.js');
const { getPermLvl, sendModError } = require('../../utils.js');
const { modLogChannel } = require('../../config.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'unban',
    usage: '<nick#tag|id> <powód>',
    desc: 'Odbanowuje danego użytkownika.',
    run: async (msg, args, client, mysql) => {

        if(getPermLvl(msg.member.roles.cache) < unban) return msg.channel.send('Nie masz uprawnień.');

        if(args.length < 2) return sendModError(msg, 'Niepoprawne użycie komendy.');

        let ban, reason;
        try {
            ban = await msg.guild.bans.fetch(args[0]);
            reason = args.slice(1).join(' ');
        }
        catch(e) {
            const str = args.join(' ');

            if(!str.match(/#[0-9][0-9][0-9][0-9] /)) return sendModError(msg, 'Nie podano nazwy (**Nick#tag**) ani zbanowanego **ID**.');
            
            const tag = str.substr(0, str.lastIndexOf('#') + 5).trim();
            reason = str.slice(tag.length).trim();

            ban = (await msg.guild.bans.fetch()).find(b => b.user.tag == tag);
        }

        if(ban == undefined) return sendModError(msg, 'Nie znaleziono zbanowanego użytkownika.');

        const { user } = ban;

        try {
            await msg.guild.members.unban(user.id, reason);
        }
        catch(e) {
            return sendModError(msg, 'Użytkownik nie jest zbanowany.');
        }

        try {
            await user.send({embeds:[
                new MessageEmbed().setColor('33dd33').setTitle('Zostałeś odbanowany!')
                    .setFooter({ text: 'Crafted.pl', iconURL: client.user.avatarURL() })
                    .addField('Moderator', msg.author.tag)
                    .addField('Powód', reason).setTimestamp()
            ]});
        }
        catch(e) {
            console.log(`Nie mozna wyslac wiadomosci do ${user.tag}.`);
        }

        await mysql.execute(`INSERT INTO punishments VALUES (NULL, '${user.id}', '${msg.author.id}', 'unban', 0, ?, ${Math.floor(Date.now() / 1000)})`, [reason]);
        await mysql.execute(`UPDATE punishments SET action = 'tempban' WHERE action = 'tempban_active' AND user_id = '${user.id}'`);

        client.tempbans.delete(user.id);

        (await client.channels.fetch(modLogChannel)).send({embeds:[
            new MessageEmbed().setColor('33dd33').setTitle('Odbanowano użytkownika')
                .setThumbnail(user.displayAvatarURL({ format: 'png', size: 256, dynamic: true }))
                .addField('Moderator', msg.author.tag).addField('Użytkownik', user.tag)
                .addField('Powód', reason).setTimestamp()
        ]});

        msg.react('384327732005306368');

    }
}