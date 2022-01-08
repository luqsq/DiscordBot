const { getEmbed } = require('../../utils.js');

module.exports = {
    name: 'clear',
    hidden: true,
    run: async (msg, args, client) => {
        if(!msg.member.permissions.has('MANAGE_MESSAGES')) return msg.channel.send('Nie masz uprawnień.');
        if(!msg.guild.me.permissions.has('MANAGE_MESSAGES')) return msg.channel.send('Nie mam takich uprawnień.');
        if(args.length == 0) return msg.channel.send(`Nie podano ilości.\nUżycie: \`${client.prefix}clear <ilość>\``);
        const amount = parseInt(args[0]);
        if(isNaN(amount)) return msg.channel.send(`Niepoprawna ilość wiadomości.\nUżycie: \`${client.prefix}clear <ilość>\``);
        if(amount > 500)return msg.channel.send(`Możesz usunąć maksymalnie **500** wiadomości.`);
        await msg.channel.bulkDelete(amount+1);
        const clearMsg = await msg.channel.send({embeds:[
            getEmbed(msg.member).setTitle('Usuwanie wiadomości')
            .setDescription(`Usunięto **${amount}** ostatnich wiadomości`)
        ]});
        setTimeout(() => {
            if(clearMsg.deletable) clearMsg.delete();
        }, 3000);
    }
}