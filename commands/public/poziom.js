const { getEmbed, getTable, getRequiredExp } = require('../../utils.js');

module.exports = {
    name: 'poziom',
    aliases: ['lvl', 'rank'],
    usage: '[@nick|id]',
    desc: 'Wyświetla informacje o poziomie użytkownika.',
    run: async (msg, args, client, mysql) => {
        let user;
        if(args.length == 0) user = msg.author;
        else try {
            user = msg.mentions.users.first() || await client.users.fetch(args[0]);
        }
        catch(e) {
            msg.channel.send(`Nie znaleziono takiego użytkownika.\nUżycie: \`${client.prefix}poziom [@nick|id]\``);
            return;
        }
        const table = getTable(msg.guildId);
        if(!table) return;
        const [result] = await mysql.execute(`SELECT exp, level FROM ${table}_users WHERE user_id = '${user.id}'`);
        if(result.length == 0) return msg.channel.send(`Brak danych o użytkowniku.`);
        const requiredExp = getRequiredExp(result[0].level);
        let progress = '🟪'.repeat(Math.floor(result[0].exp/requiredExp*15));
        progress += '⬜'.repeat(15 - progress.length/2);
        const [users] = await mysql.execute(`SELECT user_id FROM ${table}_users WHERE level > ${result[0].level} || (level = ${result[0].level} && exp > ${result[0].exp})`);
        for(let i = 0; i < users.length; i++) users[i] = users[i].user_id;
        const members = await msg.guild.members.fetch({ user: users });
        msg.channel.send({embeds:[
            getEmbed(msg.member)
            .setAuthor({name: user.username, iconURL: (await msg.guild.members.fetch(user.id)).displayAvatarURL({dynamic:true})})
            .addField('Poziom', result[0].level.toString(), true)
            .addField('Exp', `${result[0].exp} / ${requiredExp}`, true)
            .addField('Miejsce', `#${members.size + 1}`, true)
            .addField('Postęp', `${progress}\n\nDo kolejnego poziomu pozostało **${requiredExp - result[0].exp}** expa!\n`, false)
        ]});
    }
}