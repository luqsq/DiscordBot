const { history } = require('../permissions.js');
const { getEmbed, format } = require('../utils.js');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: 'history',
    run: async (ia, args, client, mysql) => {

        if(!history.includes(ia.member.roles.highest.id)) return ia.reply({
            content: 'Nie masz uprawnień.',
            ephemeral: true
        });

        if(ia.user.id != args[0]) return ia.reply({
            content: 'Nie możesz tego użyć.',
            ephemeral: true
        });

        const [total] = await mysql.execute(`SELECT COUNT(id) AS count FROM punishments WHERE user_id = '${args[1]}'`);
        const pages = Math.ceil(total[0].count/5);
        const page = parseInt(args[2]);

        const user = await client.users.fetch(args[1]);
        const embed = getEmbed(ia.member).setTitle(`Historia kar - ${user.tag}`);
        
        if(pages == 0) {
            embed.setDescription('Nie znaleziono żadnych kar.');
            await ia.update({embeds:[embed],components:[]});
            return;
        }
        else embed.setDescription(`Strona **${page}** z **${pages}**.`);
        
        const [result] = await mysql.execute(`SELECT * FROM punishments WHERE user_id = '${args[1]}' ORDER BY time DESC LIMIT ${(page-1)*5}, 5`);

        for(let i = 0; i < result.length; i++)
            embed.addField(`[#${result[i].id}] ${format(new Date(result[i].time*1000))} - ${result[i].action == 'tempban_active' ? 'tempban' : result[i].action}`,
                `**Moderator:** ${(await client.users.fetch(result[i].admin_id)).tag}\n${result[i].duration == 0 ? '' : `**Koniec kary:** ${format(new Date(result[i].duration*1000))}\n`}**Powód:** ${result[i].reason}`);

        const previous = new MessageButton().setCustomId(`history_${args[0]}_${args[1]}_${page-1}`).setStyle(1).setEmoji('⬅️').setLabel('Poprzednia');
        const next = new MessageButton().setCustomId(`history_${args[0]}_${args[1]}_${page+1}`).setStyle(1).setEmoji('➡️').setLabel('Następna');

        if(page == 1) previous.setDisabled(true);
        if(page >= pages) next.setDisabled(true);

        await ia.update({embeds:[embed],components:[new MessageActionRow().setComponents(previous, next)]});

    }
}