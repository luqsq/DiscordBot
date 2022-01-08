const { getEmbed, getTable, getRequiredExp } = require('../../utils.js');

const f = n => n > 9 ? n : '0' + n ;

module.exports = {
    name: 'info',
    usage: '[@nick|id]',
    desc: 'Wyświetla informacje o użytkowniku.',
    run: async (msg, args, client, mysql) => {
        if(args.length > 1) {
            msg.channel.send(`Za dużo argumentów.\nUżycie: \`${client.prefix}wiadomosci [@nick|id]\``);
            return;
        }
        const table = getTable(msg.guildId);
        if(!table) return;
        let member;
        try {
            if(args.length == 0) member = msg.member;
            else member = msg.mentions.members.first() || await msg.guild.members.fetch(args[0]);
        }
        catch(e) {
            msg.channel.send(`Nie znaleziono takiego użytkownika.\nUżycie: \`${client.prefix}wiadomosci [@nick|id]\``);
            return;
        }
        const [result] = await mysql.execute(`SELECT exp, level, msgs_total, win_days FROM ${table}_users WHERE user_id = '${member.id}'`);
        if(result.length == 0) return msg.channel.send('Brak danych o użytkowniku.');
        const user = member.user;
        let exp = result[0].exp;
        for(let i = 0; i < result[0].level; i++) exp += getRequiredExp(i);
        const c = user.createdAt;
        const j = member.joinedAt;
        msg.channel.send({embeds:[
            getEmbed(msg.member).setAuthor({name: user.username, iconURL: member.displayAvatarURL({dynamic:true})})
            .setTitle('Informacje o użytkowniku')
            .addField('📋  Nick', user.tag, true)
            .addField('🪄  Pseudonim', member.displayName, true)
            .addField('📰  ID', user.id, true)
            .addField('⌛  Konto utworzone', `${f(c.getDate())}.${f(c.getMonth()+1)}.${c.getFullYear()} ${f(c.getHours())}:${f(c.getMinutes())}`, true)
            .addField('🕙  Dołączono', `${f(j.getDate())}.${f(j.getMonth()+1)}.${j.getFullYear()} ${f(j.getHours())}:${f(j.getMinutes())}`, true)
            .addField('⭐  EXP (łącznie)', exp.toString(), true)
            .addField('💡  Poziom', result[0].level.toString(), true)
            .addField('📨  Wiadomości', result[0].msgs_total.toString(), true)
            .addField('🥇  Wygrane dni', result[0].win_days.toString(), true)
        ]});
    }
}