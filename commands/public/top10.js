const { getTable, getEmbed, getRequiredExp } = require('../../utils.js');

module.exports = {
    name: 'top10',
    desc: 'Wyświetla ranking doświadczenia.',
    run: async (msg, args, client, mysql) => {
        const table = getTable(msg.guildId);
        if(!table) return;
        const [result] = await mysql.query(`SELECT user_id, exp, level FROM ${table}_users ORDER BY level DESC, exp DESC`);
        const embed = getEmbed(msg.member).setTitle('Top 10 - Poziomy').setThumbnail('https://cdn.discordapp.com/attachments/358652188706340866/460833150092836874/580b585b2edbce24c47b2af5.png');
        for(let i = 0; embed.fields.length < 10 && i < result.length; i++) {
            let member;
            try {
                member = await msg.guild.members.fetch(result[i].user_id);
            }
            catch(e) {
                continue;
            }
            let exp = result[i].exp;
            for(let j = 0; j < result[i].level; j++) exp += getRequiredExp(j);
            embed.addField(`${embed.fields.length+1}. ${member.user.username}`, `Poziom: **${result[i].level}** (exp: ${exp})`);
        }
        msg.channel.send({embeds:[embed]});
    }
}