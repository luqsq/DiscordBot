const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { supportLogChannel } = require('../config.js');
const { format } = require('../utils.js');

module.exports = {
    name: 'close-ticket',
    run: async (ia, args, client, mysql) => {
        ia.update({components: [
            new MessageActionRow().setComponents(
                new MessageButton().setCustomId('null').setStyle(2).setEmoji('🔒')
                .setLabel('Zamykanie zgłoszenia...').setDisabled()
            )
        ]});
        const chn = ia.channel;
        let msg = (await chn.send(`Zgłoszenie zostało zamknięte przez ${ia.member.toString()}.`)).id;
        const id = chn.topic.slice(1);
        let text = '';
        while(true) {
            const msgs = await chn.messages.fetch({ limit: 100, before: msg, cache: false, force: true });
            msgs.forEach(m => { text = `<b>[${m.author.tag}]:</b> ${m.content}\n<br>\n` + text; });
            msg = msgs.last().id;
            if(msgs.size < 100) break;
        }
        text = text.slice(text.indexOf('<br>\n') + 5, -6);
        text = text.slice(text.indexOf('<br>\n') + 5);
        writeFileSync(`/home/discordbot/supportchat/${id}.html`, text);
        await mysql.execute(`UPDATE tickets SET end_timestamp = ${parseInt(Date.now()/1000)} WHERE id = ${id}`);
        const [result] = await mysql.execute(`SELECT user_id, admin_id, start_timestamp FROM tickets WHERE id = ${id}`);
        const supporter = result[0].admin_id ? `**${(await client.users.fetch(result[0].admin_id)).tag}**\n*(ID: ${result[0].admin_id})*` : '*Brak*';
        (await client.channels.fetch(supportLogChannel)).send({embeds:[
            new MessageEmbed().setTitle('Zgłoszenie zamknięte')
            .addField('Autor zgłoszenia', `**${(await client.users.fetch(result[0].user_id)).tag}**\n*(ID: ${result[0].user_id})*`)
            .addField('Pomocnik', supporter).addField('Zamknięte przez', `**${ia.user.tag}**\n*(ID: ${ia.user.id})*`)
            .addField('Otwarto', format(new Date(result[0].start_timestamp*1000)))
            .addField('Zamknięto', format(new Date()))
            .addField('ID zgłoszenia', `#${id}`).setColor('aa8dd7').setTimestamp()
        ]});
        chn.delete();
    }
}
