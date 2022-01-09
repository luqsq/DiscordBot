const { MessageEmbed } = require('discord.js');
const { publicRankingChannel, crewRankingChannel } = require('../config.js');

const ranking = async (client, mysql, channel, table) => {
    const [result] = await mysql.execute(`SELECT user_id, msgs_today FROM ${table}_users WHERE msgs_today > 0 ORDER BY msgs_today DESC`);
    const [data] = await mysql.execute(`SELECT SUM(msgs_today) AS sum, COUNT(msgs_today) AS users FROM ${table}_users WHERE msgs_today > 0`);
    let users = 0, desc = '';
    const top = [];
    const emoji = ['🥇', '🥈', '🥉', '🏅', '🏅'];
    for(let i = 0; users < 5 && i < result.length; i++) {
        let user;
        try {
            user = await client.users.fetch(result[i].user_id);
            top[users] = user.id;
        }
        catch(e) {
            continue;
        }
        desc += `${emoji[users]} **${user.username}** - ${result[i].msgs_today} / ${data[0].sum} wiadomości (${(result[i].msgs_today * 100 / data[0].sum).toFixed(2)}%)\n`;
        users++;
    }
    await mysql.execute(`UPDATE ${table}_users SET win_days = win_days + 1 WHERE user_id = '${top[0]}'`);
    return (await client.channels.fetch(channel)).send({embeds:[
        new MessageEmbed().setColor('ffff00')
        .addField('Ranking spamerów', `Podczas dzisiejszego dnia zostało wysłanych\n**${data[0].sum}** wiadomości od **${data[0].users}** użytkowników.`)
        .addField('Najlepsi spamerzy:', desc).setThumbnail('https://images.emojiterra.com/google/android-oreo/128px/1f3c5.png')
    ]});
}

module.exports = {
    schedule: '0 0 * * *',
    run: async (client, mysql) => {
        await ranking(client, mysql, publicRankingChannel, 'public');
        await ranking(client, mysql, crewRankingChannel, 'crew');
        await mysql.execute(`UPDATE crew_users, public_users SET crew_users.msgs_today = 0, public_users.msgs_today = 0`);
    }
}