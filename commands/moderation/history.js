const { history } = require('../../permissions.js');
const { modChannel } = require('../../config.js');
const { getPermLvl, getEmbed, format } = require('../../utils.js');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: 'history',
    aliases: ['hist'],
    usage: '<@nick|id> [strona]',
    desc: 'Wyświetla historię kar użytkownika.',
    run: async (msg, args, client, mysql) => {
        
        if(msg.channel.id != modChannel) return;

        if(getPermLvl(msg.member.roles.cache) < history) return msg.channel.send('Nie masz uprawnień.');

        if(args.length == 0) return msg.channel.send('Nie podano użytkownika.');

        let user;
        try {
            user = await client.users.fetch(args[0]);
        }
        catch(e) {
            user = msg.mentions.users.first();
        }

        if(user == undefined) return msg.channel.send('Nie znaleziono użytkownika.');
        if(!args[0].includes(user.id)) return msg.channel.send('Nie znaleziono użytkownika.');

        let page = parseInt(args[1]);
        if(!page) page = 1;

        const [total] = await mysql.query(`SELECT COUNT(id) AS count FROM punishments WHERE user_id = '${user.id}'`);
        const pages = Math.ceil(total[0].count/5);

        if(page > pages) page = pages;
        if(page < 1) page = 1;
        
        const embed = getEmbed(msg.member).setTitle(`Historia kar - ${user.tag}`);
        
        if(pages == 0) {
            embed.setDescription('Nie znaleziono żadnych kar.');
            msg.channel.send({embeds:[embed]});
            return;
        }
        else embed.setDescription(`Strona **${page}** z **${pages}**.`);
        
        const [result] = await mysql.query(`SELECT * FROM punishments WHERE user_id = '${user.id}' ORDER BY time DESC LIMIT ${(page-1)*5}, 5`);

        for(let i = 0; i < result.length; i++)
            embed.addField(`[#${result[i].id}] ${format(new Date(result[i].time*1000))} - ${result[i].action == 'tempban_active' ? 'tempban' : result[i].action}`,
                `**Moderator:** ${(await client.users.fetch(result[i].admin_id)).tag}\n${result[i].duration == 0 ? '' : `**Koniec kary:** ${format(new Date(result[i].duration*1000))}\n`}**Powód:** ${result[i].reason}`);

        const previous = new MessageButton().setCustomId(`history_${msg.author.id}_${user.id}_${page-1}`).setStyle(1).setEmoji('⬅️').setLabel('Poprzednia');
        const next = new MessageButton().setCustomId(`history_${msg.author.id}_${user.id}_${page+1}`).setStyle(1).setEmoji('➡️').setLabel('Następna');

        if(page == 1) previous.setDisabled(true);
        if(page >= pages) next.setDisabled(true);

        msg.channel.send({embeds:[embed],components:[new MessageActionRow().setComponents(previous, next)]});

    }
}