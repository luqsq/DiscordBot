const { getTable, getEmbed } = require('../../utils.js');

module.exports = {
    name: 'topspammers',
    desc: 'Wyświetla ranking wygranych dni.',
    run: async (msg, args, client, mysql) => {
        const table = getTable(msg.guildId);
        if(!table) return;
        const [result] = await mysql.query(`SELECT user_id, win_days FROM ${table}_users ORDER BY win_days DESC`);
        const embed = getEmbed(msg.member).setTitle('Top 10 - Wygrane dni').setThumbnail('https://cdn.discordapp.com/attachments/358652188706340866/460833150092836874/580b585b2edbce24c47b2af5.png');
        for(let i = 0; embed.fields.length < 10 && i < result.length; i++) {
            let member;
            try {
                member = await msg.guild.members.fetch(result[i].user_id);
            }
            catch(e) {
                continue;
            }
            embed.addField(`${embed.fields.length+1}. ${member.user.username}`, `Dni: **${result[i].win_days}**`);
        }
        msg.channel.send({embeds:[embed]});
    }
}