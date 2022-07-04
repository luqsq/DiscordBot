const { getEmbed, getTable } = require('../../utils.js');

module.exports = {
    name: 'wiadomosci',
    usage: '[@nick|id]',
    desc: 'Informacje o wysłanych wiadomościach.',
    run: async (msg, args, client, mysql) => {
        if(args.length > 1) {
            msg.channel.send(`Za dużo argumentów.\nUżycie: \`${client.prefix}wiadomosci [@nick|id]\``);
            return;
        }
        try {
            const table = getTable(msg.guildId);
            if(!table) return;
            let member;
            if(args.length == 0) member = msg.member;
            else member = msg.mentions.members.first() || await msg.guild.members.fetch(args[0]);
            const [result] = await mysql.query(`SELECT msgs_today, msgs_total FROM ${table}_users WHERE user_id = '${member.id}'`);
            let today = 0, total = 0;
            if(result.length == 1) {
                today = result[0].msgs_today;
                total = result[0].msgs_total;
            }
            msg.channel.send({embeds:[
                getEmbed(msg.member).setAuthor({name: member.user.username, iconURL: member.displayAvatarURL({dynamic:true})})
                .setTitle('Wiadomości użytkownika').addField('Dzisiejsze', today.toString(), true).addField('Wszystkie', total.toString(), true)
            ]});
        }
        catch(e) {
            msg.channel.send(`Nie znaleziono takiego użytkownika.\nUżycie: \`${client.prefix}wiadomosci [@nick|id]\``);
        }
    }
}