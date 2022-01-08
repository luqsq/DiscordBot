const { MessageEmbed } = require('discord.js');
const { crewId, publicId, lvlRoles } = require('../config.js');
const { getExp, getRequiredExp, getTable } = require('../utils.js');

module.exports = {
    event: 'messageCreate',
    run: async (client, mysql, msg) => {
        if(msg.author.bot) return;
        const table = getTable(msg.guildId);
        if(!table) return;
        const [row] = await mysql.execute(`SELECT exp, level, last_msg FROM ${table}_users WHERE user_id = '${msg.author.id}' LIMIT 1`);
        const now = Math.floor(Date.now()/1000);
        if(row.length == 1) {
            if(now - 60 < row[0].last_msg) {
                await mysql.execute(`UPDATE ${table}_users SET msgs_today = msgs_today + 1, msgs_total = msgs_total + 1 WHERE user_id = '${msg.author.id}'`);
                return;
            }
            let level = row[0].level;
            let exp = row[0].exp + getExp(msg.guildId, msg.member.roles.cache);
            const requiredExp = getRequiredExp(level);
            if(exp >= requiredExp) {
                level++;
                exp -= requiredExp;
                let info = '';
                const embed = new MessageEmbed()
                    .setAuthor({name: msg.author.username, iconURL: msg.member.displayAvatarURL({dynamic:true})})
                    .setColor('aa8dd7').setTimestamp();
                if(table == 'public' && lvlRoles[level] != undefined) {
                    msg.member.roles.remove(Object.values(lvlRoles));
                    msg.member.roles.add(lvlRoles[level]);
                    info = `\nOtrzymuje nową rangę: **${msg.guild.roles.cache.get(lvlRoles[level]).name}**`;
                    embed.setColor('ffd700');
                }
                embed.addField('Lvl Up!', `Użytkownik ${msg.author} awansował na poziom **${level}**!${info}`);
                msg.channel.send({embeds:[embed]});
            }
            await mysql.execute(`UPDATE ${table}_users SET exp = ${exp}, level = ${level}, last_msg = ${now}, msgs_today = msgs_today + 1, msgs_total = msgs_total + 1 WHERE user_id = '${msg.author.id}'`);
            return;
        }
        await mysql.execute(`INSERT INTO ${table}_users VALUES ('${msg.author.id}', ${getExp(msg.guildId, msg.member.roles.cache)}, 0, ${now}, 1, 1, 0)`);
    }
}